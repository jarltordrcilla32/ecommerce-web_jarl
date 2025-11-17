import mongoose from 'mongoose'
import dotenv from 'dotenv'
import User from './models/User.js'

dotenv.config()

// Usage: node create-admin.js [email] [name] [password]
// Examples:
// node create-admin.js                                    # Creates admin@ecommerce.com
// node create-admin.js admin2@company.com                 # Creates admin2@company.com
// node create-admin.js superadmin@company.com "Super Admin" "securepass123"

async function createAdmin() {
  try {
    // Get email from command line argument or use default
    const email = process.argv[2] || 'jarl@ecommerce.com'
    const name = process.argv[3] || 'Jarl Tordecilla'
    const password = process.argv[4] || '090909asd0'
    
    console.log('Connecting to MongoDB...')
    await mongoose.connect(process.env.MONGO_URI)
    console.log('✅ Connected to MongoDB')

    // Check if email already exists in database
    const existingUser = await User.findOne({ email: email })
    if (existingUser) {
      console.log('❌ User with this email already exists!')
      console.log('Existing user details:', {
        name: existingUser.name,
        email: existingUser.email,
        role: existingUser.role
      })
      console.log('Please use a different email address or delete the existing user first.')
      return
    }

    // Create admin user
    const adminData = {
      name: name,
      email: email,
      password: password, // Let the User model's pre-save hook handle hashing
      role: 'admin'
    }

    const admin = new User(adminData)
    await admin.save() // The pre-save hook will hash the password automatically

    console.log('✅ Admin user created successfully!')
    console.log('Admin details:', {
      name: admin.name,
      email: admin.email,
      role: admin.role,
      password: password // Show the actual password used
    })
    console.log('\n🔑 Login credentials:')
    console.log('Email:', email)
    console.log('Password:', password)

  } catch (error) {
    console.error('❌ Error creating admin:', error.message)
  } finally {
    await mongoose.disconnect()
    console.log('✅ Disconnected from MongoDB')
  }
}

createAdmin()
