import mongoose from 'mongoose'
import Product from './models/Product.js'
import dotenv from 'dotenv'

dotenv.config()

async function updateImages() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ecommerce')
    console.log('Connected to MongoDB')

    // Update soil conditioner images
    await Product.updateMany(
      { name: { $regex: 'Soil Conditioner' } },
      { $set: { image: '/src/assets/images/soil-conditioner.png' } }
    )
    
    // Update hogs swill images
    await Product.updateMany(
      { name: { $regex: 'Hogs Swill' } },
      { $set: { image: '/src/assets/images/hog-swill.png' } }
    )
    
    console.log('✅ Updated image paths')
    
    // Show updated products
    const products = await Product.find()
    console.log('\n📦 Updated Products:')
    products.forEach(p => {
      console.log(`${p.name} - ${p.size} - ${p.image}`)
    })
    
  } catch (error) {
    console.error('Error:', error)
  } finally {
    await mongoose.disconnect()
    console.log('✅ Disconnected from MongoDB')
  }
}

updateImages()

