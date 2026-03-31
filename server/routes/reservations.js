const express = require('express');
const router = express.Router();
const Reservation = require('../models/Reservation');
const { sendReservationConfirmation, sendReservationCancellation } = require('../services/emailService');

// Get all reservations
router.get('/', async (req, res) => {
  try {
    const reservations = await Reservation.find({}).sort({ createdAt: -1 });
    res.json(reservations);
  } catch (error) {
    console.error('Error fetching reservations:', error);
    res.status(500).json({ message: 'Error fetching reservations' });
  }
});

// Create new reservation
router.post('/', async (req, res) => {
  try {
    console.log('Received reservation request:', req.body);
    
    const { name, email, phone, date, time, guests, specialRequests } = req.body;

    // Validation
    if (!name || !email || !phone || !date || !time || !guests) {
      console.log('Missing required fields:', { name, email, phone, date, time, guests });
      return res.status(400).json({ 
        message: 'Missing required fields: name, email, phone, date, time, guests' 
      });
    }

    // Check for existing reservation at same time
    const existingReservation = await Reservation.findOne({
      date: date,
      time: time,
      status: { $ne: 'cancelled' }
    });

    if (existingReservation) {
      console.log('Time slot already booked:', existingReservation);
      return res.status(409).json({ 
        message: 'Time slot already booked for this date' 
      });
    }

    const newReservation = new Reservation({
      name,
      email,
      phone,
      date,
      time,
      guests: parseInt(guests),
      specialRequests,
      status: 'pending'
    });

    await newReservation.save();
    console.log('New reservation created successfully:', newReservation);

    res.status(201).json({
      success: true,
      message: 'Reservation created successfully',
      reservation: newReservation
    });
  } catch (error) {
    console.error('Error creating reservation:', error);
    res.status(500).json({
      message: 'Error creating reservation',
      error: error.message
    });
  }
});

// Update reservation status
router.put('/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    console.log(`Updating reservation ${id} status to:`, status);

    // Validate status first
    const validStatuses = ['pending', 'confirmed', 'cancelled', 'completed'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ 
        message: 'Invalid status. Must be: pending, confirmed, cancelled, or completed' 
      });
    }

    // Find and update reservation
    const reservation = await Reservation.findByIdAndUpdate(
      id, 
      { status, updatedAt: new Date() }, 
      { new: true, runValidators: true }
    );

    if (!reservation) {
      return res.status(404).json({ message: 'Reservation not found' });
    }

    console.log(`✅ Successfully updated reservation ${id} status to:`, status);

    // Send confirmation email when status changes to 'confirmed'
    if (status === 'confirmed') {
      const emailSent = await sendReservationConfirmation(reservation);
      if (emailSent) {
        console.log('✅ Confirmation email sent successfully');
      } else {
        console.log('⚠️ Failed to send confirmation email');
      }
    }

    res.json({ 
      message: 'Reservation status updated successfully', 
      reservation: {
        ...reservation.toObject(),
        status
      }
    });
  } catch (error) {
    console.error('Error updating reservation:', error);
    res.status(500).json({ message: 'Error updating reservation' });
  }
});

// Delete reservation
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const reservation = await Reservation.findByIdAndDelete(id);

    if (!reservation) {
      return res.status(404).json({ message: 'Reservation not found' });
    }

    console.log(`Deleted reservation ${id}`);

    res.json({
      success: true,
      message: 'Reservation deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting reservation:', error);
    res.status(500).json({ message: 'Error deleting reservation' });
  }
});

// Get reservations by date
router.get('/date/:date', (req, res) => {
  const { date } = req.params;
  const dateReservations = reservations.filter(r => r.date === date);
  res.json(dateReservations);
});

module.exports = router;
