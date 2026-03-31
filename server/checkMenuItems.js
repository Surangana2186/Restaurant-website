const mongoose = require('mongoose');
const MenuItem = require('./models/MenuItem');
require('dotenv').config();

async function checkMenuItems() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Get all menu items
    const menuItems = await MenuItem.find({});
    console.log(`Total menu items in database: ${menuItems.length}`);
    
    console.log('\n📋 Current Menu Items:');
    menuItems.forEach((item, index) => {
      console.log(`${index + 1}. ${item.name} (${item.category}) - ₹${item.price}`);
      console.log(`   Image: ${item.image}`);
      console.log(`   Available: ${item.available ? '✅' : '❌'}`);
      console.log(`   Description: ${item.description}`);
      console.log('');
    });

    console.log('✅ These are the items that should appear in:');
    console.log('   - Admin Dashboard (Menu Management)');
    console.log('   - User Menu Page');
    console.log('   - Cart System');

    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

checkMenuItems();
