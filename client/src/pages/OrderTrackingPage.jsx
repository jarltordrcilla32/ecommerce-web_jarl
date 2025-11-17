import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import Container from '../components/layout/Container'
import ConfirmModal from '../components/ui/ConfirmModal'
import ItemSelectionModal from '../components/ui/ItemSelectionModal'
import { useNotification } from '../contexts/NotificationContext'

// Import images
import soilConditionerImg from '../assets/images/soil-conditioner.png'
import hogSwillImg from '../assets/images/hog-swill.png'

function OrderTrackingPage() {
  const { orderId } = useParams()
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showCancelModal, setShowCancelModal] = useState(false)
  const [showItemSelectionModal, setShowItemSelectionModal] = useState(false)
  const { showSuccess, showError } = useNotification()

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

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const token = localStorage.getItem('token')
        if (!token) {
          setError('Please log in to track your order')
          setLoading(false)
          return
        }

        const response = await fetch(`http://localhost:5177/api/orders/${orderId}`, {
          headers: { Authorization: `Bearer ${token}` }
        })

        if (!response.ok) {
          throw new Error('Order not found')
        }

        const orderData = await response.json()
        setOrder(orderData)
      } catch (error) {
        setError(error.message)
      } finally {
        setLoading(false)
      }
    }

    fetchOrder()
  }, [orderId])

  const getStatusColor = (status) => {
    const colors = {
      'Order Placed': 'bg-blue-100 text-blue-800',
      'Preparing for Shipping': 'bg-yellow-100 text-yellow-800',
      'On The Way': 'bg-purple-100 text-purple-800',
      'Delivered': 'bg-green-100 text-green-800',
      'Being Packed': 'bg-orange-100 text-orange-800',
      'Ready for Pickup': 'bg-cyan-100 text-cyan-800',
      'Picked Up': 'bg-green-100 text-green-800',
      'Cancelled': 'bg-red-100 text-red-800'
    }
    return colors[status] || 'bg-gray-100 text-gray-800'
  }

  const getStatusSteps = (shippingMethod) => {
    if (shippingMethod === 'delivery') {
      return [
        { status: 'Order Placed', label: 'Order Placed', description: 'Your order has been received' },
        { status: 'Preparing for Shipping', label: 'Preparing for Shipping', description: 'We are preparing your order' },
        { status: 'On The Way', label: 'On The Way', description: 'Your order is being delivered' },
        { status: 'Delivered', label: 'Delivered', description: 'Order has been delivered' }
      ]
    } else {
      return [
        { status: 'Order Placed', label: 'Order Placed', description: 'Your order has been received' },
        { status: 'Being Packed', label: 'Being Packed', description: 'We are packing your order' },
        { status: 'Ready for Pickup', label: 'Ready for Pickup', description: 'Your order is ready for pickup' },
        { status: 'Picked Up', label: 'Picked Up', description: 'Order has been picked up' }
      ]
    }
  }

  const canCancel = (status) => {
    const nonCancellableStatuses = ['On The Way', 'Delivered', 'Picked Up', 'Cancelled']
    return !nonCancellableStatuses.includes(status)
  }


  const handleCancelClick = () => {
    setShowItemSelectionModal(true)
  }

  const handleItemSelectionConfirm = async (selectedItems, reason) => {
    try {
      const token = localStorage.getItem('token')
      
      // Cancel each selected item
      for (const itemIndex of selectedItems) {
        const response = await fetch(`http://localhost:5177/api/orders/${orderId}/items/${itemIndex}/cancel`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({ reason })
        })

        if (!response.ok) {
          const data = await response.json()
          throw new Error(data.message)
        }
      }

      // Fetch updated order
      const orderResponse = await fetch(`http://localhost:5177/api/orders/${orderId}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      
      if (orderResponse.ok) {
        const updatedOrder = await orderResponse.json()
        setOrder(updatedOrder)
        showSuccess(`${selectedItems.length} item(s) cancelled successfully`)
      }
    } catch (error) {
      showError(error.message)
    } finally {
      setShowItemSelectionModal(false)
    }
  }


  if (loading) {
    return (
      <Container>
        <div className="max-w-4xl mx-auto px-4 py-16 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading order details...</p>
        </div>
      </Container>
    )
  }

  if (error) {
    return (
      <Container>
        <div className="max-w-4xl mx-auto px-4 py-16 text-center">
          <div className="text-red-600 mb-4">
            <svg className="h-16 w-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Order Not Found</h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <Link to="/orders" className="inline-flex items-center gap-2 px-5 py-3 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700">
            View All Orders
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </Container>
    )
  }

  const steps = getStatusSteps(order.shippingMethod)
  const currentStepIndex = steps.findIndex(step => step.status === order.status)

  return (
    <Container>
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-8">
          <Link to="/orders" className="inline-flex items-center gap-2 text-emerald-600 hover:text-emerald-700 mb-4">
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Orders
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Order Tracking</h1>
          <p className="text-gray-600 mt-2">Order #{order._id.slice(-8).toUpperCase()}</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Order Status Timeline */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">Order Status</h2>
              
              <div className="space-y-6">
                {steps.map((step, index) => {
                  const isCompleted = index <= currentStepIndex
                  const isCurrent = step.status === order.status
                  
                  return (
                    <div key={step.status} className="flex items-start gap-4">
                      <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                        isCompleted 
                          ? 'bg-emerald-600 text-white' 
                          : 'bg-gray-200 text-gray-400'
                      }`}>
                        {isCompleted ? (
                          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        ) : (
                          <span className="text-sm font-medium">{index + 1}</span>
                        )}
                      </div>
                      <div className="flex-1">
                        <div className={`font-medium ${
                          isCurrent ? 'text-emerald-600' : isCompleted ? 'text-gray-900' : 'text-gray-500'
                        }`}>
                          {step.label}
                        </div>
                        <div className="text-sm text-gray-500 mt-1">{step.description}</div>
                        {isCurrent && (
                          <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium mt-2 ${getStatusColor(order.status)}`}>
                            Current Status
                          </div>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Order Details */}
          <div className="space-y-6">
            {/* Order Summary */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h3>
              
              <div className="space-y-3 mb-4">
                {order.items.map((item, index) => (
                  <div key={index} className={`flex items-center gap-3 p-3 rounded-lg border ${
                    (item.status || 'active') === 'cancelled' 
                      ? 'bg-red-50 border-red-200' 
                      : 'bg-gray-50 border-gray-100'
                  }`}>
                    <div className="w-12 h-12 rounded-lg bg-gray-50 border border-gray-100 overflow-hidden flex-shrink-0">
                      <img 
                        src={getImageSrc(item)} 
                        alt={item.name} 
                        className="w-full h-full object-contain" 
                        onError={(e) => {
                          e.target.style.display = 'none'
                          e.target.nextSibling.style.display = 'flex'
                        }}
                      />
                      <div className="w-full h-full bg-gray-100 flex items-center justify-center text-xs text-gray-500 font-medium" style={{display: 'none'}}>
                        {item.name.split(' ').slice(0, 2).join(' ').substring(0, 8)}
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <div className={`text-sm font-medium ${
                          (item.status || 'active') === 'cancelled' ? 'text-gray-500 line-through' : 'text-gray-900'
                        }`}>
                          {item.name}
                        </div>
                        {(item.status || 'active') === 'cancelled' && (
                          <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                            Cancelled
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-gray-500">Qty {item.quantity} • {item.size}</div>
                      {(item.status || 'active') === 'cancelled' && item.cancellationReason && (
                        <div className="text-xs text-red-600 mt-1">
                          Reason: {item.cancellationReason}
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <div className={`text-sm font-semibold ${
                        (item.status || 'active') === 'cancelled' ? 'text-gray-500 line-through' : 'text-emerald-600'
                      }`}>
                        ₱{(item.price * item.quantity).toLocaleString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="border-t border-gray-100 pt-3">
                <div className="flex justify-between text-sm font-semibold">
                  <span>Total</span>
                  <span className="text-emerald-600">₱{order.total.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Order Info */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Information</h3>
              
              <div className="space-y-3 text-sm">
                <div>
                  <span className="font-medium text-gray-700">Status:</span>
                  <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                    {order.status}
                  </span>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Payment:</span>
                  <span className="ml-2 text-gray-600 capitalize">{order.paymentMethod}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Shipping:</span>
                  <span className="ml-2 text-gray-600 capitalize">{order.shippingMethod}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Order Date:</span>
                  <span className="ml-2 text-gray-600">{new Date(order.createdAt).toLocaleDateString()}</span>
                </div>
                {order.shippingMethod === 'delivery' && order.courier && (
                  <div>
                    <span className="font-medium text-gray-700">Courier:</span>
                    <span className="ml-2 text-gray-600">{order.courier}</span>
                  </div>
                )}
              </div>

              {canCancel(order.status) && (
                <button
                  onClick={handleCancelClick}
                  className="w-full mt-4 px-4 py-2 text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition-colors"
                >
                  Cancel Order
                </button>
              )}
            </div>

            {/* Shipping Address */}
            {order.shippingMethod === 'delivery' && order.address && (
              <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Shipping Address</h3>
                <div className="text-sm text-gray-600 space-y-1">
                  <div>{order.address.fullName}</div>
                  <div>{order.address.phone}</div>
                  <div>{order.address.street}</div>
                  <div>{order.address.city}, {order.address.province} {order.address.postal}</div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Item Selection Modal */}
      <ItemSelectionModal
        isOpen={showItemSelectionModal}
        onClose={() => setShowItemSelectionModal(false)}
        onConfirm={handleItemSelectionConfirm}
        order={order}
      />

    </Container>
  )
}

export default OrderTrackingPage
