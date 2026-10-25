import { useEffect, useRef, useState, type FormEvent } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

function SearchIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-5 w-5 shrink-0">
      <circle cx="10.8" cy="10.8" r="6.8" />
      <path d="m16 16 5 5" strokeLinecap="round" />
    </svg>
  )
}

function CloseIcon() {
  return <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-5 w-5"><path d="M5 5 19 19M19 5 5 19" strokeLinecap="round" /></svg>
}

function homeSearchTarget(search: string, hash: string, query: string) {
  const params = new URLSearchParams(search)
  const previousQuery = (params.get('q') ?? '').trim()
  if (query) params.set('q', query)
  else params.delete('q')
  if (query !== previousQuery) params.delete('page')

  return { pathname: '/', search: params.toString() ? `?${params}` : '', hash }
}

function HeaderSearch() {
  const location = useLocation()
  const navigate = useNavigate()
  const toggleRef = useRef<HTMLButtonElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const [isOpen, setIsOpen] = useState(false)
  const [draft, setDraft] = useState<{ key: string; value: string } | null>(null)
  const urlQuery = (new URLSearchParams(location.search).get('q') ?? '').trim()
  const input = draft?.key === location.key ? draft.value : urlQuery

  useEffect(() => {
    if (isOpen) inputRef.current?.focus()
  }, [isOpen])

  useEffect(() => {
    if (!isOpen || location.pathname !== '/' || draft?.key !== location.key) return
    const query = draft.value.trim()
    if (query === urlQuery) return

    const timeout = window.setTimeout(() => {
      void navigate(homeSearchTarget(location.search, location.hash, query), { preventScrollReset: true })
      setDraft(null)
    }, 275)
    return () => window.clearTimeout(timeout)
  }, [isOpen, draft, location, navigate, urlQuery])

  function closeSearch() {
    setIsOpen(false)
    setDraft(null)
    toggleRef.current?.focus()
  }

  function submitSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const query = input.trim()
    const search = location.pathname === '/' ? location.search : ''
    void navigate(homeSearchTarget(search, '#catalogue', query))
    setDraft(null)
    setIsOpen(false)
  }

  function clearSearch() {
    if (location.pathname === '/') {
      void navigate(homeSearchTarget(location.search, location.hash, ''), { preventScrollReset: true })
      setDraft(null)
    } else {
      setDraft({ key: location.key, value: '' })
    }
    inputRef.current?.focus()
  }

  return (
    <>
      <button
        ref={toggleRef}
        type="button"
        onClick={() => isOpen ? closeSearch() : setIsOpen(true)}
        aria-expanded={isOpen}
        aria-controls={isOpen ? 'header-search-panel' : undefined}
        className="inline-flex min-h-11 items-center gap-2 rounded-md px-2 text-sm font-medium text-[var(--shop-text)] hover:text-[var(--shop-primary)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--shop-accent)] sm:px-3"
      >
        <SearchIcon /> Search
      </button>

      {isOpen && (
        <form
          id="header-search-panel"
          role="search"
          onSubmit={submitSearch}
          onKeyDown={(event) => { if (event.key === 'Escape') { event.preventDefault(); closeSearch() } }}
          className="absolute inset-x-4 top-full z-30 mt-2 flex min-w-0 items-center gap-1 rounded-2xl bg-white p-2 shadow-[0_8px_24px_rgba(44,44,44,0.12)] focus-within:ring-2 focus-within:ring-[var(--shop-accent)] sm:inset-x-auto sm:right-6 sm:w-96 lg:right-8"
        >
          <label htmlFor="header-search" className="sr-only">Search products</label>
          <span className="pl-2 text-[var(--shop-accent)]"><SearchIcon /></span>
          <input
            ref={inputRef}
            id="header-search"
            type="search"
            value={input}
            onChange={(event) => setDraft({ key: location.key, value: event.target.value })}
            placeholder="Search products..."
            className="min-w-0 flex-1 appearance-none bg-transparent px-1 py-2 text-sm text-[var(--shop-text)] outline-none placeholder:text-[var(--shop-text)]/60 [&::-webkit-search-cancel-button]:hidden"
          />
          {input && <button type="button" onClick={clearSearch} aria-label="Clear search" className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg text-[var(--shop-accent)] hover:bg-[var(--shop-primary)]/10 focus-visible:outline-2 focus-visible:outline-[var(--shop-accent)]"><CloseIcon /></button>}
          <button type="submit" aria-label="Search products" className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg text-[var(--shop-accent)] hover:bg-[var(--shop-primary)]/10 focus-visible:outline-2 focus-visible:outline-[var(--shop-accent)]"><SearchIcon /></button>
          <button type="button" onClick={closeSearch} aria-label="Close search" className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg text-[var(--shop-text)] hover:bg-[var(--shop-primary)]/10 focus-visible:outline-2 focus-visible:outline-[var(--shop-accent)]"><CloseIcon /></button>
        </form>
      )}
    </>
  )
}

export default HeaderSearch
