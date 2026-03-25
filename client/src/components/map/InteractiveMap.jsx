/**
 * InteractiveMap.jsx — Premium Delhi Risk Map
 * Features: Stadia dark tiles (visible roads), pulsing labeled markers,
 * AQI hotspots with values, animated flood zone radii, styled popups.
 */
import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from 'react-leaflet';
import { motion } from 'framer-motion';
import { Map as MapIcon, Wind, CloudRain, Flame, AlertTriangle } from 'lucide-react';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix leaflet default markers
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

// Premium marker with AQI/label inside
const createLabeledIcon = (color, label) => L.divIcon({
  className: '',
  html: `<div style="
    position: relative; display: flex; align-items: center; justify-content: center;
  ">
    <div style="
      width: 38px; height: 38px; border-radius: 50%;
      background: radial-gradient(circle at 30% 30%, ${color}dd, ${color}90);
      border: 2.5px solid rgba(255,255,255,0.85);
      box-shadow: 0 0 18px ${color}70, 0 0 40px ${color}30, 0 2px 8px rgba(0,0,0,0.5);
      display: flex; align-items: center; justify-content: center;
      font-family: 'JetBrains Mono', monospace; font-weight: 800;
      font-size: 11px; color: #fff; text-shadow: 0 1px 3px rgba(0,0,0,0.6);
      letter-spacing: -0.5px;
    ">${label}</div>
    <div style="
      position: absolute; inset: -6px; border-radius: 50%;
      border: 1.5px solid ${color}50;
      animation: mapPulse 2s cubic-bezier(0, 0, 0.2, 1) infinite;
    "></div>
  </div>`,
  iconSize: [38, 38],
  iconAnchor: [19, 19],
  popupAnchor: [0, -22],
});

// Smaller marker for reports
const createDotIcon = (color, type) => L.divIcon({
  className: '',
  html: `<div style="
    width: 28px; height: 28px; border-radius: 50%;
    background: radial-gradient(circle at 30% 30%, ${color}cc, ${color}80);
    border: 2px solid rgba(255,255,255,0.7);
    box-shadow: 0 0 14px ${color}60, 0 2px 6px rgba(0,0,0,0.4);
    display: flex; align-items: center; justify-content: center;
    font-size: 12px;
  ">${type === 'pollution' ? '💨' : type === 'flood' ? '🌊' : '🔥'}</div>`,
  iconSize: [28, 28],
  iconAnchor: [14, 14],
  popupAnchor: [0, -18],
});

const DELHI_CENTER = [28.6139, 77.2090];

const aqiHotspots = [
  { pos: [28.7495, 77.0565], name: 'Rohini', aqi: 185, color: '#ef4444' },
  { pos: [28.5921, 77.0460], name: 'Dwarka', aqi: 142, color: '#f97316' },
  { pos: [28.6469, 77.3164], name: 'Anand Vihar', aqi: 278, color: '#a855f7' },
  { pos: [28.6315, 77.2167], name: 'Connaught Place', aqi: 156, color: '#ef4444' },
  { pos: [28.6289, 77.2411], name: 'ITO', aqi: 210, color: '#a855f7' },
  { pos: [28.5562, 77.1000], name: 'IGI Airport', aqi: 148, color: '#f97316' },
];

const floodZones = [
  { pos: [28.6869, 77.2233], name: 'Yamuna Flood Plain', radius: 1500, color: '#3b82f6', risk: 'Critical' },
  { pos: [28.6100, 77.2500], name: 'ITO Low-Lying Area', radius: 800, color: '#60a5fa', risk: 'High' },
  { pos: [28.5800, 77.3100], name: 'Okhla Basin', radius: 1000, color: '#3b82f6', risk: 'High' },
];

const userReports = [
  { pos: [28.6200, 77.1800], type: 'pollution', desc: 'Heavy smoke from nearby factory' },
  { pos: [28.7000, 77.1200], type: 'flood', desc: 'Waterlogging on main road after rain' },
  { pos: [28.5500, 77.2500], type: 'heatwave', desc: 'No shade or water access in park area' },
];

const reportColors = { pollution: '#a855f7', flood: '#3b82f6', heatwave: '#ef4444' };

// Visible dark tile options (NOT pure black)
const TILE_URL = 'https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png';
const TILE_ATTR = '&copy; <a href="https://stadiamaps.com/">Stadia</a>';

function MapController() {
  const map = useMap();
  useEffect(() => { map.invalidateSize(); }, [map]);
  return null;
}

// Popup styled for dark theme
const popupStyle = { background: '#0f0f0f', color: '#fff', padding: '14px 16px', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.08)', minWidth: '160px', boxShadow: '0 8px 32px rgba(0,0,0,0.6)' };

export default function InteractiveMap() {
  const [activeLayer, setActiveLayer] = useState('all');

  const layers = [
    { id: 'all', label: 'All', icon: MapIcon },
    { id: 'aqi', label: 'AQI Hotspots', icon: Wind },
    { id: 'flood', label: 'Flood Zones', icon: CloudRain },
    { id: 'reports', label: 'Reports', icon: AlertTriangle },
  ];

  return (
    <section id="map" className="section-padding relative">
      {/* Pulse animation keyframes */}
      <style>{`
        @keyframes mapPulse {
          0% { transform: scale(1); opacity: 0.6; }
          70% { transform: scale(1.8); opacity: 0; }
          100% { transform: scale(1.8); opacity: 0; }
        }
        .leaflet-popup-content-wrapper { background: transparent !important; box-shadow: none !important; border: none !important; padding: 0 !important; }
        .leaflet-popup-tip-container { display: none !important; }
        .leaflet-popup-content { margin: 0 !important; }
        .leaflet-control-zoom a { background: rgba(15,15,15,0.9) !important; color: rgba(255,255,255,0.6) !important; border-color: rgba(255,255,255,0.06) !important; }
        .leaflet-control-zoom a:hover { background: rgba(34,197,94,0.2) !important; color: #22c55e !important; }
      `}</style>

      <div className="container-custom">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center gap-2 bg-white/[0.03] border border-white/[0.06] px-5 py-2 rounded-full mb-5 backdrop-blur-sm">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <MapIcon className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-[11px] text-white/40 tracking-widest uppercase font-medium">Interactive Risk Map</span>
          </div>
          <h2 className="font-display font-bold text-3xl sm:text-4xl lg:text-5xl text-white mb-4 tracking-tight">
            Delhi Risk <span className="text-gradient-green">Map</span>
          </h2>
          <p className="text-white/30 max-w-2xl mx-auto text-sm mb-8 font-light">
            Explore environmental hotspots, flood-prone areas, and community reports across Delhi.
          </p>

          {/* Layer filters */}
          <div className="flex flex-wrap justify-center gap-2">
            {layers.map(l => (
              <button
                key={l.id}
                onClick={() => setActiveLayer(l.id)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-[12px] font-medium transition-all duration-300 ${
                  activeLayer === l.id
                    ? 'text-black'
                    : 'bg-white/[0.03] border border-white/[0.06] text-white/40 hover:text-white hover:border-white/[0.12]'
                }`}
                style={activeLayer === l.id ? { background: 'linear-gradient(135deg, #22c55e, #16a34a)', boxShadow: '0 0 12px rgba(34,197,94,0.3)' } : {}}
              >
                <l.icon className="w-3.5 h-3.5" />
                {l.label}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Map */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="rounded-[20px] overflow-hidden relative"
          style={{ border: '1px solid rgba(255,255,255,0.06)', boxShadow: '0 0 40px rgba(34,197,94,0.04), inset 0 1px 0 rgba(255,255,255,0.03)' }}
        >
          {/* Top accent */}
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-emerald-500/30 to-transparent z-[1000]" />

          <div className="h-[440px] sm:h-[520px]">
            <MapContainer
              center={DELHI_CENTER}
              zoom={11}
              className="h-full w-full"
              zoomControl={true}
              style={{ background: '#0a0a0a' }}
            >
              <MapController />
              <TileLayer url={TILE_URL} attribution={TILE_ATTR} />

              {/* AQI Hotspots — labeled markers */}
              {(activeLayer === 'all' || activeLayer === 'aqi') &&
                aqiHotspots.map((spot, i) => (
                  <Marker key={`aqi-${i}`} position={spot.pos} icon={createLabeledIcon(spot.color, spot.aqi)}>
                    <Popup>
                      <div style={popupStyle}>
                        <p style={{ fontWeight: 700, fontSize: '14px', marginBottom: '4px' }}>{spot.name}</p>
                        <p style={{ fontSize: '28px', fontWeight: 900, color: spot.color, fontFamily: 'monospace', margin: '4px 0' }}>{spot.aqi}</p>
                        <p style={{ fontSize: '10px', color: 'rgba(255,255,255,0.35)' }}>Air Quality Index</p>
                      </div>
                    </Popup>
                  </Marker>
                ))
              }

              {/* Flood Zones — gradient circles */}
              {(activeLayer === 'all' || activeLayer === 'flood') &&
                floodZones.map((zone, i) => (
                  <Circle
                    key={`flood-${i}`}
                    center={zone.pos}
                    radius={zone.radius}
                    pathOptions={{
                      color: zone.color,
                      fillColor: zone.color,
                      fillOpacity: 0.12,
                      weight: 2,
                      dashArray: '6 4',
                      opacity: 0.6,
                    }}
                  >
                    <Popup>
                      <div style={popupStyle}>
                        <p style={{ fontWeight: 700, fontSize: '14px', marginBottom: '4px' }}>{zone.name}</p>
                        <p style={{ fontSize: '12px', color: zone.color, fontWeight: 600 }}>{zone.risk} Risk Zone</p>
                        <p style={{ fontSize: '10px', color: 'rgba(255,255,255,0.3)', marginTop: '4px' }}>Radius: {zone.radius}m</p>
                      </div>
                    </Popup>
                  </Circle>
                ))
              }

              {/* User Reports — emoji markers */}
              {(activeLayer === 'all' || activeLayer === 'reports') &&
                userReports.map((report, i) => (
                  <Marker
                    key={`report-${i}`}
                    position={report.pos}
                    icon={createDotIcon(reportColors[report.type], report.type)}
                  >
                    <Popup>
                      <div style={popupStyle}>
                        <p style={{ fontWeight: 700, fontSize: '13px', marginBottom: '4px', textTransform: 'capitalize' }}>{report.type} Report</p>
                        <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)' }}>{report.desc}</p>
                      </div>
                    </Popup>
                  </Marker>
                ))
              }
            </MapContainer>
          </div>

          {/* Map legend */}
          <div className="absolute bottom-4 left-4 z-[1000] flex flex-col gap-1.5 bg-black/80 backdrop-blur-lg rounded-xl border border-white/[0.06] p-3">
            <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full" style={{ background: '#a855f7', boxShadow: '0 0 6px #a855f780' }} /><span className="text-[9px] text-white/35">Very Unhealthy (200+)</span></div>
            <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full" style={{ background: '#ef4444', boxShadow: '0 0 6px #ef444480' }} /><span className="text-[9px] text-white/35">Unhealthy (150-200)</span></div>
            <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full" style={{ background: '#f97316', boxShadow: '0 0 6px #f9731680' }} /><span className="text-[9px] text-white/35">Moderate (100-150)</span></div>
            <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full border border-blue-400/40" style={{ background: '#3b82f620' }} /><span className="text-[9px] text-white/35">Flood Zone</span></div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
