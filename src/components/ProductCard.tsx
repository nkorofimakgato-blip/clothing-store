import type { Product } from '../types/product'

interface ProductCardProps {
  product: Product
}

function ProductCard({ product }: ProductCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-4 flex flex-col">
      <div className="h-48 flex items-center justify-center mb-4">
        <img
          src={product.image}
          alt={product.title}
          className="max-h-full max-w-full object-contain"
        />
      </div>

      <h3 className="text-sm font-medium text-gray-800 line-clamp-2 mb-2 flex-grow">
        {product.title}
      </h3>

      <div className="flex items-center justify-between mt-auto pt-2">
        <span className="text-lg font-bold text-gray-900">
          ${product.price.toFixed(2)}
        </span>

        <button className="bg-gray-900 text-white text-sm px-3 py-1.5 rounded hover:bg-gray-700 transition-colors">
          Add to Cart
        </button>
      </div>
    </div>
  )
}

export default ProductCard