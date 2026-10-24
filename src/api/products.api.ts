import type { ProductsResponse } from '../types/product'

export async function fetchProducts(): Promise<ProductsResponse> {
  const response = await fetch('https://dummyjson.com/products?limit=12&skip=0')

  if (!response.ok) {
    throw new Error('Failed to fetch products')
  }

  return (await response.json()) as ProductsResponse
}
