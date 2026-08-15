const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { protect } = require('../middleware/authMiddleware');

// @desc    Add a review for a cabin
// @route   POST /api/reviews
// @access  Private
router.post('/', protect, async (req, res) => {
  const { cabin_id, rating, comment } = req.body;

  if (!cabin_id || !rating || !comment) {
    return res.status(400).json({ message: 'Please provide cabin ID, rating, and comment' });
  }

  const numericRating = parseInt(rating);
  if (numericRating < 1 || numericRating > 5) {
    return res.status(400).json({ message: 'Rating must be between 1 and 5' });
  }

  try {
    // 1. Verify cabin exists
    const [cabins] = await db.query('SELECT * FROM cabins WHERE id = ?', [cabin_id]);
    if (cabins.length === 0) {
      return res.status(404).json({ message: 'Cabin not found' });
    }

    // 2. Insert Review
    await db.query(
      'INSERT INTO reviews (user_id, cabin_id, rating, comment) VALUES (?, ?, ?, ?)',
      [req.user.id, cabin_id, numericRating, comment]
    );

    // 3. Recalculate average rating for cabin
    const [avgResult] = await db.query(
      'SELECT AVG(rating) AS avg_rating FROM reviews WHERE cabin_id = ?',
      [cabin_id]
    );
    
    const newAverage = parseFloat(avgResult[0].avg_rating || 0).toFixed(2);

    // 4. Update the cabin rating
    await db.query('UPDATE cabins SET rating = ? WHERE id = ?', [newAverage, cabin_id]);

    res.status(201).json({ 
      message: 'Review submitted successfully',
      newAverage
    });
  } catch (error) {
    console.error('Error submitting review:', error);
    res.status(500).json({ message: 'Server error submitting review' });
  }
});

// @desc    Get reviews for a single cabin
// @route   GET /api/reviews/cabin/:cabinId
// @access  Public
router.get('/cabin/:cabinId', async (req, res) => {
  const { cabinId } = req.params;

  try {
    const [reviews] = await db.query(
      `SELECT r.*, u.name AS user_name 
       FROM reviews r
       JOIN users u ON r.user_id = u.id
       WHERE r.cabin_id = ?
       ORDER BY r.created_at DESC`,
      [cabinId]
    );
    res.json(reviews);
  } catch (error) {
    console.error('Error fetching reviews:', error);
    res.status(500).json({ message: 'Server error fetching reviews' });
  }
});

module.exports = router;
