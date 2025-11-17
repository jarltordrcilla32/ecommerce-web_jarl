import mongoose from 'mongoose'
import dotenv from 'dotenv'
import Product from './models/Product.js'
import User from './models/User.js'

dotenv.config()

async function testAdminProducts() {
  try {
    console.log('Connecting to MongoDB...')
    await mongoose.connect(process.env.MONGO_URI)
    console.log('✅ Connected to MongoDB')

    // Get admin user
    const admin = await User.findOne({ email: 'admin@ecommerce.com' })
    if (!admin) {
      console.log('❌ Admin user not found')
      return
    }
    console.log('✅ Admin user found:', admin.email)

    // Test the same query as the API endpoint
    const products = await Product.find().sort({ category: 1, name: 1 })
    console.log(`\n📦 Found ${products.length} products:`)
    
    products.forEach((product, index) => {
      console.log(`${index + 1}. ${product.name} (${product.size}) - ₱${product.price} - Stock: ${product.stock} - Sold: ${product.sold}`)
    })

    // Test JSON serialization
    const jsonProducts = JSON.stringify(products, null, 2)
    console.log('\n📄 JSON output (first 500 chars):')
    console.log(jsonProducts.substring(0, 500) + '...')

  } catch (error) {
    console.error('❌ Error testing admin products:', error.message)
  } finally {
    await mongoose.disconnect()
    console.log('✅ Disconnected from MongoDB')
  }
}

testAdminProducts()
