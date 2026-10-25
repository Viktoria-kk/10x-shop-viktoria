import { useRef, useState, type FormEvent } from 'react'
import { flushSync } from 'react-dom'
import { Link, Navigate } from 'react-router-dom'
import { useCart } from '../context/cart-context'
import type { CheckoutFormValues } from '../types/checkout'
import { discountedPrice, formatPrice } from '../utils/format'

type CheckoutErrors = Partial<Record<keyof CheckoutFormValues, string>>

interface CompletedOrder {
  customerName: string
  itemCount: number
  total: number
}

const checkoutFields = [
  { name: 'fullName', label: 'Full name', type: 'text', autoComplete: 'name' },
  { name: 'email', label: 'Email', type: 'email', autoComplete: 'email' },
  { name: 'address', label: 'Address', type: 'text', autoComplete: 'street-address' },
  { name: 'city', label: 'City', type: 'text', autoComplete: 'address-level2' },
] as const

function validateCheckout(values: CheckoutFormValues): CheckoutErrors {
  const errors: CheckoutErrors = {}
  const email = values.email.trim()

  if (values.fullName.trim().length < 3) {
    errors.fullName = 'Full name must be at least 3 characters'
  }
  if (!email) {
    errors.email = 'Email is required'
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.email = 'Please enter a valid email address'
  }
  if (values.address.trim().length < 5) {
    errors.address = 'Address must be at least 5 characters'
  }
  if (!values.city.trim()) {
    errors.city = 'City is required'
  }

  return errors
}

function CheckoutPage() {
  const { items, itemCount, subtotal, total, clearCart } = useCart()
  const [values, setValues] = useState<CheckoutFormValues>({
    fullName: '',
    email: '',
    address: '',
    city: '',
  })
  const [errors, setErrors] = useState<CheckoutErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [completedOrder, setCompletedOrder] = useState<CompletedOrder | null>(null)
  const [submissionError, setSubmissionError] = useState('')
  const orderPlaced = useRef(false)

  function updateField(field: keyof CheckoutFormValues, value: string) {
    const nextValues = { ...values, [field]: value }
    setValues(nextValues)
    setErrors((current) =>
      current[field] ? { ...current, [field]: validateCheckout(nextValues)[field] } : current,
    )
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (orderPlaced.current) return

    const nextErrors = validateCheckout(values)
    setErrors(nextErrors)
    if (Object.values(nextErrors).some(Boolean) || items.length === 0) return

    setSubmissionError('')
    orderPlaced.current = true
    const order: CompletedOrder = { customerName: values.fullName.trim(), itemCount, total }

    try {
      flushSync(() => setIsSubmitting(true))
      clearCart()
      setCompletedOrder(order)
    } catch {
      orderPlaced.current = false
      setSubmissionError('Unable to place your order. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (completedOrder !== null) {
    return (
      <section role="status" className="mx-auto max-w-2xl break-words text-center">
        <h1 className="text-3xl font-semibold tracking-tight text-[var(--shop-text)] md:text-4xl">
          Thank you! Your order has been placed.
        </h1>
        <p className="mt-5 text-[var(--shop-text)]">Order for {completedOrder.customerName}</p>
        <p className="mt-2 text-[var(--shop-text)]">
          {completedOrder.itemCount} {completedOrder.itemCount === 1 ? 'item' : 'items'} · Total{' '}
          <span className="font-semibold">{formatPrice(completedOrder.total)}</span>
        </p>
        <Link
          to="/catalogue"
          className="mt-8 inline-flex min-h-11 items-center rounded-lg font-medium text-[var(--shop-accent)] underline underline-offset-4 hover:text-[var(--shop-primary)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--shop-accent)]"
        >
          Continue shopping
        </Link>
      </section>
    )
  }

  if (items.length === 0) return <Navigate to="/cart" replace />

  const inputClasses =
    'mt-2 block min-h-12 w-full rounded-xl border bg-white px-4 text-[var(--shop-text)] outline-none focus-visible:border-[var(--shop-accent)] focus-visible:ring-2 focus-visible:ring-[var(--shop-accent)]'

  return (
    <section>
      <h1 className="text-3xl font-semibold tracking-tight text-[var(--shop-text)] md:text-4xl">
        Checkout
      </h1>
      <div className="mt-8 grid gap-8 sm:mt-10 lg:grid-cols-3 lg:gap-12">
        <form className="min-w-0 space-y-6 lg:col-span-2" onSubmit={handleSubmit} noValidate>
          {checkoutFields.map((field) => {
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
                  <p id={errorId} role="alert" className="mt-2 text-sm text-[var(--shop-accent)]">
                    {error}
                  </p>
                )}
              </div>
            )
          })}
          <button
            type="submit"
            disabled={isSubmitting}
            className="min-h-12 w-full cursor-pointer rounded-xl bg-[var(--shop-primary)] px-6 font-medium text-white hover:bg-[var(--shop-accent)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--shop-accent)] disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
          >
            Place order
          </button>
          {submissionError && (
            <p role="alert" className="break-words text-sm text-[var(--shop-accent)]">
              {submissionError}
            </p>
          )}
        </form>

        <section aria-labelledby="order-summary-heading" className="min-w-0 self-start rounded-3xl bg-white p-5 sm:p-8">
          <h2 id="order-summary-heading" className="text-xl font-semibold text-[var(--shop-text)]">
            Order summary
          </h2>
          <ul className="mt-6 space-y-4">
            {items.map((item) => {
              const lineTotal = discountedPrice(item.price, item.discountPercentage) * item.quantity

              return (
                <li key={item.productId} className="flex min-w-0 justify-between gap-4 text-sm text-[var(--shop-text)]">
                  <span className="min-w-0 break-words">
                    {item.title} · Qty {item.quantity}
                  </span>
                  <span className="shrink-0 font-medium">{formatPrice(lineTotal)}</span>
                </li>
              )
            })}
          </ul>
          <dl className="mt-6 space-y-4 border-t border-[var(--shop-background)] pt-5 text-[var(--shop-text)]">
            <div className="flex justify-between gap-4">
              <dt>Items</dt>
              <dd>{itemCount}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt>Subtotal</dt>
              <dd>{formatPrice(subtotal)}</dd>
            </div>
            <div className="flex justify-between gap-4 font-semibold">
              <dt>Total</dt>
              <dd>{formatPrice(total)}</dd>
            </div>
          </dl>
        </section>
      </div>
    </section>
  )
}

export default CheckoutPage
