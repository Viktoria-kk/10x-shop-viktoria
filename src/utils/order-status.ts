import type { Order } from '../types/order'

export type OrderStatus = 'Processing' | 'Shipped' | 'Delivered'

const dateFormatter = new Intl.DateTimeFormat('en-GB', { dateStyle: 'long', timeStyle: 'short' })

export function formatOrderDate(placedAt: number): string {
  return dateFormatter.format(placedAt)
}

export function getOrderStatus(order: Order, now: number): OrderStatus {
  const elapsed = now - order.placedAt
  if (elapsed < 60_000) return 'Processing'
  if (elapsed < 180_000) return 'Shipped'
  return 'Delivered'
}
