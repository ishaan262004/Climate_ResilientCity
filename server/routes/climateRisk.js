/**
 * Climate Risk API Route
 * GET  /api/climate-risk?city=Delhi              — Full risk prediction for a city
 * POST /api/climate-risk/alert                   — Store a manual high-risk alert
 * GET  /api/climate-risk/alerts                  — Retrieve stored alerts
 */

const express = require('express');
const router = express.Router();
const {
  predictFlood,
  predictHeatwave,
  predictAirPollution,
  computeResilienceScore,
  generateRecommendations,
} = require('../utils/climatePredictor');

// ---------------------------------------------------------------------------
// In-memory alert store (lightweight, no DB dependency)
// ---------------------------------------------------------------------------
const alertStore = [];

// ---------------------------------------------------------------------------
// Helpers: fetch weather + AQI data from external sources
// ---------------------------------------------------------------------------

/**
 * Fetch current weather for a city from Open-Meteo (free, no key required).
 * Falls back to Delhi coordinates if geocoding fails.
 * @param {string} city
 */
async function fetchWeatherForCity(city) {
  // Step 1: Geocode city to lat/lon via Open-Meteo geocoding API
  let lat = 28.6139; // default: Delhi
  let lon = 77.2090;
  let resolvedCity = city || 'Delhi';

  try {
    const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`;
    const geoRes = await fetch(geoUrl);
    if (geoRes.ok) {
      const geoData = await geoRes.json();
      if (geoData.results && geoData.results.length > 0) {
        lat = geoData.results[0].latitude;
        lon = geoData.results[0].longitude;
        resolvedCity = geoData.results[0].name;
      }
    }
  } catch (e) {
    console.warn('Geocoding failed, using Delhi defaults:', e.message);
  }

  // Step 2: Fetch weather from Open-Meteo
  const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,precipitation,weather_code&daily=precipitation_sum&timezone=auto&forecast_days=1`;

  const weatherRes = await fetch(weatherUrl);
  if (!weatherRes.ok) throw new Error(`Open-Meteo weather failed: ${weatherRes.status}`);
  const weatherData = await weatherRes.json();

  const c = weatherData.current;
  // Use 24h precipitation forecast sum as rainfall proxy; fallback to 0
  const rainfall = weatherData.daily?.precipitation_sum?.[0] ?? c.precipitation ?? 0;

  return {
    city: resolvedCity,
    lat,
    lon,
    temperature: Math.round(c.temperature_2m),
    humidity: Math.round(c.relative_humidity_2m),
    rainfall: parseFloat(rainfall.toFixed(1)),
  };
}

/**
 * Fetch AQI for coordinates using Open-Meteo Air Quality API (free).
 * Returns a US-EPA-style AQI derived from PM2.5.
 */
async function fetchAQIForCoords(lat, lon) {
  try {
    const aqiUrl = `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${lat}&longitude=${lon}&current=pm2_5,pm10,us_aqi`;
    const aqiRes = await fetch(aqiUrl);
    if (!aqiRes.ok) throw new Error(`AQI API: ${aqiRes.status}`);
    const aqiData = await aqiRes.json();
    return aqiData.current?.us_aqi ?? aqiData.current?.pm2_5 * 2 ?? 120; // fallback estimate
  } catch (e) {
    console.warn('AQI fetch failed, using fallback:', e.message);
    return 150; // default medium AQI fallback
  }
}

// ---------------------------------------------------------------------------
// GET /api/climate-risk
// ---------------------------------------------------------------------------
router.get('/', async (req, res) => {
  const city = req.query.city || 'Delhi';

  try {
    // 1. Fetch real-time weather
    const weather = await fetchWeatherForCity(city);

    // 2. Fetch AQI
    const aqi = await fetchAQIForCoords(weather.lat, weather.lon);

    // 3. Run predictions
    const floodRisk = predictFlood(weather.rainfall, weather.humidity);
    const heatwaveRisk = predictHeatwave(weather.temperature, weather.humidity);
    const pollutionRisk = predictAirPollution(aqi);

    const risks = { flood: floodRisk, heatwave: heatwaveRisk, pollution: pollutionRisk };

    // 4. Compute composite resilience score
    const resilience = computeResilienceScore(risks);

    // 5. Generate recommendations
    const recommendations = generateRecommendations(risks);

    // 6. Determine if any risk is critical (auto-store alert)
    const highRisks = Object.entries(risks)
      .filter(([, v]) => v.risk === 'High')
      .map(([k]) => k);

    if (highRisks.length > 0) {
      const autoAlert = {
        id: `auto-${Date.now()}`,
        city: weather.city,
        risks: highRisks,
        severity: 'high',
        message: `High climate risk detected in ${weather.city}: ${highRisks.join(', ')}`,
        timestamp: new Date().toISOString(),
        auto: true,
      };
      // Keep only last 50 alerts in memory
      if (alertStore.length >= 50) alertStore.shift();
      alertStore.push(autoAlert);
    }

    return res.json({
      city: weather.city,
      timestamp: new Date().toISOString(),
      weather: {
        temperature: weather.temperature,
        humidity: weather.humidity,
        rainfall: weather.rainfall,
        aqi,
      },
      risk: {
        flood: floodRisk,
        heatwave: heatwaveRisk,
        pollution: pollutionRisk,
      },
      resilience,
      recommendations,
      highRisks,
    });
  } catch (err) {
    console.error('Climate risk prediction error:', err.message);
    return res.status(500).json({ error: 'Failed to compute climate risk. Please try again.' });
  }
});

// ---------------------------------------------------------------------------
// POST /api/climate-risk/alert  — manually store an alert (from frontend)
// ---------------------------------------------------------------------------
router.post('/alert', (req, res) => {
  const { city, risks, message, severity = 'high' } = req.body;

  if (!city || !risks) {
    return res.status(400).json({ error: 'city and risks are required.' });
  }

  const alert = {
    id: `manual-${Date.now()}`,
    city,
    risks: Array.isArray(risks) ? risks : [risks],
    severity,
    message: message || `Manual alert for ${city}`,
    timestamp: new Date().toISOString(),
    auto: false,
  };

  if (alertStore.length >= 50) alertStore.shift();
  alertStore.push(alert);

  return res.status(201).json({ success: true, alert });
});

// ---------------------------------------------------------------------------
// GET /api/climate-risk/alerts  — list stored alerts
// ---------------------------------------------------------------------------
router.get('/alerts', (req, res) => {
  const limit = Math.min(parseInt(req.query.limit) || 20, 50);
  return res.json([...alertStore].reverse().slice(0, limit));
});

module.exports = router;
