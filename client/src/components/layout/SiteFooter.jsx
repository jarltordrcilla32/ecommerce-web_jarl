import { Link } from 'react-router-dom'

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

export default SiteFooter
