import { BrowserRouter, Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom'
import { createPortal } from 'react-dom'
import { useState, useEffect } from 'react'
import { NotificationProvider } from './contexts/NotificationContext'

// Import pages
import HomePage from './pages/HomePage'
import ProductPage from './pages/ProductPage'
import CartPage from './pages/CartPage'
import CheckoutPage from './pages/CheckoutPage'
import ReceiptPage from './pages/ReceiptPage'
import AdminPage from './pages/AdminPage'
import OrdersPage from './pages/OrdersPage'
import OrderTrackingPage from './pages/OrderTrackingPage'

// Import layout components
import Container from './components/layout/Container'

// Import section components
import ProcessSection from './components/sections/ProcessSection'
import CommunityImpact from './components/sections/CommunityImpact'

function ConfirmModal({ title, description, confirmText = 'Confirm', cancelText = 'Cancel', onConfirm, onCancel }) {
  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-gray-100">
        <div className="p-6">
          <div className="flex items-start gap-3">
            <div className="h-10 w-10 rounded-xl bg-red-100 text-red-700 grid place-content-center">⚠️</div>
            <div className="flex-1">
              <div className="text-lg font-semibold text-gray-900">{title}</div>
              {description && <div className="mt-1 text-sm text-gray-600">{description}</div>}
            </div>
          </div>
          <div className="mt-6 flex items-center justify-end gap-3">
            <button onClick={onCancel} className="px-4 py-2 rounded-lg border-2 border-gray-200 text-gray-700 hover:bg-gray-50">{cancelText}</button>
            <button onClick={onConfirm} className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700">{confirmText}</button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  )
}

function CartPage() {
  const [items, setItems] = useState([
    {
      id: 'soil-1kg',
      name: 'Soil Conditioner - Pouch',
      size: '1kg',
      price: 25,
      qty: 2,
      image: '/src/assets/images/soil conditioner.png',
    },
    {
      id: 'hog-swill',
      name: 'Hogs Swill',
      size: '25-30kg',
      price: 400,
      qty: 1,
      image: '/src/assets/images/hog swill.png',
    },
  ])

  const updateQty = (id, delta) => {
    setItems(prev => prev
      .map(it => it.id === id ? { ...it, qty: Math.max(1, it.qty + delta) } : it)
    )
  }

  const removeItem = (id) => {
    setItems(prev => prev.filter(it => it.id !== id))
  }

  const clearCart = () => setItems([])

  const subtotal = items.reduce((sum, it) => sum + it.price * it.qty, 0)

  const [confirm, setConfirm] = useState({ open: false, type: null, itemId: null })

  return (
    <Container>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
          {items.length > 0 && (
            <button 
              onClick={() => setConfirm({ open: true, type: 'clear', itemId: null })}
              className="inline-flex items-center gap-2 px-3 py-2 text-sm rounded-lg border-2 border-red-200 text-red-700 bg-red-50 hover:bg-red-100">
              <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M6 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm4 0a1 1 0 112 0v6a1 1 0 11-2 0V8z" clipRule="evenodd" />
                <path fillRule="evenodd" d="M4 5h12v1H4V5zm2-2h8a1 1 0 011 1v1H5V4a1 1 0 011-1zm1 15a2 2 0 01-2-2V7h10v9a2 2 0 01-2 2H7z" clipRule="evenodd" />
              </svg>
              Clear cart
            </button>
          )}
        </div>

        {items.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
            <div className="mx-auto w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 grid place-content-center mb-4">
              <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01" />
              </svg>
            </div>
            <p className="text-xl text-gray-600 mb-6">Your cart is empty.</p>
            <Link to="/products/soil" className="inline-flex items-center gap-2 px-5 py-3 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700">
              Shop Products
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Items */}
            <div className="lg:col-span-2 space-y-4">
              {items.map(item => (
                <div key={item.id} className="bg-white rounded-2xl border border-gray-100 p-4 sm:p-6 shadow-sm">
                  <div className="flex items-center gap-4">
                    <div className="w-24 h-24 rounded-xl bg-gray-50 border border-gray-100 overflow-hidden flex-shrink-0">
                      <img src={item.image} alt={item.name} className="w-full h-full object-contain" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <div className="font-semibold text-gray-900 truncate">{item.name}</div>
                          <div className="text-sm text-gray-500">Size: {item.size}</div>
                        </div>
                        <button onClick={() => setConfirm({ open: true, type: 'remove', itemId: item.id })} className="text-gray-400 hover:text-red-600">
                          <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M6 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm4 0a1 1 0 112 0v6a1 1 0 11-2 0V8z" clipRule="evenodd" />
                            <path fillRule="evenodd" d="M4 5h12v1H4V5zm2-2h8a1 1 0 011 1v1H5V4a1 1 0 011-1zm1 15a2 2 0 01-2-2V7h10v9a2 2 0 01-2 2H7z" clipRule="evenodd" />
                          </svg>
                        </button>
                      </div>

                      <div className="mt-4 flex items-center justify-between">
                        <div className="flex items-center border border-gray-200 rounded-xl">
                          <button onClick={() => updateQty(item.id, -1)} className="px-3 py-2 hover:bg-gray-50">
                            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                            </svg>
                          </button>
                          <div className="px-4 py-2 text-sm font-semibold min-w-[40px] text-center">{item.qty}</div>
                          <button onClick={() => updateQty(item.id, 1)} className="px-3 py-2 hover:bg-gray-50">
                            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                          </button>
                        </div>

                        <div className="text-right">
                          <div className="text-lg font-bold text-emerald-600">₱{(item.price * item.qty).toLocaleString()}</div>
                          <div className="text-xs text-gray-500">₱{item.price.toLocaleString()} each</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Summary */}
            <div>
              <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm sticky top-24">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h2>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-medium text-gray-900">₱{subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Shipping</span>
                    <span className="text-emerald-700 font-medium">Free</span>
                  </div>
                  <div className="h-px bg-gray-100 my-2" />
                  <div className="flex items-center justify-between text-base">
                    <span className="font-semibold text-gray-900">Total</span>
                    <span className="text-2xl font-bold text-emerald-600">₱{subtotal.toLocaleString()}</span>
                  </div>
                </div>
                <Link to="/checkout" state={{ items }} className="mt-6 w-full inline-flex justify-center px-6 py-4 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-700 text-white font-semibold hover:from-emerald-700 hover:to-emerald-800 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl">
                  Checkout
                </Link>
                <div className="mt-4 text-center">
                  <Link to="/products/soil" className="text-sm text-emerald-700 hover:underline">Continue shopping</Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      {confirm.open && (
        <ConfirmModal 
          title={confirm.type === 'clear' ? 'Clear cart?' : 'Remove this item?'}
          description={confirm.type === 'remove' ? items.find(i => i.id === confirm.itemId)?.name : 'This will remove all items from your cart.'}
          confirmText={confirm.type === 'clear' ? 'Clear cart' : 'Remove item'}
          onCancel={() => setConfirm({ open: false, type: null, itemId: null })}
          onConfirm={() => {
            if (confirm.type === 'clear') {
              clearCart()
            } else if (confirm.type === 'remove' && confirm.itemId) {
              removeItem(confirm.itemId)
            }
            setConfirm({ open: false, type: null, itemId: null })
          }}
        />
      )}
    </Container>
  )
}

function CheckoutPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const [items] = useState(location.state?.items || [])

  const [paymentMethod, setPaymentMethod] = useState('cod')
  const [shippingMethod, setShippingMethod] = useState('pickup')
  const [courier, setCourier] = useState('jnt')
  const [fullName, setFullName] = useState('')
  const [phone, setPhone] = useState('')
  const [street, setStreet] = useState('')
  const [city, setCity] = useState('')
  const [province, setProvince] = useState('')
  const [postal, setPostal] = useState('')
  const [nameOnCard, setNameOnCard] = useState('')
  const [cardNumber, setCardNumber] = useState('')
  const [expiry, setExpiry] = useState('')
  const [cvv, setCvv] = useState('')
  const [error, setError] = useState('')

  const subtotal = items.reduce((sum, it) => sum + it.price * it.qty, 0)
  const shippingFee = 0
  const total = subtotal + shippingFee

  function placeOrder(e) {
    e.preventDefault()
    if (shippingMethod === 'delivery') {
      if (!fullName || !phone || !street || !city || !province || !postal) {
        setError('Please complete your shipping address.')
        return
      }
    }
    if (paymentMethod === 'card') {
      if (!nameOnCard || !cardNumber || !expiry || !cvv) {
        setError('Please fill in your card details.')
        return
      }
    }
    setError('')
    const order = {
      id: `GC-${Date.now()}`,
      createdAt: new Date().toISOString(),
      items,
      paymentMethod,
      shippingMethod,
      courier: shippingMethod === 'delivery' ? courier : 'pickup',
      address: shippingMethod === 'delivery' ? { fullName, phone, street, city, province, postal } : null,
      subtotal,
      shippingFee,
      total,
    }
    navigate('/receipt', { state: { order } })
  }

  if (items.length === 0) {
    return (
      <Container>
        <div className="max-w-3xl mx-auto px-4 py-16 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Checkout</h1>
          <p className="text-gray-600 mb-6">Your cart is empty. Add items before checking out.</p>
          <Link to="/products/soil" className="inline-flex items-center gap-2 px-5 py-3 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700">
            Shop Products
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </Container>
    )
  }

  return (
    <Container>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left: Forms */}
          <form onSubmit={placeOrder} className="lg:col-span-2 space-y-8">
            {/* Payment Method */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Payment Method</h2>
              <div className="grid sm:grid-cols-3 gap-4">
                <label className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${paymentMethod === 'cod' ? 'border-emerald-500 bg-emerald-50 ring-1 ring-emerald-200' : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'}`}>
                  <input type="radio" name="payment" value="cod" checked={paymentMethod === 'cod'} onChange={() => setPaymentMethod('cod')} className="hidden" />
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-emerald-100 grid place-content-center text-emerald-700">💵</div>
                    <div>
                      <div className="font-medium text-gray-900">Cash on Delivery</div>
                      <div className="text-xs text-gray-500">Pay when you receive</div>
                    </div>
                  </div>
                </label>
                <label className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${paymentMethod === 'ewallet' ? 'border-emerald-500 bg-emerald-50 ring-1 ring-emerald-200' : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'}`}>
                  <input type="radio" name="payment" value="ewallet" checked={paymentMethod === 'ewallet'} onChange={() => setPaymentMethod('ewallet')} className="hidden" />
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-emerald-100 grid place-content-center text-emerald-700">📱</div>
                    <div>
                      <div className="font-medium text-gray-900">E-wallet</div>
                      <div className="text-xs text-gray-500">GCash, Maya, etc.</div>
                    </div>
                  </div>
                </label>
                <label className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${paymentMethod === 'card' ? 'border-emerald-500 bg-emerald-50 ring-1 ring-emerald-200' : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'}`}>
                  <input type="radio" name="payment" value="card" checked={paymentMethod === 'card'} onChange={() => setPaymentMethod('card')} className="hidden" />
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-emerald-100 grid place-content-center text-emerald-700">💳</div>
                    <div>
                      <div className="font-medium text-gray-900">Debit/Credit Card</div>
                      <div className="text-xs text-gray-500">Visa, Mastercard</div>
                    </div>
                  </div>
                </label>
              </div>
              {paymentMethod === 'card' && (
                <div className="mt-6 grid sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Name on card</label>
                    <input value={nameOnCard} onChange={e => setNameOnCard(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent" placeholder="Juan Dela Cruz" />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Card number</label>
                    <input value={cardNumber} onChange={e => setCardNumber(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent" placeholder="1234 5678 9012 3456" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Expiration</label>
                    <input value={expiry} onChange={e => setExpiry(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent" placeholder="MM/YY" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Security code</label>
                    <input value={cvv} onChange={e => setCvv(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent" placeholder="CVV" />
                  </div>
                </div>
              )}
            </div>

            {/* Shipping Method */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Shipping Method</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <label className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${shippingMethod === 'pickup' ? 'border-emerald-500 bg-emerald-50 ring-1 ring-emerald-200' : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'}`}>
                  <input type="radio" name="shipping" value="pickup" checked={shippingMethod === 'pickup'} onChange={() => setShippingMethod('pickup')} className="hidden" />
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-emerald-100 grid place-content-center text-emerald-700">🏪</div>
                      <div>
                        <div className="font-medium text-gray-900">Local Pickup</div>
                        <div className="text-xs text-gray-500">Community facility</div>
                      </div>
                    </div>
                    <div className="text-emerald-700 font-semibold">Free</div>
                  </div>
                </label>
                <label className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${shippingMethod === 'delivery' ? 'border-emerald-500 bg-emerald-50 ring-1 ring-emerald-200' : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'}`}>
                  <input type="radio" name="shipping" value="delivery" checked={shippingMethod === 'delivery'} onChange={() => setShippingMethod('delivery')} className="hidden" />
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-emerald-100 grid place-content-center text-emerald-700">🚚</div>
                      <div>
                        <div className="font-medium text-gray-900">Community Delivery</div>
                        <div className="text-xs text-gray-500">1-2 days</div>
                      </div>
                    </div>
                    <div className="text-emerald-700 font-semibold">Free</div>
                  </div>
                </label>
              </div>
              {shippingMethod === 'delivery' && (
                <div className="mt-6">
                  <div className="text-sm font-medium text-gray-900 mb-3">Courier</div>
                  <div className="grid sm:grid-cols-3 gap-3">
                    <label className={`p-3 rounded-xl border-2 cursor-pointer text-sm ${courier === 'jnt' ? 'border-emerald-500 bg-emerald-50 ring-1 ring-emerald-200' : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'}`}>
                      <input type="radio" name="courier" value="jnt" checked={courier === 'jnt'} onChange={() => setCourier('jnt')} className="hidden" />
                      <div className="flex items-center gap-2">
                        <span className="w-8 h-8 grid place-content-center rounded-lg bg-gray-100">📦</span>
                        <span>J&T Express</span>
                      </div>
                    </label>
                    <label className={`p-3 rounded-xl border-2 cursor-pointer text-sm ${courier === 'lbc' ? 'border-emerald-500 bg-emerald-50 ring-1 ring-emerald-200' : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'}`}>
                      <input type="radio" name="courier" value="lbc" checked={courier === 'lbc'} onChange={() => setCourier('lbc')} className="hidden" />
                      <div className="flex items-center gap-2">
                        <span className="w-8 h-8 grid place-content-center rounded-lg bg-gray-100">📦</span>
                        <span>LBC</span>
                      </div>
                    </label>
                    <label className={`p-3 rounded-xl border-2 cursor-pointer text-sm ${courier === 'ninja' ? 'border-emerald-500 bg-emerald-50 ring-1 ring-emerald-200' : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'}`}>
                      <input type="radio" name="courier" value="ninja" checked={courier === 'ninja'} onChange={() => setCourier('ninja')} className="hidden" />
                      <div className="flex items-center gap-2">
                        <span className="w-8 h-8 grid place-content-center rounded-lg bg-gray-100">📦</span>
                        <span>Ninja Van</span>
                      </div>
                    </label>
                  </div>
                </div>
              )}
            </div>

            {/* Shipping Address (Delivery only) */}
            {shippingMethod === 'delivery' && (
              <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Shipping Address</h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Full name</label>
                    <input value={fullName} onChange={e => setFullName(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent" placeholder="Juan Dela Cruz" />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                    <input value={phone} onChange={e => setPhone(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent" placeholder="09xx xxx xxxx" />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Street address</label>
                    <input value={street} onChange={e => setStreet(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent" placeholder="123 Green St, Brgy. Sample" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                    <input value={city} onChange={e => setCity(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Province</label>
                    <input value={province} onChange={e => setProvince(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Postal code</label>
                    <input value={postal} onChange={e => setPostal(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent" />
                  </div>
                </div>
              </div>
            )}

            {error && <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{error}</div>}
            <button type="submit" className="w-full px-6 py-4 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-700 text-white font-semibold hover:from-emerald-700 hover:to-emerald-800 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl">
              Place Order
            </button>
          </form>

          {/* Right: Summary */}
          <div>
            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm sticky top-24">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h2>
              <div className="space-y-4 mb-4">
                {items.map(item => (
                  <div key={item.id} className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-lg bg-gray-50 border border-gray-100 overflow-hidden flex-shrink-0">
                      <img src={item.image} alt={item.name} className="w-full h-full object-contain" />
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-medium text-gray-900">{item.name}</div>
                      <div className="text-xs text-gray-500">Qty {item.qty} • ₱{item.price.toLocaleString()} each</div>
                    </div>
                    <div className="text-sm font-semibold text-emerald-600">₱{(item.price * item.qty).toLocaleString()}</div>
                  </div>
                ))}
              </div>
              <div className="space-y-3 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium text-gray-900">₱{subtotal.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span className="text-emerald-700 font-medium">Free</span>
                </div>
                <div className="h-px bg-gray-100 my-2" />
                <div className="flex items-center justify-between text-base">
                  <span className="font-semibold text-gray-900">Total</span>
                  <span className="text-2xl font-bold text-emerald-600">₱{total.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Container>
  )
}

function ReceiptPage() {
  const location = useLocation()
  const order = location.state?.order

  function formatCurrency(n) {
    return `₱${n.toLocaleString()}`
  }

  function downloadAsJpg() {
    if (!order) return
    const padding = 40
    const width = 1000
    const lineHeight = 36
    let lines = 10 + (order.items?.length || 0) * 2
    if (order.address) lines += 6
    const height = padding * 2 + lineHeight * (lines + 6)
    const canvas = document.createElement('canvas')
    canvas.width = width
    canvas.height = height
    const ctx = canvas.getContext('2d')

    // Background
    ctx.fillStyle = '#ffffff'
    ctx.fillRect(0, 0, width, height)

    // Header
    let y = padding
    ctx.fillStyle = '#065f46'
    ctx.font = 'bold 32px Poppins, Arial, sans-serif'
    ctx.fillText('GreenConnect', padding, y)
    y += lineHeight
    ctx.fillStyle = '#111827'
    ctx.font = 'bold 28px Arial, sans-serif'
    ctx.fillText('Order Receipt', padding, y)
    y += lineHeight

    ctx.font = '16px Arial, sans-serif'
    ctx.fillStyle = '#374151'
    ctx.fillText(`Order ID: ${order.id}`, padding, y)
    y += lineHeight
    ctx.fillText(`Date: ${new Date(order.createdAt).toLocaleString()}`, padding, y)
    y += lineHeight
    ctx.fillText(`Payment: ${order.paymentMethod.toUpperCase()}`, padding, y)
    y += lineHeight
    ctx.fillText(`Shipping: ${order.shippingMethod}${order.shippingMethod === 'delivery' ? ` • ${order.courier.toUpperCase()}` : ''}`, padding, y)
    y += lineHeight

    if (order.address) {
      y += 10
      ctx.font = 'bold 18px Arial, sans-serif'
      ctx.fillStyle = '#111827'
      ctx.fillText('Shipping Address', padding, y)
      y += lineHeight
      ctx.font = '16px Arial, sans-serif'
      ctx.fillStyle = '#374151'
      ctx.fillText(order.address.fullName, padding, y)
      y += lineHeight
      ctx.fillText(order.address.phone, padding, y)
      y += lineHeight
      ctx.fillText(order.address.street, padding, y)
      y += lineHeight
      ctx.fillText(`${order.address.city}, ${order.address.province} ${order.address.postal}`, padding, y)
      y += lineHeight
    }

    y += 10
    ctx.strokeStyle = '#e5e7eb'
    ctx.beginPath()
    ctx.moveTo(padding, y)
    ctx.lineTo(width - padding, y)
    ctx.stroke()
    y += lineHeight

    ctx.font = 'bold 18px Arial, sans-serif'
    ctx.fillStyle = '#111827'
    ctx.fillText('Items', padding, y)
    y += lineHeight

    ctx.font = '16px Arial, sans-serif'
    ctx.fillStyle = '#374151'
    order.items.forEach(it => {
      ctx.fillText(`${it.qty} × ${it.name}${it.size ? ` (${it.size})` : ''}`, padding, y)
      ctx.fillText(formatCurrency(it.price * it.qty), width - padding - 200, y)
      y += lineHeight
    })

    y += 10
    ctx.beginPath()
    ctx.moveTo(padding, y)
    ctx.lineTo(width - padding, y)
    ctx.stroke()
    y += lineHeight

    ctx.fillStyle = '#111827'
    ctx.fillText('Subtotal', padding, y)
    ctx.fillText(formatCurrency(order.subtotal), width - padding - 200, y)
    y += lineHeight
    ctx.fillText('Shipping', padding, y)
    ctx.fillStyle = '#065f46'
    ctx.fillText('Free', width - padding - 200, y)
    y += lineHeight

    ctx.font = 'bold 22px Arial, sans-serif'
    ctx.fillStyle = '#065f46'
    ctx.fillText('Total', padding, y)
    ctx.fillText(formatCurrency(order.total), width - padding - 200, y)

    const dataUrl = canvas.toDataURL('image/jpeg', 0.95)
    const link = document.createElement('a')
    link.href = dataUrl
    link.download = `${order.id}.jpg`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  if (!order) {
    return (
      <Container>
        <div className="max-w-3xl mx-auto px-4 py-16 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Receipt</h1>
          <p className="text-gray-600 mb-6">No order data found.</p>
          <Link to="/" className="inline-flex items-center gap-2 px-5 py-3 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700">Back to Home</Link>
        </div>
      </Container>
    )
  }

  return (
    <Container>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Receipt</h1>
          <button onClick={downloadAsJpg} className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 shadow">
            Download as JPG
          </button>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-emerald-600 text-white grid place-content-center font-bold">GC</div>
              <div>
                <div className="font-semibold text-gray-900">GreenConnect</div>
                <div className="text-xs text-gray-500">Order Receipt</div>
              </div>
            </div>
            <div className="text-right text-sm">
              <div className="text-gray-900 font-medium">{order.id}</div>
              <div className="text-gray-500">{new Date(order.createdAt).toLocaleString()}</div>
            </div>
          </div>

          <div className="p-6 grid md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-4">
              {order.items.map(it => (
                <div key={it.id} className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-lg bg-gray-50 border border-gray-100 overflow-hidden flex-shrink-0">
                    <img src={it.image} alt={it.name} className="w-full h-full object-contain" />
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-medium text-gray-900">{it.name}</div>
                    <div className="text-xs text-gray-500">Qty {it.qty}{it.size ? ` • ${it.size}` : ''}</div>
                  </div>
                  <div className="text-sm font-semibold text-emerald-600">{formatCurrency(it.price * it.qty)}</div>
                </div>
              ))}
            </div>

            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Payment</span>
                <span className="font-medium text-gray-900">{order.paymentMethod.toUpperCase()}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Shipping</span>
                <span className="font-medium text-gray-900">{order.shippingMethod}{order.shippingMethod === 'delivery' ? ` • ${order.courier.toUpperCase()}` : ''}</span>
              </div>
              {order.address && (
                <div className="mt-4 p-3 rounded-xl bg-gray-50 border border-gray-100 text-sm">
                  <div className="text-gray-900 font-medium mb-1">Shipping Address</div>
                  <div className="text-gray-600">{order.address.fullName}</div>
                  <div className="text-gray-600">{order.address.phone}</div>
                  <div className="text-gray-600">{order.address.street}</div>
                  <div className="text-gray-600">{order.address.city}, {order.address.province} {order.address.postal}</div>
                </div>
              )}
            </div>
          </div>

          <div className="p-6 border-t border-gray-100">
            <div className="max-w-md ml-auto space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium text-gray-900">{formatCurrency(order.subtotal)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Shipping</span>
                <span className="text-emerald-700 font-medium">Free</span>
              </div>
              <div className="h-px bg-gray-100 my-2" />
              <div className="flex items-center justify-between text-base">
                <span className="font-semibold text-gray-900">Total</span>
                <span className="text-2xl font-bold text-emerald-600">{formatCurrency(order.total)}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center">
          <Link to="/" className="inline-flex items-center gap-2 px-5 py-3 rounded-lg border-2 border-emerald-200 text-emerald-700 hover:bg-emerald-50">Back to Home</Link>
        </div>
      </div>
    </Container>
  )
}

function AdminPage() {
  const cards = [
    { title: 'Total Orders', value: '128', subtitle: 'Last 30 days' },
    { title: 'Revenue', value: '₱82,540', subtitle: 'Last 30 days' },
    { title: 'Customers', value: '412', subtitle: 'All time' },
  ]
  const [activeTab, setActiveTab] = useState('orders')

  const products = [
    { name: 'Soil 1kg', stock: 120, sold: 320, color: '#059669' },
    { name: 'Soil 5kg', stock: 45, sold: 180, color: '#10b981' },
    { name: 'Soil 25kg', stock: 18, sold: 92, color: '#34d399' },
    { name: 'Hogs Swill', stock: 60, sold: 140, color: '#6ee7b7' },
  ]

  const users = [
    { id: 'U-001', name: 'Ana Santos', email: 'ana@example.com', role: 'Customer' },
    { id: 'U-002', name: 'Ramon Cruz', email: 'ramon@example.com', role: 'Customer' },
    { id: 'U-003', name: 'Mika Reyes', email: 'mika@example.com', role: 'Admin' },
    { id: 'U-004', name: 'Jose Dela Cruz', email: 'jose@example.com', role: 'Customer' },
  ]

  const orders = users.map((u, i) => ({
    id: `GC-2025${i + 1}`,
    customer: u.name,
    status: 'Paid',
    total: 1500 * (i + 1),
  }))

  const totalSold = products.reduce((s, p) => s + p.sold, 0)
  let startAngle = 0

  return (
    <Container>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Admin Dashboard</h1>
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {cards.map(c => (
            <div key={c.title} className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
              <div className="text-sm text-gray-500">{c.subtitle}</div>
              <div className="text-2xl font-bold text-gray-900 mt-1">{c.value}</div>
              <div className="text-sm font-medium text-gray-900 mt-2">{c.title}</div>
            </div>
          ))}
        </div>
        {/* Inventory widgets */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="text-lg font-semibold text-gray-900">Inventory</div>
            <div className="text-sm text-gray-500">Demo data</div>
          </div>
          <div className="grid md:grid-cols-4 gap-4">
            {products.map(p => {
              const capacity = 200
              const percent = Math.min(100, Math.round((p.stock / capacity) * 100))
              return (
                <div key={p.name} className="rounded-2xl border border-gray-100 p-4 bg-gray-50">
                  <div className="text-sm font-medium text-gray-900 mb-1">{p.name}</div>
                  <div className="text-xs text-gray-500 mb-3">Stock left: {p.stock}</div>
                  <div className="h-2 w-full rounded-full bg-white border border-gray-200 overflow-hidden">
                    <div className="h-full" style={{ width: `${percent}%`, background: p.color }} />
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Sales pie chart */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="text-lg font-semibold text-gray-900">Products Sold</div>
            <div className="text-sm text-gray-500">Total {totalSold}</div>
          </div>
          <div className="grid md:grid-cols-3 gap-6 items-center">
            <div className="md:col-span-1 flex items-center justify-center">
              <svg width="220" height="220" viewBox="0 0 220 220">
                <circle cx="110" cy="110" r="90" fill="#f9fafb" />
                {products.map((p, i) => {
                  const slice = (p.sold / totalSold) * Math.PI * 2
                  const x1 = 110 + 90 * Math.cos(startAngle)
                  const y1 = 110 + 90 * Math.sin(startAngle)
                  const x2 = 110 + 90 * Math.cos(startAngle + slice)
                  const y2 = 110 + 90 * Math.sin(startAngle + slice)
                  const largeArc = slice > Math.PI ? 1 : 0
                  const path = `M110,110 L${x1},${y1} A90,90 0 ${largeArc},1 ${x2},${y2} z`
                  startAngle += slice
                  return <path key={p.name} d={path} fill={p.color} opacity="0.9" />
                })}
                <circle cx="110" cy="110" r="60" fill="#ffffff" />
                <text x="110" y="110" textAnchor="middle" dominantBaseline="middle" fontSize="14" fill="#065f46" fontWeight="bold">Sales</text>
              </svg>
            </div>
            <div className="md:col-span-2 grid sm:grid-cols-2 gap-4">
              {products.map(p => (
                <div key={p.name} className="flex items-center justify-between p-3 rounded-xl bg-gray-50 border border-gray-100">
                  <div className="flex items-center gap-3">
                    <span className="w-3 h-3 rounded-full" style={{ background: p.color }} />
                    <div className="text-sm font-medium text-gray-900">{p.name}</div>
                  </div>
                  <div className="text-sm text-gray-600">{p.sold} sold</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Data tables with tabs */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="text-lg font-semibold text-gray-900">Data</div>
            <div className="flex gap-2 text-sm">
              <button onClick={() => setActiveTab('orders')} className={`px-3 py-1.5 rounded-lg border ${activeTab === 'orders' ? 'border-emerald-300 bg-emerald-50 text-emerald-800' : 'border-gray-200 text-gray-700 hover:bg-gray-50'}`}>Orders</button>
              <button onClick={() => setActiveTab('users')} className={`px-3 py-1.5 rounded-lg border ${activeTab === 'users' ? 'border-emerald-300 bg-emerald-50 text-emerald-800' : 'border-gray-200 text-gray-700 hover:bg-gray-50'}`}>Users</button>
            </div>
          </div>
          {activeTab === 'orders' ? (
            <>
              <div className="grid grid-cols-4 gap-4 text-sm font-medium text-gray-500 mb-2">
                <div>Order ID</div>
                <div>Customer</div>
                <div>Status</div>
                <div className="text-right">Total</div>
              </div>
              {orders.map(o => (
                <div key={o.id} className="grid grid-cols-4 gap-4 py-3 border-t border-gray-100 text-sm">
                  <div className="font-mono">{o.id}</div>
                  <div>{o.customer}</div>
                  <div><span className="px-2 py-1 rounded-full bg-emerald-100 text-emerald-700">{o.status}</span></div>
                  <div className="text-right">₱{o.total.toLocaleString()}</div>
                </div>
              ))}
            </>
          ) : (
            <>
              <div className="grid grid-cols-4 gap-4 text-sm font-medium text-gray-500 mb-2">
                <div>User ID</div>
                <div>Name</div>
                <div>Email</div>
                <div className="text-right">Role</div>
              </div>
              {users.map(u => (
                <div key={u.id} className="grid grid-cols-4 gap-4 py-3 border-t border-gray-100 text-sm">
                  <div className="font-mono">{u.id}</div>
                  <div>{u.name}</div>
                  <div className="truncate">{u.email}</div>
                  <div className="text-right">
                    <span className={`px-2 py-1 rounded-full ${u.role === 'Admin' ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-700'}`}>{u.role}</span>
                  </div>
                </div>
              ))}
            </>
          )}
        </div>
      </div>
    </Container>
  )
}

function Router() {
  // Load user's cart from server on app load if user is authenticated, clear if not
  useEffect(() => {
    const loadUserCart = async () => {
      const token = localStorage.getItem('token')
      if (token) {
        try {
          // Load user's cart from server (don't push local changes)
          const response = await fetch('http://localhost:5177/api/cart', {
            headers: { Authorization: `Bearer ${token}` }
          })
          
          if (response.ok) {
            const serverCart = await response.json()
            localStorage.setItem('cart', JSON.stringify(serverCart))
            const count = serverCart.reduce((s, i) => s + (Number(i.qty) || 0), 0)
            window.dispatchEvent(new CustomEvent('cart:changed', { detail: { count } }))
          }
        } catch (error) {
          console.error('Error loading user cart on app load:', error)
        }
      } else {
        // No user logged in, clear local cart
        localStorage.removeItem('cart')
        window.dispatchEvent(new CustomEvent('cart:changed', { detail: { count: 0 } }))
      }
    }

    loadUserCart()

    // Listen for auth changes to clear cart when user logs out
    const handleAuthChanged = (e) => {
      if (!e.detail?.user) {
        // User logged out, clear cart
        localStorage.removeItem('cart')
        window.dispatchEvent(new CustomEvent('cart:changed', { detail: { count: 0 } }))
      }
    }

    window.addEventListener('auth:changed', handleAuthChanged)
    
    return () => {
      window.removeEventListener('auth:changed', handleAuthChanged)
    }
  }, [])

  return (
    <NotificationProvider>
      <BrowserRouter>
        <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/products/soil" element={
          <ProductPage 
            slug="soil" 
            title="Premium Soil Conditioner" 
            price={199} 
            description="Upcycled from food waste via composting and curing to boost soil health. Perfect for gardens, farms, and landscaping projects." 
            sustainability="Diverts waste from landfill and enriches local farms and gardens while creating community jobs." 
          />
        } />
        <Route path="/products/hogs" element={
          <ProductPage 
            slug="hogs" 
            title="Sustainably Raised Hogs" 
            price={5500} 
            description="Raised on a controlled diet incorporating processed food waste, ensuring quality and affordability while supporting our circular economy." 
            sustainability="Reduces feed costs and repurposes waste under safe, supervised practices while providing quality meat to the community." 
          />
        } />
        <Route path="/process" element={
          <Container>
            <ProcessSection />
          </Container>
        } />
        <Route path="/impact" element={
          <Container>
            <CommunityImpact />
          </Container>
        } />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/receipt" element={<ReceiptPage />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/orders" element={<OrdersPage />} />
        <Route path="/orders/:orderId" element={<OrderTrackingPage />} />
        <Route path="/about" element={
          <Container>
            <div className="max-w-4xl mx-auto px-4 py-24">
              <h1 className="text-4xl font-bold text-gray-900 mb-8">About GreenConnect</h1>
              <p className="text-xl text-gray-600 leading-relaxed">
                We are a community-driven initiative transforming food waste into valuable products while building a sustainable circular economy in our barangay.
              </p>
            </div>
          </Container>
        } />
        <Route path="/cart" element={<CartPage />} />
        <Route path="*" element={
          <Container>
            <div className="max-w-4xl mx-auto px-4 py-24">
              <h1 className="text-4xl font-bold text-gray-900 mb-8">Page Not Found</h1>
              <p className="text-xl text-gray-600">The page you're looking for doesn't exist.</p>
            </div>
          </Container>
        } />
      </Routes>
    </BrowserRouter>
    </NotificationProvider>
  )
}

export default Router

function FeatureCard({ title, text, icon }) {
  return (
    <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
      <div className="text-2xl">{icon}</div>
      <div className="mt-2 font-medium">{title}</div>
      <div className="text-gray-600 text-sm">{text}</div>
    </div>
  )
}

function TabGroup({ tabs }) {
  const [active, setActive] = useState(0)
  return (
    <div>
      <div className="flex gap-2 border-b border-gray-200">
        {tabs.map((t, i) => (
          <button key={t.name} onClick={() => setActive(i)} className={`px-3 py-2 text-sm rounded-t-lg ${i === active ? 'bg-white border border-b-white border-gray-200' : 'text-gray-600 hover:text-emerald-700'}`}>{t.name}</button>
        ))}
      </div>
      <div className="p-4 border border-t-0 border-gray-200 rounded-b-lg bg-white">
        {tabs[active]?.content}
      </div>
    </div>
  )
}

function AuthModal({ onClose }) {
  const [mode, setMode] = useState('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const navigate = useNavigate()

  // Prevent background scroll while modal is open
  useEffect(() => {
    const original = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = original
    }
  }, [])

  function submit(e) {
    e.preventDefault()
    setError('')
    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
      onClose()
      navigate('/admin')
    }, 500)
  }

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-gray-100 transform transition-all duration-200 scale-100">
        {/* Header */}
        <div className="flex items-center justify-between p-6 pb-4">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-lg bg-emerald-50 grid place-content-center">
              <svg className="h-5 w-5 text-emerald-600" viewBox="0 0 20 20" fill="currentColor">
                <path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" />
              </svg>
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                {mode === 'login' ? 'Welcome back' : 'Create account'}
              </h2>
              <p className="text-sm text-gray-500">
                {mode === 'login' ? 'Sign in to your account' : 'Join our community'}
              </p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="h-8 w-8 grid place-content-center rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" />
            </svg>
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="px-6 pb-6">
          <div className="flex rounded-xl bg-gray-50 p-1">
            <button 
              onClick={() => setMode('login')} 
              className={`flex-1 py-2.5 px-4 text-sm font-medium rounded-lg transition-all ${
                mode === 'login' 
                  ? 'bg-white text-gray-900 shadow-sm ring-1 ring-gray-200' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Sign in
            </button>
            <button 
              onClick={() => setMode('register')} 
              className={`flex-1 py-2.5 px-4 text-sm font-medium rounded-lg transition-all ${
                mode === 'register' 
                  ? 'bg-white text-gray-900 shadow-sm ring-1 ring-gray-200' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Register
            </button>
          </div>
        </div>

        {/* Form */}
        <form className="px-6 pb-6 space-y-4" onSubmit={submit}>
          {mode === 'register' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Full name</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" />
                  </svg>
                </div>
                <input 
                  value={name} 
                  onChange={e => setName(e.target.value)} 
                  placeholder="Enter your full name"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all text-gray-900 placeholder-gray-500" 
                />
              </div>
            </div>
          )}
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email address</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M2.003 2.003a1 1 0 00-1.414 0L.5 2.586a1 1 0 00-.293.707v12.828a1 1 0 00.293.707l.089.089a1 1 0 001.414 0l.089-.089a1 1 0 00.293-.707V3.293a1 1 0 00-.293-.707L2.003 2.003zM15 5.5a1 1 0 00-1 1v8a1 1 0 001 1h2a1 1 0 001-1v-8a1 1 0 00-1-1h-2zM5 5.5a1 1 0 00-1 1v8a1 1 0 001 1h2a1 1 0 001-1v-8a1 1 0 00-1-1H5z" />
                </svg>
              </div>
              <input 
                type="email" 
                value={email} 
                onChange={e => setEmail(e.target.value)} 
                placeholder="Enter your email"
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all text-gray-900 placeholder-gray-500" 
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                </svg>
              </div>
              <input 
                type={showPassword ? "text" : "password"}
                value={password} 
                onChange={e => setPassword(e.target.value)} 
                placeholder="Enter your password"
                className="w-full pl-10 pr-12 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all text-gray-900 placeholder-gray-500" 
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
              >
                {showPassword ? (
                  <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                    <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z" clipRule="evenodd" />
                    <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z" />
                  </svg>
                )}
              </button>
            </div>
          </div>
          
          {error && (
            <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
              {error}
            </div>
          )}
          
          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full py-3 px-4 rounded-xl bg-emerald-600 text-white font-medium hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-[1.02] active:scale-[0.98]"
          >
            {isLoading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                {mode === 'login' ? 'Signing in...' : 'Creating account...'}
              </div>
            ) : (
              mode === 'login' ? 'Sign in' : 'Create account'
            )}
          </button>
        </form>

        {/* Social Login */}
        <div className="px-6 pb-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Or continue with</span>
            </div>
          </div>
          
          <div className="mt-4 grid grid-cols-2 gap-3">
            <button className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 transition-colors">
              <svg className="h-5 w-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Google
            </button>
            <button className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 transition-colors">
              <svg className="h-5 w-5" viewBox="0 0 24 24">
                <path fill="#1877F2" d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
              Facebook
        </button>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-gray-50 rounded-b-2xl">
          <p className="text-xs text-center text-gray-500">
            By continuing, you agree to our{' '}
            <a href="#" className="text-emerald-600 hover:text-emerald-700 font-medium">Terms</a>
            {' '}and{' '}
            <a href="#" className="text-emerald-600 hover:text-emerald-700 font-medium">Privacy Policy</a>
          </p>
        </div>
      </div>
    </div>,
    document.body
  )
}
