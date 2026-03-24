const express = require('express');
const router = express.Router();

// Mock AQI data for Delhi areas - realistic values with variation
const getAQIData = () => {
  const areas = [
    { name: 'Rohini', baseAQI: 180 },
    { name: 'Dwarka', baseAQI: 145 },
    { name: 'Anand Vihar', baseAQI: 280 },
    { name: 'Connaught Place', baseAQI: 160 },
    { name: 'ITO', baseAQI: 210 },
    { name: 'IGI Airport (T3)', baseAQI: 155 },
    { name: 'Nehru Nagar', baseAQI: 230 },
    { name: 'Punjabi Bagh', baseAQI: 195 }
  ];

  return areas.map(area => {
    const variation = Math.floor(Math.random() * 40) - 20;
    const aqi = Math.max(0, area.baseAQI + variation);

    let category, color;
    if (aqi <= 50) { category = 'Good'; color = '#22c55e'; }
    else if (aqi <= 100) { category = 'Moderate'; color = '#eab308'; }
    else if (aqi <= 150) { category = 'Unhealthy for Sensitive'; color = '#f97316'; }
    else if (aqi <= 200) { category = 'Unhealthy'; color = '#ef4444'; }
    else if (aqi <= 300) { category = 'Very Unhealthy'; color = '#a855f7'; }
    else { category = 'Hazardous'; color = '#7f1d1d'; }

    return {
      area: area.name,
      aqi,
      category,
      color,
      pm25: Math.round(aqi * 0.6 + Math.random() * 10),
      pm10: Math.round(aqi * 0.8 + Math.random() * 15),
      lastUpdated: new Date().toISOString()
    };
  });
};

// GET /api/aqi
router.get('/', (req, res) => {
  res.json({
    city: 'Delhi',
    data: getAQIData(),
    timestamp: new Date().toISOString()
  });
});

module.exports = router;
