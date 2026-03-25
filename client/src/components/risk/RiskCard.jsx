/**
 * RiskCard.jsx — Premium Glassmorphism Risk Card with Circular Progress Ring
 * Features: animated ring, count-up animation, risk-based glow, hover lift
 */
import { useEffect, useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';

// Risk level → premium color system
const riskConfig = {
  Low: {
    ring: '#22c55e', glow: 'rgba(34,197,94,0.12)', border: 'rgba(34,197,94,0.12)',
    badge: 'bg-green-500/10 text-green-400 border-green-500/20',
    text: 'text-green-400', shadow: '0 0 40px rgba(34,197,94,0.08)',
  },
  Medium: {
    ring: '#eab308', glow: 'rgba(234,179,8,0.12)', border: 'rgba(234,179,8,0.12)',
    badge: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
    text: 'text-yellow-400', shadow: '0 0 40px rgba(234,179,8,0.08)',
  },
  High: {
    ring: '#ef4444', glow: 'rgba(239,68,68,0.15)', border: 'rgba(239,68,68,0.15)',
    badge: 'bg-red-500/10 text-red-400 border-red-500/20',
    text: 'text-red-400', shadow: '0 0 40px rgba(239,68,68,0.1)',
  },
};

// Animated count-up hook
function useCountUp(target, duration = 1200, trigger = true) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!trigger) return;
    let start = 0;
    const startTime = performance.now();
    function step(now) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      setCount(Math.round(eased * target));
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }, [target, duration, trigger]);
  return count;
}

export default function RiskCard({ type, icon: Icon, risk, percentage, details, delay = 0, extra = {} }) {
  const cfg = riskConfig[risk] || riskConfig.Low;
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });
  const animatedPercent = useCountUp(percentage, 1400, isInView);

  // Ring calculations
  const radius = 36;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference * (1 - percentage / 100);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-30px' }}
      transition={{ duration: 0.6, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
      whileHover={{ y: -6, transition: { duration: 0.3, ease: 'easeOut' } }}
      className="relative group cursor-default"
    >
      {/* Card body */}
      <div
        className="relative rounded-[20px] p-6 overflow-hidden transition-all duration-500"
        style={{
          background: 'rgba(255,255,255,0.015)',
          backdropFilter: 'blur(20px) saturate(120%)',
          border: `1px solid ${cfg.border}`,
          boxShadow: `0 0 0 0 transparent`,
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.boxShadow = cfg.shadow;
          e.currentTarget.style.borderColor = cfg.ring + '30';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.boxShadow = '0 0 0 0 transparent';
          e.currentTarget.style.borderColor = cfg.border;
        }}
      >
        {/* Top accent gradient line */}
        <div className="absolute top-0 left-0 right-0 h-px"
          style={{ background: `linear-gradient(90deg, transparent, ${cfg.ring}40, transparent)` }} />

        {/* Background glow orb */}
        <div className="absolute -top-16 -right-16 w-48 h-48 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none blur-[60px]"
          style={{ background: cfg.glow }} />

        {/* Header: icon + badge */}
        <div className="flex items-start justify-between mb-5 relative z-10">
          <div>
            <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-3 transition-all duration-300"
              style={{
                background: `${cfg.ring}08`,
                border: `1px solid ${cfg.ring}18`,
              }}>
              <Icon className="w-5 h-5" style={{ color: cfg.ring }} />
            </div>
            <h3 className="font-semibold text-white/90 text-sm tracking-tight">{type}</h3>
          </div>
          <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border ${cfg.badge}`}>
            {risk}
          </span>
        </div>

        {/* Circular progress ring + count-up */}
        <div className="flex items-center gap-5 mb-5 relative z-10">
          <div className="relative flex-shrink-0 w-20 h-20">
            <svg viewBox="0 0 96 96" className="w-full h-full -rotate-90">
              {/* Track */}
              <circle cx="48" cy="48" r={radius} fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="5" />
              {/* Progress arc */}
              {isInView && (
                <motion.circle
                  cx="48" cy="48" r={radius}
                  fill="none"
                  stroke={cfg.ring}
                  strokeWidth="5"
                  strokeLinecap="round"
                  strokeDasharray={circumference}
                  initial={{ strokeDashoffset: circumference }}
                  animate={{ strokeDashoffset: dashOffset }}
                  transition={{ duration: 1.4, delay: delay + 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
                  style={{ filter: `drop-shadow(0 0 6px ${cfg.ring}60)` }}
                />
              )}
            </svg>
            {/* Centre number */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className={`text-2xl font-black tabular-nums tracking-tight ${cfg.text}`}>
                {animatedPercent}
              </span>
              <span className="text-[9px] text-white/25 font-medium -mt-0.5">%</span>
            </div>
          </div>

          {/* Description */}
          <p className="text-[11px] text-white/40 leading-relaxed flex-1">{details}</p>
        </div>

        {/* Extra data chips */}
        {Object.keys(extra).length > 0 && (
          <div className="flex gap-2 flex-wrap relative z-10">
            {Object.entries(extra).map(([k, v]) => (
              <div key={k}
                className="flex items-center gap-1.5 bg-white/[0.02] border border-white/[0.04] rounded-lg px-2.5 py-1.5">
                <span className="text-[9px] text-white/25 uppercase tracking-wider font-medium">{k}</span>
                <span className="text-[10px] text-white/55 font-mono font-medium">{v}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}
