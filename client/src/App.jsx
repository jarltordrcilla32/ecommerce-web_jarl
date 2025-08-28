import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import { useState } from 'react'

function Container({ children }) {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <SiteHeader />
      <main className="flex-1">{children}</main>
      <SiteFooter />
    </div>
  )
}

function SiteHeader() {
  const [open, setOpen] = useState(false)
  const [showAuth, setShowAuth] = useState(false)
  const [showSearch, setShowSearch] = useState(false)
  
  // Check if we're on a product page
  const isProductPage = window.location.pathname.includes('/products/')
  
  return (
    <header className="sticky top-0 z-20 bg-white/90 backdrop-blur border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between py-4">
          <Link to="/" className="flex items-center gap-2" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <div className="h-9 w-9 rounded-full bg-emerald-600 grid place-content-center text-white font-bold">GC</div>
            <span className="font-semibold text-lg">GreenConnect</span>
          </Link>
          
          {!isProductPage ? (
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
                            src="/src/assets/images/soil conditioner.png" 
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
                            src="/src/assets/images/hog swill.png" 
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
                         <button onClick={() => setShowAuth(true)} className="hidden md:inline-block px-4 py-2 text-sm rounded-lg text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors">
               {isProductPage ? (
                 <div className="flex items-center gap-2">
                   <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                   </svg>
                   <span>Account</span>
                 </div>
               ) : (
                 <div className="flex items-center gap-2">
                   <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                   </svg>
                   <span>Sign in</span>
                 </div>
               )}
             </button>
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
              <span className="absolute -top-1 -right-1 text-[10px] bg-white text-emerald-700 border border-emerald-600 rounded-full px-1">0</span>
            </Link>
          </div>
        </div>
      </div>
      {showAuth && <AuthModal onClose={() => setShowAuth(false)} />}
    </header>
  )
}

function SiteFooter() {
  return (
    <footer className="border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 py-12 grid md:grid-cols-4 gap-8 text-sm">
        <div>
          <div className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-full bg-emerald-600 grid place-content-center text-white font-bold">GC</div>
            <div className="font-semibold">GreenConnect</div>
          </div>
          <p className="mt-3 text-gray-600">Turning food waste into quality products for the community.</p>
        </div>
        <div>
          <div className="font-medium mb-3">Shop</div>
          <ul className="space-y-2 text-gray-600">
            <li><Link to="/products/soil" className="hover:text-emerald-700">Soil Conditioner</Link></li>
            <li><Link to="/products/hogs" className="hover:text-emerald-700">Hogs</Link></li>
          </ul>
        </div>
        <div>
          <div className="font-medium mb-3">Company</div>
          <ul className="space-y-2 text-gray-600">
            <li><a href="#impact" className="hover:text-emerald-700">Impact</a></li>
            <li><a href="#features" className="hover:text-emerald-700">Features</a></li>
          </ul>
        </div>
        <div>
          <div className="font-medium mb-3">Newsletter</div>
          <p className="text-gray-600">Get monthly updates on our circular efforts.</p>
          <form className="mt-3 flex gap-2">
            <input type="email" placeholder="you@example.com" className="flex-1 rounded-lg border border-gray-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500" />
            <button className="px-4 py-2 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700">Subscribe</button>
          </form>
        </div>
      </div>
      <div className="py-6 text-center text-xs text-gray-500">© {new Date().getFullYear()} GreenConnect — All rights reserved.</div>
    </footer>
  )
}

function Hero() {
  return (
    <section className="bg-gradient-to-b from-emerald-50 to-white">
      <div className="max-w-7xl mx-auto px-4 py-16 grid md:grid-cols-2 gap-10 items-center">
        <div>
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs">Sustainable • Community Made</span>
          <h1 className="font-[Poppins] text-4xl md:text-5xl font-bold leading-tight mt-4 text-emerald-900">Circular shopping for a greener barangay</h1>
          <p className="mt-4 text-gray-600">We upcycle household food waste into nutrient-rich soil conditioner and responsibly raised hogs. Support local, reduce landfill, and grow greener.</p>
          <div className="mt-6 flex gap-3">
            <Link to="/products/soil" className="px-5 py-3 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700">Shop Soil Conditioner</Link>
            <Link to="/products/hogs" className="px-5 py-3 rounded-lg bg-white border border-emerald-200 text-emerald-800 hover:bg-emerald-50">View Hogs</Link>
          </div>
          <div className="mt-6 flex items-center gap-6 text-sm text-gray-600">
            <div className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-emerald-600"/>Plastic-free</div>
            <div className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-emerald-600"/>Local pickup</div>
            <div className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-emerald-600"/>Secure payments</div>
          </div>
        </div>
        <div className="rounded-2xl overflow-hidden shadow-lg border border-emerald-100">
          <img src="https://images.unsplash.com/photo-1501004318641-b39e6451bec6?q=80&w=1200&auto=format&fit=crop" alt="garden" className="w-full h-full object-cover" />
        </div>
      </div>
      <div id="download" className="max-w-7xl mx-auto px-4">
        <div className="rounded-xl border border-gray-100 bg-white p-4 md:p-6 flex flex-col md:flex-row items-center justify-between shadow-sm">
          <div className="flex items-start gap-4">
            <div className="h-12 w-12 rounded-lg bg-emerald-100 grid place-content-center text-emerald-700">📱</div>
            <div>
              <div className="font-semibold">Get the GreenConnect Mobile</div>
              <div className="text-sm text-gray-600">Optimized for quick orders and pickup updates.</div>
            </div>
          </div>
          <div className="mt-4 md:mt-0 flex gap-2">
            <a className="px-4 py-2 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700" href="https://example.com/greenconnect.apk" download>Download APK</a>
            <a className="px-4 py-2 rounded-lg border border-emerald-200 text-emerald-800 hover:bg-emerald-50" href="https://example.com/ios-soon">iOS soon</a>
          </div>
        </div>
      </div>
    </section>
  )
}

function ProductCardCompact({ slug, title, price, image, badge }) {
  return (
    <Link to={`/products/${slug}`} className="group block bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-xl hover:border-emerald-200 transition-all duration-300 transform hover:-translate-y-1">
      <div className="relative aspect-[4/3] overflow-hidden">
        {image ? (
          <img src={image} alt={title} className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300" />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-emerald-100 to-emerald-200 flex items-center justify-center">
            <svg className="h-12 w-12 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
      </div>
        )}
        {badge && (
          <div className="absolute top-3 left-3 px-2 py-1 bg-emerald-600 text-white text-xs font-semibold rounded-full">
            {badge}
          </div>
        )}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300"></div>
      </div>
      <div className="p-6">
        <h3 className="font-semibold text-gray-900 group-hover:text-emerald-600 transition-colors">{title}</h3>
        <div className="mt-2 flex items-center justify-between">
          <p className="text-2xl font-bold text-emerald-600">₱{price.toLocaleString()}</p>
          <div className="flex items-center gap-1 text-yellow-400">
            {[...Array(5)].map((_, i) => (
              <svg key={i} className="h-4 w-4 fill-current" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
            <span className="text-sm text-gray-500 ml-1">(24)</span>
          </div>
        </div>
        <div className="mt-3 flex items-center gap-2 text-sm text-gray-500">
          <svg className="h-4 w-4 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          Local pickup available
        </div>
      </div>
    </Link>
  )
}

function Impact() {
  const stats = [
    { k: '500kg+', v: 'food waste diverted' },
    { k: '2', v: 'local green products' },
    { k: '4.9★', v: 'community rating' },
  ]
  return (
    <section id="impact" className="max-w-7xl mx-auto px-4 py-16">
      <h2 className="text-2xl font-semibold">Our mission & impact</h2>
      <p className="mt-2 text-gray-600">A simple loop: households → food waste → products → healthier soils and livelihoods.</p>
      <div className="mt-8 grid sm:grid-cols-3 gap-4">
        {stats.map(s => (
          <div key={s.k} className="rounded-xl bg-emerald-50 p-6 border border-emerald-100 text-center">
            <div className="text-2xl font-bold text-emerald-700">{s.k}</div>
            <div className="text-gray-600">{s.v}</div>
          </div>
        ))}
      </div>
    </section>
  )
}

function Testimonials() {
  const items = [
    { name: 'Ana', text: 'Our garden thrived with their soil conditioner!' },
    { name: 'Ramon', text: 'Proud to support a barangay-led circular project.' },
  ]
  return (
    <section className="bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-16">
        <h2 className="text-2xl font-semibold">What neighbors say</h2>
        <div className="mt-6 grid md:grid-cols-2 gap-4">
          {items.map(t => (
            <div key={t.name} className="rounded-xl bg-white shadow-sm p-6 border border-gray-100">
              <p className="text-gray-700">"{t.text}"</p>
              <div className="mt-3 text-sm text-gray-500">— {t.name}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function HomePage() {
  return (
    <Container>
      <Hero />
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-3 gap-8 mb-16">
              <FeatureCard 
                title="Free Pickup Service" 
                text="Convenient drop-off points every weekend with our community collection system." 
                icon="🚚" 
              />
              <FeatureCard 
                title="Quality Assured" 
                text="Community standards with transparent processing and regular quality testing." 
                icon="✅" 
              />
              <FeatureCard 
                title="Environmental Impact" 
                text="Every purchase directly contributes to waste reduction and community sustainability." 
                icon="🌱" 
              />
        </div>
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-8">Popular Products</h2>
              <div className="grid sm:grid-cols-2 gap-8">
                <ProductCardCompact 
                  slug="soil" 
                  title="Premium Soil Conditioner" 
                  price={199} 
                  badge="Best Seller"
                  image="/src/assets/images/soil conditioner.png" 
                />
                <ProductCardCompact 
                  slug="hogs" 
                  title="Sustainably Raised Hogs" 
                  price={5500} 
                  badge="Limited"
                  image="/src/assets/images/hog swill.png" 
                />
              </div>
          </div>
        </div>
      </section>
        <ProcessSection />
        <CommunityImpact />
        <FeaturesSection />
      <Impact />
        <FAQSection />
      <Testimonials />
    </Container>
  )
}

function ProductPage({ slug, title, price, description, sustainability }) {
  const [qty, setQty] = useState(1)
  const [showAuth, setShowAuth] = useState(false)
  const [selectedVariant, setSelectedVariant] = useState(0)
  
  // Product variants
  const soilVariants = [
    {
      name: "Soil Conditioner - Pouch",
      size: "1kg",
      price: 25,
      description: "Perfect for small gardens and potted plants",
      image: "/src/assets/images/soil conditioner.png"
    },
    {
      name: "Soil Conditioner - Pack", 
      size: "5kg",
      price: 100,
      description: "Ideal for medium-sized gardens and landscaping",
      image: "/src/assets/images/soil conditioner.png"
    },
    {
      name: "Soil Conditioner - Sack",
      size: "25kg",
      price: 500,
      description: "Best value for commercial farming and large projects",
      image: "/src/assets/images/soil conditioner.png"
    }
  ]

  const hogVariants = [
    {
      name: "Hogs Swill",
      size: "25-30kg",
      price: 400,
      description: "Premium feed for sustainably raised hogs",
      image: "/src/assets/images/hog swill.png"
    }
  ]

  const variants = slug === 'soil' ? soilVariants : hogVariants
  const currentVariant = variants[selectedVariant]

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

              {/* Size Info */}
              <div className="p-4 rounded-xl bg-gray-50 border border-gray-200 mb-6">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">Size:</span>
                  <span className="text-lg font-semibold text-gray-900">{currentVariant.size}</span>
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
                  onClick={() => setShowAuth(true)} 
                  className="flex-1 px-8 py-4 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-700 text-white font-semibold text-lg hover:from-emerald-700 hover:to-emerald-800 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  Add to Cart - ₱{(currentVariant.price * qty).toLocaleString()}
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

function ProcessSection() {
  const steps = [
    {
      step: "01",
      title: "Food Waste Collection",
      subtitle: "Community-Driven Collection",
      description: "Every weekend, households in our barangay separate their food waste and bring it to designated collection points. Our community volunteers help sort and organize the materials for processing.",
      icon: "🗑️",
      image: "/src/assets/images/collecting food waste.png",
      stats: ["150+ households", "500kg+ monthly", "4 collection points"],
      color: "emerald",
      features: ["Weekend collection schedule", "Community volunteers", "Proper waste sorting", "Designated drop-off points"]
    },
    {
      step: "02", 
      title: "Processing & Composting",
      subtitle: "Natural Decomposition Process",
      description: "Collected waste is processed through our community composting facility with proper aeration, temperature monitoring, and organic additives to accelerate decomposition.",
      icon: "🌱",
      image: "/src/assets/images/composting.png",
      stats: ["60-day process", "Natural enzymes", "Quality control"],
      color: "green",
      features: ["Aerobic composting", "Temperature monitoring", "Natural additives", "Regular turning"]
    },
    {
      step: "03",
      title: "Quality Control",
      subtitle: "Safety & Nutrient Analysis",
      description: "Compost is tested for nutrient content, pH levels, and safety standards. We ensure it meets organic certification requirements before packaging.",
      icon: "✅",
      image: "/src/assets/images/safety.png",
      stats: ["Lab tested", "Organic certified", "pH balanced"],
      color: "blue",
      features: ["Nutrient analysis", "pH testing", "Safety standards", "Organic certification"]
    },
    {
      step: "04",
      title: "Product Distribution",
      subtitle: "Ready for Your Garden",
      description: "Ready soil conditioner is packaged in eco-friendly containers and distributed through our platform. Customers can pick up locally or arrange delivery.",
      icon: "📦",
      image: "/src/assets/images/soil distri.png",
      stats: ["Eco packaging", "Local pickup", "Community delivery"],
      color: "purple",
      features: ["Eco-friendly packaging", "Local pickup points", "Community delivery", "Quality guarantee"]
    }
  ]

  return (
    <section className="py-24 bg-gradient-to-br from-gray-50 via-white to-emerald-50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-100 text-emerald-800 text-sm font-medium mb-6">
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            Circular Economy Process
          </div>
          <h2 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-6">
            From Waste to
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-emerald-800"> Wealth</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Discover how we transform household food waste into premium soil conditioner through our innovative community-driven process.
          </p>
        </div>

        {/* Process Steps */}
        <div className="space-y-32">
          {steps.map((step, index) => (
            <div key={step.step} className={`relative ${index % 2 === 0 ? '' : 'lg:flex-row-reverse'}`}>
              <div className="grid lg:grid-cols-2 gap-16 items-center">
                {/* Content */}
                <div className={`space-y-8 ${index % 2 === 0 ? 'lg:pr-16' : 'lg:pl-16'}`}>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-600 text-white text-2xl font-bold shadow-lg">
                      {step.step}
                    </div>
                    <div>
                      <h3 className="text-3xl font-bold text-gray-900">{step.title}</h3>
                      <p className="text-lg text-emerald-600 font-medium">{step.subtitle}</p>
                    </div>
                  </div>
                  
                  <p className="text-lg text-gray-600 leading-relaxed">
                    {step.description}
                  </p>
                  
                  <div className="grid grid-cols-3 gap-4">
                    {step.stats.map((stat, statIndex) => (
                      <div key={statIndex} className="text-center p-4 rounded-xl bg-white border border-gray-200 shadow-sm">
                        <div className="text-sm text-gray-600">{stat}</div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="text-4xl">{step.icon}</div>
                    <div className="h-px flex-1 bg-gradient-to-r from-emerald-200 to-transparent"></div>
                  </div>
                </div>

                {/* Enhanced Image Section */}
                <div className="relative group">
                  {/* Main Image Container */}
                  <div className="relative rounded-3xl overflow-hidden shadow-2xl transform transition-all duration-500 group-hover:scale-105 group-hover:shadow-3xl">
                    <img 
                      src={step.image} 
                      alt={step.title}
                      className="w-full h-[400px] object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    {/* Enhanced Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-black/10 to-transparent"></div>
                    
                    
                    
                    {/* Step Number Badge */}
                    <div className="absolute bottom-4 right-4">
                      <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 text-white rounded-2xl px-4 py-2 shadow-lg">
                        <div className="text-sm font-bold">{step.step}</div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Enhanced Floating Badge */}
                  <div className="absolute -top-6 -right-6 bg-white/95 backdrop-blur-md rounded-2xl shadow-xl p-6 border border-white/30 transform transition-all duration-300 hover:scale-105 hover:shadow-2xl w-48 h-48">
                    <div className="relative h-full">
                      {/* Subtle Background */}
                      <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/60 to-white rounded-2xl"></div>
                      <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-emerald-100/40 to-transparent rounded-full"></div>
                      
                      {/* Content */}
                      <div className="relative h-full flex flex-col">
                        {/* Icon */}
                        <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl shadow-lg mb-3 transform transition-transform duration-300 group-hover:scale-110">
                          <div className="text-xl">{step.icon}</div>
                        </div>
                        
                        {/* Process Info */}
                        <div className="space-y-2 flex-1">
                          <div className="text-sm font-bold text-gray-900 leading-tight">Process {step.step}</div>
                          <div className="text-xs text-emerald-600 font-medium min-h-[2.5rem] flex items-center">
                            {step.step === "01" && "Weekly Community Gathering"}
                            {step.step === "02" && "Organic Transformation"}
                            {step.step === "03" && "Premium Standards Check"}
                            {step.step === "04" && "Sustainable Delivery"}
                          </div>
                          
                          {/* Key Metric */}
                          <div className="mt-auto pt-3 border-t border-gray-100/50">
                            <div className="flex items-center gap-2">
                              <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                              <span className="text-xs font-semibold text-gray-700">{step.stats[0]}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Decorative Elements */}
                  <div className="absolute -bottom-4 -left-4 w-24 h-24 bg-gradient-to-br from-emerald-200 to-green-200 rounded-full opacity-20 blur-xl"></div>
                  <div className="absolute -top-4 -left-4 w-16 h-16 bg-gradient-to-br from-blue-200 to-purple-200 rounded-full opacity-20 blur-lg"></div>
                </div>
              </div>
              
              {/* Connector line */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute left-1/2 top-full w-px h-16 bg-gradient-to-b from-emerald-200 to-transparent transform -translate-x-1/2"></div>
              )}
            </div>
          ))}
        </div>

        {/* Impact Stats */}
        <div className="mt-32 bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden">
          <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 text-white p-12 text-center">
            <h3 className="text-3xl font-bold mb-4">Our Impact Numbers</h3>
            <p className="text-emerald-100 text-lg">Real results from our community-driven circular economy</p>
          </div>
          
          <div className="grid md:grid-cols-4 gap-8 p-12">
            <div className="text-center">
              <div className="text-4xl font-bold text-emerald-600 mb-2">500kg+</div>
              <div className="text-gray-600">Food waste diverted monthly</div>
              <div className="text-sm text-emerald-500 mt-1">From landfill</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-emerald-600 mb-2">150+</div>
              <div className="text-gray-600">Households participating</div>
              <div className="text-sm text-emerald-500 mt-1">Active members</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-emerald-600 mb-2">₱25K+</div>
              <div className="text-gray-600">Community revenue generated</div>
              <div className="text-sm text-emerald-500 mt-1">Monthly income</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-emerald-600 mb-2">4.9★</div>
              <div className="text-gray-600">Customer satisfaction</div>
              <div className="text-sm text-emerald-500 mt-1">Community rating</div>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="mt-16 text-center">
          <div className="bg-gradient-to-r from-emerald-50 to-green-50 rounded-3xl p-12 border border-emerald-100">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">Join Our Circular Economy</h3>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Be part of the solution. Start contributing your food waste and help us create a sustainable future for our barangay.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                to="/products/soil" 
                className="inline-flex items-center justify-center px-8 py-4 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-700 text-white font-semibold text-lg hover:from-emerald-700 hover:to-emerald-800 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                Shop Soil Conditioner
                <svg className="ml-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
              <Link 
                to="/impact" 
                className="inline-flex items-center justify-center px-8 py-4 rounded-xl border-2 border-emerald-200 text-emerald-700 font-semibold text-lg hover:bg-emerald-50 hover:border-emerald-300 transition-all duration-300"
              >
                See Our Impact
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function CommunityImpact() {
  const impacts = [
    {
      title: "Environmental Impact",
      description: "Reducing landfill waste and greenhouse gas emissions through proper food waste management.",
      icon: "🌍",
      stats: ["500kg waste diverted", "60% reduction in methane", "Cleaner barangay"]
    },
    {
      title: "Economic Benefits", 
      description: "Creating local jobs and generating income for community members through waste processing.",
      icon: "💰",
      stats: ["₱25K+ monthly revenue", "15 local jobs created", "Affordable products"]
    },
    {
      title: "Social Impact",
      description: "Building community cohesion and environmental awareness through collaborative efforts.",
      icon: "🤝",
      stats: ["150+ households", "Community workshops", "Youth engagement"]
    }
  ]

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Community Impact & Recognition
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            See how our circular economy model is transforming our barangay and creating lasting positive change.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 mb-16">
          {impacts.map((impact, index) => (
            <div key={index} className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
              <div className="text-4xl mb-4">{impact.icon}</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">{impact.title}</h3>
              <p className="text-gray-600 mb-6">{impact.description}</p>
              <ul className="space-y-2">
                {impact.stats.map((stat, statIndex) => (
                  <li key={statIndex} className="flex items-center gap-2 text-sm text-gray-700">
                    <div className="h-2 w-2 rounded-full bg-emerald-500"></div>
                    {stat}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Recognition Grid */}
        <div className="bg-white rounded-3xl p-8 lg:p-12 shadow-lg border border-gray-100">
          <h3 className="text-2xl font-bold text-gray-900 text-center mb-8">Community Recognition</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center p-6 rounded-xl bg-emerald-50 border border-emerald-100">
              <div className="text-3xl mb-2">🏆</div>
              <div className="font-semibold text-gray-900">Best Community Project</div>
              <div className="text-sm text-gray-600">Barangay Awards 2024</div>
            </div>
            <div className="text-center p-6 rounded-xl bg-blue-50 border border-blue-100">
              <div className="text-3xl mb-2">🌱</div>
              <div className="font-semibold text-gray-900">Environmental Excellence</div>
              <div className="text-sm text-gray-600">Green Philippines</div>
            </div>
            <div className="text-center p-6 rounded-xl bg-purple-50 border border-purple-100">
              <div className="text-3xl mb-2">💡</div>
              <div className="font-semibold text-gray-900">Innovation Award</div>
              <div className="text-sm text-gray-600">Social Enterprise</div>
            </div>
            <div className="text-center p-6 rounded-xl bg-orange-50 border border-orange-100">
              <div className="text-3xl mb-2">⭐</div>
              <div className="font-semibold text-gray-900">Community Choice</div>
              <div className="text-sm text-gray-600">4.9★ Rating</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function FeaturesSection() {
  const [activeFeature, setActiveFeature] = useState(0)
  
  const features = [
    {
      title: "Circular Economy",
      subtitle: "Waste to Wealth",
      description: "Transform food waste into valuable products through our innovative community-driven process.",
      image: "/src/assets/images/collecting food waste.png",
      stats: ["500kg+ waste diverted", "150+ households", "Zero landfill"],
      color: "emerald"
    },
    {
      title: "Local Community",
      subtitle: "Barangay First",
      description: "Supporting local farmers and creating jobs while building a sustainable future for our barangay.",
      image: "/src/assets/images/main building.png",
      stats: ["15+ local jobs", "₱25K+ revenue", "Community owned"],
      color: "blue"
    },
    {
      title: "Convenient Pickup",
      subtitle: "Weekend Collection",
      description: "Multiple collection points every weekend with our community volunteer system.",
      image: "/src/assets/images/soil distri.png",
      stats: ["4 collection points", "Weekend schedule", "Free pickup"],
      color: "orange"
    }
  ]

  return (
    <section id="features" className="py-32 bg-gradient-to-br from-slate-50 via-white to-emerald-50 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23f0fdf4%22%20fill-opacity%3D%220.3%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%222%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-30"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Header */}
        <div className="text-center mb-24">
          <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-emerald-100 to-green-100 text-emerald-800 text-sm font-medium mb-8 shadow-sm">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
            Why Choose GreenConnect
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
          </div>
          <h2 className="text-5xl lg:text-6xl font-bold text-gray-900 mb-8 leading-tight">
            Building a
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-green-600 to-emerald-800"> Sustainable Future</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Join our community-driven initiative that transforms waste into wealth while creating lasting positive impact.
          </p>
        </div>

        {/* Main Features Grid */}
        <div className="grid lg:grid-cols-3 gap-8 mb-20">
          {features.map((feature, index) => (
            <div key={index} className="group relative">
              {/* Feature Card */}
              <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100 hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 relative overflow-hidden">
                {/* Background Gradient */}
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.color === 'emerald' ? 'from-emerald-50 to-green-100' : feature.color === 'blue' ? 'from-blue-50 to-indigo-100' : 'from-orange-50 to-red-100'} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
                
                {/* Content */}
                <div className="relative z-10">
                  {/* Icon with Gradient Background */}
                  <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-r ${feature.color === 'emerald' ? 'from-emerald-500 to-green-600' : feature.color === 'blue' ? 'from-blue-500 to-indigo-600' : 'from-orange-500 to-red-600'} text-white text-2xl mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    {index === 0 ? "🌱" : index === 1 ? "🏠" : "🚚"}
                  </div>
                  
                  <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-gray-800 transition-colors">{feature.title}</h3>
                  <p className="text-gray-600 leading-relaxed mb-6 group-hover:text-gray-700 transition-colors">{feature.description}</p>
                  
                  {/* Stats with Enhanced Design */}
                  <div className="space-y-3">
                    {feature.stats.map((stat, statIndex) => (
                      <div key={statIndex} className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 group-hover:bg-white/80 transition-colors duration-300">
                        <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${feature.color === 'emerald' ? 'from-emerald-500 to-green-600' : feature.color === 'blue' ? 'from-blue-500 to-indigo-600' : 'from-orange-500 to-red-600'}`}></div>
                        <span className="text-sm font-medium text-gray-700">{stat}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Floating Image */}
                <div className="absolute -bottom-4 -right-4 w-24 h-24 rounded-2xl overflow-hidden opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-4 group-hover:translate-y-0">
                  <img src={feature.image} alt={feature.title} className="w-full h-full object-cover" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Premium Feature Showcase - Inspired by Modern E-commerce */}
        <div className="relative mb-20">
          {/* Background Pattern */}
          <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-white to-gray-50 rounded-3xl"></div>
          
          <div className="relative z-10 p-12 rounded-3xl border border-gray-200/50 backdrop-blur-sm">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Why Choose GreenConnect?</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">Experience the future of sustainable commerce with our innovative platform</p>
            </div>
            
            <div className="grid lg:grid-cols-3 gap-12">
              {/* Quality Assurance - Apple-inspired Design */}
              <div className="group relative">
                <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-white to-gray-50 border border-gray-200 shadow-sm hover:shadow-2xl transition-all duration-700 transform hover:-translate-y-3">
                  {/* Animated Background */}
                  <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-transparent to-emerald-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                  
                  {/* Header Section */}
                  <div className="relative p-8 pb-6">
                    <div className="flex items-center justify-between mb-6">
                      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center text-2xl text-white shadow-lg group-hover:scale-110 transition-transform duration-500">✅</div>
                      <div className="text-right">
                        <div className="text-3xl font-bold text-emerald-600">4.9</div>
                        <div className="text-sm text-gray-500">★ Rating</div>
                      </div>
                    </div>
                    
                    <h3 className="text-2xl font-bold text-gray-900 mb-3">Quality Assured</h3>
                    <p className="text-gray-600 leading-relaxed">Premium organic products with community-verified standards and rigorous testing protocols.</p>
                  </div>
                  
                  {/* Stats Section */}
                  <div className="px-8 pb-8">
                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <div className="text-center p-4 rounded-xl bg-white border border-gray-100 shadow-sm group-hover:shadow-md transition-shadow duration-300">
                        <div className="text-2xl font-bold text-emerald-600 mb-1">100%</div>
                        <div className="text-sm text-gray-600">Lab Tested</div>
                      </div>
                      <div className="text-center p-4 rounded-xl bg-white border border-gray-100 shadow-sm group-hover:shadow-md transition-shadow duration-300">
                        <div className="text-2xl font-bold text-emerald-600 mb-1">ISO</div>
                        <div className="text-sm text-gray-600">Certified</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-center">
                      <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-semibold shadow-lg group-hover:shadow-xl transition-shadow duration-300">
                        <span>🏆</span>
                        <span>Certified Organic</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Floating Badge */}
                  <div className="absolute -top-2 -right-2 w-12 h-12 rounded-full bg-white shadow-lg flex items-center justify-center text-emerald-600 font-bold text-sm border-2 border-emerald-100 opacity-0 group-hover:opacity-100 transition-all duration-500 transform scale-0 group-hover:scale-100">
                    A+
                  </div>
                </div>
              </div>

              {/* Environmental Impact - Tesla-inspired Design */}
              <div className="group relative">
                <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-white to-gray-50 border border-gray-200 shadow-sm hover:shadow-2xl transition-all duration-700 transform hover:-translate-y-3">
                  {/* Animated Background */}
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-indigo-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                  
                  {/* Header Section */}
                  <div className="relative p-8 pb-6">
                    <div className="flex items-center justify-between mb-6">
                      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-2xl text-white shadow-lg group-hover:scale-110 transition-transform duration-500">💚</div>
                      <div className="text-right">
                        <div className="text-3xl font-bold text-blue-600">60%</div>
                        <div className="text-sm text-gray-500">Reduction</div>
                      </div>
                    </div>
                    
                    <h3 className="text-2xl font-bold text-gray-900 mb-3">Environmental Impact</h3>
                    <p className="text-gray-600 leading-relaxed">Every purchase contributes to our mission of creating a sustainable, zero-waste future for our community.</p>
                  </div>
                  
                  {/* Impact Metrics */}
                  <div className="px-8 pb-8">
                    <div className="space-y-4 mb-6">
                      <div className="flex items-center justify-between p-4 rounded-xl bg-white border border-gray-100 shadow-sm group-hover:shadow-md transition-shadow duration-300">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white text-sm">🌱</div>
                          <div>
                            <div className="font-semibold text-gray-900">Methane Reduction</div>
                            <div className="text-sm text-gray-500">Greenhouse gas impact</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-xl font-bold text-blue-600">60%</div>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between p-4 rounded-xl bg-white border border-gray-100 shadow-sm group-hover:shadow-md transition-shadow duration-300">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center text-white text-sm">🌍</div>
                          <div>
                            <div className="font-semibold text-gray-900">Carbon Neutral</div>
                            <div className="text-sm text-gray-500">Net zero emissions</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-xl font-bold text-green-600">✓</div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-center">
                      <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold shadow-lg group-hover:shadow-xl transition-shadow duration-300">
                        <span>🌿</span>
                        <span>Zero Waste Certified</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Floating Badge */}
                  <div className="absolute -top-2 -right-2 w-12 h-12 rounded-full bg-white shadow-lg flex items-center justify-center text-blue-600 font-bold text-sm border-2 border-blue-100 opacity-0 group-hover:opacity-100 transition-all duration-500 transform scale-0 group-hover:scale-100">
                    ♻️
                  </div>
                </div>
              </div>

              {/* Digital Platform - Shopify-inspired Design */}
              <div className="group relative">
                <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-white to-gray-50 border border-gray-200 shadow-sm hover:shadow-2xl transition-all duration-700 transform hover:-translate-y-3">
                  {/* Animated Background */}
                  <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 via-transparent to-red-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                  
                  {/* Header Section */}
                  <div className="relative p-8 pb-6">
                    <div className="flex items-center justify-between mb-6">
                      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center text-2xl text-white shadow-lg group-hover:scale-110 transition-transform duration-500">📱</div>
                      <div className="text-right">
                        <div className="text-3xl font-bold text-orange-600">24/7</div>
                        <div className="text-sm text-gray-500">Support</div>
                      </div>
                    </div>
                    
                    <h3 className="text-2xl font-bold text-gray-900 mb-3">Digital Platform</h3>
                    <p className="text-gray-600 leading-relaxed">Seamless e-commerce experience with cutting-edge technology and round-the-clock customer support.</p>
                  </div>
                  
                  {/* Features Grid */}
                  <div className="px-8 pb-8">
                    <div className="grid grid-cols-1 gap-3 mb-6">
                      <div className="flex items-center gap-4 p-4 rounded-xl bg-white border border-gray-100 shadow-sm group-hover:shadow-md transition-shadow duration-300">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center text-white text-lg">📱</div>
                        <div className="flex-1">
                          <div className="font-semibold text-gray-900">Mobile App</div>
                          <div className="text-sm text-gray-500">iOS & Android platforms</div>
                        </div>
                        <div className="text-orange-600">
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-4 p-4 rounded-xl bg-white border border-gray-100 shadow-sm group-hover:shadow-md transition-shadow duration-300">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center text-white text-lg">⚡</div>
                        <div className="flex-1">
                          <div className="font-semibold text-gray-900">Real-time Updates</div>
                          <div className="text-sm text-gray-500">Live tracking & notifications</div>
                        </div>
                        <div className="text-orange-600">
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-4 p-4 rounded-xl bg-white border border-gray-100 shadow-sm group-hover:shadow-md transition-shadow duration-300">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center text-white text-lg">🔒</div>
                        <div className="flex-1">
                          <div className="font-semibold text-gray-900">Secure Payments</div>
                          <div className="text-sm text-gray-500">SSL encrypted transactions</div>
                        </div>
                        <div className="text-orange-600">
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-center">
                      <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-orange-500 to-red-600 text-white font-semibold shadow-lg group-hover:shadow-xl transition-shadow duration-300">
                        <span>🚀</span>
                        <span>24/7 Support</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Floating Badge */}
                  <div className="absolute -top-2 -right-2 w-12 h-12 rounded-full bg-white shadow-lg flex items-center justify-center text-orange-600 font-bold text-sm border-2 border-orange-100 opacity-0 group-hover:opacity-100 transition-all duration-500 transform scale-0 group-hover:scale-100">
                    ⚡
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Call to Action */}
        <div className="text-center">
          <div className="relative bg-gradient-to-r from-emerald-600 via-green-600 to-emerald-700 rounded-3xl p-12 text-white shadow-2xl overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2240%22%20height%3D%2240%22%20viewBox%3D%220%200%2040%2040%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.1%22%3E%3Cpath%20d%3D%22M20%2020c0%2011.046-8.954%2020-20%2020v-40c11.046%200%2020%208.954%2020%2020z%22/%3E%3C/g%3E%3C/svg%3E')]"></div>
            
            <div className="relative z-10">
              <h3 className="text-4xl font-bold mb-6">Ready to Make a Difference?</h3>
              <p className="text-emerald-100 text-xl mb-10 max-w-2xl mx-auto leading-relaxed">
                Start contributing to our circular economy today. Every small action creates a big impact.
              </p>
              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <Link 
                  to="/products/soil" 
                  className="group inline-flex items-center justify-center px-10 py-5 rounded-2xl bg-white text-emerald-700 font-bold text-lg hover:bg-gray-50 transform hover:scale-105 transition-all duration-300 shadow-xl hover:shadow-2xl"
                >
                  Shop Products
                  <svg className="ml-3 h-6 w-6 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
                <Link 
                  to="/process" 
                  className="group inline-flex items-center justify-center px-10 py-5 rounded-2xl border-2 border-white/30 text-white font-bold text-lg hover:bg-white/10 hover:border-white/50 transition-all duration-300"
                >
                  Learn More
                  <svg className="ml-3 h-6 w-6 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function FAQSection() {
  const faqs = [
    {
      question: "How does the food waste collection work?",
      answer: "Every weekend, households in our barangay separate their food waste and bring it to designated collection points. Our community volunteers help sort and organize the materials for processing. We have 4 collection points available for your convenience."
    },
    {
      question: "What sizes of soil conditioner are available?",
      answer: "We offer soil conditioner in three convenient sizes: 1kg pouch (₱25) for small gardens, 5kg pack (₱100) for medium gardens, and 25kg sack (₱500) for large projects. All sizes are made from the same high-quality compost."
    },
    {
      question: "How long does the composting process take?",
      answer: "Our composting process takes approximately 60 days from collection to finished product. We use natural enzymes and proper aeration to ensure quality while maintaining our community standards."
    },
    {
      question: "Is the soil conditioner organic and safe?",
      answer: "Yes! Our soil conditioner is lab-tested, organic certified, and pH balanced. We ensure it meets all safety standards before packaging. It's perfect for gardens, farms, and landscaping projects."
    },
    {
      question: "How can I pick up my order?",
      answer: "We offer local pickup at our community facility. Once your order is ready, you'll receive a notification with pickup details. We also offer community delivery for larger orders. All packaging is eco-friendly and plastic-free."
    },
    {
      question: "How does this benefit our community?",
      answer: "Our circular economy creates local jobs, generates community revenue (₱25K+ monthly), and reduces landfill waste by 500kg+ monthly. We've engaged 150+ households and created 15+ local jobs while building environmental awareness."
    }
  ]

  const [openIndex, setOpenIndex] = useState(null)

  return (
    <section id="faq" className="py-24 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-100 text-emerald-800 text-sm font-medium mb-6">
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Frequently Asked Questions
          </div>
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            Everything You Need to
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-emerald-800"> Know</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Get answers to common questions about our circular economy process and products.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div key={index} className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full px-8 py-6 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
              >
                <h3 className="text-lg font-semibold text-gray-900 pr-4">{faq.question}</h3>
                <svg 
                  className={`h-6 w-6 text-gray-500 transform transition-transform ${openIndex === index ? 'rotate-180' : ''}`} 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {openIndex === index && (
                <div className="px-8 pb-6">
                  <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Contact CTA */}
        <div className="mt-16 text-center">
          <div className="bg-gradient-to-r from-gray-50 to-emerald-50 rounded-3xl p-12 border border-gray-100">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Still Have Questions?</h3>
            <p className="text-gray-600 mb-8 max-w-xl mx-auto">
              Our community team is here to help. Reach out to us for personalized assistance.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="inline-flex items-center justify-center px-8 py-4 rounded-xl bg-emerald-600 text-white font-semibold text-lg hover:bg-emerald-700 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl">
                <svg className="mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                Contact Us
              </button>
              <button className="inline-flex items-center justify-center px-8 py-4 rounded-xl border-2 border-emerald-200 text-emerald-700 font-semibold text-lg hover:bg-emerald-50 transition-all duration-300">
                <svg className="mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                Live Chat
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function Router() {
  return (
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
        <Route path="/cart" element={
          <Container>
            <div className="max-w-4xl mx-auto px-4 py-24">
              <h1 className="text-4xl font-bold text-gray-900 mb-8">Shopping Cart</h1>
              <p className="text-xl text-gray-600">Your cart is empty. Start shopping to add items!</p>
            </div>
          </Container>
        } />
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

  function submit(e) {
    e.preventDefault()
    if (!email || !password || (mode === 'register' && !name)) {
      setError('Please fill out all required fields')
      return
    }
    setIsLoading(true)
    // Mock API call
    setTimeout(() => {
      setIsLoading(false)
      onClose()
      alert(`${mode === 'login' ? 'Logged in' : 'Registered'} as ${email}. You can now add to cart.`)
    }, 1000)
  }

  return (
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
    </div>
  )
}

