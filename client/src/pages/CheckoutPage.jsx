import { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import Container from '../components/layout/Container'
import { useNotification } from '../contexts/NotificationContext'

// Import images
import soilConditionerImg from '../assets/images/soil-conditioner.png'
import hogSwillImg from '../assets/images/hog-swill.png'

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
  const [error, setError] = useState('')
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [validationErrors, setValidationErrors] = useState({})
  const { showError } = useNotification()

  // Function to get the correct hardcoded image based on product name
  const getImageSrc = (item) => {
    if (!item) return null
    
    // Check product name for soil conditioner variants
    if (item.name && item.name.toLowerCase().includes('soil conditioner')) {
      return soilConditionerImg
    }
    // Check product name for hogs swill
    if (item.name && item.name.toLowerCase().includes('hogs')) {
      return hogSwillImg
    }
    
    // Fallback to soil conditioner for unknown products
    return soilConditionerImg
  }

  const subtotal = items.reduce((sum, it) => sum + it.price * it.qty, 0)
  const shippingFee = 0
  const total = subtotal + shippingFee

  // Load user data on mount: prefer API, fallback to localStorage
  useEffect(() => {
    const applyAddress = (addr = {}) => {
      setPhone(addr.phone || '')
      setStreet(addr.street || '')
      setCity(addr.city || '')
      setProvince(addr.province || '')
      setPostal(addr.postal || '')
    }

    const loadUserData = () => {
      try {
        const token = localStorage.getItem('token')
        if (!token) {
          setLoading(false)
          return
        }

        // First, use any cached user
        const cached = JSON.parse(localStorage.getItem('user') || '{}')
        if (cached.id) {
          setUser(cached)
          if (cached.name) setFullName(cached.name)
          if (cached.address) applyAddress(cached.address)
        }
        
        // Then refresh from API to get latest address
        ;(async () => {
          try {
            const res = await fetch('http://localhost:5177/api/me', {
              headers: { Authorization: `Bearer ${token}` }
            })
            if (res.ok) {
              const fresh = await res.json()
              setUser(fresh)
              if (fresh.name) setFullName(fresh.name)
              if (fresh.address) applyAddress(fresh.address)
              // Update cache so future loads are instant
              localStorage.setItem('user', JSON.stringify(fresh))
              // Let the rest of the app know
              window.dispatchEvent(new CustomEvent('auth:changed', { detail: { user: fresh } }))
            }
          } catch {}
        })()
      } catch (error) {
        console.error('Error loading user data:', error)
      } finally {
        setLoading(false)
      }
    }

    loadUserData()

    // Listen for auth changes to update user data
    const handleAuthChanged = (e) => {
      if (e.detail?.user) {
        setUser(e.detail.user)
        // Autofill name if available
        if (e.detail.user.name) {
          setFullName(e.detail.user.name)
        }
        // Autofill saved address if available
        if (e.detail.user.address) applyAddress(e.detail.user.address)
      } else {
        setUser(null)
      }
    }

    window.addEventListener('auth:changed', handleAuthChanged)
    
    return () => {
      window.removeEventListener('auth:changed', handleAuthChanged)
    }
  }, [])

  // Validation functions
  const validatePhone = (phone) => {
    const phoneRegex = /^09\d{9}$/
    return phoneRegex.test(phone)
  }

  const validatePostal = (postal) => {
    const postalRegex = /^\d{4}$/
    return postalRegex.test(postal)
  }

  const validateForm = () => {
    const errors = {}
    
    if (shippingMethod === 'delivery') {
      if (!fullName.trim()) {
        errors.fullName = 'Full name is required'
      }
      if (!phone.trim()) {
        errors.phone = 'Phone number is required'
      } else if (!validatePhone(phone)) {
        errors.phone = 'Phone number must be in format 09XXXXXXXXX'
      }
      if (!street.trim()) {
        errors.street = 'Street address is required'
      }
      if (!city.trim()) {
        errors.city = 'City is required'
      }
      if (!province.trim()) {
        errors.province = 'Province is required'
      }
      if (!postal.trim()) {
        errors.postal = 'Postal code is required'
      } else if (!validatePostal(postal)) {
        errors.postal = 'Postal code must be 4 digits (e.g., 1234)'
      }
    }
    
    setValidationErrors(errors)
    return Object.keys(errors).length === 0
  }

  async function placeOrder(e) {
    e.preventDefault()
    
    // Validate form
    if (!validateForm()) {
      setError('Please fix the validation errors below.')
      return
    }
    
    setError('')
    setValidationErrors({})
    
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        throw new Error('Please log in to continue')
      }
      
      const response = await fetch('http://localhost:5177/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          items: items.map(item => ({
            productId: item.productId,
            name: item.name,
            price: item.price,
            qty: item.qty,
            image: item.image,
            size: item.size
          })),
          paymentMethod,
          shippingMethod,
          courier: shippingMethod === 'delivery' ? courier : 'pickup',
          address: shippingMethod === 'delivery' ? { fullName, phone, street, city, province, postal } : null,
          saveAddress: shippingMethod === 'delivery' // Save address to user profile for future orders
        })
      })
      
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.message || 'Checkout failed')
      }
      
      // Update user data in localStorage if address was saved
      if (data.user) {
        localStorage.setItem('user', JSON.stringify(data.user))
        // Notify app of user data update
        window.dispatchEvent(new CustomEvent('auth:changed', { detail: { user: data.user } }))
      }
      
      // Clear the cart after successful checkout
      localStorage.removeItem('cart')
      
      // Fetch updated cart from server to ensure consistency
      try {
        const cartResponse = await fetch('http://localhost:5177/api/cart', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        })
        if (cartResponse.ok) {
          const serverCart = await cartResponse.json()
          localStorage.setItem('cart', JSON.stringify(serverCart))
          const count = serverCart.reduce((s, i) => s + (Number(i.qty) || 0), 0)
          window.dispatchEvent(new CustomEvent('cart:changed', { detail: { count } }))
        } else {
          // Fallback: just clear local cart
          window.dispatchEvent(new CustomEvent('cart:changed', { detail: { count: 0 } }))
        }
      } catch (error) {
        console.error('Error fetching updated cart:', error)
        // Fallback: just clear local cart
        window.dispatchEvent(new CustomEvent('cart:changed', { detail: { count: 0 } }))
      }
      
      navigate('/receipt', { state: { order: data.order } })
    } catch (error) {
      setError(error.message)
    }
  }

  if (loading) {
    return (
      <Container>
        <div className="max-w-3xl mx-auto px-4 py-16 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading checkout...</p>
        </div>
      </Container>
    )
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
              <div className="grid sm:grid-cols-2 gap-4">
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
              </div>
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
                    <input 
                      value={fullName} 
                      onChange={e => setFullName(e.target.value)} 
                      className={`w-full px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent ${
                        validationErrors.fullName ? 'border-red-300 bg-red-50' : 'border-gray-200'
                      }`} 
                      placeholder="Juan Dela Cruz" 
                    />
                    {validationErrors.fullName && (
                      <p className="text-red-600 text-xs mt-1">{validationErrors.fullName}</p>
                    )}
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                    <input 
                      value={phone} 
                      onChange={e => setPhone(e.target.value)} 
                      className={`w-full px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent ${
                        validationErrors.phone ? 'border-red-300 bg-red-50' : 'border-gray-200'
                      }`} 
                      placeholder="09XXXXXXXXX" 
                      maxLength="11"
                    />
                    {validationErrors.phone && (
                      <p className="text-red-600 text-xs mt-1">{validationErrors.phone}</p>
                    )}
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Street address</label>
                    <input 
                      value={street} 
                      onChange={e => setStreet(e.target.value)} 
                      className={`w-full px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent ${
                        validationErrors.street ? 'border-red-300 bg-red-50' : 'border-gray-200'
                      }`} 
                      placeholder="123 Green St, Brgy. Sample" 
                    />
                    {validationErrors.street && (
                      <p className="text-red-600 text-xs mt-1">{validationErrors.street}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                    <input 
                      value={city} 
                      onChange={e => setCity(e.target.value)} 
                      className={`w-full px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent ${
                        validationErrors.city ? 'border-red-300 bg-red-50' : 'border-gray-200'
                      }`} 
                    />
                    {validationErrors.city && (
                      <p className="text-red-600 text-xs mt-1">{validationErrors.city}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Province</label>
                    <input 
                      value={province} 
                      onChange={e => setProvince(e.target.value)} 
                      className={`w-full px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent ${
                        validationErrors.province ? 'border-red-300 bg-red-50' : 'border-gray-200'
                      }`} 
                    />
                    {validationErrors.province && (
                      <p className="text-red-600 text-xs mt-1">{validationErrors.province}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Postal code</label>
                    <input 
                      value={postal} 
                      onChange={e => setPostal(e.target.value)} 
                      className={`w-full px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent ${
                        validationErrors.postal ? 'border-red-300 bg-red-50' : 'border-gray-200'
                      }`} 
                      placeholder="1234"
                      maxLength="4"
                    />
                    {validationErrors.postal && (
                      <p className="text-red-600 text-xs mt-1">{validationErrors.postal}</p>
                    )}
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
                      <img src={getImageSrc(item)} alt={item.name} className="w-full h-full object-contain" />
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

export default CheckoutPage
