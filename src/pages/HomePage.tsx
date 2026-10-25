import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { fetchProducts } from '../api/products.api'
import HomeCatalogue from '../components/product/HomeCatalogue'
import ProductGrid from '../components/product/ProductGrid'
import type { Product } from '../types/product'

function HomePage() {
  const [searchParams] = useSearchParams()
  const query = (searchParams.get('q') ?? '').trim()
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)

  useEffect(() => {
    let isCurrent = true
    const controller = new AbortController()

    async function loadProducts() {
      try {
        const data = await fetchProducts(controller.signal)
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
      controller.abort()
    }
  }, [])

  const editorialProduct = products.find((product) => product.id === 8)

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
          <a
            href="#catalogue"
            className="mt-8 inline-flex min-h-12 items-center justify-center rounded-xl bg-[var(--shop-primary)] px-7 text-center font-medium text-white transition-colors hover:bg-[var(--shop-accent)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--shop-accent)]"
          >
            Shop now
          </a>
        </div>

        <figure className="aspect-square min-w-0 overflow-hidden rounded-3xl bg-white md:aspect-[4/5]">
          <img
            src="/images/perfume-editorial.webp"
            alt="Editorial photograph of an unbranded glass perfume bottle on sunlit sand"
            width={1100}
            height={1650}
            fetchPriority="high"
            className="h-full w-full object-cover object-[center_55%]"
          />
        </figure>
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
          <a
            href="#catalogue"
            className="inline-flex min-h-11 items-center rounded-lg font-medium text-[var(--shop-accent)] underline underline-offset-4 hover:text-[var(--shop-primary)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--shop-accent)]"
          >
            View all products
          </a>
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

      <HomeCatalogue query={query} products={products} isLoading={isLoading} hasError={hasError} />
    </div>
  )
}

export default HomePage
