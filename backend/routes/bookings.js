const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { protect, adminOnly } = require('../middleware/authMiddleware');

// Helper to calculate total price
const calculateTotalPrice = (checkIn, checkOut, pricePerNight) => {
  const diffTime = Math.abs(new Date(checkOut) - new Date(checkIn));
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays * pricePerNight;
};

// @desc    Create a new booking
// @route   POST /api/bookings
// @access  Private
router.post('/', protect, async (req, res) => {
  const { cabin_id, check_in, check_out, guests_count } = req.body;

  if (!cabin_id || !check_in || !check_out || !guests_count) {
    return res.status(400).json({ message: 'Please provide all required fields' });
  }

  if (new Date(check_in) >= new Date(check_out)) {
    return res.status(400).json({ message: 'Check-out date must be after check-in date' });
  }

  try {
    // 1. Get Cabin detail
    const [cabins] = await db.query('SELECT * FROM cabins WHERE id = ?', [cabin_id]);
    if (cabins.length === 0) {
      return res.status(404).json({ message: 'Cabin not found' });
    }
    const cabin = cabins[0];

    // 2. Check occupancy limit
    if (guests_count > cabin.max_guests) {
      return res.status(400).json({ message: `This cabin allows a maximum of ${cabin.max_guests} guests.` });
    }

    // 3. Check for booking date overlap conflicts
    // Two booking intervals A and B overlap if A.check_in < B.check_out AND B.check_in < A.check_out
    const [conflicts] = await db.query(
      `SELECT * FROM bookings 
       WHERE cabin_id = ? 
         AND status != 'cancelled'
         AND check_in < ? 
         AND check_out > ?`,
      [cabin_id, check_out, check_in]
    );

    if (conflicts.length > 0) {
      return res.status(400).json({ message: 'This cabin is already booked for the selected dates.' });
    }

    // 4. Calculate total price
    const total_price = calculateTotalPrice(check_in, check_out, cabin.price_per_night);

    // 5. Insert Booking
    const [result] = await db.query(
      `INSERT INTO bookings (user_id, cabin_id, check_in, check_out, total_price, guests_count, status) 
       VALUES (?, ?, ?, ?, ?, ?, 'confirmed')`,
      [req.user.id, cabin_id, check_in, check_out, total_price, guests_count]
    );

    res.status(201).json({
      message: 'Booking confirmed successfully',
      bookingId: result.insertId,
      total_price
    });
  } catch (error) {
    console.error('Error creating booking:', error);
    res.status(500).json({ message: 'Server error creating booking' });
  }
});

// @desc    Get logged-in user's bookings
// @route   GET /api/bookings/my-bookings
// @access  Private
router.get('/my-bookings', protect, async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT b.*, c.name AS cabin_name, c.image_url AS cabin_image, c.location AS cabin_location
       FROM bookings b
       JOIN cabins c ON b.cabin_id = c.id
       WHERE b.user_id = ?
       ORDER BY b.check_in DESC`,
      [req.user.id]
    );
    res.json(rows);
  } catch (error) {
    console.error('Error fetching user bookings:', error);
    res.status(500).json({ message: 'Server error fetching bookings' });
  }
});

// @desc    Get all bookings (Admin only)
// @route   GET /api/bookings
// @access  Private/Admin
router.get('/', protect, adminOnly, async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT b.*, u.name AS user_name, u.email AS user_email, 
              c.name AS cabin_name, c.image_url AS cabin_image
       FROM bookings b
       JOIN users u ON b.user_id = u.id
       JOIN cabins c ON b.cabin_id = c.id
       ORDER BY b.created_at DESC`
    );
    res.json(rows);
  } catch (error) {
    console.error('Error fetching all bookings:', error);
    res.status(500).json({ message: 'Server error fetching all bookings' });
  }
});

// @desc    Cancel booking
// @route   PUT /api/bookings/:id/cancel
// @access  Private
router.put('/:id/cancel', protect, async (req, res) => {
  const { id } = req.params;

  try {
    const [bookings] = await db.query('SELECT * FROM bookings WHERE id = ?', [id]);
    if (bookings.length === 0) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    const booking = bookings[0];

    // Check if the user owns this booking, or is admin
    if (booking.user_id !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to cancel this booking' });
    }

    // Cancel the booking
    await db.query('UPDATE bookings SET status = \'cancelled\' WHERE id = ?', [id]);

    res.json({ message: 'Booking cancelled successfully' });
  } catch (error) {
    console.error('Error cancelling booking:', error);
    res.status(500).json({ message: 'Server error cancelling booking' });
  }
});

module.exports = router;
