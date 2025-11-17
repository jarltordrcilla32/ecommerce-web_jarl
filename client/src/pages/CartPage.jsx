import { useEffect, useState, useRef, useCallback, useMemo } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Container from '../components/layout/Container'
import ConfirmModal from '../components/ui/ConfirmModal'
import AuthModal from '../components/ui/AuthModal'

// Import images
import soilConditionerImg from '../assets/images/soil-conditioner.png'
import hogSwillImg from '../assets/images/hog-swill.png'

function CartPage() {
  const navigate = useNavigate()
  const [items, setItems] = useState([])
  const [loaded, setLoaded] = useState(false)
  const [showAuth, setShowAuth] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const isInitialLoad = useRef(true)

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

  // Function to ensure cart items have proper id field
  const ensureCartItemIds = (cartItems) => {
    return cartItems.map(item => {
      if (!item.id && item.productId) {
        // Generate id from productId and size if missing
        const normSize = String(item.size || '').toLowerCase().replace(/[^a-z0-9]+/g, '-')
        const category = item.category || (item.name?.toLowerCase().includes('soil') ? 'soil' : 'hogs')
        return {
          ...item,
          id: `${category}-${normSize}`
        }
      }
      return item
    })
  }

  // Load cart from server or localStorage on mount
  useEffect(() => {
    const loadCart = async () => {
      const token = localStorage.getItem('token')
      
      if (token) {
        // User is authenticated, load from server
        setIsAuthenticated(true)
        try {
          const response = await fetch('http://localhost:5177/api/cart', {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          })
          
          if (response.ok) {
            const serverCart = await response.json()
            const cartWithIds = ensureCartItemIds(serverCart)
            setItems(cartWithIds)
            // Update localStorage to match server
            localStorage.setItem('cart', JSON.stringify(cartWithIds))
            const count = cartWithIds.reduce((s, i) => s + (Number(i.qty) || 0), 0)
            window.dispatchEvent(new CustomEvent('cart:changed', { detail: { count } }))
          } else {
            // Fallback to localStorage if server fails
            const localCart = JSON.parse(localStorage.getItem('cart') || '[]')
            const cartWithIds = ensureCartItemIds(localCart)
            setItems(cartWithIds)
          }
        } catch (error) {
          console.error('Error loading cart from server:', error)
          // Fallback to localStorage
          const localCart = JSON.parse(localStorage.getItem('cart') || '[]')
          const cartWithIds = ensureCartItemIds(localCart)
          setItems(cartWithIds)
        }
      } else {
        // User not authenticated, clear cart
        setIsAuthenticated(false)
        setItems([])
      }
      
      setLoaded(true)
      isInitialLoad.current = false
    }

    loadCart()
  }, [])

  // Listen for auth changes
  useEffect(() => {
    const handleAuthChanged = (e) => {
      if (e.detail?.user) {
        setIsAuthenticated(true)
        // Reload cart when user logs in
        const loadCart = async () => {
          const token = localStorage.getItem('token')
          if (token) {
            try {
              const response = await fetch('http://localhost:5177/api/cart', {
                headers: { 'Authorization': `Bearer ${token}` }
              })
              if (response.ok) {
                const serverCart = await response.json()
                const cartWithIds = ensureCartItemIds(serverCart)
                setItems(cartWithIds)
                localStorage.setItem('cart', JSON.stringify(cartWithIds))
                const count = cartWithIds.reduce((s, i) => s + (Number(i.qty) || 0), 0)
                window.dispatchEvent(new CustomEvent('cart:changed', { detail: { count } }))
              }
            } catch (error) {
              console.error('Error loading cart after login:', error)
            }
          }
        }
        loadCart()
      } else {
        setIsAuthenticated(false)
        setItems([])
      }
    }

    // Listen for cart changes (e.g., when cart is cleared after checkout)
    const handleCartChanged = (e) => {
      if (e.detail.count === 0) {
        // Cart was cleared, update local state
        setItems([])
      }
    }

    window.addEventListener('auth:changed', handleAuthChanged)
    window.addEventListener('cart:changed', handleCartChanged)
    
    return () => {
      window.removeEventListener('auth:changed', handleAuthChanged)
      window.removeEventListener('cart:changed', handleCartChanged)
    }
  }, [])

  // Save cart to localStorage and backend when user makes changes
  const saveCart = useCallback((newItems) => {
    try {
      localStorage.setItem('cart', JSON.stringify(newItems))
      const count = newItems.reduce((s, i) => s + (Number(i.qty) || 0), 0)
      
      // Dispatch event to update header cart count
      window.dispatchEvent(new CustomEvent('cart:changed', { detail: { count } }))
      
      const token = localStorage.getItem('token')
      if (token) {
        fetch('http://localhost:5177/api/cart', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({ items: newItems })
        }).catch(() => {})
      }
    } catch (error) {
      console.error('Error saving cart:', error)
    }
  }, [])

  const updateQty = useCallback((id, delta) => {
    setItems(prev => {
      const newItems = prev.map(it => it.id === id ? { ...it, qty: Math.max(1, it.qty + delta) } : it)
      saveCart(newItems)
      return newItems
    })
  }, [saveCart])

  const removeItem = useCallback((id) => {
    setItems(prev => {
      const newItems = prev.filter(it => it.id !== id)
      saveCart(newItems)
      return newItems
    })
  }, [saveCart])

  const clearCart = useCallback(() => {
    setItems([])
    saveCart([])
  }, [saveCart])

  const subtotal = useMemo(() => 
    items.reduce((sum, it) => sum + it.price * it.qty, 0), 
    [items]
  )

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
            {isAuthenticated ? (
              <>
                <p className="text-xl text-gray-600 mb-6">Your cart is empty.</p>
                <Link to="/products/soil" className="inline-flex items-center gap-2 px-5 py-3 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700">
                  Shop Products
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
              </>
            ) : (
              <>
                <p className="text-xl text-gray-600 mb-6">Log In to Shop Products</p>
                <button 
                  onClick={() => setShowAuth(true)}
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700"
                >
                  Log In
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                  </svg>
                </button>
              </>
            )}
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Items */}
            <div className="lg:col-span-2 space-y-4">
              {items.map(item => (
                <div key={item.id} className="bg-white rounded-2xl border border-gray-100 p-4 sm:p-6 shadow-sm">
                  <div className="flex items-center gap-4">
                    <div className="w-24 h-24 rounded-xl bg-gray-50 border border-gray-100 overflow-hidden flex-shrink-0">
                      <img src={getImageSrc(item)} alt={item.name} className="w-full h-full object-contain" />
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
              <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
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
                <button onClick={() => navigate('/checkout', { state: { items } })} className="mt-6 w-full inline-flex justify-center px-6 py-4 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-700 text-white font-semibold hover:from-emerald-700 hover:to-emerald-800 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl">
                  Checkout
                </button>
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
          isOpen={confirm.open}
          title={confirm.type === 'clear' ? 'Clear cart?' : 'Remove this item?'}
          message={confirm.type === 'remove' ? items.find(i => i.id === confirm.itemId)?.name : 'This will remove all items from your cart.'}
          confirmText={confirm.type === 'clear' ? 'Clear cart' : 'Remove item'}
          type={confirm.type === 'clear' ? 'danger' : 'warning'}
          onClose={() => setConfirm({ open: false, type: null, itemId: null })}
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
      {showAuth && <AuthModal onClose={() => setShowAuth(false)} redirectAfterLogin={false} />}
    </Container>
  )
}

export default CartPage
