const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { protect, adminOnly } = require('../middleware/authMiddleware');

// Group cabins rows from flat JOIN queries into structures with nested amenities arrays
const groupCabins = (rows) => {
  const cabinMap = {};
  rows.forEach(row => {
    if (!cabinMap[row.id]) {
      cabinMap[row.id] = {
        id: row.id,
        name: row.name,
        description: row.description,
        price_per_night: parseFloat(row.price_per_night),
        max_guests: row.max_guests,
        location: row.location,
        image_url: row.image_url,
        rating: parseFloat(row.rating || 0),
        created_at: row.created_at,
        amenities: []
      };
    }
    if (row.amenity_id) {
      cabinMap[row.id].amenities.push({
        id: row.amenity_id,
        name: row.amenity_name,
        icon: row.amenity_icon
      });
    }
  });
  return Object.values(cabinMap);
};

// @desc    Get all cabins (with optional search filters)
// @route   GET /api/cabins
// @access  Public
router.get('/', async (req, res) => {
  const { location, guests, minPrice, maxPrice } = req.query;

  try {
    let sql = `
      SELECT c.*, a.id AS amenity_id, a.name AS amenity_name, a.icon AS amenity_icon
      FROM cabins c
      LEFT JOIN cabin_amenities ca ON c.id = ca.cabin_id
      LEFT JOIN amenities a ON ca.amenity_id = a.id
    `;
    
    const conditions = [];
    const params = [];

    if (location) {
      conditions.push('c.location LIKE ?');
      params.push(`%${location}%`);
    }
    if (guests) {
      conditions.push('c.max_guests >= ?');
      params.push(parseInt(guests));
    }
    if (minPrice) {
      conditions.push('c.price_per_night >= ?');
      params.push(parseFloat(minPrice));
    }
    if (maxPrice) {
      conditions.push('c.price_per_night <= ?');
      params.push(parseFloat(maxPrice));
    }

    if (conditions.length > 0) {
      // Find the cabins that match the criteria first to avoid pagination/join duplicates
      let subQuery = 'SELECT id FROM cabins c';
      subQuery += ' WHERE ' + conditions.join(' AND ');
      
      const [cabinIdsRows] = await db.query(subQuery, params);
      
      if (cabinIdsRows.length === 0) {
        return res.json([]);
      }
      
      const matchedIds = cabinIdsRows.map(r => r.id);
      sql += ` WHERE c.id IN (${matchedIds.join(',')})`;
    }

    const [rows] = await db.query(sql);
    const cabins = groupCabins(rows);
    res.json(cabins);
  } catch (error) {
    console.error('Error fetching cabins:', error);
    res.status(500).json({ message: 'Server error fetching cabins' });
  }
});

// @desc    Get single cabin by ID (includes amenities & reviews)
// @route   GET /api/cabins/:id
// @access  Public
router.get('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    // 1. Fetch Cabin and its amenities
    const [cabinRows] = await db.query(`
      SELECT c.*, a.id AS amenity_id, a.name AS amenity_name, a.icon AS amenity_icon
      FROM cabins c
      LEFT JOIN cabin_amenities ca ON c.id = ca.cabin_id
      LEFT JOIN amenities a ON ca.amenity_id = a.id
      WHERE c.id = ?
    `, [id]);

    if (cabinRows.length === 0) {
      return res.status(404).json({ message: 'Cabin not found' });
    }

    const grouped = groupCabins(cabinRows);
    const cabin = grouped[0];

    // 2. Fetch Reviews and reviewer name
    const [reviews] = await db.query(`
      SELECT r.id, r.rating, r.comment, r.created_at, u.name AS user_name
      FROM reviews r
      JOIN users u ON r.user_id = u.id
      WHERE r.cabin_id = ?
      ORDER BY r.created_at DESC
    `, [id]);

    cabin.reviews = reviews;

    res.json(cabin);
  } catch (error) {
    console.error('Error fetching cabin detail:', error);
    res.status(500).json({ message: 'Server error fetching cabin details' });
  }
});

// @desc    Create a new cabin listing
// @route   POST /api/cabins
// @access  Private/Admin
router.post('/', protect, adminOnly, async (req, res) => {
  const { name, description, price_per_night, max_guests, location, image_url, amenities } = req.body;

  if (!name || !description || !price_per_night || !max_guests || !location || !image_url) {
    return res.status(400).json({ message: 'Please provide all required fields' });
  }

  try {
    // 1. Insert Cabin
    const [result] = await db.query(
      `INSERT INTO cabins (name, description, price_per_night, max_guests, location, image_url) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [name, description, price_per_night, max_guests, location, image_url]
    );

    const cabinId = result.insertId;

    // 2. Insert Amenities linkages if provided
    if (amenities && Array.isArray(amenities) && amenities.length > 0) {
      const links = amenities.map(amenityId => [cabinId, amenityId]);
      await db.query(
        'INSERT INTO cabin_amenities (cabin_id, amenity_id) VALUES ?',
        [links]
      );
    }

    res.status(201).json({ message: 'Cabin created successfully', cabinId });
  } catch (error) {
    console.error('Error creating cabin:', error);
    res.status(500).json({ message: 'Server error creating cabin' });
  }
});

// @desc    Update a cabin listing
// @route   PUT /api/cabins/:id
// @access  Private/Admin
router.put('/:id', protect, adminOnly, async (req, res) => {
  const { id } = req.params;
  const { name, description, price_per_night, max_guests, location, image_url, amenities } = req.body;

  try {
    // Check if cabin exists
    const [existing] = await db.query('SELECT * FROM cabins WHERE id = ?', [id]);
    if (existing.length === 0) {
      return res.status(404).json({ message: 'Cabin not found' });
    }

    // 1. Update cabin fields
    await db.query(
      `UPDATE cabins SET name = ?, description = ?, price_per_night = ?, max_guests = ?, location = ?, image_url = ?
       WHERE id = ?`,
      [name, description, price_per_night, max_guests, location, image_url, id]
    );

    // 2. Update amenities: delete existing linkages first, then insert new ones
    await db.query('DELETE FROM cabin_amenities WHERE cabin_id = ?', [id]);
    if (amenities && Array.isArray(amenities) && amenities.length > 0) {
      const links = amenities.map(amenityId => [id, amenityId]);
      await db.query(
        'INSERT INTO cabin_amenities (cabin_id, amenity_id) VALUES ?',
        [links]
      );
    }

    res.json({ message: 'Cabin updated successfully' });
  } catch (error) {
    console.error('Error updating cabin:', error);
    res.status(500).json({ message: 'Server error updating cabin' });
  }
});

// @desc    Delete a cabin listing
// @route   DELETE /api/cabins/:id
// @access  Private/Admin
router.delete('/:id', protect, adminOnly, async (req, res) => {
  const { id } = req.params;

  try {
    const [existing] = await db.query('SELECT * FROM cabins WHERE id = ?', [id]);
    if (existing.length === 0) {
      return res.status(404).json({ message: 'Cabin not found' });
    }

    await db.query('DELETE FROM cabins WHERE id = ?', [id]);
    res.json({ message: 'Cabin deleted successfully' });
  } catch (error) {
    console.error('Error deleting cabin:', error);
    res.status(500).json({ message: 'Server error deleting cabin' });
  }
});

module.exports = router;
