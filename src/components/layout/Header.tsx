import { Link, NavLink, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useCart } from '../../context/cart-context'
import HeaderSearch from './HeaderSearch'

const navigationItems = [
  { label: 'Home', to: '/' },
  { label: 'Catalogue', to: '/catalogue' },
  { label: 'Cart', to: '/cart' },
]

const navigationItemClasses =
  'inline-flex min-h-11 items-center rounded-md px-2 text-sm font-medium focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--shop-accent)] sm:px-3'

function navigationLinkClasses(isActive: boolean) {
  return `${navigationItemClasses} ${
    isActive
      ? 'text-[var(--shop-accent)] underline underline-offset-4'
      : 'text-[var(--shop-text)] hover:text-[var(--shop-primary)] hover:underline hover:underline-offset-4'
  }`
}

function Header() {
  const { isLoggedIn } = useAuth()
  const { itemCount } = useCart()
  const location = useLocation()

  return (
    <header className="relative border-b border-[var(--shop-background)] bg-white">
      <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-3 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:gap-4 lg:px-8">
        <Link
          to="/"
          className="inline-flex min-h-11 items-center self-start rounded-md text-lg font-semibold tracking-tight text-[var(--shop-primary)] hover:text-[var(--shop-accent)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--shop-accent)]"
        >
          10X Shop
        </Link>
        <nav aria-label="Main navigation" className="flex w-full min-w-0 flex-wrap items-center gap-1 lg:w-auto lg:flex-1 lg:justify-end">
          {navigationItems.map(({ label, to }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              aria-label={
                to === '/cart' && itemCount > 0
                  ? `Cart, ${itemCount} ${itemCount === 1 ? 'item' : 'items'}`
                  : undefined
              }
              className={({ isActive }) => navigationLinkClasses(isActive)}
            >
              {label}
              {to === '/cart' && itemCount > 0 && (
                <span
                  aria-hidden="true"
                  className="ml-2 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-[var(--shop-accent)] px-1 text-xs font-semibold leading-none text-white no-underline"
                >
                  {itemCount}
                </span>
              )}
            </NavLink>
          ))}
          <HeaderSearch key={location.pathname} />
          <NavLink
            to={isLoggedIn ? '/profile' : '/login'}
            state={!isLoggedIn && (location.pathname === '/login' || location.pathname === '/signup') ? location.state : undefined}
            className={({ isActive }) => navigationLinkClasses(isActive || (!isLoggedIn && location.pathname === '/signup'))}
          >
            <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="mr-2 h-5 w-5 shrink-0"><circle cx="12" cy="8" r="3.5" /><path d="M5 20c0-3.5 3-6 7-6s7 2.5 7 6" strokeLinecap="round" /></svg>
            {isLoggedIn ? 'Account' : 'Log in'}
          </NavLink>
        </nav>
      </div>
    </header>
  )
}

export default Header
