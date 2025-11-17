import { useState, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { useNotification } from '../../contexts/NotificationContext'

function NotificationDropdown() {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef(null)
  const { notifications, unreadCount, markAsRead, markAllAsRead, fetchNotifications } = useNotification()
  const [detailOpen, setDetailOpen] = useState(false)
  const [selectedNotification, setSelectedNotification] = useState(null)
  const [orderDetail, setOrderDetail] = useState(null)
  const [detailLoading, setDetailLoading] = useState(false)

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleNotificationClick = async (notification) => {
    try {
      if (!notification.isRead) {
        markAsRead(notification._id)
      }
      setSelectedNotification(notification)
      setDetailLoading(true)
      setDetailOpen(true)
      setOrderDetail(null)
      // Fetch order details to enrich the summary
      if (notification.orderId) {
        const token = localStorage.getItem('token')
        const res = await fetch(`http://localhost:5177/api/orders/${notification.orderId}`, {
          headers: { Authorization: `Bearer ${token}` }
        })
        if (res.ok) {
          const data = await res.json()
          setOrderDetail(data)
        }
      }
    } finally {
      setDetailLoading(false)
    }
  }

  const handleDropdownToggle = () => {
    if (!isOpen) {
      // Refresh notifications when opening dropdown
      fetchNotifications()
    }
    setIsOpen(!isOpen)
  }

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'item_cancelled':
        return (
          <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center">
            <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
        )
      case 'payment_refund':
        return (
          <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
            <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
            </svg>
          </div>
        )
      case 'payment_deduction':
        return (
          <div className="w-8 h-8 rounded-full bg-yellow-100 flex items-center justify-center">
            <svg className="w-4 h-4 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
            </svg>
          </div>
        )
      default:
        return (
          <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
            <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5-5-5h5v-5a7.5 7.5 0 0 0-15 0v5h5l-5 5-5-5h5" />
            </svg>
          </div>
        )
    }
  }

  const formatTime = (dateString) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInMinutes = Math.floor((now - date) / (1000 * 60))
    
    if (diffInMinutes < 1) return 'Just now'
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`
    return date.toLocaleDateString()
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={handleDropdownToggle}
        className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9z M13.73 21a2 2 0 0 1-3.46 0" />
        </svg>
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-gray-100 z-50">
          <div className="p-4 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Notifications</h3>
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="text-sm text-emerald-600 hover:text-emerald-700 font-medium"
                >
                  Mark all read
                </button>
              )}
            </div>
          </div>
          
          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-6 text-center text-gray-500">
                <svg className="w-12 h-12 mx-auto mb-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9z M13.73 21a2 2 0 0 1-3.46 0" />
                </svg>
                <p>No notifications yet</p>
              </div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification._id}
                  onClick={() => handleNotificationClick(notification)}
                  className={`p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors ${
                    !notification.isRead ? 'bg-blue-50' : ''
                  }`}
                >
                  <div className="flex items-start gap-3">
                    {getNotificationIcon(notification.type)}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <h4 className={`text-sm font-medium ${
                          !notification.isRead ? 'text-gray-900' : 'text-gray-700'
                        }`}>
                          {notification.title}
                        </h4>
                        <span className="text-xs text-gray-500 ml-2 flex-shrink-0">
                          {formatTime(notification.createdAt)}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                      {notification.metadata?.refundAmount && (
                        <div className="mt-2 text-xs text-emerald-600 font-medium">
                          Amount: ₱{notification.metadata.refundAmount.toLocaleString()}
                        </div>
                      )}
                    </div>
                    {!notification.isRead && (
                      <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-2"></div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
          
          {notifications.length > 0 && (
            <div className="p-3 border-t border-gray-100">
              <button
                onClick={() => setIsOpen(false)}
                className="w-full text-center text-sm text-gray-600 hover:text-gray-900 py-2"
              >
                Close
              </button>
            </div>
          )}
        </div>
      )}
      {(detailOpen && selectedNotification) ? createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={(e) => { if (e.target === e.currentTarget) { setDetailOpen(false); } }}>
          <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-gray-100">
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Notification Details</h3>
                <button onClick={() => setDetailOpen(false)} className="text-gray-400 hover:text-gray-600">
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/></svg>
                </button>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-start gap-3">
                {getNotificationIcon(selectedNotification.type)}
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-gray-900">{selectedNotification.title}</div>
                  <div className="text-sm text-gray-600 mt-1">{selectedNotification.message}</div>
                  {/* Summary */}
                  {(() => {
                    const n = selectedNotification
                    const md = n.metadata || {}
                    const it = n.itemDetails || {}
                    if (n.type === 'order_updated' || n.type === 'admin_alert') {
                      const oldQty = md.oldQuantity ?? undefined
                      const newQty = md.newQuantity ?? it.quantity
                      const deltaQty = (typeof newQty === 'number' && typeof oldQty === 'number') ? newQty - oldQty : undefined
                      const price = it.price || 0
                      const newSubtotal = price * (newQty || 0)
                      const priceDiff = typeof md.priceDifference === 'number' ? md.priceDifference : 0
                      const prevSubtotal = newSubtotal - priceDiff
                      const direction = priceDiff > 0 ? 'added' : priceDiff < 0 ? 'deducted' : 'no change'
                      return (
                        <div className="mt-3 text-xs text-gray-700 bg-gray-50 border border-gray-100 rounded-lg p-3">
                          <div className="font-medium text-gray-900 mb-1">Summary</div>
                          <div className="grid grid-cols-2 gap-y-1">
                            <div className="text-gray-500">Product</div>
                            <div className="text-gray-900 truncate">{it.productName} {it.size ? `(${it.size})` : ''}</div>
                            <div className="text-gray-500">Quantity</div>
                            <div className="text-gray-900">{typeof oldQty === 'number' ? (<><span>{oldQty}</span> <span>→ {newQty}</span> {typeof deltaQty === 'number' && deltaQty !== 0 ? `(${deltaQty > 0 ? '+' : ''}${deltaQty})` : ''}</>) : newQty}</div>
                            <div className="text-gray-500">Price each</div>
                            <div className="text-gray-900">₱{price.toLocaleString()}</div>
                            <div className="text-gray-500">Item subtotal</div>
                            <div className="text-gray-900">₱{newSubtotal.toLocaleString()} <span className="text-gray-500">(prev ₱{prevSubtotal.toLocaleString()})</span></div>
                            <div className="text-gray-500">Amount {direction}</div>
                            <div className={`${priceDiff > 0 ? 'text-emerald-700' : priceDiff < 0 ? 'text-red-700' : 'text-gray-900'}`}>₱{Math.abs(priceDiff).toLocaleString()}</div>
                          </div>
                          {orderDetail && (
                            <div className="mt-2 pt-2 border-t border-gray-100 grid grid-cols-2 text-xs">
                              <div className="text-gray-500">Order total</div>
                              <div className="text-gray-900">₱{(orderDetail.total||0).toLocaleString()} <span className="text-gray-500">(prev ₱{((orderDetail.total||0) - priceDiff).toLocaleString()})</span></div>
                            </div>
                          )}
                        </div>
                      )
                    }
                    if (n.type === 'item_cancelled' || n.type === 'payment_refund' || n.type === 'payment_deduction') {
                      const qty = it.quantity || 0
                      const price = it.price || 0
                      const subtotal = qty * price
                      const amt = md.refundAmount || Math.abs(subtotal)
                      return (
                        <div className="mt-3 text-xs text-gray-700 bg-gray-50 border border-gray-100 rounded-lg p-3">
                          <div className="font-medium text-gray-900 mb-1">Summary</div>
                          <div className="grid grid-cols-2 gap-y-1">
                            <div className="text-gray-500">Product</div>
                            <div className="text-gray-900 truncate">{it.productName} {it.size ? `(${it.size})` : ''}</div>
                            <div className="text-gray-500">Quantity</div>
                            <div className="text-gray-900">{qty}</div>
                            <div className="text-gray-500">Price each</div>
                            <div className="text-gray-900">₱{price.toLocaleString()}</div>
                            <div className="text-gray-500">Subtotal affected</div>
                            <div className="text-gray-900">₱{subtotal.toLocaleString()}</div>
                            <div className="text-gray-500">{n.type === 'payment_refund' ? 'Refund' : n.type === 'payment_deduction' ? 'Deduction' : 'Amount'}</div>
                            <div className="text-gray-900">₱{amt.toLocaleString()} {md.paymentMethod ? `• ${md.paymentMethod}` : ''}</div>
                          </div>
                          {orderDetail && (
                            <div className="mt-2 pt-2 border-t border-gray-100 grid grid-cols-2 text-xs">
                              <div className="text-gray-500">Order total now</div>
                              <div className="text-gray-900">₱{(orderDetail.total||0).toLocaleString()}</div>
                            </div>
                          )}
                        </div>
                      )
                    }
                    return null
                  })()}
                </div>
              </div>
              {detailLoading ? (
                <div className="text-center text-sm text-gray-500">Loading order…</div>
              ) : orderDetail ? (
                <div className="rounded-xl border border-gray-100 bg-gray-50">
                  <div className="px-4 py-3 border-b border-gray-100 text-sm flex items-center justify-between">
                    <div className="text-gray-700">Order #{orderDetail._id?.toString().slice(-8).toUpperCase()}</div>
                    <span className="text-xs px-2 py-1 rounded-full bg-gray-200 text-gray-800 capitalize">{orderDetail.status}</span>
                  </div>
                  <div className="px-4 py-3 text-sm grid grid-cols-2 gap-2">
                    <div className="text-gray-600">Method: <span className="capitalize text-gray-900">{orderDetail.shippingMethod}</span></div>
                    <div className="text-gray-600 text-right">Total: <span className="font-semibold text-emerald-700">₱{(orderDetail.total||0).toLocaleString()}</span></div>
                  </div>
                  <div className="px-4 pb-3">
                    <div className="grid grid-cols-5 gap-2 text-xs text-gray-500 mb-1">
                      <div className="col-span-2">Item</div>
                      <div>Qty</div>
                      <div className="text-right">Price</div>
                      <div className="text-right">Subtotal</div>
                    </div>
                    {(orderDetail.items||[]).map((it, idx) => (
                      <div key={idx} className="grid grid-cols-5 gap-2 text-xs py-1 border-t border-gray-100">
                        <div className="col-span-2 truncate">{it.name} {it.size ? `(${it.size})` : ''}</div>
                        <div>{it.quantity}</div>
                        <div className="text-right">₱{(it.price||0).toLocaleString()}</div>
                        <div className="text-right font-medium">₱{((it.price||0)*(it.quantity||0)).toLocaleString()}</div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : null}
            </div>
            <div className="p-4 border-t border-gray-100 flex justify-end">
              <button onClick={() => setDetailOpen(false)} className="px-4 py-2 text-sm rounded-lg border border-gray-200 hover:bg-gray-50">Close</button>
            </div>
          </div>
        </div>, document.body)
      : null}
    </div>
  )
}

export default NotificationDropdown

