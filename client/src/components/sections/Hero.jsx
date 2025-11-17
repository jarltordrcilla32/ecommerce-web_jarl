import { Link } from 'react-router-dom'

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

export default Hero
