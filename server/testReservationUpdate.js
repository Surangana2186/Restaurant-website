const mongoose = require('mongoose');
const Reservation = require('./models/Reservation');
require('dotenv').config();

async function testReservationUpdate() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Get a sample reservation
    const reservation = await Reservation.findOne({});
    
    if (!reservation) {
      console.log('❌ No reservations found to test');
      process.exit(0);
    }

    console.log('📋 Before Update:');
    console.log(`   ID: ${reservation._id}`);
    console.log(`   Name: ${reservation.name}`);
    console.log(`   Email: ${reservation.email}`);
    console.log(`   Status: ${reservation.status}`);
    console.log(`   Updated At: ${reservation.updatedAt}`);

    // Test updating status
    const newStatus = reservation.status === 'pending' ? 'confirmed' : 'pending';
    console.log(`\n🔄 Updating status to: ${newStatus}`);

    const updatedReservation = await Reservation.findByIdAndUpdate(
      reservation._id,
      { status: newStatus, updatedAt: new Date() },
      { new: true, runValidators: true }
    );

    if (updatedReservation) {
      console.log('\n✅ Update Successful:');
      console.log(`   Status: ${updatedReservation.status}`);
      console.log(`   Updated At: ${updatedReservation.updatedAt}`);
      
      // Verify it was saved
      const verifyReservation = await Reservation.findById(reservation._id);
      console.log('\n🔍 Verification:');
      console.log(`   Status in DB: ${verifyReservation.status}`);
      console.log(`   Updated At in DB: ${verifyReservation.updatedAt}`);
      
      if (verifyReservation.status === newStatus) {
        console.log('✅ Status update verified in database!');
      } else {
        console.log('❌ Status update NOT verified in database!');
      }
    } else {
      console.log('❌ Update failed');
    }

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

testReservationUpdate();
