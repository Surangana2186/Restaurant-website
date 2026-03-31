const mongoose = require('mongoose');
const MenuItem = require('./models/MenuItem');
require('dotenv').config();

async function addMissingItems() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Add missing items with your custom images
    const missingItems = [
      {
        name: 'Coffee',
        category: 'beverages',
        price: 200,
        rating: 4.5,
        isVeg: true,
        description: 'Pure blended coffee made from pure handpicked coffee beans.',
        image: 'https://i.postimg.cc/63ztyp3B/coffee.webp',
        chefSpecial: false,
        spicy: false,
        glutenFree: false,
        available: true,
        preparationTime: 15,
        ingredients: ['Coffee', 'Water', 'Sugar', 'Milk'],
        allergens: []
      },
      {
        name: 'Dosa',
        category: 'starters',
        price: 162,
        rating: 4.5,
        isVeg: true,
        description: 'Freshly prepared south Indian authentic dish made using rice and pulses served with coconut chutney.',
        image: 'https://i.postimg.cc/W1MRd1YN/dosa.webp',
        chefSpecial: false,
        spicy: false,
        glutenFree: false,
        available: true,
        preparationTime: 15,
        ingredients: ['Rice', 'Lentils', 'Coconut', 'Spices'],
        allergens: []
      },
      {
        name: 'Pulao',
        category: 'main-course',
        price: 300,
        rating: 4.5,
        isVeg: true,
        description: 'Fresh aromatic rice.',
        image: 'https://i.postimg.cc/T3QzV4xc/pulav.webp',
        chefSpecial: false,
        spicy: false,
        glutenFree: false,
        available: true,
        preparationTime: 15,
        ingredients: ['Basmati Rice', 'Vegetables', 'Spices', 'Herbs'],
        allergens: []
      }
    ];

    // Add missing items
    for (const itemData of missingItems) {
      // Check if item already exists
      const existing = await MenuItem.findOne({ name: itemData.name });
      if (!existing) {
        const newItem = new MenuItem(itemData);
        await newItem.save();
        console.log(`✅ Added: ${itemData.name}`);
      } else {
        console.log(`⚠️  Already exists: ${itemData.name}`);
      }
    }

    // Show final menu
    const finalItems = await MenuItem.find({});
    console.log(`\n🎉 Final menu items: ${finalItems.length}`);
    finalItems.forEach(item => {
      console.log(`  - ${item.name} (${item.category}) - ₹${item.price}`);
    });

    console.log('\n✅ All menu items with your custom images are now available!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

addMissingItems();
