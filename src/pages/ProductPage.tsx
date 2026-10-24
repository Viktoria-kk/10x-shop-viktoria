import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { fetchProductById } from '../api/products.api'
import type { Product } from '../types/product'
import { discountedPrice, formatPrice } from '../utils/format'
import NotFoundPage from './NotFoundPage'

function ProductDetails({ productId }: { productId: number }) {
  const [product, setProduct] = useState<Product | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    let isCurrent = true

    async function loadProduct() {
      try {
        const result = await fetchProductById(productId)
        if (!isCurrent) return

        if (result === null) {
          setNotFound(true)
        } else {
          setProduct(result)
        }
      } catch {
        if (isCurrent) setHasError(true)
      } finally {
        if (isCurrent) setIsLoading(false)
      }
    }

    void loadProduct()

    return () => {
      isCurrent = false
    }
  }, [productId])

  if (isLoading) {
    return <p role="status" className="text-stone-600">Loading product...</p>
  }

  if (hasError) {
    return (
      <p role="alert" className="text-rose-800">
        Unable to load product. Please try again later.
      </p>
    )
  }

  if (notFound || product === null) return <NotFoundPage />

  const hasDiscount = product.discountPercentage >= 1
  const mainImage = product.images[0] || product.thumbnail
  let stockText = 'Out of stock'
  if (product.stock > 5) stockText = 'In stock'
  else if (product.stock > 0) stockText = `Only ${product.stock} left!`

  return (
    <section>
      <Link
        to="/"
        className="inline-flex min-h-11 items-center rounded-lg text-sm font-medium text-[#5E7192] hover:text-rose-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#5E7192]"
      >
        ← Back to catalog
      </Link>

      <div className="mt-8 grid gap-10 md:grid-cols-2 md:items-start lg:gap-16">
        <div className="aspect-square min-w-0 rounded-3xl bg-white p-6 sm:p-10">
          <img
            src={mainImage}
            alt={`Image of ${product.title}`}
            width={640}
            height={640}
            className="h-full w-full object-contain"
          />
        </div>

        <div className="min-w-0">
          <p className="text-sm font-medium text-[#5E7192]">{product.category}</p>
          <h1 className="mt-3 break-words text-3xl font-semibold tracking-tight text-stone-900 md:text-4xl">
            {product.title}
          </h1>
          {product.brand && <p className="mt-3 text-stone-600">By {product.brand}</p>}
          <p className="mt-4 text-sm text-stone-600">Rated {product.rating.toFixed(1)} out of 5</p>

          <div className="mt-8 flex flex-wrap items-baseline gap-x-4 gap-y-2">
            <span className="text-3xl font-semibold text-stone-900">
              {formatPrice(
                hasDiscount
                  ? discountedPrice(product.price, product.discountPercentage)
                  : product.price,
              )}
            </span>
            {hasDiscount && (
              <>
                <span className="text-stone-600 line-through">{formatPrice(product.price)}</span>
                <span className="text-sm font-medium text-rose-900">
                  {product.discountPercentage}% off
                </span>
              </>
            )}
          </div>

          <p
            className={`mt-5 text-sm font-medium ${product.stock > 5 ? 'text-[#5E7192]' : 'text-rose-800'}`}
          >
            {stockText}
          </p>

          <h2 className="mt-10 text-lg font-semibold text-stone-900">About this product</h2>
          <p className="mt-3 max-w-prose leading-7 text-stone-700">{product.description}</p>
        </div>
      </div>
    </section>
  )
}

function ProductPage() {
  const { id } = useParams()
  const parsedId = id !== undefined && /^[1-9]\d*$/.test(id) ? Number(id) : NaN

  if (!Number.isSafeInteger(parsedId)) return <NotFoundPage />

  return <ProductDetails key={parsedId} productId={parsedId} />
}

export default ProductPage
