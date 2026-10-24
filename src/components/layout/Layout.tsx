import type { ReactNode } from 'react'
import Footer from './Footer'
import Header from './Header'

interface LayoutProps {
  children: ReactNode
}

function Layout({ children }: LayoutProps) {
  return (
    <div className="flex min-h-screen flex-col bg-slate-50 text-slate-900">
      <Header />
      <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-16 sm:px-8">
        {children}
      </main>
      <Footer />
    </div>
  )
}

export default Layout
