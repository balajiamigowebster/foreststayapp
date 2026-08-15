// app.js - cPanel Node.js Application Bootloader redirection
const path = require('path');

try {
  // Load dotenv from backend node_modules and point to backend/.env
  const dotenv = require(path.join(__dirname, 'backend', 'node_modules', 'dotenv'));
  dotenv.config({ path: path.join(__dirname, 'backend', '.env') });
} catch (e) {
  console.log('Dotenv bootloader warning:', e.message);
}

// Execute the main Express server
require('./backend/server.js');
