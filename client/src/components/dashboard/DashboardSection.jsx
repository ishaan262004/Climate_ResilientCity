import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Activity, AlertTriangle, TrendingUp, Wind, Droplets, MapPin, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { fetchAQI } from '../../services/api';

const mockAQI = {
  city: 'Delhi',
  data: [
    { area: 'Rohini', aqi: 185, category: 'Unhealthy', pm25: 112, pm10: 156, no2: 48, so2: 14, co: 1.2, o3: 35 },
    { area: 'Dwarka', aqi: 142, category: 'USG', pm25: 86, pm10: 120, no2: 32, so2: 11, co: 0.9, o3: 28 },
    { area: 'Anand Vihar', aqi: 278, category: 'Very Unhealthy', pm25: 168, pm10: 235, no2: 72, so2: 22, co: 2.1, o3: 52 },
    { area: 'Connaught Place', aqi: 156, category: 'Unhealthy', pm25: 94, pm10: 130, no2: 41, so2: 15, co: 1.0, o3: 31 },
    { area: 'ITO', aqi: 215, category: 'Very Unhealthy', pm25: 130, pm10: 185, no2: 58, so2: 18, co: 1.6, o3: 44 },
    { area: 'IGI Airport (T3)', aqi: 148, category: 'USG', pm25: 89, pm10: 125, no2: 34, so2: 12, co: 0.8, o3: 26 },
    { area: 'Nehru Nagar', aqi: 235, category: 'Very Unhealthy', pm25: 142, pm10: 200, no2: 62, so2: 19, co: 1.8, o3: 48 },
    { area: 'Punjabi Bagh', aqi: 192, category: 'Unhealthy', pm25: 116, pm10: 162, no2: 50, so2: 16, co: 1.3, o3: 38 },
  ]
};

/* ─── AQI Helpers ─── */
const getAQIConfig = (aqi) => {
  if (aqi <= 50)  return { label: 'Good',             color: '#22c55e', textClass: 'text-green-400',  bgClass: 'bg-green-500',  borderClass: 'border-green-500/20',  gradFrom: 'from-green-500/15',  emoji: '😊' };
  if (aqi <= 100) return { label: 'Moderate',          color: '#eab308', textClass: 'text-yellow-400', bgClass: 'bg-yellow-500', borderClass: 'border-yellow-500/20', gradFrom: 'from-yellow-500/15', emoji: '😐' };
  if (aqi <= 150) return { label: 'Unhealthy (Sensitive)', color: '#f97316', textClass: 'text-orange-400', bgClass: 'bg-orange-500', borderClass: 'border-orange-500/20', gradFrom: 'from-orange-500/15', emoji: '😷' };
  if (aqi <= 200) return { label: 'Unhealthy',         color: '#ef4444', textClass: 'text-red-400',    bgClass: 'bg-red-500',    borderClass: 'border-red-500/20',    gradFrom: 'from-red-500/15',    emoji: '🫁' };
  if (aqi <= 300) return { label: 'Very Unhealthy',    color: '#a855f7', textClass: 'text-purple-400', bgClass: 'bg-purple-500', borderClass: 'border-purple-500/20', gradFrom: 'from-purple-500/15', emoji: '⚠️' };
  return               { label: 'Hazardous',          color: '#881337', textClass: 'text-rose-400',   bgClass: 'bg-rose-800',   borderClass: 'border-rose-800/20',   gradFrom: 'from-rose-800/15',   emoji: '☠️' };
};

const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.06 } } };
const fadeUp = { hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: 'easeOut' } } };

/* ─── Station Card (premium redesign) ─── */
function StationCard({ data, index }) {
  const c = getAQIConfig(data.aqi);
  const barWidth = Math.min((data.aqi / 500) * 100, 100);

  return (
    <motion.div
      variants={fadeUp}
      whileHover={{ y: -3, transition: { duration: 0.2 } }}
      className="relative group rounded-2xl bg-white/[0.03] border border-white/[0.06] hover:border-white/[0.12] p-5 transition-all duration-300 overflow-hidden"
    >
      {/* Top color accent line */}
      <div className="absolute top-0 left-0 right-0 h-[2px]" style={{ background: `linear-gradient(90deg, ${c.color}, transparent)` }} />

      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 mb-1">
            <MapPin className="w-3 h-3 text-white/30 flex-shrink-0" />
            <h3 className="font-semibold text-sm text-white truncate">{data.area}</h3>
          </div>
          <p className={`text-[11px] font-medium ${c.textClass}`}>{c.label}</p>
        </div>
        <div className="flex items-center gap-1.5">
          <span className={`text-2xl font-black tabular-nums tracking-tight ${c.textClass}`}>{data.aqi}</span>
        </div>
      </div>

      {/* AQI Progress Bar */}
      <div className="mb-4">
        <div className="h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            whileInView={{ width: `${barWidth}%` }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: index * 0.05, ease: 'easeOut' }}
            className="h-full rounded-full"
            style={{ background: `linear-gradient(90deg, ${c.color}90, ${c.color})` }}
          />
        </div>
      </div>

      {/* Pollutants */}
      <div className="grid grid-cols-2 gap-x-4 gap-y-1.5">
        <div className="flex justify-between items-center">
          <span className="text-[10px] text-white/30 uppercase tracking-wider">PM2.5</span>
          <span className="text-[11px] text-white/60 font-mono tabular-nums">{data.pm25}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-[10px] text-white/30 uppercase tracking-wider">PM10</span>
          <span className="text-[11px] text-white/60 font-mono tabular-nums">{data.pm10}</span>
        </div>
        {data.no2 && (
          <div className="flex justify-between items-center">
            <span className="text-[10px] text-white/30 uppercase tracking-wider">NO₂</span>
            <span className="text-[11px] text-white/60 font-mono tabular-nums">{data.no2}</span>
          </div>
        )}
        {data.so2 && (
          <div className="flex justify-between items-center">
            <span className="text-[10px] text-white/30 uppercase tracking-wider">SO₂</span>
            <span className="text-[11px] text-white/60 font-mono tabular-nums">{data.so2}</span>
          </div>
        )}
      </div>

      {/* Hover glow */}
      <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{ boxShadow: `inset 0 0 40px ${c.color}10` }}
      />
    </motion.div>
  );
}

/* ─── Main Section ─── */
export default function DashboardSection() {
  const [aqiData, setAqiData] = useState(mockAQI);

  useEffect(() => {
    const loadData = async () => {
      try {
        const aqi = await fetchAQI();
        if (aqi?.data) setAqiData(aqi);
      } catch (err) {
        console.log('Using mock AQI data:', err.message);
      }
    };
    loadData();
    const interval = setInterval(loadData, 60000);
    return () => clearInterval(interval);
  }, []);

  const avgAQI = Math.round(aqiData.data.reduce((s, d) => s + d.aqi, 0) / aqiData.data.length);
  const avgConfig = getAQIConfig(avgAQI);
  const worstStation = aqiData.data.reduce((a, b) => a.aqi > b.aqi ? a : b);
  const bestStation = aqiData.data.reduce((a, b) => a.aqi < b.aqi ? a : b);
  const avgPM25 = Math.round(aqiData.data.reduce((s, d) => s + d.pm25, 0) / aqiData.data.length);
  const avgPM10 = Math.round(aqiData.data.reduce((s, d) => s + d.pm10, 0) / aqiData.data.length);

  return (
    <section id="dashboard" className="section-padding relative overflow-hidden">
      {/* Background accents */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] rounded-full blur-[160px] pointer-events-none" style={{ background: `${avgConfig.color}08` }} />

      <div className="container-custom relative">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 bg-white/[0.04] border border-white/[0.08] px-4 py-2 rounded-full mb-5">
            <div className="w-1.5 h-1.5 rounded-full bg-resilient-green animate-pulse" />
            <span className="text-xs text-white/50 tracking-wide">Live Air Quality Dashboard</span>
          </div>
          <h2 className="font-bold text-3xl sm:text-4xl lg:text-5xl text-white mb-4 tracking-tight">
            Delhi Air Quality <span className="text-gradient-green">Index</span>
          </h2>
          <p className="text-white/40 max-w-xl mx-auto text-sm leading-relaxed">
            Real-time AQI readings from {aqiData.data.length} monitoring stations across Delhi NCR, updated every minute.
          </p>
        </motion.div>

        {/* ─── City Overview Hero ─── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-10 rounded-3xl bg-white/[0.02] border border-white/[0.06] p-6 sm:p-8 lg:p-10"
        >
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto_1fr] gap-8 items-center">
            {/* Left: City AQI */}
            <div className="text-center lg:text-left">
              <p className="text-xs text-white/30 uppercase tracking-widest mb-3">City Average</p>
              <div className="flex items-baseline gap-3 justify-center lg:justify-start">
                <span className={`text-7xl sm:text-8xl font-black tabular-nums tracking-tighter ${avgConfig.textClass}`}>{avgAQI}</span>
                <span className="text-lg text-white/20 font-light">AQI</span>
              </div>
              <div className="flex items-center gap-2 mt-3 justify-center lg:justify-start">
                <div className="w-2 h-2 rounded-full" style={{ background: avgConfig.color }} />
                <span className={`text-sm font-medium ${avgConfig.textClass}`}>{avgConfig.label}</span>
              </div>
              {/* AQI Scale Bar */}
              <div className="mt-5 max-w-xs mx-auto lg:mx-0">
                <div className="flex h-2 rounded-full overflow-hidden">
                  <div className="flex-1 bg-green-500" />
                  <div className="flex-1 bg-yellow-500" />
                  <div className="flex-1 bg-orange-500" />
                  <div className="flex-1 bg-red-500" />
                  <div className="flex-1 bg-purple-500" />
                  <div className="flex-1 bg-rose-800" />
                </div>
                <div className="relative h-3 mt-1">
                  <motion.div
                    initial={{ left: '0%' }}
                    whileInView={{ left: `${Math.min((avgAQI / 500) * 100, 98)}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, delay: 0.3, ease: 'easeOut' }}
                    className="absolute -translate-x-1/2"
                  >
                    <div className="w-0 h-0 border-l-[5px] border-r-[5px] border-b-[6px] border-transparent" style={{ borderBottomColor: avgConfig.color }} />
                  </motion.div>
                </div>
                <div className="flex justify-between text-[9px] text-white/20 mt-0.5">
                  <span>0</span><span>100</span><span>200</span><span>300</span><span>500</span>
                </div>
              </div>
            </div>

            {/* Divider */}
            <div className="hidden lg:block w-px h-40 bg-white/[0.06]" />

            {/* Right: Quick stats */}
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-2xl bg-white/[0.03] border border-white/[0.05] p-4 text-center">
                <AlertTriangle className="w-4 h-4 text-red-400/60 mx-auto mb-2" />
                <p className="text-lg font-bold text-white">{worstStation.area}</p>
                <p className="text-[11px] text-white/30 mt-0.5">Worst Station</p>
                <p className={`text-sm font-semibold mt-1 ${getAQIConfig(worstStation.aqi).textClass}`}>{worstStation.aqi} AQI</p>
              </div>
              <div className="rounded-2xl bg-white/[0.03] border border-white/[0.05] p-4 text-center">
                <TrendingUp className="w-4 h-4 text-green-400/60 mx-auto mb-2" />
                <p className="text-lg font-bold text-white">{bestStation.area}</p>
                <p className="text-[11px] text-white/30 mt-0.5">Best Station</p>
                <p className={`text-sm font-semibold mt-1 ${getAQIConfig(bestStation.aqi).textClass}`}>{bestStation.aqi} AQI</p>
              </div>
              <div className="rounded-2xl bg-white/[0.03] border border-white/[0.05] p-4 text-center">
                <Droplets className="w-4 h-4 text-orange-400/60 mx-auto mb-2" />
                <p className="text-lg font-bold text-white">{avgPM25}<span className="text-xs text-white/30 ml-1">µg/m³</span></p>
                <p className="text-[11px] text-white/30 mt-0.5">Avg PM2.5</p>
              </div>
              <div className="rounded-2xl bg-white/[0.03] border border-white/[0.05] p-4 text-center">
                <Wind className="w-4 h-4 text-cyan-400/60 mx-auto mb-2" />
                <p className="text-lg font-bold text-white">{avgPM10}<span className="text-xs text-white/30 ml-1">µg/m³</span></p>
                <p className="text-[11px] text-white/30 mt-0.5">Avg PM10</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* ─── Station Cards Grid ─── */}
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-50px' }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
        >
          {aqiData.data.map((item, i) => (
            <StationCard key={item.area} data={item} index={i} />
          ))}
        </motion.div>

        {/* ─── CTA ─── */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="text-center mt-10"
        >
          <Link
            to="/air-pollution"
            className="inline-flex items-center gap-2 text-sm text-white/40 hover:text-resilient-green transition-colors duration-300 group"
          >
            View detailed air quality analysis
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
