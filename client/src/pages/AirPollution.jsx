/**
 * AirPollution.jsx — Premium Air Pollution Page with Live AQI + Leaflet Maps
 * Features: live WAQI data, unified Delhi/India toggle map,
 * AI safety plan, AQI trend chart, pollution sources — all with premium glassmorphism.
 */
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import SafetyPlanSection from '../components/climate/SafetyPlanSection';
import AQITrendChart from '../components/climate/AQITrendChart';
import {
  Wind, AlertTriangle, Heart, Factory, Car, Wheat,
  MapPin, RefreshCw, Activity, Gauge,
} from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Light map tiles — CARTO Voyager
const TILE_URL = 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png';
const TILE_ATTR = '&copy; <a href="https://carto.com/">CARTO</a> &copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>';

// ─── AQI color system ────────────────────────────────────────────────────────
function aqiColor(aqi) {
  if (aqi <= 50) return '#22c55e';
  if (aqi <= 100) return '#eab308';
  if (aqi <= 150) return '#f97316';
  if (aqi <= 200) return '#ef4444';
  if (aqi <= 300) return '#a855f7';
  return '#be123c';
}

function aqiLabel(aqi) {
  if (aqi <= 50) return 'Good';
  if (aqi <= 100) return 'Moderate';
  if (aqi <= 150) return 'Unhealthy (Sensitive)';
  if (aqi <= 200) return 'Unhealthy';
  if (aqi <= 300) return 'Very Unhealthy';
  return 'Hazardous';
}

// Premium labeled marker
function aqiIcon(aqi, size = 36) {
  const color = aqiColor(aqi);
  return L.divIcon({
    className: '',
    html: `<div style="
      position:relative;display:flex;align-items:center;justify-content:center;
    "><div style="
      width:${size}px;height:${size}px;border-radius:50%;
      background:radial-gradient(circle at 35% 35%,${color}ee,${color}88);
      border:2.5px solid rgba(255,255,255,0.8);
      box-shadow:0 0 16px ${color}70,0 0 36px ${color}25,0 2px 6px rgba(0,0,0,0.5);
      display:flex;align-items:center;justify-content:center;
      font-family:'JetBrains Mono',monospace;font-weight:800;
      font-size:${size > 30 ? 11 : 9}px;color:#fff;text-shadow:0 1px 3px rgba(0,0,0,0.6);
    ">${aqi}</div><div style="
      position:absolute;inset:-5px;border-radius:50%;
      border:1.5px solid ${color}45;
      animation:aqiPulse 2.2s cubic-bezier(0,0,0.2,1) infinite;
    "></div></div>`,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
    popupAnchor: [0, -size / 2 - 4],
  });
}


// ─── Static data ─────────────────────────────────────────────────────────────
const aqiScale = [
  { range: '0-50', label: 'Good', color: '#22c55e', desc: 'Minimal health risk' },
  { range: '51-100', label: 'Moderate', color: '#eab308', desc: 'Sensitive individuals may be affected' },
  { range: '101-150', label: 'Unhealthy (Sensitive)', color: '#f97316', desc: 'General public starts to be affected' },
  { range: '151-200', label: 'Unhealthy', color: '#ef4444', desc: 'Everyone may experience health effects' },
  { range: '201-300', label: 'Very Unhealthy', color: '#a855f7', desc: 'Health alert: significant risk' },
  { range: '300+', label: 'Hazardous', color: '#be123c', desc: 'Emergency conditions for entire population' },
];

const sources = [
  { icon: Car, label: 'Vehicular Emissions', pct: '40%', color: '#ef4444' },
  { icon: Factory, label: 'Industrial Pollution', pct: '20%', color: '#a855f7' },
  { icon: Wheat, label: 'Stubble Burning', pct: '25%', color: '#f97316' },
  { icon: Wind, label: 'Dust & Construction', pct: '15%', color: '#eab308' },
];

const healthEffects = [
  'Aggravated asthma and respiratory diseases',
  'Increased risk of lung cancer with prolonged exposure',
  'Cardiovascular problems in elderly population',
  'Reduced lung function in children',
  'Eye, nose, and throat irritation',
  'Premature mortality during severe episodes',
];

// ─── Map auto-fit component ─────────────────────────────────────────────────
function FitBounds({ points }) {
  const map = useMap();
  useEffect(() => {
    if (points.length > 0) {
      const bounds = points.map(p => [p.lat, p.lng]);
      map.fitBounds(bounds, { padding: [30, 30], maxZoom: 12 });
    }
  }, [points, map]);
  return null;
}

// Popup style
const pStyle = { background:'#ffffff', color:'#1a1a1a', padding:'14px 16px', borderRadius:'14px', border:'1px solid rgba(0,0,0,0.08)', minWidth:'160px', boxShadow:'0 8px 32px rgba(0,0,0,0.12)' };

// CSS overrides for maps
const mapCSS = `
  @keyframes aqiPulse {
    0% { transform: scale(1); opacity: 0.5; }
    70% { transform: scale(1.7); opacity: 0; }
    100% { transform: scale(1.7); opacity: 0; }
  }
  .leaflet-popup-content-wrapper { background: transparent !important; box-shadow: none !important; border: none !important; padding: 0 !important; }
  .leaflet-popup-tip-container { display: none !important; }
  .leaflet-popup-content { margin: 0 !important; }
  .leaflet-control-zoom a { background: #fff !important; color: #333 !important; border-color: #e0e0e0 !important; box-shadow: 0 2px 6px rgba(0,0,0,0.08) !important; }
  .leaflet-control-zoom a:hover { background: rgba(168,85,247,0.1) !important; color: #a855f7 !important; }
`;

// ─── Big AQI gauge ───────────────────────────────────────────────────────────
function AQIGauge({ aqi, city }) {
  const color = aqiColor(aqi);
  const label = aqiLabel(aqi);
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const maxAqi = 500;
  const dashOffset = circumference * (1 - Math.min(aqi / maxAqi, 1));

  return (
    <div className="text-center">
      <div className="relative w-36 h-36 mx-auto mb-3">
        <svg viewBox="0 0 128 128" className="w-full h-full -rotate-90">
          <circle cx="64" cy="64" r={radius} fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="8" />
          <motion.circle
            cx="64" cy="64" r={radius} fill="none" stroke={color} strokeWidth="8" strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: dashOffset }}
            transition={{ duration: 1.5, ease: [0.25, 0.46, 0.45, 0.94] }}
            style={{ filter: `drop-shadow(0 0 10px ${color}60)` }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-4xl font-black font-mono tabular-nums" style={{ color }}>{aqi}</span>
          <span className="text-[9px] text-white/25 uppercase tracking-wider">AQI</span>
        </div>
      </div>
      <p className="text-sm font-semibold" style={{ color }}>{label}</p>
      <p className="text-[11px] text-white/30 mt-1">{city} — Live</p>
    </div>
  );
}

// ─── Main page ───────────────────────────────────────────────────────────────
export default function AirPollution() {
  const [liveAQI, setLiveAQI] = useState(null);
  const [delhiStations, setDelhiStations] = useState([]);
  const [indiaCities, setIndiaCities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mapView, setMapView] = useState('delhi');

  useEffect(() => {
    async function fetchAll() {
      setLoading(true);
      try {
        const [cityRes, stationsRes, indiaRes] = await Promise.allSettled([
          fetch('/api/aqi-map/city?city=Delhi').then(r => r.json()),
          fetch('/api/aqi-map/delhi-stations').then(r => r.json()),
          fetch('/api/aqi-map/india').then(r => r.json()),
        ]);
        if (cityRes.status === 'fulfilled') setLiveAQI(cityRes.value);
        if (stationsRes.status === 'fulfilled') setDelhiStations(stationsRes.value.stations || []);
        if (indiaRes.status === 'fulfilled') setIndiaCities(indiaRes.value.cities || []);
      } catch (e) { console.error('AQI fetch error:', e); }
      finally { setLoading(false); }
    }
    fetchAll();
  }, []);

  const validDelhiStations = delhiStations.filter(s => s.aqi !== null);
  const validIndiaCities = indiaCities.filter(c => c.aqi !== null);

  return (
    <div className="min-h-screen pt-20">
      <style>{mapCSS}</style>
      {/* Hero */}
      <section className="relative section-padding overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[400px] rounded-full blur-[200px] opacity-10"
            style={{ background: 'radial-gradient(ellipse, #a855f7, transparent 65%)' }} />
          <div className="absolute top-32 right-1/4 w-[400px] h-[250px] rounded-full blur-[150px] opacity-[0.06]"
            style={{ background: 'radial-gradient(ellipse, #ef4444, transparent 65%)' }} />
        </div>
        <div className="container-custom relative">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} className="text-center">
            <div className="inline-flex items-center gap-2 bg-white/[0.03] border border-white/[0.06] px-5 py-2 rounded-full mb-7 backdrop-blur-sm">
              <div className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse" />
              <Wind className="w-3.5 h-3.5 text-purple-400" />
              <span className="text-[11px] text-white/40 tracking-widest uppercase font-medium">Air Quality Monitoring</span>
            </div>
            <h1 className="font-display font-black text-4xl sm:text-6xl lg:text-7xl text-white mb-5 tracking-tight leading-[1.05]">
              Air Pollution in{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-fuchsia-400 to-pink-400">
                Delhi
              </span>
            </h1>
            <motion.p
              initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15, duration: 0.6 }}
              className="text-white/30 text-base max-w-3xl leading-relaxed font-light mx-auto"
            >
              Delhi consistently ranks among the world's most polluted cities. Track live AQI from monitoring stations, explore pollution hotspots, and understand the crisis affecting 20 million residents.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Live AQI Overview */}
      <section className="section-padding pt-0">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Big AQI gauge card */}
            <motion.div
              initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              className="rounded-[20px] p-7 flex items-center justify-center"
              style={{ background: 'rgba(255,255,255,0.015)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.04)' }}
            >
              {loading ? (
                <div className="text-center py-8">
                  <RefreshCw className="w-8 h-8 text-white/20 animate-spin mx-auto mb-3" />
                  <p className="text-[11px] text-white/25">Loading live data…</p>
                </div>
              ) : liveAQI ? (
                <AQIGauge aqi={liveAQI.aqi} city="Delhi" />
              ) : (
                <p className="text-white/30 text-sm">AQI data unavailable</p>
              )}
            </motion.div>

            {/* Pollutant breakdown */}
            <motion.div
              initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="lg:col-span-2 rounded-[20px] p-7"
              style={{ background: 'rgba(255,255,255,0.015)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.04)' }}
            >
              <div className="flex items-center gap-2 mb-5">
                <Activity className="w-4 h-4 text-purple-400" />
                <span className="text-[10px] text-white/35 uppercase tracking-[0.15em] font-medium">Pollutant Breakdown</span>
              </div>
              {liveAQI && liveAQI.iaqi ? (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {[
                    { key: 'pm25', label: 'PM2.5', unit: 'µg/m³', color: '#ef4444' },
                    { key: 'pm10', label: 'PM10', unit: 'µg/m³', color: '#f97316' },
                    { key: 'no2', label: 'NO₂', unit: 'ppb', color: '#eab308' },
                    { key: 'o3', label: 'O₃', unit: 'ppb', color: '#06b6d4' },
                    { key: 'so2', label: 'SO₂', unit: 'ppb', color: '#a855f7' },
                    { key: 'co', label: 'CO', unit: 'ppm', color: '#64748b' },
                  ].map(({ key, label, unit, color }) => {
                    const val = liveAQI.iaqi[key]?.v;
                    return (
                      <div key={key} className="bg-white/[0.02] border border-white/[0.03] rounded-xl p-4 text-center">
                        <p className="text-[10px] text-white/25 uppercase tracking-wider mb-1">{label}</p>
                        <p className="text-xl font-black font-mono tabular-nums" style={{ color: val ? color : 'rgba(255,255,255,0.15)' }}>
                          {val ?? '—'}
                        </p>
                        <p className="text-[9px] text-white/15 mt-0.5">{unit}</p>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="grid grid-cols-4 gap-4">
                  {[0,1,2,3].map(i => (
                    <div key={i} className="bg-white/[0.02] rounded-xl p-4 h-20 animate-pulse" />
                  ))}
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Unified AQI Map — Delhi / India toggle */}
      <section className="section-padding pt-0">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="rounded-[20px] overflow-hidden relative"
            style={{ background: 'rgba(255,255,255,0.015)', border: '1px solid rgba(255,255,255,0.04)' }}
          >
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-500/20 to-transparent z-10" />
            <div className="p-6 pb-0 relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-purple-400" />
                  <span className="text-[10px] text-white/35 uppercase tracking-[0.15em] font-medium">
                    {mapView === 'delhi' ? 'Delhi Monitoring Stations' : 'India AQI Overview'}
                  </span>
                  <span className="text-[10px] text-white/15 bg-white/[0.03] px-3 py-1 rounded-full">
                    {mapView === 'delhi' ? `${validDelhiStations.length} stations` : `${validIndiaCities.length} cities`}
                  </span>
                </div>
                {/* View toggle */}
                <div className="flex gap-1.5">
                  {[{ id: 'delhi', label: 'Delhi' }, { id: 'india', label: 'India' }].map(v => (
                    <button key={v.id} onClick={() => setMapView(v.id)}
                      className="text-[10px] px-3.5 py-1.5 rounded-lg font-medium transition-all duration-200"
                      style={mapView === v.id
                        ? { background: 'rgba(168,85,247,0.12)', border: '1px solid rgba(168,85,247,0.25)', color: '#a855f7' }
                        : { background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.3)' }
                      }
                    >{v.label}</button>
                  ))}
                </div>
              </div>
            </div>
            <div className="h-[480px] relative z-0">
              {mapView === 'delhi' ? (
                validDelhiStations.length > 0 ? (
                  <MapContainer key="delhi-map" center={[28.6139, 77.2090]} zoom={11} className="h-full w-full" style={{ background: '#f0f0f0' }} zoomControl={true}>
                    <TileLayer url={TILE_URL} attribution={TILE_ATTR} />
                    <FitBounds points={validDelhiStations} />
                    {validDelhiStations.map((station, i) => (
                      <Marker key={i} position={[station.lat, station.lng]} icon={aqiIcon(station.aqi, 38)}>
                        <Popup>
                          <div style={pStyle}>
                            <p style={{ fontWeight: 700, fontSize: '14px', marginBottom: '4px', color: '#1a1a1a' }}>{station.name}</p>
                            <p style={{ fontSize: '28px', fontWeight: 900, color: aqiColor(station.aqi), fontFamily: 'monospace', margin: '4px 0' }}>{station.aqi}</p>
                            <p style={{ fontSize: '11px', color: aqiColor(station.aqi), fontWeight: 600, marginBottom: '6px' }}>{aqiLabel(station.aqi)}</p>
                            {station.pm25 && <p style={{ fontSize: '10px', color: 'rgba(0,0,0,0.35)' }}>PM2.5: {station.pm25} · PM10: {station.pm10 || '—'}</p>}
                          </div>
                        </Popup>
                      </Marker>
                    ))}
                  </MapContainer>
                ) : (
                  <div className="h-full flex items-center justify-center">
                    <div className="text-center">
                      <RefreshCw className={`w-6 h-6 text-white/15 mx-auto mb-2 ${loading ? 'animate-spin' : ''}`} />
                      <p className="text-[11px] text-white/20">{loading ? 'Loading station data…' : 'No station data available'}</p>
                    </div>
                  </div>
                )
              ) : (
                validIndiaCities.length > 0 ? (
                  <MapContainer key="india-map" center={[22.5, 78.9]} zoom={5} className="h-full w-full" style={{ background: '#f0f0f0' }} zoomControl={true}>
                    <TileLayer url={TILE_URL} attribution={TILE_ATTR} />
                    {validIndiaCities.map((city, i) => (
                      <Marker key={i} position={[city.lat, city.lng]} icon={aqiIcon(city.aqi, 40)}>
                        <Popup>
                          <div style={pStyle}>
                            <p style={{ fontWeight: 700, fontSize: '14px', marginBottom: '4px', color: '#1a1a1a' }}>{city.name}</p>
                            <p style={{ fontSize: '28px', fontWeight: 900, color: aqiColor(city.aqi), fontFamily: 'monospace', margin: '4px 0' }}>{city.aqi}</p>
                            <p style={{ fontSize: '11px', color: aqiColor(city.aqi), fontWeight: 600 }}>{aqiLabel(city.aqi)}</p>
                          </div>
                        </Popup>
                      </Marker>
                    ))}
                  </MapContainer>
                ) : (
                  <div className="h-full flex items-center justify-center">
                    <div className="text-center">
                      <RefreshCw className={`w-6 h-6 text-white/15 mx-auto mb-2 ${loading ? 'animate-spin' : ''}`} />
                      <p className="text-[11px] text-white/20">{loading ? 'Loading…' : 'No data available'}</p>
                    </div>
                  </div>
                )
              )}
              {/* Legend — all 6 AQI levels */}
              <div className="absolute bottom-3 left-3 z-[1000] flex flex-col gap-1 bg-white/90 backdrop-blur-lg rounded-xl border border-black/[0.06] p-2.5 shadow-lg">
                <div className="text-[7px] text-black/40 uppercase tracking-wider font-semibold mb-0.5 pl-0.5">AQI Levels</div>
                {aqiScale.map(s => (
                  <div key={s.range} className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ background: s.color, boxShadow: `0 0 5px ${s.color}60` }} />
                    <span className="text-[8px] text-black/50">{s.label} ({s.range})</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* AI Safety Plan Generator */}
      <SafetyPlanSection aqi={liveAQI?.aqi} weather={{ temp: 38, humidity: 55 }} />

      {/* AQI Trend Chart — 7-day + 3-day prediction */}
      <AQITrendChart aqi={liveAQI?.aqi} />

      {/* AQI Scale */}
      <section className="section-padding pt-0">
        <div className="container-custom">
          <motion.h2 initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
            className="font-display font-bold text-2xl text-white mb-6 flex items-center gap-2">
            Understanding <span className="text-purple-400">AQI</span>
          </motion.h2>
          <div className="space-y-2">
            {aqiScale.map((item, i) => (
              <motion.div
                key={item.range}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
                className="flex items-center gap-4 rounded-xl p-4"
                style={{ background: 'rgba(255,255,255,0.015)', border: '1px solid rgba(255,255,255,0.03)' }}
              >
                <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ background: item.color, boxShadow: `0 0 8px ${item.color}40` }} />
                <span className="font-mono text-sm text-white/70 w-20">{item.range}</span>
                <span className="font-semibold text-white text-sm w-44">{item.label}</span>
                <span className="text-white/35 text-sm hidden sm:block">{item.desc}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Sources */}
      <section className="section-padding pt-0">
        <div className="container-custom">
          <motion.h2 initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
            className="font-display font-bold text-2xl text-white mb-6">
            Pollution <span className="text-purple-400">Sources</span>
          </motion.h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {sources.map((src, i) => (
              <motion.div
                key={src.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                className="rounded-[20px] p-6 text-center group"
                style={{ background: 'rgba(255,255,255,0.015)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.04)' }}
              >
                <div className="w-12 h-12 rounded-xl mx-auto mb-3 flex items-center justify-center"
                  style={{ background: `${src.color}0a`, border: `1px solid ${src.color}18` }}>
                  <src.icon className="w-6 h-6" style={{ color: src.color }} />
                </div>
                <p className="font-display font-black text-2xl text-white mb-1">{src.pct}</p>
                <p className="text-white/35 text-[11px]">{src.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Health Effects */}
      <section className="section-padding pt-0">
        <div className="container-custom">
          <motion.h2 initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
            className="font-display font-bold text-2xl text-white mb-6 flex items-center gap-2">
            <Heart className="w-6 h-6 text-red-400" />
            Health <span className="text-red-400">Impacts</span>
          </motion.h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {healthEffects.map((effect, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="flex items-start gap-3 rounded-xl p-4"
                style={{ background: 'rgba(255,255,255,0.015)', border: '1px solid rgba(255,255,255,0.03)' }}
              >
                <AlertTriangle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                <p className="text-white/55 text-[12px] leading-relaxed">{effect}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
