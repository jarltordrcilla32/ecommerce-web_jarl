import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Container from '../components/layout/Container'
import { useNotification } from '../contexts/NotificationContext'
import ConfirmModal from '../components/ui/ConfirmModal'
import ItemSelectionModal from '../components/ui/ItemSelectionModal'
import EditItemModal from '../components/ui/EditItemModal'

// Import images
import soilConditionerImg from '../assets/images/soil-conditioner.png'
import hogSwillImg from '../assets/images/hog-swill.png'

function OrdersPage() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [filter, setFilter] = useState('all')
  const [showCancelModal, setShowCancelModal] = useState(false)
  const [showItemSelectionModal, setShowItemSelectionModal] = useState(false)
  const [orderToCancel, setOrderToCancel] = useState(null)
  const [showEditModal, setShowEditModal] = useState(false)
  const [itemToEdit, setItemToEdit] = useState(null)
  const [availableVariants, setAvailableVariants] = useState([])
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

  // Function to fetch orders
  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        setError('Please log in to view your orders')
        setLoading(false)
        return
      }

      const response = await fetch('http://localhost:5177/api/orders', {
        headers: { Authorization: `Bearer ${token}` }
      })

      if (!response.ok) {
        throw new Error('Failed to fetch orders')
      }

      const ordersData = await response.json()
      setOrders(ordersData)
    } catch (error) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchOrders()
  }, [])

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

  const canCancel = (status) => {
    const nonCancellableStatuses = ['On The Way', 'Delivered', 'Picked Up', 'Cancelled']
    return !nonCancellableStatuses.includes(status)
  }


  const handleCancelClick = (orderId) => {
    setOrderToCancel(orderId)
    setShowItemSelectionModal(true)
  }

  const handleItemSelectionConfirm = async (selectedItems, reason) => {
    if (!orderToCancel) return

    try {
      const token = localStorage.getItem('token')
      
      // Cancel each selected item
      for (const itemIndex of selectedItems) {
        const response = await fetch(`http://localhost:5177/api/orders/${orderToCancel}/items/${itemIndex}/cancel`, {
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
      const orderResponse = await fetch(`http://localhost:5177/api/orders/${orderToCancel}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      
      if (orderResponse.ok) {
        const updatedOrder = await orderResponse.json()
        setOrders(orders.map(order => order._id === orderToCancel ? updatedOrder : order))
        showSuccess(`${selectedItems.length} item(s) cancelled successfully`)
      }
    } catch (error) {
      showError(error.message)
    } finally {
      setShowItemSelectionModal(false)
      setOrderToCancel(null)
    }
  }

  const handleCancelClose = () => {
    setShowCancelModal(false)
    setOrderToCancel(null)
  }

  const canEditItem = (item) => {
    // Can edit if item status is active (or undefined for old orders)
    return (item.status || 'active') === 'active'
  }

  const handleEditItemClick = (order, item, itemIndex) => {
    // Set up available variants for this product
    const variants = [
      { name: 'Soil Conditioner - Pouch', size: '1kg', price: 25, _id: '68d4c80931a9af44a2f8243a' },
      { name: 'Soil Conditioner - Pack', size: '5kg', price: 100, _id: '68d4c80931a9af44a2f8243b' },
      { name: 'Soil Conditioner - Sack', size: '25kg', price: 500, _id: '68d4c80931a9af44a2f8243c' },
      { name: 'Hogs Swill', size: '25-30kg', price: 400, _id: '68d4c80931a9af44a2f8243d' }
    ]
    
    setItemToEdit({ order, item, itemIndex })
    setAvailableVariants(variants)
    setShowEditModal(true)
  }

  const handleEditItemSave = async (newQuantity) => {
    if (!itemToEdit) return

    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`http://localhost:5177/api/orders/${itemToEdit.order._id}/items/${itemToEdit.itemIndex}/edit`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          quantity: newQuantity
        })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Failed to edit item')
      }

      showSuccess('Item quantity updated successfully!')
      setShowEditModal(false)
      setItemToEdit(null)
      
      // Refresh orders
      fetchOrders()
    } catch (error) {
      showError(error.message)
    }
  }


  const filteredOrders = orders.filter(order => {
    if (filter === 'all') return true
    if (filter === 'active') return !['Delivered', 'Picked Up', 'Cancelled'].includes(order.status)
    if (filter === 'completed') return ['Delivered', 'Picked Up'].includes(order.status)
    if (filter === 'cancelled') return order.status === 'Cancelled'
    return true
  })

  if (loading) {
    return (
      <Container>
        <div className="max-w-6xl mx-auto px-4 py-16 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your orders...</p>
        </div>
      </Container>
    )
  }

  if (error) {
    return (
      <Container>
        <div className="max-w-6xl mx-auto px-4 py-16 text-center">
          <div className="text-red-600 mb-4">
            <svg className="h-16 w-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Error Loading Orders</h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <Link to="/" className="inline-flex items-center gap-2 px-5 py-3 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700">
            Go Home
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </Container>
    )
  }

  return (
    <Container>
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Orders</h1>
          <p className="text-gray-600 mt-2">Track and manage your orders</p>
        </div>

        {/* Filter Tabs */}
        <div className="mb-6">
          <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg w-fit">
            {[
              { key: 'all', label: 'All Orders' },
              { key: 'active', label: 'Active' },
              { key: 'completed', label: 'Completed' },
              { key: 'cancelled', label: 'Cancelled' }
            ].map(tab => (
              <button
                key={tab.key}
                onClick={() => setFilter(tab.key)}
                className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                  filter === tab.key
                    ? 'bg-white text-emerald-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {filteredOrders.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
            <div className="mx-auto w-16 h-16 rounded-full bg-gray-50 text-gray-400 grid place-content-center mb-4">
              <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No orders found</h3>
            <p className="text-gray-600 mb-6">
              {filter === 'all' 
                ? "You haven't placed any orders yet." 
                : `No ${filter} orders found.`
              }
            </p>
            <Link to="/products/soil" className="inline-flex items-center gap-2 px-5 py-3 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700">
              Start Shopping
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredOrders.map(order => (
              <div key={order._id} className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      Order #{order._id.slice(-8).toUpperCase()}
                    </h3>
                    <p className="text-sm text-gray-500">
                      Placed on {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                    <Link
                      to={`/orders/${order._id}`}
                      className="px-4 py-2 text-emerald-600 border border-emerald-200 rounded-lg hover:bg-emerald-50 transition-colors text-sm font-medium"
                    >
                      Track Order
                    </Link>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  {/* Order Items */}
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">Items</h4>
                    <div className="space-y-3">
                      {order.items.map((item, index) => (
                        <div key={index} className={`flex items-center gap-3 p-2 rounded-lg ${
                          (item.status || 'active') === 'cancelled' ? 'bg-red-50 border border-red-200' : 'bg-gray-50'
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
                            {canEditItem(item) && (
                              <button
                                onClick={() => handleEditItemClick(order, item, index)}
                                className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors"
                                title="Edit item"
                              >
                                Edit
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Order Details */}
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">Order Details</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Total:</span>
                        <span className="font-semibold text-emerald-600">₱{order.total.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Payment:</span>
                        <span className="capitalize">{order.paymentMethod}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Shipping:</span>
                        <span className="capitalize">{order.shippingMethod}</span>
                      </div>
                      {order.shippingMethod === 'delivery' && order.courier && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Courier:</span>
                          <span>{order.courier}</span>
                        </div>
                      )}
                    </div>

                    {canCancel(order.status) && (
                      <button
                        onClick={() => handleCancelClick(order._id)}
                        className="w-full mt-4 px-4 py-2 text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition-colors text-sm font-medium"
                      >
                        Cancel Order
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Item Selection Modal */}
      <ItemSelectionModal
        isOpen={showItemSelectionModal}
        onClose={() => {
          setShowItemSelectionModal(false)
          setOrderToCancel(null)
        }}
        onConfirm={handleItemSelectionConfirm}
        order={orders.find(order => order._id === orderToCancel)}
      />

      {/* Edit Item Modal */}
      {showEditModal && itemToEdit && (
        <EditItemModal
          isOpen={showEditModal}
          onClose={() => {
            setShowEditModal(false)
            setItemToEdit(null)
          }}
          onSave={handleEditItemSave}
          item={itemToEdit.item}
          availableVariants={availableVariants}
        />
      )}

    </Container>
  )
}

export default OrdersPage