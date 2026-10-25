import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useCart } from '../../context/cart-context'
import type { Product } from '../../types/product'
import { discountedPrice, formatPrice } from '../../utils/format'

interface ProductCardProps {
  product: Product
  headingLevel?: 'h2' | 'h3'
}

function ProductCard({ product, headingLevel: Heading = 'h2' }: ProductCardProps) {
  const { items, addItem } = useCart()
  const [feedback, setFeedback] = useState('')
  const hasDiscount = product.discountPercentage >= 1
  const cartQuantity = items.find((item) => item.productId === product.id)?.quantity ?? 0
  const isOutOfStock = product.stock <= 0
  const isAtLimit = !isOutOfStock && cartQuantity >= product.stock
  const cartButtonText = isOutOfStock ? 'Out of stock' : isAtLimit ? 'Maximum in cart' : 'Add to cart'

  function handleAddToCart() {
    if (isOutOfStock || isAtLimit) return

    addItem(product, 1)
    setFeedback('Added to cart')
  }

  return (
    <article className="min-w-0">
      <Link
        to={`/products/${product.id}`}
        className="group block rounded-2xl focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--shop-accent)]"
      >
        <div className="relative flex aspect-square items-center justify-center overflow-hidden rounded-2xl bg-white">
          <span aria-hidden="true" className="p-6 text-center text-sm text-[var(--shop-text)]">
            {product.title}
          </span>
          {product.thumbnail?.trim() && (
            <img
              src={product.thumbnail}
              alt={product.title}
              loading="lazy"
              width={320}
              height={320}
              onError={(event) => {
                event.currentTarget.style.display = 'none'
              }}
              className="absolute inset-0 h-full w-full bg-white object-contain p-4 sm:p-5 lg:p-6"
            />
          )}
        </div>
        <p className="mt-4 text-sm text-[var(--shop-text)]">
          {product.category}
          {product.brand && <span> · {product.brand}</span>}
        </p>
        <Heading className="mt-1 break-words text-lg font-semibold leading-snug text-[var(--shop-text)] group-hover:text-[var(--shop-accent)]">
          {product.title}
        </Heading>
      </Link>

      <div className="mt-3 flex flex-wrap items-baseline gap-x-3 gap-y-1">
        <span className="text-lg font-semibold text-[var(--shop-text)]">
          {formatPrice(
            hasDiscount
              ? discountedPrice(product.price, product.discountPercentage)
              : product.price,
          )}
        </span>
        {hasDiscount && (
          <>
            <span className="text-sm text-[var(--shop-text)] line-through">{formatPrice(product.price)}</span>
            <span className="text-sm font-medium text-[var(--shop-accent)]">
              {product.discountPercentage}% off
            </span>
          </>
        )}
      </div>

      <p className="mt-2 text-sm text-[var(--shop-text)]">
        {product.stock > 0 ? 'In stock' : 'Out of stock'} · Rated {product.rating.toFixed(1)} / 5
      </p>

      <button
        type="button"
        onClick={handleAddToCart}
        aria-label={`${cartButtonText}: ${product.title}`}
        disabled={isOutOfStock || isAtLimit}
        className="mt-3 inline-flex min-h-11 items-center rounded-lg px-2 text-sm font-semibold text-[var(--shop-accent)] underline underline-offset-4 hover:text-[var(--shop-primary)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--shop-accent)] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {cartButtonText}
      </button>
      <p role="status" className={feedback ? 'mt-1 text-sm text-[var(--shop-accent)]' : 'sr-only'}>
        {feedback}
      </p>
    </article>
  )
}

export default ProductCard
