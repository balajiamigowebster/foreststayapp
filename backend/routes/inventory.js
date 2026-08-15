const express = require('express');
const router = express.Router();
const db = require('../config/db');

// @desc    Get all inventory items
// @route   GET /api/inventory
// @access  Public
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM inventory ORDER BY item_name ASC');
    res.json(rows);
  } catch (error) {
    console.error('Error fetching inventory:', error);
    res.status(500).json({ message: 'Server error fetching inventory' });
  }
});

// @desc    Add new inventory item
// @route   POST /api/inventory
// @access  Public
router.post('/', async (req, res) => {
  const { name, category, stock, maxStock, unit, minThreshold } = req.body;
  const code = `i-${Date.now().toString().slice(-4)}`;
  try {
    await db.query(
      'INSERT INTO inventory (item_name, code, quantity, unit, min_required, category, max_capacity) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [name, code, parseFloat(stock) || 0, unit, parseFloat(minThreshold) || 0, category, parseFloat(maxStock) || 50]
    );
    res.status(201).json({ message: 'Stock item added successfully' });
  } catch (error) {
    console.error('Error adding inventory:', error);
    res.status(500).json({ message: 'Server error adding inventory' });
  }
});

// @desc    Edit an inventory item
// @route   PUT /api/inventory/:id
// @access  Public
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { name, category, stock, maxStock, unit, minThreshold } = req.body;
  try {
    await db.query(
      'UPDATE inventory SET item_name = ?, quantity = ?, unit = ?, min_required = ?, category = ?, max_capacity = ? WHERE id = ?',
      [name, parseFloat(stock) || 0, unit, parseFloat(minThreshold) || 0, category, parseFloat(maxStock) || 50, id]
    );
    res.json({ message: 'Stock item updated successfully' });
  } catch (error) {
    console.error('Error updating inventory:', error);
    res.status(500).json({ message: 'Server error updating inventory' });
  }
});

// @desc    Delete an inventory item
// @route   DELETE /api/inventory/:id
// @access  Public
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await db.query('DELETE FROM inventory WHERE id = ?', [id]);
    res.json({ message: 'Stock item deleted successfully' });
  } catch (error) {
    console.error('Error deleting inventory:', error);
    res.status(500).json({ message: 'Server error deleting inventory' });
  }
});

// @desc    Restock a specific inventory item
// @route   PUT /api/inventory/:id/restock
// @access  Public
router.put('/:id/restock', async (req, res) => {
  const { id } = req.params;

  try {
    const [itemRows] = await db.query('SELECT * FROM inventory WHERE id = ?', [id]);
    if (itemRows.length === 0) {
      return res.status(404).json({ message: 'Item not found in inventory record' });
    }

    const item = itemRows[0];
    const newQty = parseFloat(item.min_required) + 15; // Refills to safe levels

    await db.query('UPDATE inventory SET quantity = ? WHERE id = ?', [newQty, id]);
    res.json({ message: `${item.item_name} restocked successfully`, newQuantity: newQty });
  } catch (error) {
    console.error('Error restocking item:', error);
    res.status(500).json({ message: 'Server error restocking item' });
  }
});

module.exports = router;
