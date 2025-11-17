import mongoose from 'mongoose'
import dotenv from 'dotenv'
import Product from './models/Product.js'

dotenv.config()

async function createProducts() {
  try {
    console.log('Connecting to MongoDB...')
    await mongoose.connect(process.env.MONGO_URI)
    console.log('✅ Connected to MongoDB')

    // Clear existing products
    await Product.deleteMany({})
    console.log('🗑️ Cleared existing products')

    // Create sample products
    const products = [
      {
        name: 'Soil Conditioner - Pouch',
        size: '1kg',
        price: 25,
        stock: 120,
        sold: 320,
        description: 'Perfect for small gardens and potted plants',
        image: '/src/assets/images/soil conditioner.png',
        category: 'soil'
      },
      {
        name: 'Soil Conditioner - Pack',
        size: '5kg',
        price: 100,
        stock: 45,
        sold: 180,
        description: 'Ideal for medium-sized gardens and landscaping',
        image: '/src/assets/images/soil conditioner.png',
        category: 'soil'
      },
      {
        name: 'Soil Conditioner - Sack',
        size: '25kg',
        price: 500,
        stock: 18,
        sold: 92,
        description: 'Best value for commercial farming and large projects',
        image: '/src/assets/images/soil conditioner.png',
        category: 'soil'
      },
      {
        name: 'Hogs Swill',
        size: '25-30kg',
        price: 400,
        stock: 60,
        sold: 140,
        description: 'Premium feed for sustainably raised hogs',
        image: '/src/assets/images/hog swill.png',
        category: 'hogs'
      }
    ]

    // Insert products
    const createdProducts = await Product.insertMany(products)
    console.log(`✅ Created ${createdProducts.length} products successfully!`)

    // Display created products
    console.log('\n📦 Created Products:')
    createdProducts.forEach((product, index) => {
      console.log(`${index + 1}. ${product.name} (${product.size}) - ₱${product.price} - Stock: ${product.stock} - Sold: ${product.sold}`)
    })

    // Calculate totals
    const totalStock = createdProducts.reduce((sum, p) => sum + p.stock, 0)
    const totalSold = createdProducts.reduce((sum, p) => sum + p.sold, 0)
    const totalValue = createdProducts.reduce((sum, p) => sum + (p.stock * p.price), 0)

    console.log('\n📊 Summary:')
    console.log(`Total Stock: ${totalStock} units`)
    console.log(`Total Sold: ${totalSold} units`)
    console.log(`Total Inventory Value: ₱${totalValue.toLocaleString()}`)

  } catch (error) {
    console.error('❌ Error creating products:', error.message)
  } finally {
    await mongoose.disconnect()
    console.log('✅ Disconnected from MongoDB')
  }
}

createProducts()
