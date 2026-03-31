const mongoose = require('mongoose');
const MenuItem = require('./models/MenuItem');
require('dotenv').config();

async function setupFreeImages() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Free image URLs from various sources that work everywhere
    const freeImages = [
      {
        name: 'Coffee',
        image: 'https://images.pexels.com/photos/312418/pexels-photo-312418.jpeg?auto=compress&cs=tinysrgb&w=400'
      },
      {
        name: 'Dosa',
        image: 'https://images.pexels.com/photos/1260968/pexels-photo-1260968.jpeg?auto=compress&cs=tinysrgb&w=400'
      },
      {
        name: 'Mango Lassi',
        image: 'https://images.pexels.com/photos/1472946/pexels-photo-1472946.jpeg?auto=compress&cs=tinysrgb&w=400'
      },
      {
        name: 'Masala Chai',
        image: 'https://images.pexels.com/photos/9558907/pexels-photo-9558907.jpeg?auto=compress&cs=tinysrgb&w=400'
      },
      {
        name: 'Palak Paneer',
        image: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=400'
      },
      {
        name: 'Pulao',
        image: 'https://images.pexels.com/photos/1640774/pexels-photo-1640774.jpeg?auto=compress&cs=tinysrgb&w=400'
      },
      {
        name: 'Rasmalai',
        image: 'https://images.pexels.com/photos/291528/pexels-photo-291528.jpeg?auto=compress&cs=tinysrgb&w=400'
      },
      {
        name: 'Vegetable Biryani',
        image: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=400'
      }
    ];

    // Update each menu item with free image
    for (const itemData of freeImages) {
      await MenuItem.updateOne(
        { name: itemData.name },
        { image: itemData.image }
      );
      console.log(`✅ Updated ${itemData.name} with free image URL`);
    }

    console.log('🎉 All menu items updated with free working images!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

setupFreeImages();
