/**
 * ClimateRisk.jsx — Full-page AI Climate Risk & Prediction Dashboard
 * Features: city search, 3 risk cards, resilience score, recommendations,
 *           historical risk simulation, alert log, and methodology breakdown.
 */
import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
  CloudRain, Flame, Wind, BrainCircuit, RefreshCw,
  Shield, AlertTriangle, FileText, Clock, Info,
} from 'lucide-react';
import { fetchClimateRisk, fetchClimateAlerts } from '../services/climateRiskApi';
import RiskCard from '../components/risk/RiskCard';
import AlertPopup from '../components/risk/AlertPopup';
import ResilienceScoreCard from '../components/risk/ResilienceScoreCard';
import CitySearch from '../components/risk/CitySearch';


const DEFAULT_CITY = 'Delhi';

// Risk level → severity label
const riskLabel = { High: '🔴 High', Medium: '🟡 Medium', Low: '🟢 Low' };

// Simulated 7-day historical risk bands for visual context
const HISTORY_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
function generateHistory(currentPct) {
  return HISTORY_LABELS.map((day, i) => {
    const variation = (Math.random() - 0.5) * 30;
    return { day, value: Math.max(5, Math.min(95, currentPct + variation)) };
  });
}

function HistoryBar({ day, value, color }) {
  return (
    <div className="flex flex-col items-center gap-1">
      <div className="relative h-16 w-full flex items-end">
        <motion.div
          initial={{ height: 0 }}
          whileInView={{ height: `${value}%` }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="w-full rounded-t-md"
          style={{ background: `${color}60` }}
        />
      </div>
      <span className="text-[10px] text-white/30">{day}</span>
    </div>
  );
}

function Skeleton() {
  return (
    <div className="animate-pulse space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        {[0,1,2].map(i => (
          <div key={i} className="rounded-2xl bg-white/[0.02] border border-white/[0.05] p-6 h-48" />
        ))}
      </div>
    </div>
  );
}

export default function ClimateRiskPage() {
  const [city, setCity] = useState(DEFAULT_CITY);
  const [data, setData] = useState(null);
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [popupDismissed, setPopupDismissed] = useState(false);

  const loadData = useCallback(async (targetCity) => {
    setLoading(true);
    setError(null);
    setPopupDismissed(false);
    try {
      const risk = await fetchClimateRisk(targetCity);
      setData(risk);
      if (risk?.highRisks?.length > 0) setShowPopup(true);
    } catch (e) {
      setError('Failed to load climate risk data. Please try again.');
    }
    try {
      const storedAlerts = await fetchClimateAlerts(10);
      if (Array.isArray(storedAlerts)) setAlerts(storedAlerts);
    } catch (e) {
      // Alerts not available — keep empty array
    }
    setLoading(false);
  }, []);

  useEffect(() => { loadData(DEFAULT_CITY); }, [loadData]);

  const handleSearch = (c) => { setCity(c); loadData(c); };

  return (
    <main className="min-h-screen pt-20">
      {/* Hero */}
      <section className="section-padding pb-8 relative overflow-hidden">
        {/* Animated gradient background */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1100px] h-[500px] rounded-full blur-[200px] opacity-15 animate-pulse-slow"
            style={{ background: 'radial-gradient(ellipse, #22c55e 0%, transparent 65%)' }} />
          <div className="absolute top-20 right-1/4 w-[500px] h-[300px] rounded-full blur-[180px] opacity-10 animate-pulse-slow animation-delay-400"
            style={{ background: 'radial-gradient(ellipse, #06b6d4 0%, transparent 65%)' }} />
          <div className="absolute bottom-0 left-1/4 w-[600px] h-[200px] rounded-full blur-[160px] opacity-[0.06]"
            style={{ background: 'radial-gradient(ellipse, #22c55e 0%, transparent 70%)' }} />
        </div>
        <div className="container-custom relative text-center">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}>
            {/* Pill badge */}
            <div className="inline-flex items-center gap-2 bg-white/[0.03] border border-white/[0.06] px-5 py-2 rounded-full mb-7 backdrop-blur-sm">
              <div className="w-1.5 h-1.5 rounded-full bg-resilient-green animate-pulse" />
              <BrainCircuit className="w-3.5 h-3.5 text-resilient-green" />
              <span className="text-[11px] text-white/45 tracking-widest uppercase font-medium">AI Climate Intelligence Platform</span>
            </div>
            {/* Title with green-cyan gradient */}
            <h1 className="font-display font-black text-4xl sm:text-6xl lg:text-7xl text-white mb-5 tracking-tight leading-[1.05]">
              Climate Risk{' '}
              <span className="text-gradient-green-cyan">Prediction</span>
            </h1>
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.6 }}
              className="text-white/35 max-w-2xl mx-auto text-base leading-relaxed mb-10 font-light"
            >
              Real-time AI-powered flood, heatwave, and air pollution risk assessment with city resilience scoring — built for smart urban climate management.
            </motion.p>
            <CitySearch value={city} onSearch={handleSearch} loading={loading} />
          </motion.div>
        </div>
      </section>

      {/* Error */}
      {error && (
        <div className="container-custom px-4 mb-6">
          <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-300 text-sm text-center flex items-center gap-2 justify-center">
            <AlertTriangle className="w-4 h-4" />{error}
          </div>
        </div>
      )}

      {/* Weather Context Bar */}
      {data && !loading && (
        <section className="container-custom px-4 mb-10">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="flex flex-wrap gap-2 justify-center"
          >
            {[
              { label: 'City',        value: data.city || '--' },
              { label: 'Temperature', value: `${data.weather?.temperature ?? '--'}°C` },
              { label: 'Humidity',    value: `${data.weather?.humidity ?? '--'}%` },
              { label: 'Rainfall',    value: `${data.weather?.rainfall ?? '--'}mm` },
              { label: 'AQI',         value: data.weather?.aqi ?? '--' },
            ].map(({ label, value }) => (
              <div key={label} className="flex items-center gap-2 bg-white/[0.02] border border-white/[0.04] rounded-full px-4 py-1.5 backdrop-blur-sm">
                <span className="text-[10px] text-white/25 uppercase tracking-[0.12em] font-medium">{label}</span>
                <span className="text-[13px] font-semibold text-white font-mono">{value}</span>
              </div>
            ))}
            <button
              onClick={() => loadData(city)}
              className="flex items-center gap-1.5 bg-white/[0.02] border border-white/[0.04] rounded-full px-4 py-1.5 text-white/30 hover:text-resilient-green hover:border-resilient-green/20 transition-all duration-300 text-xs"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Refresh
            </button>
          </motion.div>
        </section>
      )}

      {/* Risk Cards */}
      <section className="container-custom px-4 mb-8">
        {loading ? (
          <Skeleton />
        ) : data?.risk ? (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <RiskCard type="Flood Risk"    icon={CloudRain} risk={data.risk.flood?.risk ?? 'Low'}     percentage={data.risk.flood?.percentage ?? 0}     details={data.risk.flood?.details ?? 'No data'}     delay={0}   extra={{ Rainfall: `${data.weather?.rainfall ?? '--'}mm`, Drainage: '0.5' }} />
            <RiskCard type="Heatwave Risk" icon={Flame}     risk={data.risk.heatwave?.risk ?? 'Low'}  percentage={data.risk.heatwave?.percentage ?? 0}  details={data.risk.heatwave?.details ?? 'No data'}  delay={0.1} extra={{ 'Heat Index': `${data.risk.heatwave?.heatIndex ?? '--'}°C` }} />
            <RiskCard type="Air Pollution" icon={Wind}      risk={data.risk.pollution?.risk ?? 'Low'} percentage={data.risk.pollution?.percentage ?? 0} details={data.risk.pollution?.details ?? 'No data'} delay={0.2} extra={{ AQI: data.weather?.aqi ?? '--', Category: data.risk.pollution?.category ?? '--' }} />
          </div>
        ) : null}
      </section>

      {/* Resilience + Recommendations */}
      {data?.resilience && !loading && (
        <section className="container-custom px-4 mb-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <ResilienceScoreCard score={data.resilience?.score ?? 0} grade={data.resilience?.grade ?? '--'} summary={data.resilience?.summary ?? 'No data'} delay={0.1} />
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="rounded-[20px] p-6 relative overflow-hidden"
              style={{
                background: 'rgba(255,255,255,0.015)',
                backdropFilter: 'blur(20px) saturate(120%)',
                border: '1px solid rgba(255,255,255,0.04)',
              }}
            >
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />
              <div className="flex items-center gap-2 mb-4">
                <div className="w-7 h-7 rounded-lg bg-resilient-green/[0.06] border border-resilient-green/10 flex items-center justify-center">
                  <BrainCircuit className="w-3.5 h-3.5 text-resilient-green" />
                </div>
                <span className="text-[10px] text-white/35 uppercase tracking-[0.15em] font-medium">AI Recommendations</span>
              </div>
              <ul className="space-y-2 max-h-60 overflow-y-auto pr-1">
                {(Array.isArray(data.recommendations) ? data.recommendations : []).map((rec, i) => (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, x: -8 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1, duration: 0.3 }}
                    className="text-[11px] text-white/55 bg-white/[0.015] border border-white/[0.03] rounded-xl px-4 py-2.5 leading-relaxed"
                  >
                    {rec}
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          </div>
        </section>
      )}



      {/* 7-Day Historical Risk Simulation */}
      {data?.risk && !loading && (
        <section className="container-custom px-4 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="rounded-2xl bg-white/[0.02] border border-white/[0.07] p-6"
          >
            <div className="flex items-center gap-2 mb-6">
              <Clock className="w-4 h-4 text-white/30" />
              <p className="text-xs text-white/40 uppercase tracking-widest">7-Day Risk Simulation</p>
              <span className="ml-auto text-[10px] text-white/20 bg-white/[0.04] px-2 py-0.5 rounded-full">Simulated</span>
            </div>
            <div className="grid grid-cols-3 gap-6">
              {[
                { label: 'Flood',     color: '#3b82f6', pct: data.risk.flood?.percentage ?? 0 },
                { label: 'Heatwave', color: '#ef4444', pct: data.risk.heatwave?.percentage ?? 0 },
                { label: 'Pollution',color: '#a855f7', pct: data.risk.pollution?.percentage ?? 0 },
              ].map(({ label, color, pct }) => (
                <div key={label}>
                  <p className="text-xs font-medium mb-3" style={{ color }}>{label}</p>
                  <div className="grid grid-cols-7 gap-1 h-20 items-end">
                    {generateHistory(pct).map(({ day, value }) => (
                      <HistoryBar key={day} day={day} value={value} color={color} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </section>
      )}

      {/* Stored Alert Log */}
      {alerts.length > 0 && (
        <section className="container-custom px-4 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="rounded-2xl bg-white/[0.02] border border-white/[0.07] p-6"
          >
            <div className="flex items-center gap-2 mb-5">
              <FileText className="w-4 h-4 text-white/30" />
              <p className="text-xs text-white/40 uppercase tracking-widest">Recent Alert Log</p>
            </div>
            <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
              {alerts.map((a) => (
                <div key={a.id}
                  className="flex items-start gap-3 bg-white/[0.02] border border-white/[0.05] rounded-xl px-4 py-3">
                  <AlertTriangle className="w-3.5 h-3.5 text-red-400/70 flex-shrink-0 mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-white/80 truncate">{a.message}</p>
                    <p className="text-[10px] text-white/30 mt-0.5">{a.city} • {new Date(a.timestamp).toLocaleString()}</p>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-red-500/10 text-red-300 flex-shrink-0">{a.severity}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </section>
      )}

      {/* Methodology Info Box */}
      <section className="container-custom px-4 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="rounded-2xl bg-white/[0.01] border border-white/[0.05] p-6"
        >
          <div className="flex items-center gap-2 mb-4">
            <Info className="w-4 h-4 text-white/25" />
            <p className="text-xs text-white/30 uppercase tracking-widest">How Predictions Work</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-xs text-white/40 leading-relaxed">
            <div>
              <p className="text-white/60 font-semibold mb-2 flex items-center gap-1.5"><CloudRain className="w-3.5 h-3.5 text-blue-400" />Flood Risk</p>
              Weighted score from rainfall (60%) and humidity (40%). Drainage factor mitigates risk. Classified: &gt;100mm + &gt;80% humidity = High.
            </div>
            <div>
              <p className="text-white/60 font-semibold mb-2 flex items-center gap-1.5"><Flame className="w-3.5 h-3.5 text-red-400" />Heatwave Risk</p>
              Temperature-driven score with heat index calculation (Steadman formula). &gt;40°C = High, 35–40°C = Medium.
            </div>
            <div>
              <p className="text-white/60 font-semibold mb-2 flex items-center gap-1.5"><Wind className="w-3.5 h-3.5 text-purple-400" />Air Pollution</p>
              US EPA AQI scale via Open-Meteo Air Quality API. AQI &gt;200 = High, 100–200 = Medium, &lt;100 = Low.
            </div>
          </div>
        </motion.div>
      </section>

      {/* High-risk Alert Popup */}
      {data && (
        <AlertPopup
          open={showPopup && !popupDismissed}
          onClose={() => { setShowPopup(false); setPopupDismissed(true); }}
          city={data.city}
          highRisks={Array.isArray(data.highRisks) ? data.highRisks : []}
          recommendations={Array.isArray(data.recommendations) ? data.recommendations : []}
        />
      )}
    </main>
  );
}
