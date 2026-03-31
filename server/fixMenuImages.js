const mongoose = require('mongoose');
const MenuItem = require('./models/MenuItem');
require('dotenv').config();

async function fixMenuImages() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Update menu items with external images
    const updates = [
      { name: 'Coffee', image: 'https://images.unsplash.com/photo-1511920183353-f4e2fe6e3e4c?w=400' },
      { name: 'Dosa', image: 'https://images.unsplash.com/photo-1589301765034-2a7b0b4b5b2c?w=400' },
      { name: 'Mango Lassi', image: 'https://images.unsplash.com/photo-1565958012043-f650e2c25092?w=400' },
      { name: 'Masala Chai', image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400' },
      { name: 'Palak Paneer', image: 'https://images.unsplash.com/photo-1565299624946-b28f40a9ae91?w=400' },
      { name: 'Pulao', image: 'https://images.unsplash.com/photo-1565299624946-b28f40a9ae91?w=400' },
      { name: 'Rasmalai', image: 'https://images.unsplash.com/photo-1565299624946-b28f40a9ae91?w=400' },
      { name: 'Vegetable Biryani', image: 'https://images.unsplash.com/photo-1565299624946-b28f40a9ae91?w=400' }
    ];

    for (const update of updates) {
      await MenuItem.updateOne(
        { name: update.name },
        { image: update.image }
      );
      console.log(`Updated ${update.name} image`);
    }

    console.log('All menu items updated with external images');
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

fixMenuImages();
