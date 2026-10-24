import { useState, type ReactNode } from 'react'
import type { CartState } from '../types/cart'
import type { Product } from '../types/product'
import { discountedPrice } from '../utils/format'
import { CartContext } from './cart-context'

function isValidQuantity(quantity: number, stock: number): boolean {
  return Number.isInteger(quantity) && quantity >= 1 && quantity <= stock
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartState>({ items: [] })

  function addItem(product: Product, quantity = 1) {
    if (!isValidQuantity(quantity, product.stock)) return

    setCart((current) => {
      const existing = current.items.find((item) => item.productId === product.id)

      if (existing) {
        const nextQuantity = existing.quantity + quantity
        if (!isValidQuantity(nextQuantity, product.stock)) return current

        return {
          items: current.items.map((item) =>
            item.productId === product.id
              ? { ...item, quantity: nextQuantity, stock: product.stock }
              : item,
          ),
        }
      }

      return {
        items: [
          ...current.items,
          {
            productId: product.id,
            title: product.title,
            thumbnail: product.thumbnail,
            price: product.price,
            discountPercentage: product.discountPercentage,
            stock: product.stock,
            quantity,
          },
        ],
      }
    })
  }

  function removeItem(productId: number) {
    setCart((current) => {
      const items = current.items.filter((item) => item.productId !== productId)
      return items.length === current.items.length ? current : { items }
    })
  }

  function setQuantity(productId: number, quantity: number) {
    setCart((current) => {
      const existing = current.items.find((item) => item.productId === productId)
      if (!existing || !isValidQuantity(quantity, existing.stock) || existing.quantity === quantity) {
        return current
      }

      return {
        items: current.items.map((item) =>
          item.productId === productId ? { ...item, quantity } : item,
        ),
      }
    })
  }

  function clearCart() {
    setCart({ items: [] })
  }

  const itemCount = cart.items.reduce((count, item) => count + item.quantity, 0)
  const subtotal =
    Math.round(
      cart.items.reduce(
        (sum, item) =>
          sum + discountedPrice(item.price, item.discountPercentage) * item.quantity,
        0,
      ) * 100,
    ) / 100
  const total = subtotal

  return (
    <CartContext.Provider
      value={{ items: cart.items, addItem, removeItem, setQuantity, clearCart, itemCount, subtotal, total }}
    >
      {children}
    </CartContext.Provider>
  )
}
