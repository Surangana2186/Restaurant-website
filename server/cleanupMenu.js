const mongoose = require('mongoose');
const MenuItem = require('./models/MenuItem');
require('dotenv').config();

async function cleanupMenuItems() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Keep only these menu items (the ones with your custom images)
    const itemsToKeep = [
      'Masala Chai',
      'Coffee', 
      'Dosa',
      'Mango Lassi',
      'Palak Paneer',
      'Pulao',
      'Rasmalai',
      'Vegetable Biryani'
    ];

    console.log('Items to keep:', itemsToKeep);

    // Get all current menu items
    const allItems = await MenuItem.find({});
    console.log(`Total menu items in database: ${allItems.length}`);

    // Find items to remove
    const itemsToRemove = allItems.filter(item => !itemsToKeep.includes(item.name));
    console.log(`Items to remove: ${itemsToRemove.length}`);

    // Remove unwanted items
    for (const item of itemsToRemove) {
      await MenuItem.deleteOne({ _id: item._id });
      console.log(`🗑️ Removed: ${item.name}`);
    }

    // Show remaining items
    const remainingItems = await MenuItem.find({});
    console.log(`\n✅ Remaining menu items: ${remainingItems.length}`);
    remainingItems.forEach(item => {
      console.log(`  - ${item.name} (${item.category}) - ₹${item.price}`);
    });

    console.log('\n🎉 Menu cleanup completed!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

cleanupMenuItems();
