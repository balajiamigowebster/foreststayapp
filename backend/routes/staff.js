const express = require('express');
const router = express.Router();
const db = require('../config/db');

// @desc    Get all staff
// @route   GET /api/staff
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM staff ORDER BY id ASC');
    res.json(rows);
  } catch (error) {
    console.error('Error fetching staff:', error);
    res.status(500).json({ message: 'Server error fetching staff' });
  }
});

// @desc    Add new staff member
// @route   POST /api/staff
router.post('/', async (req, res) => {
  const { name, role, status, type, phone, email, rating, assigned_tasks, today_attendance, monthly_base, daily_rate, days_worked, half_days, bonus, deductions, shift } = req.body;
  try {
    await db.query(
      `INSERT INTO staff (name, role, status, type, phone, email, rating, assigned_tasks, today_attendance, monthly_base, daily_rate, days_worked, half_days, bonus, deductions, shift) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        name, 
        role, 
        status || 'Active', 
        type || 'Permanent', 
        phone || '', 
        email || '', 
        rating || 'Good', 
        assigned_tasks || '', 
        today_attendance || 'Present', 
        parseFloat(monthly_base) || 0, 
        parseFloat(daily_rate) || 0, 
        parseInt(days_worked) || 0, 
        parseInt(half_days) || 0, 
        parseFloat(bonus) || 0, 
        parseFloat(deductions) || 0, 
        shift || 'Morning Shift'
      ]
    );
    res.status(201).json({ message: 'Staff member added successfully' });
  } catch (error) {
    console.error('Error adding staff:', error);
    res.status(500).json({ message: 'Server error adding staff' });
  }
});

// @desc    Update staff member (attendance, wage days, or profile)
// @route   PUT /api/staff/:id
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { name, role, status, type, phone, email, rating, assigned_tasks, today_attendance, monthly_base, daily_rate, days_worked, half_days, bonus, deductions, shift } = req.body;
  try {
    await db.query(
      `UPDATE staff SET name = ?, role = ?, status = ?, type = ?, phone = ?, email = ?, rating = ?, assigned_tasks = ?, today_attendance = ?, monthly_base = ?, daily_rate = ?, days_worked = ?, half_days = ?, bonus = ?, deductions = ?, shift = ? WHERE id = ?`,
      [
        name, 
        role, 
        status, 
        type, 
        phone, 
        email, 
        rating, 
        assigned_tasks, 
        today_attendance, 
        parseFloat(monthly_base) || 0, 
        parseFloat(daily_rate) || 0, 
        parseInt(days_worked) || 0, 
        parseInt(half_days) || 0, 
        parseFloat(bonus) || 0, 
        parseFloat(deductions) || 0, 
        shift,
        id
      ]
    );
    res.json({ message: 'Staff details updated successfully' });
  } catch (error) {
    console.error('Error updating staff:', error);
    res.status(500).json({ message: 'Server error updating staff' });
  }
});

// @desc    Delete staff member
// @route   DELETE /api/staff/:id
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await db.query('DELETE FROM staff WHERE id = ?', [id]);
    res.json({ message: 'Staff member deleted successfully' });
  } catch (error) {
    console.error('Error deleting staff:', error);
    res.status(500).json({ message: 'Server error deleting staff' });
  }
});

module.exports = router;
