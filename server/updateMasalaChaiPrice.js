const mongoose = require('mongoose');
const MenuItem = require('./models/MenuItem');
require('dotenv').config();

async function updateMasalaChaiPrice() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Find and update Masala Chai price
    const result = await MenuItem.updateOne(
      { name: 'Masala Chai' },
      { price: 5 }
    );

    if (result.modifiedCount > 0) {
      console.log('✅ Masala Chai price updated to ₹5');
      
      // Verify the update
      const updatedItem = await MenuItem.findOne({ name: 'Masala Chai' });
      console.log(`📋 Updated Details:`);
      console.log(`   Name: ${updatedItem.name}`);
      console.log(`   Price: ₹${updatedItem.price}`);
      console.log(`   Category: ${updatedItem.category}`);
      console.log(`   Available: ${updatedItem.available ? '✅' : '❌'}`);
    } else {
      console.log('❌ Masala Chai not found or price already set to ₹5');
    }

    console.log('\n🎉 This change will appear in:');
    console.log('   - Admin Dashboard (Menu Management)');
    console.log('   - User Menu Page');
    console.log('   - Cart System');

    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

updateMasalaChaiPrice();
