import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useCart } from '../../context/cart-context'

const navigationItems = [
  { label: 'Catalogue', to: '/' },
  { label: 'Cart', to: '/cart' },
]

const navigationItemClasses =
  'inline-flex min-h-11 items-center rounded-md px-3 text-sm font-medium focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--shop-accent)]'

function navigationLinkClasses(isActive: boolean) {
  return `${navigationItemClasses} ${
    isActive
      ? 'text-[var(--shop-accent)] underline underline-offset-4'
      : 'text-[var(--shop-text)] hover:text-[var(--shop-primary)] hover:underline hover:underline-offset-4'
  }`
}

function Header() {
  const { isLoggedIn, logout } = useAuth()
  const { itemCount } = useCart()
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    navigate('/')
  }

  return (
    <header className="border-b border-[var(--shop-background)] bg-white">
      <div className="mx-auto flex max-w-6xl flex-col gap-2 px-6 py-3 sm:flex-row sm:items-center sm:justify-between sm:gap-6 sm:px-8">
        <Link
          to="/"
          className="inline-flex min-h-11 items-center self-start rounded-md text-lg font-semibold tracking-tight text-[var(--shop-primary)] hover:text-[var(--shop-accent)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--shop-accent)]"
        >
          10X Shop
        </Link>
        <nav aria-label="Main navigation" className="flex flex-wrap items-center gap-1">
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
          {isLoggedIn ? (
            <button
              type="button"
              onClick={handleLogout}
              className={`${navigationItemClasses} cursor-pointer text-[var(--shop-text)] hover:text-[var(--shop-primary)] hover:underline hover:underline-offset-4`}
            >
              Log out
            </button>
          ) : (
            <NavLink
              to="/login"
              className={({ isActive }) => navigationLinkClasses(isActive)}
            >
              Log in
            </NavLink>
          )}
        </nav>
      </div>
    </header>
  )
}

export default Header
