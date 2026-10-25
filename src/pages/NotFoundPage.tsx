import { Link } from 'react-router-dom'

function NotFoundPage() {
  return (
    <section className="max-w-prose">
      <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">Page not found</h1>
      <p className="mt-3 text-[var(--shop-text)]">The page you are looking for does not exist.</p>
      <Link
        to="/catalogue"
        className="mt-6 inline-flex min-h-11 items-center rounded-lg font-medium text-[var(--shop-accent)] underline underline-offset-4 hover:text-[var(--shop-primary)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--shop-accent)]"
      >
        Go to catalogue
      </Link>
    </section>
  )
}

export default NotFoundPage
