const express = require('express');
const serverless = require('serverless-http');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');

// Import your existing routes
const authRoutes = require('../routes/auth');
const menuRoutes = require('../routes/menu');
const contactRoutes = require('../routes/contact');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/menu', menuRoutes);
app.use('/api/contact', contactRoutes);

// MongoDB connection (use environment variable)
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/restaurant');

module.exports.handler = serverless(app);
