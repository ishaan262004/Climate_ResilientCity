import { useState, useEffect, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from 'react-leaflet';
import { motion } from 'framer-motion';
import { Map as MapIcon } from 'lucide-react';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix leaflet default markers
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

// Custom marker icons
const createIcon = (color) => L.divIcon({
  className: 'custom-marker',
  html: `<div style="
    width: 24px; height: 24px; border-radius: 50%;
    background: ${color}; border: 3px solid white;
    box-shadow: 0 0 10px ${color}80, 0 2px 8px rgba(0,0,0,0.5);
    position: relative;
  "><div style="
    position: absolute; inset: -4px; border-radius: 50%;
    background: ${color}30; animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;
  "></div></div>`,
  iconSize: [24, 24],
  iconAnchor: [12, 12],
});

// Delhi coordinates and data
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
  { pos: [28.6869, 77.2233], name: 'Yamuna Flood Plain', radius: 1500, color: '#3b82f6' },
  { pos: [28.6100, 77.2500], name: 'ITO Low-Lying Area', radius: 800, color: '#3b82f6' },
  { pos: [28.5800, 77.3100], name: 'Okhla Basin', radius: 1000, color: '#3b82f6' },
];

const userReports = [
  { pos: [28.6200, 77.1800], type: 'pollution', desc: 'Heavy smoke from nearby factory' },
  { pos: [28.7000, 77.1200], type: 'flood', desc: 'Waterlogging on main road after rain' },
  { pos: [28.5500, 77.2500], type: 'heatwave', desc: 'No shade or water access in park area' },
];

const reportColors = { pollution: '#a855f7', flood: '#3b82f6', heatwave: '#ef4444' };

function MapController() {
  const map = useMap();
  useEffect(() => {
    map.invalidateSize();
  }, [map]);
  return null;
}

export default function InteractiveMap() {
  const [activeLayer, setActiveLayer] = useState('all');

  const layers = [
    { id: 'all', label: 'All' },
    { id: 'aqi', label: 'AQI Hotspots' },
    { id: 'flood', label: 'Flood Zones' },
    { id: 'reports', label: 'Reports' },
  ];

  return (
    <section id="map" className="section-padding relative">
      <div className="container-custom">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center gap-2 glass px-4 py-2 rounded-full mb-4">
            <MapIcon className="w-4 h-4 text-resilient-green" />
            <span className="text-xs text-white/60">Interactive Map</span>
          </div>
          <h2 className="font-display font-bold text-3xl sm:text-4xl lg:text-5xl text-white mb-4">
            Delhi Risk <span className="text-gradient-green">Map</span>
          </h2>
          <p className="text-white/50 max-w-2xl mx-auto mb-8">
            Explore environmental hotspots, flood-prone areas, and community reports across Delhi.
          </p>

          {/* Layer filters */}
          <div className="flex flex-wrap justify-center gap-2">
            {layers.map(l => (
              <button
                key={l.id}
                onClick={() => setActiveLayer(l.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                  activeLayer === l.id
                    ? 'bg-resilient-green text-black'
                    : 'glass text-white/60 hover:text-white'
                }`}
              >
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
          className="rounded-2xl overflow-hidden border border-white/5 h-[400px] sm:h-[500px]"
        >
          <MapContainer
            center={DELHI_CENTER}
            zoom={11}
            className="h-full w-full"
            zoomControl={true}
          >
            <MapController />
            <TileLayer
              url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            />

            {/* AQI Hotspots */}
            {(activeLayer === 'all' || activeLayer === 'aqi') &&
              aqiHotspots.map((spot, i) => (
                <Marker key={`aqi-${i}`} position={spot.pos} icon={createIcon(spot.color)}>
                  <Popup>
                    <div className="text-center">
                      <p className="font-bold text-sm">{spot.name}</p>
                      <p className="text-xs mt-1">AQI: <span style={{ color: spot.color }} className="font-bold">{spot.aqi}</span></p>
                    </div>
                  </Popup>
                </Marker>
              ))
            }

            {/* Flood Zones */}
            {(activeLayer === 'all' || activeLayer === 'flood') &&
              floodZones.map((zone, i) => (
                <Circle
                  key={`flood-${i}`}
                  center={zone.pos}
                  radius={zone.radius}
                  pathOptions={{
                    color: zone.color,
                    fillColor: zone.color,
                    fillOpacity: 0.15,
                    weight: 1,
                  }}
                >
                  <Popup>
                    <div className="text-center">
                      <p className="font-bold text-sm">{zone.name}</p>
                      <p className="text-xs mt-1 text-blue-600">Flood-Prone Zone</p>
                    </div>
                  </Popup>
                </Circle>
              ))
            }

            {/* User Reports */}
            {(activeLayer === 'all' || activeLayer === 'reports') &&
              userReports.map((report, i) => (
                <Marker
                  key={`report-${i}`}
                  position={report.pos}
                  icon={createIcon(reportColors[report.type])}
                >
                  <Popup>
                    <div className="text-center">
                      <p className="font-bold text-sm capitalize">{report.type} Report</p>
                      <p className="text-xs mt-1">{report.desc}</p>
                    </div>
                  </Popup>
                </Marker>
              ))
            }
          </MapContainer>
        </motion.div>
      </div>
    </section>
  );
}
