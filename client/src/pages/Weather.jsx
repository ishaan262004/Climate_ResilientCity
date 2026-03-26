import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Thermometer, Droplets, Wind, Eye, Gauge, Sun, Sunrise, Sunset,
  CloudRain, CloudSnow, CloudLightning, Cloud, CloudFog, MapPin,
  RefreshCw, AlertTriangle, TrendingUp, ShieldAlert, Waves,
  Compass, Zap, Clock,
} from 'lucide-react';

/* ─── helpers ─── */
const API = '/api/weather';

const conditionIcon = (icon) => {
  const base = 'https://openweathermap.org/img/wn/';
  return `${base}${icon}@2x.png`;
};

const getConditionEmoji = (condition = '') => {
  const c = condition.toLowerCase();
  if (c.includes('thunder')) return <CloudLightning className="w-8 h-8 text-yellow-400" />;
  if (c.includes('rain') || c.includes('drizzle') || c.includes('shower')) return <CloudRain className="w-8 h-8 text-blue-400" />;
  if (c.includes('snow')) return <CloudSnow className="w-8 h-8 text-blue-200" />;
  if (c.includes('fog') || c.includes('haze') || c.includes('mist')) return <CloudFog className="w-8 h-8 text-gray-400" />;
  if (c.includes('cloud') || c.includes('overcast')) return <Cloud className="w-8 h-8 text-gray-300" />;
  return <Sun className="w-8 h-8 text-yellow-400" />;
};

const getSmartInsight = (data) => {
  if (!data) return null;
  const { temperature, humidity, condition = '' } = data;
  const c = condition.toLowerCase();
  const insights = [];

  if (temperature >= 40) insights.push({ icon: <AlertTriangle className="w-5 h-5" />, color: 'text-red-400', bg: 'bg-red-500/10 border-red-500/20', title: 'Extreme Heat Alert', text: 'Severe heatwave conditions. Avoid outdoor activity, stay hydrated, and seek air-conditioned spaces.' });
  else if (temperature >= 35) insights.push({ icon: <Thermometer className="w-5 h-5" />, color: 'text-orange-400', bg: 'bg-orange-500/10 border-orange-500/20', title: 'Heat Advisory', text: 'High temperatures expected. Drink plenty of water and limit sun exposure during peak hours.' });

  if (c.includes('rain') || c.includes('shower') || c.includes('drizzle')) insights.push({ icon: <Waves className="w-5 h-5" />, color: 'text-blue-400', bg: 'bg-blue-500/10 border-blue-500/20', title: 'Waterlogging Risk', text: 'Rainfall expected. Watch for waterlogging in low-lying areas. Avoid underpasses and drainage zones.' });
  if (c.includes('thunder')) insights.push({ icon: <ShieldAlert className="w-5 h-5" />, color: 'text-yellow-400', bg: 'bg-yellow-500/10 border-yellow-500/20', title: 'Thunderstorm Warning', text: 'Stay indoors and away from open fields. Unplug electronic devices and avoid tall structures.' });
  if (c.includes('fog') || c.includes('haze') || c.includes('mist')) insights.push({ icon: <Eye className="w-5 h-5" />, color: 'text-gray-400', bg: 'bg-gray-500/10 border-gray-500/20', title: 'Low Visibility', text: 'Foggy conditions may reduce visibility. Drive carefully and use fog lights.' });
  if (humidity > 80) insights.push({ icon: <Droplets className="w-5 h-5" />, color: 'text-cyan-400', bg: 'bg-cyan-500/10 border-cyan-500/20', title: 'High Humidity', text: 'Humidity levels are elevated. Stay in cool environments and wear light, breathable clothing.' });

  if (insights.length === 0) insights.push({ icon: <TrendingUp className="w-5 h-5" />, color: 'text-green-400', bg: 'bg-green-500/10 border-green-500/20', title: 'Favorable Conditions', text: 'Weather conditions are moderate. A good day for outdoor activities with normal precautions.' });

  return insights;
};

const getAmbientGradient = (data) => {
  if (!data) return { main: 'from-emerald-900/20 via-transparent to-transparent', orb1: '#22c55e', orb2: '#06b6d4' };
  const { temperature, condition = '' } = data;
  const c = condition.toLowerCase();
  if (c.includes('rain') || c.includes('thunder') || c.includes('shower')) return { main: 'from-blue-900/25 via-indigo-900/10 to-transparent', orb1: '#3b82f6', orb2: '#6366f1' };
  if (temperature >= 40) return { main: 'from-red-900/25 via-orange-900/10 to-transparent', orb1: '#ef4444', orb2: '#f97316' };
  if (temperature >= 35) return { main: 'from-orange-900/20 via-amber-900/10 to-transparent', orb1: '#f97316', orb2: '#eab308' };
  if (c.includes('fog') || c.includes('haze')) return { main: 'from-slate-800/20 via-gray-900/10 to-transparent', orb1: '#94a3b8', orb2: '#64748b' };
  if (c.includes('snow')) return { main: 'from-blue-100/10 via-cyan-900/5 to-transparent', orb1: '#bfdbfe', orb2: '#06b6d4' };
  return { main: 'from-emerald-900/15 via-teal-900/5 to-transparent', orb1: '#22c55e', orb2: '#06b6d4' };
};

/* ─── animated number ─── */
function AnimatedTemp({ value }) {
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    if (value == null) return;
    let start = display;
    const end = value;
    const duration = 1200;
    const startTime = performance.now();
    const animate = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(start + (end - start) * eased));
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [value]);
  return <span>{display}</span>;
}

/* ─── skeleton ─── */
function Skeleton({ className = '' }) {
  return <div className={`animate-pulse bg-white/5 rounded-xl ${className}`} />;
}

function LoadingSkeleton() {
  return (
    <div className="min-h-screen bg-black pt-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex flex-col items-center gap-4 py-16">
          <Skeleton className="w-32 h-6" />
          <Skeleton className="w-64 h-24" />
          <Skeleton className="w-48 h-8" />
          <Skeleton className="w-56 h-5" />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {[...Array(6)].map((_, i) => <Skeleton key={i} className="h-28" />)}
        </div>
        <Skeleton className="h-48 w-full" />
      </div>
    </div>
  );
}

/* ─── stagger wrapper ─── */
const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};
const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
};

/* ─── metric card (enhanced) ─── */
function MetricCard({ icon, label, value, unit, color = '#22c55e', delay = 0 }) {
  return (
    <motion.div
      variants={fadeUp}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className="rounded-[18px] p-5 flex flex-col items-center gap-3 group cursor-default relative overflow-hidden"
      style={{ background: 'rgba(255,255,255,0.015)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.04)' }}
    >
      <div className="absolute top-0 left-0 right-0 h-px" style={{ background: `linear-gradient(90deg, transparent, ${color}25, transparent)` }} />
      <div className="absolute -top-10 -right-10 w-28 h-28 rounded-full blur-[50px] opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" style={{ background: `${color}0c` }} />
      <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${color}08`, border: `1px solid ${color}15` }}>
        <div style={{ color }}>{icon}</div>
      </div>
      <div className="text-xl sm:text-2xl font-black font-mono tabular-nums tracking-tight">
        {value ?? '—'}<span className="text-[11px] font-normal text-white/25 ml-1">{unit}</span>
      </div>
      <div className="text-[9px] text-white/25 uppercase tracking-[0.15em] font-medium">{label}</div>
    </motion.div>
  );
}

/* ─── forecast card (enhanced) ─── */
function ForecastCard({ day, tempHigh, tempLow, condition, icon }) {
  const tempRange = 50;
  const highPct = Math.min((tempHigh / tempRange) * 100, 100);
  const lowPct = Math.min((tempLow / tempRange) * 100, 100);
  const barColor = tempHigh >= 40 ? '#ef4444' : tempHigh >= 35 ? '#f97316' : tempHigh >= 28 ? '#eab308' : '#22c55e';
  return (
    <motion.div
      variants={fadeUp}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className="rounded-[18px] p-5 flex flex-col items-center gap-3 min-w-[130px] group cursor-default relative overflow-hidden"
      style={{ background: 'rgba(255,255,255,0.015)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.04)' }}
    >
      <div className="absolute top-0 left-0 right-0 h-px" style={{ background: `linear-gradient(90deg, transparent, ${barColor}20, transparent)` }} />
      <span className="text-[10px] font-semibold text-white/40 uppercase tracking-[0.15em]">{day}</span>
      {icon ? (
        <img src={conditionIcon(icon)} alt={condition} className="w-12 h-12 drop-shadow-[0_0_8px_rgba(255,255,255,0.1)]" />
      ) : (
        getConditionEmoji(condition)
      )}
      <span className="text-[10px] text-white/30 capitalize">{condition}</span>
      {/* Temp range bar */}
      <div className="w-full h-1.5 bg-white/[0.03] rounded-full overflow-hidden relative">
        <div className="absolute h-full rounded-full" style={{ left: `${lowPct}%`, width: `${highPct - lowPct}%`, background: `linear-gradient(90deg, ${barColor}60, ${barColor})`, boxShadow: `0 0 6px ${barColor}30` }} />
      </div>
      <div className="flex gap-2 items-baseline">
        <span className="text-lg font-black font-mono" style={{ color: barColor }}>{tempHigh}°</span>
        <span className="text-sm text-white/20 font-mono">{tempLow}°</span>
      </div>
    </motion.div>
  );
}

/* ─── UV Index Gauge ─── */
function UVGauge({ uvIndex = 7 }) {
  const max = 11;
  const pct = Math.min(uvIndex / max, 1);
  const getUVColor = (uv) => {
    if (uv <= 2) return '#22c55e';
    if (uv <= 5) return '#eab308';
    if (uv <= 7) return '#f97316';
    if (uv <= 10) return '#ef4444';
    return '#a855f7';
  };
  const getUVLabel = (uv) => {
    if (uv <= 2) return 'Low';
    if (uv <= 5) return 'Moderate';
    if (uv <= 7) return 'High';
    if (uv <= 10) return 'Very High';
    return 'Extreme';
  };
  const color = getUVColor(uvIndex);
  const radius = 48;
  const circumference = Math.PI * radius; // semi-circle
  const dashOffset = circumference * (1 - pct);

  return (
    <motion.div
      variants={fadeUp}
      whileHover={{ y: -3, transition: { duration: 0.2 } }}
      className="rounded-[18px] p-5 flex flex-col items-center gap-2 group cursor-default relative overflow-hidden"
      style={{ background: 'rgba(255,255,255,0.015)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.04)' }}
    >
      <div className="absolute top-0 left-0 right-0 h-px" style={{ background: `linear-gradient(90deg, transparent, ${color}30, transparent)` }} />
      <div className="flex items-center gap-2 mb-2">
        <Sun className="w-4 h-4" style={{ color }} />
        <span className="text-[9px] text-white/25 uppercase tracking-[0.15em] font-medium">UV Index</span>
      </div>
      <div className="relative w-28 h-16">
        <svg viewBox="0 0 120 65" className="w-full h-full">
          <path d="M 10 60 A 48 48 0 0 1 110 60" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="8" strokeLinecap="round" />
          <motion.path
            d="M 10 60 A 48 48 0 0 1 110 60"
            fill="none" stroke={color} strokeWidth="8" strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: dashOffset }}
            transition={{ duration: 1.5, ease: [0.25, 0.46, 0.45, 0.94] }}
            style={{ filter: `drop-shadow(0 0 8px ${color}50)` }}
          />
        </svg>
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 text-center">
          <span className="text-2xl font-black font-mono" style={{ color }}>{uvIndex}</span>
        </div>
      </div>
      <span className="text-xs font-semibold" style={{ color }}>{getUVLabel(uvIndex)}</span>
      <span className="text-[9px] text-white/20">of {max} max</span>
    </motion.div>
  );
}

/* ─── Wind Compass ─── */
function WindCompass({ windSpeed = 12, windDeg = 225 }) {
  const getDirection = (deg) => {
    const dirs = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
    return dirs[Math.round(deg / 45) % 8];
  };
  return (
    <motion.div
      variants={fadeUp}
      whileHover={{ y: -3, transition: { duration: 0.2 } }}
      className="rounded-[18px] p-5 flex flex-col items-center gap-2 group cursor-default relative overflow-hidden"
      style={{ background: 'rgba(255,255,255,0.015)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.04)' }}
    >
      <div className="absolute top-0 left-0 right-0 h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(34,197,94,0.25), transparent)' }} />
      <div className="flex items-center gap-2 mb-2">
        <Compass className="w-4 h-4 text-emerald-400" />
        <span className="text-[9px] text-white/25 uppercase tracking-[0.15em] font-medium">Wind Direction</span>
      </div>
      <div className="relative w-24 h-24">
        <svg viewBox="0 0 100 100" className="w-full h-full">
          {/* outer ring */}
          <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="1.5" />
          <circle cx="50" cy="50" r="30" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
          {/* cardinal ticks */}
          {['N', 'E', 'S', 'W'].map((dir, i) => {
            const angle = i * 90;
            const rad = (angle - 90) * Math.PI / 180;
            const x = 50 + 46 * Math.cos(rad);
            const y = 50 + 46 * Math.sin(rad);
            return <text key={dir} x={x} y={y} textAnchor="middle" dominantBaseline="central" fill="rgba(255,255,255,0.2)" fontSize="8" fontWeight="600">{dir}</text>;
          })}
          {/* direction arrow */}
          <motion.g
            initial={{ rotate: 0 }}
            animate={{ rotate: windDeg }}
            transition={{ duration: 1.2, ease: [0.25, 0.46, 0.45, 0.94] }}
            style={{ transformOrigin: '50px 50px' }}
          >
            <line x1="50" y1="50" x2="50" y2="18" stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round" />
            <polygon points="50,14 46,22 54,22" fill="#22c55e" />
            <line x1="50" y1="50" x2="50" y2="68" stroke="rgba(255,255,255,0.1)" strokeWidth="1.5" strokeLinecap="round" />
          </motion.g>
          <circle cx="50" cy="50" r="4" fill="#22c55e" style={{ filter: 'drop-shadow(0 0 6px rgba(34,197,94,0.5))' }} />
        </svg>
      </div>
      <div className="text-center">
        <span className="text-lg font-black font-mono text-emerald-400">{windSpeed}</span>
        <span className="text-[10px] text-white/25 ml-1">km/h</span>
      </div>
      <span className="text-[10px] text-white/30 font-medium">{getDirection(windDeg)}</span>
    </motion.div>
  );
}

/* ─── Hourly Mini Forecast ─── */
function HourlyForecast({ currentTemp = 38 }) {
  // Generate realistic hourly data based on current temp
  const hours = useMemo(() => {
    const now = new Date();
    return Array.from({ length: 8 }, (_, i) => {
      const h = new Date(now);
      h.setHours(h.getHours() + i + 1);
      const tempDelta = i < 3 ? Math.round((Math.random() - 0.3) * 3) : -Math.round(Math.random() * 4);
      const temp = currentTemp + tempDelta;
      const conditions = ['Clear', 'Partly Cloudy', 'Clear', 'Haze', 'Clear', 'Clear', 'Partly Cloudy', 'Clear'];
      return {
        time: h.toLocaleTimeString('en-US', { hour: 'numeric', hour12: true }),
        temp,
        condition: conditions[i],
      };
    });
  }, [currentTemp]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="rounded-[20px] p-6 relative overflow-hidden"
      style={{ background: 'rgba(255,255,255,0.015)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.04)' }}
    >
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent" />
      <div className="flex items-center gap-2 mb-5">
        <Clock className="w-4 h-4 text-cyan-400" />
        <span className="text-[10px] text-white/30 uppercase tracking-[0.15em] font-medium">Hourly Forecast</span>
      </div>
      <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none">
        {hours.map((h, i) => {
          const barColor = h.temp >= 40 ? '#ef4444' : h.temp >= 35 ? '#f97316' : h.temp >= 28 ? '#eab308' : '#22c55e';
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06 }}
              className="flex flex-col items-center gap-2.5 min-w-[65px] py-3 px-2 rounded-xl hover:bg-white/[0.02] transition-colors cursor-default"
            >
              <span className="text-[10px] text-white/30 font-medium">{h.time}</span>
              {getConditionEmoji(h.condition)}
              <span className="text-sm font-bold font-mono" style={{ color: barColor }}>{h.temp}°</span>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}

/* ─── Today vs Yesterday Comparison ─── */
function DayComparison({ currentTemp = 38, currentHumidity = 45 }) {
  // Simulate yesterday's data
  const yesterday = useMemo(() => ({
    temp: currentTemp - Math.round((Math.random() - 0.3) * 5),
    humidity: currentHumidity + Math.round((Math.random() - 0.5) * 12),
    windSpeed: Math.round(8 + Math.random() * 10),
  }), [currentTemp, currentHumidity]);

  const today = { temp: currentTemp, humidity: currentHumidity, windSpeed: Math.round(10 + Math.random() * 8) };

  const metrics = [
    { label: 'Temperature', today: `${today.temp}°C`, yesterday: `${yesterday.temp}°C`, delta: today.temp - yesterday.temp, unit: '°C', color: '#f97316' },
    { label: 'Humidity', today: `${today.humidity}%`, yesterday: `${yesterday.humidity}%`, delta: today.humidity - yesterday.humidity, unit: '%', color: '#06b6d4' },
    { label: 'Wind Speed', today: `${today.windSpeed} km/h`, yesterday: `${yesterday.windSpeed} km/h`, delta: today.windSpeed - yesterday.windSpeed, unit: 'km/h', color: '#22c55e' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="rounded-[20px] p-6 relative overflow-hidden"
      style={{ background: 'rgba(255,255,255,0.015)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.04)' }}
    >
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-500/20 to-transparent" />
      <div className="flex items-center gap-2 mb-5">
        <TrendingUp className="w-4 h-4 text-amber-400" />
        <span className="text-[10px] text-white/30 uppercase tracking-[0.15em] font-medium">Today vs Yesterday</span>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {metrics.map((m, i) => (
          <motion.div
            key={m.label}
            initial={{ opacity: 0, x: -15 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="rounded-xl p-4 relative overflow-hidden"
            style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.03)' }}
          >
            <p className="text-[10px] text-white/25 uppercase tracking-wider mb-3 font-medium">{m.label}</p>
            <div className="flex items-end justify-between">
              <div>
                <p className="text-xl font-black font-mono" style={{ color: m.color }}>{m.today}</p>
                <p className="text-[10px] text-white/20 mt-1">Yesterday: {m.yesterday}</p>
              </div>
              <div className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-bold ${
                m.delta > 0 ? 'bg-red-500/10 text-red-400' : m.delta < 0 ? 'bg-blue-500/10 text-blue-400' : 'bg-white/5 text-white/30'
              }`}>
                {m.delta > 0 ? '↑' : m.delta < 0 ? '↓' : '→'}
                {Math.abs(m.delta)}{m.unit}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

/* ─── Floating weather particles ─── */
function WeatherParticles({ condition = '' }) {
  const c = condition.toLowerCase();
  const isRain = c.includes('rain') || c.includes('drizzle') || c.includes('shower');
  const isSnow = c.includes('snow');
  const isSunny = !isRain && !isSnow && !c.includes('fog') && !c.includes('cloud');

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {/* Rain drops */}
      {isRain && [...Array(50)].map((_, i) => (
        <div
          key={`rain-${i}`}
          className="absolute w-px bg-gradient-to-b from-transparent via-blue-400/30 to-transparent"
          style={{
            left: `${Math.random() * 100}%`,
            top: '-10%',
            height: `${15 + Math.random() * 20}px`,
            animation: `rainDrop ${0.6 + Math.random() * 0.4}s linear ${Math.random() * 2}s infinite`,
          }}
        />
      ))}
      {/* Snow flakes */}
      {isSnow && [...Array(30)].map((_, i) => (
        <div
          key={`snow-${i}`}
          className="absolute rounded-full bg-white/20"
          style={{
            left: `${Math.random() * 100}%`,
            top: '-5%',
            width: `${2 + Math.random() * 4}px`,
            height: `${2 + Math.random() * 4}px`,
            animation: `snowFall ${3 + Math.random() * 4}s linear ${Math.random() * 3}s infinite`,
          }}
        />
      ))}
      {/* Sun particles / dust motes for clear weather */}
      {isSunny && [...Array(20)].map((_, i) => (
        <div
          key={`sun-${i}`}
          className="absolute rounded-full"
          style={{
            left: `${20 + Math.random() * 60}%`,
            top: `${10 + Math.random() * 40}%`,
            width: `${1 + Math.random() * 3}px`,
            height: `${1 + Math.random() * 3}px`,
            background: `rgba(234,179,8,${0.08 + Math.random() * 0.12})`,
            animation: `floatMote ${6 + Math.random() * 8}s ease-in-out ${Math.random() * 5}s infinite`,
          }}
        />
      ))}
    </div>
  );
}

/* ─── main page ─── */
export default function Weather() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastFetch, setLastFetch] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(API);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      setData(json);
      setLastFetch(new Date());
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const insights = useMemo(() => data ? getSmartInsight(data.current) : null, [data]);
  const ambientColors = useMemo(() => getAmbientGradient(data?.current), [data]);

  if (loading) return <LoadingSkeleton />;

  if (error) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass rounded-3xl p-8 sm:p-12 text-center max-w-md w-full"
        >
          <CloudRain className="w-16 h-16 text-white/20 mx-auto mb-4" />
          <h2 className="text-xl font-bold mb-2">Weather Data Unavailable</h2>
          <p className="text-white/40 text-sm mb-6">We couldn't fetch weather data right now. Please try again.</p>
          <button
            onClick={fetchData}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-resilient-green/20 text-resilient-green hover:bg-resilient-green/30 transition-colors font-medium"
          >
            <RefreshCw className="w-4 h-4" /> Retry
          </button>
        </motion.div>
      </div>
    );
  }

  const w = data?.current;
  const forecast = data?.forecast || [];

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Dynamic ambient background */}
      <div className={`fixed inset-0 bg-gradient-to-b ${ambientColors.main} pointer-events-none transition-all duration-1000`} />
      <div className="fixed top-20 left-1/4 w-[500px] h-[400px] rounded-full blur-[200px] opacity-[0.04] pointer-events-none transition-all duration-1000" style={{ background: `radial-gradient(ellipse, ${ambientColors.orb1}, transparent 65%)` }} />
      <div className="fixed top-40 right-1/4 w-[400px] h-[300px] rounded-full blur-[180px] opacity-[0.03] pointer-events-none transition-all duration-1000" style={{ background: `radial-gradient(ellipse, ${ambientColors.orb2}, transparent 65%)` }} />

      {/* Weather particles */}
      <WeatherParticles condition={w?.condition} />

      <style>{`
        @keyframes rainDrop {
          0% { transform: translateY(-10vh); opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { transform: translateY(110vh); opacity: 0; }
        }
        @keyframes snowFall {
          0% { transform: translateY(-5vh) translateX(0); opacity: 0; }
          10% { opacity: 0.6; }
          50% { transform: translateY(50vh) translateX(20px); }
          90% { opacity: 0.4; }
          100% { transform: translateY(105vh) translateX(-10px); opacity: 0; }
        }
        @keyframes floatMote {
          0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.1; }
          25% { transform: translate(10px, -15px) scale(1.3); opacity: 0.2; }
          50% { transform: translate(-5px, -25px) scale(1); opacity: 0.15; }
          75% { transform: translate(15px, -10px) scale(1.2); opacity: 0.18; }
        }
        .scrollbar-none::-webkit-scrollbar { display: none; }
        .scrollbar-none { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      <div className="relative z-10 pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-10">

          {/* ───── HERO: Current Weather ───── */}
          <motion.section
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
            className="flex flex-col items-center text-center py-8 sm:py-12"
          >
            {/* Location badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass text-sm text-white/60 mb-6"
            >
              <MapPin className="w-3.5 h-3.5 text-resilient-green" />
              <span>{w?.city || 'Delhi'}, India</span>
              <span className="w-1.5 h-1.5 rounded-full bg-resilient-green animate-pulse" />
            </motion.div>

            {/* Temperature */}
            <div className="relative mb-2">
              <span className="text-[7rem] sm:text-[9rem] lg:text-[11rem] font-black leading-none tracking-tighter bg-gradient-to-b from-white via-white to-white/30 bg-clip-text text-transparent">
                <AnimatedTemp value={w?.temperature} />
                <span className="text-4xl sm:text-5xl align-top ml-1">°C</span>
              </span>
              {/* Glowing halo behind temp */}
              <div className="absolute inset-0 -z-10 flex items-center justify-center">
                <div className="w-48 h-48 rounded-full blur-[80px] opacity-[0.08]" style={{ background: ambientColors.orb1 }} />
              </div>
            </div>

            {/* Condition */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="flex items-center gap-3 mb-3"
            >
              {w?.icon ? (
                <img src={conditionIcon(w.icon)} alt={w.condition} className="w-12 h-12 drop-shadow-[0_0_12px_rgba(255,255,255,0.15)]" />
              ) : (
                getConditionEmoji(w?.condition)
              )}
              <span className="text-xl sm:text-2xl font-medium text-white/80 capitalize">{w?.description || w?.condition}</span>
            </motion.div>

            {/* Feels like + range */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="flex flex-wrap items-center justify-center gap-4 text-sm text-white/40"
            >
              <span>Feels like <strong className="text-white/70">{w?.feelsLike}°</strong></span>
              <span className="w-1 h-1 rounded-full bg-white/20" />
              <span>H: <strong className="text-white/70">{w?.tempMax}°</strong></span>
              <span>L: <strong className="text-white/70">{w?.tempMin}°</strong></span>
            </motion.div>

            {/* Source + refresh */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="flex items-center gap-3 mt-6 text-xs text-white/20"
            >
              <span>via {data?.source || 'API'}</span>
              <button onClick={fetchData} className="hover:text-white/50 transition-colors" title="Refresh">
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
              {lastFetch && <span>Updated {lastFetch.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</span>}
            </motion.div>
          </motion.section>

          {/* ───── METRICS GRID ───── */}
          <motion.section
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-50px' }}
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4"
          >
            <MetricCard icon={<Droplets className="w-5 h-5" />} label="Humidity" value={w?.humidity} unit="%" color="#06b6d4" />
            <MetricCard icon={<Wind className="w-5 h-5" />} label="Wind" value={w?.windSpeed} unit="km/h" color="#22c55e" />
            <MetricCard icon={<Eye className="w-5 h-5" />} label="Visibility" value={w?.visibility} unit="km" color="#a855f7" />
            <MetricCard icon={<Gauge className="w-5 h-5" />} label="Pressure" value={w?.pressure} unit="hPa" color="#f97316" />
            <MetricCard icon={<Sunrise className="w-5 h-5" />} label="Sunrise" value={w?.sunrise} unit="" color="#eab308" />
            <MetricCard icon={<Sunset className="w-5 h-5" />} label="Sunset" value={w?.sunset} unit="" color="#ef4444" />
          </motion.section>

          {/* ───── HOURLY FORECAST ───── */}
          <HourlyForecast currentTemp={w?.temperature || 35} />

          {/* ───── UV INDEX + WIND COMPASS ───── */}
          <motion.section
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-50px' }}
            className="grid grid-cols-1 sm:grid-cols-2 gap-4"
          >
            <UVGauge uvIndex={w?.uvi || 7} />
            <WindCompass windSpeed={w?.windSpeed || 12} windDeg={w?.windDeg || 225} />
          </motion.section>

          {/* ───── 5-DAY FORECAST ───── */}
          {forecast.length > 0 && (
            <motion.section
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="font-display font-bold text-xl text-white mb-5 flex items-center gap-2">5-Day <span className="text-emerald-400">Forecast</span></h2>
              <motion.div
                variants={stagger}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
                className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 sm:gap-4"
              >
                {forecast.map((day, i) => (
                  <ForecastCard key={day.date} {...day} />
                ))}
              </motion.div>
            </motion.section>
          )}

          {/* ───── TODAY VS YESTERDAY ───── */}
          <DayComparison currentTemp={w?.temperature || 38} currentHumidity={w?.humidity || 45} />

          {/* ───── SMART INSIGHTS ───── */}
          {insights && insights.length > 0 && (
            <motion.section
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="font-display font-bold text-xl text-white mb-5 flex items-center gap-2">Today's <span className="text-cyan-400">Climate Insights</span></h2>
              <div className="grid gap-3 sm:gap-4 md:grid-cols-2">
                {insights.map((ins, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1, duration: 0.4 }}
                    whileHover={{ y: -3, transition: { duration: 0.2 } }}
                    className={`rounded-[18px] border p-5 flex gap-4 items-start cursor-default ${ins.bg}`}
                  >
                    <div className={`mt-0.5 ${ins.color}`}>{ins.icon}</div>
                    <div>
                      <h3 className={`font-semibold text-sm mb-1 ${ins.color}`}>{ins.title}</h3>
                      <p className="text-sm text-white/50 leading-relaxed">{ins.text}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.section>
          )}

        </div>
      </div>
    </div>
  );
}
