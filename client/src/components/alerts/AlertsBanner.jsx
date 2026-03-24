import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, X, Bell } from 'lucide-react';
import { fetchAlerts } from '../../services/api';

const severityColors = {
  low: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  medium: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  high: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
  critical: 'bg-red-500/20 text-red-400 border-red-500/30',
};

const defaultAlerts = [
  { _id: '1', type: 'aqi', severity: 'high', title: 'Severe AQI Alert', message: 'AQI levels in Anand Vihar have crossed 300. Avoid outdoor activities.', active: true },
  { _id: '2', type: 'heatwave', severity: 'critical', title: 'Heatwave Warning', message: 'Temperatures expected to reach 45°C. Stay hydrated and avoid sun exposure.', active: true },
  { _id: '3', type: 'flood', severity: 'medium', title: 'Waterlogging Advisory', message: 'Heavy rainfall expected. Low-lying areas near Yamuna may experience flooding.', active: true },
];

export default function AlertsBanner({ socketAlerts = [] }) {
  const [alerts, setAlerts] = useState(defaultAlerts);
  const [dismissed, setDismissed] = useState(new Set());
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    const loadAlerts = async () => {
      try {
        const data = await fetchAlerts();
        if (data?.length) setAlerts(data);
      } catch (err) {
        // Use default alerts
      }
    };
    loadAlerts();
  }, []);

  // Merge socket alerts
  useEffect(() => {
    if (socketAlerts.length > 0) {
      setAlerts(prev => [...socketAlerts, ...prev]);
    }
  }, [socketAlerts]);

  const visibleAlerts = alerts.filter(a => a.active && !dismissed.has(a._id));
  if (visibleAlerts.length === 0) return null;

  return (
    <section className="section-padding relative">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center gap-2 glass px-4 py-2 rounded-full mb-4">
            <Bell className="w-4 h-4 text-resilient-green" />
            <span className="text-xs text-white/60">Active Alerts</span>
            <span className="w-5 h-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center font-bold">
              {visibleAlerts.length}
            </span>
          </div>
          <h2 className="font-display font-bold text-3xl sm:text-4xl text-white mb-2">
            Climate <span className="text-gradient-green">Alerts</span>
          </h2>
        </motion.div>

        <div className="space-y-3 max-w-3xl mx-auto">
          <AnimatePresence>
            {visibleAlerts.slice(0, expanded ? undefined : 3).map((alert, i) => (
              <motion.div
                key={alert._id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20, height: 0 }}
                transition={{ delay: i * 0.1 }}
                className={`rounded-xl border p-4 flex items-start gap-4 ${severityColors[alert.severity]}`}
              >
                <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-semibold text-sm">{alert.title}</h4>
                    <span className="text-[10px] uppercase tracking-wider opacity-60 font-mono">{alert.severity}</span>
                  </div>
                  <p className="text-xs opacity-70 leading-relaxed">{alert.message}</p>
                </div>
                <button
                  onClick={() => setDismissed(prev => new Set([...prev, alert._id]))}
                  className="opacity-40 hover:opacity-100 transition-opacity"
                >
                  <X className="w-4 h-4" />
                </button>
              </motion.div>
            ))}
          </AnimatePresence>

          {visibleAlerts.length > 3 && (
            <button
              onClick={() => setExpanded(!expanded)}
              className="text-sm text-white/40 hover:text-resilient-green transition-colors mx-auto block"
            >
              {expanded ? 'Show less' : `Show ${visibleAlerts.length - 3} more alerts`}
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
