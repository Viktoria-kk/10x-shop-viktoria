import { Link } from 'react-router-dom'
import type { Product } from '../../types/product'
import { discountedPrice, formatPrice } from '../../utils/format'

interface ProductCardProps {
  product: Product
}

function ProductCard({ product }: ProductCardProps) {
  const hasDiscount = product.discountPercentage >= 1

  return (
    <article className="min-w-0">
      <Link
        to={`/products/${product.id}`}
        className="group block rounded-2xl focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--shop-accent)]"
      >
        <div className="aspect-square overflow-hidden rounded-2xl bg-white">
          <img
            src={product.thumbnail}
            alt={product.title}
            loading="lazy"
            width={320}
            height={320}
            className="h-full w-full object-contain p-6"
          />
        </div>
        <p className="mt-4 text-sm text-[var(--shop-text)]">
          {product.category}
          {product.brand && <span> · {product.brand}</span>}
        </p>
        <h2 className="mt-1 break-words text-lg font-semibold leading-snug text-[var(--shop-text)] group-hover:text-[var(--shop-accent)]">
          {product.title}
        </h2>
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
    </article>
  )
}

export default ProductCard
