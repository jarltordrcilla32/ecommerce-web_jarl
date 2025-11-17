import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useEffect, useRef, useState } from 'react'
import AuthModal from '../ui/AuthModal'
import NotificationDropdown from '../ui/NotificationDropdown'

// Import images
import soilConditionerImg from '../../assets/images/soil-conditioner.png'
import hogSwillImg from '../../assets/images/hog-swill.png'

function SiteHeader() {
  const [open, setOpen] = useState(false)
  const [showAuth, setShowAuth] = useState(false)
  const [showSearch, setShowSearch] = useState(false)
  const [currentUser, setCurrentUser] = useState(null)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [cartCount, setCartCount] = useState(0)
  const { pathname } = useLocation()
  const userMenuRef = useRef(null)
  const navigate = useNavigate()
  
  // Determine which nav to show
  const isHomePage = pathname === '/'
  const isProductPage = pathname.startsWith('/products')

  useEffect(() => {
    try {
      const stored = localStorage.getItem('user')
      if (stored) {
        setCurrentUser(JSON.parse(stored))
      }
      const cartStored = localStorage.getItem('cart')
      if (cartStored) {
        const cart = JSON.parse(cartStored)
        setCartCount(cart.reduce((s, i) => s + (Number(i.qty) || 0), 0))
      }
    } catch {}
  }, [])

  useEffect(() => {
    function handleClickOutside(e) {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setShowUserMenu(false)
      }
    }
    document.addEventListener('click', handleClickOutside)
    function handleAuthChanged(e) {
      setCurrentUser(e.detail?.user || null)
    }
    window.addEventListener('auth:changed', handleAuthChanged)
    function handleStorage(e) {
      if (e.key === 'user') {
        try {
          setCurrentUser(e.newValue ? JSON.parse(e.newValue) : null)
        } catch {
          setCurrentUser(null)
        }
      }
    }
    window.addEventListener('storage', handleStorage)
    function handleCartChanged(e) {
      if (typeof e.detail?.count === 'number') {
        setCartCount(e.detail.count)
      } else {
        try {
          const cart = JSON.parse(localStorage.getItem('cart') || '[]')
          setCartCount(cart.reduce((s, i) => s + (Number(i.qty) || 0), 0))
        } catch {}
      }
    }
    window.addEventListener('cart:changed', handleCartChanged)
    return () => {
      document.removeEventListener('click', handleClickOutside)
      window.removeEventListener('auth:changed', handleAuthChanged)
      window.removeEventListener('storage', handleStorage)
      window.removeEventListener('cart:changed', handleCartChanged)
    }
  }, [])

  function handleLogout() {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    // Clear cart when logging out since no user is logged in
    localStorage.removeItem('cart')
    window.dispatchEvent(new CustomEvent('cart:changed', { detail: { count: 0 } }))
    setCurrentUser(null)
    setShowUserMenu(false)
    // Notify app of auth change
    window.dispatchEvent(new CustomEvent('auth:changed', { detail: { user: null } }))
    navigate('/')
  }
  
  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between py-4">
          <Link to="/" className="flex items-center gap-2" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <div className="h-9 w-9 rounded-full bg-emerald-600 grid place-content-center text-white font-bold">GC</div>
            <span className="font-semibold text-lg">GreenConnect</span>
          </Link>
          
           {isHomePage ? (
            // Homepage Navigation
          <nav className="hidden md:flex items-center gap-6 text-sm">
            <div className="relative">
              <button onClick={() => setOpen(v => !v)} className="hover:text-emerald-700 flex items-center gap-1">
                Shop 
                <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M5.25 7.5L10 12.25L14.75 7.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              </button>
              {open && (
                  <div onMouseLeave={() => setOpen(false)} className="absolute left-0 mt-3 w-80 rounded-xl border border-gray-100 bg-white shadow-lg p-4">
                    <h3 className="text-sm font-semibold text-gray-900 mb-3">Our Products</h3>
                    <div className="space-y-3">
                      <Link to="/products/soil" className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                        <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                          <img 
                            src={soilConditionerImg} 
                            alt="Soil Conditioner" 
                            className="w-full h-full object-contain"
                          />
                        </div>
                        <div className="flex-1">
                          <div className="font-medium text-gray-900">Soil Conditioner</div>
                          <div className="text-xs text-gray-600">Premium organic soil from 1kg to 25kg</div>
                          <div className="text-xs font-semibold text-emerald-600">From ₱25</div>
                    </div>
                  </Link>
                      <Link to="/products/hogs" className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                        <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                          <img 
                            src={hogSwillImg} 
                            alt="Hogs Swill" 
                            className="w-full h-full object-contain"
                          />
                        </div>
                        <div className="flex-1">
                          <div className="font-medium text-gray-900">Hogs Swill</div>
                          <div className="text-xs text-gray-600">Premium feed for sustainably raised hogs</div>
                          <div className="text-xs font-semibold text-emerald-600">₱400</div>
                    </div>
                  </Link>
                    </div>
                </div>
              )}
            </div>
                             <a href="#features" className="hover:text-emerald-700 flex items-center gap-2" onClick={(e) => {
                 e.preventDefault();
                 document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
               }}>
                 <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                 </svg>
                 <span>Features</span>
               </a>
               <a href="#impact" className="hover:text-emerald-700 flex items-center gap-2" onClick={(e) => {
                 e.preventDefault();
                 document.getElementById('impact')?.scrollIntoView({ behavior: 'smooth' });
               }}>
                 <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                 </svg>
                 <span>Impact</span>
               </a>
               <a href="#faq" className="hover:text-emerald-700 flex items-center gap-2" onClick={(e) => {
                 e.preventDefault();
                 document.getElementById('faq')?.scrollIntoView({ behavior: 'smooth' });
               }}>
                 <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                 </svg>
                 <span>FAQ</span>
               </a>
          </nav>
          ) : (
            // Product Page Navigation - Shopping Focused
            <nav className="hidden md:flex items-center gap-6 text-sm">
              {/* Breadcrumb */}
              <div className="flex items-center gap-2 text-gray-600">
                <Link to="/" className="hover:text-emerald-700 transition-colors">Home</Link>
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
                <span className="text-gray-900 font-medium">Products</span>
              </div>
              
              {/* Search Bar */}
              <div className="relative">
                <button 
                  onClick={() => setShowSearch(!showSearch)} 
                  className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-200 hover:border-emerald-300 transition-colors bg-gray-50 hover:bg-white"
                >
                  <svg className="h-4 w-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <span className="text-gray-500 text-sm">Search products...</span>
                </button>
                {showSearch && (
                  <div className="absolute top-full left-0 mt-2 w-80 bg-white border border-gray-200 rounded-xl shadow-lg p-4">
                    <input 
                      type="text" 
                      placeholder="Search for products..." 
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                      autoFocus
                    />
                    <div className="mt-3 space-y-2">
                      <div className="text-xs font-medium text-gray-500 mb-2">Popular searches:</div>
                      <div className="flex flex-wrap gap-2">
                        <span className="px-2 py-1 bg-emerald-100 text-emerald-700 text-xs rounded-full cursor-pointer hover:bg-emerald-200">Soil Conditioner</span>
                        <span className="px-2 py-1 bg-emerald-100 text-emerald-700 text-xs rounded-full cursor-pointer hover:bg-emerald-200">Hogs Swill</span>
                        <span className="px-2 py-1 bg-emerald-100 text-emerald-700 text-xs rounded-full cursor-pointer hover:bg-emerald-200">Organic</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Quick Links */}
              <div className="flex items-center gap-4">
                <Link to="/process" className="flex items-center gap-2 text-gray-600 hover:text-emerald-700 transition-colors">
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  <span className="text-sm">Our Process</span>
                </Link>
                <Link to="/impact" className="flex items-center gap-2 text-gray-600 hover:text-emerald-700 transition-colors">
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  <span className="text-sm">Impact</span>
                </Link>
              </div>
            </nav>
          )}
          
          <div className="flex items-center gap-3">
            {!isProductPage && (
            <a href="#download" className="hidden md:inline-flex items-center gap-2 px-3 py-2 text-sm rounded-lg border border-emerald-200 text-emerald-800 hover:bg-emerald-50">
              <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path d="M10 3v9m0 0l3-3m-3 3L7 9M4 14h12v3H4z" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Download app
            </a>
            )}
            {currentUser && <NotificationDropdown />}
            {currentUser ? (
              <div className="hidden md:block relative" ref={userMenuRef}>
                <button onClick={() => setShowUserMenu(v => !v)} className="px-4 py-2 text-sm rounded-lg text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors flex items-center gap-2">
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <span className="font-medium text-base text-gray-900">{currentUser.name || currentUser.email}</span>
                  <svg className="h-4 w-4 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M5.25 7.5L10 12.25L14.75 7.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                </button>
                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-48 rounded-xl border border-gray-100 bg-white shadow-lg p-2">
                    {currentUser?.role === 'admin' ? (
                      <Link to="/admin" className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-50 text-sm text-gray-700">
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                        <span>Admin Dashboard</span>
                      </Link>
                    ) : (
                      <Link to="/orders" className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-50 text-sm text-gray-700">
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7h18M3 12h18M3 17h18" />
                        </svg>
                        <span>My Orders</span>
                      </Link>
                    )}
                    <button onClick={handleLogout} className="w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-50 text-sm text-red-600">
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h6" />
                      </svg>
                      <span>Log out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button onClick={() => setShowAuth(true)} className="hidden md:inline-block px-4 py-2 text-sm rounded-lg text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors">
                <div className="flex items-center gap-2">
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <span>Sign in</span>
                </div>
              </button>
            )}
            <Link to="/cart" className="relative rounded-full px-4 py-2 bg-emerald-600 text-white hover:bg-emerald-700 text-sm transition-colors">
               {isProductPage ? (
                 <div className="flex items-center gap-2">
                   <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01" />
                   </svg>
                   <span>Cart</span>
                 </div>
               ) : (
                 <div className="flex items-center gap-2">
                   <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01" />
                   </svg>
                   <span>Cart</span>
                 </div>
               )}
              <span className="absolute -top-1 -right-1 text-[10px] bg-white text-emerald-700 border border-emerald-600 rounded-full px-1">{cartCount}</span>
            </Link>
          </div>
        </div>
      </div>
      {showAuth && <AuthModal onClose={() => setShowAuth(false)} />}
    </header>
  )
}

export default SiteHeader
