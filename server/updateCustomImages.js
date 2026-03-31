const mongoose = require('mongoose');
const MenuItem = require('./models/MenuItem');
require('dotenv').config();

async function updateCustomImages() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Your custom image URLs from Postimages
    const customImages = [
      {
        name: 'Masala Chai',
        image: 'https://i.postimg.cc/LXS8JW3v/chai.webp'
      },
      {
        name: 'Coffee',
        image: 'https://i.postimg.cc/63ztyp3B/coffee.webp'
      },
      {
        name: 'Dosa',
        image: 'https://i.postimg.cc/W1MRd1YN/dosa.webp'
      },
      {
        name: 'Mango Lassi',
        image: 'https://i.postimg.cc/WzQK4BMr/mango-lassi.webp'
      },
      {
        name: 'Palak Paneer',
        image: 'https://i.postimg.cc/HjDZmQgx/palak-paneer.webp'
      },
      {
        name: 'Pulao',
        image: 'https://i.postimg.cc/T3QzV4xc/pulav.webp'
      },
      {
        name: 'Rasmalai',
        image: 'https://i.postimg.cc/0jp3btZb/rasmalai.webp'
      },
      {
        name: 'Vegetable Biryani',
        image: 'https://i.postimg.cc/vZDgyC0D/biriyani.webp'
      }
    ];

    // Update each menu item with your custom image
    for (const itemData of customImages) {
      await MenuItem.updateOne(
        { name: itemData.name },
        { image: itemData.image }
      );
      console.log(`✅ Updated ${itemData.name} with your custom image`);
    }

    console.log('🎉 All menu items updated with your custom Postimages!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

updateCustomImages();
