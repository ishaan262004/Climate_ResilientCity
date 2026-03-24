const express = require('express');
const router = express.Router();
const Alert = require('../models/Alert');

// POST /api/alerts
router.post('/', async (req, res) => {
  try {
    const { type, severity, title, message } = req.body;
    const alert = new Alert({ type, severity, title, message });
    await alert.save();

    // Emit via Socket.IO for real-time updates
    if (req.app.get('io')) {
      req.app.get('io').emit('newAlert', alert);
    }

    res.status(201).json(alert);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/alerts
router.get('/', async (req, res) => {
  try {
    const alerts = await Alert.find({ active: true }).sort({ createdAt: -1 });
    res.json(alerts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
