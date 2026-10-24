import { Link, NavLink } from 'react-router-dom'

const navigationItems = [
  { label: 'Catalog', to: '/' },
  { label: 'Cart', to: '/cart' },
  { label: 'Log in', to: '/login' },
]

function Header() {
  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-6xl flex-col gap-2 px-6 py-3 sm:flex-row sm:items-center sm:justify-between sm:gap-6 sm:px-8">
        <Link
          to="/"
          className="inline-flex min-h-11 items-center self-start rounded-md text-lg font-semibold tracking-tight text-slate-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900"
        >
          10X Shop
        </Link>
        <nav aria-label="Main navigation" className="flex flex-wrap items-center gap-1">
          {navigationItems.map(({ label, to }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              className={({ isActive }) =>
                `inline-flex min-h-11 items-center rounded-md px-3 text-sm font-medium focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900 ${
                  isActive
                    ? 'bg-slate-100 text-slate-950 underline underline-offset-4'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-950'
                }`
              }
            >
              {label}
            </NavLink>
          ))}
        </nav>
      </div>
    </header>
  )
}

export default Header
