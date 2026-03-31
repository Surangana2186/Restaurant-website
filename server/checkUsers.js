const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

async function checkUsers() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Get all users
    const users = await User.find({});
    console.log(`Total users in database: ${users.length}`);
    
    users.forEach(user => {
      console.log(`- ${user.name} (${user.email}) - Role: ${user.role} - Created: ${user.createdAt}`);
    });

    // Test login with existing user
    if (users.length > 0) {
      const testUser = users[0];
      console.log(`\nTesting login with: ${testUser.email}`);
      
      // Check if password comparison works
      const bcrypt = require('bcryptjs');
      const testPassword = 'Test123456'; // Common test password
      
      try {
        const isValid = await bcrypt.compare(testPassword, testUser.password);
        console.log(`Password "${testPassword}" valid: ${isValid}`);
        
        if (!isValid) {
          console.log('Password might be different. Available users:');
          users.forEach(user => {
            console.log(`  - ${user.email} (password hash length: ${user.password.length})`);
          });
        }
      } catch (error) {
        console.log('Password comparison error:', error.message);
      }
    }

    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

checkUsers();
