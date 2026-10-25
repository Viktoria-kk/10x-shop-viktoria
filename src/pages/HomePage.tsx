import { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import { fetchProducts, searchProducts } from '../api/products.api'
import ProductGrid from '../components/product/ProductGrid'
import type { Product, ProductsResponse } from '../types/product'

type SearchResult = {
  query: string
  attempt: number
  response: ProductsResponse | null
  hasError: boolean
}

function HomePage() {
  const location = useLocation()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const urlQuery = (searchParams.get('q') ?? '').trim()
  const [draft, setDraft] = useState<{ locationKey: string; value: string } | null>(null)
  const searchInput = draft?.locationKey === location.key ? draft.value : urlQuery
  const searchQuery = searchInput.trim()
  const [searchAttempt, setSearchAttempt] = useState(0)
  const [searchResult, setSearchResult] = useState<SearchResult | null>(null)
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

  useEffect(() => {
    if (draft?.locationKey !== location.key) return

    const nextQuery = draft.value.trim()
    if (nextQuery === urlQuery) return

    const timeout = window.setTimeout(() => {
      const nextParams = new URLSearchParams(location.search)
      if (nextQuery) nextParams.set('q', nextQuery)
      else nextParams.delete('q')

      setDraft(null)
      void navigate(
        {
          pathname: location.pathname,
          search: nextParams.toString() ? `?${nextParams.toString()}` : '',
          hash: location.hash,
        },
        { preventScrollReset: true },
      )
    }, 400)

    return () => window.clearTimeout(timeout)
  }, [draft, location, navigate, urlQuery])

  useEffect(() => {
    if (!urlQuery) return

    const controller = new AbortController()

    async function loadSearchResults() {
      try {
        const response = await searchProducts(urlQuery, controller.signal)
        if (!controller.signal.aborted) {
          setSearchResult({ query: urlQuery, attempt: searchAttempt, response, hasError: false })
        }
      } catch {
        if (!controller.signal.aborted) {
          setSearchResult({ query: urlQuery, attempt: searchAttempt, response: null, hasError: true })
        }
      }
    }

    void loadSearchResults()
    return () => controller.abort()
  }, [urlQuery, searchAttempt])

  function clearSearch() {
    setDraft(null)
    if (!searchParams.has('q')) return

    const nextParams = new URLSearchParams(location.search)
    nextParams.delete('q')
    void navigate(
      {
        pathname: location.pathname,
        search: nextParams.toString() ? `?${nextParams.toString()}` : '',
        hash: location.hash,
      },
      { preventScrollReset: true },
    )
  }

  const editorialProduct = products[4]
  const currentSearchResult = searchResult?.query === urlQuery && searchResult.attempt === searchAttempt
    ? searchResult
    : null

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

      <section id="catalogue" aria-labelledby="home-catalogue-heading" className="scroll-mt-8 border-t border-[var(--shop-primary)]/15 pt-12 sm:pt-16">
        <h2 id="home-catalogue-heading" className="text-3xl font-semibold tracking-tight text-[var(--shop-text)] sm:text-4xl">
          Explore the Catalogue
        </h2>
        <div className="mt-7 max-w-2xl">
          <label htmlFor="product-search" className="sr-only">Search products</label>
          <div className="flex min-w-0 items-center rounded-2xl border border-[var(--shop-primary)]/25 bg-white px-4 transition-colors focus-within:border-[var(--shop-primary)] focus-within:ring-2 focus-within:ring-[var(--shop-primary)]/20">
            <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-5 w-5 shrink-0 text-[var(--shop-accent)]">
              <circle cx="10.8" cy="10.8" r="6.8" />
              <path d="m16 16 5 5" strokeLinecap="round" />
            </svg>
            <input
              id="product-search"
              type="search"
              value={searchInput}
              onChange={(event) => setDraft({ locationKey: location.key, value: event.target.value })}
              onKeyDown={(event) => {
                if (event.key === 'Escape' && searchInput) clearSearch()
              }}
              placeholder="Search for products..."
              className="min-w-0 flex-1 appearance-none bg-transparent py-3.5 pl-3 text-[var(--shop-text)] outline-none placeholder:text-[var(--shop-text)]/55 [&::-webkit-search-cancel-button]:hidden"
            />
            {searchInput && (
              <button
                type="button"
                onClick={clearSearch}
                aria-label="Clear search"
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-[var(--shop-accent)] transition-colors hover:bg-[var(--shop-primary)]/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--shop-accent)]"
              >
                <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-5 w-5">
                  <path d="M5 5 19 19M19 5 5 19" strokeLinecap="round" />
                </svg>
              </button>
            )}
          </div>
        </div>
        {searchQuery && (searchQuery !== urlQuery || !currentSearchResult) ? (
          <p className="mt-8 text-[var(--shop-text)]" role="status">Searching products...</p>
        ) : searchQuery && currentSearchResult?.hasError ? (
          <div className="mt-8" role="alert">
            <p className="text-[var(--shop-accent)]">Unable to search products. Please try again.</p>
            <button
              type="button"
              onClick={() => setSearchAttempt((attempt) => attempt + 1)}
              className="mt-3 min-h-11 font-medium text-[var(--shop-accent)] underline underline-offset-4 hover:text-[var(--shop-primary)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--shop-accent)]"
            >
              Retry search
            </button>
          </div>
        ) : searchQuery && currentSearchResult?.response ? (
          <>
            <p className="mt-8 break-words text-[var(--shop-text)]" role="status" aria-live="polite">
              {currentSearchResult.response.total} {currentSearchResult.response.total === 1 ? 'product' : 'products'} found for “{urlQuery}”
            </p>
            {currentSearchResult.response.products.length === 0 ? (
              <div className="mt-8 max-w-xl">
                <h3 className="text-xl font-semibold text-[var(--shop-text)]">No products found</h3>
                <p className="mt-2 break-words leading-7 text-[var(--shop-text)]">We couldn’t find anything matching “{urlQuery}”. Try another search.</p>
                <button
                  type="button"
                  onClick={clearSearch}
                  className="mt-4 min-h-11 font-medium text-[var(--shop-accent)] underline underline-offset-4 hover:text-[var(--shop-primary)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--shop-accent)]"
                >
                  Clear search
                </button>
              </div>
            ) : (
              <ProductGrid products={currentSearchResult.response.products} headingLevel="h3" />
            )}
          </>
        ) : isLoading ? (
          <p className="mt-8 text-[var(--shop-text)]" role="status">Loading products...</p>
        ) : hasError ? (
          <p className="mt-8 text-[var(--shop-accent)]" role="alert">
            Unable to load products. Please try again later.
          </p>
        ) : products.length === 0 ? (
          <p className="mt-8 text-[var(--shop-text)]">No products found.</p>
        ) : (
          <ProductGrid products={products} headingLevel="h3" />
        )}
      </section>
    </div>
  )
}

export default HomePage
