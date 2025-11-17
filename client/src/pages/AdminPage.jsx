import { useState, useEffect } from 'react'
import Container from '../components/layout/Container'
import { useNotification } from '../contexts/NotificationContext'
import NotificationDropdown from '../components/ui/NotificationDropdown'

function AdminPage() {
  const cards = [
    { title: 'Total Orders', value: '128', subtitle: 'Last 30 days' },
    { title: 'Revenue', value: '₱82,540', subtitle: 'Last 30 days' },
    { title: 'Customers', value: '412', subtitle: 'All time' },
  ]
  const [activeTab, setActiveTab] = useState('products')
  const [orders, setOrders] = useState([])
  const [users, setUsers] = useState([])
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [editingProduct, setEditingProduct] = useState(null)
  const [editForm, setEditForm] = useState({ price: '', stock: '' })
  const [saving, setSaving] = useState(false)
  const [orderFilters, setOrderFilters] = useState({ status: '', shippingMethod: '', search: '' })
  const [editingOrder, setEditingOrder] = useState(null)
  const [orderStatus, setOrderStatus] = useState('')
  const { showSuccess, showError, showInfo, notifications, fetchNotifications } = useNotification()

  // Color palette for products
  const productColors = ['#059669', '#10b981', '#34d399', '#6ee7b7', '#a7f3d0', '#d1fae5']

  useEffect(() => {
    async function fetchData() {
      try {
        const token = localStorage.getItem('token')
        
        // Build query string for orders
        const orderParams = new URLSearchParams()
        if (orderFilters.status) orderParams.append('status', orderFilters.status)
        if (orderFilters.shippingMethod) orderParams.append('shippingMethod', orderFilters.shippingMethod)
        if (orderFilters.search) orderParams.append('search', orderFilters.search)
        
        const [ordersRes, usersRes, productsRes] = await Promise.all([
          fetch(`http://localhost:5177/api/admin/orders?${orderParams.toString()}`, {
            headers: { Authorization: `Bearer ${token}` }
          }),
          fetch('http://localhost:5177/api/admin/users', {
            headers: { Authorization: `Bearer ${token}` }
          }),
          fetch('http://localhost:5177/api/admin/products', {
            headers: { Authorization: `Bearer ${token}` }
          })
        ])
        
        const ordersData = await ordersRes.json()
        const usersData = await usersRes.json()
        const productsData = await productsRes.json()
        
        if (ordersRes.ok) {
          setOrders(ordersData)
        }
        if (usersRes.ok) {
          setUsers(usersData)
        }
        if (productsRes.ok) {
          console.log('Products fetched:', productsData)
          setProducts(productsData)
        } else {
          console.error('Products fetch failed:', productsRes.status, productsData)
        }
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setLoading(false)
      }
    }
    
    fetchData()
  }, [orderFilters])

  // Show toast notifications for new item cancellations
  useEffect(() => {
    const itemCancelledNotifications = notifications.filter(n => 
      n.type === 'item_cancelled' && !n.isRead
    )
    
    if (itemCancelledNotifications.length > 0) {
      const latestNotification = itemCancelledNotifications[0]
      showInfo(`New item cancellation: ${latestNotification.message}`)
    }
  }, [notifications, showInfo])

  const totalSold = products.reduce((s, p) => s + (p.sold || 0), 0)
  let startAngle = 0
  
  console.log('Products state:', products)
  console.log('Total sold:', totalSold)

  // Edit product functions
  const handleEditClick = (product) => {
    setEditingProduct(product)
    setEditForm({
      price: product.price.toString(),
      stock: product.stock.toString()
    })
  }

  const handleEditSubmit = async (e) => {
    e.preventDefault()
    if (!editingProduct) return

    setSaving(true)
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`http://localhost:5177/api/admin/products/${editingProduct._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          ...editingProduct,
          price: parseFloat(editForm.price),
          stock: parseInt(editForm.stock)
        })
      })

      if (response.ok) {
        const updatedProduct = await response.json()
        setProducts(products.map(p => p._id === updatedProduct._id ? updatedProduct : p))
        setEditingProduct(null)
        setEditForm({ price: '', stock: '' })
        showSuccess('Product updated successfully')
      } else {
        const error = await response.json()
        showError(`Error updating product: ${error.message}`)
      }
    } catch (error) {
      console.error('Error updating product:', error)
      showError('Error updating product')
    } finally {
      setSaving(false)
    }
  }

  const handleEditCancel = () => {
    setEditingProduct(null)
    setEditForm({ price: '', stock: '' })
  }

  const handleOrderStatusUpdate = async () => {
    if (!editingOrder || !orderStatus) return
    
    try {
      setSaving(true)
      const token = localStorage.getItem('token')
      const response = await fetch(`http://localhost:5177/api/admin/orders/${editingOrder._id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status: orderStatus })
      })
      
      if (!response.ok) {
        throw new Error('Failed to update order status')
      }
      
      const updatedOrder = await response.json()
      setOrders(orders.map(o => o._id === editingOrder._id ? updatedOrder : o))
      setEditingOrder(null)
      setOrderStatus('')
      showSuccess('Order status updated successfully')
    } catch (error) {
      console.error('Error updating order status:', error)
      showError('Failed to update order status')
    } finally {
      setSaving(false)
    }
  }

  const handleOrderEditClick = (order) => {
    setEditingOrder(order)
    setOrderStatus(order.status)
  }

  const handleOrderEditCancel = () => {
    setEditingOrder(null)
    setOrderStatus('')
  }

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

  return (
    <Container>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <NotificationDropdown />
        </div>
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {cards.map(c => (
            <div key={c.title} className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
              <div className="text-sm text-gray-500">{c.subtitle}</div>
              <div className="text-2xl font-bold text-gray-900 mt-1">{c.value}</div>
              <div className="text-sm font-medium text-gray-900 mt-2">{c.title}</div>
            </div>
          ))}
        </div>
        {/* Inventory widgets */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="text-lg font-semibold text-gray-900">Inventory</div>
            <div className="text-sm text-gray-500">{products.length} products</div>
          </div>
          <div className="grid md:grid-cols-4 gap-4">
            {products.map((p, index) => {
              const capacity = Math.max(200, p.stock + p.sold) // Dynamic capacity based on total
              const percent = Math.min(100, Math.round((p.stock / capacity) * 100))
              const color = productColors[index % productColors.length]
              return (
                <div key={p._id} className="rounded-2xl border border-gray-100 p-4 bg-gray-50">
                  <div className="text-sm font-medium text-gray-900 mb-1">{p.name}</div>
                  <div className="text-xs text-gray-500 mb-1">Size: {p.size}</div>
                  <div className="text-xs text-gray-500 mb-3">Stock: {p.stock} | Sold: {p.sold}</div>
                  <div className="h-2 w-full rounded-full bg-white border border-gray-200 overflow-hidden">
                    <div className="h-full" style={{ width: `${percent}%`, background: color }} />
                  </div>
                  <div className="text-xs text-gray-400 mt-1">₱{p.price.toLocaleString()} each</div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Sales pie chart */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="text-lg font-semibold text-gray-900">Products Sold</div>
            <div className="text-sm text-gray-500">Total {totalSold}</div>
          </div>
          <div className="grid md:grid-cols-3 gap-6 items-center">
            <div className="md:col-span-1 flex items-center justify-center">
              <svg width="220" height="220" viewBox="0 0 220 220">
                <circle cx="110" cy="110" r="90" fill="#f9fafb" />
                {products.map((p, i) => {
                  const slice = (p.sold / totalSold) * Math.PI * 2
                  const x1 = 110 + 90 * Math.cos(startAngle)
                  const y1 = 110 + 90 * Math.sin(startAngle)
                  const x2 = 110 + 90 * Math.cos(startAngle + slice)
                  const y2 = 110 + 90 * Math.sin(startAngle + slice)
                  const largeArc = slice > Math.PI ? 1 : 0
                  const path = `M110,110 L${x1},${y1} A90,90 0 ${largeArc},1 ${x2},${y2} z`
                  const color = productColors[i % productColors.length]
                  startAngle += slice
                  return <path key={p._id} d={path} fill={color} opacity="0.9" />
                })}
                <circle cx="110" cy="110" r="60" fill="#ffffff" />
                <text x="110" y="110" textAnchor="middle" dominantBaseline="middle" fontSize="14" fill="#065f46" fontWeight="bold">Sales</text>
              </svg>
            </div>
            <div className="md:col-span-2 grid sm:grid-cols-2 gap-4">
              {products.map((p, i) => {
                const color = productColors[i % productColors.length]
                return (
                  <div key={p._id} className="flex items-center justify-between p-3 rounded-xl bg-gray-50 border border-gray-100">
                    <div className="flex items-center gap-3">
                      <span className="w-3 h-3 rounded-full" style={{ background: color }} />
                      <div className="text-sm font-medium text-gray-900">{p.name} ({p.size})</div>
                    </div>
                    <div className="text-sm text-gray-600">{p.sold} sold</div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Data tables with tabs */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="text-lg font-semibold text-gray-900">Data</div>
            <div className="flex gap-2 text-sm">
              <button onClick={() => setActiveTab('products')} className={`px-3 py-1.5 rounded-lg border ${activeTab === 'products' ? 'border-emerald-300 bg-emerald-50 text-emerald-800' : 'border-gray-200 text-gray-700 hover:bg-gray-50'}`}>Products</button>
              <button onClick={() => setActiveTab('orders')} className={`px-3 py-1.5 rounded-lg border ${activeTab === 'orders' ? 'border-emerald-300 bg-emerald-50 text-emerald-800' : 'border-gray-200 text-gray-700 hover:bg-gray-50'}`}>Orders</button>
              <button onClick={() => setActiveTab('users')} className={`px-3 py-1.5 rounded-lg border ${activeTab === 'users' ? 'border-emerald-300 bg-emerald-50 text-emerald-800' : 'border-gray-200 text-gray-700 hover:bg-gray-50'}`}>Users</button>
            </div>
          </div>
          {loading ? (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
              <p className="mt-2 text-gray-500">Loading...</p>
            </div>
          ) : activeTab === 'products' ? (
            <>
              <div className="flex items-center justify-between mb-4">
                <div className="text-sm font-medium text-gray-500">Product Management</div>
                <button className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 text-sm">
                  Add Product
                </button>
              </div>
              <div className="grid grid-cols-6 gap-4 text-sm font-medium text-gray-500 mb-2">
                <div>Name</div>
                <div>Size</div>
                <div>Price</div>
                <div>Stock</div>
                <div>Sold</div>
                <div className="text-right">Actions</div>
              </div>
              {products.length === 0 ? (
                <div className="text-center py-8 text-gray-500">No products found</div>
              ) : (
                products.map(p => (
                  <div key={p._id} className="grid grid-cols-6 gap-4 py-3 border-t border-gray-100 text-sm">
                    <div className="font-medium text-gray-900">{p.name}</div>
                    <div className="text-gray-600">{p.size}</div>
                    <div className="text-gray-600">₱{p.price.toLocaleString()}</div>
                    <div className="text-gray-600">{p.stock}</div>
                    <div className="text-gray-600">{p.sold}</div>
                    <div className="text-right">
                      <button 
                        onClick={() => handleEditClick(p)}
                        className="px-2 py-1 text-emerald-600 hover:bg-emerald-50 rounded text-xs mr-2"
                      >
                        Edit
                      </button>
                      <button className="px-2 py-1 text-red-600 hover:bg-red-50 rounded text-xs">Delete</button>
                    </div>
                  </div>
                ))
              )}
            </>
          ) : activeTab === 'orders' ? (
            <>
              {/* Order Filters */}
              <div className="mb-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                    <select
                      value={orderFilters.status}
                      onChange={(e) => setOrderFilters({ ...orderFilters, status: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    >
                      <option value="">All Statuses</option>
                      <option value="Order Placed">Order Placed</option>
                      <option value="Preparing for Shipping">Preparing for Shipping</option>
                      <option value="On The Way">On The Way</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Being Packed">Being Packed</option>
                      <option value="Ready for Pickup">Ready for Pickup</option>
                      <option value="Picked Up">Picked Up</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Shipping Method</label>
                    <select
                      value={orderFilters.shippingMethod}
                      onChange={(e) => setOrderFilters({ ...orderFilters, shippingMethod: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    >
                      <option value="">All Methods</option>
                      <option value="pickup">Pickup</option>
                      <option value="delivery">Delivery</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
                    <input
                      type="text"
                      placeholder="Search orders..."
                      value={orderFilters.search}
                      onChange={(e) => setOrderFilters({ ...orderFilters, search: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-6 gap-4 text-sm font-medium text-gray-500 mb-2">
                <div>Order ID</div>
                <div>Customer</div>
                <div>Status</div>
                <div>Method</div>
                <div className="text-right">Total</div>
                <div className="text-right">Actions</div>
              </div>
              {orders.length === 0 ? (
                <div className="text-center py-8 text-gray-500">No orders found</div>
              ) : (
                orders.map(o => (
                  <div key={o._id} className="grid grid-cols-6 gap-4 py-3 border-t border-gray-100 text-sm">
                    <div className="font-mono text-xs">{o._id.slice(-8)}</div>
                    <div className="text-gray-900">{o.user?.name || 'Unknown'}</div>
                    <div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(o.status)}`}>
                        {o.status}
                      </span>
                    </div>
                    <div className="text-gray-600 capitalize">{o.shippingMethod}</div>
                    <div className="text-right font-semibold text-emerald-600">₱{o.total.toLocaleString()}</div>
                    <div className="text-right">
                      <button 
                        onClick={() => handleOrderEditClick(o)}
                        className="px-2 py-1 text-emerald-600 hover:bg-emerald-50 rounded text-xs mr-2"
                      >
                        Edit
                      </button>
                    </div>
                  </div>
                ))
              )}
            </>
          ) : (
            <>
              <div className="grid grid-cols-4 gap-4 text-sm font-medium text-gray-500 mb-2">
                <div>User ID</div>
                <div>Name</div>
                <div>Email</div>
                <div className="text-right">Role</div>
              </div>
              {users.length === 0 ? (
                <div className="text-center py-8 text-gray-500">No users found</div>
              ) : (
                users.map(u => (
                  <div key={u._id} className="grid grid-cols-4 gap-4 py-3 border-t border-gray-100 text-sm">
                    <div className="font-mono">{u._id.slice(-8)}</div>
                    <div>{u.name}</div>
                    <div className="truncate">{u.email}</div>
                    <div className="text-right">
                      <span className={`px-2 py-1 rounded-full ${u.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-700'}`}>{u.role}</span>
                    </div>
                  </div>
                ))
              )}
            </>
          )}
        </div>
      </div>

      {/* Edit Product Modal */}
      {editingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-gray-100">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Edit Product: {editingProduct.name}
              </h3>
              <form onSubmit={handleEditSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Price (₱)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={editForm.price}
                    onChange={(e) => setEditForm({ ...editForm, price: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    placeholder="Enter price"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Stock
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={editForm.stock}
                    onChange={(e) => setEditForm({ ...editForm, stock: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    placeholder="Enter stock quantity"
                    required
                  />
                </div>
                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={handleEditCancel}
                    className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                    disabled={saving}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="flex-1 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-50"
                  >
                    {saving ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Edit Order Status Modal */}
      {editingOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-gray-100">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Update Order Status
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                Order #{editingOrder._id.slice(-8).toUpperCase()}
              </p>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status
                  </label>
                  <select
                    value={orderStatus}
                    onChange={(e) => setOrderStatus(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    required
                  >
                    <option value="Order Placed">Order Placed</option>
                    <option value="Preparing for Shipping">Preparing for Shipping</option>
                    <option value="On The Way">On The Way</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Being Packed">Being Packed</option>
                    <option value="Ready for Pickup">Ready for Pickup</option>
                    <option value="Picked Up">Picked Up</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>
                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={handleOrderEditCancel}
                    className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                    disabled={saving}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleOrderStatusUpdate}
                    disabled={saving}
                    className="flex-1 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-50"
                  >
                    {saving ? 'Updating...' : 'Update Status'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </Container>
  )
}

export default AdminPage
