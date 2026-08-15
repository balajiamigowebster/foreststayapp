const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Initialize App
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// DB Connection Trigger
require('./config/db');

// Health Check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'ForestStay API is running smoothly' });
});

// Register Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/cabins', require('./routes/cabins'));
app.use('/api/bookings', require('./routes/bookings'));
app.use('/api/reviews', require('./routes/reviews'));
app.use('/api/dashboard', require('./routes/dashboard'));
app.use('/api/pos', require('./routes/pos'));
app.use('/api/passes', require('./routes/passes'));
app.use('/api/inventory', require('./routes/inventory'));
app.use('/api/treks', require('./routes/treks'));
app.use('/api/staff', require('./routes/staff'));

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Unhandled Error:', err.stack);
  res.status(500).json({
    message: 'An unexpected error occurred on the server',
    error: process.env.NODE_ENV === 'development' ? err.message : {}
  });
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`ForestStay server successfully started on port ${PORT}`);
});
