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

function Router() {
  // Load user's cart from server on app load if user is authenticated, clear if not
  useEffect(() => {
    const loadUserCart = async () => {
      const token = localStorage.getItem('token')
      if (token) {
        try {
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
