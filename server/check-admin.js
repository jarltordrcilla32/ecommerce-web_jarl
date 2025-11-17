import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'
import dotenv from 'dotenv'
import User from './models/User.js'

dotenv.config()

async function checkAdmin() {
  try {
    console.log('Connecting to MongoDB...')
    await mongoose.connect(process.env.MONGO_URI)
    console.log('✅ Connected to MongoDB')

    // Find admin user
    const admin = await User.findOne({ email: 'admin@ecommerce.com' })
    if (!admin) {
      console.log('❌ Admin user not found!')
      return
    }

    console.log('✅ Admin user found!')
    console.log('Admin details:', {
      name: admin.name,
      email: admin.email,
      role: admin.role,
      hasPassword: !!admin.password,
      passwordLength: admin.password?.length
    })

    // Test password comparison
    const testPassword = 'admin123'
    const isMatch = await admin.comparePassword(testPassword)
    console.log(`Password test with '${testPassword}':`, isMatch ? '✅ MATCH' : '❌ NO MATCH')

    // Test with different passwords
    const wrongPasswords = ['admin', 'admin1234', 'Admin123', 'ADMIN123']
    for (const wrongPass of wrongPasswords) {
      const isMatch = await admin.comparePassword(wrongPass)
      console.log(`Password test with '${wrongPass}':`, isMatch ? '✅ MATCH' : '❌ NO MATCH')
    }

  } catch (error) {
    console.error('❌ Error checking admin:', error.message)
  } finally {
    await mongoose.disconnect()
    console.log('✅ Disconnected from MongoDB')
  }
}

checkAdmin()
