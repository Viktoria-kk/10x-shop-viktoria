import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { fetchProductById } from '../api/products.api'
import OrderStatusBadge from '../components/orders/OrderStatusBadge'
import { useCart } from '../context/cart-context'
import type { Product } from '../types/product'
import { formatPrice } from '../utils/format'
import { readOrders } from '../utils/order-storage'
import { formatOrderDate, getOrderStatus, type OrderStatus } from '../utils/order-status'
import NotFoundPage from './NotFoundPage'

const stages: OrderStatus[] = ['Processing', 'Shipped', 'Delivered']

function OrderDetailsPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [orders] = useState(readOrders)
  const [now, setNow] = useState(Date.now)
  const [isReordering, setIsReordering] = useState(false)
  const [reorderError, setReorderError] = useState('')
  const reorderPending = useRef(false)
  const activeRef = useRef(true)
  const { items: cartItems, addItem } = useCart()
  const cartItemsRef = useRef(cartItems)
  const order = orders.find((saved) => saved.id === id)

  useEffect(() => {
    activeRef.current = true
    return () => { activeRef.current = false }
  }, [])

  useEffect(() => {
    cartItemsRef.current = cartItems
  }, [cartItems])

  useEffect(() => {
    if (!order) return
    const interval = window.setInterval(() => setNow(Date.now()), 30_000)
    return () => window.clearInterval(interval)
  }, [order])

  async function handleReorder() {
    if (!order || reorderPending.current) return
    reorderPending.current = true
    setIsReordering(true)
    setReorderError('')

    let products: (Product | null)[]
    try {
      products = await Promise.all(order.items.map((item) => fetchProductById(item.productId)))
    } catch {
      if (!activeRef.current) return
      setReorderError('Unable to check product availability. Your cart was not changed. Please try again.')
      reorderPending.current = false
      setIsReordering(false)
      return
    }

    if (!activeRef.current) return

    const unavailable = products.some((product, index) => {
      const purchased = order.items[index]
      const inCart = cartItemsRef.current.find((item) => item.productId === purchased.productId)
      return !product || product.id !== purchased.productId || !Number.isSafeInteger(product.stock)
        || product.stock < 1 || (inCart?.quantity ?? 0) + purchased.quantity > product.stock
    })

    if (unavailable) {
      setReorderError('Some products are unavailable or exceed current stock. Your cart was not changed.')
      reorderPending.current = false
      setIsReordering(false)
      return
    }

    products.forEach((product, index) => {
      if (product) addItem(product, order.items[index].quantity)
    })
    const count = order.items.reduce((sum, item) => sum + item.quantity, 0)
    navigate('/cart', { state: { reorderMessage: `${count} ${count === 1 ? 'item' : 'items'} added to your cart. Current product prices apply.` } })
  }

  if (!order) return <NotFoundPage />

  const status = getOrderStatus(order, now)
  const currentStage = stages.indexOf(status)

  return (
    <section className="mx-auto max-w-4xl">
      <Link to="/orders" className="inline-flex min-h-11 items-center rounded-lg font-medium text-[var(--shop-accent)] underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--shop-accent)]">← Back to orders</Link>
      <div className="mt-6 flex flex-wrap items-start justify-between gap-5">
        <div className="min-w-0">
          <h1 className="break-words text-3xl font-semibold tracking-tight text-[var(--shop-text)] sm:text-4xl">Order {order.number}</h1>
          <p className="mt-3 text-[var(--shop-text)]">Placed {formatOrderDate(order.placedAt)}</p>
        </div>
        <OrderStatusBadge status={status} />
      </div>

      <section aria-labelledby="order-progress-heading" className="mt-10 border-t border-[var(--shop-primary)]/15 pt-8">
        <h2 id="order-progress-heading" className="text-xl font-semibold text-[var(--shop-text)]">Order status</h2>
        <p className="mt-2 max-w-prose text-sm leading-6 text-[var(--shop-text)]">These stages are simulated for this project. They do not represent a real shipment.</p>
        <ol aria-label="Simulated order progress" className="mt-6 grid grid-cols-3 gap-3 sm:gap-6">
          {stages.map((stage, index) => (
            <li key={stage} aria-current={index === currentStage ? 'step' : undefined} className={`min-w-0 border-t-2 pt-3 ${index <= currentStage ? 'border-[var(--shop-accent)]' : 'border-[var(--shop-primary)]/20'}`}>
              <span className="block break-words text-sm font-medium text-[var(--shop-text)] sm:text-base">{stage}</span>
              <span className="mt-1 block text-xs text-[var(--shop-text)]">{index < currentStage ? 'Completed' : index === currentStage ? 'Current' : 'Upcoming'}</span>
            </li>
          ))}
        </ol>
      </section>

      <section aria-labelledby="order-items-heading" className="mt-12 border-t border-[var(--shop-primary)]/15 pt-8">
        <h2 id="order-items-heading" className="text-xl font-semibold text-[var(--shop-text)]">Products</h2>
        <ul className="mt-4 divide-y divide-[var(--shop-primary)]/15">
          {order.items.map((item) => (
            <li key={item.productId} className="flex min-w-0 gap-4 py-5 sm:gap-6">
              <img src={item.thumbnail} alt={`Image of ${item.title}`} width={112} height={112} className="h-20 w-20 shrink-0 rounded-2xl bg-white object-contain p-2 sm:h-28 sm:w-28" />
              <div className="flex min-w-0 flex-1 flex-col gap-1 sm:flex-row sm:justify-between sm:gap-6">
                <div className="min-w-0">
                  <p className="break-words font-semibold text-[var(--shop-text)]">{item.title}</p>
                  <p className="mt-1 text-sm text-[var(--shop-text)]">{item.quantity} × {formatPrice(item.unitPrice)} each</p>
                </div>
                <p className="shrink-0 font-semibold text-[var(--shop-text)]">{formatPrice(item.unitPrice * item.quantity)}</p>
              </div>
            </li>
          ))}
        </ul>
        <dl className="ml-auto mt-6 max-w-xs space-y-3 border-t border-[var(--shop-primary)]/15 pt-5">
          <div className="flex justify-between gap-4 text-[var(--shop-text)]"><dt>Subtotal</dt><dd>{formatPrice(order.subtotal)}</dd></div>
          <div className="flex justify-between gap-4 font-semibold text-[var(--shop-text)]"><dt>Total</dt><dd>{formatPrice(order.total)}</dd></div>
        </dl>
      </section>

      <section aria-labelledby="order-shipping-heading" className="mt-12 border-t border-[var(--shop-primary)]/15 pt-8">
        <h2 id="order-shipping-heading" className="text-xl font-semibold text-[var(--shop-text)]">Shipping information</h2>
        <address className="mt-4 space-y-1 break-words not-italic leading-7 text-[var(--shop-text)]">
          <p>{order.shipping.fullName}</p>
          <p>{order.shipping.email}</p>
          <p>{order.shipping.address}</p>
          <p>{order.shipping.city}</p>
        </address>
      </section>

      <div className="mt-10 flex flex-wrap items-center gap-5">
        <button type="button" onClick={() => { void handleReorder() }} disabled={isReordering} className="min-h-12 cursor-pointer rounded-xl bg-[var(--shop-primary)] px-6 font-medium text-white hover:bg-[var(--shop-accent)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--shop-accent)] disabled:cursor-wait disabled:opacity-60">{isReordering ? 'Checking availability...' : 'Reorder'}</button>
        <Link to="/#catalogue" className="inline-flex min-h-11 items-center rounded-lg font-medium text-[var(--shop-accent)] underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--shop-accent)]">Browse products</Link>
      </div>
      {reorderError && <p role="alert" className="mt-4 max-w-prose text-sm text-[var(--shop-accent)]">{reorderError}</p>}
    </section>
  )
}

export default OrderDetailsPage
