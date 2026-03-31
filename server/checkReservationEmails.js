const mongoose = require('mongoose');
const Reservation = require('./models/Reservation');
require('dotenv').config();

async function checkReservationEmails() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Get all reservations with their emails
    const reservations = await Reservation.find({});
    console.log(`📋 Found ${reservations.length} reservations:\n`);

    reservations.forEach((reservation, index) => {
      console.log(`${index + 1}. ${reservation.name}`);
      console.log(`   Email: ${reservation.email}`);
      console.log(`   Status: ${reservation.status}`);
      console.log(`   Date: ${reservation.date}`);
      console.log(`   Time: ${reservation.time}`);
      console.log('');
    });

    // Check if any emails are invalid
    const invalidEmails = reservations.filter(r => !r.email || !r.email.includes('@'));
    if (invalidEmails.length > 0) {
      console.log('❌ Invalid emails found:');
      invalidEmails.forEach(r => {
        console.log(`   ${r.name}: ${r.email || 'No email'}`);
      });
    }

    console.log('📧 Email addresses to check for confirmation emails:');
    reservations.forEach(r => {
      console.log(`   - Check inbox/spam for: ${r.email}`);
    });

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

checkReservationEmails();
