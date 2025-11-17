import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'
import dotenv from 'dotenv'
import User from './models/User.js'

dotenv.config()

async function fixAdmin() {
  try {
    console.log('Connecting to MongoDB...')
    await mongoose.connect(process.env.MONGO_URI)
    console.log('✅ Connected to MongoDB')

    // Delete existing admin if it exists
    await User.deleteOne({ email: 'admin@ecommerce.com' })
    console.log('🗑️ Deleted existing admin user')

    // Create new admin user using the same method as registration
    const adminData = {
      name: 'Admin User',
      email: 'admin@ecommerce.com',
      password: 'admin123',
      role: 'admin'
    }

    // Create user (password will be hashed by the pre-save hook)
    const admin = new User(adminData)
    await admin.save()

    console.log('✅ Admin user created successfully!')
    console.log('Admin details:', {
      name: admin.name,
      email: admin.email,
      role: admin.role
    })

    // Test password comparison
    const testPassword = 'admin123'
    const isMatch = await admin.comparePassword(testPassword)
    console.log(`Password test with '${testPassword}':`, isMatch ? '✅ MATCH' : '❌ NO MATCH')

    if (isMatch) {
      console.log('\n🔑 Login credentials:')
      console.log('Email: admin@ecommerce.com')
      console.log('Password: admin123')
    } else {
      console.log('❌ Password test failed - there might be an issue with the User model')
    }

  } catch (error) {
    console.error('❌ Error fixing admin:', error.message)
  } finally {
    await mongoose.disconnect()
    console.log('✅ Disconnected from MongoDB')
  }
}

fixAdmin()
