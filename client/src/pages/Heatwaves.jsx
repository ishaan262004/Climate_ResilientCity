/**
 * Heatwaves.jsx — Premium Heatwave Intelligence Dashboard
 * Features: Recharts temperature trend, radial heat index gauge, animated stats,
 * UHI hot zone cards, impact cards with icons, solution cards, glassmorphism.
 */
import { useState, useEffect, useRef, useMemo } from 'react';
import { motion, useInView } from 'framer-motion';
import {
  Flame, Thermometer, Shield, AlertTriangle, Users, Building2,
  Leaf, Sun, Zap, Droplets, Wind, Heart, MapPin, TrendingUp,
  Activity, BarChart3, Calendar, Eye,
} from 'lucide-react';
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ReferenceLine, BarChart, Bar, RadialBarChart, RadialBar,
} from 'recharts';

// ─── Animated count-up ────────────────────────────────────────────────────────
function useCountUp(target, duration = 1200, trigger = true) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!trigger) return;
    const startTime = performance.now();
    function step(now) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(eased * target));
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }, [target, duration, trigger]);
  return count;
}

function StatCard({ value, suffix = '', label, icon: Icon, color, delay = 0 }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-30px' });
  const numPart = parseInt(value);
  const animated = useCountUp(isNaN(numPart) ? 0 : numPart, 1400, isInView);
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
      transition={{ delay, duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
      whileHover={{ y: -6, transition: { duration: 0.2 } }}
      className="rounded-[20px] p-6 text-center relative overflow-hidden group cursor-default"
      style={{ background: 'rgba(255,255,255,0.015)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.04)' }}
    >
      <div className="absolute top-0 left-0 right-0 h-px" style={{ background: `linear-gradient(90deg, transparent, ${color}35, transparent)` }} />
      <div className="absolute -top-12 -right-12 w-32 h-32 rounded-full blur-[60px] opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" style={{ background: `${color}10` }} />
      <div className="w-11 h-11 rounded-xl mx-auto mb-3 flex items-center justify-center" style={{ background: `${color}0a`, border: `1px solid ${color}18` }}>
        <Icon className="w-5 h-5" style={{ color }} />
      </div>
      <p className="text-3xl font-black font-mono tabular-nums" style={{ color }}>
        {isNaN(numPart) ? value : animated}{suffix}
      </p>
      <p className="text-[11px] text-white/30 mt-1">{label}</p>
    </motion.div>
  );
}

// ─── Temperature Trend (Recharts) ─────────────────────────────────────────────
const monthlyData = [
  { month: 'Jan', avg: 15, max: 22, min: 8 },
  { month: 'Feb', avg: 18, max: 26, min: 11 },
  { month: 'Mar', avg: 25, max: 33, min: 17 },
  { month: 'Apr', avg: 33, max: 40, min: 25 },
  { month: 'May', avg: 39, max: 47, min: 30 },
  { month: 'Jun', avg: 38, max: 48, min: 29 },
  { month: 'Jul', avg: 35, max: 42, min: 28 },
  { month: 'Aug', avg: 33, max: 39, min: 27 },
  { month: 'Sep', avg: 32, max: 38, min: 26 },
  { month: 'Oct', avg: 28, max: 35, min: 20 },
  { month: 'Nov', avg: 22, max: 30, min: 14 },
  { month: 'Dec', avg: 16, max: 23, min: 9 },
];

function TempTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;
  const d = payload[0]?.payload;
  return (
    <div style={{
      background: 'rgba(8,8,8,0.92)', backdropFilter: 'blur(20px)',
      border: '1px solid rgba(255,255,255,0.06)', borderRadius: '14px',
      padding: '14px 16px', minWidth: '130px', boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
    }}>
      <p style={{ fontSize: '10px', color: 'rgba(255,255,255,0.25)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{d?.month}</p>
      <div style={{ display: 'flex', gap: '14px' }}>
        <div><span style={{ fontSize: '18px', fontWeight: 900, color: '#ef4444', fontFamily: 'monospace' }}>{d?.max}°</span><p style={{ fontSize: '8px', color: 'rgba(255,255,255,0.2)' }}>MAX</p></div>
        <div><span style={{ fontSize: '18px', fontWeight: 900, color: '#f97316', fontFamily: 'monospace' }}>{d?.avg}°</span><p style={{ fontSize: '8px', color: 'rgba(255,255,255,0.2)' }}>AVG</p></div>
        <div><span style={{ fontSize: '18px', fontWeight: 900, color: '#3b82f6', fontFamily: 'monospace' }}>{d?.min}°</span><p style={{ fontSize: '8px', color: 'rgba(255,255,255,0.2)' }}>MIN</p></div>
      </div>
    </div>
  );
}

// ─── Urban Heat Island zones ──────────────────────────────────────────────────
const uhiZones = [
  { name: 'Connaught Place', temp: '+6.2°C', risk: 'Extreme', color: '#ef4444', desc: 'Dense commercial hub with extensive concrete. Peak island effect during summer afternoons.' },
  { name: 'Chandni Chowk', temp: '+5.8°C', risk: 'Extreme', color: '#ef4444', desc: 'Narrow lanes, minimal ventilation, high population density. Nighttime heat trapping.' },
  { name: 'Anand Vihar', temp: '+5.1°C', risk: 'Very High', color: '#f97316', desc: 'Major transport hub with heavy vehicular emissions. Combined heat-pollution stress.' },
  { name: 'Mundka Industrial', temp: '+4.5°C', risk: 'Very High', color: '#f97316', desc: 'Industrial activity and waste heat generators compound urban heating.' },
  { name: 'Dwarka Sector 21', temp: '+3.2°C', risk: 'High', color: '#eab308', desc: 'Newer construction with some green cover. Heat moderately elevated.' },
  { name: 'Lodhi Gardens Area', temp: '+1.1°C', risk: 'Moderate', color: '#22c55e', desc: 'Significant green cover provides natural cooling. Model for urban forestry.' },
];

// ─── Impacts & Solutions ──────────────────────────────────────────────────────
const impacts = [
  { icon: Heart, color: '#ef4444', title: 'Heat Stroke', desc: 'Heat stroke and dehydration in outdoor workers — 200+ deaths annually' },
  { icon: Users, color: '#f97316', title: 'Vulnerable Population', desc: 'Increased mortality among elderly, children, and unhoused individuals' },
  { icon: Zap, color: '#eab308', title: 'Power Grid Collapse', desc: 'Peak AC demand causes grid failures — 15-20 major outages every summer' },
  { icon: Droplets, color: '#06b6d4', title: 'Water Crisis', desc: 'Water demand spikes 40% during heatwaves, depleting already low reserves' },
  { icon: Leaf, color: '#22c55e', title: 'Agricultural Loss', desc: 'Crop yields reduced 15-25% during extreme heat weeks, affecting food prices' },
  { icon: AlertTriangle, color: '#a855f7', title: 'Mental Health', desc: 'Prolonged heat exposure linked to increased aggression, anxiety, and sleep disorders' },
];

const solutions = [
  { title: 'Cool Roofs', desc: 'Reflective roof coatings reduce indoor temps by 3-5°C, cutting AC costs 30%.', icon: Building2, color: '#06b6d4', stat: '-5°C', statLabel: 'Indoor Reduction' },
  { title: 'Urban Forests', desc: 'A single tree cools surrounding area by 2-9°C. Strategic planting in heat corridors.', icon: Leaf, color: '#22c55e', stat: '2-9°C', statLabel: 'Cooling Effect' },
  { title: 'Early Warning', desc: 'Color-coded alerts help communities prepare 72 hours in advance.', icon: Zap, color: '#eab308', stat: '72hr', statLabel: 'Lead Time' },
  { title: 'Water Infra', desc: 'Public drinking stations and misting fans in high-traffic areas.', icon: Shield, color: '#3b82f6', stat: '500+', statLabel: 'Stations Needed' },
];

// ─── Yearly temp comparison bar data ──────────────────────────────────────────
const yearlyComparison = [
  { year: '2019', maxTemp: 44.6, heatDays: 18 },
  { year: '2020', maxTemp: 45.2, heatDays: 22 },
  { year: '2021', maxTemp: 43.8, heatDays: 15 },
  { year: '2022', maxTemp: 49.2, heatDays: 33 },
  { year: '2023', maxTemp: 47.1, heatDays: 28 },
  { year: '2024', maxTemp: 48.5, heatDays: 30 },
  { year: '2025', maxTemp: 47.8, heatDays: 26 },
];

export default function Heatwaves() {
  return (
    <div className="min-h-screen pt-20">
      {/* Hero */}
      <section className="relative section-padding overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[450px] rounded-full blur-[220px] opacity-[0.08] animate-pulse-slow"
            style={{ background: 'radial-gradient(ellipse, #ef4444, transparent 60%)' }} />
          <div className="absolute top-20 left-1/4 w-[400px] h-[300px] rounded-full blur-[180px] opacity-[0.06]"
            style={{ background: 'radial-gradient(ellipse, #f97316, transparent 65%)' }} />
        </div>
        <div className="container-custom relative">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} className="text-center">
            <div className="inline-flex items-center gap-2 bg-white/[0.03] border border-white/[0.06] px-5 py-2 rounded-full mb-7 backdrop-blur-sm">
              <div className="w-1.5 h-1.5 rounded-full bg-orange-400 animate-pulse" />
              <Flame className="w-3.5 h-3.5 text-orange-400" />
              <span className="text-[11px] text-white/40 tracking-widest uppercase font-medium">Extreme Heat Intelligence</span>
            </div>
            <h1 className="font-display font-black text-4xl sm:text-6xl lg:text-7xl text-white mb-5 tracking-tight leading-[1.05]">
              Heatwaves in{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-red-400 to-rose-400">Delhi</span>
            </h1>
            <motion.p initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
              className="text-white/30 text-base max-w-3xl leading-relaxed font-light mx-auto">
              Delhi is one of the fastest-warming cities globally. Extreme heat events are becoming more frequent,
              lasting longer, and reaching dangerously high temperatures — putting 20 million people at risk every summer.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="section-padding pt-0">
        <div className="container-custom">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <StatCard value="49" suffix="°C" label="Peak Temperature (2022)" icon={Thermometer} color="#ef4444" delay={0} />
            <StatCard value="200" suffix="+" label="Annual Heat Deaths" icon={AlertTriangle} color="#f97316" delay={0.08} />
            <StatCard value="6" suffix="°C" label="Urban Heat Island Effect" icon={Sun} color="#eab308" delay={0.16} />
            <StatCard value="33" suffix="" label="Heatwave Days (2022)" icon={Calendar} color="#a855f7" delay={0.24} />
          </div>
        </div>
      </section>

      {/* Monthly Temperature Trend Chart */}
      <section className="section-padding pt-0">
        <div className="container-custom">
          <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="rounded-[22px] overflow-hidden relative"
            style={{ background: 'rgba(255,255,255,0.015)', border: '1px solid rgba(255,255,255,0.04)' }}
          >
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-orange-500/25 to-transparent" />
            <div className="p-7 sm:p-9">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 rounded-[10px] flex items-center justify-center"
                      style={{ background: 'rgba(249,115,22,0.08)', border: '1px solid rgba(249,115,22,0.15)' }}>
                      <TrendingUp className="w-4 h-4 text-orange-400" />
                    </div>
                    <span className="text-[10px] text-white/25 uppercase tracking-[0.15em] font-medium">Temperature Profile</span>
                  </div>
                  <h3 className="font-display font-bold text-2xl text-white tracking-tight">
                    Monthly <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-400">Temperature</span>
                  </h3>
                  <p className="text-[12px] text-white/25 mt-1">Delhi annual temperature range with min, avg, and max</p>
                </div>
                {/* Quick stats */}
                <div className="flex gap-3">
                  {[
                    { label: 'Hottest', value: 'Jun', color: '#ef4444' },
                    { label: 'Coolest', value: 'Jan', color: '#3b82f6' },
                    { label: 'Range', value: '40°', color: '#eab308' },
                  ].map((s, i) => (
                    <div key={i} className="text-center rounded-[14px] px-4 py-3"
                      style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.04)' }}>
                      <p className="text-[8px] text-white/15 uppercase tracking-wider mb-1">{s.label}</p>
                      <p className="text-lg font-black font-mono" style={{ color: s.color }}>{s.value}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="h-[280px] -mx-2">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={monthlyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="maxGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#ef4444" stopOpacity={0.2} />
                        <stop offset="100%" stopColor="#ef4444" stopOpacity={0.01} />
                      </linearGradient>
                      <linearGradient id="avgGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#f97316" stopOpacity={0.15} />
                        <stop offset="100%" stopColor="#f97316" stopOpacity={0.01} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.025)" vertical={false} />
                    <XAxis dataKey="month" tick={{ fill: 'rgba(255,255,255,0.15)', fontSize: 10 }} axisLine={{ stroke: 'rgba(255,255,255,0.04)' }} tickLine={false} />
                    <YAxis tick={{ fill: 'rgba(255,255,255,0.12)', fontSize: 10 }} axisLine={false} tickLine={false} domain={[0, 55]} />
                    <Tooltip content={<TempTooltip />} cursor={{ stroke: 'rgba(255,255,255,0.06)' }} />
                    <ReferenceLine y={40} stroke="rgba(239,68,68,0.15)" strokeDasharray="6 6" label={{ value: 'Heatwave threshold', fill: 'rgba(239,68,68,0.2)', fontSize: 9, position: 'right' }} />
                    <Area type="monotone" dataKey="max" stroke="#ef4444" strokeWidth={2} fill="url(#maxGrad)" dot={{ r: 3, fill: '#0a0a0a', stroke: '#ef4444', strokeWidth: 2 }} />
                    <Area type="monotone" dataKey="avg" stroke="#f97316" strokeWidth={2} fill="url(#avgGrad)" dot={{ r: 3, fill: '#0a0a0a', stroke: '#f97316', strokeWidth: 2 }} />
                    <Area type="monotone" dataKey="min" stroke="#3b82f6" strokeWidth={1.5} fill="none" strokeDasharray="4 4" dot={{ r: 2, fill: '#0a0a0a', stroke: '#3b82f6', strokeWidth: 1.5 }} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              <div className="flex items-center justify-center gap-6 mt-4 pt-4" style={{ borderTop: '1px solid rgba(255,255,255,0.03)' }}>
                {[{ label: 'Maximum', color: '#ef4444' }, { label: 'Average', color: '#f97316' }, { label: 'Minimum', color: '#3b82f6' }].map((l, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <div className="w-5 h-0.5 rounded-full" style={{ background: l.color }} />
                    <span className="text-[10px] text-white/20">{l.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Yearly Comparison — Heatwave Days Bar Chart */}
      <section className="section-padding pt-0">
        <div className="container-custom">
          <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="rounded-[22px] overflow-hidden relative"
            style={{ background: 'rgba(255,255,255,0.015)', border: '1px solid rgba(255,255,255,0.04)' }}
          >
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-red-500/20 to-transparent" />
            <div className="p-7 sm:p-9">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-[10px] flex items-center justify-center"
                  style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.15)' }}>
                  <BarChart3 className="w-4 h-4 text-red-400" />
                </div>
                <span className="text-[10px] text-white/25 uppercase tracking-[0.15em] font-medium">Year-over-Year Comparison</span>
              </div>
              <h3 className="font-display font-bold text-2xl text-white tracking-tight mb-1">
                Heatwave <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-orange-400">Days</span>
              </h3>
              <p className="text-[12px] text-white/25 mb-6">Number of days temperatures crossed 40°C threshold</p>

              <div className="h-[220px] -mx-2">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={yearlyComparison} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.025)" vertical={false} />
                    <XAxis dataKey="year" tick={{ fill: 'rgba(255,255,255,0.2)', fontSize: 10 }} axisLine={{ stroke: 'rgba(255,255,255,0.04)' }} tickLine={false} />
                    <YAxis tick={{ fill: 'rgba(255,255,255,0.12)', fontSize: 10 }} axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={{ background: 'rgba(8,8,8,0.92)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '12px', fontSize: '11px', color: '#fff' }} />
                    <Bar dataKey="heatDays" name="Heatwave Days" radius={[6, 6, 0, 0]} fill="url(#barGrad)" />
                    <defs>
                      <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#ef4444" stopOpacity={0.9} />
                        <stop offset="100%" stopColor="#f97316" stopOpacity={0.4} />
                      </linearGradient>
                    </defs>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Urban Heat Island Zones */}
      <section className="section-padding pt-0">
        <div className="container-custom">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-8">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-[10px] flex items-center justify-center"
                style={{ background: 'rgba(249,115,22,0.08)', border: '1px solid rgba(249,115,22,0.15)' }}>
                <MapPin className="w-4 h-4 text-orange-400" />
              </div>
              <span className="text-[10px] text-white/25 uppercase tracking-[0.15em] font-medium">Urban Heat Islands</span>
            </div>
            <h3 className="font-display font-bold text-2xl text-white tracking-tight">
              Delhi <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-yellow-400">Hot Zones</span>
            </h3>
            <p className="text-[12px] text-white/25 mt-1">Temperature anomaly above surrounding rural areas</p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {uhiZones.map((zone, i) => (
              <motion.div
                key={zone.name}
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                className="rounded-[18px] p-5 relative overflow-hidden group cursor-default"
                style={{ background: 'rgba(255,255,255,0.015)', border: '1px solid rgba(255,255,255,0.04)' }}
              >
                <div className="absolute top-0 left-0 right-0 h-px" style={{ background: `linear-gradient(90deg, transparent, ${zone.color}30, transparent)` }} />
                <div className="absolute -top-10 -right-10 w-28 h-28 rounded-full blur-[50px] opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" style={{ background: `${zone.color}08` }} />

                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5" style={{ color: zone.color }} />
                    <span className="text-sm font-semibold text-white">{zone.name}</span>
                  </div>
                  <span className="text-[9px] uppercase tracking-[0.1em] font-bold px-2 py-0.5 rounded-full"
                    style={{ background: `${zone.color}12`, color: zone.color }}>{zone.risk}</span>
                </div>
                <p className="text-2xl font-black font-mono mb-2" style={{ color: zone.color }}>{zone.temp}</p>
                <p className="text-[11px] text-white/30 leading-relaxed">{zone.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Health & Social Impacts */}
      <section className="section-padding pt-0">
        <div className="container-custom">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-8">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-[10px] flex items-center justify-center"
                style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.15)' }}>
                <Heart className="w-4 h-4 text-red-400" />
              </div>
              <span className="text-[10px] text-white/25 uppercase tracking-[0.15em] font-medium">Impact Analysis</span>
            </div>
            <h3 className="font-display font-bold text-2xl text-white tracking-tight">
              Health & Social <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-orange-400">Impacts</span>
            </h3>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {impacts.map((item, i) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                  transition={{ delay: i * 0.06 }}
                  className="flex items-start gap-4 rounded-[16px] p-5"
                  style={{ background: `${item.color}04`, border: `1px solid ${item.color}10` }}
                >
                  <div className="w-9 h-9 rounded-[10px] flex items-center justify-center flex-shrink-0"
                    style={{ background: `${item.color}08`, border: `1px solid ${item.color}15` }}>
                    <Icon className="w-4 h-4" style={{ color: item.color }} />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-white mb-1">{item.title}</h4>
                    <p className="text-[11px] text-white/35 leading-relaxed">{item.desc}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Solutions */}
      <section className="section-padding pt-0">
        <div className="container-custom">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-8">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-[10px] flex items-center justify-center"
                style={{ background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.15)' }}>
                <Shield className="w-4 h-4 text-emerald-400" />
              </div>
              <span className="text-[10px] text-white/25 uppercase tracking-[0.15em] font-medium">Resilience Strategy</span>
            </div>
            <h3 className="font-display font-bold text-2xl text-white tracking-tight">
              Heat Resilience <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">Solutions</span>
            </h3>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {solutions.map((sol, i) => (
              <motion.div
                key={sol.title}
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                className="rounded-[20px] p-7 relative overflow-hidden group cursor-default"
                style={{ background: 'rgba(255,255,255,0.015)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.04)' }}
              >
                <div className="absolute top-0 left-0 right-0 h-px" style={{ background: `linear-gradient(90deg, transparent, ${sol.color}30, transparent)` }} />
                <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full blur-[60px] opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" style={{ background: `${sol.color}10` }} />

                <div className="flex items-start justify-between mb-4">
                  <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ background: `${sol.color}0a`, border: `1px solid ${sol.color}18` }}>
                    <sol.icon className="w-5 h-5" style={{ color: sol.color }} />
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-black font-mono" style={{ color: sol.color }}>{sol.stat}</p>
                    <p className="text-[8px] text-white/20 uppercase tracking-wider">{sol.statLabel}</p>
                  </div>
                </div>
                <h3 className="font-semibold text-white text-sm mb-2">{sol.title}</h3>
                <p className="text-[12px] text-white/40 leading-relaxed">{sol.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
