import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, X, Bell, Shield, Zap } from 'lucide-react';
import { fetchAlerts } from '../../services/api';

const severityConfig = {
  low: { color: '#3b82f6', bg: 'rgba(59,130,246,0.06)', border: 'rgba(59,130,246,0.15)', icon: Shield },
  medium: { color: '#eab308', bg: 'rgba(234,179,8,0.06)', border: 'rgba(234,179,8,0.15)', icon: Zap },
  high: { color: '#f97316', bg: 'rgba(249,115,22,0.06)', border: 'rgba(249,115,22,0.15)', icon: AlertTriangle },
  critical: { color: '#ef4444', bg: 'rgba(239,68,68,0.06)', border: 'rgba(239,68,68,0.15)', icon: AlertTriangle },
};

const defaultAlerts = [
  { _id: '1', type: 'aqi', severity: 'high', title: 'Severe AQI Alert', message: 'AQI levels in Anand Vihar have crossed 300. Avoid outdoor activities.', active: true },
  { _id: '2', type: 'heatwave', severity: 'critical', title: 'Heatwave Warning', message: 'Temperatures expected to reach 45°C. Stay hydrated and avoid sun exposure.', active: true },
  { _id: '3', type: 'flood', severity: 'medium', title: 'Waterlogging Advisory', message: 'Heavy rainfall expected. Low-lying areas near Yamuna may experience flooding.', active: true },
];

export default function AlertsBanner({ socketAlerts = [] }) {
  const [alerts, setAlerts] = useState(defaultAlerts);
  const [dismissed, setDismissed] = useState(new Set());

  useEffect(() => {
    const loadAlerts = async () => {
      try {
        const data = await fetchAlerts();
        if (Array.isArray(data) && data.length) setAlerts(data);
      } catch (err) { /* Use defaults */ }
    };
    loadAlerts();
  }, []);

  useEffect(() => {
    const sa = Array.isArray(socketAlerts) ? socketAlerts : [];
    if (sa.length > 0) setAlerts(prev => [...sa, ...prev]);
  }, [socketAlerts]);

  const safeAlerts = Array.isArray(alerts) ? alerts : defaultAlerts;
  const visibleAlerts = safeAlerts.filter(a => a.active && !dismissed.has(a._id));
  if (visibleAlerts.length === 0) return null;

  return (
    <section className="section-padding relative overflow-hidden">
      {/* Ambient glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full blur-[200px] opacity-[0.04] pointer-events-none"
        style={{ background: 'radial-gradient(ellipse, #ef4444, transparent 60%)' }} />

      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <div className="inline-flex items-center gap-2 bg-red-500/[0.06] border border-red-500/[0.1] px-5 py-2 rounded-full mb-5 backdrop-blur-sm">
            <Bell className="w-3.5 h-3.5 text-red-400" />
            <span className="text-[11px] text-red-400/70 tracking-widest uppercase font-medium">Live Alerts</span>
            <span className="w-5 h-5 rounded-full bg-red-500 text-white text-[10px] flex items-center justify-center font-bold shadow-[0_0_10px_rgba(239,68,68,0.4)]">
              {visibleAlerts.length}
            </span>
          </div>
          <h2 className="font-display font-bold text-3xl sm:text-4xl text-white mb-2 tracking-tight">
            Climate <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 via-orange-400 to-yellow-400">Alerts</span>
          </h2>
        </motion.div>

        <div className="space-y-3 max-w-3xl mx-auto">
          <AnimatePresence>
            {visibleAlerts.map((alert, i) => {
              const cfg = severityConfig[alert.severity] || severityConfig.medium;
              const Icon = cfg.icon;
              return (
                <motion.div
                  key={alert._id}
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 30, height: 0 }}
                  transition={{ delay: i * 0.1 }}
                  whileHover={{ x: 4, transition: { duration: 0.15 } }}
                  className="rounded-[16px] p-5 flex items-start gap-4 relative overflow-hidden cursor-default group"
                  style={{ background: cfg.bg, border: `1px solid ${cfg.border}` }}
                >
                  {/* Left accent bar */}
                  <div className="absolute left-0 top-3 bottom-3 w-[3px] rounded-full" style={{ background: cfg.color, boxShadow: `0 0 8px ${cfg.color}40` }} />
                  
                  {/* Icon */}
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ml-2"
                    style={{ background: `${cfg.color}10`, border: `1px solid ${cfg.color}20` }}>
                    <Icon className="w-4 h-4" style={{ color: cfg.color }} />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2.5 mb-1.5">
                      <h4 className="font-semibold text-sm text-white">{alert.title}</h4>
                      <span className="text-[9px] uppercase tracking-[0.12em] font-bold px-2 py-0.5 rounded-full"
                        style={{ background: `${cfg.color}15`, color: cfg.color }}>
                        {alert.severity}
                      </span>
                    </div>
                    <p className="text-[12px] text-white/40 leading-relaxed">{alert.message}</p>
                  </div>
                  <button
                    onClick={() => setDismissed(prev => new Set([...prev, alert._id]))}
                    className="opacity-20 hover:opacity-80 transition-opacity flex-shrink-0 mt-1"
                  >
                    <X className="w-4 h-4 text-white" />
                  </button>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
