/**
 * ResilienceScoreCard.jsx — Premium Resilience Gauge with Animated Ring & Glow
 */
import { useEffect, useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Shield } from 'lucide-react';

const gradeConfig = {
  A: { color: '#22c55e', glow: 'rgba(34,197,94,0.1)',  label: 'Highly Resilient' },
  B: { color: '#eab308', glow: 'rgba(234,179,8,0.1)',  label: 'Moderately Resilient' },
  C: { color: '#f97316', glow: 'rgba(249,115,22,0.1)', label: 'Vulnerable' },
  D: { color: '#ef4444', glow: 'rgba(239,68,68,0.1)',  label: 'Critically Vulnerable' },
};

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

export default function ResilienceScoreCard({ score = 0, grade = 'B', summary = '', delay = 0 }) {
  const cfg = gradeConfig[grade] || gradeConfig.B;
  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference * (1 - score / 100);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });
  const animatedScore = useCountUp(score, 1400, isInView);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="relative rounded-[20px] overflow-hidden p-6 flex items-center gap-6 group"
      style={{
        background: 'rgba(255,255,255,0.015)',
        backdropFilter: 'blur(20px) saturate(120%)',
        border: `1px solid rgba(255,255,255,0.04)`,
      }}
    >
      {/* Subtle top accent */}
      <div className="absolute top-0 left-0 right-0 h-px"
        style={{ background: `linear-gradient(90deg, transparent, ${cfg.color}30, transparent)` }} />

      {/* Background glow */}
      <div className="absolute -top-10 -left-10 w-40 h-40 rounded-full blur-[80px] opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
        style={{ background: cfg.glow }} />

      {/* Circular Progress Ring */}
      <div className="relative flex-shrink-0 w-28 h-28">
        <svg viewBox="0 0 104 104" className="w-full h-full -rotate-90">
          <circle cx="52" cy="52" r={radius} fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="6" />
          {isInView && (
            <motion.circle
              cx="52" cy="52" r={radius}
              fill="none"
              stroke={cfg.color}
              strokeWidth="6"
              strokeLinecap="round"
              strokeDasharray={circumference}
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset: dashOffset }}
              transition={{ duration: 1.4, delay: delay + 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
              style={{ filter: `drop-shadow(0 0 8px ${cfg.color}50)` }}
            />
          )}
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-3xl font-black tabular-nums tracking-tight" style={{ color: cfg.color }}>
            {animatedScore}
          </span>
          <span className="text-[9px] text-white/25 uppercase tracking-wider font-medium -mt-0.5">/ 100</span>
        </div>
      </div>

      {/* Text */}
      <div className="flex-1 min-w-0 relative z-10">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center"
            style={{ background: `${cfg.color}10`, border: `1px solid ${cfg.color}18` }}>
            <Shield className="w-3.5 h-3.5" style={{ color: cfg.color }} />
          </div>
          <span className="text-[10px] text-white/35 uppercase tracking-[0.15em] font-medium">Resilience Score</span>
        </div>
        <p className="text-lg font-bold tracking-tight" style={{ color: cfg.color }}>
          Grade {grade} — {cfg.label}
        </p>
        <p className="text-[11px] text-white/40 mt-2 leading-relaxed">{summary}</p>
      </div>
    </motion.div>
  );
}
