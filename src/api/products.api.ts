import type { Product, ProductsResponse } from '../types/product'

export async function fetchProducts(skip = 0, signal?: AbortSignal): Promise<ProductsResponse> {
  const response = await fetch(`https://dummyjson.com/products?limit=12&skip=${skip}`, { signal })

  if (!response.ok) {
    throw new Error('Failed to fetch products')
  }

  return (await response.json()) as ProductsResponse
}

export async function searchProducts(query: string, skip: number, signal: AbortSignal): Promise<ProductsResponse> {
  const response = await fetch(
    `https://dummyjson.com/products/search?q=${encodeURIComponent(query)}&limit=12&skip=${skip}`,
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
