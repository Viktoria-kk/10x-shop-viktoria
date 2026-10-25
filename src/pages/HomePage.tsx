import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { fetchProducts } from '../api/products.api'
import ProductGrid from '../components/product/ProductGrid'
import type { Product } from '../types/product'

function HomePage() {
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)

  useEffect(() => {
    let isCurrent = true

    async function loadProducts() {
      try {
        const data = await fetchProducts()
        if (isCurrent) setProducts(data.products)
      } catch {
        if (isCurrent) setHasError(true)
      } finally {
        if (isCurrent) setIsLoading(false)
      }
    }

    void loadProducts()

    return () => {
      isCurrent = false
    }
  }, [])

  const heroProduct = products[0]
  const editorialProduct = products[4]

  return (
    <div className="space-y-20 sm:space-y-28 lg:space-y-36">
      <section className="grid items-center gap-10 md:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] md:gap-12 lg:gap-16">
        <div className="min-w-0 py-2 md:py-10">
          <h1 className="max-w-2xl text-5xl leading-[1.06] font-semibold tracking-tight text-[var(--shop-text)] sm:text-6xl lg:text-7xl">
            Find something worth keeping.
          </h1>
          <p className="mt-6 max-w-lg text-lg leading-8 text-[var(--shop-text)]">
            Browse the collection, explore the details, and find your next favourite.
          </p>
          <Link
            to="/catalogue"
            className="mt-8 inline-flex min-h-12 items-center justify-center rounded-xl bg-[var(--shop-primary)] px-7 text-center font-medium text-white transition-colors hover:bg-[var(--shop-accent)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--shop-accent)]"
          >
            Shop the catalogue
          </Link>
        </div>

        <div className="flex min-h-80 min-w-0 flex-col justify-center overflow-hidden rounded-3xl bg-white p-6 sm:min-h-96 sm:p-8 md:min-h-[28rem]">
          {heroProduct ? (
            <Link
              to={`/products/${heroProduct.id}`}
              className="group flex min-h-0 flex-1 flex-col rounded-xl focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--shop-accent)]"
            >
              <div className="relative flex min-h-52 flex-1 items-center justify-center">
                <span aria-hidden="true" className="p-8 text-center text-[var(--shop-text)]">
                  {heroProduct.title}
                </span>
                {heroProduct.thumbnail?.trim() && (
                  <img
                    src={heroProduct.thumbnail}
                    alt={heroProduct.title}
                    width={400}
                    height={400}
                    fetchPriority="high"
                    onError={(event) => {
                      event.currentTarget.style.display = 'none'
                    }}
                    className="absolute inset-0 h-full w-full bg-white object-contain"
                  />
                )}
              </div>
              <div className="mt-6 border-t border-[var(--shop-background)] pt-5">
                <p className="text-sm text-[var(--shop-accent)]">Discover this product</p>
                <p className="mt-1 break-words text-lg font-semibold text-[var(--shop-text)] group-hover:text-[var(--shop-accent)]">
                  {heroProduct.title}
                </p>
              </div>
            </Link>
          ) : (
            <div className="flex min-h-64 flex-col justify-center text-center">
              <p className="text-3xl font-semibold tracking-tight text-[var(--shop-primary)] sm:text-4xl">
                A collection to explore.
              </p>
              <p className="mt-4 text-[var(--shop-text)]">
                {isLoading ? 'Loading products...' : 'Take a look around the shop.'}
              </p>
            </div>
          )}
        </div>
      </section>

      <section aria-labelledby="featured-heading">
        <div className="flex flex-wrap items-end justify-between gap-x-8 gap-y-4">
          <div>
            <h2 id="featured-heading" className="text-3xl font-semibold tracking-tight text-[var(--shop-text)] sm:text-4xl">
              Featured finds
            </h2>
            <p className="mt-3 max-w-xl leading-7 text-[var(--shop-text)]">
              A first look at what is in the shop.
            </p>
          </div>
          <Link
            to="/catalogue"
            className="inline-flex min-h-11 items-center rounded-lg font-medium text-[var(--shop-accent)] underline underline-offset-4 hover:text-[var(--shop-primary)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--shop-accent)]"
          >
            View all products
          </Link>
        </div>

        {isLoading ? (
          <p className="mt-8 text-[var(--shop-text)]" role="status">Loading featured products...</p>
        ) : hasError ? (
          <p className="mt-8 text-[var(--shop-accent)]" role="alert">
            Unable to load products. Please try again later.
          </p>
        ) : products.length === 0 ? (
          <p className="mt-8 text-[var(--shop-text)]">No products found.</p>
        ) : (
          <ProductGrid products={products.slice(0, 4)} headingLevel="h3" />
        )}
      </section>

      {editorialProduct && (
        <section aria-labelledby="closer-look-heading" className="grid items-center gap-8 border-t border-[var(--shop-primary)]/15 pt-12 sm:pt-16 md:grid-cols-2 md:gap-14">
          <Link
            to={`/products/${editorialProduct.id}`}
            className="relative flex aspect-[4/3] min-w-0 items-center justify-center overflow-hidden rounded-3xl bg-white p-8 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--shop-accent)] sm:p-12"
          >
            <span aria-hidden="true" className="text-center font-medium text-[var(--shop-text)]">
              {editorialProduct.title}
            </span>
            {editorialProduct.thumbnail?.trim() && (
              <img
                src={editorialProduct.thumbnail}
                alt={editorialProduct.title}
                width={400}
                height={400}
                loading="lazy"
                onError={(event) => {
                  event.currentTarget.style.display = 'none'
                }}
                className="absolute inset-0 h-full w-full bg-white object-contain p-8 sm:p-12"
              />
            )}
          </Link>
          <div className="min-w-0">
            <h2 id="closer-look-heading" className="text-3xl font-semibold tracking-tight text-[var(--shop-text)] sm:text-4xl">
              A closer look.
            </h2>
            <p className="mt-5 max-w-prose text-lg leading-8 text-[var(--shop-text)]">
              See the images, details and availability before you decide.
            </p>
            <p className="mt-5 break-words font-medium text-[var(--shop-accent)]">
              {editorialProduct.title}
            </p>
            <Link
              to={`/products/${editorialProduct.id}`}
              className="mt-5 inline-flex min-h-11 items-center rounded-lg font-semibold text-[var(--shop-accent)] underline underline-offset-4 hover:text-[var(--shop-primary)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--shop-accent)]"
            >
              Explore this product
            </Link>
          </div>
        </section>
      )}
    </div>
  )
}

export default HomePage
