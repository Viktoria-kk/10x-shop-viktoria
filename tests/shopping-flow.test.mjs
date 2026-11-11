import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { createRequire } from 'node:module'
import test from 'node:test'
import ts from 'typescript'

// Executes the real modules and event handlers with controlled hooks, routing,
// fetch and storage. This is a logic harness, not a browser renderer.
const require = createRequire(import.meta.url)
const product = { id: 1, title: 'Test product', category: 'beauty', price: 9.99,
  discountPercentage: 10.48, stock: 5, rating: 4.5, thumbnail: 'test.webp',
  images: ['test.webp', 'second.webp'], description: 'Product description' }
const storage = () => {
  const values = new Map()
  return { getItem: key => values.get(key) ?? null, setItem: (key, value) => values.set(key, value), removeItem: key => values.delete(key) }
}

function harness() {
  globalThis.localStorage = storage()
  globalThis.sessionStorage = storage()
  globalThis.window = { confirm: () => true, location: { reload() {} } }
  const cache = new Map()
  const router = { location: { pathname: '/checkout', state: undefined }, params: { id: '1' }, visits: [] }
  let active
  const hooks = {
    createContext: value => ({ value, Provider: Symbol('Provider') }),
    useContext: context => context.value,
    useState(initial) {
      const instance = active, index = instance.index++
      if (!(index in instance.slots)) instance.slots[index] = typeof initial === 'function' ? initial() : initial
      return [instance.slots[index], value => { instance.slots[index] = typeof value === 'function' ? value(instance.slots[index]) : value }]
    },
    useRef(initial) { return hooks.useState(() => ({ current: initial }))[0] },
    useEffect(callback, dependencies) {
      const instance = active, index = instance.index++, previous = instance.slots[index]
      if (!previous || dependencies.some((value, i) => !Object.is(value, previous.dependencies[i]))) {
        instance.effects.push(() => { previous?.cleanup?.(); instance.slots[index] = { dependencies, cleanup: callback() } })
      }
    },
    Component: class { constructor(props) { this.props = props } },
  }
  const jsx = (type, props) => ({ type, props })
  const external = {
    react: hooks, 'react/jsx-runtime': { jsx, jsxs: jsx, Fragment: 'fragment' },
    'react-dom': { flushSync: callback => callback() },
    'react-router-dom': { Link: 'Link', NavLink: 'NavLink', Navigate: 'Navigate', Outlet: 'Outlet',
      useLocation: () => router.location, useParams: () => router.params,
      useNavigate: () => (to, options) => router.visits.push({ to, options }) },
  }
  function load(relative) {
    const filename = path.resolve(relative)
    if (cache.has(filename)) return cache.get(filename).exports
    const module = { exports: {} }
    cache.set(filename, module)
    const compiled = ts.transpileModule(fs.readFileSync(filename, 'utf8'), {
      compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX },
    }).outputText
    const resolve = name => {
      if (name in external) return external[name]
      if (!name.startsWith('.')) return require(name)
      const target = path.resolve(path.dirname(filename), name)
      const candidate = [target, target + '.tsx', target + '.ts'].find(file => fs.existsSync(file) && fs.statSync(file).isFile())
      assert.ok(candidate, `Resolve ${name}`)
      return load(candidate)
    }
    new Function('require', 'module', 'exports', compiled)(resolve, module, module.exports)
    return module.exports
  }
  function mount(Component, props = {}) {
    const instance = { slots: [], effects: [], index: 0 }
    return { render() {
      active = instance; instance.index = 0; instance.effects = []
      const result = Component(props)
      for (const effect of instance.effects) effect()
      return result
    } }
  }
  const authModule = load('src/context/AuthContext.tsx')
  const cartModule = load('src/context/CartContext.tsx')
  const cartContext = load('src/context/cart-context.ts').CartContext
  const auth = mount(authModule.AuthProvider, { children: null })
  const cart = mount(cartModule.CartProvider, { children: null })
  let authValue, cartValue
  function sync() {
    const authTree = auth.render()
    // AuthContext is private; provide its value through useContext's provider key.
    authValue = authTree.props.value
    const cartTree = cart.render()
    cartValue = cartTree.props.value
    cartContext.value = cartValue
    hooks.useContext = context => context === cartContext ? cartValue : authValue
  }
  function page(file, props) {
    const instance = mount(load(file).default, props)
    return () => { sync(); return instance.render() }
  }
  sync()
  return { load, mount, page, sync, router, auth: () => authValue, cart: () => cartValue }
}

function nodes(tree) {
  if (Array.isArray(tree)) return tree.flatMap(nodes)
  if (!tree || typeof tree !== 'object') return []
  return [tree, ...nodes(tree.props?.children)]
}
function content(tree) {
  if (Array.isArray(tree)) return tree.map(content).join(' ')
  if (tree === null || tree === undefined || typeof tree === 'boolean') return ''
  return typeof tree === 'object' ? content(tree.props?.children) : String(tree)
}
function find(tree, predicate) { const result = nodes(tree).find(predicate); assert.ok(result, 'Expected element'); return result }
const button = (tree, label) => find(tree, node => node.type === 'button' && content(node) === label)
const submit = tree => find(tree, node => node.type === 'form').props.onSubmit({ preventDefault() {} })
function fill(render, id, value) {
  find(render(), node => node.type === 'input' && node.props.id === id).props.onChange({ target: { value } })
}
const settle = () => new Promise(resolve => setImmediate(resolve))

test('catalogue → product → cart → guest login → checkout → confirmation → header logout', async () => {
  const app = harness()
  globalThis.fetch = async () => ({ ok: true, status: 200, json: async () => ({ products: [product], total: 1 }) })
  const catalogue = app.page('src/pages/CataloguePage.tsx')
  assert.match(content(catalogue()), /Loading products/)
  await settle()
  const grid = find(catalogue(), node => node.props?.products)
  assert.equal(grid.props.products[0].id, 1)
  const card = app.page('src/components/product/ProductCard.tsx', { product })
  button(card(), 'Add to cart').props.onClick()
  app.sync(); assert.equal(app.cart().itemCount, 1)

  globalThis.fetch = async () => ({ ok: true, status: 200, json: async () => product })
  const wrapper = app.load('src/pages/ProductPage.tsx').default()
  const detailsInstance = app.mount(wrapper.type, wrapper.props)
  const details = () => { app.sync(); return detailsInstance.render() }
  details(); await settle()
  find(details(), node => node.props?.['aria-label'] === 'Show image 2 of Test product').props.onClick()
  assert.ok(nodes(details()).some(node => node.type === 'img' && node.props.src === 'second.webp'))
  button(details(), 'Add to cart').props.onClick()
  app.sync(); assert.equal(app.cart().itemCount, 2)
  assert.equal(app.cart().total, 17.88)
  const cart = app.page('src/pages/CartPage.tsx')
  assert.match(content(cart()), /\$17.88/)
  const rowElement = find(cart(), node => node.props?.item)
  const row = rowElement.type(rowElement.props)
  find(row, node => node.props?.['aria-label'] === 'Increase quantity of Test product').props.onClick()
  app.sync(); assert.equal(app.cart().itemCount, 3)
  app.cart().setQuantity(1, 2); app.sync()

  const guard = app.page('src/routes/ProtectedRoute.tsx')
  assert.equal(guard().props.to, '/login')
  assert.equal(guard().props.state.from, '/checkout')
  app.router.location = { pathname: '/login', state: { from: '/checkout' } }
  const login = app.page('src/pages/LoginPage.tsx')
  submit(login()); assert.match(content(login()), /Username is required/)
  fill(login, 'username', ' shopper '); fill(login, 'password', 'password123')
  submit(login()); app.sync()
  assert.equal(app.auth().user.username, 'shopper')
  assert.equal(app.router.visits.at(-1).to, '/checkout')
  assert.equal(guard().type, 'Outlet')

  const checkout = app.page('src/pages/CheckoutPage.tsx')
  submit(checkout())
  assert.equal(nodes(checkout()).filter(node => node.props?.role === 'alert').length, 4)
  assert.equal(app.cart().itemCount, 2)
  for (const [id, value] of Object.entries({ fullName: 'Test Shopper', email: 'shopper@example.com', address: '10 Test Street', city: 'Tbilisi' })) fill(checkout, id, value)
  const pendingForm = checkout()
  submit(pendingForm); submit(pendingForm)
  assert.match(content(checkout()), /Thank you! Your order has been placed/)
  assert.match(content(checkout()), /\$17.88/)
  assert.equal(app.cart().itemCount, 0)
  const orders = JSON.parse(localStorage.getItem('shop_orders'))
  assert.equal(orders.length, 1)
  assert.equal(orders[0].items[0].unitPrice, 8.94)
  assert.equal(orders[0].total, 17.88)
  assert.deepEqual(JSON.parse(localStorage.getItem('shop_cart')), { items: [] })

  app.cart().addItem(product); app.sync()
  const header = app.page('src/components/layout/Header.tsx')
  assert.match(content(header()), /Account/)
  button(header(), 'Log out').props.onClick()
  app.sync()
  assert.equal(app.auth().isLoggedIn, false)
  assert.equal(app.router.visits.at(-1).to, '/')
  assert.equal(app.cart().itemCount, 1)
  assert.equal(sessionStorage.getItem('shop_auth_user'), null)
  assert.match(content(header()), /Log in/)
  assert.ok(!nodes(header()).some(node => node.type === 'button' && content(node) === 'Log out'))
})

test('cart persistence, stock limits, removal, clear confirmation and current prices', () => {
  const app = harness()
  app.cart().addItem(product, 2); app.sync()
  app.cart().addItem({ ...product, price: 12, discountPercentage: 0.5 }, 1); app.sync()
  assert.equal(app.cart().subtotal, 35.82)
  app.cart().setQuantity(1, 0); app.sync(); assert.equal(app.cart().itemCount, 3)
  app.cart().setQuantity(1, 6); app.sync(); assert.equal(app.cart().itemCount, 3)
  app.cart().addItem(product, 3); app.sync(); assert.equal(app.cart().itemCount, 3)
  const restored = app.mount(app.load('src/context/CartContext.tsx').CartProvider, { children: null }).render().props.value
  assert.equal(restored.itemCount, 3)
  const card = app.page('src/components/product/ProductCard.tsx', { product: { ...product, price: 100, discountPercentage: 0.5 } })
  assert.match(content(card()), /\$99.50/)
  const cart = app.page('src/pages/CartPage.tsx')
  window.confirm = () => false; button(cart(), 'Clear cart').props.onClick(); app.sync()
  assert.equal(app.cart().itemCount, 3)
  window.confirm = () => true; button(cart(), 'Clear cart').props.onClick(); app.sync()
  assert.equal(app.cart().itemCount, 0)
  app.cart().addItem(product); app.sync(); app.cart().removeItem(1); app.sync()
  assert.equal(app.cart().itemCount, 0)
})

test('failed order storage preserves cart and permits retry; empty checkout redirects', () => {
  const app = harness()
  const checkout = app.page('src/pages/CheckoutPage.tsx')
  assert.equal(checkout().props.to, '/cart')
  app.auth().login('shopper'); app.cart().addItem(product); app.sync()
  for (const [id, value] of Object.entries({ fullName: 'Test Shopper', email: 'shopper@example.com', address: '10 Test Street', city: 'Tbilisi' })) fill(checkout, id, value)
  const save = localStorage.setItem
  localStorage.setItem = (key, value) => { if (key === 'shop_orders') throw new Error('Storage blocked'); save(key, value) }
  submit(checkout()); assert.match(content(checkout()), /Unable to save your order/)
  assert.equal(app.cart().itemCount, 1)
  localStorage.setItem = save
  submit(checkout()); assert.match(content(checkout()), /Thank you/)
  assert.equal(app.cart().itemCount, 0)
})

test('API failures, product 404, invalid IDs and Error Boundary fallback', async () => {
  const app = harness()
  const api = app.load('src/api/products.api.ts')
  globalThis.fetch = async () => ({ ok: false, status: 500 })
  await assert.rejects(api.fetchProducts(), /Failed to fetch products/)
  const catalogue = app.page('src/pages/CataloguePage.tsx')
  catalogue(); await settle(); assert.match(content(catalogue()), /Unable to load products/)
  globalThis.fetch = async () => ({ ok: false, status: 404 })
  assert.equal(await api.fetchProductById(999999), null)
  app.router.params.id = 'abc'
  const invalid = app.load('src/pages/ProductPage.tsx').default()
  assert.equal(invalid.type.name, 'NotFoundPage')
  globalThis.fetch = async () => ({ ok: true, json: async () => ({ products: [], total: 0 }) })
  const empty = app.page('src/pages/CataloguePage.tsx'); empty(); await settle()
  assert.match(content(empty()), /No products found/)
  const Boundary = app.load('src/components/ErrorBoundary.tsx').default
  const boundary = new Boundary({ children: 'normal' })
  boundary.state = Boundary.getDerivedStateFromError(new Error('Test failure'))
  assert.match(content(boundary.render()), /Something went wrong/)
  assert.ok(button(boundary.render(), 'Reload'))
})
