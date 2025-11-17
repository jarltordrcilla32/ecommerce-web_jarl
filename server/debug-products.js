import mongoose from 'mongoose'
import dotenv from 'dotenv'
import Product from './models/Product.js'

dotenv.config()

async function debugProducts() {
  try {
    console.log('Connecting to MongoDB...')
    await mongoose.connect(process.env.MONGO_URI)
    console.log('✅ Connected to MongoDB')

    // Get all products
    const products = await Product.find()
    console.log(`\n📦 Found ${products.length} products in database:`)
    
    products.forEach((product, index) => {
      console.log(`${index + 1}. ${product.name}`)
      console.log(`   - ID: ${product._id}`)
      console.log(`   - Size: ${product.size}`)
      console.log(`   - Price: ₱${product.price}`)
      console.log(`   - Stock: ${product.stock}`)
      console.log(`   - Sold: ${product.sold}`)
      console.log(`   - Category: ${product.category}`)
      console.log(`   - Active: ${product.isActive}`)
      console.log('')
    })

    // Test the admin API endpoint
    console.log('🔍 Testing admin API endpoint...')
    const adminProducts = await Product.find().sort({ category: 1, name: 1 })
    console.log(`Admin API would return ${adminProducts.length} products`)
    
    // Check for any issues
    const issues = []
    products.forEach(p => {
      if (!p.name) issues.push(`${p._id}: Missing name`)
      if (!p.size) issues.push(`${p._id}: Missing size`)
      if (typeof p.price !== 'number') issues.push(`${p._id}: Invalid price (${p.price})`)
      if (typeof p.stock !== 'number') issues.push(`${p._id}: Invalid stock (${p.stock})`)
      if (typeof p.sold !== 'number') issues.push(`${p._id}: Invalid sold (${p.sold})`)
    })
    
    if (issues.length > 0) {
      console.log('❌ Issues found:')
      issues.forEach(issue => console.log(`   - ${issue}`))
    } else {
      console.log('✅ All product data looks valid')
    }

  } catch (error) {
    console.error('❌ Error debugging products:', error.message)
  } finally {
    await mongoose.disconnect()
    console.log('✅ Disconnected from MongoDB')
  }
}

debugProducts()
