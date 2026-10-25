import type { Product } from '../../types/product'
import ProductCard from './ProductCard'

interface ProductGridProps {
  products: Product[]
}

function ProductGrid({ products }: ProductGridProps) {
  return (
    <ul className="mt-8 grid grid-cols-1 gap-x-6 gap-y-10 sm:mt-10 sm:grid-cols-2 sm:gap-y-12 lg:grid-cols-3 xl:grid-cols-4">
      {products.map((product) => (
        <li key={product.id} className="min-w-0">
          <ProductCard product={product} />
        </li>
      ))}
    </ul>
  )
}

export default ProductGrid
