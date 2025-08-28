import express from 'express'
import cors from 'cors'
import { v4 as uuidv4 } from 'uuid'

const app = express()
app.use(cors())
app.use(express.json())

const products = [
  {
    id: 'soil',
    name: 'Soil Conditioner',
    price: 199,
    description: 'Upcycled from food waste via composting and curing to boost soil health.',
    sustainability: 'Diverts waste from landfill and enriches local farms and gardens.',
    image: ''
  },
  {
    id: 'hogs',
    name: 'Hogs',
    price: 5500,
    description: 'Raised on a controlled diet incorporating processed food waste, ensuring quality and affordability.',
    sustainability: 'Reduces feed costs and repurposes waste under safe, supervised practices.',
    image: ''
  }
]

const users = new Map() // email -> {id,email,password,orders:[]}
const sessions = new Map() // token -> userId
const orders = []

app.get('/api/health', (_req, res) => res.json({ ok: true }))
app.get('/api/products', (_req, res) => res.json(products))
app.get('/api/products/:id', (req, res) => {
  const p = products.find(x => x.id === req.params.id)
  if (!p) return res.status(404).json({ message: 'Not found' })
  res.json(p)
})

app.post('/api/auth/register', (req, res) => {
  const { email, password, name } = req.body || {}
  if (!email || !password) return res.status(400).json({ message: 'Email and password required' })
  if (users.has(email)) return res.status(409).json({ message: 'Email already registered' })
  const user = { id: uuidv4(), email, password, name: name || email.split('@')[0], orders: [] }
  users.set(email, user)
  const token = uuidv4()
  sessions.set(token, user.id)
  res.json({ token, user: { id: user.id, email: user.email, name: user.name } })
})

app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body || {}
  const user = users.get(email)
  if (!user || user.password !== password) return res.status(401).json({ message: 'Invalid credentials' })
  const token = uuidv4()
  sessions.set(token, user.id)
  res.json({ token, user: { id: user.id, email: user.email, name: user.name } })
})

function requireAuth(req, res, next) {
  const token = req.header('authorization')?.replace('Bearer ', '')
  const userId = token && sessions.get(token)
  if (!userId) return res.status(401).json({ message: 'Unauthorized' })
  req.userId = userId
  next()
}

app.post('/api/checkout', requireAuth, (req, res) => {
  const { items } = req.body || {}
  if (!Array.isArray(items) || items.length === 0) return res.status(400).json({ message: 'No items' })
  const total = items.reduce((sum, it) => {
    const p = products.find(x => x.id === it.productId)
    return sum + (p ? p.price * (it.quantity || 1) : 0)
  }, 0)
  const order = { id: uuidv4(), userId: req.userId, items, total, status: 'paid', createdAt: new Date().toISOString() }
  orders.push(order)
  const user = [...users.values()].find(u => u.id === req.userId)
  if (user) user.orders.push(order)
  res.json({ ok: true, order })
})

app.get('/api/me', requireAuth, (req, res) => {
  const user = [...users.values()].find(u => u.id === req.userId)
  res.json({ id: user.id, email: user.email, name: user.name, orders: user.orders })
})

// minimal admin
app.get('/api/admin/orders', (_req, res) => res.json(orders))
app.get('/api/admin/products', (_req, res) => res.json(products))

const PORT = process.env.PORT || 5177
app.listen(PORT, () => console.log(`Mock API listening on http://localhost:${PORT}`))




