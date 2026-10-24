import { Outlet } from 'react-router-dom'
import Footer from './Footer'
import Header from './Header'

function Layout() {
  return (
    <div className="flex min-h-screen flex-col bg-slate-50 text-slate-900">
      <Header />
      <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-16 sm:px-8">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}

export default Layout
