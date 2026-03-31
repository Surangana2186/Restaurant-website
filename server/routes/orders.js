const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const User = require('../models/User');
const { sendOrderConfirmation, sendOrderStatusNotification } = require('../services/emailService');

// Create COD order (for payment page)
router.post('/cod', async (req, res) => {
  try {
    const { customer_info, order_details, payment_method } = req.body;

    console.log('COD Order Request:', { customer_info, order_details, payment_method });

    // Validate required fields
    if (!customer_info.name || !customer_info.email || !order_details.items || order_details.items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields'
      });
    }

    // Find or create user
    let user = await User.findOne({ email: customer_info.email });
    
    if (!user) {
      // Create a user for COD orders
      user = new User({
        name: customer_info.name,
        email: customer_info.email,
        password: 'temp123', // Temporary password
        phone: customer_info.phone || '0000000000',
        role: 'user'
      });
      
      await user.save();
      console.log('Created new user for COD order:', user.email);
    }

    // Create COD order
    const order = new Order({
      user: user._id,
      items: order_details.items,
      totalAmount: order_details.total,
      status: 'confirmed', // COD orders are confirmed immediately
      paymentStatus: 'pending', // Payment pending (cash on delivery)
      paymentMethod: payment_method || 'cod',
      customerInfo: {
        name: customer_info.name,
        email: customer_info.email,
        phone: customer_info.phone || '0000000000'
      },
      orderType: 'delivery'
    });

    await order.save();
    console.log('COD Order created:', order._id);

    // Send order confirmation email
    try {
      await sendOrderConfirmation(order);
      console.log('Order confirmation email sent');
    } catch (emailError) {
      console.error('Failed to send order confirmation email:', emailError);
    }

    res.status(201).json({
      success: true,
      message: 'COD order created successfully',
      order: order
    });

  } catch (error) {
    console.error('Error creating COD order:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating COD order',
      error: error.message
    });
  }
});

// Create new order (for COD orders)
router.post('/create', async (req, res) => {
  try {
    const { tableNumber, customerName, customerEmail, items, subtotal, serviceCharge, tax, totalAmount, paymentMethod, paymentStatus } = req.body;

    // Validate required fields
    if (!tableNumber || !customerName || !customerEmail || !items || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields'
      });
    }

    // Find or create user with actual email
    let user = await User.findOne({ email: customerEmail });
    
    if (!user) {
      // Create a user for COD orders with actual email
      user = new User({
        name: customerName,
        email: customerEmail,
        password: 'temp123', // Temporary password for COD customers
        phone: '0000000000', // Default phone
        isTempUser: true
      });
      
      await user.save();
    }

    // Create order
    const order = new Order({
      user: user._id,
      items: items,
      totalAmount: totalAmount,
      status: 'pending',
      paymentStatus: paymentStatus,
      paymentMethod: paymentMethod,
      customerInfo: {
        name: customerName,
        email: user.email,
        phone: user.phone || '0000000000',
        tableNumber: tableNumber
      },
      orderType: 'table_delivery'
    });

    await order.save();
    console.log('Order created:', order);

    // Send order confirmation email
    try {
      await sendOrderConfirmation(order, user);
    } catch (emailError) {
      console.error('Failed to send order confirmation email:', emailError);
    }

    res.json({
      success: true,
      message: 'Order placed successfully',
      order: {
        id: order._id,
        orderNumber: order._id.toString().slice(-6),
        status: order.status,
        totalAmount: order.totalAmount
      }
    });

  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create order'
    });
  }
});

// Get user's orders
router.get('/user/:email', async (req, res) => {
  try {
    const { email } = req.params;
    
    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Get user's orders
    const orders = await Order.find({ user: user._id })
      .sort({ createdAt: -1 })
      .limit(50); // Limit to last 50 orders

    res.json({
      success: true,
      orders: orders,
      count: orders.length
    });

  } catch (error) {
    console.error('Error fetching user orders:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch orders'
    });
  }
});

// Update order status (for admin)
router.put('/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // Get the order before updating to check previous status
    const oldOrder = await Order.findById(id);
    if (!oldOrder) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    const order = await Order.findByIdAndUpdate(
      id,
      { status, updatedAt: new Date() },
      { new: true }
    );

    console.log('Order status updated:', order);

    // Send email notification for confirmed or cancelled orders
    if (status === 'confirmed' || status === 'cancelled') {
      try {
        await sendOrderStatusNotification(order, status);
        console.log(`Email sent for order ${id} - status: ${status}`);
      } catch (emailError) {
        console.error('Failed to send email notification:', emailError);
        // Don't fail the request if email fails
      }
    }

    res.json({
      success: true,
      message: 'Order status updated successfully',
      order: order
    });

  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update order status'
    });
  }
});

// Get all orders (for admin)
router.get('/all', async (req, res) => {
  try {
    const orders = await Order.find({})
      .sort({ createdAt: -1 })
      .limit(100);

    res.json({
      success: true,
      orders: orders,
      count: orders.length
    });

  } catch (error) {
    console.error('Error fetching all orders:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch orders'
    });
  }
});

// Get single order details
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const order = await Order.findById(id);
    
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    res.json({
      success: true,
      order: order
    });

  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch order'
    });
  }
});

// Delete order
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const order = await Order.findByIdAndDelete(id);
    
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    console.log('Order deleted:', order._id);

    res.json({
      success: true,
      message: 'Order deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting order:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete order'
    });
  }
});

module.exports = router;
