const mongoose = require('mongoose');
const Order = require('./models/Order');
require('dotenv').config();

async function checkOrders() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Get all orders
    const orders = await Order.find({});
    console.log(`📋 Found ${orders.length} orders in database:\n`);

    if (orders.length === 0) {
      console.log('❌ No orders found in database');
      console.log('🔍 This could be because:');
      console.log('   - No customers have placed orders yet');
      console.log('   - Orders are not being saved properly');
      console.log('   - Order creation endpoint has issues');
    } else {
      orders.forEach((order, index) => {
        console.log(`${index + 1}. Order ID: ${order._id}`);
        console.log(`   Customer: ${order.customerInfo?.name || 'Unknown'}`);
        console.log(`   Email: ${order.customerInfo?.email || 'Unknown'}`);
        console.log(`   Status: ${order.status}`);
        console.log(`   Payment Method: ${order.paymentMethod}`);
        console.log(`   Total Amount: ₹${order.totalAmount}`);
        console.log(`   Items: ${order.items?.length || 0} items`);
        console.log(`   Created: ${order.createdAt}`);
        console.log('');
      });
    }

    // Check if there are any COD orders specifically
    const codOrders = await Order.find({ paymentMethod: 'cod' });
    console.log(`💰 COD Orders: ${codOrders.length} found`);

    // Check if there are any Razorpay orders
    const razorpayOrders = await Order.find({ paymentMethod: 'razorpay' });
    console.log(`💳 Razorpay Orders: ${razorpayOrders.length} found`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

checkOrders();
