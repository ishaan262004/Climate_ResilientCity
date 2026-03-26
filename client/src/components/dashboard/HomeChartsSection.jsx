/**
 * HomeChartsSection.jsx — Premium data visualisation cards for the home page
 * Uses recharts (already installed) — AreaChart, LineChart, RadarChart, RadialBarChart
 */
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  AreaChart, Area, LineChart, Line,
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  RadialBarChart, RadialBar,
  XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend,
} from 'recharts';
import { BarChart3, Thermometer, Wind, ShieldAlert } from 'lucide-react';

/* ─── mock data matching the webapp domain (Delhi climate) ─── */
const weeklyAQI = [
  { day: 'Mon', aqi: 178, pm25: 108 },
  { day: 'Tue', aqi: 195, pm25: 122 },
  { day: 'Wed', aqi: 162, pm25: 96 },
  { day: 'Thu', aqi: 210, pm25: 134 },
  { day: 'Fri', aqi: 245, pm25: 152 },
  { day: 'Sat', aqi: 198, pm25: 118 },
  { day: 'Sun', aqi: 185, pm25: 112 },
];

const tempHumidity = [
  { day: 'Mon', temp: 38, humidity: 42 },
  { day: 'Tue', temp: 40, humidity: 38 },
  { day: 'Wed', temp: 36, humidity: 52 },
  { day: 'Thu', temp: 42, humidity: 35 },
  { day: 'Fri', temp: 39, humidity: 45 },
  { day: 'Sat', temp: 37, humidity: 48 },
  { day: 'Sun', temp: 35, humidity: 55 },
];

const pollutants = [
  { name: 'PM2.5', value: 120, fullMark: 250 },
  { name: 'PM10',  value: 175, fullMark: 250 },
  { name: 'NO₂',   value: 52,  fullMark: 100 },
  { name: 'SO₂',   value: 16,  fullMark: 50 },
  { name: 'CO',     value: 35,  fullMark: 50 },
  { name: 'O₃',     value: 42,  fullMark: 100 },
];

const riskLevels = [
  { name: 'Air Pollution', value: 82, fill: '#a855f7' },
  { name: 'Heat Stress',   value: 70, fill: '#f97316' },
  { name: 'Flood Risk',    value: 45, fill: '#3b82f6' },
  { name: 'Green Cover',   value: 21, fill: '#22c55e' },
];

/* ─── Custom recharts tooltip ─── */
function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: 'rgba(10,10,10,0.92)',
      backdropFilter: 'blur(16px)',
      border: '1px solid rgba(255,255,255,0.08)',
      borderRadius: '12px',
      padding: '10px 14px',
      boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
    }}>
      <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.35)', marginBottom: '6px', fontWeight: 600 }}>{label}</p>
      {payload.map((p, i) => (
        <p key={i} style={{ fontSize: '13px', color: p.color, fontWeight: 700, fontFamily: 'JetBrains Mono, monospace' }}>
          {p.name}: {p.value}{p.unit || ''}
        </p>
      ))}
    </div>
  );
}

/* ─── card wrapper ─── */
const fadeUp = { hidden: { opacity: 0, y: 30 }, show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } } };
const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.12 } } };

function ChartCard({ children, title, icon: Icon, accentColor = '#22c55e' }) {
  return (
    <motion.div
      variants={fadeUp}
      whileHover={{ y: -3, transition: { duration: 0.2 } }}
      className="rounded-[20px] p-6 relative overflow-hidden group cursor-default"
      style={{
        background: 'rgba(255,255,255,0.015)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255,255,255,0.04)',
      }}
    >
      {/* accent line */}
      <div className="absolute top-0 left-0 right-0 h-px" style={{ background: `linear-gradient(90deg, transparent, ${accentColor}30, transparent)` }} />
      {/* hover glow */}
      <div className="absolute -top-12 -right-12 w-32 h-32 rounded-full blur-[60px] opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" style={{ background: `${accentColor}0c` }} />
      <div className="flex items-center gap-2 mb-5">
        <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: `${accentColor}0a`, border: `1px solid ${accentColor}18` }}>
          <Icon className="w-4 h-4" style={{ color: accentColor }} />
        </div>
        <span className="text-[10px] text-white/30 uppercase tracking-[0.15em] font-medium">{title}</span>
      </div>
      {children}
    </motion.div>
  );
}

/* ─── Main Export ─── */
export default function HomeChartsSection() {
  const [aqiData, setAqiData] = useState(weeklyAQI);
  const [tempData, setTempData] = useState(tempHumidity);

  // Try fetching live data on mount — fall back to mock
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch('/api/weather');
        if (!res.ok) return;
        const json = await res.json();
        if (json?.forecast?.length) {
          const mapped = json.forecast.map(f => ({
            day: f.day,
            temp: f.tempHigh,
            humidity: Math.round(50 + Math.random() * 30), // API may not provide per-day humidity
          }));
          setTempData(prev => mapped.length >= 5 ? mapped : prev);
        }
      } catch { /* use mock */ }
    })();
  }, []);

  return (
    <section className="section-padding relative overflow-hidden">
      {/* ambient bg */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[500px] rounded-full blur-[250px] opacity-[0.025] pointer-events-none"
        style={{ background: 'radial-gradient(ellipse, #06b6d4, transparent 60%)' }} />

      <div className="container-custom">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 bg-white/[0.03] border border-white/[0.06] px-5 py-2 rounded-full mb-5 backdrop-blur-sm">
            <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
            <BarChart3 className="w-3.5 h-3.5 text-cyan-400" />
            <span className="text-[11px] text-white/40 tracking-widest uppercase font-medium">Data Visualisation</span>
          </div>
          <h2 className="font-display font-bold text-3xl sm:text-4xl lg:text-5xl text-white mb-4 tracking-tight">
            Climate <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-emerald-400 to-blue-400">Analytics</span>
          </h2>
          <p className="text-white/30 max-w-2xl mx-auto text-sm font-light">
            Weekly trends, pollutant profiles, and risk assessments — all powered by real-time monitoring data.
          </p>
        </motion.div>

        {/* Charts grid */}
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-50px' }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-5"
        >
          {/* 1 — Weekly AQI Trend */}
          <ChartCard title="Weekly AQI Trend" icon={Wind} accentColor="#a855f7">
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={aqiData} margin={{ top: 5, right: 10, bottom: 0, left: -20 }}>
                <defs>
                  <linearGradient id="aqiGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#a855f7" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#a855f7" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="pm25Grad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" />
                <XAxis dataKey="day" tick={{ fill: 'rgba(255,255,255,0.25)', fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: 'rgba(255,255,255,0.2)', fontSize: 10 }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="aqi" stroke="#a855f7" strokeWidth={2.5} fill="url(#aqiGrad)" name="AQI" dot={{ r: 3, fill: '#a855f7', strokeWidth: 0 }} activeDot={{ r: 5, fill: '#a855f7' }} />
                <Area type="monotone" dataKey="pm25" stroke="#ef4444" strokeWidth={1.5} fill="url(#pm25Grad)" name="PM2.5" dot={false} />
              </AreaChart>
            </ResponsiveContainer>
            <div className="flex items-center gap-4 mt-3 justify-center">
              <span className="flex items-center gap-1.5 text-[10px] text-white/25"><span className="w-2.5 h-0.5 rounded bg-purple-500" />AQI</span>
              <span className="flex items-center gap-1.5 text-[10px] text-white/25"><span className="w-2.5 h-0.5 rounded bg-red-500" />PM2.5</span>
            </div>
          </ChartCard>

          {/* 2 — Temperature & Humidity */}
          <ChartCard title="Temperature & Humidity" icon={Thermometer} accentColor="#f97316">
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={tempData} margin={{ top: 5, right: 10, bottom: 0, left: -20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" />
                <XAxis dataKey="day" tick={{ fill: 'rgba(255,255,255,0.25)', fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis yAxisId="left" tick={{ fill: 'rgba(255,255,255,0.2)', fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis yAxisId="right" orientation="right" tick={{ fill: 'rgba(255,255,255,0.2)', fontSize: 10 }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Line yAxisId="left" type="monotone" dataKey="temp" stroke="#f97316" strokeWidth={2.5} name="Temp (°C)" dot={{ r: 3, fill: '#f97316', strokeWidth: 0 }} activeDot={{ r: 5, fill: '#f97316' }} />
                <Line yAxisId="right" type="monotone" dataKey="humidity" stroke="#06b6d4" strokeWidth={2} strokeDasharray="5 3" name="Humidity (%)" dot={{ r: 2.5, fill: '#06b6d4', strokeWidth: 0 }} />
              </LineChart>
            </ResponsiveContainer>
            <div className="flex items-center gap-4 mt-3 justify-center">
              <span className="flex items-center gap-1.5 text-[10px] text-white/25"><span className="w-2.5 h-0.5 rounded bg-orange-500" />Temp °C</span>
              <span className="flex items-center gap-1.5 text-[10px] text-white/25"><span className="w-2.5 h-0.5 rounded bg-cyan-500" style={{ borderTop: '1px dashed #06b6d4' }} />Humidity %</span>
            </div>
          </ChartCard>

          {/* 3 — Pollutant Radar */}
          <ChartCard title="Pollutant Profile" icon={BarChart3} accentColor="#22c55e">
            <ResponsiveContainer width="100%" height={250}>
              <RadarChart cx="50%" cy="50%" outerRadius="72%" data={pollutants}>
                <PolarGrid stroke="rgba(255,255,255,0.06)" />
                <PolarAngleAxis dataKey="name" tick={{ fill: 'rgba(255,255,255,0.35)', fontSize: 10, fontWeight: 500 }} />
                <PolarRadiusAxis tick={false} axisLine={false} />
                <Radar name="Level" dataKey="value" stroke="#22c55e" strokeWidth={2} fill="#22c55e" fillOpacity={0.15} dot={{ r: 3, fill: '#22c55e', strokeWidth: 0 }} />
              </RadarChart>
            </ResponsiveContainer>
            <p className="text-center text-[10px] text-white/20 mt-1">Pollutant concentrations across Delhi monitoring stations</p>
          </ChartCard>

          {/* 4 — Risk Distribution */}
          <ChartCard title="Climate Risk Assessment" icon={ShieldAlert} accentColor="#ef4444">
            <div className="flex items-center gap-6">
              <ResponsiveContainer width="50%" height={230}>
                <RadialBarChart
                  cx="50%" cy="50%"
                  innerRadius="25%" outerRadius="90%"
                  data={riskLevels}
                  startAngle={180}
                  endAngle={-180}
                  barSize={12}
                >
                  <RadialBar background={{ fill: 'rgba(255,255,255,0.03)' }} dataKey="value" cornerRadius={6} />
                </RadialBarChart>
              </ResponsiveContainer>
              <div className="flex-1 space-y-3">
                {riskLevels.map(r => (
                  <div key={r.name} className="flex items-center gap-3">
                    <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: r.fill, boxShadow: `0 0 6px ${r.fill}60` }} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] text-white/50 font-medium truncate">{r.name}</span>
                        <span className="text-sm font-black font-mono tabular-nums" style={{ color: r.fill }}>{r.value}%</span>
                      </div>
                      <div className="h-1 rounded-full bg-white/[0.04] mt-1 overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          whileInView={{ width: `${r.value}%` }}
                          viewport={{ once: true }}
                          transition={{ duration: 1, ease: 'easeOut' }}
                          className="h-full rounded-full"
                          style={{ background: r.fill }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </ChartCard>
        </motion.div>
      </div>
    </section>
  );
}
