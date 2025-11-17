import { Link, useLocation } from 'react-router-dom'
import Container from '../components/layout/Container'

// Import images
import soilConditionerImg from '../assets/images/soil-conditioner.png'
import hogSwillImg from '../assets/images/hog-swill.png'

function ReceiptPage() {
  const location = useLocation()
  const order = location.state?.order

  function formatCurrency(n) {
    return `₱${n.toLocaleString()}`
  }

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
    ctx.fillText(`Order ID: ${order._id || order.id}`, padding, y)
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
      const qty = it.qty || it.quantity
      ctx.fillText(`${qty} × ${it.name}${it.size ? ` (${it.size})` : ''}`, padding, y)
      ctx.fillText(formatCurrency(it.price * qty), width - padding - 200, y)
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
    ctx.fillText(formatCurrency(order.subtotal || order.total), width - padding - 200, y)
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
    link.download = `${order._id || order.id}.jpg`
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
              <div className="text-gray-900 font-medium">{order._id || order.id}</div>
              <div className="text-gray-500">{new Date(order.createdAt).toLocaleString()}</div>
            </div>
          </div>

          <div className="p-6 grid md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-4">
              {order.items.map((it, index) => {
                const qty = it.qty || it.quantity
                return (
                  <div key={it._id || it.id || index} className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-lg bg-gray-50 border border-gray-100 overflow-hidden flex-shrink-0">
                      <img 
                        src={getImageSrc(it)} 
                        alt={it.name} 
                        className="w-full h-full object-contain" 
                        onError={(e) => {
                          e.target.style.display = 'none'
                          e.target.nextSibling.style.display = 'flex'
                        }}
                      />
                      <div className="w-full h-full bg-gray-100 flex items-center justify-center text-xs text-gray-500 font-medium" style={{display: 'none'}}>
                        {it.name.split(' ').slice(0, 2).join(' ').substring(0, 8)}
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-medium text-gray-900">{it.name}</div>
                      <div className="text-xs text-gray-500">Qty {qty}{it.size ? ` • ${it.size}` : ''}</div>
                    </div>
                    <div className="text-sm font-semibold text-emerald-600">{formatCurrency(it.price * qty)}</div>
                  </div>
                )
              })}
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
                <span className="font-medium text-gray-900">{formatCurrency(order.subtotal || order.total)}</span>
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

export default ReceiptPage
