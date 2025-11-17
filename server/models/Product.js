import mongoose from 'mongoose'

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  size: {
    type: String,
    required: true,
    trim: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  stock: {
    type: Number,
    required: true,
    min: 0,
    default: 0
  },
  sold: {
    type: Number,
    required: true,
    min: 0,
    default: 0
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  image: {
    type: String,
    default: ''
  },
  category: {
    type: String,
    required: true,
    enum: ['soil', 'hogs'],
    trim: true
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true // This adds createdAt and updatedAt fields
})

// Create compound index for efficient queries
productSchema.index({ category: 1, name: 1, size: 1 })

// Virtual for total value (stock * price)
productSchema.virtual('totalValue').get(function() {
  return this.stock * this.price
})

// Method to decrease stock when order is placed
productSchema.methods.decreaseStock = function(quantity) {
  if (this.stock >= quantity) {
    this.stock -= quantity
    this.sold += quantity
    return this.save()
  } else {
    throw new Error('Insufficient stock')
  }
}

// Method to increase stock (for admin management)
productSchema.methods.increaseStock = function(quantity) {
  this.stock += quantity
  return this.save()
}

// Remove __v from JSON output
productSchema.methods.toJSON = function() {
  const product = this.toObject()
  delete product.__v
  return product
}

const Product = mongoose.model('Product', productSchema)

export default Product
