import { useState, useEffect } from 'react'
import Container from '../components/layout/Container'
import TabGroup from '../components/ui/TabGroup'
import AuthModal from '../components/ui/AuthModal'
import { useNotification } from '../contexts/NotificationContext'

// Import images
import soilConditionerImg from '../assets/images/soil-conditioner.png'
import hogSwillImg from '../assets/images/hog-swill.png'

function ProductPage({ slug, title, price, description, sustainability }) {
  const [qty, setQty] = useState(1)
  const [showAuth, setShowAuth] = useState(false)
  const [selectedVariant, setSelectedVariant] = useState(0)
  const { showSuccess, showError } = useNotification()
  
  // Hardcoded product variants based on slug
  const variants = slug === 'soil' ? [
    {
      _id: '68d4c80931a9af44a2f8243a', // Real database ID for 1kg
      name: 'Soil Conditioner - Pouch',
      size: '1kg',
      price: 25,
      stock: 103,
      description: 'Perfect for small gardens and potted plants',
      image: soilConditionerImg,
      category: 'soil'
    },
    {
      _id: '68d4c80931a9af44a2f8243b', // Real database ID for 5kg
      name: 'Soil Conditioner - Pack',
      size: '5kg',
      price: 100,
      stock: 45,
      description: 'Ideal for medium-sized gardens and landscaping',
      image: soilConditionerImg,
      category: 'soil'
    },
    {
      _id: '68d4c80931a9af44a2f8243c', // Real database ID for 25kg
      name: 'Soil Conditioner - Sack',
      size: '25kg',
      price: 500,
      stock: 7,
      description: 'Best value for commercial farming and large projects',
      image: soilConditionerImg,
      category: 'soil'
    }
  ] : slug === 'hogs' ? [
    {
      _id: '68d4c80931a9af44a2f8243d', // Real database ID for hogs swill
      name: 'Hogs Swill',
      size: '25-30kg',
      price: 400,
      stock: 60,
      description: 'Premium feed for sustainably raised hogs',
      image: hogSwillImg,
      category: 'hogs'
    }
  ] : []
  
  const currentVariant = variants[selectedVariant] || {}

  async function addToCart() {
    const token = localStorage.getItem('token')
    if (!token) {
      setShowAuth(true)
      return
    }
    
    if (!currentVariant._id) {
      showError('Product not available')
      return
    }
    
    if (!currentVariant.stock || currentVariant.stock === 0) {
      showError('This product is out of stock')
      return
    }
    
    if (qty > currentVariant.stock) {
      showError(`Only ${currentVariant.stock} items available in stock`)
      return
    }
    
    try {
      const stored = localStorage.getItem('cart')
      const cart = stored ? JSON.parse(stored) : []
      const normSize = String(currentVariant.size).toLowerCase().replace(/[^a-z0-9]+/g, '-')
      const id = `${slug}-${normSize}`
      const index = cart.findIndex(i => i.id === id)
      if (index >= 0) {
        cart[index].qty += qty
      } else {
        cart.push({
          id,
          productId: currentVariant._id, // Use database product ID
          name: currentVariant.name,
          size: currentVariant.size,
          price: currentVariant.price,
          qty,
          image: currentVariant.image,
        })
      }
      
      // Update localStorage
      localStorage.setItem('cart', JSON.stringify(cart))
      const count = cart.reduce((s, i) => s + (Number(i.qty) || 0), 0)
      window.dispatchEvent(new CustomEvent('cart:changed', { detail: { count } }))
      
      // Show success notification
      const totalPrice = (currentVariant.price || 0) * qty
      showSuccess(`${qty}x ${currentVariant.name} (${currentVariant.size}) added to cart! Total: ₱${totalPrice.toLocaleString()}`)
      
      // Sync to server if user is authenticated
      if (token) {
        try {
          await fetch('http://localhost:5177/api/cart', {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({ items: cart })
          })
        } catch (error) {
          console.error('Error syncing cart to server:', error)
        }
      }
    } catch (error) {
      console.error('Error adding to cart:', error)
    }
  }


  return (
    <Container>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="space-y-6">
            <div className="aspect-square rounded-2xl overflow-hidden bg-gray-100 shadow-lg">
              <img 
                src={currentVariant.image} 
                alt={currentVariant.name} 
                className="w-full h-full object-contain"
              />
        </div>
            
            {/* Product Variants */}
        <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Select Size</h3>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {variants.map((variant, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedVariant(index)}
                    className={`p-4 rounded-xl border-2 transition-all text-left ${
                      selectedVariant === index 
                        ? 'border-emerald-500 bg-emerald-50 ring-2 ring-emerald-200' 
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <div className="aspect-square rounded-lg overflow-hidden bg-gray-100 mb-3">
                      <img src={variant.image} alt={variant.name} className="w-full h-full object-contain" />
            </div>
                    <div className="text-sm font-medium text-gray-900">{variant.size}</div>
                    <div className="text-lg font-bold text-emerald-600">₱{variant.price.toLocaleString()}</div>
                    <div className={`text-xs font-medium ${variant.stock > 10 ? 'text-emerald-600' : variant.stock > 0 ? 'text-yellow-600' : 'text-red-600'}`}>
                      {variant.stock || 0} in stock
                    </div>
                  </button>
                ))}
          </div>
          </div>
          </div>

          {/* Product Info */}
          <div className="space-y-8">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <span className="px-3 py-1 bg-emerald-100 text-emerald-800 text-sm font-semibold rounded-full">
                  {slug === 'soil' ? 'Best Seller' : 'Limited Stock'}
                </span>
                <div className="flex items-center gap-1 text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="h-4 w-4 fill-current" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                  <span className="text-sm text-gray-500 ml-1">(24 reviews)</span>
                </div>
              </div>
              
              <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">{currentVariant.name}</h1>
              <p className="text-lg text-gray-600 leading-relaxed mb-6">{currentVariant.description}</p>
              
              <div className="flex items-baseline gap-4 mb-6">
                <div className="text-3xl lg:text-4xl font-bold text-emerald-600">₱{currentVariant.price.toLocaleString()}</div>
                <div className="text-lg text-gray-500 line-through">₱{(currentVariant.price * 1.2).toLocaleString()}</div>
                <div className="px-3 py-1 bg-red-100 text-red-800 text-sm font-semibold rounded-lg">20% OFF</div>
              </div>

              {/* Size and Stock Info */}
              <div className="p-4 rounded-xl bg-gray-50 border border-gray-200 mb-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Size:</span>
                  <span className="text-lg font-semibold text-gray-900">{currentVariant.size}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">Stock:</span>
                  <div className="flex items-center gap-2">
                    <span className={`text-lg font-semibold ${currentVariant.stock > 10 ? 'text-emerald-600' : currentVariant.stock > 0 ? 'text-yellow-600' : 'text-red-600'}`}>
                      {currentVariant.stock || 0} available
                    </span>
                    {currentVariant.stock <= 10 && currentVariant.stock > 0 && (
                      <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded-full">
                        Low Stock
                      </span>
                    )}
                    {currentVariant.stock === 0 && (
                      <span className="px-2 py-1 bg-red-100 text-red-800 text-xs font-medium rounded-full">
                        Out of Stock
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Add to Cart */}
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <label className="text-base font-medium text-gray-700">Quantity:</label>
                <div className="flex items-center border border-gray-200 rounded-xl">
                  <button 
                    onClick={() => setQty(q => Math.max(1, q - 1))} 
                    className="px-4 py-3 hover:bg-gray-50 transition-colors"
                  >
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                    </svg>
                  </button>
                  <div className="px-6 py-3 text-lg font-semibold min-w-[60px] text-center">{qty}</div>
                  <button 
                    onClick={() => setQty(q => q + 1)} 
                    className="px-4 py-3 hover:bg-gray-50 transition-colors"
                  >
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                  </button>
                </div>
              </div>
              
              <div className="flex gap-4">
                <button 
                  onClick={addToCart} 
                  disabled={!currentVariant.stock || currentVariant.stock === 0}
                  className={`flex-1 px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 shadow-lg ${
                    !currentVariant.stock || currentVariant.stock === 0
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-gradient-to-r from-emerald-600 to-emerald-700 text-white hover:from-emerald-700 hover:to-emerald-800 transform hover:scale-105 hover:shadow-xl'
                  }`}
                >
                  {!currentVariant.stock || currentVariant.stock === 0 
                    ? 'Out of Stock' 
                    : `Add to Cart - ₱${((currentVariant.price || 0) * qty).toLocaleString()}`
                  }
                </button>
                <button className="px-6 py-4 rounded-xl border-2 border-emerald-200 text-emerald-700 hover:bg-emerald-50 transition-colors">
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364z" />
                  </svg>
                </button>
              </div>

              {/* Quick Info */}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-3 p-4 rounded-xl bg-gray-50 border border-gray-200">
                  <svg className="h-5 w-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <div>
                    <div className="text-sm font-medium text-gray-900">Local Pickup</div>
                    <div className="text-xs text-gray-600">Available</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 rounded-xl bg-gray-50 border border-gray-200">
                  <svg className="h-5 w-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <div className="text-sm font-medium text-gray-900">Fast Delivery</div>
                    <div className="text-xs text-gray-600">1-2 days</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Sustainability Badge */}
            <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-100">
              <div className="flex items-center gap-3 mb-3">
                <div className="h-8 w-8 rounded-lg bg-emerald-100 flex items-center justify-center">
                  <svg className="h-5 w-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-gray-900">Sustainability Impact</h3>
              </div>
              <p className="text-gray-700">{sustainability}</p>
            </div>

            {/* Product Details */}
            <div>
            <TabGroup tabs={[
                { name: 'Description', content: <p className="text-gray-700 leading-relaxed">{currentVariant.description}</p> },
                { name: 'Specifications', content: (
                  <ul className="space-y-3 text-gray-700">
                    <li className="flex items-center gap-3">
                      <div className="h-2 w-2 rounded-full bg-emerald-500"></div>
                      <span>Locally produced in our community facility</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <div className="h-2 w-2 rounded-full bg-emerald-500"></div>
                      <span>Waste-to-value circular process</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <div className="h-2 w-2 rounded-full bg-emerald-500"></div>
                      <span>Community verified quality standards</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <div className="h-2 w-2 rounded-full bg-emerald-500"></div>
                      <span>Plastic-free packaging</span>
                    </li>
                  </ul>
                ) },
                { name: 'Reviews', content: (
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <div className="text-3xl font-bold text-gray-900">4.9</div>
                      <div>
                        <div className="flex items-center gap-1 text-yellow-400 mb-1">
                          {[...Array(5)].map((_, i) => (
                            <svg key={i} className="h-5 w-5 fill-current" viewBox="0 0 20 20">
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          ))}
                        </div>
                        <div className="text-sm text-gray-600">Based on 24 reviews</div>
                      </div>
                    </div>
                    <p className="text-gray-600">Customer reviews coming soon...</p>
                  </div>
                ) },
              ]} />
            </div>
          </div>
        </div>
      </div>
      {showAuth && <AuthModal onClose={() => setShowAuth(false)} />}
    </Container>
  )
}

export default ProductPage
