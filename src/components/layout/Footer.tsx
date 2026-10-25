function Footer() {
  return (
    <footer className="border-t border-[var(--shop-background)] bg-white">
      <div className="mx-auto max-w-6xl px-4 py-5 text-sm text-[var(--shop-text)] sm:px-6 lg:px-8">
        © {new Date().getFullYear()} 10X Shop. All rights reserved.
      </div>
    </footer>
  )
}

export default Footer
