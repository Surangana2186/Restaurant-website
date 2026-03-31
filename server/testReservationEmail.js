const mongoose = require('mongoose');
const Reservation = require('./models/Reservation');
const { sendReservationConfirmation } = require('./services/emailService');
require('dotenv').config();

async function testReservationEmail() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Get a sample reservation to test
    const reservation = await Reservation.findOne({});
    
    if (!reservation) {
      console.log('❌ No reservations found to test email');
      process.exit(0);
    }

    console.log('📧 Testing reservation confirmation email...');
    console.log('📋 Reservation Details:');
    console.log(`   Name: ${reservation.name}`);
    console.log(`   Email: ${reservation.email}`);
    console.log(`   Date: ${reservation.date}`);
    console.log(`   Time: ${reservation.time}`);
    console.log(`   Guests: ${reservation.guests}`);
    console.log(`   Status: ${reservation.status}`);

    // Test sending email
    const emailSent = await sendReservationConfirmation(reservation);
    
    if (emailSent) {
      console.log('✅ Reservation confirmation email sent successfully!');
      console.log('📧 To:', reservation.email);
    } else {
      console.log('❌ Failed to send reservation confirmation email');
    }

    // Test with confirmed status
    console.log('\n🔄 Testing with confirmed status...');
    const confirmedReservation = { ...reservation.toObject(), status: 'confirmed' };
    const confirmedEmailSent = await sendReservationConfirmation(confirmedReservation);
    
    if (confirmedEmailSent) {
      console.log('✅ Confirmed reservation email sent successfully!');
    } else {
      console.log('❌ Failed to send confirmed reservation email');
    }

    process.exit(0);
  } catch (error) {
    console.error('❌ Error testing reservation email:', error);
    process.exit(1);
  }
}

testReservationEmail();
