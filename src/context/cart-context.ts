import { createContext, useContext } from 'react'
import type { CartItem } from '../types/cart'
import type { Product } from '../types/product'

export interface CartContextValue {
  items: CartItem[]
  addItem: (product: Product, quantity?: number) => void
  removeItem: (productId: number) => void
  setQuantity: (productId: number, quantity: number) => void
  clearCart: () => void
  itemCount: number
  subtotal: number
  total: number
}

export const CartContext = createContext<CartContextValue | undefined>(undefined)

export function useCart(): CartContextValue {
  const context = useContext(CartContext)

  if (context === undefined) {
    throw new Error('useCart must be used within CartProvider')
  }

  return context
}
