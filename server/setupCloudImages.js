const mongoose = require('mongoose');
const MenuItem = require('./models/MenuItem');
require('dotenv').config();

async function setupCloudinaryImages() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Free cloud image URLs that work everywhere
    const cloudImages = [
      {
        name: 'Coffee',
        image: 'https://res.cloudinary.com/demo/image/upload/w_400,q_auto,f_auto/coffee.jpg'
      },
      {
        name: 'Dosa',
        image: 'https://res.cloudinary.com/demo/image/upload/w_400,q_auto,f_auto/indian-food.jpg'
      },
      {
        name: 'Mango Lassi',
        image: 'https://res.cloudinary.com/demo/image/upload/w_400,q_auto,f_auto/mango-drink.jpg'
      },
      {
        name: 'Masala Chai',
        image: 'https://res.cloudinary.com/demo/image/upload/w_400,q_auto,f_auto/chai-tea.jpg'
      },
      {
        name: 'Palak Paneer',
        image: 'https://res.cloudinary.com/demo/image/upload/w_400,q_auto,f_auto/indian-curry.jpg'
      },
      {
        name: 'Pulao',
        image: 'https://res.cloudinary.com/demo/image/upload/w_400,q_auto,f_auto/rice-dish.jpg'
      },
      {
        name: 'Rasmalai',
        image: 'https://res.cloudinary.com/demo/image/upload/w_400,q_auto,f_auto/indian-dessert.jpg'
      },
      {
        name: 'Vegetable Biryani',
        image: 'https://res.cloudinary.com/demo/image/upload/w_400,q_auto,f_auto/biryani.jpg'
      }
    ];

    // Update each menu item with cloud image
    for (const itemData of cloudImages) {
      await MenuItem.updateOne(
        { name: itemData.name },
        { image: itemData.image }
      );
      console.log(`✅ Updated ${itemData.name} with cloud image`);
    }

    console.log('🎉 All menu items updated with cloud images!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

setupCloudinaryImages();
