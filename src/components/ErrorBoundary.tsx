import { Component, type ErrorInfo, type ReactNode } from 'react'

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
}

class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false }

  static getDerivedStateFromError(): State {
    return { hasError: true }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error('Unexpected application error:', error, errorInfo)
  }

  render(): ReactNode {
    if (this.state.hasError) {
      return (
        <main className="flex min-h-screen items-center justify-center bg-[var(--shop-background)] px-4 py-16 text-[var(--shop-text)]">
          <div className="w-full max-w-md text-center">
            <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              Something went wrong.
            </h1>
            <p className="mt-5 leading-7">Please reload the page and try again.</p>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="mt-8 inline-flex min-h-12 items-center justify-center rounded-xl bg-[var(--shop-primary)] px-8 font-medium text-white hover:bg-[var(--shop-accent)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--shop-accent)]"
            >
              Reload
            </button>
          </div>
        </main>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
