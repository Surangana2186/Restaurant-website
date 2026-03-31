const mongoose = require('mongoose');
const Reservation = require('./models/Reservation');
require('dotenv').config();

async function createTestReservation() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Create a new test reservation
    const newReservation = new Reservation({
      name: 'Test Customer',
      email: 'test@example.com',
      phone: '9876543210',
      date: '2026-04-02',
      time: '2:00 PM',
      guests: 2,
      status: 'pending', // Start with pending
      specialRequests: 'Test reservation for debugging'
    });

    await newReservation.save();
    console.log('✅ Created new test reservation:');
    console.log(`   ID: ${newReservation._id}`);
    console.log(`   Name: ${newReservation.name}`);
    console.log(`   Email: ${newReservation.email}`);
    console.log(`   Status: ${newReservation.status}`);

    console.log('\n📋 Now you can test the admin dashboard:');
    console.log('1. Go to admin dashboard');
    console.log('2. Look for "Test Customer" with "pending" status');
    console.log('3. Use dropdown to confirm/cancel');
    console.log('4. Check if status updates in frontend');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

createTestReservation();
