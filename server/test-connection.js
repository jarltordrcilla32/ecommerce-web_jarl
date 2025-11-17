import mongoose from 'mongoose'
import dotenv from 'dotenv'

dotenv.config()

async function testConnection() {
  try {
    console.log('Testing MongoDB connection...')
    console.log('MongoDB URI:', process.env.MONGO_URI ? 'Set' : 'Not set')
    
    if (!process.env.MONGO_URI) {
      console.error('❌ MONGO_URI not found in environment variables')
      return
    }
    
    const conn = await mongoose.connect(process.env.MONGO_URI)
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`)
    console.log(`✅ Database: ${conn.connection.name}`)
    
    // Test creating a sample user
    const User = mongoose.model('User', new mongoose.Schema({
      name: String,
      email: String,
      password: String,
      role: { type: String, default: 'customer' }
    }))
    
    const testUser = new User({
      name: 'Test User',
      email: 'test@example.com',
      password: 'testpassword',
      role: 'customer'
    })
    
    await testUser.save()
    console.log('✅ Test user created successfully')
    
    // Clean up test user
    await User.deleteOne({ email: 'test@example.com' })
    console.log('✅ Test user cleaned up')
    
    await mongoose.disconnect()
    console.log('✅ Connection closed')
    
  } catch (error) {
    console.error('❌ Connection failed:', error.message)
    process.exit(1)
  }
}

testConnection()
