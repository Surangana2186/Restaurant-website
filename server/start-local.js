const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Use local MongoDB for now
mongoose.connect('mongodb://localhost:27017/restaurant_db', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('✅ Connected to Local MongoDB');
  console.log('📊 Database: restaurant_db');
})
.catch((err) => {
  console.error('❌ MongoDB connection error:', err);
  console.log('🔄 Using in-memory data');
});

// Import Models
const User = require('./models/User');
const Reservation = require('./models/Reservation');
const Order = require('./models/Order');

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.get('/', (req, res) => {
  res.send('Restaurant API Server is running with Local MongoDB');
});

// Import all routes
const authRoutes = require('./routes/auth');
const reservationRoutes = require('./routes/reservations');
const menuRoutes = require('./routes/menu');
const contactRoutes = require('./routes/contact');
const adminRoutes = require('./routes/admin');

// Use routes
app.use('/api/auth', authRoutes);
app.use('/api/reservations', reservationRoutes);
app.use('/api/menu', menuRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/admin', adminRoutes);

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log('📱 Frontend: http://localhost:3000');
  console.log('🗄️  Database: Local MongoDB');
});
