import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Thermometer, Droplets, Wind, Eye, Gauge, Sun, Sunrise, Sunset,
  CloudRain, CloudSnow, CloudLightning, Cloud, CloudFog, MapPin,
  RefreshCw, AlertTriangle, TrendingUp, ShieldAlert, Waves
} from 'lucide-react';

/* ─── helpers ─── */
const API = '/api/weather';

const conditionIcon = (icon) => {
  const base = 'https://openweathermap.org/img/wn/';
  return `${base}${icon}@2x.png`;
};

const getConditionEmoji = (condition = '') => {
  const c = condition.toLowerCase();
  if (c.includes('thunder')) return <CloudLightning className="w-8 h-8 text-yellow-400" />;
  if (c.includes('rain') || c.includes('drizzle') || c.includes('shower')) return <CloudRain className="w-8 h-8 text-blue-400" />;
  if (c.includes('snow')) return <CloudSnow className="w-8 h-8 text-blue-200" />;
  if (c.includes('fog') || c.includes('haze') || c.includes('mist')) return <CloudFog className="w-8 h-8 text-gray-400" />;
  if (c.includes('cloud') || c.includes('overcast')) return <Cloud className="w-8 h-8 text-gray-300" />;
  return <Sun className="w-8 h-8 text-yellow-400" />;
};

const getSmartInsight = (data) => {
  if (!data) return null;
  const { temperature, humidity, condition = '' } = data;
  const c = condition.toLowerCase();
  const insights = [];

  if (temperature >= 40) insights.push({ icon: <AlertTriangle className="w-5 h-5" />, color: 'text-red-400', bg: 'bg-red-500/10 border-red-500/20', title: 'Extreme Heat Alert', text: 'Severe heatwave conditions. Avoid outdoor activity, stay hydrated, and seek air-conditioned spaces.' });
  else if (temperature >= 35) insights.push({ icon: <Thermometer className="w-5 h-5" />, color: 'text-orange-400', bg: 'bg-orange-500/10 border-orange-500/20', title: 'Heat Advisory', text: 'High temperatures expected. Drink plenty of water and limit sun exposure during peak hours.' });

  if (c.includes('rain') || c.includes('shower') || c.includes('drizzle')) insights.push({ icon: <Waves className="w-5 h-5" />, color: 'text-blue-400', bg: 'bg-blue-500/10 border-blue-500/20', title: 'Waterlogging Risk', text: 'Rainfall expected. Watch for waterlogging in low-lying areas. Avoid underpasses and drainage zones.' });
  if (c.includes('thunder')) insights.push({ icon: <ShieldAlert className="w-5 h-5" />, color: 'text-yellow-400', bg: 'bg-yellow-500/10 border-yellow-500/20', title: 'Thunderstorm Warning', text: 'Stay indoors and away from open fields. Unplug electronic devices and avoid tall structures.' });
  if (c.includes('fog') || c.includes('haze') || c.includes('mist')) insights.push({ icon: <Eye className="w-5 h-5" />, color: 'text-gray-400', bg: 'bg-gray-500/10 border-gray-500/20', title: 'Low Visibility', text: 'Foggy conditions may reduce visibility. Drive carefully and use fog lights.' });
  if (humidity > 80) insights.push({ icon: <Droplets className="w-5 h-5" />, color: 'text-cyan-400', bg: 'bg-cyan-500/10 border-cyan-500/20', title: 'High Humidity', text: 'Humidity levels are elevated. Stay in cool environments and wear light, breathable clothing.' });

  if (insights.length === 0) insights.push({ icon: <TrendingUp className="w-5 h-5" />, color: 'text-green-400', bg: 'bg-green-500/10 border-green-500/20', title: 'Favorable Conditions', text: 'Weather conditions are moderate. A good day for outdoor activities with normal precautions.' });

  return insights;
};

const getBgGradient = (data) => {
  if (!data) return 'radial-gradient(ellipse at 50% 0%, rgba(34,197,94,0.08) 0%, transparent 60%)';
  const { temperature, condition = '' } = data;
  const c = condition.toLowerCase();
  if (c.includes('rain') || c.includes('thunder') || c.includes('shower')) return 'radial-gradient(ellipse at 50% 0%, rgba(59,130,246,0.12) 0%, rgba(30,64,175,0.04) 40%, transparent 70%)';
  if (temperature >= 40) return 'radial-gradient(ellipse at 50% 0%, rgba(239,68,68,0.15) 0%, rgba(234,88,12,0.06) 40%, transparent 70%)';
  if (temperature >= 35) return 'radial-gradient(ellipse at 50% 0%, rgba(234,88,12,0.10) 0%, rgba(239,68,68,0.04) 40%, transparent 70%)';
  if (c.includes('fog') || c.includes('haze')) return 'radial-gradient(ellipse at 50% 0%, rgba(148,163,184,0.10) 0%, transparent 60%)';
  return 'radial-gradient(ellipse at 50% 0%, rgba(34,197,94,0.08) 0%, transparent 60%)';
};

/* ─── animated number ─── */
function AnimatedTemp({ value }) {
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    if (value == null) return;
    let start = display;
    const end = value;
    const duration = 1200;
    const startTime = performance.now();
    const animate = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(start + (end - start) * eased));
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [value]);
  return <span>{display}</span>;
}

/* ─── skeleton ─── */
function Skeleton({ className = '' }) {
  return <div className={`animate-pulse bg-white/5 rounded-xl ${className}`} />;
}

function LoadingSkeleton() {
  return (
    <div className="min-h-screen bg-black pt-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Hero skeleton */}
        <div className="flex flex-col items-center gap-4 py-16">
          <Skeleton className="w-32 h-6" />
          <Skeleton className="w-64 h-24" />
          <Skeleton className="w-48 h-8" />
          <Skeleton className="w-56 h-5" />
        </div>
        {/* Metrics grid skeleton */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {[...Array(6)].map((_, i) => <Skeleton key={i} className="h-28" />)}
        </div>
        {/* Forecast skeleton */}
        <Skeleton className="h-48 w-full" />
      </div>
    </div>
  );
}

/* ─── stagger wrapper ─── */
const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};
const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
};

/* ─── metric card ─── */
function MetricCard({ icon, label, value, unit, delay = 0 }) {
  return (
    <motion.div
      variants={fadeUp}
      className="glass rounded-2xl p-4 sm:p-5 flex flex-col items-center gap-2 group hover:bg-white/[0.06] transition-all duration-300 cursor-default"
    >
      <div className="text-white/40 group-hover:text-resilient-green transition-colors duration-300">{icon}</div>
      <div className="text-xl sm:text-2xl font-bold tracking-tight">
        {value ?? '—'}<span className="text-sm font-normal text-white/40 ml-1">{unit}</span>
      </div>
      <div className="text-xs text-white/40 uppercase tracking-widest">{label}</div>
    </motion.div>
  );
}

/* ─── forecast card ─── */
function ForecastCard({ day, tempHigh, tempLow, condition, icon }) {
  return (
    <motion.div
      variants={fadeUp}
      className="glass rounded-2xl p-4 sm:p-5 flex flex-col items-center gap-3 min-w-[130px] group hover:bg-white/[0.06] transition-all duration-300 cursor-default"
    >
      <span className="text-sm font-semibold text-white/60 uppercase tracking-wider">{day}</span>
      {icon ? (
        <img src={conditionIcon(icon)} alt={condition} className="w-12 h-12 drop-shadow-lg" />
      ) : (
        getConditionEmoji(condition)
      )}
      <span className="text-xs text-white/40 capitalize">{condition}</span>
      <div className="flex gap-2 items-baseline">
        <span className="text-lg font-bold">{tempHigh}°</span>
        <span className="text-sm text-white/30">{tempLow}°</span>
      </div>
    </motion.div>
  );
}

/* ─── main page ─── */
export default function Weather() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastFetch, setLastFetch] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(API);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      setData(json);
      setLastFetch(new Date());
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const insights = useMemo(() => data ? getSmartInsight(data.current) : null, [data]);
  const bgGradient = useMemo(() => getBgGradient(data?.current), [data]);

  if (loading) return <LoadingSkeleton />;

  if (error) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass rounded-3xl p-8 sm:p-12 text-center max-w-md w-full"
        >
          <CloudRain className="w-16 h-16 text-white/20 mx-auto mb-4" />
          <h2 className="text-xl font-bold mb-2">Weather Data Unavailable</h2>
          <p className="text-white/40 text-sm mb-6">We couldn't fetch weather data right now. Please try again.</p>
          <button
            onClick={fetchData}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-resilient-green/20 text-resilient-green hover:bg-resilient-green/30 transition-colors font-medium"
          >
            <RefreshCw className="w-4 h-4" /> Retry
          </button>
        </motion.div>
      </div>
    );
  }

  const w = data?.current;
  const forecast = data?.forecast || [];

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Dynamic background gradient */}
      <div className="fixed inset-0 pointer-events-none transition-all duration-1000" style={{ background: bgGradient }} />

      {/* Rain effect for rainy conditions */}
      {w?.condition?.toLowerCase().includes('rain') && (
        <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
          {[...Array(40)].map((_, i) => (
            <div
              key={i}
              className="absolute w-px bg-gradient-to-b from-transparent via-blue-400/30 to-transparent"
              style={{
                left: `${Math.random() * 100}%`,
                top: '-10%',
                height: `${15 + Math.random() * 20}px`,
                animation: `rainDrop ${0.6 + Math.random() * 0.4}s linear ${Math.random() * 2}s infinite`,
              }}
            />
          ))}
        </div>
      )}

      <style>{`
        @keyframes rainDrop {
          0% { transform: translateY(-10vh); opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { transform: translateY(110vh); opacity: 0; }
        }
      `}</style>

      <div className="relative z-10 pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-10">

          {/* ───── HERO: Current Weather ───── */}
          <motion.section
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
            className="flex flex-col items-center text-center py-8 sm:py-12"
          >
            {/* Location badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass text-sm text-white/60 mb-6"
            >
              <MapPin className="w-3.5 h-3.5 text-resilient-green" />
              <span>{w?.city || 'Delhi'}, India</span>
              <span className="w-1.5 h-1.5 rounded-full bg-resilient-green animate-pulse" />
            </motion.div>

            {/* Temperature */}
            <div className="relative mb-2">
              <span className="text-[7rem] sm:text-[9rem] lg:text-[11rem] font-black leading-none tracking-tighter bg-gradient-to-b from-white via-white to-white/30 bg-clip-text text-transparent">
                <AnimatedTemp value={w?.temperature} />
                <span className="text-4xl sm:text-5xl align-top ml-1">°C</span>
              </span>
            </div>

            {/* Condition */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="flex items-center gap-3 mb-3"
            >
              {w?.icon ? (
                <img src={conditionIcon(w.icon)} alt={w.condition} className="w-12 h-12" />
              ) : (
                getConditionEmoji(w?.condition)
              )}
              <span className="text-xl sm:text-2xl font-medium text-white/80 capitalize">{w?.description || w?.condition}</span>
            </motion.div>

            {/* Feels like + range */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="flex flex-wrap items-center justify-center gap-4 text-sm text-white/40"
            >
              <span>Feels like <strong className="text-white/70">{w?.feelsLike}°</strong></span>
              <span className="w-1 h-1 rounded-full bg-white/20" />
              <span>H: <strong className="text-white/70">{w?.tempMax}°</strong></span>
              <span>L: <strong className="text-white/70">{w?.tempMin}°</strong></span>
            </motion.div>

            {/* Source + refresh */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="flex items-center gap-3 mt-6 text-xs text-white/20"
            >
              <span>via {data?.source || 'API'}</span>
              <button onClick={fetchData} className="hover:text-white/50 transition-colors" title="Refresh">
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
              {lastFetch && <span>Updated {lastFetch.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</span>}
            </motion.div>
          </motion.section>

          {/* ───── METRICS GRID ───── */}
          <motion.section
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-50px' }}
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4"
          >
            <MetricCard icon={<Droplets className="w-5 h-5" />} label="Humidity" value={w?.humidity} unit="%" />
            <MetricCard icon={<Wind className="w-5 h-5" />} label="Wind" value={w?.windSpeed} unit="km/h" />
            <MetricCard icon={<Eye className="w-5 h-5" />} label="Visibility" value={w?.visibility} unit="km" />
            <MetricCard icon={<Gauge className="w-5 h-5" />} label="Pressure" value={w?.pressure} unit="hPa" />
            <MetricCard icon={<Sunrise className="w-5 h-5" />} label="Sunrise" value={w?.sunrise} unit="" />
            <MetricCard icon={<Sunset className="w-5 h-5" />} label="Sunset" value={w?.sunset} unit="" />
          </motion.section>

          {/* ───── 5-DAY FORECAST ───── */}
          {forecast.length > 0 && (
            <motion.section
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-lg font-semibold text-white/70 mb-4 tracking-wide">5-Day Forecast</h2>
              <motion.div
                variants={stagger}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
                className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 sm:gap-4"
              >
                {forecast.map((day, i) => (
                  <ForecastCard key={day.date} {...day} />
                ))}
              </motion.div>
            </motion.section>
          )}

          {/* ───── SMART INSIGHTS ───── */}
          {insights && insights.length > 0 && (
            <motion.section
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-lg font-semibold text-white/70 mb-4 tracking-wide">Today's Climate Insights</h2>
              <div className="grid gap-3 sm:gap-4 md:grid-cols-2">
                {insights.map((ins, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1, duration: 0.4 }}
                    className={`rounded-2xl border p-5 flex gap-4 items-start ${ins.bg}`}
                  >
                    <div className={`mt-0.5 ${ins.color}`}>{ins.icon}</div>
                    <div>
                      <h3 className={`font-semibold text-sm mb-1 ${ins.color}`}>{ins.title}</h3>
                      <p className="text-sm text-white/50 leading-relaxed">{ins.text}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.section>
          )}

        </div>
      </div>
    </div>
  );
}
