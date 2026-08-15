const express = require('express');
const router = express.Router();
const db = require('../config/db');

// @desc    Purchase a visitor day pass
// @route   POST /api/passes/buy
// @access  Public
router.post('/buy', async (req, res) => {
  const { visitor_name, pass_type, quantity, price } = req.body;

  if (!visitor_name || !pass_type || !quantity || !price) {
    return res.status(400).json({ message: 'Please provide visitor name, type, quantity, and total price' });
  }

  try {
    await db.query(
      'INSERT INTO visitor_passes (visitor_name, pass_type, quantity, price) VALUES (?, ?, ?, ?)',
      [visitor_name, pass_type, quantity, price]
    );

    res.status(201).json({ message: 'Visitor entry pass generated successfully', price });
  } catch (error) {
    console.error('Error generating visitor pass:', error);
    res.status(500).json({ message: 'Server error generating pass' });
  }
});

module.exports = router;
