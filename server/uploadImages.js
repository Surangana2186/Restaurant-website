const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const MenuItem = require('./models/MenuItem');
require('dotenv').config();

async function uploadLocalImages() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Get local images
    const uploadsDir = path.join(__dirname, 'uploads', 'menu-items');
    const imageFiles = fs.readdirSync(uploadsDir);
    
    console.log('Found local images:', imageFiles);

    // Map images to menu items
    const imageMap = {
      'menu-item-1774883279456-797232171.webp': 'https://images.unsplash.com/photo-1565299624946-b28f40a9ae91?w=400',
      'menu-item-1774883294074-392569177.webp': 'https://images.unsplash.com/photo-1589301765034-2a7b0b4b5b2c?w=400',
      'menu-item-1774883310771-685779456.webp': 'https://images.unsplash.com/photo-1565958012043-f650e2c25092?w=400',
      'menu-item-1774883384622-48789713.webp': 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400',
      'menu-item-1774883413436-429207302.webp': 'https://images.unsplash.com/photo-1565299624946-b28f40a9ae91?w=400',
      'menu-item-1774883470385-601653574.webp': 'https://images.unsplash.com/photo-1565299624946-b28f40a9ae91?w=400',
      'menu-item-1774951342412-957744057.webp': 'https://images.unsplash.com/photo-1565299624946-b28f40a9ae91?w=400',
      'menu-item-1774951589847-539821225.webp': 'https://images.unsplash.com/photo-1589301765034-2a7b0b4b5b2c?w=400'
    };

    // Update menu items with proper image URLs
    const menuItems = await MenuItem.find({});
    
    for (const item of menuItems) {
      // Find matching local image
      const matchingImage = imageFiles.find(file => item.image.includes(file));
      
      if (matchingImage && imageMap[matchingImage]) {
        await MenuItem.updateOne(
          { _id: item._id },
          { image: imageMap[matchingImage] }
        );
        console.log(`Updated ${item.name} with external image URL`);
      }
    }

    console.log('✅ All menu items updated with working image URLs');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

uploadLocalImages();
