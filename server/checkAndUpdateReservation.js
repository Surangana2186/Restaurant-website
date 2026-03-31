const mongoose = require('mongoose');
const Reservation = require('./models/Reservation');
require('dotenv').config();

async function checkAndUpdateReservation() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Get a pending reservation
    const pendingReservation = await Reservation.findOne({ status: 'pending' });
    
    if (!pendingReservation) {
      console.log('❌ No pending reservations found');
      
      // Show all reservations with their current status
      const allReservations = await Reservation.find({});
      console.log('\n📋 All reservations:');
      allReservations.forEach((r, i) => {
        console.log(`${i+1}. ${r.name} - Status: ${r.status}`);
      });
      process.exit(0);
    }

    console.log('📋 Found pending reservation:');
    console.log(`   Name: ${pendingReservation.name}`);
    console.log(`   Email: ${pendingReservation.email}`);
    console.log(`   Current Status: ${pendingReservation.status}`);

    // Manually update it to confirmed
    console.log('\n🔄 Updating status to "confirmed"...');
    const updated = await Reservation.findByIdAndUpdate(
      pendingReservation._id,
      { status: 'confirmed', updatedAt: new Date() },
      { new: true }
    );

    console.log('✅ Updated successfully:');
    console.log(`   New Status: ${updated.status}`);
    console.log(`   Updated At: ${updated.updatedAt}`);

    // Verify the update
    const verifyReservation = await Reservation.findById(pendingReservation._id);
    console.log('\n🔍 Verification:');
    console.log(`   Status in DB: ${verifyReservation.status}`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

checkAndUpdateReservation();
