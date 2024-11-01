const express = require('express');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/auth');

const app = express();

// Middleware to parse JSON
app.use(bodyParser.json());

// Routes
app.use('/auth', authRoutes);

module.exports = app;
