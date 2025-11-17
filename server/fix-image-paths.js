import mongoose from 'mongoose'
import Product from './models/Product.js'
import dotenv from 'dotenv'

dotenv.config()

async function fixImagePaths() {
  try {
    const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URI
    if (!mongoUri) {
      console.error('Database connection error: missing MONGODB_URI (or MONGO_URI) in .env')
      process.exit(1)
    }

    const conn = await mongoose.connect(mongoUri)
    console.log(`MongoDB Connected: ${conn.connection.host}`)

    // Update soil conditioner images - use public folder path
    const soilResult = await Product.updateMany(
      { name: { $regex: 'Soil Conditioner' } },
      { $set: { image: '/images/soil-conditioner.png' } }
    )
    console.log(`✅ Updated ${soilResult.modifiedCount} soil conditioner products`)
    
    // Update hogs swill images - use public folder path
    const hogsResult = await Product.updateMany(
      { name: { $regex: 'Hogs Swill' } },
      { $set: { image: '/images/hog-swill.png' } }
    )
    console.log(`✅ Updated ${hogsResult.modifiedCount} hogs swill products`)
    
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

fixImagePaths()
