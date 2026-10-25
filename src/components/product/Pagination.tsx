interface PaginationProps {
  page: number
  totalPages: number
  onPageChange: (page: number) => void
}

function Pagination({ page, totalPages, onPageChange }: PaginationProps) {
  if (totalPages <= 1) return null

  const pages = [...new Set([1, page - 1, page, page + 1, totalPages])]
    .filter((number) => number >= 1 && number <= totalPages)
    .sort((first, second) => first - second)

  const buttonClasses = 'min-h-11 min-w-11 rounded-lg px-3 font-medium focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--shop-accent)] disabled:cursor-not-allowed disabled:opacity-40'

  return (
    <nav aria-label="Catalogue pages" className="mt-9 flex flex-wrap items-center justify-center gap-1 sm:gap-2">
      <button type="button" disabled={page === 1} onClick={() => onPageChange(page - 1)} className={`${buttonClasses} text-[var(--shop-accent)] hover:enabled:bg-[var(--shop-primary)]/10`}>Previous</button>
      {pages.map((number, index) => (
        <span key={number} className="contents">
          {index > 0 && number - pages[index - 1] > 1 && <span aria-hidden="true" className="px-1 text-[var(--shop-text)]">…</span>}
          <button
            type="button"
            onClick={() => onPageChange(number)}
            aria-label={`Page ${number}`}
            aria-current={number === page ? 'page' : undefined}
            className={`${buttonClasses} ${number === page ? 'bg-[var(--shop-primary)] text-white' : 'text-[var(--shop-accent)] hover:bg-[var(--shop-primary)]/10'}`}
          >
            {number}
          </button>
        </span>
      ))}
      <button type="button" disabled={page === totalPages} onClick={() => onPageChange(page + 1)} className={`${buttonClasses} text-[var(--shop-accent)] hover:enabled:bg-[var(--shop-primary)]/10`}>Next</button>
    </nav>
  )
}

export default Pagination
