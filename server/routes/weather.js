const express = require('express');
const router = express.Router();

// Mock weather data for Delhi
const getWeatherData = () => {
  const conditions = [
    { condition: 'Hazy', icon: '🌫️' },
    { condition: 'Partly Cloudy', icon: '⛅' },
    { condition: 'Sunny', icon: '☀️' },
    { condition: 'Overcast', icon: '☁️' }
  ];

  const selected = conditions[Math.floor(Math.random() * conditions.length)];

  return {
    city: 'Delhi',
    temperature: Math.round(28 + Math.random() * 10),
    feelsLike: Math.round(30 + Math.random() * 12),
    humidity: Math.round(45 + Math.random() * 30),
    windSpeed: Math.round(8 + Math.random() * 15),
    windDirection: 'NW',
    condition: selected.condition,
    icon: selected.icon,
    visibility: Math.round(2 + Math.random() * 6),
    uvIndex: Math.round(4 + Math.random() * 6),
    pressure: Math.round(1008 + Math.random() * 10),
    sunrise: '06:15 AM',
    sunset: '06:30 PM',
    lastUpdated: new Date().toISOString()
  };
};

// GET /api/weather
router.get('/', (req, res) => {
  res.json(getWeatherData());
});

module.exports = router;
