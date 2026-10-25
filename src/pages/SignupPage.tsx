import { useState, type FormEvent } from 'react'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import type { SignupFormValues } from '../types/user'

type SignupErrors = Partial<Record<keyof SignupFormValues, string>>

const signupFields = [
  { name: 'username', label: 'Username', type: 'text', autoComplete: 'username' },
  { name: 'email', label: 'Email', type: 'email', autoComplete: 'email' },
  { name: 'password', label: 'Password', type: 'password', autoComplete: 'new-password' },
  {
    name: 'confirmPassword',
    label: 'Confirm password',
    type: 'password',
    autoComplete: 'new-password',
  },
] as const

function SignupPage() {
  const [values, setValues] = useState<SignupFormValues>({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  })
  const [errors, setErrors] = useState<SignupErrors>({})
  const { isLoggedIn, login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  function updateField(field: keyof SignupFormValues, value: string) {
    setValues((current) => ({ ...current, [field]: value }))
    setErrors((current) => ({
      ...current,
      [field]: undefined,
      ...(field === 'password' ? { confirmPassword: undefined } : {}),
    }))
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const username = values.username.trim()
    const email = values.email.trim()
    const nextErrors: SignupErrors = {}

    if (!username) {
      nextErrors.username = 'Username is required'
    } else if (username.length < 3) {
      nextErrors.username = 'Username must be at least 3 characters'
    }

    if (!email) {
      nextErrors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      nextErrors.email = 'Please enter a valid email address'
    }

    if (!values.password) {
      nextErrors.password = 'Password is required'
    } else if (values.password.length < 6) {
      nextErrors.password = 'Password must be at least 6 characters'
    }

    if (!values.confirmPassword) {
      nextErrors.confirmPassword = 'Please confirm your password'
    } else if (values.confirmPassword !== values.password) {
      nextErrors.confirmPassword = 'Passwords do not match'
    }

    setErrors(nextErrors)
    if (Object.values(nextErrors).some(Boolean)) return

    login(username)

    const navigationState: unknown = location.state
    const destination =
      navigationState !== null &&
      typeof navigationState === 'object' &&
      'from' in navigationState &&
      navigationState.from === '/checkout'
        ? '/checkout'
        : '/catalogue'

    navigate(destination, { replace: true })
  }

  const inputClasses =
    'mt-2 block min-h-12 w-full rounded-xl border bg-white px-4 text-[var(--shop-text)] outline-none transition-colors focus-visible:border-[var(--shop-accent)] focus-visible:ring-2 focus-visible:ring-[var(--shop-accent)]'

  if (isLoggedIn) return <Navigate to="/catalogue" replace />

  return (
    <section className="mx-auto w-full max-w-md">
      <Link
        to="/catalogue"
        className="inline-flex min-h-11 items-center rounded-lg text-sm font-medium text-[var(--shop-accent)] hover:text-[var(--shop-primary)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--shop-accent)]"
      >
        ← Back to catalogue
      </Link>

      <h1 className="mt-8 text-3xl font-semibold tracking-tight text-[var(--shop-text)] sm:text-4xl">
        Sign up
      </h1>
      <p className="mt-3 text-[var(--shop-text)]">Enter your details to continue shopping.</p>
      <p className="mt-2 text-sm text-[var(--shop-text)]">
        Demo sign up: no permanent account is created.
      </p>

      <form className="mt-8 space-y-6 sm:mt-10" onSubmit={handleSubmit} noValidate>
        {signupFields.map((field) => {
          const error = errors[field.name]
          const errorId = `${field.name}-error`

          return (
            <div key={field.name}>
              <label htmlFor={field.name} className="block text-sm font-medium text-[var(--shop-text)]">
                {field.label}
              </label>
              <input
                id={field.name}
                name={field.name}
                type={field.type}
                autoComplete={field.autoComplete}
                required
                value={values[field.name]}
                onChange={(event) => updateField(field.name, event.target.value)}
                aria-invalid={Boolean(error)}
                aria-describedby={error ? errorId : undefined}
                className={`${inputClasses} ${error ? 'border-[var(--shop-primary)]' : 'border-[var(--shop-accent)]'}`}
              />
              {error && (
                <p id={errorId} role="alert" className="mt-2 break-words text-sm text-[var(--shop-accent)]">
                  {error}
                </p>
              )}
            </div>
          )
        })}

        <button
          type="submit"
          className="min-h-12 w-full cursor-pointer rounded-xl bg-[var(--shop-primary)] px-5 font-medium text-white transition-colors hover:bg-[var(--shop-accent)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--shop-accent)]"
        >
          Create account
        </button>
      </form>
      <p className="mt-6 text-center text-sm text-[var(--shop-text)]">
        Already have an account?{' '}
        <Link
          to="/login"
          state={location.state}
          className="inline-flex min-h-11 items-center rounded-lg font-semibold text-[var(--shop-accent)] underline underline-offset-4 hover:text-[var(--shop-primary)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--shop-accent)]"
        >
          Log in
        </Link>
      </p>
    </section>
  )
}

export default SignupPage
