import { useEffect, useState, type ReactNode } from 'react'
import type { CartItem, CartState } from '../types/cart'
import type { Product } from '../types/product'
import { discountedPrice } from '../utils/format'
import { CartContext } from './cart-context'

const CART_STORAGE_KEY = 'shop_cart'

function isValidQuantity(quantity: number, stock: number): boolean {
  return Number.isInteger(quantity) && quantity >= 1 && quantity <= stock
}

function isCartItem(value: unknown): value is CartItem {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) return false

  return (
    'productId' in value &&
    typeof value.productId === 'number' &&
    Number.isSafeInteger(value.productId) &&
    value.productId > 0 &&
    'title' in value &&
    typeof value.title === 'string' &&
    value.title.trim().length > 0 &&
    'thumbnail' in value &&
    typeof value.thumbnail === 'string' &&
    value.thumbnail.trim().length > 0 &&
    'price' in value &&
    typeof value.price === 'number' &&
    Number.isFinite(value.price) &&
    value.price >= 0 &&
    'discountPercentage' in value &&
    typeof value.discountPercentage === 'number' &&
    Number.isFinite(value.discountPercentage) &&
    value.discountPercentage >= 0 &&
    value.discountPercentage <= 100 &&
    'stock' in value &&
    typeof value.stock === 'number' &&
    Number.isSafeInteger(value.stock) &&
    value.stock >= 1 &&
    'quantity' in value &&
    typeof value.quantity === 'number' &&
    Number.isSafeInteger(value.quantity) &&
    isValidQuantity(value.quantity, value.stock) &&
    Number.isFinite(discountedPrice(value.price, value.discountPercentage) * value.quantity)
  )
}

function readSavedCart(): CartState {
  try {
    const saved = localStorage.getItem(CART_STORAGE_KEY)
    if (!saved) return { items: [] }

    const parsed: unknown = JSON.parse(saved)
    if (typeof parsed !== 'object' || parsed === null || !('items' in parsed) || !Array.isArray(parsed.items)) {
      return { items: [] }
    }

    const items: CartItem[] = []
    const seenIds = new Set<number>()
    const savedItems: unknown[] = parsed.items

    for (const item of savedItems) {
      if (!isCartItem(item) || seenIds.has(item.productId)) continue
      seenIds.add(item.productId)
      items.push({
        productId: item.productId,
        title: item.title,
        thumbnail: item.thumbnail,
        price: item.price,
        discountPercentage: item.discountPercentage,
        stock: item.stock,
        quantity: item.quantity,
      })
    }

    return { items }
  } catch {
    return { items: [] }
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartState>(readSavedCart)

  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart))
    } catch {
      // Cart interactions still work when storage is unavailable.
    }
  }, [cart])

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
