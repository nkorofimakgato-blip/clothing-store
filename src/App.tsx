import { useState } from 'react'
import ProductGrid from './components/ProductGrid'
import CartButton from './components/CartButton'
import CartDrawer from './components/CartDrawer'
import { CartProvider } from './context/CartContext'

function App() {
  const [cartOpen, setCartOpen] = useState(false)

  return (
    <CartProvider>
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">
              Clothing Store
            </h1>
            <CartButton onClick={() => setCartOpen(true)} />
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <ProductGrid />
        </main>

        <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
      </div>
    </CartProvider>
  )
}

export default App