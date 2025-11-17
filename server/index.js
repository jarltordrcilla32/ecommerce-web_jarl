import express from 'express'
import cors from 'cors'
import { v4 as uuidv4 } from 'uuid'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
import connectDB from './config/database.js'
import User from './models/User.js'
import Order from './models/Order.js'
import Product from './models/Product.js'
import Notification from './models/Notification.js'

dotenv.config()
connectDB()

const app = express()
app.use(cors())
app.use(express.json())

// Products are now stored in MongoDB - see Product model

app.get('/api/health', (_req, res) => res.json({ ok: true }))
// These endpoints are now handled by the Product model endpoints below

app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, password, name } = req.body || {}
    
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password required' })
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return res.status(409).json({ message: 'Email already registered' })
    }

    // Create new user
    const user = new User({
      name: name || email.split('@')[0],
      email,
      password
    })

    await user.save()

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    )

    res.status(201).json({ 
      token, 
      user: { 
        id: user._id, 
        email: user.email, 
        name: user.name,
        role: user.role
      } 
    })
  } catch (error) {
    console.error('Registration error:', error)
    res.status(500).json({ message: 'Server error during registration' })
  }
})

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body || {}
    
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password required' })
    }

    // Find user by email
    const user = await User.findOne({ email })
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' })
    }

    // Check password
    const isMatch = await user.comparePassword(password)
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' })
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    )

    res.json({ 
      token, 
      user: { 
        id: user._id, 
        email: user.email, 
        name: user.name,
        role: user.role
      } 
    })
  } catch (error) {
    console.error('Login error:', error)
    res.status(500).json({ message: 'Server error during login' })
  }
})

function requireAuth(req, res, next) {
  try {
    const token = req.header('authorization')?.replace('Bearer ', '')
    
    if (!token) {
      return res.status(401).json({ message: 'No token provided' })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.userId = decoded.userId
    next()
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token' })
  }
}

app.post('/api/checkout', requireAuth, async (req, res) => {
  console.log('Checkout endpoint hit!')
  console.log('Request body:', req.body)
  console.log('User ID:', req.userId)
  try {
    const { items, paymentMethod, shippingMethod, courier, address, saveAddress } = req.body || {}
    
    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: 'No items' })
    }

    // Calculate total and validate stock
    let total = 0
    const orderItems = []
    
    for (const item of items) {
      console.log('Processing item:', item)
      let product = null
      
      // Check if productId is a valid ObjectId (24 character hex string)
      if (item.productId && /^[0-9a-fA-F]{24}$/.test(item.productId)) {
        product = await Product.findById(item.productId)
        console.log('Product found by ID:', product)
      }
      
      // If product not found by ID or productId is not a valid ObjectId, try to find by name and size
      if (!product) {
        product = await Product.findOne({ 
          name: item.name, 
          size: item.size 
        })
        console.log('Product found by name/size:', product)
      }
      
      if (!product) {
        return res.status(400).json({ message: `Product not found: ${item.productId} (${item.name} - ${item.size})` })
      }
      
      if (product.stock < item.qty) {
        return res.status(400).json({ 
          message: `Insufficient stock for ${product.name}. Available: ${product.stock}, Requested: ${item.qty}` 
        })
      }
      
      total += product.price * item.qty
      orderItems.push({
        productId: product._id,
        name: product.name,
        size: product.size,
        price: product.price,
        quantity: item.qty,
        image: product.image
      })
    }

    // Create order
    const order = new Order({
      user: req.userId,
      items: orderItems,
      total,
      status: 'Order Placed',
      paymentMethod,
      shippingMethod,
      courier,
      address
    })

    await order.save()

    // Decrease stock for each product
    for (const item of items) {
      let product = null
      
      // Check if productId is a valid ObjectId (24 character hex string)
      if (item.productId && /^[0-9a-fA-F]{24}$/.test(item.productId)) {
        product = await Product.findById(item.productId)
      }
      
      // If product not found by ID or productId is not a valid ObjectId, try to find by name and size
      if (!product) {
        product = await Product.findOne({ 
          name: item.name, 
          size: item.size 
        })
      }
      
      if (product) {
        await product.decreaseStock(item.qty)
      }
    }

    // Add order to user's orders array and clear cart
    let updatedUser = null
    try {
      const updateData = {
        $push: { orders: order._id },
        $set: { cart: [] }
      }
      
      // Save address to user profile if requested and address is provided
      if (saveAddress && address) {
        updateData.$set.address = address
      }
      
      updatedUser = await User.findByIdAndUpdate(req.userId, updateData, { new: true })
    } catch (updateError) {
      console.error('Error updating user cart:', updateError)
    }

    res.json({ 
      ok: true, 
      order,
      user: updatedUser ? {
        id: updatedUser._id,
        email: updatedUser.email,
        name: updatedUser.name,
        role: updatedUser.role,
        address: updatedUser.address
      } : null
    })
  } catch (error) {
    console.error('Checkout error:', error)
    console.error('Error details:', {
      message: error.message,
      stack: error.stack,
      items: req.body?.items,
      userId: req.userId
    })
    res.status(500).json({ message: 'Server error during checkout' })
  }
})

app.get('/api/me', requireAuth, async (req, res) => {
  try {
    const user = await User.findById(req.userId).populate('orders')
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }
    res.json({ 
      id: user._id, 
      email: user.email, 
      name: user.name, 
      role: user.role,
      cart: user.cart || [],
      orders: user.orders,
      address: user.address
    })
  } catch (error) {
    console.error('Get user error:', error)
    res.status(500).json({ message: 'Server error' })
  }
})

// Admin routes
app.get('/api/admin/orders', requireAuth, async (req, res) => {
  try {
    const user = await User.findById(req.userId)
    if (!user || user.role !== 'admin') {
      return res.status(403).json({ message: 'Admin access required' })
    }
    
    const { status, shippingMethod, search } = req.query
    let query = {}
    
    if (status) query.status = status
    if (shippingMethod) query.shippingMethod = shippingMethod
    if (search) {
      query.$or = [
        { 'items.name': { $regex: search, $options: 'i' } },
        { 'address.fullName': { $regex: search, $options: 'i' } }
      ]
    }
    
    const orders = await Order.find(query)
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
    res.json(orders)
  } catch (error) {
    console.error('Get orders error:', error)
    res.status(500).json({ message: 'Server error' })
  }
})

// Update order status
app.put('/api/admin/orders/:id/status', requireAuth, async (req, res) => {
  try {
    const user = await User.findById(req.userId)
    if (!user || user.role !== 'admin') {
      return res.status(403).json({ message: 'Admin access required' })
    }
    
    const { status } = req.body
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).populate('user', 'name email')
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' })
    }
    
    res.json(order)
  } catch (error) {
    console.error('Update order status error:', error)
    res.status(500).json({ message: 'Server error' })
  }
})

// Get single order
app.get('/api/orders/:id', requireAuth, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('user', 'name email')
    if (!order) {
      return res.status(404).json({ message: 'Order not found' })
    }
    
    // Check if user owns the order or is admin
    const user = await User.findById(req.userId)
    if (order.user._id.toString() !== req.userId && user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' })
    }
    
    res.json(order)
  } catch (error) {
    console.error('Get order error:', error)
    res.status(500).json({ message: 'Server error' })
  }
})

// Get user's orders
app.get('/api/orders', requireAuth, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.userId })
      .sort({ createdAt: -1 })
    res.json(orders)
  } catch (error) {
    console.error('Get user orders error:', error)
    res.status(500).json({ message: 'Server error' })
  }
})

// Cancel order
app.put('/api/orders/:id/cancel', requireAuth, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
    if (!order) {
      return res.status(404).json({ message: 'Order not found' })
    }
    
    // Check if user owns the order
    if (order.user.toString() !== req.userId) {
      return res.status(403).json({ message: 'Access denied' })
    }
    
    // Check if order can be cancelled
    const nonCancellableStatuses = ['On The Way', 'Delivered', 'Picked Up', 'Cancelled']
    if (nonCancellableStatuses.includes(order.status)) {
      return res.status(400).json({ message: 'Order cannot be cancelled at this stage' })
    }
    
    // Restore stock
    for (const item of order.items) {
      const product = await Product.findById(item.productId)
      if (product) {
        product.stock += item.quantity
        product.sold -= item.quantity
        await product.save()
      }
    }
    
    order.status = 'Cancelled'
    await order.save()
    
    res.json(order)
  } catch (error) {
    console.error('Cancel order error:', error)
    res.status(500).json({ message: 'Server error' })
  }
})

// Cancel specific item in order
app.put('/api/orders/:id/items/:itemIndex/cancel', requireAuth, async (req, res) => {
  try {
    const { reason } = req.body
    const order = await Order.findById(req.params.id)
    if (!order) {
      return res.status(404).json({ message: 'Order not found' })
    }
    
    // Check if user owns the order
    if (order.user.toString() !== req.userId) {
      return res.status(403).json({ message: 'Access denied' })
    }
    
    // Check if order can be cancelled
    const nonCancellableStatuses = ['On The Way', 'Delivered', 'Picked Up', 'Cancelled']
    if (nonCancellableStatuses.includes(order.status)) {
      return res.status(400).json({ message: 'Order cannot be cancelled at this stage' })
    }
    
    const itemIndex = parseInt(req.params.itemIndex)
    if (itemIndex < 0 || itemIndex >= order.items.length) {
      return res.status(400).json({ message: 'Invalid item index' })
    }
    
    const item = order.items[itemIndex]
    if (item.status === 'cancelled') {
      return res.status(400).json({ message: 'Item already cancelled' })
    }
    
    // Restore stock for this item
    const product = await Product.findById(item.productId)
    if (product) {
      product.stock += item.quantity
      product.sold -= item.quantity
      await product.save()
    }
    
    // Mark item as cancelled
    item.status = 'cancelled'
    item.cancelledAt = new Date()
    item.cancellationReason = reason || 'Buyer request'
    
    // Recalculate order total
    const activeItems = order.items.filter(i => i.status === 'active')
    const newTotal = activeItems.reduce((sum, i) => sum + (i.price * i.quantity), 0)
    order.total = newTotal
    
    // Check if all items are cancelled
    const hasActiveItems = order.items.some(i => i.status === 'active')
    if (!hasActiveItems) {
      order.status = 'Cancelled'
    }
    
    await order.save()
    
    // Create notifications
    const user = await User.findById(req.userId)
    const adminUsers = await User.find({ role: 'admin' })
    
    // Notification for buyer
    const refundAmount = item.price * item.quantity
    const paymentMessage = order.paymentMethod === 'ewallet' 
      ? `₱${refundAmount.toLocaleString()} will be refunded to your e-wallet`
      : `₱${refundAmount.toLocaleString()} will be deducted from your total payment`
    
    await Notification.create({
      user: req.userId,
      type: order.paymentMethod === 'ewallet' ? 'payment_refund' : 'payment_deduction',
      title: 'Item Cancelled',
      message: `${item.name} (${item.size}) has been cancelled. ${paymentMessage}`,
      orderId: order._id,
      itemDetails: {
        productName: item.name,
        quantity: item.quantity,
        price: item.price,
        size: item.size
      },
      metadata: {
        refundAmount,
        paymentMethod: order.paymentMethod,
        cancellationReason: reason || 'Buyer request'
      }
    })
    
    // Notifications for all admins
    for (const admin of adminUsers) {
      await Notification.create({
        user: admin._id,
        type: 'item_cancelled',
        title: 'Item Cancelled by Customer',
        message: `${user.name} cancelled ${item.name} (${item.size}) from order #${order._id.toString().slice(-8).toUpperCase()}`,
        orderId: order._id,
        itemDetails: {
          productName: item.name,
          quantity: item.quantity,
          price: item.price,
          size: item.size
        },
        metadata: {
          refundAmount,
          paymentMethod: order.paymentMethod,
          cancellationReason: reason || 'Buyer request'
        }
      })
    }
    
    res.json(order)
  } catch (error) {
    console.error('Cancel item error:', error)
    res.status(500).json({ message: 'Server error' })
  }
})

// Edit specific item in order (quantity or variant)
app.put('/api/orders/:id/items/:itemIndex/edit', requireAuth, async (req, res) => {
  try {
    const { quantity, variant } = req.body
    const order = await Order.findById(req.params.id)
    if (!order) {
      return res.status(404).json({ message: 'Order not found' })
    }
    
    if (order.user.toString() !== req.userId) {
      return res.status(403).json({ message: 'Not authorized' })
    }
    
    // Check if order can be edited
    const nonEditableStatuses = ['On The Way', 'Delivered', 'Picked Up', 'Cancelled']
    if (nonEditableStatuses.includes(order.status)) {
      return res.status(400).json({ message: 'Order cannot be edited in current status' })
    }
    
    const itemIndex = parseInt(req.params.itemIndex)
    if (itemIndex < 0 || itemIndex >= order.items.length) {
      return res.status(400).json({ message: 'Invalid item index' })
    }
    
    const item = order.items[itemIndex]
    if (item.status === 'cancelled') {
      return res.status(400).json({ message: 'Cannot edit cancelled item' })
    }
    
    const oldQuantity = item.quantity
    const oldPrice = item.price
    const oldTotal = oldPrice * oldQuantity
    
    // Handle quantity change
    if (quantity !== undefined) {
      if (quantity <= 0) {
        return res.status(400).json({ message: 'Quantity must be greater than 0' })
      }
      
      // Find the product to check stock
      let product = null
      if (item.productId && /^[0-9a-fA-F]{24}$/.test(item.productId)) {
        product = await Product.findById(item.productId)
      }
      
      if (!product) {
        product = await Product.findOne({ 
          name: item.name, 
          size: item.size 
        })
      }
      
      if (product) {
        const quantityDifference = quantity - oldQuantity
        if (quantityDifference > 0) {
          // Increasing quantity - check if enough stock
          if (product.stock < quantityDifference) {
            return res.status(400).json({ message: `Only ${product.stock} items available in stock` })
          }
          await product.decreaseStock(quantityDifference)
        } else if (quantityDifference < 0) {
          // Decreasing quantity - restore stock
          await product.increaseStock(Math.abs(quantityDifference))
        }
      }
      
      item.quantity = quantity
    }
    
    // Handle variant change (optional)
    if (variant && variant.name && variant.size && variant.price) {
      const { name, size, price, productId } = variant
      
      // Find the new product variant
      let newProduct = null
      if (productId && /^[0-9a-fA-F]{24}$/.test(productId)) {
        newProduct = await Product.findById(productId)
      }
      
      if (!newProduct) {
        newProduct = await Product.findOne({ name, size })
      }
      
      if (!newProduct) {
        return res.status(400).json({ message: 'Product variant not found' })
      }
      
      if (newProduct.stock < item.quantity) {
        return res.status(400).json({ message: `Only ${newProduct.stock} items available in stock` })
      }
      
      // Restore stock for old variant
      if (product) {
        await product.increaseStock(oldQuantity)
      }
      
      // Decrease stock for new variant
      await newProduct.decreaseStock(item.quantity)
      
      // Update item details
      item.name = name
      item.size = size
      item.price = price
      item.productId = newProduct._id.toString()
    }
    
    // Recalculate order total
    const activeItems = order.items.filter(i => i.status === 'active')
    const newTotal = activeItems.reduce((sum, i) => sum + (i.price * i.quantity), 0)
    order.total = newTotal
    
    await order.save()
    
    // Create notifications
    const user = await User.findById(req.userId)
    const adminUsers = await User.find({ role: 'admin' })
    
    const newItemTotal = item.price * item.quantity
    const priceDifference = newItemTotal - oldTotal
    
    // Notification for buyer
    const priceChangeMessage = priceDifference > 0 
      ? `Additional ₱${priceDifference.toLocaleString()} will be charged`
      : priceDifference < 0 
      ? `₱${Math.abs(priceDifference).toLocaleString()} will be refunded`
      : 'No price change'
    
    await Notification.create({
      user: req.userId,
      type: 'order_updated',
      title: 'Order Item Updated',
      message: `${item.name} (${item.size}) has been updated. ${priceChangeMessage}`,
      orderId: order._id,
      itemDetails: {
        productName: item.name,
        quantity: item.quantity,
        price: item.price,
        size: item.size
      },
      metadata: {
        priceDifference,
        oldQuantity,
        newQuantity: item.quantity,
        paymentMethod: order.paymentMethod
      }
    })
    
    // Notifications for all admins
    for (const admin of adminUsers) {
      await Notification.create({
        user: admin._id,
        type: 'admin_alert',
        title: 'Order Item Updated by Customer',
        message: `${user.name} updated ${item.name} (${item.size}) in order #${order._id.toString().slice(-8).toUpperCase()}`,
        orderId: order._id,
        itemDetails: {
          productName: item.name,
          quantity: item.quantity,
          price: item.price,
          size: item.size
        },
        metadata: {
          priceDifference,
          oldQuantity,
          newQuantity: item.quantity,
          paymentMethod: order.paymentMethod
        }
      })
    }
    
    res.json(order)
  } catch (error) {
    console.error('Edit item error:', error)
    res.status(500).json({ message: 'Server error' })
  }
})

// Get notifications for user
app.get('/api/notifications', requireAuth, async (req, res) => {
  try {
    const { unreadOnly } = req.query
    let query = { user: req.userId }
    
    if (unreadOnly === 'true') {
      query.isRead = false
    }
    
    const notifications = await Notification.find(query)
      .populate('orderId', 'status total')
      .sort({ createdAt: -1 })
      .limit(50)
    
    res.json(notifications)
  } catch (error) {
    console.error('Get notifications error:', error)
    res.status(500).json({ message: 'Server error' })
  }
})

// Mark notification as read
app.put('/api/notifications/:id/read', requireAuth, async (req, res) => {
  try {
    const notification = await Notification.findOneAndUpdate(
      { _id: req.params.id, user: req.userId },
      { isRead: true },
      { new: true }
    )
    
    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' })
    }
    
    res.json(notification)
  } catch (error) {
    console.error('Mark notification read error:', error)
    res.status(500).json({ message: 'Server error' })
  }
})

// Mark all notifications as read
app.put('/api/notifications/read-all', requireAuth, async (req, res) => {
  try {
    await Notification.updateMany(
      { user: req.userId, isRead: false },
      { isRead: true }
    )
    
    res.json({ message: 'All notifications marked as read' })
  } catch (error) {
    console.error('Mark all notifications read error:', error)
    res.status(500).json({ message: 'Server error' })
  }
})

app.get('/api/admin/users', async (req, res) => {
  try {
    const users = await User.find().select('-password')
    res.json(users)
  } catch (error) {
    console.error('Get users error:', error)
    res.status(500).json({ message: 'Server error' })
  }
})

// Product endpoints
app.get('/api/products', async (req, res) => {
  try {
    const products = await Product.find({ isActive: true })
    res.json(products)
  } catch (error) {
    console.error('Get products error:', error)
    res.status(500).json({ message: 'Server error' })
  }
})

app.get('/api/products/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
    if (!product) return res.status(404).json({ message: 'Product not found' })
    res.json(product)
  } catch (error) {
    console.error('Get product error:', error)
    res.status(500).json({ message: 'Server error' })
  }
})

// Admin product management endpoints
app.get('/api/admin/products', requireAuth, async (req, res) => {
  try {
    const user = await User.findById(req.userId)
    if (!user || user.role !== 'admin') {
      return res.status(403).json({ message: 'Admin access required' })
    }
    
    const products = await Product.find().sort({ category: 1, name: 1 })
    res.json(products)
  } catch (error) {
    console.error('Get admin products error:', error)
    res.status(500).json({ message: 'Server error' })
  }
})

app.post('/api/admin/products', requireAuth, async (req, res) => {
  try {
    const user = await User.findById(req.userId)
    if (!user || user.role !== 'admin') {
      return res.status(403).json({ message: 'Admin access required' })
    }

    const { name, size, price, stock, sold, description, image, category } = req.body
    
    if (!name || !size || !price || !description || !category) {
      return res.status(400).json({ message: 'Missing required fields' })
    }

    const product = new Product({
      name,
      size,
      price,
      stock: stock || 0,
      sold: sold || 0,
      description,
      image: image || '',
      category
    })

    await product.save()
    res.status(201).json(product)
  } catch (error) {
    console.error('Create product error:', error)
    res.status(500).json({ message: 'Server error' })
  }
})

app.put('/api/admin/products/:id', requireAuth, async (req, res) => {
  try {
    const user = await User.findById(req.userId)
    if (!user || user.role !== 'admin') {
      return res.status(403).json({ message: 'Admin access required' })
    }

    const { name, size, price, stock, sold, description, image, category, isActive } = req.body
    
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { name, size, price, stock, sold, description, image, category, isActive },
      { new: true, runValidators: true }
    )

    if (!product) {
      return res.status(404).json({ message: 'Product not found' })
    }

    res.json(product)
  } catch (error) {
    console.error('Update product error:', error)
    res.status(500).json({ message: 'Server error' })
  }
})

app.delete('/api/admin/products/:id', requireAuth, async (req, res) => {
  try {
    const user = await User.findById(req.userId)
    if (!user || user.role !== 'admin') {
      return res.status(403).json({ message: 'Admin access required' })
    }

    const product = await Product.findByIdAndDelete(req.params.id)
    if (!product) {
      return res.status(404).json({ message: 'Product not found' })
    }

    res.json({ message: 'Product deleted successfully' })
  } catch (error) {
    console.error('Delete product error:', error)
    res.status(500).json({ message: 'Server error' })
  }
})

// Cart endpoints
app.get('/api/cart', requireAuth, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('cart')
    if (!user) return res.status(404).json({ message: 'User not found' })
    res.json(user.cart || [])
  } catch (error) {
    console.error('Get cart error:', error)
    res.status(500).json({ message: 'Server error' })
  }
})

app.put('/api/cart', requireAuth, async (req, res) => {
  try {
    const { items } = req.body || {}
    if (!Array.isArray(items)) {
      return res.status(400).json({ message: 'Invalid cart format' })
    }
    const user = await User.findByIdAndUpdate(
      req.userId,
      { $set: { cart: items } },
      { new: true }
    ).select('cart')
    res.json(user.cart || [])
  } catch (error) {
    console.error('Save cart error:', error)
    res.status(500).json({ message: 'Server error' })
  }
})

const PORT = process.env.PORT || 5177
app.listen(PORT, () => console.log(`Mock API listening on http://localhost:${PORT}`))




