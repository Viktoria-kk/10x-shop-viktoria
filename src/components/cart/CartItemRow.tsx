import { Link } from 'react-router-dom'
import type { CartItem } from '../../types/cart'
import { discountedPrice, formatPrice } from '../../utils/format'

interface CartItemRowProps {
  item: CartItem
  onQuantityChange: (productId: number, quantity: number) => void
  onRemove: (productId: number) => void
}

function CartItemRow({ item, onQuantityChange, onRemove }: CartItemRowProps) {
  const unitPrice = discountedPrice(item.price, item.discountPercentage)
  const canDecrease =
    Number.isInteger(item.quantity) && item.quantity > 1 && item.quantity - 1 <= item.stock
  const canIncrease =
    Number.isInteger(item.quantity) && item.quantity >= 1 && item.quantity + 1 <= item.stock

  return (
    <li className="flex min-w-0 gap-3 py-6 first:pt-0 sm:gap-6 sm:py-8">
      <img
        src={item.thumbnail}
        alt={`Thumbnail of ${item.title}`}
        width={112}
        height={112}
        className="h-20 w-20 shrink-0 rounded-2xl bg-white object-contain p-2 sm:h-28 sm:w-28"
      />
      <div className="min-w-0 flex-1">
        <Link
          to={`/products/${item.productId}`}
          className="block break-words font-semibold text-[var(--shop-text)] hover:text-[var(--shop-accent)] focus-visible:rounded-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--shop-accent)]"
        >
          {item.title}
        </Link>
        <p className="mt-1 text-sm text-[var(--shop-text)]">{formatPrice(unitPrice)} each</p>

        <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2">
          <div className="inline-flex items-center gap-3" role="group" aria-label={`Quantity of ${item.title}`}>
            <button
              type="button"
              aria-label={`Decrease quantity of ${item.title}`}
              onClick={() => onQuantityChange(item.productId, item.quantity - 1)}
              disabled={!canDecrease}
              className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-xl text-[var(--shop-text)] hover:text-[var(--shop-accent)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--shop-accent)] disabled:cursor-not-allowed disabled:opacity-40"
            >
              −
            </button>
            <span className="min-w-5 text-center font-medium text-[var(--shop-text)]">{item.quantity}</span>
            <button
              type="button"
              aria-label={`Increase quantity of ${item.title}`}
              onClick={() => onQuantityChange(item.productId, item.quantity + 1)}
              disabled={!canIncrease}
              className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-xl text-[var(--shop-text)] hover:text-[var(--shop-accent)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--shop-accent)] disabled:cursor-not-allowed disabled:opacity-40"
            >
              +
            </button>
          </div>
          <button
            type="button"
            onClick={() => onRemove(item.productId)}
            className="min-h-11 rounded-lg px-1 text-sm font-medium text-[var(--shop-accent)] underline underline-offset-4 hover:text-[var(--shop-primary)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--shop-accent)]"
          >
            Remove
          </button>
        </div>

        <p className="mt-3 text-sm text-[var(--shop-text)]">
          Line total <span className="font-semibold">{formatPrice(unitPrice * item.quantity)}</span>
        </p>
      </div>
    </li>
  )
}

export default CartItemRow
