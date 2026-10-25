import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { searchProducts } from '../../api/products.api'
import type { Product } from '../../types/product'
import ProductGrid from './ProductGrid'

interface HomeCatalogueProps {
  products: Product[]
  isLoading: boolean
  hasError: boolean
  query: string
}

type SearchResult = {
  products: Product[]
  total: number
  hasError: boolean
}

function SearchResults({ query, onClear }: { query: string; onClear: () => void }) {
  const [result, setResult] = useState<SearchResult | null>(null)
  const [skip, setSkip] = useState(0)
  const [retry, setRetry] = useState(0)
  const [moreError, setMoreError] = useState(false)

  useEffect(() => {
    const controller = new AbortController()

    async function loadResults() {
      try {
        const response = await searchProducts(query, skip, controller.signal)
        if (controller.signal.aborted) return

        if (skip === 0) {
          setResult({ products: response.products, total: response.total, hasError: false })
        } else {
          setResult((current) => current && current.products.length === skip
            ? { products: [...current.products, ...response.products], total: response.total, hasError: false }
            : current)
        }
      } catch {
        if (controller.signal.aborted) return

        if (skip === 0) setResult({ products: [], total: 0, hasError: true })
        else setMoreError(true)
      }
    }

    void loadResults()
    return () => controller.abort()
  }, [query, skip, retry])

  if (!result) return <p className="mt-8 text-[var(--shop-text)]" role="status">Searching products...</p>

  if (result.hasError) {
    return (
      <div className="mt-8" role="alert">
        <p className="text-[var(--shop-accent)]">Unable to search products. Please try again.</p>
        <button
          type="button"
          onClick={() => { setResult(null); setRetry((current) => current + 1) }}
          className="mt-3 min-h-11 font-medium text-[var(--shop-accent)] underline underline-offset-4 hover:text-[var(--shop-primary)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--shop-accent)]"
        >
          Retry search
        </button>
      </div>
    )
  }

  const isLoadingMore = skip > 0 && result.products.length === skip && !moreError

  return (
    <>
      <p className="mt-8 break-words text-[var(--shop-text)]" role="status">
        {result.total} {result.total === 1 ? 'product' : 'products'} found for “{query}”
        {result.total > result.products.length && ` · Showing ${result.products.length}`}
      </p>
      {result.products.length === 0 ? (
        <div className="mt-8 max-w-xl">
          <h3 className="text-xl font-semibold text-[var(--shop-text)]">No products found</h3>
          <p className="mt-2 break-words leading-7 text-[var(--shop-text)]">Try searching for something else.</p>
          <button
            type="button"
            onClick={onClear}
            className="mt-4 min-h-11 font-medium text-[var(--shop-accent)] underline underline-offset-4 hover:text-[var(--shop-primary)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--shop-accent)]"
          >
            Clear search
          </button>
        </div>
      ) : (
        <>
          <ProductGrid products={result.products} headingLevel="h3" />
          {result.products.length < result.total && (
            <div className="mt-8" aria-live="polite">
              {moreError && <p className="text-[var(--shop-accent)]" role="alert">Unable to load more products.</p>}
              <button
                type="button"
                disabled={isLoadingMore}
                onClick={() => {
                  if (moreError) {
                    setMoreError(false)
                    setRetry((current) => current + 1)
                  } else {
                    setSkip(result.products.length)
                  }
                }}
                className="min-h-11 rounded-lg font-medium text-[var(--shop-accent)] underline underline-offset-4 hover:text-[var(--shop-primary)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--shop-accent)] disabled:cursor-wait disabled:opacity-60"
              >
                {isLoadingMore ? 'Loading more...' : moreError ? 'Retry loading more' : 'Load more products'}
              </button>
            </div>
          )}
        </>
      )}
    </>
  )
}

function HomeCatalogue({ products, isLoading, hasError, query }: HomeCatalogueProps) {
  const location = useLocation()
  const navigate = useNavigate()
  const [draft, setDraft] = useState<{ key: string; value: string } | null>(null)
  const input = draft?.key === location.key ? draft.value : query
  const inputQuery = input.trim()

  useEffect(() => {
    if (draft?.key !== location.key || inputQuery === query) return

    const timeout = window.setTimeout(() => {
      const params = new URLSearchParams(location.search)
      if (inputQuery) params.set('q', inputQuery)
      else params.delete('q')

      void navigate(
        {
          pathname: '/',
          search: params.toString() ? `?${params.toString()}` : '',
          hash: location.hash,
        },
        { preventScrollReset: true },
      )
      setDraft(null)
    }, 275)

    return () => window.clearTimeout(timeout)
  }, [draft, inputQuery, query, location, navigate])

  function clearSearch() {
    setDraft(null)
    if (!new URLSearchParams(location.search).has('q')) return

    const params = new URLSearchParams(location.search)
    params.delete('q')
    void navigate(
      {
        pathname: '/',
        search: params.toString() ? `?${params.toString()}` : '',
        hash: location.hash,
      },
      { preventScrollReset: true },
    )
  }

  return (
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
            value={input}
            onChange={(event) => setDraft({ key: location.key, value: event.target.value })}
            onKeyDown={(event) => {
              if (event.key === 'Escape' && input) clearSearch()
            }}
            placeholder="Search for products..."
            className="min-w-0 flex-1 appearance-none bg-transparent py-3.5 pl-3 text-[var(--shop-text)] outline-none placeholder:text-[var(--shop-text)]/55 [&::-webkit-search-cancel-button]:hidden"
          />
          {input && (
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

      {inputQuery && inputQuery !== query ? (
        <p className="mt-8 text-[var(--shop-text)]" role="status">Searching products...</p>
      ) : inputQuery ? (
        <SearchResults key={query} query={query} onClear={clearSearch} />
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
  )
}

export default HomeCatalogue
