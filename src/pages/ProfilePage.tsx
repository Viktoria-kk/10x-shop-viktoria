import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import type { AuthUser, ProfileDetails } from '../types/user'
import { isValidPassword, PASSWORD_HINT } from '../utils/password'

type ProfileErrors = Partial<Record<keyof ProfileDetails, string>>

const fields = [
  { name: 'firstName', label: 'First name', type: 'text', autoComplete: 'given-name' },
  { name: 'lastName', label: 'Last name', type: 'text', autoComplete: 'family-name' },
  { name: 'email', label: 'Email', type: 'email', autoComplete: 'email' },
  { name: 'phone', label: 'Phone (optional)', type: 'tel', autoComplete: 'tel' },
] as const

function savedDetails(user: AuthUser): ProfileDetails {
  return {
    firstName: user.firstName ?? '',
    lastName: user.lastName ?? '',
    email: user.email ?? '',
    phone: user.phone ?? '',
  }
}

function ProfilePage() {
  const { user, updateProfile, logout } = useAuth()
  const navigate = useNavigate()
  const [isEditing, setIsEditing] = useState(false)
  const [values, setValues] = useState<ProfileDetails>({ firstName: '', lastName: '', email: '', phone: '' })
  const [errors, setErrors] = useState<ProfileErrors>({})
  const [saved, setSaved] = useState(false)
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [passwordInteracted, setPasswordInteracted] = useState(false)
  const [passwordAccepted, setPasswordAccepted] = useState(false)

  // ProtectedRoute keeps guests on Login.
  if (!user) return null

  const name = [user.firstName, user.lastName].filter(Boolean).join(' ')
  const initials = name
    ? `${user.firstName?.charAt(0) ?? ''}${user.lastName?.charAt(0) ?? ''}`.toLocaleUpperCase()
    : user.username.charAt(0).toLocaleUpperCase()

  function startEditing() {
    if (!user) return
    setValues(savedDetails(user))
    setErrors({})
    setSaved(false)
    setIsEditing(true)
  }

  function cancelEditing() {
    if (!user) return
    setValues(savedDetails(user))
    setErrors({})
    setIsEditing(false)
  }

  function updateField(field: keyof ProfileDetails, value: string) {
    setValues((current) => ({ ...current, [field]: value }))
    setErrors((current) => ({ ...current, [field]: undefined }))
  }

  function saveProfile(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const next: ProfileDetails = {
      firstName: values.firstName.trim(),
      lastName: values.lastName.trim(),
      email: values.email.trim(),
      phone: values.phone.trim(),
    }
    const nextErrors: ProfileErrors = {}

    if (next.firstName.length < 2) nextErrors.firstName = 'First name must be at least 2 characters'
    if (next.lastName.length < 2) nextErrors.lastName = 'Last name must be at least 2 characters'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(next.email)) nextErrors.email = 'Please enter a valid email'
    const digits = next.phone.replace(/\D/g, '')
    if (next.phone && (!/^\+?[\d\s()-]+$/.test(next.phone) || digits.length < 9 || digits.length > 15)) {
      nextErrors.phone = 'Please enter a valid phone number'
    }

    setErrors(nextErrors)
    if (Object.values(nextErrors).some(Boolean)) return

    updateProfile(next)
    setIsEditing(false)
    setSaved(true)
  }

  function handleLogout() {
    logout()
    navigate('/', { replace: true })
  }

  function submitPassword(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!isValidPassword(newPassword) || newPassword !== confirmPassword) return

    setNewPassword('')
    setConfirmPassword('')
    setPasswordInteracted(false)
    setPasswordAccepted(true)
  }

  const passwordHintVisible = passwordInteracted
  const passwordInvalid = passwordHintVisible && !isValidPassword(newPassword)
  const confirmationMismatch = confirmPassword.length > 0 && confirmPassword !== newPassword
  const canSubmitPassword = isValidPassword(newPassword) && confirmPassword === newPassword

  return (
    <section className="mx-auto w-full max-w-3xl">
      <h1 className="text-4xl font-semibold tracking-tight text-[var(--shop-text)] sm:text-5xl">My account</h1>
      <p className="mt-4 max-w-prose leading-7 text-[var(--shop-text)]">Manage your account details.</p>

      <div className="mt-12 flex min-w-0 items-center gap-5 sm:gap-7">
        <div aria-hidden="true" className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-[var(--shop-primary)] text-3xl font-semibold text-white sm:h-24 sm:w-24">
          {initials}
        </div>
        <div className="min-w-0">
          <p className="text-sm font-medium text-[var(--shop-accent)]">Signed in as</p>
          <p className="mt-1 break-words text-2xl font-semibold leading-tight text-[var(--shop-text)] sm:text-3xl">{user.username}</p>
        </div>
      </div>

      <div className="mt-12 border-t border-[var(--shop-primary)]/20 pt-8 sm:mt-14">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h2 className="text-xl font-semibold text-[var(--shop-text)]">Personal information</h2>
          {!isEditing && (
            <button type="button" onClick={startEditing} className="min-h-11 cursor-pointer rounded-lg font-medium text-[var(--shop-accent)] underline underline-offset-4 hover:text-[var(--shop-primary)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--shop-accent)]">
              Edit profile
            </button>
          )}
        </div>

        {isEditing ? (
          <form onSubmit={saveProfile} noValidate className="mt-6 max-w-xl space-y-5">
            <div className="grid gap-5 sm:grid-cols-2">
              {fields.map((field) => (
                <div key={field.name} className={field.name === 'email' || field.name === 'phone' ? 'sm:col-span-2' : ''}>
                  <label htmlFor={`profile-${field.name}`} className="block text-sm font-medium text-[var(--shop-text)]">{field.label}</label>
                  <input
                    id={`profile-${field.name}`}
                    name={field.name}
                    type={field.type}
                    autoComplete={field.autoComplete}
                    value={values[field.name]}
                    onChange={(event) => updateField(field.name, event.target.value)}
                    aria-invalid={Boolean(errors[field.name])}
                    aria-describedby={errors[field.name] ? `profile-${field.name}-error` : undefined}
                    className={`mt-2 block min-h-12 w-full rounded-xl border bg-white px-4 text-[var(--shop-text)] outline-none focus-visible:ring-2 focus-visible:ring-[var(--shop-accent)] ${errors[field.name] ? 'border-[var(--shop-primary)]' : 'border-[var(--shop-accent)]'}`}
                  />
                  {errors[field.name] && <p id={`profile-${field.name}-error`} role="alert" className="mt-2 text-sm text-[var(--shop-accent)]">{errors[field.name]}</p>}
                </div>
              ))}
            </div>
            <div className="flex flex-wrap items-center gap-5 pt-2">
              <button type="submit" className="min-h-12 cursor-pointer rounded-xl bg-[var(--shop-primary)] px-6 font-medium text-white hover:bg-[var(--shop-accent)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--shop-accent)]">Save changes</button>
              <button type="button" onClick={cancelEditing} className="min-h-11 cursor-pointer rounded-lg font-medium text-[var(--shop-accent)] underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--shop-accent)]">Cancel</button>
            </div>
          </form>
        ) : (
          <dl className="mt-6 grid gap-x-8 gap-y-6 sm:grid-cols-2">
            <div><dt className="text-sm font-medium text-[var(--shop-accent)]">Name</dt><dd className="mt-1 break-words text-[var(--shop-text)]">{name || 'Not added yet'}</dd></div>
            <div><dt className="text-sm font-medium text-[var(--shop-accent)]">Email</dt><dd className="mt-1 break-all text-[var(--shop-text)]">{user.email || 'Not added yet'}</dd></div>
            <div><dt className="text-sm font-medium text-[var(--shop-accent)]">Phone</dt><dd className="mt-1 break-words text-[var(--shop-text)]">{user.phone || 'Not added yet'}</dd></div>
          </dl>
        )}
        {saved && !isEditing && <p role="status" className="mt-6 text-sm font-medium text-[var(--shop-accent)]">Profile updated.</p>}
      </div>

      <div className="mt-10 border-t border-[var(--shop-primary)]/20 pt-8">
        <h2 className="text-xl font-semibold text-[var(--shop-text)]">Change password</h2>
        <form onSubmit={submitPassword} className="mt-6 max-w-xl space-y-5">
          <div>
            <label htmlFor="profile-new-password" className="block text-sm font-medium text-[var(--shop-text)]">New password</label>
            <input
              id="profile-new-password"
              name="newPassword"
              type="password"
              autoComplete="new-password"
              required
              value={newPassword}
              onChange={(event) => {
                setNewPassword(event.target.value)
                setPasswordInteracted(true)
                setPasswordAccepted(false)
              }}
              aria-invalid={passwordInvalid}
              aria-describedby={passwordHintVisible ? 'profile-password-hint' : undefined}
              className={`mt-2 block min-h-12 w-full rounded-xl border bg-white px-4 text-[var(--shop-text)] outline-none focus-visible:ring-2 focus-visible:ring-[var(--shop-accent)] ${passwordInvalid ? 'border-red-700' : 'border-[var(--shop-accent)]'}`}
            />
            {passwordHintVisible && (
              <p id="profile-password-hint" className={`mt-2 break-words text-sm ${passwordInvalid ? 'text-red-700' : 'text-[var(--shop-text)]/70'}`}>
                {PASSWORD_HINT}
              </p>
            )}
          </div>
          <div>
            <label htmlFor="profile-confirm-password" className="block text-sm font-medium text-[var(--shop-text)]">Confirm new password</label>
            <input
              id="profile-confirm-password"
              name="confirmPassword"
              type="password"
              autoComplete="new-password"
              required
              value={confirmPassword}
              onChange={(event) => {
                setConfirmPassword(event.target.value)
                setPasswordAccepted(false)
              }}
              aria-invalid={confirmationMismatch}
              aria-describedby={confirmationMismatch ? 'profile-confirm-password-error' : undefined}
              className={`mt-2 block min-h-12 w-full rounded-xl border bg-white px-4 text-[var(--shop-text)] outline-none focus-visible:ring-2 focus-visible:ring-[var(--shop-accent)] ${confirmationMismatch ? 'border-[var(--shop-primary)]' : 'border-[var(--shop-accent)]'}`}
            />
            {confirmationMismatch && <p id="profile-confirm-password-error" role="alert" className="mt-2 text-sm text-[var(--shop-accent)]">Passwords do not match</p>}
          </div>
          <button
            type="submit"
            disabled={!canSubmitPassword}
            className="min-h-12 rounded-xl bg-[var(--shop-primary)] px-6 font-medium text-white hover:bg-[var(--shop-accent)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--shop-accent)] disabled:cursor-not-allowed disabled:opacity-50"
          >
            Save new password
          </button>
          {passwordAccepted && <p role="status" className="text-sm text-[var(--shop-text)]">Password format accepted.</p>}
        </form>
      </div>

      <div className="mt-10 flex flex-col items-start gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:gap-5">
        <Link to="/#catalogue" className="inline-flex min-h-12 items-center justify-center rounded-xl bg-[var(--shop-primary)] px-6 font-medium text-white hover:bg-[var(--shop-accent)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--shop-accent)]">Continue shopping</Link>
        <Link to="/cart" className="inline-flex min-h-11 items-center rounded-lg font-medium text-[var(--shop-accent)] underline underline-offset-4 hover:text-[var(--shop-primary)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--shop-accent)]">View cart</Link>
        <Link to="/orders" className="inline-flex min-h-11 items-center rounded-lg font-medium text-[var(--shop-accent)] underline underline-offset-4 hover:text-[var(--shop-primary)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--shop-accent)]">My orders</Link>
        <button type="button" onClick={handleLogout} className="min-h-11 cursor-pointer rounded-lg font-medium text-[var(--shop-accent)] underline underline-offset-4 hover:text-[var(--shop-primary)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--shop-accent)]">Log out</button>
      </div>
    </section>
  )
}

export default ProfilePage
