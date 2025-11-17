# GreenConnect E-commerce App

A sustainable e-commerce platform that transforms food waste into valuable products like soil conditioner and responsibly raised hogs.

## Features

- **User Authentication**: Register and login with JWT tokens
- **Product Catalog**: Browse soil conditioner and hog products
- **Shopping Cart**: Add items and manage quantities
- **Checkout System**: Complete orders with multiple payment methods
- **Admin Dashboard**: Manage orders and users
- **MongoDB Integration**: Persistent data storage

## Tech Stack

### Frontend
- React 18
- React Router
- Tailwind CSS
- Vite

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT Authentication
- bcryptjs for password hashing

## Setup Instructions

### Prerequisites
- Node.js (v16 or higher)
- MongoDB Atlas account
- Git

### 1. Clone the Repository
```bash
git clone <repository-url>
cd ecommerce-web
```

### 2. Install Dependencies

#### Backend
```bash
cd server
npm install
```

#### Frontend
```bash
cd client
npm install
```

### 3. Environment Configuration

1. Create a `.env` file in the `server` directory:
```bash
cd server
cp .env.example .env
```

2. Update the `.env` file with your MongoDB Atlas connection string:
```
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/ecommerce?retryWrites=true&w=majority
JWT_SECRET=your-super-secret-jwt-key-here
PORT=5177
```

### 4. Test MongoDB Connection
```bash
cd server
node test-connection.js
```

### 5. Start the Application

#### Start Backend Server
```bash
cd server
npm run dev
```

#### Start Frontend Development Server
```bash
cd client
npm run dev
```

### 6. Access the Application
- Frontend: http://localhost:5173
- Backend API: http://localhost:5177

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/me` - Get current user profile

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get product by ID

### Orders
- `POST /api/checkout` - Create new order (requires auth)
- `GET /api/orders` - Get user orders (requires auth)

### Admin
- `GET /api/admin/orders` - Get all orders
- `GET /api/admin/users` - Get all users
- `GET /api/admin/products` - Get all products

## Database Schema

### User Model
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  role: String (customer/admin),
  orders: [ObjectId],
  createdAt: Date
}
```

### Order Model
```javascript
{
  user: ObjectId (ref: User),
  items: [{
    productId: String,
    name: String,
    price: Number,
    qty: Number,
    image: String,
    size: String
  }],
  total: Number,
  status: String,
  paymentMethod: String,
  shippingMethod: String,
  courier: String,
  address: Object,
  createdAt: Date
}
```

## Development

### Project Structure
```
ecommerce-web/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── pages/         # Page components
│   │   └── App.jsx        # Main app component
│   └── package.json
├── server/                # Node.js backend
│   ├── models/           # Mongoose models
│   ├── config/           # Database configuration
│   ├── index.js          # Express server
│   └── package.json
└── README.md
```

### Adding New Features
1. Create new components in `client/src/components/`
2. Add new pages in `client/src/pages/`
3. Create new API routes in `server/index.js`
4. Add new models in `server/models/`

## Troubleshooting

### Common Issues

1. **MongoDB Connection Failed**
   - Check your MongoDB Atlas connection string
   - Ensure your IP is whitelisted in MongoDB Atlas
   - Verify your username and password

2. **JWT Token Issues**
   - Check that JWT_SECRET is set in your .env file
   - Ensure tokens are being sent in Authorization header

3. **CORS Errors**
   - The server is configured to allow all origins in development
   - For production, update CORS settings

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.
