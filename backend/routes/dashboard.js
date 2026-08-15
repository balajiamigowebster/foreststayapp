const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { protect } = require('../middleware/authMiddleware');

// @desc    Get Operations Desk and Alert statistics
// @route   GET /api/dashboard/stats
// @access  Private (or Public for local demo convenience, we will protect it in production)
router.get('/stats', async (req, res) => {
  try {
    // 1. Calculate revenues
    // 1a. Stay Bookings Income
    const [staySum] = await db.query("SELECT SUM(total_price) as sum FROM bookings WHERE status = 'confirmed'");
    const stayIncome = parseFloat(staySum[0].sum || 0);

    // 1b. Cafe Orders Income
    const [cafeSum] = await db.query("SELECT SUM(total_amount) as sum FROM cafe_orders");
    const cafeIncome = parseFloat(cafeSum[0].sum || 0);

    // 1c. Visitor Passes Income
    const [passSum] = await db.query("SELECT SUM(price) as sum FROM visitor_passes");
    const passIncome = parseFloat(passSum[0].sum || 0);

    // 1d. Trekking Bookings Income
    const [trekSum] = await db.query("SELECT SUM(total_price) as sum FROM trek_bookings");
    const trekIncome = parseFloat(trekSum[0].sum || 0);

    const totalIncome = stayIncome + cafeIncome + passIncome + trekIncome;

    // 2. Occupancy metrics (Total capacity is 30 units)
    const todayStr = new Date().toISOString().split('T')[0];
    const [activeBookings] = await db.query(
      `SELECT COUNT(*) as count, SUM(guests_count) as guests 
       FROM bookings 
       WHERE status = 'confirmed' 
         AND check_in <= ? 
         AND check_out >= ?`,
      [todayStr, todayStr]
    );
    const occupiedUnits = activeBookings[0].count || 0;
    const guestsInHouse = activeBookings[0].guests || 0;
    const occupancyPercentage = Math.round((occupiedUnits / 30) * 100);

    // 3. Check-ins and Check-outs today
    const [checkInsToday] = await db.query(
      "SELECT COUNT(*) as count FROM bookings WHERE status = 'confirmed' AND check_in = ?",
      [todayStr]
    );
    const [checkOutsToday] = await db.query(
      "SELECT COUNT(*) as count FROM bookings WHERE status = 'confirmed' AND check_out = ?",
      [todayStr]
    );
    const arrivals = checkInsToday[0].count || 0;
    const departures = checkOutsToday[0].count || 0;

    // 4. Stock Alerts (Inventory checks)
    const [lowStockItems] = await db.query(
      "SELECT * FROM inventory WHERE quantity < min_required"
    );
    const lowStockCount = lowStockItems.length;

    // 5. Generate Operational Update Alerts
    const alerts = [];
    lowStockItems.forEach(item => {
      alerts.push(
        `${item.item_name} (${item.code}) is down to ${parseFloat(item.quantity)} ${item.unit}. Minimum required is ${parseFloat(item.min_required)} ${item.unit}.`
      );
    });

    res.json({
      todayIncome: totalIncome,
      breakdown: {
        stay: stayIncome,
        cafe: cafeIncome,
        passes: passIncome,
        treks: trekIncome
      },
      occupancy: {
        percentage: occupancyPercentage,
        occupiedUnits,
        totalUnits: 30,
        guests: guestsInHouse
      },
      arrivals,
      departures,
      stockStatus: lowStockCount > 0 ? `${lowStockCount} Items Low` : 'All Stock OK',
      alerts
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({ message: 'Server error compiling operational dashboard metrics' });
  }
});

module.exports = router;
