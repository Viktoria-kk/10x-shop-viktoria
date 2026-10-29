import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import OrderStatusBadge from '../components/orders/OrderStatusBadge'
import { formatPrice } from '../utils/format'
import { readOrders } from '../utils/order-storage'
import { formatOrderDate, getOrderStatus } from '../utils/order-status'

function OrdersPage() {
  const [orders] = useState(readOrders)
  const [now, setNow] = useState(Date.now)

  useEffect(() => {
    if (orders.length === 0) return
    const interval = window.setInterval(() => setNow(Date.now()), 30_000)
    return () => window.clearInterval(interval)
  }, [orders])

  const newestFirst = [...orders].sort((first, second) =>
    second.placedAt - first.placedAt || Number(second.number.slice(5)) - Number(first.number.slice(5)),
  )

  return (
    <section className="mx-auto max-w-4xl">
      <Link to="/profile" className="inline-flex min-h-11 items-center rounded-lg font-medium text-[var(--shop-accent)] underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--shop-accent)]">← My account</Link>
      <h1 className="mt-6 text-3xl font-semibold tracking-tight text-[var(--shop-text)] sm:text-4xl">My orders</h1>
      <p className="mt-3 max-w-prose leading-7 text-[var(--shop-text)]">Orders placed in this browser. Delivery stages are simulated for this project.</p>

      {newestFirst.length === 0 ? (
        <div className="mt-10 max-w-prose border-t border-[var(--shop-primary)]/15 pt-8">
          <p className="text-lg font-medium text-[var(--shop-text)]">You have no orders yet.</p>
          <p className="mt-2 leading-7 text-[var(--shop-text)]">When you place an order, you can find its details here.</p>
          <Link to="/#catalogue" className="mt-5 inline-flex min-h-12 items-center justify-center rounded-xl bg-[var(--shop-primary)] px-6 font-medium text-white hover:bg-[var(--shop-accent)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--shop-accent)]">Browse products</Link>
        </div>
      ) : (
        <ul className="mt-10 divide-y divide-[var(--shop-primary)]/15 border-t border-[var(--shop-primary)]/15">
          {newestFirst.map((order) => {
            const itemCount = order.items.reduce((count, item) => count + item.quantity, 0)
            return (
              <li key={order.id} className="flex min-w-0 flex-col gap-5 py-7 sm:flex-row sm:items-center sm:justify-between sm:gap-8">
                <div className="min-w-0">
                  <p className="break-words text-xl font-semibold text-[var(--shop-text)]">{order.number}</p>
                  <p className="mt-2 text-sm text-[var(--shop-text)]">Placed {formatOrderDate(order.placedAt)}</p>
                  <p className="mt-1 text-sm text-[var(--shop-text)]">{itemCount} {itemCount === 1 ? 'item' : 'items'} · {formatPrice(order.total)}</p>
                </div>
                <div className="flex flex-wrap items-center gap-x-6 gap-y-3 sm:justify-end">
                  <OrderStatusBadge status={getOrderStatus(order, now)} />
                  <Link to={`/orders/${order.id}`} aria-label={`View details for order ${order.number}`} className="inline-flex min-h-11 items-center rounded-lg font-medium text-[var(--shop-accent)] underline underline-offset-4 hover:text-[var(--shop-primary)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--shop-accent)]">View details</Link>
                </div>
              </li>
            )
          })}
        </ul>
      )}
    </section>
  )
}

export default OrdersPage
