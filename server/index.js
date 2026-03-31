const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('✅ Connected to MongoDB Atlas');
  console.log('📊 Database: restaurant_db');
})
.catch((err) => {
  console.error('❌ MongoDB connection error:', err);
  console.log('🔄 Falling back to in-memory data');
});

// Import Models
const User = require('./models/User');
const Reservation = require('./models/Reservation');
const Order = require('./models/Order');

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files from uploads folder with CORS headers
app.use('/uploads', (req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
}, express.static(path.join(__dirname, 'uploads')));

// Routes
app.get('/', (req, res) => {
    res.send('Restaurant API Server is running');
});

// Test route for image serving
app.get('/test-image', (req, res) => {
    const fs = require('fs');
    const path = require('path');
    const imagePath = path.join(__dirname, 'uploads', 'menu-items', 'menu-item-1774883279456-797232171.webp');
    
    if (fs.existsSync(imagePath)) {
        res.sendFile(imagePath);
    } else {
        res.status(404).send('Image not found');
    }
});

// Auth Routes
try {
    app.use('/api/auth', require('./routes/auth'));
} catch (error) {
    console.log('Auth routes not available yet');
}

// Menu Routes
try {
    app.use('/api/menu', require('./routes/menu'));
} catch (error) {
    console.log('Menu routes not available yet');
}

// Admin Routes
try {
    app.use('/api/admin', require('./routes/admin'));
    console.log('✅ Admin routes loaded successfully');
} catch (error) {
    console.log('❌ Admin routes not available yet:', error.message);
}

// Reservations Routes
try {
    app.use('/api/reservations', require('./routes/reservations'));
} catch (error) {
    console.log('Reservations routes not available yet');
}

// Orders Routes
try {
    app.use('/api/orders', require('./routes/orders'));
} catch (error) {
    console.log('Orders routes not available yet');
}

// Contact Routes
try {
    app.use('/api/contact', require('./routes/contact'));
    console.log('✅ Contact routes loaded successfully');
} catch (error) {
    console.log('Contact routes not available yet');
}

// Payments Routes
try {
    app.use('/api/payments', require('./routes/payments'));
} catch (error) {
    console.log('Payments routes not available yet');
}

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
