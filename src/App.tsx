import { useState } from 'react'
import ProductGrid from './components/ProductGrid'
import CartButton from './components/CartButton'
import CartDrawer from './components/CartDrawer'
import FilterBar from './components/FilterBar'
import Checkout from './components/Checkout'
import Footer from './components/Footer'
import { CartProvider } from './context/CartContext'

function App() {
  const [cartOpen, setCartOpen] = useState(false)
  const [checkoutOpen, setCheckoutOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('all')

  return (
    <CartProvider>
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">
              Clothing Store
            </h1>
            <CartButton onClick={() => setCartOpen(true)} />
          </div>
        </header>

        <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
          <FilterBar
            search={search}
            onSearchChange={setSearch}
            category={category}
            onCategoryChange={setCategory}
          />
          <ProductGrid search={search} category={category} />
        </main>

        <Footer />

        <CartDrawer
          open={cartOpen}
          onClose={() => setCartOpen(false)}
          onCheckout={() => {
            setCartOpen(false)
            setCheckoutOpen(true)
          }}
        />

        {checkoutOpen && (
          <Checkout onClose={() => setCheckoutOpen(false)} />
        )}
      </div>
    </CartProvider>
  )
}

export default App