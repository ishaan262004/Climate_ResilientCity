const mongoose = require('mongoose');

const alertSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
    enum: ['heatwave', 'flood', 'aqi', 'storm', 'other']
  },
  severity: {
    type: String,
    required: true,
    enum: ['low', 'medium', 'high', 'critical']
  },
  title: {
    type: String,
    required: true,
    maxlength: 200
  },
  message: {
    type: String,
    required: true,
    maxlength: 1000
  },
  active: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Alert', alertSchema);
