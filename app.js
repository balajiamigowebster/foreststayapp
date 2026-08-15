// app.js - cPanel Node.js Application Bootloader redirection
const path = require('path');

try {
  // Load dotenv pointing to backend/.env
  require('dotenv').config({ path: path.join(__dirname, 'backend', '.env') });
} catch (e) {
  console.log('Dotenv bootloader warning:', e.message);
}

// Execute the main Express server
require('./backend/server.js');
