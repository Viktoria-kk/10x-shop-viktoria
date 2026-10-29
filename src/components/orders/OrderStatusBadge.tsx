import type { OrderStatus } from '../../utils/order-status'

const statusClasses: Record<OrderStatus, string> = {
  Processing: 'bg-slate-100 text-slate-700',
  Shipped: 'bg-blue-50 text-blue-800',
  Delivered: 'bg-green-50 text-green-800',
}

function OrderStatusBadge({ status }: { status: OrderStatus }) {
  return <span className={`inline-flex rounded-full px-3 py-1 text-sm font-medium ${statusClasses[status]}`}>{status}</span>
}

export default OrderStatusBadge
