import { useEffect, useState } from 'react'
import { fetchProducts } from '../api/products.api'
import type { Product } from '../types/product'

function CatalogPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    let isCurrent = true

    async function loadProducts() {
      try {
        const data = await fetchProducts()
        if (isCurrent) setProducts(data.products)
      } catch (caughtError: unknown) {
        if (isCurrent) {
          setError(caughtError instanceof Error ? caughtError : new Error('Unknown error'))
        }
      } finally {
        if (isCurrent) setIsLoading(false)
      }
    }

    void loadProducts()

    return () => {
      isCurrent = false
    }
  }, [])

  return (
    <section className="max-w-2xl" aria-labelledby="catalog-heading">
      <h1 id="catalog-heading" className="text-3xl font-bold tracking-tight md:text-4xl">
        Catalog
      </h1>

      {isLoading ? (
        <p className="mt-8 text-stone-600" role="status">Loading products...</p>
      ) : error ? (
        <p className="mt-8 text-rose-800" role="alert">
          Unable to load products. Please try again later.
        </p>
      ) : products.length === 0 ? (
        <p className="mt-8 text-stone-600">No products found.</p>
      ) : (
        <ul className="mt-8 divide-y divide-rose-100">
          {products.map((product) => (
            <li key={product.id} className="break-words py-4 text-lg text-stone-800">
              {product.title}
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}

export default CatalogPage
