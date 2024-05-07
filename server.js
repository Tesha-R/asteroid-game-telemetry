// server.js
require('dotenv').config();

const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT;

// Serve all files in the 'public' directory, which includes HTML, JS, CSS, etc.
app.use(express.static('public'));

// Catch-all route to serve the main game HTML
// Handles all GET requests that aren't explicitly handled by other routes
app.get('*', (req, res) => {
  // Respond with the main 'index.html' file from the 'public' directory
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});