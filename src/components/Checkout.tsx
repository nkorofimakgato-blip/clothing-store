import { useState, type FormEvent } from 'react'
import { useCart } from '../context/CartContext'
import type { PaymentInfo, ShippingInfo } from '../types/order'

interface CheckoutProps {
  onClose: () => void
}

type Step = 'shipping' | 'payment' | 'review' | 'success'

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const cardRegex = /^\d{16}$/
const expiryRegex = /^(0[1-9]|1[0-2])\/\d{2}$/
const cvcRegex = /^\d{3,4}$/

function Checkout({ onClose }: CheckoutProps) {
  const { items, totalPrice, clearCart } = useCart()
  const [step, setStep] = useState<Step>('shipping')
  const [shipping, setShipping] = useState<ShippingInfo>({
    fullName: '',
    email: '',
    address: '',
    city: '',
    zip: '',
    country: '',
  })
  const [payment, setPayment] = useState<PaymentInfo>({
    cardNumber: '',
    cardName: '',
    expiry: '',
    cvc: '',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [orderId, setOrderId] = useState('')

  function formatCardNumber(value: string) {
    const digits = value.replace(/\D/g, '').slice(0, 16)
    return digits.replace(/(.{4})/g, '$1 ').trim()
  }

  function formatExpiry(value: string) {
    const digits = value.replace(/\D/g, '').slice(0, 4)
    if (digits.length <= 2) return digits
    return `${digits.slice(0, 2)}/${digits.slice(2)}`
  }

  function validateShipping(): boolean {
    const e: Record<string, string> = {}
    if (!shipping.fullName.trim()) e.fullName = 'Required'
    if (!shipping.email.trim()) e.email = 'Required'
    else if (!emailRegex.test(shipping.email)) e.email = 'Invalid email'
    if (!shipping.address.trim()) e.address = 'Required'
    if (!shipping.city.trim()) e.city = 'Required'
    if (!shipping.zip.trim()) e.zip = 'Required'
    if (!shipping.country.trim()) e.country = 'Required'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  function validatePayment(): boolean {
    const e: Record<string, string> = {}
    const digits = payment.cardNumber.replace(/\s/g, '')
    if (!cardRegex.test(digits)) e.cardNumber = 'Enter a 16-digit card number'
    if (!payment.cardName.trim()) e.cardName = 'Required'
    if (!expiryRegex.test(payment.expiry)) e.expiry = 'Use MM/YY'
    if (!cvcRegex.test(payment.cvc)) e.cvc = 'Use 3 or 4 digits'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  function handleShippingSubmit(ev: FormEvent) {
    ev.preventDefault()
    if (validateShipping()) {
      setErrors({})
      setStep('payment')
    }
  }

  function handlePaymentSubmit(ev: FormEvent) {
    ev.preventDefault()
    if (validatePayment()) {
      setErrors({})
      setStep('review')
    }
  }

  function handlePlaceOrder() {
    const id = `ORD-${Date.now().toString().slice(-8)}`
    setOrderId(id)
    clearCart()
    setStep('success')
  }

  const summary = (
    <aside className="bg-gray-50 rounded-lg p-6 h-fit">
      <h2 className="font-bold text-lg mb-4">Order Summary</h2>
      <ul className="space-y-3 mb-4">
        {items.map((item) => (
          <li key={item.id} className="flex justify-between text-sm">
            <span className="text-gray-700 pr-2">
              {item.title} × {item.quantity}
            </span>
            <span className="font-medium whitespace-nowrap">
              ${(item.price * item.quantity).toFixed(2)}
            </span>
          </li>
        ))}
      </ul>
      <div className="border-t pt-4 flex justify-between font-bold text-lg">
        <span>Total</span>
        <span>${totalPrice.toFixed(2)}</span>
      </div>
    </aside>
  )

  const fieldError = (key: string) =>
    errors[key] ? (
      <p className="text-red-600 text-xs mt-1">{errors[key]}</p>
    ) : null

  return (
    <div className="fixed inset-0 bg-white z-50 overflow-y-auto">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold">
            {step === 'success' ? 'Order Confirmed' : 'Checkout'}
          </h1>
          {step !== 'success' && (
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-900 text-2xl leading-none"
              aria-label="Close checkout"
            >
              ×
            </button>
          )}
        </div>

        {step !== 'success' && (
          <div className="flex items-center gap-2 mb-8 text-sm">
            {(['shipping', 'payment', 'review'] as const).map((s, i) => (
              <div key={s} className="flex items-center gap-2">
                <span
                  className={`w-7 h-7 rounded-full flex items-center justify-center font-medium ${
                    step === s
                      ? 'bg-gray-900 text-white'
                      : ['shipping', 'payment', 'review'].indexOf(step) > i
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-200 text-gray-600'
                  }`}
                >
                  {['shipping', 'payment', 'review'].indexOf(step) > i
                    ? '✓'
                    : i + 1}
                </span>
                <span className="capitalize">{s}</span>
                {i < 2 && <span className="text-gray-300 mx-2">—</span>}
              </div>
            ))}
          </div>
        )}

        {step === 'success' ? (
          <div className="text-center py-16 max-w-md mx-auto">
            <div className="w-16 h-16 rounded-full bg-green-100 text-green-600 flex items-center justify-center mx-auto mb-6 text-3xl">
              ✓
            </div>
            <h2 className="text-2xl font-bold mb-2">Thank you!</h2>
            <p className="text-gray-600 mb-4">
              Your order has been placed successfully.
            </p>
            <p className="text-sm text-gray-500 mb-8">
              Order ID: <span className="font-mono font-medium text-gray-900">{orderId}</span>
            </p>
            <button
              onClick={onClose}
              className="bg-gray-900 text-white px-6 py-3 rounded hover:bg-gray-700 transition-colors"
            >
              Continue Shopping
            </button>
          </div>
        ) : (
          <div className="grid lg:grid-cols-[1fr_360px] gap-8">
            <div>
              {step === 'shipping' && (
                <form onSubmit={handleShippingSubmit} className="space-y-4">
                  <h2 className="font-bold text-lg mb-2">Shipping Information</h2>

                  <div>
                    <label className="block text-sm font-medium mb-1">Full Name</label>
                    <input
                      type="text"
                      value={shipping.fullName}
                      onChange={(e) => setShipping({ ...shipping, fullName: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-gray-900"
                    />
                    {fieldError('fullName')}
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Email</label>
                    <input
                      type="text"
                      value={shipping.email}
                      onChange={(e) => setShipping({ ...shipping, email: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-gray-900"
                    />
                    {fieldError('email')}
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Address</label>
                    <input
                      type="text"
                      value={shipping.address}
                      onChange={(e) => setShipping({ ...shipping, address: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-gray-900"
                    />
                    {fieldError('address')}
                  </div>

                  <div className="grid sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">City</label>
                      <input
                        type="text"
                        value={shipping.city}
                        onChange={(e) => setShipping({ ...shipping, city: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-gray-900"
                      />
                      {fieldError('city')}
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">ZIP</label>
                      <input
                        type="text"
                        value={shipping.zip}
                        onChange={(e) => setShipping({ ...shipping, zip: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-gray-900"
                      />
                      {fieldError('zip')}
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Country</label>
                      <input
                        type="text"
                        value={shipping.country}
                        onChange={(e) => setShipping({ ...shipping, country: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-gray-900"
                      />
                      {fieldError('country')}
                    </div>
                  </div>

                  <div className="flex justify-between pt-4">
                    <button
                      type="button"
                      onClick={onClose}
                      className="text-gray-600 hover:text-gray-900"
                    >
                      ← Back to cart
                    </button>
                    <button
                      type="submit"
                      className="bg-gray-900 text-white px-6 py-2.5 rounded hover:bg-gray-700 transition-colors"
                    >
                      Continue to Payment
                    </button>
                  </div>
                </form>
              )}

              {step === 'payment' && (
                <form onSubmit={handlePaymentSubmit} className="space-y-4">
                  <h2 className="font-bold text-lg mb-2">Payment Details</h2>

                  <div>
                    <label className="block text-sm font-medium mb-1">Card Number</label>
                    <input
                      type="text"
                      inputMode="numeric"
                      placeholder="1234 5678 9012 3456"
                      value={payment.cardNumber}
                      onChange={(e) =>
                        setPayment({ ...payment, cardNumber: formatCardNumber(e.target.value) })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-gray-900 font-mono"
                    />
                    {fieldError('cardNumber')}
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Name on Card</label>
                    <input
                      type="text"
                      value={payment.cardName}
                      onChange={(e) => setPayment({ ...payment, cardName: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-gray-900"
                    />
                    {fieldError('cardName')}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Expiry</label>
                      <input
                        type="text"
                        inputMode="numeric"
                        placeholder="MM/YY"
                        value={payment.expiry}
                        onChange={(e) =>
                          setPayment({ ...payment, expiry: formatExpiry(e.target.value) })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-gray-900 font-mono"
                      />
                      {fieldError('expiry')}
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">CVC</label>
                      <input
                        type="text"
                        inputMode="numeric"
                        placeholder="123"
                        value={payment.cvc}
                        onChange={(e) =>
                          setPayment({
                            ...payment,
                            cvc: e.target.value.replace(/\D/g, '').slice(0, 4),
                          })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-gray-900 font-mono"
                      />
                      {fieldError('cvc')}
                    </div>
                  </div>

                  <p className="text-xs text-gray-500 pt-2">
                    This is a demo — no real payment is processed. Use any 16-digit number.
                  </p>

                  <div className="flex justify-between pt-4">
                    <button
                      type="button"
                      onClick={() => {
                        setErrors({})
                        setStep('shipping')
                      }}
                      className="text-gray-600 hover:text-gray-900"
                    >
                      ← Back
                    </button>
                    <button
                      type="submit"
                      className="bg-gray-900 text-white px-6 py-2.5 rounded hover:bg-gray-700 transition-colors"
                    >
                      Review Order
                    </button>
                  </div>
                </form>
              )}

              {step === 'review' && (
                <div className="space-y-6">
                  <h2 className="font-bold text-lg">Review Your Order</h2>

                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-medium">Shipping to</h3>
                      <button
                        onClick={() => setStep('shipping')}
                        className="text-sm text-gray-600 hover:text-gray-900 underline"
                      >
                        Edit
                      </button>
                    </div>
                    <p className="text-sm text-gray-700">{shipping.fullName}</p>
                    <p className="text-sm text-gray-700">{shipping.address}</p>
                    <p className="text-sm text-gray-700">
                      {shipping.city}, {shipping.zip}, {shipping.country}
                    </p>
                    <p className="text-sm text-gray-700">{shipping.email}</p>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-medium">Payment</h3>
                      <button
                        onClick={() => setStep('payment')}
                        className="text-sm text-gray-600 hover:text-gray-900 underline"
                      >
                        Edit
                      </button>
                    </div>
                    <p className="text-sm text-gray-700 font-mono">
                      •••• •••• •••• {payment.cardNumber.replace(/\s/g, '').slice(-4)}
                    </p>
                    <p className="text-sm text-gray-700">{payment.cardName}</p>
                  </div>

                  <div className="flex justify-between pt-4">
                    <button
                      onClick={() => setStep('payment')}
                      className="text-gray-600 hover:text-gray-900"
                    >
                      ← Back
                    </button>
                    <button
                      onClick={handlePlaceOrder}
                      className="bg-gray-900 text-white px-6 py-2.5 rounded hover:bg-gray-700 transition-colors"
                    >
                      Place Order · ${totalPrice.toFixed(2)}
                    </button>
                  </div>
                </div>
              )}
            </div>

            {summary}
          </div>
        )}
      </div>
    </div>
  )
}

export default Checkout