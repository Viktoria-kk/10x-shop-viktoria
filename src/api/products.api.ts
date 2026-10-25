import type { Product, ProductsResponse } from '../types/product'

export async function fetchProducts(): Promise<ProductsResponse> {
  const response = await fetch('https://dummyjson.com/products?limit=12&skip=0')

  if (!response.ok) {
    throw new Error('Failed to fetch products')
  }

  return (await response.json()) as ProductsResponse
}

export async function searchProducts(query: string, signal: AbortSignal): Promise<ProductsResponse> {
  const response = await fetch(
    `https://dummyjson.com/products/search?q=${encodeURIComponent(query)}&limit=0`,
    { signal },
  )

  if (!response.ok) {
    throw new Error('Failed to search products')
  }

  return (await response.json()) as ProductsResponse
}

export async function fetchProductById(id: number): Promise<Product | null> {
  const response = await fetch(`https://dummyjson.com/products/${id}`)

  if (response.status === 404) {
    return null
  }

  if (!response.ok) {
    throw new Error('Failed to fetch product')
  }

  return (await response.json()) as Product
}
