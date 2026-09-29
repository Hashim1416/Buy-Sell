const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const auth = require('../middleware/auth');

// Start with an empty list so only real bookings are shown
const initialBookings = [];

// Helper to get bookings
async function getBookings() {
  if (global.isMockDb) {
    if (global.mockStore.bookings.length === 0) {
      global.mockStore.bookings = initialBookings.map((b, i) => ({
        id: `mock-booking-${i}`,
        ...b,
        createdAt: new Date()
      }));
    }
    return global.mockStore.bookings;
  }
  
  let bookings = await Booking.find();
  if (bookings.length === 0) {
    bookings = await Booking.insertMany(initialBookings);
  }
  return bookings;
}

// POST create booking
router.post('/', async (req, res) => {
  const { name, email, phone, city, preferredVehicle, appointmentType, date, time, notes } = req.body;
  try {
    // Validate Sunday (closed)
    const dayOfWeek = new Date(date).getDay();
    if (dayOfWeek === 0) {
      return res.status(400).json({ message: 'Sundays are closed. Please choose another date.' });
    }

    if (global.isMockDb) {
      const newBooking = {
        id: `mock-booking-${Date.now()}`,
        name, email, phone, city, preferredVehicle, appointmentType, date, time, notes,
        status: 'pending',
        createdAt: new Date()
      };
      global.mockStore.bookings.push(newBooking);
      return res.status(201).json(newBooking);
    } else {
      const newBooking = new Booking({
        name, email, phone, city, preferredVehicle, appointmentType, date, time, notes
      });
      await newBooking.save();
      return res.status(201).json(newBooking);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error booking appointment' });
  }
});

// GET all bookings (Admin only)
router.get('/', auth, async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Access denied: Admin only' });
  }

  try {
    const bookings = await getBookings();
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// PUT update booking (Admin only)
router.put('/:id', auth, async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Access denied: Admin only' });
  }

  const { status } = req.body;
  try {
    if (global.isMockDb) {
      const idx = global.mockStore.bookings.findIndex(b => b.id === req.params.id);
      if (idx === -1) return res.status(404).json({ message: 'Booking not found' });
      global.mockStore.bookings[idx].status = status;
      return res.json(global.mockStore.bookings[idx]);
    } else {
      const updated = await Booking.findByIdAndUpdate(req.params.id, { status }, { new: true });
      if (!updated) return res.status(404).json({ message: 'Booking not found' });
      return res.json(updated);
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// DELETE booking (Admin only)
router.delete('/:id', auth, async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Access denied: Admin only' });
  }

  try {
    if (global.isMockDb) {
      const idx = global.mockStore.bookings.findIndex(b => b.id === req.params.id);
      if (idx === -1) return res.status(404).json({ message: 'Booking not found' });
      global.mockStore.bookings.splice(idx, 1);
      return res.json({ message: 'Booking deleted successfully' });
    } else {
      const deleted = await Booking.findByIdAndDelete(req.params.id);
      if (!deleted) return res.status(404).json({ message: 'Booking not found' });
      return res.json({ message: 'Booking deleted successfully' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
