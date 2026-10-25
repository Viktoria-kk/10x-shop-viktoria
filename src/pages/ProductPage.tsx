import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { fetchProductById } from '../api/products.api'
import { useCart } from '../context/cart-context'
import type { Product } from '../types/product'
import { discountedPrice, formatPrice } from '../utils/format'
import NotFoundPage from './NotFoundPage'

function ProductDetails({ productId }: { productId: number }) {
  const { items, addItem } = useCart()
  const [product, setProduct] = useState<Product | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)
  const [notFound, setNotFound] = useState(false)
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [feedback, setFeedback] = useState('')

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
          setQuantity(result.stock > 0 ? 1 : 0)
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
    return <p role="status" className="text-[var(--shop-text)]">Loading product...</p>
  }

  if (hasError) {
    return (
      <p role="alert" className="text-[var(--shop-accent)]">
        Unable to load product. Please try again later.
      </p>
    )
  }

  if (notFound || product === null) return <NotFoundPage />

  const displayedProduct = product
  const hasDiscount = product.discountPercentage >= 1
  const images = product.images.length > 0 ? product.images : [product.thumbnail]
  const cartQuantity = items.find((item) => item.productId === product.id)?.quantity ?? 0
  const remainingStock = Math.max(0, product.stock - cartQuantity)
  const isOutOfStock = product.stock <= 0
  const isAtLimit = !isOutOfStock && remainingStock === 0
  let stockText = 'Out of stock'
  if (product.stock > 5) stockText = 'In stock'
  else if (product.stock > 0) stockText = `Only ${product.stock} left!`

  function handleAddToCart() {
    if (isOutOfStock || isAtLimit || !Number.isInteger(quantity) || quantity < 1 || quantity > remainingStock) {
      setFeedback('Not enough stock available')
      return
    }

    addItem(displayedProduct, quantity)
    setFeedback('Added to cart')
  }

  return (
    <section>
      <Link
        to="/"
        className="inline-flex min-h-11 items-center rounded-lg text-sm font-medium text-[var(--shop-accent)] hover:text-[var(--shop-primary)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--shop-accent)]"
      >
        ← Back to catalogue
      </Link>

      <div className="mt-8 grid gap-8 md:grid-cols-2 md:items-start lg:gap-12">
        <div className="min-w-0">
          <div className="aspect-square rounded-3xl bg-white p-4 sm:p-8 lg:p-10">
            <img
              src={images[selectedImageIndex]}
              alt={`${product.title}, image ${selectedImageIndex + 1} of ${images.length}`}
              width={640}
              height={640}
              className="h-full w-full object-contain"
            />
          </div>
          <div className="mt-4 flex flex-wrap gap-2 sm:gap-3" role="group" aria-label="Product images">
            {images.map((image, index) => (
              <button
                key={`${image}-${index}`}
                type="button"
                aria-label={`Show image ${index + 1} of ${product.title}`}
                aria-pressed={selectedImageIndex === index}
                onClick={() => setSelectedImageIndex(index)}
                className={`h-16 w-16 cursor-pointer rounded-2xl bg-white p-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--shop-accent)] ${
                  selectedImageIndex === index ? 'ring-2 ring-[var(--shop-accent)]' : 'hover:ring-2 hover:ring-[var(--shop-accent)]'
                }`}
              >
                <img src={image} alt="" className="h-full w-full object-contain" />
              </button>
            ))}
          </div>
        </div>

        <div className="min-w-0">
          <p className="text-sm font-medium text-[var(--shop-accent)]">{product.category}</p>
          <h1 className="mt-3 break-words text-3xl font-semibold tracking-tight text-[var(--shop-text)] md:text-4xl">
            {product.title}
          </h1>
          {product.brand && <p className="mt-3 break-words text-[var(--shop-text)]">By {product.brand}</p>}
          <p className="mt-4 text-sm text-[var(--shop-text)]">Rated {product.rating.toFixed(1)} out of 5</p>

          <div className="mt-8 flex flex-wrap items-baseline gap-x-4 gap-y-2">
            <span className="text-3xl font-semibold text-[var(--shop-text)]">
              {formatPrice(
                hasDiscount
                  ? discountedPrice(product.price, product.discountPercentage)
                  : product.price,
              )}
            </span>
            {hasDiscount && (
              <>
                <span className="text-[var(--shop-text)] line-through">{formatPrice(product.price)}</span>
                <span className="text-sm font-medium text-[var(--shop-accent)]">
                  {product.discountPercentage}% off
                </span>
              </>
            )}
          </div>

          <p
            className={`mt-5 text-sm font-medium ${product.stock > 5 ? 'text-[var(--shop-accent)]' : 'text-[var(--shop-primary)]'}`}
          >
            {stockText}
          </p>

          <div className="mt-8">
            <p className="text-sm font-medium text-[var(--shop-text)]">Quantity</p>
            <div className="mt-3 inline-flex items-center gap-4" role="group" aria-label="Quantity">
              <button
                type="button"
                aria-label="Decrease quantity"
                onClick={() => {
                  setQuantity((current) => Math.max(1, current - 1))
                  setFeedback('')
                }}
                disabled={quantity <= 1}
                className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-xl text-[var(--shop-text)] shadow-sm hover:text-[var(--shop-accent)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--shop-accent)] disabled:cursor-not-allowed disabled:opacity-40"
              >
                −
              </button>
              <span className="min-w-5 text-center font-medium text-[var(--shop-text)]" aria-live="polite">
                {product.stock === 0 ? 'Unavailable' : quantity}
              </span>
              <button
                type="button"
                aria-label="Increase quantity"
                onClick={() => {
                  setQuantity((current) => Math.min(product.stock, current + 1))
                  setFeedback('')
                }}
                disabled={quantity >= product.stock}
                className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-xl text-[var(--shop-text)] shadow-sm hover:text-[var(--shop-accent)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--shop-accent)] disabled:cursor-not-allowed disabled:opacity-40"
              >
                +
              </button>
            </div>
          </div>

          <button
            type="button"
            onClick={handleAddToCart}
            disabled={isOutOfStock || isAtLimit}
            className="mt-6 inline-flex min-h-12 w-full items-center justify-center rounded-xl bg-[var(--shop-primary)] px-6 font-medium text-white hover:bg-[var(--shop-accent)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--shop-accent)] disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
          >
            {isOutOfStock ? 'Out of stock' : isAtLimit ? 'Maximum in cart' : 'Add to cart'}
          </button>
          {feedback && <p role="status" className="mt-2 text-sm text-[var(--shop-accent)]">{feedback}</p>}

          <h2 className="mt-10 text-lg font-semibold text-[var(--shop-text)]">About this product</h2>
          <p className="mt-3 max-w-prose break-words leading-7 text-[var(--shop-text)]">{product.description}</p>
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
