/**
 * Environment.jsx — Premium Environmental Crisis Page
 * Features: Recharts water + groundwater charts, severity gauges, interactive cards,
 * ambient glow, glassmorphism, visual data representation.
 */
import { useState, useEffect, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  TreePine, Droplets, Leaf, Sprout, AlertTriangle, TrendingDown,
  BarChart3, ArrowRight, Waves, TrendingUp,
} from 'lucide-react';
import {
  ResponsiveContainer, AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine,
} from 'recharts';

// Groundwater level decline in Delhi (meters below surface)
const groundwaterData = [
  { year: '2000', level: 6 },
  { year: '2004', level: 8 },
  { year: '2008', level: 11 },
  { year: '2012', level: 14 },
  { year: '2016', level: 17 },
  { year: '2020', level: 21 },
  { year: '2024', level: 24 },
];

// Delhi water supply vs demand (MLD — million liters per day)
const waterSupplyData = [
  { area: 'South', supply: 320, demand: 450 },
  { area: 'North', supply: 380, demand: 420 },
  { area: 'East', supply: 290, demand: 380 },
  { area: 'West', supply: 350, demand: 410 },
  { area: 'Central', supply: 280, demand: 310 },
  { area: 'NE', supply: 190, demand: 340 },
];

// Delhi green cover percentage over time
const greenCoverData = [
  { year: '1999', pct: 26 },
  { year: '2003', pct: 24 },
  { year: '2007', pct: 22 },
  { year: '2011', pct: 21 },
  { year: '2015', pct: 20.6 },
  { year: '2019', pct: 20.2 },
  { year: '2023', pct: 19.8 },
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

// Severity gauge
function SeverityBar({ label, pct, color, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ delay }}
      className="flex items-center gap-3"
    >
      <span className="text-[10px] text-white/30 w-20 text-right font-medium uppercase tracking-wider">{label}</span>
      <div className="flex-1 h-2.5 bg-white/[0.03] rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          whileInView={{ width: `${pct}%` }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: delay + 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="h-full rounded-full"
          style={{ background: `linear-gradient(90deg, ${color}80, ${color})`, boxShadow: `0 0 10px ${color}30` }}
        />
      </div>
      <span className="text-[11px] font-mono font-bold w-10" style={{ color }}>{pct}%</span>
    </motion.div>
  );
}

const issues = [
  {
    icon: Droplets, title: 'Water Scarcity', color: '#06b6d4', severity: 78,
    facts: [
      'Delhi receives 3,600 MLD water but needs 4,200 MLD — a 15% deficit',
      'Groundwater levels dropping by 1-2 meters annually in South Delhi',
      "60% of Delhi's water supply is wasted through leaks and theft",
      'Many colonies receive water for only 2-3 hours daily',
    ],
    stats: [
      { label: 'Deficit', pct: 15, color: '#06b6d4' },
      { label: 'Waste', pct: 60, color: '#06b6d4' },
    ],
  },
  {
    icon: TreePine, title: 'Loss of Green Cover', color: '#22c55e', severity: 65,
    facts: [
      'Over 17,000 trees felled in Delhi from 2018-2022 for development',
      "Delhi's tree cover is 20% vs the recommended minimum of 33%",
      "The Aravalli Ridge — Delhi's green lung — faces constant encroachment",
      'Each mature tree absorbs ~22 kg of CO₂ per year',
    ],
    stats: [
      { label: 'Current', pct: 20, color: '#22c55e' },
      { label: 'Target', pct: 33, color: '#4ade80' },
    ],
  },
  {
    icon: TrendingDown, title: 'Groundwater Depletion', color: '#3b82f6', severity: 88,
    facts: [
      'Delhi extracts 4x more groundwater than is recharged naturally',
      'Water table has dropped from 3m to 20m+ in South Delhi',
      'Tubewells going dry during summer months in several areas',
      "Only 10% of Delhi's area has adequate rainwater harvesting",
    ],
    stats: [
      { label: 'Over-extract', pct: 75, color: '#3b82f6' },
      { label: 'Harvest', pct: 10, color: '#60a5fa' },
    ],
  },
  {
    icon: Waves, title: 'Yamuna River Pollution', color: '#10b981', severity: 92,
    facts: [
      "The 22-km stretch through Delhi contributes 76% of the Yamuna's total pollution",
      '3,800 MLD of sewage flows into the river, most untreated',
      'Dissolved oxygen levels drop to near zero through Delhi',
      'Despite ₹8,000 crore spent on cleanup, no significant improvement',
    ],
    stats: [
      { label: 'Pollution', pct: 76, color: '#10b981' },
      { label: 'Untreated', pct: 85, color: '#34d399' },
    ],
  },
];

export default function Environment() {
  return (
    <div className="min-h-screen pt-20">
      {/* Hero */}
      <section className="relative section-padding overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[450px] rounded-full blur-[220px] opacity-10 animate-pulse-slow"
            style={{ background: 'radial-gradient(ellipse, #22c55e, transparent 65%)' }} />
          <div className="absolute top-32 left-1/4 w-[400px] h-[250px] rounded-full blur-[150px] opacity-[0.06]"
            style={{ background: 'radial-gradient(ellipse, #06b6d4, transparent 65%)' }} />
        </div>
        <div className="container-custom relative">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} className="text-center">
            <div className="inline-flex items-center gap-2 bg-white/[0.03] border border-white/[0.06] px-5 py-2 rounded-full mb-7 backdrop-blur-sm">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <TreePine className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-[11px] text-white/40 tracking-widest uppercase font-medium">Environmental Monitoring</span>
            </div>
            <h1 className="font-display font-black text-4xl sm:text-6xl lg:text-7xl text-white mb-5 tracking-tight leading-[1.05]">
              Environment{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-green-400 to-teal-400">Crisis</span>
            </h1>
            <motion.p initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
              className="text-white/30 text-base max-w-3xl leading-relaxed font-light mx-auto">
              Beyond air pollution, Delhi faces interconnected environmental challenges — from water scarcity and groundwater depletion to loss of green cover and river pollution.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Crisis Overview Gauge */}
      <section className="section-padding pt-0">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="rounded-[20px] p-7 relative overflow-hidden"
            style={{ background: 'rgba(255,255,255,0.015)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.04)' }}
          >
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-emerald-500/20 to-transparent" />
            <div className="flex items-center gap-2 mb-6">
              <BarChart3 className="w-4 h-4 text-emerald-400" />
              <span className="text-[10px] text-white/35 uppercase tracking-[0.15em] font-medium">Crisis Severity Index</span>
            </div>
            <div className="space-y-4">
              {issues.map((issue, i) => (
                <SeverityBar key={issue.title} label={issue.title.split(' ')[0]} pct={issue.severity} color={issue.color} delay={i * 0.1} />
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Groundwater Depletion Chart */}
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
                  <TrendingDown className="w-4 h-4 text-blue-400" />
                </div>
                <span className="text-[10px] text-white/25 uppercase tracking-[0.15em] font-medium">Critical Decline</span>
              </div>
              <h3 className="font-display font-bold text-2xl text-white tracking-tight mb-1">
                Groundwater <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">Depletion</span>
              </h3>
              <p className="text-[12px] text-white/25 mb-6">Water table depth below surface (meters) — Delhi average</p>
              <div className="h-[240px] -mx-2">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={groundwaterData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="gwGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.2} />
                        <stop offset="100%" stopColor="#3b82f6" stopOpacity={0.01} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.025)" vertical={false} />
                    <XAxis dataKey="year" tick={{ fill: 'rgba(255,255,255,0.2)', fontSize: 10 }} axisLine={{ stroke: 'rgba(255,255,255,0.04)' }} tickLine={false} />
                    <YAxis reversed tick={{ fill: 'rgba(255,255,255,0.12)', fontSize: 10 }} axisLine={false} tickLine={false} label={{ value: 'Depth (m)', angle: -90, position: 'insideLeft', fill: 'rgba(255,255,255,0.1)', fontSize: 9 }} />
                    <Tooltip contentStyle={{ background: 'rgba(8,8,8,0.92)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '12px', fontSize: '11px', color: '#fff' }} />
                    <ReferenceLine y={10} stroke="rgba(234,179,8,0.2)" strokeDasharray="6 6" label={{ value: 'Safe level', fill: 'rgba(234,179,8,0.25)', fontSize: 9, position: 'right' }} />
                    <Area type="monotone" dataKey="level" name="Depth (meters)" stroke="#3b82f6" strokeWidth={2.5} fill="url(#gwGrad)" dot={{ r: 4, fill: '#0a0a0a', stroke: '#3b82f6', strokeWidth: 2 }} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Water Supply vs Demand */}
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
                  <BarChart3 className="w-4 h-4 text-cyan-400" />
                </div>
                <span className="text-[10px] text-white/25 uppercase tracking-[0.15em] font-medium">Supply Gap</span>
              </div>
              <h3 className="font-display font-bold text-2xl text-white tracking-tight mb-1">
                Water Supply vs <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">Demand</span>
              </h3>
              <p className="text-[12px] text-white/25 mb-6">Zone-wise comparison in MLD (million liters per day)</p>
              <div className="h-[220px] -mx-2">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={waterSupplyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.025)" vertical={false} />
                    <XAxis dataKey="area" tick={{ fill: 'rgba(255,255,255,0.2)', fontSize: 10 }} axisLine={{ stroke: 'rgba(255,255,255,0.04)' }} tickLine={false} />
                    <YAxis tick={{ fill: 'rgba(255,255,255,0.12)', fontSize: 10 }} axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={{ background: 'rgba(8,8,8,0.92)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '12px', fontSize: '11px', color: '#fff' }} />
                    <Bar dataKey="supply" name="Supply (MLD)" radius={[4, 4, 0, 0]} fill="#22c55e" fillOpacity={0.7} />
                    <Bar dataKey="demand" name="Demand (MLD)" radius={[4, 4, 0, 0]} fill="#ef4444" fillOpacity={0.5} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="flex items-center justify-center gap-6 mt-4 pt-4" style={{ borderTop: '1px solid rgba(255,255,255,0.03)' }}>
                <div className="flex items-center gap-2"><div className="w-5 h-0.5 rounded-full bg-emerald-400" /><span className="text-[10px] text-white/20">Supply</span></div>
                <div className="flex items-center gap-2"><div className="w-5 h-0.5 rounded-full bg-red-400" /><span className="text-[10px] text-white/20">Demand</span></div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Green Cover Decline */}
      <section className="section-padding pt-0">
        <div className="container-custom">
          <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="rounded-[22px] overflow-hidden relative"
            style={{ background: 'rgba(255,255,255,0.015)', border: '1px solid rgba(255,255,255,0.04)' }}
          >
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-emerald-500/25 to-transparent" />
            <div className="p-7 sm:p-9">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-[10px] flex items-center justify-center"
                  style={{ background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.15)' }}>
                  <TreePine className="w-4 h-4 text-emerald-400" />
                </div>
                <span className="text-[10px] text-white/25 uppercase tracking-[0.15em] font-medium">Declining Coverage</span>
              </div>
              <h3 className="font-display font-bold text-2xl text-white tracking-tight mb-1">
                Green Cover <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-green-400">Trend</span>
              </h3>
              <p className="text-[12px] text-white/25 mb-6">Delhi's tree cover percentage (target: 33%)</p>
              <div className="h-[200px] -mx-2">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={greenCoverData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="greenGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#22c55e" stopOpacity={0.2} />
                        <stop offset="100%" stopColor="#22c55e" stopOpacity={0.01} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.025)" vertical={false} />
                    <XAxis dataKey="year" tick={{ fill: 'rgba(255,255,255,0.2)', fontSize: 10 }} axisLine={{ stroke: 'rgba(255,255,255,0.04)' }} tickLine={false} />
                    <YAxis tick={{ fill: 'rgba(255,255,255,0.12)', fontSize: 10 }} axisLine={false} tickLine={false} domain={[15, 35]} />
                    <Tooltip contentStyle={{ background: 'rgba(8,8,8,0.92)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '12px', fontSize: '11px', color: '#fff' }} />
                    <ReferenceLine y={33} stroke="rgba(34,197,94,0.3)" strokeDasharray="6 6" label={{ value: 'Target: 33%', fill: 'rgba(34,197,94,0.35)', fontSize: 9, position: 'right' }} />
                    <Area type="monotone" dataKey="pct" name="Green Cover (%)" stroke="#22c55e" strokeWidth={2.5} fill="url(#greenGrad)" dot={{ r: 4, fill: '#0a0a0a', stroke: '#22c55e', strokeWidth: 2 }} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Issues — deep dive cards */}
      <section className="section-padding pt-0">
        <div className="container-custom space-y-6">
          {issues.map((issue, i) => (
            <motion.div
              key={issue.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.6 }}
              className="rounded-[20px] p-7 relative overflow-hidden group"
              style={{ background: 'rgba(255,255,255,0.015)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.04)' }}
            >
              <div className="absolute top-0 left-0 right-0 h-px" style={{ background: `linear-gradient(90deg, transparent, ${issue.color}30, transparent)` }} />
              <div className="absolute -top-16 -right-16 w-48 h-48 rounded-full blur-[80px] opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" style={{ background: `${issue.color}08` }} />

              <div className="flex items-center gap-3 mb-6">
                <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ background: `${issue.color}0a`, border: `1px solid ${issue.color}18` }}>
                  <issue.icon className="w-5 h-5" style={{ color: issue.color }} />
                </div>
                <h2 className="font-display font-bold text-xl text-white">{issue.title}</h2>
                <span className="ml-auto text-[10px] font-mono font-bold px-3 py-1 rounded-full"
                  style={{ background: `${issue.color}10`, color: issue.color, border: `1px solid ${issue.color}20` }}>
                  {issue.severity}% Severity
                </span>
              </div>

              {/* Data bars */}
              <div className="mb-5 space-y-3">
                {issue.stats.map(s => (
                  <SeverityBar key={s.label} label={s.label} pct={s.pct} color={s.color} delay={0.1} />
                ))}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {issue.facts.map((fact, j) => (
                  <motion.div
                    key={j}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: j * 0.08 }}
                    className="flex items-start gap-3 rounded-xl p-3.5"
                    style={{ background: 'rgba(0,0,0,0.15)', border: '1px solid rgba(255,255,255,0.02)' }}
                  >
                    <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" style={{ color: issue.color }} />
                    <p className="text-[11px] text-white/50 leading-relaxed">{fact}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Call to Action */}
      <section className="section-padding pt-0">
        <div className="container-custom text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="rounded-[20px] p-8 sm:p-12 relative overflow-hidden"
            style={{ background: 'rgba(34,197,94,0.03)', backdropFilter: 'blur(20px)', border: '1px solid rgba(34,197,94,0.08)' }}
          >
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-emerald-500/30 to-transparent" />
            <Sprout className="w-10 h-10 text-resilient-green mx-auto mb-4" />
            <h2 className="font-display font-bold text-2xl sm:text-3xl text-white mb-4">
              Be Part of the Solution
            </h2>
            <p className="text-white/40 max-w-xl mx-auto mb-6 text-sm leading-relaxed">
              Every action counts. From planting trees to conserving water, your choices shape Delhi's environmental future.
            </p>
            <Link
              to="/climate-risk"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl text-black font-semibold text-sm transition-all active:scale-95 group"
              style={{ background: 'linear-gradient(135deg, #22c55e, #16a34a)', boxShadow: '0 0 15px rgba(34,197,94,0.25)' }}
            >
              View Climate Risk Analysis
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
