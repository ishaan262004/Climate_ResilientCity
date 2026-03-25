// Serverless entry point for Vercel
// Exports the Express app as a default handler for all /api/* routes
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', 'server', '.env') });
if (!process.env.MONGODB_URI) {
  require('dotenv').config({ path: path.join(__dirname, '..', '.env') });
}

const express = require('express');
const cors = require('cors');

const app = express();

// Middleware
app.use(cors({ origin: '*', credentials: true }));
app.use(express.json());

// Connect to MongoDB (graceful — won't crash if no DB)
try {
  const connectDB = require('../server/config/db');
  connectDB();
} catch (e) {
  console.warn('DB connection skipped:', e.message);
}

// Routes — each wrapped in try/catch so one broken route doesn't kill the whole app
const routeMap = {
  '/api/auth': '../server/routes/auth',
  '/api/reports': '../server/routes/reports',
  '/api/alerts': '../server/routes/alerts',
  '/api/aqi': '../server/routes/aqi',
  '/api/weather': '../server/routes/weather',
  '/api/climate-risk': '../server/routes/climateRisk',
  '/api/aqi-map': '../server/routes/aqiMap',
};

Object.entries(routeMap).forEach(([path, mod]) => {
  try {
    app.use(path, require(mod));
  } catch (e) {
    console.warn(`Route ${path} failed to load:`, e.message);
    // Return 503 for failed routes instead of crashing
    app.use(path, (req, res) => {
      res.status(503).json({ error: `Service unavailable: ${path}`, message: e.message });
    });
  }
});

// Gemini routes
try {
  app.use('/api', require('../server/routes/gemini'));
} catch (e) {
  console.warn('Gemini routes failed to load:', e.message);
}

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString(), env: 'vercel' });
});

// Catch-all for unknown API routes
app.use('/api/*', (req, res) => {
  res.status(404).json({ error: 'API route not found' });
});

module.exports = app;
