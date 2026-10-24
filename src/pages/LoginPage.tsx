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
    'mt-2 block min-h-12 w-full rounded-xl border bg-[#FFF8FA] px-4 text-stone-900 outline-none transition-colors placeholder:text-stone-500 focus-visible:border-[#5E7192] focus-visible:ring-2 focus-visible:ring-[#CAD8ED]'

  return (
    <section className="mx-auto w-full max-w-md">
      <Link
        to="/"
        className="inline-flex min-h-11 items-center rounded-lg text-sm font-medium text-[#5E7192] hover:text-rose-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#5E7192]"
      >
        ← Back to catalog
      </Link>

      <h1 className="mt-8 text-4xl font-semibold tracking-tight text-stone-900">Log in</h1>
      <p className="mt-3 text-stone-600">Enter your details to continue shopping.</p>

      <form className="mt-10 space-y-6" onSubmit={handleSubmit} noValidate>
        <div>
          <label htmlFor="username" className="block text-sm font-medium text-stone-800">
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
            className={`${inputClasses} ${errors.username ? 'border-rose-600' : 'border-rose-200'}`}
          />
          {errors.username && (
            <p id="username-error" className="mt-2 text-sm text-rose-800">
              {errors.username}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-stone-800">
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
            className={`${inputClasses} ${errors.password ? 'border-rose-600' : 'border-rose-200'}`}
          />
          {errors.password && (
            <p id="password-error" className="mt-2 text-sm text-rose-800">
              {errors.password}
            </p>
          )}
        </div>

        <button
          type="submit"
          className="min-h-12 w-full cursor-pointer rounded-xl bg-[#5E7192] px-5 font-medium text-white transition-colors hover:bg-[#4c5d7b] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#5E7192]"
        >
          Log In
        </button>
      </form>
    </section>
  )
}

export default LoginPage
