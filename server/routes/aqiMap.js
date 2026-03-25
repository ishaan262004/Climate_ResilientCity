/**
 * AQI Map Routes — WAQI API proxy for live AQI station data
 * GET /api/aqi-map/city?city=Delhi   — single city AQI
 * GET /api/aqi-map/delhi-stations    — all Delhi area stations via bounds API
 * GET /api/aqi-map/india             — major Indian cities AQI
 */

const express = require('express');
const router = express.Router();

const WAQI_TOKEN = process.env.WAQI_API_KEY;

// Major Indian cities for overview
const INDIA_CITIES = [
  { name: 'Delhi', lat: 28.6139, lng: 77.2090 },
  { name: 'Mumbai', lat: 19.0760, lng: 72.8777 },
  { name: 'Bangalore', lat: 12.9716, lng: 77.5946 },
  { name: 'Chennai', lat: 13.0827, lng: 80.2707 },
  { name: 'Kolkata', lat: 22.5726, lng: 88.3639 },
  { name: 'Hyderabad', lat: 17.3850, lng: 78.4867 },
  { name: 'Pune', lat: 18.5204, lng: 73.8567 },
  { name: 'Jaipur', lat: 26.9124, lng: 75.7873 },
  { name: 'Lucknow', lat: 26.8467, lng: 80.9462 },
  { name: 'Ahmedabad', lat: 23.0225, lng: 72.5714 },
  { name: 'Patna', lat: 25.6093, lng: 85.1376 },
  { name: 'Kanpur', lat: 26.4499, lng: 80.3319 },
  { name: 'Varanasi', lat: 25.3176, lng: 82.9739 },
  { name: 'Agra', lat: 27.1767, lng: 78.0081 },
  { name: 'Chandigarh', lat: 30.7333, lng: 76.7794 },
];

// Known Delhi monitoring station keywords (fallback if bounds API fails)
const DELHI_STATIONS_FALLBACK = [
  { name: 'Anand Vihar', lat: 28.6469, lng: 77.3164, keyword: 'anand vihar' },
  { name: 'ITO', lat: 28.6289, lng: 77.2405, keyword: 'ito' },
  { name: 'RK Puram', lat: 28.5635, lng: 77.1769, keyword: 'r.k. puram' },
  { name: 'Dwarka', lat: 28.5921, lng: 77.0460, keyword: 'dwarka' },
  { name: 'Mandir Marg', lat: 28.6364, lng: 77.2014, keyword: 'mandir marg' },
  { name: 'Punjabi Bagh', lat: 28.6683, lng: 77.1167, keyword: 'punjabi bagh' },
  { name: 'Rohini', lat: 28.7323, lng: 77.1170, keyword: 'rohini' },
  { name: 'Nehru Nagar', lat: 28.5705, lng: 77.2507, keyword: 'nehru nagar' },
  { name: 'Mundka', lat: 28.6830, lng: 77.0316, keyword: 'mundka' },
  { name: 'Siri Fort', lat: 28.5504, lng: 77.2159, keyword: 'siri fort' },
  { name: 'Bawana', lat: 28.7764, lng: 77.0510, keyword: 'bawana' },
  { name: 'Okhla Phase 2', lat: 28.5308, lng: 77.2681, keyword: 'okhla' },
  { name: 'Patparganj', lat: 28.6236, lng: 77.2872, keyword: 'patparganj' },
  { name: 'Shadipur', lat: 28.6514, lng: 77.1578, keyword: 'shadipur' },
  { name: 'Wazirpur', lat: 28.6996, lng: 77.1651, keyword: 'wazirpur' },
  { name: 'Ashok Vihar', lat: 28.6915, lng: 77.1813, keyword: 'ashok vihar' },
  { name: 'Jahangirpuri', lat: 28.7260, lng: 77.1669, keyword: 'jahangirpuri' },
  { name: 'Vivek Vihar', lat: 28.6726, lng: 77.3152, keyword: 'vivek vihar' },
  { name: 'Pusa', lat: 28.6389, lng: 77.1527, keyword: 'pusa' },
  { name: 'North Campus', lat: 28.6885, lng: 77.2099, keyword: 'north campus' },
];

// Helper: fetch single city from WAQI
async function fetchCityAQI(cityName) {
  try {
    const url = `https://api.waqi.info/feed/${encodeURIComponent(cityName)}/?token=${WAQI_TOKEN}`;
    const res = await fetch(url);
    if (!res.ok) return null;
    const data = await res.json();
    if (data.status !== 'ok') return null;
    return {
      name: cityName,
      aqi: data.data.aqi,
      dominentpol: data.data.dominentpol || 'pm25',
      time: data.data.time?.s || new Date().toISOString(),
      iaqi: data.data.iaqi || {},
      city: data.data.city || {},
    };
  } catch (e) {
    return null;
  }
}

// Helper: fetch stations in a geographic bounding box (WAQI Map API)
async function fetchBoundsStations(lat1, lng1, lat2, lng2) {
  try {
    const url = `https://api.waqi.info/v2/map/bounds?latlng=${lat1},${lng1},${lat2},${lng2}&networks=all&token=${WAQI_TOKEN}`;
    const res = await fetch(url);
    if (!res.ok) return [];
    const data = await res.json();
    if (data.status !== 'ok' || !data.data) return [];
    return data.data
      .filter(s => s.aqi !== '-' && !isNaN(parseInt(s.aqi)))
      .map(s => ({
        name: s.station?.name || 'Unknown',
        lat: s.lat,
        lng: s.lon,
        aqi: parseInt(s.aqi),
        uid: s.uid,
        status: 'online',
      }));
  } catch (e) {
    console.error('Bounds API error:', e.message);
    return [];
  }
}

// GET /api/aqi-map/city?city=Delhi
router.get('/city', async (req, res) => {
  const city = req.query.city || 'Delhi';
  const result = await fetchCityAQI(city);
  if (!result) return res.status(500).json({ error: 'Failed to fetch AQI data' });
  return res.json(result);
});

// GET /api/aqi-map/delhi-stations — uses bounds API for complete coverage, with fallback
router.get('/delhi-stations', async (req, res) => {
  try {
    // Delhi bounding box: ~28.4 to 28.85 lat, ~76.8 to 77.35 lng
    const boundsStations = await fetchBoundsStations(28.40, 76.85, 28.88, 77.40);

    if (boundsStations.length >= 5) {
      // Bounds API returned good data — enrich with individual station details
      const enriched = await Promise.allSettled(
        boundsStations.slice(0, 30).map(async (st) => {
          try {
            const url = `https://api.waqi.info/feed/@${st.uid}/?token=${WAQI_TOKEN}`;
            const r = await fetch(url);
            const d = await r.json();
            if (d.status === 'ok' && d.data) {
              return {
                name: d.data.city?.name?.split(',')[0] || st.name.split(',')[0],
                lat: d.data.city?.geo?.[0] || st.lat,
                lng: d.data.city?.geo?.[1] || st.lng,
                aqi: typeof d.data.aqi === 'number' ? d.data.aqi : st.aqi,
                pm25: d.data.iaqi?.pm25?.v || null,
                pm10: d.data.iaqi?.pm10?.v || null,
                no2: d.data.iaqi?.no2?.v || null,
                o3: d.data.iaqi?.o3?.v || null,
                so2: d.data.iaqi?.so2?.v || null,
                co: d.data.iaqi?.co?.v || null,
                dominentpol: d.data.dominentpol || 'pm25',
                time: d.data.time?.s || null,
                status: 'online',
              };
            }
            return { ...st, pm25: null, pm10: null, no2: null, o3: null }; 
          } catch {
            return { ...st, pm25: null, pm10: null, no2: null, o3: null };
          }
        })
      );

      const stations = enriched
        .filter(r => r.status === 'fulfilled')
        .map(r => r.value)
        .filter(s => s.aqi !== null && !isNaN(s.aqi));

      return res.json({ city: 'Delhi', stations, source: 'bounds', timestamp: new Date().toISOString() });
    }

    // Fallback: query known stations individually
    const results = await Promise.allSettled(
      DELHI_STATIONS_FALLBACK.map(async (station) => {
        const data = await fetchCityAQI(`delhi/${station.keyword}`);
        if (!data) return { ...station, aqi: null, status: 'offline' };
        return {
          name: station.name,
          lat: data.city?.geo?.[0] || station.lat,
          lng: data.city?.geo?.[1] || station.lng,
          aqi: data.aqi,
          dominentpol: data.dominentpol,
          time: data.time,
          pm25: data.iaqi?.pm25?.v || null,
          pm10: data.iaqi?.pm10?.v || null,
          no2: data.iaqi?.no2?.v || null,
          o3: data.iaqi?.o3?.v || null,
          status: 'online',
        };
      })
    );
    const stations = results
      .filter(r => r.status === 'fulfilled')
      .map(r => r.value)
      .filter(s => s.aqi !== null);

    return res.json({ city: 'Delhi', stations, source: 'fallback', timestamp: new Date().toISOString() });
  } catch (err) {
    console.error('Delhi stations error:', err.message);
    return res.status(500).json({ error: 'Failed to fetch Delhi station data' });
  }
});

// GET /api/aqi-map/india
router.get('/india', async (req, res) => {
  try {
    const results = await Promise.allSettled(
      INDIA_CITIES.map(async (city) => {
        const data = await fetchCityAQI(city.name);
        return {
          name: city.name,
          lat: city.lat,
          lng: city.lng,
          aqi: data?.aqi ?? null,
          dominentpol: data?.dominentpol || null,
          time: data?.time || null,
        };
      })
    );
    const cities = results
      .filter(r => r.status === 'fulfilled')
      .map(r => r.value)
      .filter(c => c.aqi !== null);

    return res.json({ cities, timestamp: new Date().toISOString() });
  } catch (err) {
    console.error('India AQI error:', err.message);
    return res.status(500).json({ error: 'Failed to fetch India AQI data' });
  }
});

module.exports = router;
