import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function ProfilePage() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  // ProtectedRoute keeps guests on Login.
  if (!user) return null

  function handleLogout() {
    logout()
    navigate('/', { replace: true })
  }

  return (
    <section className="mx-auto w-full max-w-3xl">
      <h1 className="text-4xl font-semibold tracking-tight text-[var(--shop-text)] sm:text-5xl">
        My account
      </h1>
      <p className="mt-4 max-w-prose leading-7 text-[var(--shop-text)]">
        Welcome back. Your next find is just around the corner.
      </p>

      <div className="mt-12 flex min-w-0 items-center gap-5 sm:gap-7">
        <div
          aria-hidden="true"
          className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-[var(--shop-primary)] text-3xl font-semibold text-white sm:h-24 sm:w-24"
        >
          {user.username.charAt(0).toLocaleUpperCase()}
        </div>
        <div className="min-w-0">
          <p className="text-sm font-medium text-[var(--shop-accent)]">Signed in as</p>
          <p className="mt-1 break-words text-2xl font-semibold leading-tight text-[var(--shop-text)] sm:text-3xl">
            {user.username}
          </p>
          {user.email && (
            <p className="mt-2 break-all text-[var(--shop-text)]">{user.email}</p>
          )}
        </div>
      </div>

      <div className="mt-12 border-t border-[var(--shop-primary)]/20 pt-8 sm:mt-14">
        <h2 className="text-xl font-semibold text-[var(--shop-text)]">About this account</h2>
        <p className="mt-3 max-w-prose leading-7 text-[var(--shop-text)]">
          Your account is part of this demo session. It ends when you refresh or log out.
        </p>
      </div>

      <div className="mt-10 flex flex-col items-start gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:gap-5">
        <Link
          to="/#catalogue"
          className="inline-flex min-h-12 items-center justify-center rounded-xl bg-[var(--shop-primary)] px-6 font-medium text-white transition-colors hover:bg-[var(--shop-accent)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--shop-accent)]"
        >
          Continue shopping
        </Link>
        <Link
          to="/cart"
          className="inline-flex min-h-11 items-center rounded-lg font-medium text-[var(--shop-accent)] underline underline-offset-4 hover:text-[var(--shop-primary)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--shop-accent)]"
        >
          View cart
        </Link>
        <button
          type="button"
          onClick={handleLogout}
          className="min-h-11 cursor-pointer rounded-lg font-medium text-[var(--shop-accent)] underline underline-offset-4 hover:text-[var(--shop-primary)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--shop-accent)]"
        >
          Log out
        </button>
      </div>
    </section>
  )
}

export default ProfilePage
