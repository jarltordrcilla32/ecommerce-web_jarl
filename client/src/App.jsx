import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import { useEffect } from 'react'
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
