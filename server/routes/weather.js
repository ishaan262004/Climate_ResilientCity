const express = require('express');
const router = express.Router();

const DELHI_LAT = 28.6139;
const DELHI_LON = 77.2090;

// Weather condition mapping for Open-Meteo WMO codes
const wmoCodeToCondition = (code) => {
  const map = {
    0: { condition: 'Clear Sky', icon: '01d' },
    1: { condition: 'Mainly Clear', icon: '02d' },
    2: { condition: 'Partly Cloudy', icon: '03d' },
    3: { condition: 'Overcast', icon: '04d' },
    45: { condition: 'Foggy', icon: '50d' },
    48: { condition: 'Depositing Rime Fog', icon: '50d' },
    51: { condition: 'Light Drizzle', icon: '09d' },
    53: { condition: 'Moderate Drizzle', icon: '09d' },
    55: { condition: 'Dense Drizzle', icon: '09d' },
    61: { condition: 'Slight Rain', icon: '10d' },
    63: { condition: 'Moderate Rain', icon: '10d' },
    65: { condition: 'Heavy Rain', icon: '10d' },
    71: { condition: 'Slight Snow', icon: '13d' },
    73: { condition: 'Moderate Snow', icon: '13d' },
    75: { condition: 'Heavy Snow', icon: '13d' },
    80: { condition: 'Slight Showers', icon: '09d' },
    81: { condition: 'Moderate Showers', icon: '09d' },
    82: { condition: 'Violent Showers', icon: '09d' },
    95: { condition: 'Thunderstorm', icon: '11d' },
    96: { condition: 'Thunderstorm with Hail', icon: '11d' },
    99: { condition: 'Thunderstorm with Heavy Hail', icon: '11d' },
  };
  return map[code] || { condition: 'Unknown', icon: '03d' };
};

// Fetch from OpenWeather API (primary)
async function fetchOpenWeather() {
  const apiKey = process.env.OPENWEATHER_API_KEY;
  if (!apiKey) throw new Error('No OpenWeather API key');

  const currentUrl = `https://api.openweathermap.org/data/2.5/weather?q=Delhi,IN&appid=${apiKey}&units=metric`;
  const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=Delhi,IN&appid=${apiKey}&units=metric`;

  const [currentRes, forecastRes] = await Promise.all([
    fetch(currentUrl),
    fetch(forecastUrl),
  ]);

  if (!currentRes.ok) throw new Error(`OpenWeather current: ${currentRes.status}`);
  if (!forecastRes.ok) throw new Error(`OpenWeather forecast: ${forecastRes.status}`);

  const current = await currentRes.json();
  const forecast = await forecastRes.json();

  // Build 5-day forecast from 3-hour intervals
  const dailyMap = {};
  for (const item of forecast.list) {
    const date = item.dt_txt.split(' ')[0];
    if (!dailyMap[date]) {
      dailyMap[date] = { temps: [], conditions: [], icons: [] };
    }
    dailyMap[date].temps.push(item.main.temp);
    dailyMap[date].conditions.push(item.weather[0].main);
    dailyMap[date].icons.push(item.weather[0].icon);
  }

  const today = new Date().toISOString().split('T')[0];
  const forecastDays = Object.entries(dailyMap)
    .filter(([date]) => date !== today)
    .slice(0, 5)
    .map(([date, data]) => ({
      date,
      day: new Date(date).toLocaleDateString('en-US', { weekday: 'short' }),
      tempHigh: Math.round(Math.max(...data.temps)),
      tempLow: Math.round(Math.min(...data.temps)),
      condition: data.conditions[Math.floor(data.conditions.length / 2)],
      icon: data.icons[Math.floor(data.icons.length / 2)].replace('n', 'd'),
    }));

  return {
    source: 'openweather',
    current: {
      city: 'Delhi',
      temperature: Math.round(current.main.temp),
      feelsLike: Math.round(current.main.feels_like),
      tempMin: Math.round(current.main.temp_min),
      tempMax: Math.round(current.main.temp_max),
      humidity: current.main.humidity,
      pressure: current.main.pressure,
      windSpeed: Math.round(current.wind.speed * 3.6), // m/s to km/h
      windDeg: current.wind.deg,
      visibility: Math.round((current.visibility || 10000) / 1000),
      condition: current.weather[0].main,
      description: current.weather[0].description,
      icon: current.weather[0].icon,
      sunrise: new Date(current.sys.sunrise * 1000).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true, timeZone: 'Asia/Kolkata' }),
      sunset: new Date(current.sys.sunset * 1000).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true, timeZone: 'Asia/Kolkata' }),
      uvIndex: null, // Not in free tier
      lastUpdated: new Date().toISOString(),
    },
    forecast: forecastDays,
  };
}

// Fetch from Open-Meteo API (fallback, no key needed)
async function fetchOpenMeteo() {
  const currentUrl = `https://api.open-meteo.com/v1/forecast?latitude=${DELHI_LAT}&longitude=${DELHI_LON}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m,wind_direction_10m,surface_pressure&daily=temperature_2m_max,temperature_2m_min,weather_code,sunrise,sunset,uv_index_max&timezone=Asia%2FKolkata&forecast_days=6`;

  const res = await fetch(currentUrl);
  if (!res.ok) throw new Error(`Open-Meteo: ${res.status}`);
  const data = await res.json();

  const c = data.current;
  const d = data.daily;
  const { condition, icon } = wmoCodeToCondition(c.weather_code);

  const forecastDays = d.time.slice(1, 6).map((date, i) => {
    const idx = i + 1;
    const fc = wmoCodeToCondition(d.weather_code[idx]);
    return {
      date,
      day: new Date(date).toLocaleDateString('en-US', { weekday: 'short' }),
      tempHigh: Math.round(d.temperature_2m_max[idx]),
      tempLow: Math.round(d.temperature_2m_min[idx]),
      condition: fc.condition,
      icon: fc.icon,
    };
  });

  return {
    source: 'open-meteo',
    current: {
      city: 'Delhi',
      temperature: Math.round(c.temperature_2m),
      feelsLike: Math.round(c.apparent_temperature),
      tempMin: Math.round(d.temperature_2m_min[0]),
      tempMax: Math.round(d.temperature_2m_max[0]),
      humidity: Math.round(c.relative_humidity_2m),
      pressure: Math.round(c.surface_pressure),
      windSpeed: Math.round(c.wind_speed_10m),
      windDeg: c.wind_direction_10m,
      visibility: null,
      condition,
      description: condition.toLowerCase(),
      icon,
      sunrise: new Date(d.sunrise[0]).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true, timeZone: 'Asia/Kolkata' }),
      sunset: new Date(d.sunset[0]).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true, timeZone: 'Asia/Kolkata' }),
      uvIndex: d.uv_index_max ? Math.round(d.uv_index_max[0]) : null,
      lastUpdated: new Date().toISOString(),
    },
    forecast: forecastDays,
  };
}

// GET /api/weather — current + forecast with fallback
router.get('/', async (req, res) => {
  try {
    const data = await fetchOpenWeather();
    return res.json(data);
  } catch (err) {
    console.warn('OpenWeather failed, falling back to Open-Meteo:', err.message);
  }

  try {
    const data = await fetchOpenMeteo();
    return res.json(data);
  } catch (err) {
    console.error('Open-Meteo also failed:', err.message);
    return res.status(503).json({ error: 'Weather data unavailable. Please try again later.' });
  }
});

// GET /api/weather/forecast — 5-day only
router.get('/forecast', async (req, res) => {
  try {
    const data = await fetchOpenWeather();
    return res.json({ source: data.source, forecast: data.forecast });
  } catch (err) {
    console.warn('OpenWeather forecast failed, falling back:', err.message);
  }

  try {
    const data = await fetchOpenMeteo();
    return res.json({ source: data.source, forecast: data.forecast });
  } catch (err) {
    console.error('Forecast fallback also failed:', err.message);
    return res.status(503).json({ error: 'Forecast data unavailable.' });
  }
});

module.exports = router;
