const mongoose = require('mongoose');
const Reservation = require('./models/Reservation');
const { sendReservationConfirmation, sendReservationCancellation } = require('./services/emailService');
require('dotenv').config();

async function testReservationEmails() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Get a sample reservation
    const reservation = await Reservation.findOne({});
    
    if (!reservation) {
      console.log('❌ No reservations found to test');
      process.exit(0);
    }

    console.log('📋 Testing reservation:', {
      id: reservation._id,
      name: reservation.name,
      email: reservation.email,
      status: reservation.status
    });

    // Test confirmation email
    console.log('\n📧 Testing confirmation email...');
    const testReservation = { ...reservation.toObject(), status: 'confirmed' };
    const confirmationSent = await sendReservationConfirmation(testReservation);
    
    if (confirmationSent) {
      console.log('✅ Confirmation email sent successfully');
    } else {
      console.log('❌ Failed to send confirmation email');
    }

    // Test cancellation email
    console.log('\n📧 Testing cancellation email...');
    const cancelReservation = { ...reservation.toObject(), status: 'cancelled' };
    const cancellationSent = await sendReservationCancellation(cancelReservation);
    
    if (cancellationSent) {
      console.log('✅ Cancellation email sent successfully');
    } else {
      console.log('❌ Failed to send cancellation email');
    }

    console.log('\n🔍 Email Service Status:');
    console.log('EMAIL_USER:', process.env.EMAIL_USER ? '✅ Set' : '❌ Missing');
    console.log('EMAIL_PASS:', process.env.EMAIL_PASS ? '✅ Set' : '❌ Missing');
    console.log('HOST_EMAIL:', process.env.HOST_EMAIL ? '✅ Set' : '❌ Missing');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error testing reservation emails:', error);
    process.exit(1);
  }
}

testReservationEmails();
