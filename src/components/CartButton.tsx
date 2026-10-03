import { useCart } from '../context/CartContext'

interface CartButtonProps {
  onClick: () => void
}

function CartButton({ onClick }: CartButtonProps) {
  const { totalItems } = useCart()

  return (
    <button
      onClick={onClick}
      className="relative flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded hover:bg-gray-700 transition-colors"
      aria-label="Open cart"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="w-5 h-5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
        />
      </svg>
      <span className="text-sm font-medium">Cart</span>
      {totalItems > 0 && (
        <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
          {totalItems}
        </span>
      )}
    </button>
  )
}

export default CartButton