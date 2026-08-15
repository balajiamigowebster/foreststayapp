const express = require('express');
const router = express.Router();
const db = require('../config/db');

// @desc    Get all treks
// @route   GET /api/treks
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM treks ORDER BY id ASC');
    res.json(rows);
  } catch (error) {
    console.error('Error fetching treks:', error);
    res.status(500).json({ message: 'Server error fetching treks' });
  }
});

// @desc    Add new trek
// @route   POST /api/treks
router.post('/', async (req, res) => {
  const { title, duration, price, guide_name, category, difficulty, max_group, description, guide_included, status } = req.body;
  try {
    await db.query(
      `INSERT INTO treks (title, duration, price, guide_name, category, difficulty, max_group, description, guide_included, status) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        title, 
        duration || '2 Hours', 
        parseFloat(price) || 0, 
        guide_name || 'Arun Kumar', 
        category || 'Forest Trail', 
        difficulty || 'Easy', 
        parseInt(max_group) || 15, 
        description || '', 
        guide_included ? 1 : 0, 
        status || 'Active'
      ]
    );
    res.status(201).json({ message: 'Trekking package added successfully' });
  } catch (error) {
    console.error('Error adding trek:', error);
    res.status(500).json({ message: 'Server error adding trekking package' });
  }
});

// @desc    Edit a trek
// @route   PUT /api/treks/:id
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { title, duration, price, guide_name, category, difficulty, max_group, description, guide_included, status } = req.body;
  try {
    await db.query(
      `UPDATE treks SET title = ?, duration = ?, price = ?, guide_name = ?, category = ?, difficulty = ?, max_group = ?, description = ?, guide_included = ?, status = ? WHERE id = ?`,
      [
        title, 
        duration || '2 Hours', 
        parseFloat(price) || 0, 
        guide_name || 'Arun Kumar', 
        category || 'Forest Trail', 
        difficulty || 'Easy', 
        parseInt(max_group) || 15, 
        description || '', 
        guide_included ? 1 : 0, 
        status || 'Active', 
        id
      ]
    );
    res.json({ message: 'Trekking package updated successfully' });
  } catch (error) {
    console.error('Error updating trek:', error);
    res.status(500).json({ message: 'Server error updating trekking package' });
  }
});

// @desc    Delete a trek
// @route   DELETE /api/treks/:id
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await db.query('DELETE FROM treks WHERE id = ?', [id]);
    res.json({ message: 'Trekking package deleted successfully' });
  } catch (error) {
    console.error('Error deleting trek:', error);
    res.status(500).json({ message: 'Server error deleting trekking package' });
  }
});

module.exports = router;
