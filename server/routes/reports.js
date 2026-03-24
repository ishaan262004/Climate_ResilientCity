const express = require('express');
const router = express.Router();
const Report = require('../models/Report');

// POST /api/reports
router.post('/', async (req, res) => {
  try {
    const { type, description, location, reportedBy } = req.body;
    const report = new Report({ type, description, location, reportedBy });
    await report.save();

    // Emit via Socket.IO if available
    if (req.app.get('io')) {
      req.app.get('io').emit('newReport', report);
    }

    res.status(201).json(report);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/reports
router.get('/', async (req, res) => {
  try {
    const reports = await Report.find().sort({ createdAt: -1 }).limit(50);
    res.json(reports);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
