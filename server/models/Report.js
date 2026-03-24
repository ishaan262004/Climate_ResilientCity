const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
    enum: ['flood', 'pollution', 'heatwave', 'water-scarcity', 'deforestation', 'other']
  },
  description: {
    type: String,
    required: true,
    maxlength: 1000
  },
  location: {
    address: { type: String, required: true },
    lat: { type: Number },
    lng: { type: Number }
  },
  status: {
    type: String,
    enum: ['pending', 'acknowledged', 'resolved'],
    default: 'pending'
  },
  reportedBy: {
    type: String,
    default: 'Anonymous'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Report', reportSchema);
