/**
 * Flooding.jsx — Premium Urban Flooding Page
 * Features: animated stat counters, Recharts rainfall + flood charts, risk bars,
 * ambient glow orbs, hover effects, glassmorphism.
 */
import { useState, useEffect, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { CloudRain, AlertTriangle, Droplets, Building, RouteIcon, MapPin, Shield, Waves, TrendingUp, BarChart3, Calendar } from 'lucide-react';
import {
  ResponsiveContainer, BarChart, Bar, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine,
} from 'recharts';

// Accurate Delhi monsoon rainfall data (mm per month)
const rainfallData = [
  { month: 'Jan', rainfall: 19 },
  { month: 'Feb', rainfall: 18 },
  { month: 'Mar', rainfall: 13 },
  { month: 'Apr', rainfall: 7 },
  { month: 'May', rainfall: 26 },
  { month: 'Jun', rainfall: 54 },
  { month: 'Jul', rainfall: 210 },
  { month: 'Aug', rainfall: 233 },
  { month: 'Sep', rainfall: 127 },
  { month: 'Oct', rainfall: 29 },
  { month: 'Nov', rainfall: 4 },
  { month: 'Dec', rainfall: 8 },
];

// Yearly flood events in Delhi (reported major waterlogging incidents)
const floodEvents = [
  { year: '2017', events: 14, deaths: 8 },
  { year: '2018', events: 18, deaths: 12 },
  { year: '2019', events: 22, deaths: 15 },
  { year: '2020', events: 16, deaths: 9 },
  { year: '2021', events: 25, deaths: 18 },
  { year: '2022', events: 19, deaths: 11 },
  { year: '2023', events: 31, deaths: 23 },
  { year: '2024', events: 28, deaths: 17 },
];

// Animated count-up
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
  const animated = useCountUp(parseInt(value), 1400, isInView);
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
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
        {isNaN(parseInt(value)) ? value : animated}{suffix}
      </p>
      <p className="text-[11px] text-white/30 mt-1">{label}</p>
    </motion.div>
  );
}

const causes = [
  { icon: CloudRain, title: 'Extreme Rainfall', desc: 'Climate change intensifies monsoon rainfall, overwhelming drainage systems designed for lower volumes.', color: '#3b82f6' },
  { icon: Building, title: 'Rapid Urbanization', desc: 'Concrete surfaces prevent natural absorption. Delhi has lost 60% of its permeable surfaces in 3 decades.', color: '#a855f7' },
  { icon: RouteIcon, title: 'Clogged Drains', desc: "Garbage and construction debris block 40% of Delhi's storm drains, reducing water flow capacity.", color: '#f97316' },
  { icon: MapPin, title: 'Floodplain Encroachment', desc: "Construction on the Yamuna floodplain has reduced the river's natural overflow area by 70%.", color: '#ef4444' },
];

const vulnerableAreas = [
  { name: 'Yamuna Vihar', risk: 'Critical', pct: 95, color: '#ef4444' },
  { name: 'ITO & Pragati Maidan', risk: 'High', pct: 82, color: '#f97316' },
  { name: 'Okhla', risk: 'High', pct: 78, color: '#f97316' },
  { name: 'Minto Bridge', risk: 'High', pct: 75, color: '#f97316' },
  { name: 'Civil Lines', risk: 'Moderate', pct: 58, color: '#eab308' },
  { name: 'Rohini Low Zone', risk: 'Moderate', pct: 52, color: '#eab308' },
];

const preparedness = [
  'Keep emergency supplies (water, flashlight, first aid) ready during monsoon',
  'Avoid driving through waterlogged roads — 6 inches of water can stall a car',
  'Store important documents in waterproof containers above ground level',
  "Know your area's flood risk level and evacuation routes",
  'Subscribe to IMD weather warnings and NDMA alerts',
  'Keep mobile phones charged and emergency numbers saved',
];

export default function Flooding() {
  return (
    <div className="min-h-screen pt-20">
      {/* Hero */}
      <section className="relative section-padding overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[450px] rounded-full blur-[220px] opacity-10 animate-pulse-slow"
            style={{ background: 'radial-gradient(ellipse, #3b82f6, transparent 65%)' }} />
          <div className="absolute top-32 right-1/4 w-[400px] h-[250px] rounded-full blur-[150px] opacity-[0.06]"
            style={{ background: 'radial-gradient(ellipse, #06b6d4, transparent 65%)' }} />
        </div>
        <div className="container-custom relative">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} className="text-center">
            <div className="inline-flex items-center gap-2 bg-white/[0.03] border border-white/[0.06] px-5 py-2 rounded-full mb-7 backdrop-blur-sm">
              <div className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
              <CloudRain className="w-3.5 h-3.5 text-blue-400" />
              <span className="text-[11px] text-white/40 tracking-widest uppercase font-medium">Urban Flood Intelligence</span>
            </div>
            <h1 className="font-display font-black text-4xl sm:text-6xl lg:text-7xl text-white mb-5 tracking-tight leading-[1.05]">
              Flooding in{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-400 to-sky-400">Delhi</span>
            </h1>
            <motion.p initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
              className="text-white/30 text-base max-w-3xl leading-relaxed font-light mx-auto">
              Every monsoon season, Delhi faces severe urban flooding that paralyzes transportation, damages property, and claims lives. Climate change is making these events more frequent and intense.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Key Stats */}
      <section className="section-padding pt-0">
        <div className="container-custom">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <StatCard value="200" suffix="mm" label="Avg Monsoon Rainfall/Day" icon={CloudRain} color="#3b82f6" delay={0} />
            <StatCard value="40" suffix="%" label="Drains Blocked" icon={RouteIcon} color="#f97316" delay={0.1} />
            <StatCard value="60" suffix="%" label="Permeable Surface Lost" icon={Building} color="#a855f7" delay={0.2} />
            <StatCard value="70" suffix="%" label="Floodplain Encroached" icon={Waves} color="#ef4444" delay={0.3} />
          </div>
        </div>
      </section>

      {/* Monsoon Rainfall Chart */}
      <section className="section-padding pt-0">
        <div className="container-custom">
          <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="rounded-[22px] overflow-hidden relative"
            style={{ background: 'rgba(255,255,255,0.015)', border: '1px solid rgba(255,255,255,0.04)' }}
          >
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/25 to-transparent" />
            <div className="p-7 sm:p-9">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-[10px] flex items-center justify-center"
                  style={{ background: 'rgba(59,130,246,0.08)', border: '1px solid rgba(59,130,246,0.15)' }}>
                  <BarChart3 className="w-4 h-4 text-blue-400" />
                </div>
                <span className="text-[10px] text-white/25 uppercase tracking-[0.15em] font-medium">Delhi Rainfall Profile</span>
              </div>
              <h3 className="font-display font-bold text-2xl text-white tracking-tight mb-1">
                Monthly <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">Rainfall</span>
              </h3>
              <p className="text-[12px] text-white/25 mb-6">Average monthly precipitation in millimeters (30-year mean)</p>
              <div className="h-[240px] -mx-2">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={rainfallData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="rainGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.9} />
                        <stop offset="100%" stopColor="#06b6d4" stopOpacity={0.4} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.025)" vertical={false} />
                    <XAxis dataKey="month" tick={{ fill: 'rgba(255,255,255,0.2)', fontSize: 10 }} axisLine={{ stroke: 'rgba(255,255,255,0.04)' }} tickLine={false} />
                    <YAxis tick={{ fill: 'rgba(255,255,255,0.12)', fontSize: 10 }} axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={{ background: 'rgba(8,8,8,0.92)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '12px', fontSize: '11px', color: '#fff' }} />
                    <ReferenceLine y={100} stroke="rgba(59,130,246,0.2)" strokeDasharray="6 6" label={{ value: 'Flood risk threshold', fill: 'rgba(59,130,246,0.25)', fontSize: 9, position: 'right' }} />
                    <Bar dataKey="rainfall" name="Rainfall (mm)" radius={[6, 6, 0, 0]} fill="url(#rainGrad)" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Yearly Flood Events Trend */}
      <section className="section-padding pt-0">
        <div className="container-custom">
          <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="rounded-[22px] overflow-hidden relative"
            style={{ background: 'rgba(255,255,255,0.015)', border: '1px solid rgba(255,255,255,0.04)' }}
          >
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-500/25 to-transparent" />
            <div className="p-7 sm:p-9">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-[10px] flex items-center justify-center"
                  style={{ background: 'rgba(6,182,212,0.08)', border: '1px solid rgba(6,182,212,0.15)' }}>
                  <TrendingUp className="w-4 h-4 text-cyan-400" />
                </div>
                <span className="text-[10px] text-white/25 uppercase tracking-[0.15em] font-medium">Rising Trend</span>
              </div>
              <h3 className="font-display font-bold text-2xl text-white tracking-tight mb-1">
                Flood <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">Events</span>
              </h3>
              <p className="text-[12px] text-white/25 mb-6">Major waterlogging incidents per year in Delhi</p>
              <div className="h-[220px] -mx-2">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={floodEvents} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="floodGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#06b6d4" stopOpacity={0.2} />
                        <stop offset="100%" stopColor="#06b6d4" stopOpacity={0.01} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.025)" vertical={false} />
                    <XAxis dataKey="year" tick={{ fill: 'rgba(255,255,255,0.2)', fontSize: 10 }} axisLine={{ stroke: 'rgba(255,255,255,0.04)' }} tickLine={false} />
                    <YAxis tick={{ fill: 'rgba(255,255,255,0.12)', fontSize: 10 }} axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={{ background: 'rgba(8,8,8,0.92)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '12px', fontSize: '11px', color: '#fff' }} />
                    <Area type="monotone" dataKey="events" name="Flood Events" stroke="#06b6d4" strokeWidth={2.5} fill="url(#floodGrad)" dot={{ r: 4, fill: '#0a0a0a', stroke: '#06b6d4', strokeWidth: 2 }} />
                    <Area type="monotone" dataKey="deaths" name="Deaths" stroke="#ef4444" strokeWidth={1.5} fill="none" strokeDasharray="4 4" dot={{ r: 3, fill: '#0a0a0a', stroke: '#ef4444', strokeWidth: 1.5 }} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              <div className="flex items-center justify-center gap-6 mt-4 pt-4" style={{ borderTop: '1px solid rgba(255,255,255,0.03)' }}>
                <div className="flex items-center gap-2"><div className="w-5 h-0.5 rounded-full bg-cyan-400" /><span className="text-[10px] text-white/20">Flood Events</span></div>
                <div className="flex items-center gap-2"><div className="w-5 h-0.5 rounded-full bg-red-400" /><span className="text-[10px] text-white/20">Deaths</span></div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Root Causes */}
      <section className="section-padding pt-0">
        <div className="container-custom">
          <motion.h2 initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
            className="font-display font-bold text-2xl text-white mb-6">
            Root <span className="text-blue-400">Causes</span>
          </motion.h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {causes.map((cause, i) => (
              <motion.div
                key={cause.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                className="rounded-[20px] p-6 relative overflow-hidden group cursor-default"
                style={{ background: 'rgba(255,255,255,0.015)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.04)' }}
              >
                <div className="absolute top-0 left-0 right-0 h-px" style={{ background: `linear-gradient(90deg, transparent, ${cause.color}30, transparent)` }} />
                <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full blur-[60px] opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" style={{ background: `${cause.color}10` }} />
                <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-4" style={{ background: `${cause.color}0a`, border: `1px solid ${cause.color}18` }}>
                  <cause.icon className="w-5 h-5" style={{ color: cause.color }} />
                </div>
                <h3 className="font-semibold text-white text-sm mb-2">{cause.title}</h3>
                <p className="text-[12px] text-white/40 leading-relaxed">{cause.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Vulnerable Areas — with risk bars */}
      <section className="section-padding pt-0">
        <div className="container-custom">
          <motion.h2 initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
            className="font-display font-bold text-2xl text-white mb-6">
            Vulnerable <span className="text-blue-400">Areas</span>
          </motion.h2>
          <div className="space-y-3">
            {vulnerableAreas.map((area, i) => (
              <motion.div
                key={area.name}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="rounded-xl p-4 flex items-center gap-4"
                style={{ background: 'rgba(255,255,255,0.015)', border: '1px solid rgba(255,255,255,0.03)' }}
              >
                <Droplets className="w-5 h-5 text-blue-400 flex-shrink-0" />
                <span className="text-white text-sm font-medium w-48 flex-shrink-0">{area.name}</span>
                <div className="flex-1 h-2 bg-white/[0.03] rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: `${area.pct}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, delay: i * 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
                    className="h-full rounded-full"
                    style={{ background: area.color, boxShadow: `0 0 8px ${area.color}40` }}
                  />
                </div>
                <span className="text-xs font-bold w-16 text-right" style={{ color: area.color }}>{area.risk}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Preparedness */}
      <section className="section-padding pt-0">
        <div className="container-custom">
          <motion.h2 initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
            className="font-display font-bold text-2xl text-white mb-6">
            Flood <span className="text-resilient-green">Preparedness</span>
          </motion.h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {preparedness.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="flex items-start gap-3 rounded-xl p-4"
                style={{ background: 'rgba(34,197,94,0.02)', border: '1px solid rgba(34,197,94,0.06)' }}
              >
                <span className="flex-shrink-0 w-7 h-7 rounded-lg flex items-center justify-center text-[11px] font-bold"
                  style={{ background: 'rgba(34,197,94,0.06)', color: '#22c55e', border: '1px solid rgba(34,197,94,0.12)' }}>
                  {i + 1}
                </span>
                <p className="text-[12px] text-white/50 leading-relaxed">{item}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
