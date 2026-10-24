import { Link } from 'react-router-dom'

function NotFoundPage() {
  return (
    <>
      <h1 className="text-3xl font-bold tracking-tight md:text-4xl">Page not found</h1>
      <p className="mt-3 text-slate-600">The page you are looking for does not exist.</p>
      <Link
        to="/"
        className="mt-6 inline-block font-medium text-slate-900 underline underline-offset-4 hover:text-slate-700 focus-visible:outline-2 focus-visible:outline-offset-4"
      >
        Go to catalogue
      </Link>
    </>
  )
}

export default NotFoundPage
