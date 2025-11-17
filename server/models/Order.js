import mongoose from 'mongoose'

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  items: [{
    productId: {
      type: String,
      required: true
    },
    name: {
      type: String,
      required: true
    },
    price: {
      type: Number,
      required: true
    },
    quantity: {
      type: Number,
      required: true,
      min: 1
    },
    size: String,
    status: {
      type: String,
      enum: ['active', 'cancelled'],
      default: 'active'
    },
    cancelledAt: {
      type: Date,
      default: null
    },
    cancellationReason: {
      type: String,
      default: ''
    }
  }],
  total: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: [
      'Order Placed',
      'Preparing for Shipping', 
      'On The Way',
      'Delivered',
      'Being Packed',
      'Ready for Pickup',
      'Picked Up',
      'Cancelled'
    ],
    default: 'Order Placed'
  },
  paymentMethod: {
    type: String,
    enum: ['cod', 'ewallet', 'card'],
    required: true
  },
  shippingMethod: {
    type: String,
    enum: ['pickup', 'delivery'],
    required: true
  },
  courier: String,
  address: {
    fullName: String,
    phone: String,
    street: String,
    city: String,
    province: String,
    postal: String
  }
}, {
  timestamps: true
})

export default mongoose.model('Order', orderSchema)
