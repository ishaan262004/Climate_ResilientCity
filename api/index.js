// Serverless entry point for Vercel
// Exports the Express app as a module for Vercel serverless functions
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const connectDB = require('../server/config/db');

const app = express();

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || '*',
  credentials: true
}));
app.use(express.json());

// Connect to MongoDB (graceful — won't crash if no DB)
connectDB();

// Routes
app.use('/api/auth', require('../server/routes/auth'));
app.use('/api/reports', require('../server/routes/reports'));
app.use('/api/alerts', require('../server/routes/alerts'));
app.use('/api/aqi', require('../server/routes/aqi'));
app.use('/api/weather', require('../server/routes/weather'));
app.use('/api/climate-risk', require('../server/routes/climateRisk'));
app.use('/api', require('../server/routes/gemini'));
app.use('/api/aqi-map', require('../server/routes/aqiMap'));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString(), env: 'vercel' });
});

module.exports = app;
