import { useEffect, useMemo, useState } from 'react'
import type { Product } from '../types/product'
import ProductCard from './ProductCard'

interface ProductGridProps {
  search: string
  category: string
}

function ProductGrid({ search, category }: ProductGridProps) {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchProducts() {
      try {
        setLoading(true)
        const res = await fetch('/products.json')
        if (!res.ok) throw new Error('Failed to fetch products')
        const data: Product[] = await res.json()
        setProducts(data)
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

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    return products.filter((p) => {
      const matchesSearch =
        q === '' || p.title.toLowerCase().includes(q)
      const matchesCategory =
        category === 'all' || p.category === category
      return matchesSearch && matchesCategory
    })
  }, [products, search, category])

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
        <p className="text-red-600 font-medium">Error: {error}</p>
        <p className="text-gray-500 text-sm mt-2">
          Check your internet connection and try again.
        </p>
      </div>
    )
  }

  return (
    <>
      <p className="text-sm text-gray-600 mb-4">
        {filtered.length}{' '}
        {filtered.length === 1 ? 'product' : 'products'}
      </p>

      {filtered.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-gray-700 font-medium">
            No products found.
          </p>
          <p className="text-gray-500 text-sm mt-2">
            Try a different search or category.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filtered.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </>
  )
}

export default ProductGrid