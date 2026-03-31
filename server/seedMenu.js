const mongoose = require('mongoose');
const MenuItem = require('./models/MenuItem');
require('dotenv').config();

// Sample menu items to seed the database
const sampleMenuItems = [
  {
    name: "Paneer Tikka",
    category: "starters",
    price: 299,
    rating: 4.8,
    isVeg: true,
    description: "Soft cottage cheese cubes marinated in yogurt and spices, grilled in tandoor",
    image: "https://images.unsplash.com/photo-1565299624946-b28f40a9ae91?w=400",
    chefSpecial: true,
    glutenFree: true,
    available: true,
    preparationTime: 20,
    ingredients: ["Paneer", "Yogurt", "Spices", "Lemon", "Onion"],
    allergens: ["Dairy"]
  },
  {
    name: "Chicken Seekh Kebab",
    category: "starters",
    price: 349,
    rating: 4.9,
    isVeg: false,
    description: "Minced chicken skewers with aromatic spices, grilled to perfection",
    image: "https://images.unsplash.com/photo-1565299624946-b28f40a9ae91?w=400",
    chefSpecial: true,
    spicy: true,
    available: true,
    preparationTime: 25,
    ingredients: ["Chicken", "Spices", "Onion", "Ginger", "Garlic"],
    allergens: []
  },
  {
    name: "Butter Chicken",
    category: "main-course",
    price: 449,
    rating: 4.7,
    isVeg: false,
    description: "Tender chicken in rich, creamy tomato-based curry with butter",
    image: "https://images.unsplash.com/photo-1565299624946-b28f40a9ae91?w=400",
    chefSpecial: true,
    spicy: true,
    available: true,
    preparationTime: 30,
    ingredients: ["Chicken", "Tomato", "Cream", "Butter", "Spices"],
    allergens: ["Dairy"]
  },
  {
    name: "Palak Paneer",
    category: "main-course",
    price: 399,
    rating: 4.6,
    isVeg: true,
    description: "Cottage cheese cubes in creamy spinach gravy with aromatic spices",
    image: "https://images.unsplash.com/photo-1565299624946-b28f40a9ae91?w=400",
    glutenFree: true,
    available: true,
    preparationTime: 25,
    ingredients: ["Paneer", "Spinach", "Cream", "Spices", "Garlic"],
    allergens: ["Dairy"]
  },
  {
    name: "Gulab Jamun",
    category: "desserts",
    price: 199,
    rating: 4.8,
    isVeg: true,
    description: "Soft milk dumplings soaked in rose-flavored sugar syrup",
    image: "https://images.unsplash.com/photo-1565299624946-b28f40a9ae91?w=400",
    chefSpecial: true,
    available: true,
    preparationTime: 15,
    ingredients: ["Milk", "Sugar", "Rose Water", "Cardamom"],
    allergens: ["Dairy", "Gluten"]
  },
  {
    name: "Rasmalai",
    category: "desserts",
    price: 249,
    rating: 4.7,
    isVeg: true,
    description: "Soft cottage cheese patties in sweet, creamy milk sauce",
    image: "https://images.unsplash.com/photo-1565299624946-b28f40a9ae91?w=400",
    glutenFree: true,
    available: true,
    preparationTime: 20,
    ingredients: ["Paneer", "Milk", "Sugar", "Pistachios", "Saffron"],
    allergens: ["Dairy"]
  },
  {
    name: "Mango Lassi",
    category: "beverages",
    price: 149,
    rating: 4.9,
    isVeg: true,
    description: "Sweet and creamy yogurt drink with mango pulp",
    image: "https://images.unsplash.com/photo-1565299624946-b28f40a9ae91?w=400",
    glutenFree: true,
    available: true,
    preparationTime: 5,
    ingredients: ["Yogurt", "Mango", "Sugar", "Cardamom"],
    allergens: ["Dairy"]
  },
  {
    name: "Masala Chai",
    category: "beverages",
    price: 99,
    rating: 4.6,
    isVeg: true,
    description: "Spiced Indian tea with milk and aromatic spices",
    image: "https://images.unsplash.com/photo-1565299624946-b28f40a9ae91?w=400",
    glutenFree: true,
    available: true,
    preparationTime: 5,
    ingredients: ["Tea", "Milk", "Sugar", "Spices", "Ginger"],
    allergens: ["Dairy"]
  },
  {
    name: "Vegetable Biryani",
    category: "main-course",
    price: 379,
    rating: 4.5,
    isVeg: true,
    description: "Fragrant basmati rice with mixed vegetables and aromatic spices",
    image: "https://images.unsplash.com/photo-1565299624946-b28f40a9ae91?w=400",
    spicy: true,
    available: true,
    preparationTime: 35,
    ingredients: ["Basmati Rice", "Mixed Vegetables", "Spices", "Herbs", "Yogurt"],
    allergens: ["Dairy"]
  },
  {
    name: "Chicken Biryani",
    category: "main-course",
    price: 429,
    rating: 4.8,
    isVeg: false,
    description: "Fragrant basmati rice with tender chicken and aromatic spices",
    image: "https://images.unsplash.com/photo-1565299624946-b28f40a9ae91?w=400",
    chefSpecial: true,
    spicy: true,
    available: true,
    preparationTime: 40,
    ingredients: ["Basmati Rice", "Chicken", "Spices", "Herbs", "Yogurt"],
    allergens: ["Dairy"]
  }
];

async function seedMenuItems() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ Connected to MongoDB Atlas');

    // Clear existing menu items
    await MenuItem.deleteMany({});
    console.log('🗑️ Cleared existing menu items');

    // Insert sample menu items
    const insertedItems = await MenuItem.insertMany(sampleMenuItems);
    console.log(`✅ Added ${insertedItems.length} menu items to the database`);

    // Display inserted items
    console.log('\n📋 Menu Items Added:');
    insertedItems.forEach((item, index) => {
      console.log(`${index + 1}. ${item.name} (${item.category}) - ₹${item.price}`);
    });

  } catch (error) {
    console.error('❌ Error seeding menu items:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
}

// Run the seeding function
seedMenuItems();
