import { useEffect, useState } from 'react'
import type { Product } from '../types/product'
import ProductCard from './ProductCard'

function ProductGrid() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchProducts() {
      try {
        setLoading(true)

        const [womenRes, menRes] = await Promise.all([
          fetch("https://fakestoreapi.com/products/category/women's clothing"),
          fetch("https://fakestoreapi.com/products/category/men's clothing"),
        ])

        if (!womenRes.ok || !menRes.ok) {
          throw new Error('Failed to fetch products')
        }

        const women: Product[] = await womenRes.json()
        const men: Product[] = await menRes.json()

        setProducts([...women, ...men])
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'Something went wrong'
        )
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="bg-white rounded-lg shadow-sm p-4 animate-pulse"
          >
            <div className="h-48 bg-gray-200 rounded mb-4"></div>
            <div className="h-4 bg-gray-200 rounded mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
          </div>
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-20">
        <p className="text-red-600 font-medium">
          Error: {error}
        </p>

        <p className="text-gray-500 text-sm mt-2">
          Check your internet connection and try again.
        </p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
        />
      ))}
    </div>
  )
}

export default ProductGrid