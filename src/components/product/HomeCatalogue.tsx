import { useEffect, useState } from 'react'
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import { fetchProducts, searchProducts } from '../../api/products.api'
import type { ProductsResponse } from '../../types/product'
import Pagination from './Pagination'
import ProductGrid from './ProductGrid'

interface HomeCatalogueProps {
  pageOne: ProductsResponse | null
  isLoading: boolean
  hasError: boolean
  query: string
}

interface PageResult {
  key: string
  response?: ProductsResponse
  hasError?: boolean
}

const PAGE_SIZE = 12

function HomeCatalogue({ pageOne, isLoading, hasError, query }: HomeCatalogueProps) {
  const [searchParams] = useSearchParams()
  const location = useLocation()
  const navigate = useNavigate()
  const [draft, setDraft] = useState<{ key: string; value: string } | null>(null)
  const [result, setResult] = useState<PageResult | null>(null)
  const [retry, setRetry] = useState(0)
  const rawPage = searchParams.get('page')
  const parsedPage = rawPage === null ? 1 : Number(rawPage)
  const page = rawPage !== null && /^\d+$/.test(rawPage) && Number.isSafeInteger(parsedPage)
    && parsedPage > 0 && parsedPage <= Math.floor(Number.MAX_SAFE_INTEGER / PAGE_SIZE)
    ? parsedPage
    : 1
  const input = draft?.key === location.key ? draft.value : query
  const inputQuery = input.trim()
  const totalPages = pageOne ? Math.max(1, Math.ceil(pageOne.total / PAGE_SIZE)) : null
  const knownLastPage = query ? null : totalPages
  const requestKey = `${query}\u0000${page}`

  useEffect(() => {
    if (rawPage === null || (String(page) === rawPage && (!knownLastPage || page <= knownLastPage))) return
    const params = new URLSearchParams(location.search)
    const validPage = knownLastPage ? Math.min(page, knownLastPage) : page
    if (validPage === 1) params.delete('page')
    else params.set('page', String(validPage))
    void navigate({ pathname: '/', search: params.toString() ? `?${params}` : '', hash: location.hash }, { replace: true, preventScrollReset: true })
  }, [rawPage, page, knownLastPage, location.search, location.hash, navigate])

  useEffect(() => {
    if (draft?.key !== location.key || inputQuery === query) return
    const timeout = window.setTimeout(() => {
      const params = new URLSearchParams(location.search)
      if (inputQuery) params.set('q', inputQuery)
      else params.delete('q')
      params.delete('page')
      void navigate({ pathname: '/', search: params.toString() ? `?${params}` : '', hash: location.hash }, { preventScrollReset: true })
      setDraft(null)
    }, 275)
    return () => window.clearTimeout(timeout)
  }, [draft, inputQuery, query, location, navigate])

  useEffect(() => {
    if (!query && (page === 1 || knownLastPage === null || page > knownLastPage)) return
    const controller = new AbortController()

    async function loadPage() {
      try {
        const response = query
          ? await searchProducts(query, (page - 1) * PAGE_SIZE, controller.signal)
          : await fetchProducts((page - 1) * PAGE_SIZE, controller.signal)
        if (!controller.signal.aborted) setResult({ key: requestKey, response })
      } catch {
        if (!controller.signal.aborted) setResult({ key: requestKey, hasError: true })
      }
    }

    void loadPage()
    return () => controller.abort()
  }, [query, page, knownLastPage, requestKey, retry])

  function clearSearch() {
    setDraft(null)
    const params = new URLSearchParams(location.search)
    params.delete('q')
    params.delete('page')
    void navigate({ pathname: '/', search: params.toString() ? `?${params}` : '', hash: location.hash }, { preventScrollReset: true })
  }

  function changePage(nextPage: number) {
    if (nextPage === page) return
    const params = new URLSearchParams(location.search)
    if (nextPage === 1) params.delete('page')
    else params.set('page', String(nextPage))
    void navigate({ pathname: '/', search: params.toString() ? `?${params}` : '', hash: '#catalogue' }, { preventScrollReset: true })
    document.getElementById('catalogue')?.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' })
  }

  const response = !query && page === 1 ? pageOne : result?.key === requestKey ? result.response : undefined
  const requestFailed = !query && !pageOne && hasError
    ? true
    : !query && page === 1
      ? hasError
      : result?.key === requestKey && result.hasError
  const pageCount = response ? Math.max(1, Math.ceil(response.total / PAGE_SIZE)) : null
  const isOutOfRange = pageCount !== null && page > pageCount

  useEffect(() => {
    if (!query || !isOutOfRange || pageCount === null) return
    const params = new URLSearchParams(location.search)
    if (pageCount === 1) params.delete('page')
    else params.set('page', String(pageCount))
    void navigate({ pathname: '/', search: params.toString() ? `?${params}` : '', hash: location.hash }, { replace: true, preventScrollReset: true })
  }, [query, isOutOfRange, pageCount, location.search, location.hash, navigate])

  return (
    <section id="catalogue" aria-labelledby="home-catalogue-heading" className="scroll-mt-8 border-t border-[var(--shop-primary)]/15 pt-12 sm:pt-16">
      <h2 id="home-catalogue-heading" className="text-3xl font-semibold tracking-tight text-[var(--shop-text)] sm:text-4xl">Explore the Catalogue</h2>
      <div className="mt-7 max-w-2xl">
        <label htmlFor="product-search" className="sr-only">Search products</label>
        <div className="flex min-w-0 items-center rounded-2xl border border-[var(--shop-primary)]/25 bg-white px-4 focus-within:border-[var(--shop-primary)] focus-within:ring-2 focus-within:ring-[var(--shop-primary)]/20">
          <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-5 w-5 shrink-0 text-[var(--shop-accent)]"><circle cx="10.8" cy="10.8" r="6.8" /><path d="m16 16 5 5" strokeLinecap="round" /></svg>
          <input id="product-search" type="search" value={input} onChange={(event) => setDraft({ key: location.key, value: event.target.value })} onKeyDown={(event) => { if (event.key === 'Escape' && input) clearSearch() }} placeholder="Search for products..." className="min-w-0 flex-1 appearance-none bg-transparent py-3.5 pl-3 text-[var(--shop-text)] outline-none placeholder:text-[var(--shop-text)]/55 [&::-webkit-search-cancel-button]:hidden" />
          {input && <button type="button" onClick={clearSearch} aria-label="Clear search" className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-[var(--shop-accent)] hover:bg-[var(--shop-primary)]/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--shop-accent)]"><svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-5 w-5"><path d="M5 5 19 19M19 5 5 19" strokeLinecap="round" /></svg></button>}
        </div>
      </div>

      {inputQuery !== query || isOutOfRange || (!response && !requestFailed) || (!query && isLoading) ? (
        <p className="mt-8 text-[var(--shop-text)]" role="status">{query ? 'Searching products...' : 'Loading products...'}</p>
      ) : requestFailed ? (
        <div className="mt-8" role="alert">
          <p className="text-[var(--shop-accent)]">{query ? 'Unable to search products. Please try again.' : 'Unable to load products. Please try again later.'}</p>
          {(query || (page > 1 && pageOne)) && <button type="button" onClick={() => { setResult(null); setRetry((current) => current + 1) }} className="mt-3 min-h-11 font-medium text-[var(--shop-accent)] underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--shop-accent)]">Retry</button>}
        </div>
      ) : response && response.products.length === 0 ? (
        <div className="mt-8">
          <p className="text-[var(--shop-text)]">No products found.</p>
          {query && <button type="button" onClick={clearSearch} className="mt-3 min-h-11 font-medium text-[var(--shop-accent)] underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--shop-accent)]">Clear search</button>}
        </div>
      ) : response ? (
        <>
          <p className="mt-8 break-words text-[var(--shop-text)]" role="status">
            {query && `${response.total} ${response.total === 1 ? 'product' : 'products'} found for “${query}” · `}
            Showing {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, response.total)} of {response.total} products
          </p>
          <ProductGrid products={response.products} headingLevel="h3" />
          <Pagination page={page} totalPages={pageCount ?? 1} onPageChange={changePage} />
        </>
      ) : null}
    </section>
  )
}

export default HomeCatalogue
