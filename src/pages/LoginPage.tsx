import { useState, type FormEvent } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import type { LoginFormValues } from '../types/user'

type LoginErrors = Partial<Record<keyof LoginFormValues, string>>

function LoginPage() {
  const [values, setValues] = useState<LoginFormValues>({ username: '', password: '' })
  const [errors, setErrors] = useState<LoginErrors>({})
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  function updateField(field: keyof LoginFormValues, value: string) {
    setValues((current) => ({ ...current, [field]: value }))
    setErrors((current) => ({ ...current, [field]: undefined }))
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const username = values.username.trim()
    const nextErrors: LoginErrors = {}

    if (!username) nextErrors.username = 'Username is required'
    if (!values.password) {
      nextErrors.password = 'Password is required'
    } else if (values.password.length < 6) {
      nextErrors.password = 'Password must be at least 6 characters'
    }

    setErrors(nextErrors)
    if (nextErrors.username || nextErrors.password) return

    login(username)

    const navigationState: unknown = location.state
    const destination =
      navigationState !== null &&
      typeof navigationState === 'object' &&
      'from' in navigationState &&
      navigationState.from === '/checkout'
        ? '/checkout'
        : '/'

    navigate(destination, { replace: true })
  }

  const inputClasses =
    'mt-2 block min-h-12 w-full rounded-xl border bg-white px-4 text-[var(--shop-text)] outline-none transition-colors placeholder:text-[var(--shop-accent)] focus-visible:border-[var(--shop-accent)] focus-visible:ring-2 focus-visible:ring-[var(--shop-accent)]'

  return (
    <section className="mx-auto w-full max-w-md">
      <Link
        to="/"
        className="inline-flex min-h-11 items-center rounded-lg text-sm font-medium text-[var(--shop-accent)] hover:text-[var(--shop-primary)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--shop-accent)]"
      >
        ← Back to catalogue
      </Link>

      <h1 className="mt-8 text-3xl font-semibold tracking-tight text-[var(--shop-text)] sm:text-4xl">Log in</h1>
      <p className="mt-3 text-[var(--shop-text)]">Enter your details to continue shopping.</p>

      <form className="mt-8 space-y-6 sm:mt-10" onSubmit={handleSubmit} noValidate>
        <div>
          <label htmlFor="username" className="block text-sm font-medium text-[var(--shop-text)]">
            Username
          </label>
          <input
            id="username"
            name="username"
            type="text"
            autoComplete="username"
            value={values.username}
            onChange={(event) => updateField('username', event.target.value)}
            aria-invalid={Boolean(errors.username)}
            aria-describedby={errors.username ? 'username-error' : undefined}
            className={`${inputClasses} ${errors.username ? 'border-[var(--shop-primary)]' : 'border-[var(--shop-accent)]'}`}
          />
          {errors.username && (
            <p id="username-error" className="mt-2 text-sm text-[var(--shop-accent)]">
              {errors.username}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-[var(--shop-text)]">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            value={values.password}
            onChange={(event) => updateField('password', event.target.value)}
            aria-invalid={Boolean(errors.password)}
            aria-describedby={errors.password ? 'password-error' : undefined}
            className={`${inputClasses} ${errors.password ? 'border-[var(--shop-primary)]' : 'border-[var(--shop-accent)]'}`}
          />
          {errors.password && (
            <p id="password-error" className="mt-2 text-sm text-[var(--shop-accent)]">
              {errors.password}
            </p>
          )}
        </div>

        <button
          type="submit"
          className="min-h-12 w-full cursor-pointer rounded-xl bg-[var(--shop-primary)] px-5 font-medium text-white transition-colors hover:bg-[var(--shop-accent)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--shop-accent)]"
        >
          Log In
        </button>
      </form>
    </section>
  )
}

export default LoginPage
