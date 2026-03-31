const express = require('express');
const router = express.Router();
const Reservation = require('../models/Reservation');
const User = require('../models/User');
const Order = require('../models/Order');
const MenuItem = require('../models/MenuItem');
const { sendReservationConfirmation, sendReservationCancellation } = require('../services/emailService');
const { uploadMenuImage, getImageUrl, deleteImage } = require('../utils/fileUpload');

// Get real dashboard stats
router.get('/stats', async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalOrders = await Order.countDocuments();
    const totalReservations = await Reservation.countDocuments();
    const totalMenuItems = await MenuItem.countDocuments();

    res.json({
      success: true,
      stats: {
        totalUsers,
        totalOrders,
        totalReservations,
        totalMenuItems
      }
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching stats'
    });
  }
});

// Get real users
router.get('/users', async (req, res) => {
  try {
    const users = await User.find({}).select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching users'
    });
  }
});

// Get menu items for admin
router.get('/menu', async (req, res) => {
  try {
    const menuItems = await MenuItem.find({}).sort({ createdAt: -1 });
    res.json({
      success: true,
      menuItems
    });
  } catch (error) {
    console.error('Error fetching menu items:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching menu items'
    });
  }
});

// Add menu item (Admin only)
router.post('/menu', uploadMenuImage, async (req, res) => {
  try {
    const menuItemData = JSON.parse(req.body.data); // Parse JSON data from form
    
    // Add image URL if file was uploaded
    if (req.file) {
      menuItemData.image = getImageUrl(req.file.filename);
    }
    
    // Validate required fields
    const requiredFields = ['name', 'category', 'price', 'description'];
    const missingFields = requiredFields.filter(field => !menuItemData[field]);
    
    if (missingFields.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Missing required fields: ${missingFields.join(', ')}`
      });
    }
    
    const menuItem = new MenuItem(menuItemData);
    await menuItem.save();
    
    res.status(201).json({
      success: true,
      message: 'Menu item added successfully',
      menuItem
    });
  } catch (error) {
    console.error('Error adding menu item:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add menu item',
      error: error.message
    });
  }
});

// Update menu item (Admin only)
router.put('/menu/:id', uploadMenuImage, async (req, res) => {
  try {
    const menuItemData = JSON.parse(req.body.data); // Parse JSON data from form
    
    // Add image URL if file was uploaded
    if (req.file) {
      menuItemData.image = getImageUrl(req.file.filename);
      
      // Delete old image if it exists
      const oldMenuItem = await MenuItem.findById(req.params.id);
      if (oldMenuItem && oldMenuItem.image && oldMenuItem.image.includes('/uploads/')) {
        const oldFilename = oldMenuItem.image.split('/').pop();
        deleteImage(oldFilename);
      }
    }
    
    const menuItem = await MenuItem.findByIdAndUpdate(
      req.params.id,
      menuItemData,
      { new: true, runValidators: true }
    );
    
    if (!menuItem) {
      return res.status(404).json({
        success: false,
        message: 'Menu item not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Menu item updated successfully',
      menuItem
    });
  } catch (error) {
    console.error('Error updating menu item:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update menu item',
      error: error.message
    });
  }
});

// Delete menu item (Admin only)
router.delete('/menu/:id', async (req, res) => {
  try {
    const menuItem = await MenuItem.findByIdAndDelete(req.params.id);
    
    if (!menuItem) {
      return res.status(404).json({
        success: false,
        message: 'Menu item not found'
      });
    }
    
    // Delete associated image if it exists
    if (menuItem.image && menuItem.image.includes('/uploads/')) {
      const filename = menuItem.image.split('/').pop();
      deleteImage(filename);
    }
    
    res.json({
      success: true,
      message: 'Menu item deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting menu item:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete menu item'
    });
  }
});

// Get all orders
router.get('/orders', async (req, res) => {
  try {
    const orders = await Order.find({}).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching orders'
    });
  }
});

// Update order status
router.put('/orders/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    const order = await Order.findByIdAndUpdate(
      id, 
      { status }, 
      { new: true }
    );
    
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Order status updated successfully',
      order
    });
  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update order status'
    });
  }
});

// Get reservations
router.get('/reservations', async (req, res) => {
  try {
    const reservations = await Reservation.find({}).sort({ createdAt: -1 });
    res.json(reservations);
  } catch (error) {
    console.error('Error fetching reservations:', error);
    res.status(500).json({ message: 'Error fetching reservations' });
  }
});

// Update reservation status
router.put('/reservations/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    console.log(`Updating reservation ${id} status to:`, status);

    // Validate status first
    const validStatuses = ['pending', 'confirmed', 'cancelled', 'completed'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ 
        message: 'Invalid status. Must be: pending, confirmed, cancelled, or completed' 
      });
    }

    // Find and update reservation
    const reservation = await Reservation.findByIdAndUpdate(
      id, 
      { status, updatedAt: new Date() }, 
      { new: true, runValidators: true }
    );

    if (!reservation) {
      return res.status(404).json({ message: 'Reservation not found' });
    }

    console.log(`✅ Successfully updated reservation ${id} status to:`, status);

    // Send confirmation email when status changes to 'confirmed'
    if (status === 'confirmed') {
      const emailSent = await sendReservationConfirmation(reservation);
      if (emailSent) {
        console.log('✅ Confirmation email sent successfully');
      } else {
        console.log('⚠️ Failed to send confirmation email');
      }
    }

    res.json({ 
      message: 'Reservation status updated successfully', 
      reservation: {
        ...reservation.toObject(),
        status
      }
    });
  } catch (error) {
    console.error('Error updating reservation status:', error);
    res.status(500).json({ 
      message: 'Failed to update reservation status',
      error: error.message 
    });
  }
});

module.exports = router;
