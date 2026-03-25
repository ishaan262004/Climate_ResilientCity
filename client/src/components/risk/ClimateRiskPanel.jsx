/**
 * ClimateRiskPanel.jsx
 * The main hub component used on Home page.
 * Shows city search, 3 risk cards, resilience score, recommendations, and high-risk alert popup.
 */
import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { CloudRain, Flame, Wind, RefreshCw, BrainCircuit } from 'lucide-react';
import { fetchClimateRisk } from '../../services/climateRiskApi';
import RiskCard from './RiskCard';
import AlertPopup from './AlertPopup';
import ResilienceScoreCard from './ResilienceScoreCard';
import CitySearch from './CitySearch';

const DEFAULT_CITY = 'Delhi';

// Skeleton loader for a risk card
function RiskSkeleton() {
  return (
    <div className="rounded-2xl bg-white/[0.02] border border-white/[0.05] p-6 animate-pulse">
      <div className="w-11 h-11 rounded-xl bg-white/[0.04] mb-3" />
      <div className="h-4 w-24 bg-white/[0.04] rounded mb-5" />
      <div className="h-10 w-16 bg-white/[0.04] rounded mb-3" />
      <div className="h-1.5 w-full bg-white/[0.04] rounded-full" />
    </div>
  );
}

export default function ClimateRiskPanel() {
  const [city, setCity] = useState(DEFAULT_CITY);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showAlert, setShowAlert] = useState(false);
  const [alertDismissed, setAlertDismissed] = useState(false); // per-fetch flag

  const loadRisk = useCallback(async (targetCity) => {
    setLoading(true);
    setError(null);
    setAlertDismissed(false);
    try {
      const result = await fetchClimateRisk(targetCity);
      setData(result);
      // Auto-show popup if any risk is HIGH
      if (result.highRisks && result.highRisks.length > 0) {
        setShowAlert(true);
      }
    } catch (err) {
      setError('Unable to fetch climate risk data. Please check the server and try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  // Load on mount with default city
  useEffect(() => { loadRisk(DEFAULT_CITY); }, [loadRisk]);

  const handleSearch = (newCity) => {
    setCity(newCity);
    loadRisk(newCity);
  };

  return (
    <section className="section-padding relative overflow-hidden">
      {/* Background ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[500px] rounded-full blur-[180px] pointer-events-none opacity-30"
        style={{ background: 'radial-gradient(ellipse, rgba(34,197,94,0.08) 0%, rgba(0,0,0,0) 70%)' }} />

      <div className="container-custom relative">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 bg-white/[0.04] border border-white/[0.08] px-4 py-2 rounded-full mb-5">
            <BrainCircuit className="w-3.5 h-3.5 text-resilient-green" />
            <span className="text-xs text-white/50 tracking-wide">AI-Powered Prediction</span>
          </div>
          <h2 className="font-bold text-3xl sm:text-4xl lg:text-5xl text-white mb-4 tracking-tight">
            Climate Risk <span className="text-gradient-green">Intelligence</span>
          </h2>
          <p className="text-white/40 max-w-xl mx-auto text-sm leading-relaxed">
            Real-time flood, heatwave, and air pollution risk assessment powered by live weather data and predictive analytics.
          </p>
        </motion.div>

        {/* City Search */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="mb-10"
        >
          <CitySearch value={city} onSearch={handleSearch} loading={loading} />
        </motion.div>

        {/* Error state */}
        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="max-w-md mx-auto mb-8 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-300 text-sm text-center"
          >
            {error}
          </motion.div>
        )}

        {/* Weather context bar */}
        {data && !loading && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-wrap gap-4 justify-center mb-8"
          >
            {[
              { label: 'Temperature', value: `${data.weather?.temperature ?? '--'}°C` },
              { label: 'Humidity',    value: `${data.weather?.humidity ?? '--'}%` },
              { label: 'Rainfall',    value: `${data.weather?.rainfall ?? '--'}mm` },
              { label: 'AQI',         value: data.weather?.aqi ?? '--' },
            ].map(({ label, value }) => (
              <div key={label}
                className="flex items-center gap-2 bg-white/[0.03] border border-white/[0.06] rounded-full px-4 py-1.5">
                <span className="text-[11px] text-white/30 uppercase tracking-wider">{label}</span>
                <span className="text-sm font-semibold text-white">{value}</span>
              </div>
            ))}
            <div className="flex items-center gap-1 text-white/20 text-xs" title="Last refreshed">
              <RefreshCw className="w-3 h-3" />
              <span>Live</span>
            </div>
          </motion.div>
        )}

        {/* Risk Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">
          {loading ? (
            <><RiskSkeleton /><RiskSkeleton /><RiskSkeleton /></>
          ) : data?.risk ? (
            <>
              <RiskCard
                type="Flood Risk"
                icon={CloudRain}
                risk={data.risk.flood?.risk ?? 'Low'}
                percentage={data.risk.flood?.percentage ?? 0}
                details={data.risk.flood?.details ?? 'No data available'}
                delay={0}
                extra={{ Rainfall: `${data.weather?.rainfall ?? '--'}mm`, 'Drainage Factor': '0.5' }}
              />
              <RiskCard
                type="Heatwave Risk"
                icon={Flame}
                risk={data.risk.heatwave?.risk ?? 'Low'}
                percentage={data.risk.heatwave?.percentage ?? 0}
                details={data.risk.heatwave?.details ?? 'No data available'}
                delay={0.1}
                extra={{ 'Heat Index': `${data.risk.heatwave?.heatIndex ?? '--'}°C` }}
              />
              <RiskCard
                type="Air Pollution"
                icon={Wind}
                risk={data.risk.pollution?.risk ?? 'Low'}
                percentage={data.risk.pollution?.percentage ?? 0}
                details={data.risk.pollution?.details ?? 'No data available'}
                delay={0.2}
                extra={{ AQI: data.weather?.aqi ?? '--', Category: data.risk.pollution?.category ?? '--' }}
              />
            </>
          ) : null}
        </div>

        {/* Resilience Score + Recommendations */}
        {data?.resilience && !loading && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-5"
          >
            {/* Resilience Score */}
            <ResilienceScoreCard
              score={data.resilience?.score ?? 0}
              grade={data.resilience?.grade ?? '--'}
              summary={data.resilience?.summary ?? 'No data available'}
              delay={0.15}
            />

            {/* Recommendations */}
            <motion.div
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="rounded-2xl bg-white/[0.02] border border-white/[0.07] p-6"
            >
              <p className="text-xs text-white/40 uppercase tracking-widest mb-4 flex items-center gap-2">
                <BrainCircuit className="w-3.5 h-3.5 text-resilient-green" />
                AI Recommendations
              </p>
              <ul className="space-y-2 max-h-56 overflow-y-auto pr-1">
                {(Array.isArray(data.recommendations) ? data.recommendations : []).map((rec, i) => (
                  <li key={i} className="text-xs text-white/65 leading-relaxed flex gap-2 items-start bg-white/[0.02] rounded-lg px-3 py-2 border border-white/[0.04]">
                    <span>{rec}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          </motion.div>
        )}
      </div>

      {/* High-Risk Alert Popup */}
      {data && (
        <AlertPopup
          open={showAlert && !alertDismissed}
          onClose={() => { setShowAlert(false); setAlertDismissed(true); }}
          city={data.city}
          highRisks={Array.isArray(data.highRisks) ? data.highRisks : []}
          recommendations={Array.isArray(data.recommendations) ? data.recommendations : []}
        />
      )}
    </section>
  );
}
