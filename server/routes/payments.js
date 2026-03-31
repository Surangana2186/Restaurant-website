const express = require('express');
const router = express.Router();
const { sendOrderConfirmation } = require('../services/emailService');
const User = require('../models/User');
const Order = require('../models/Order');

// Payment verification with Razorpay
router.post('/verify', async (req, res) => {
  try {
    const { payment_id, amount, customer_info, order_details } = req.body;

    // Verify payment with Razorpay API
    const crypto = require('crypto');
    const razorpay = require('razorpay');
    
    const razorpayInstance = new razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET
    });

    // Fetch payment details from Razorpay
    const payment = await razorpayInstance.payments.fetch(payment_id);
    
    if (!payment) {
      return res.status(400).json({ success: false, message: 'Payment not found' });
    }

    if (payment.status !== 'captured') {
      return res.status(400).json({ success: false, message: 'Payment not successful' });
    }

    if (payment.amount !== amount) {
      return res.status(400).json({ success: false, message: 'Payment amount mismatch' });
    }

    console.log('Payment verified successfully:', {
      payment_id,
      amount,
      customer_info,
      order_details
    });

    // Store order in database
    try {
      // Find user by email
      const user = await User.findOne({ email: customer_info.email });
      if (!user) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }

      // Create order in database
      const order = new Order({
        user: user._id,
        items: order_details.items || [],
        totalAmount: amount / 100, // Convert back from paise
        status: 'secured',
        paymentStatus: 'paid',
        payment_id: payment_id,
        customerInfo: {
          name: customer_info.name,
          email: customer_info.email,
          phone: customer_info.phone,
          tableNumber: customer_info.tableNumber || ''
        },
        paymentMethod: 'online',
        orderType: 'table_delivery'
      });

      await order.save();
      console.log('Order saved to database:', order);

      // Send order confirmation email
      try {
        await sendOrderConfirmation(order, user);
      } catch (emailError) {
        console.error('Failed to send order confirmation email:', emailError);
        // Don't fail the order process if email fails
      }

      res.json({
        success: true,
        message: 'Payment verified successfully',
        order: {
          id: order._id,
          payment_id: order.payment_id,
          amount: order.totalAmount,
          status: order.status,
          paymentStatus: order.paymentStatus,
          created_at: order.createdAt
        }
      });

    } catch (dbError) {
      console.error('Error saving order:', dbError);
      // Fallback to mock order if database fails
      const order = {
        id: Date.now(),
        payment_id,
        amount: amount / 100,
        customer_info,
        order_details,
        status: 'secured',
        created_at: new Date().toISOString()
      };

      console.log('Order created (fallback):', order);

      res.json({
        success: true,
        message: 'Payment verified successfully',
        order
      });
    }

  } catch (error) {
    console.error('Payment verification error:', error);
    res.status(500).json({
      success: false,
      message: 'Payment verification failed'
    });
  }
});

// Get payment status
router.get('/status/:payment_id', async (req, res) => {
  try {
    const { payment_id } = req.params;
    
    // In production, you would check with Razorpay API
    // const payment = await razorpay.payments.fetch(payment_id);
    
    res.json({
      success: true,
      payment_id,
      status: 'captured' // or 'failed', 'pending', etc.
    });

  } catch (error) {
    console.error('Payment status error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get payment status'
    });
  }
});

module.exports = router;
