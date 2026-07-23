const express = require('express');
const cors = require('cors');
const healthRoutes = require('./routes/health');
const errorHandler = require('./middleware/errorHandler');

const app = express();

// Middleware
// CORS allows our React frontend to communicate with this backend securely
app.use(cors()); 

// Built-in middleware to parse incoming JSON payloads in requests
app.use(express.json()); 

// Routes
app.get('/', (req, res) => {
  res.send('Welcome to the MediRush Backend API! The server is running perfectly.');
});

app.use('/api/health', healthRoutes);

// Global Error Handling Middleware (Must be the last middleware)
app.use(errorHandler);

module.exports = app;
