import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

const navigationItems = [
  { label: 'Catalogue', to: '/' },
  { label: 'Cart', to: '/cart' },
]

const navigationItemClasses =
  'inline-flex min-h-11 items-center rounded-md px-3 text-sm font-medium focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-400'

function navigationLinkClasses(isActive: boolean) {
  return `${navigationItemClasses} ${
    isActive
      ? 'bg-rose-100 text-rose-950 underline underline-offset-4'
      : 'text-stone-700 hover:bg-rose-50 hover:text-rose-900'
  }`
}

function Header() {
  const { isLoggedIn, logout } = useAuth()
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    navigate('/')
  }

  return (
    <header className="border-b border-rose-100 bg-white">
      <div className="mx-auto flex max-w-6xl flex-col gap-2 px-6 py-3 sm:flex-row sm:items-center sm:justify-between sm:gap-6 sm:px-8">
        <Link
          to="/"
          className="inline-flex min-h-11 items-center self-start rounded-md text-lg font-semibold tracking-tight text-rose-900 hover:text-rose-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-400"
        >
          10X Shop
        </Link>
        <nav aria-label="Main navigation" className="flex flex-wrap items-center gap-1">
          {navigationItems.map(({ label, to }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              className={({ isActive }) => navigationLinkClasses(isActive)}
            >
              {label}
            </NavLink>
          ))}
          {isLoggedIn ? (
            <button
              type="button"
              onClick={handleLogout}
              className={`${navigationItemClasses} cursor-pointer text-stone-700 hover:bg-rose-50 hover:text-rose-900`}
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
