const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

async function testSignup() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Test user data
    const testUser = {
      name: 'Test User',
      email: 'testsignup@example.com',
      password: 'Test123456'
    };

    console.log('Testing signup with:', testUser);

    // Check if user already exists
    const existingUser = await User.findOne({ email: testUser.email });
    if (existingUser) {
      console.log('User already exists:', existingUser.email);
      return;
    }

    // Create new user
    const user = new User({
      name: testUser.name,
      email: testUser.email,
      password: testUser.password,
      role: 'user'
    });

    await user.save();
    console.log('✅ User created successfully:', user.email);
    
    // Clean up test user
    await User.deleteOne({ email: testUser.email });
    console.log('🗑️ Test user cleaned up');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

testSignup();
