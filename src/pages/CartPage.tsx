import { Link } from 'react-router-dom'
import CartItemRow from '../components/cart/CartItemRow'
import { useCart } from '../context/cart-context'
import { formatPrice } from '../utils/format'

function CartPage() {
  const { items, setQuantity, removeItem, clearCart, itemCount, subtotal, total } = useCart()

  function handleClearCart() {
    if (window.confirm('Clear the cart? This cannot be undone.')) clearCart()
  }

  return (
    <section>
      <h1 className="text-3xl font-bold tracking-tight md:text-4xl">Your cart</h1>
      {items.length === 0 ? (
        <div className="mt-10">
          <p className="text-lg text-[var(--shop-text)]">Your cart is empty.</p>
          <Link
            to="/"
            className="mt-4 inline-flex min-h-11 items-center rounded-lg font-medium text-[var(--shop-accent)] underline underline-offset-4 hover:text-[var(--shop-primary)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--shop-accent)]"
          >
            Browse products
          </Link>
        </div>
      ) : (
        <div className="mt-10 grid gap-12 lg:grid-cols-3 lg:gap-14">
          <div className="min-w-0 lg:col-span-2">
            <ul className="space-y-10">
              {items.map((item) => (
                <CartItemRow
                  key={item.productId}
                  item={item}
                  onQuantityChange={setQuantity}
                  onRemove={removeItem}
                />
              ))}
            </ul>
            <button
              type="button"
              onClick={handleClearCart}
              className="mt-10 min-h-11 rounded-lg px-1 font-medium text-[var(--shop-accent)] underline underline-offset-4 hover:text-[var(--shop-primary)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--shop-accent)]"
            >
              Clear cart
            </button>
          </div>

          <section aria-labelledby="order-summary-heading" className="min-w-0 self-start rounded-3xl bg-white p-6 sm:p-8">
            <h2 id="order-summary-heading" className="text-xl font-semibold text-[var(--shop-text)]">
              Order summary
            </h2>
            <dl className="mt-6 space-y-4 text-[var(--shop-text)]">
              <div className="flex justify-between gap-4">
                <dt>Items</dt>
                <dd>{itemCount}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt>Subtotal</dt>
                <dd>{formatPrice(subtotal)}</dd>
              </div>
              <div className="flex justify-between gap-4 border-t border-[var(--shop-background)] pt-4 font-semibold">
                <dt>Total</dt>
                <dd>{formatPrice(total)}</dd>
              </div>
            </dl>
            <Link
              to="/checkout"
              className="mt-8 flex min-h-12 w-full items-center justify-center rounded-xl bg-[var(--shop-primary)] px-5 text-center font-medium text-white hover:bg-[var(--shop-accent)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--shop-accent)]"
            >
              Proceed to checkout
            </Link>
          </section>
        </div>
      )}
    </section>
  )
}

export default CartPage
