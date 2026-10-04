import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import type { Product } from '../types/product'
import { useCart } from '../context/CartContext'

function ProductDetail() {
  const { id } = useParams<{ id: string }>()
  const { addToCart } = useCart()

  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [quantity, setQuantity] = useState(1)

  useEffect(() => {
    async function fetchProduct() {
      try {
        setLoading(true)
        const res = await fetch('/products.json')
        if (!res.ok) throw new Error('Failed to load product')
        const data: Product[] = await res.json()
        const found = data.find((p) => p.id === Number(id))
        if (!found) throw new Error('Product not found')
        setProduct(found)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Something went wrong')
      } finally {
        setLoading(false)
      }
    }
    fetchProduct()
  }, [id])

  if (loading) {
    return (
      <div className="grid md:grid-cols-2 gap-10 animate-pulse">
        <div className="aspect-square bg-gray-200 rounded-lg"></div>
        <div className="space-y-4">
          <div className="h-8 bg-gray-200 rounded w-3/4"></div>
          <div className="h-6 bg-gray-200 rounded w-1/4"></div>
          <div className="h-24 bg-gray-200 rounded"></div>
        </div>
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="text-center py-20">
        <p className="text-red-600 font-medium">
          {error ?? 'Product not found'}
        </p>
        <Link
          to="/"
          className="inline-block mt-6 text-gray-700 underline hover:text-gray-900"
        >
          ← Back to store
        </Link>
      </div>
    )
  }

  function handleAddToCart() {
    if (!product) return
    for (let i = 0; i < quantity; i++) {
      addToCart(product)
    }
  }

  return (
    <div>
      <Link
        to="/"
        className="inline-block mb-6 text-sm text-gray-600 hover:text-gray-900"
      >
        ← Back to store
      </Link>

      <div className="grid md:grid-cols-2 gap-10">
        <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
          <img
            src={product.image}
            alt={product.title}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="flex flex-col">
          <p className="text-sm text-gray-500 uppercase tracking-wide mb-2">
            {product.category}
          </p>

          <h1 className="text-3xl font-bold text-gray-900 mb-3">
            {product.title}
          </h1>

          <div className="flex items-center gap-2 mb-4">
            <span className="text-yellow-500">★</span>
            <span className="text-sm text-gray-700">
              {product.rating.rate} ({product.rating.count} reviews)
            </span>
          </div>

          <p className="text-3xl font-bold text-gray-900 mb-6">
            ${product.price.toFixed(2)}
          </p>

          <p className="text-gray-700 mb-8 leading-relaxed">
            {product.description}
          </p>

          <div className="flex items-center gap-4 mb-6">
            <label className="text-sm font-medium text-gray-700">
              Quantity
            </label>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="w-9 h-9 border border-gray-300 rounded hover:bg-gray-100"
              >
                −
              </button>
              <span className="w-8 text-center font-medium">{quantity}</span>
              <button
                onClick={() => setQuantity((q) => q + 1)}
                className="w-9 h-9 border border-gray-300 rounded hover:bg-gray-100"
              >
                +
              </button>
            </div>
          </div>

          <button
            onClick={handleAddToCart}
            className="bg-gray-900 text-white py-3 px-6 rounded-lg hover:bg-gray-700 transition-colors font-medium"
          >
            Add to Cart · ${(product.price * quantity).toFixed(2)}
          </button>
        </div>
      </div>
    </div>
  )
}

export default ProductDetail