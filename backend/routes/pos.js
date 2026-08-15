const express = require('express');
const router = express.Router();
const db = require('../config/db');

// @desc    Create a cafe POS order
// @route   POST /api/pos/order
// @access  Public
router.post('/order', async (req, res) => {
  const { items, total_amount } = req.body;

  if (!items || !total_amount) {
    return res.status(400).json({ message: 'Please provide items and total billing amount' });
  }

  try {
    const itemsJson = JSON.stringify(items);
    await db.query(
      'INSERT INTO cafe_orders (items_json, total_amount) VALUES (?, ?)',
      [itemsJson, total_amount]
    );

    res.status(201).json({ message: 'POS Sale logged successfully', total_amount });
  } catch (error) {
    console.error('Error logging POS sale:', error);
    res.status(500).json({ message: 'Server error logging sale' });
  }
});

module.exports = router;
