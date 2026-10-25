import { Outlet } from 'react-router-dom'
import Footer from './Footer'
import Header from './Header'

function Layout() {
  return (
    <div className="flex min-h-screen flex-col bg-[var(--shop-background)] text-[var(--shop-text)]">
      <Header />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10 sm:px-6 sm:py-12 lg:px-8 lg:py-16">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}

export default Layout
