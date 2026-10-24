function Footer() {
  return (
    <footer className="border-t border-rose-100 bg-white">
      <div className="mx-auto max-w-6xl px-6 py-5 text-sm text-stone-600 sm:px-8">
        © {new Date().getFullYear()} 10X Shop. All rights reserved.
      </div>
    </footer>
  )
}

export default Footer
