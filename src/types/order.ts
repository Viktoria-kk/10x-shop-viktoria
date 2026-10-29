import type { CheckoutFormValues } from './checkout'
import type { CartItem } from './cart'

export interface OrderItem extends Pick<CartItem, 'productId' | 'title' | 'thumbnail' | 'quantity'> {
  unitPrice: number
}

export interface Order {
  id: string
  number: string
  items: OrderItem[]
  shipping: CheckoutFormValues
  subtotal: number
  total: number
  placedAt: number
}
