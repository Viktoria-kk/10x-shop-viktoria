import { useEffect, useRef, useState, type FormEvent } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

function SearchIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-5 w-5">
      <circle cx="10.8" cy="10.8" r="6.8" />
      <path d="m16 16 5 5" strokeLinecap="round" />
    </svg>
  )
}

function CloseIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-5 w-5">
      <path d="M5 5 19 19M19 5 5 19" strokeLinecap="round" />
    </svg>
  )
}

function homeSearchTarget(search: string, hash: string, query: string) {
  const params = new URLSearchParams(search)
  if (query) params.set('q', query)
  else params.delete('q')

  return {
    pathname: '/',
    search: params.toString() ? `?${params.toString()}` : '',
    hash,
  }
}

function HeaderSearch() {
  const location = useLocation()
  const navigate = useNavigate()
  const toggleRef = useRef<HTMLButtonElement>(null)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [draft, setDraft] = useState<{ key: string; value: string } | null>(null)
  const urlQuery = location.pathname === '/' ? (new URLSearchParams(location.search).get('q') ?? '').trim() : ''
  const input = draft?.key === location.key ? draft.value : urlQuery

  useEffect(() => {
    if (location.pathname !== '/' || draft?.key !== location.key) return

    const query = draft.value.trim()
    if (query === urlQuery) return

    const timeout = window.setTimeout(() => {
      void navigate(homeSearchTarget(location.search, location.hash, query), { preventScrollReset: true })
      setDraft(null)
    }, 275)

    return () => window.clearTimeout(timeout)
  }, [draft, location, navigate, urlQuery])

  function updateInput(value: string) {
    setDraft({ key: location.key, value })
  }

  function submitSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const query = input.trim()

    if (location.pathname === '/') {
      void navigate(homeSearchTarget(location.search, '#catalogue', query))
    } else if (query) {
      void navigate(homeSearchTarget('', '#catalogue', query))
    }

    setDraft(null)
    setMobileOpen(false)
  }

  function clearSearch() {
    if (location.pathname === '/') {
      void navigate(homeSearchTarget(location.search, location.hash, ''), { preventScrollReset: true })
      setDraft(null)
      return
    }
    updateInput('')
  }

  return (
    <>
      <form role="search" onSubmit={submitSearch} className="hidden min-w-0 items-center rounded-xl border border-[var(--shop-primary)]/20 bg-[var(--shop-background)] px-2 focus-within:border-[var(--shop-primary)] focus-within:ring-2 focus-within:ring-[var(--shop-primary)]/20 lg:flex lg:w-52 xl:w-64">
        <label htmlFor="header-search" className="sr-only">Search products</label>
        <input
          id="header-search"
          type="search"
          value={input}
          onChange={(event) => updateInput(event.target.value)}
          placeholder="Search products..."
          className="min-w-0 flex-1 appearance-none bg-transparent py-2 pl-2 text-sm text-[var(--shop-text)] outline-none placeholder:text-[var(--shop-text)]/60 [&::-webkit-search-cancel-button]:hidden"
        />
        {input && (
          <button type="button" onClick={clearSearch} aria-label="Clear search" className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-[var(--shop-accent)] hover:bg-[var(--shop-primary)]/10 focus-visible:outline-2 focus-visible:outline-[var(--shop-accent)]">
            <CloseIcon />
          </button>
        )}
        <button type="submit" aria-label="Search products" className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-[var(--shop-accent)] hover:bg-[var(--shop-primary)]/10 focus-visible:outline-2 focus-visible:outline-[var(--shop-accent)]">
          <SearchIcon />
        </button>
      </form>

      <button
        ref={toggleRef}
        type="button"
        onClick={() => setMobileOpen((open) => !open)}
        aria-label={mobileOpen ? 'Close search' : 'Open search'}
        aria-expanded={mobileOpen}
        aria-controls={mobileOpen ? 'mobile-header-search' : undefined}
        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md text-[var(--shop-text)] hover:text-[var(--shop-primary)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--shop-accent)] lg:hidden"
      >
        <SearchIcon />
      </button>

      {mobileOpen && (
        <form
          id="mobile-header-search"
          role="search"
          onSubmit={submitSearch}
          className="absolute inset-x-4 top-full z-30 mt-2 flex min-w-0 items-center rounded-2xl border border-[var(--shop-primary)]/20 bg-white p-2 shadow-[0_8px_24px_rgba(44,44,44,0.12)] sm:inset-x-auto sm:right-6 sm:w-96 lg:hidden"
        >
          <label htmlFor="mobile-search" className="sr-only">Search products</label>
          <input
            id="mobile-search"
            type="search"
            autoFocus
            value={input}
            onChange={(event) => updateInput(event.target.value)}
            placeholder="Search products..."
            className="min-w-0 flex-1 appearance-none bg-transparent px-3 py-2 text-[var(--shop-text)] outline-none placeholder:text-[var(--shop-text)]/60 [&::-webkit-search-cancel-button]:hidden"
          />
          {input && (
            <button type="button" onClick={clearSearch} aria-label="Clear search" className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg text-[var(--shop-accent)] hover:bg-[var(--shop-primary)]/10 focus-visible:outline-2 focus-visible:outline-[var(--shop-accent)]">
              <CloseIcon />
            </button>
          )}
          <button type="submit" aria-label="Search products" className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg text-[var(--shop-accent)] hover:bg-[var(--shop-primary)]/10 focus-visible:outline-2 focus-visible:outline-[var(--shop-accent)]">
            <SearchIcon />
          </button>
          <button
            type="button"
            onClick={() => { setMobileOpen(false); toggleRef.current?.focus() }}
            aria-label="Close search"
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg text-[var(--shop-text)] hover:bg-[var(--shop-primary)]/10 focus-visible:outline-2 focus-visible:outline-[var(--shop-accent)]"
          >
            <CloseIcon />
          </button>
        </form>
      )}
    </>
  )
}

export default HeaderSearch
