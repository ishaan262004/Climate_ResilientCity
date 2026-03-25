/**
 * Gemini AI Routes
 * GET  /api/story?city=Delhi            — AI-generated climate narrative
 * POST /api/chat                         — Gemini chatbot interaction
 * POST /api/chat/clear                   — Clear chat session
 */

const express = require('express');
const router = express.Router();
const { generateStory } = require('../utils/geminiStory');
const { chatWithAI, clearSession } = require('../utils/geminiChatbot');
const {
  predictFlood,
  predictHeatwave,
  predictAirPollution,
  computeResilienceScore,
} = require('../utils/climatePredictor');

// ---------------------------------------------------------------------------
// Helper: fetch weather + risk data for a city (reuses climate-risk logic)
// ---------------------------------------------------------------------------
async function getClimateContext(city) {
  // Geocode
  let lat = 28.6139, lon = 77.2090, resolvedCity = city || 'Delhi';
  try {
    const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`;
    const geoRes = await fetch(geoUrl);
    if (geoRes.ok) {
      const geoData = await geoRes.json();
      if (geoData.results?.length > 0) {
        lat = geoData.results[0].latitude;
        lon = geoData.results[0].longitude;
        resolvedCity = geoData.results[0].name;
      }
    }
  } catch (e) { /* use defaults */ }

  // Weather
  const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,precipitation,weather_code&daily=precipitation_sum&timezone=auto&forecast_days=1`;
  const weatherRes = await fetch(weatherUrl);
  if (!weatherRes.ok) throw new Error('Weather fetch failed');
  const weatherData = await weatherRes.json();
  const c = weatherData.current;
  const rainfall = weatherData.daily?.precipitation_sum?.[0] ?? c.precipitation ?? 0;

  // AQI
  let aqi = 150;
  try {
    const aqiUrl = `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${lat}&longitude=${lon}&current=pm2_5,pm10,us_aqi`;
    const aqiRes = await fetch(aqiUrl);
    if (aqiRes.ok) {
      const aqiData = await aqiRes.json();
      aqi = aqiData.current?.us_aqi ?? aqiData.current?.pm2_5 * 2 ?? 150;
    }
  } catch (e) { /* fallback 150 */ }

  const weather = {
    temperature: Math.round(c.temperature_2m),
    humidity: Math.round(c.relative_humidity_2m),
    rainfall: parseFloat(rainfall.toFixed(1)),
    aqi,
  };

  // Risk predictions
  const flood = predictFlood(weather.rainfall, weather.humidity);
  const heatwave = predictHeatwave(weather.temperature, weather.humidity);
  const pollution = predictAirPollution(aqi);
  const risk = { flood, heatwave, pollution };
  const resilience = computeResilienceScore(risk);

  return { city: resolvedCity, weather, risk, resilience };
}

// ---------------------------------------------------------------------------
// GET /api/story?city=Delhi
// ---------------------------------------------------------------------------
router.get('/story', async (req, res) => {
  const city = req.query.city || 'Delhi';

  try {
    const ctx = await getClimateContext(city);
    const story = await generateStory(ctx.city, ctx.weather, ctx.risk, ctx.resilience);
    return res.json({
      city: ctx.city,
      story,
      weather: ctx.weather,
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    console.error('Story generation error:', err.message);
    return res.status(500).json({
      error: 'AI story generation temporarily unavailable.',
      fallback: `${city} faces ongoing climate challenges. Current conditions are being monitored. Stay informed and follow local advisories for safety updates.`,
    });
  }
});

// ---------------------------------------------------------------------------
// POST /api/chat
// Body: { message: string, city?: string, sessionId?: string }
// ---------------------------------------------------------------------------
router.post('/chat', async (req, res) => {
  const { message, city = 'Delhi', sessionId } = req.body;

  if (!message || !message.trim()) {
    return res.status(400).json({ error: 'Message is required.' });
  }

  try {
    // Fetch live context for the city
    const ctx = await getClimateContext(city);

    const result = await chatWithAI(message.trim(), ctx, sessionId || undefined);
    return res.json({
      reply: result.reply,
      sessionId: result.sessionId,
      city: ctx.city,
    });
  } catch (err) {
    console.error('Chat error:', err.message);
    return res.status(500).json({
      error: 'AI service temporarily unavailable.',
      reply: 'I\'m sorry, I\'m having trouble connecting right now. Please try again in a moment. 🌍',
    });
  }
});

// ---------------------------------------------------------------------------
// POST /api/chat/clear
// Body: { sessionId: string }
// ---------------------------------------------------------------------------
router.post('/chat/clear', (req, res) => {
  const { sessionId } = req.body;
  if (sessionId) clearSession(sessionId);
  return res.json({ success: true });
});

module.exports = router;
