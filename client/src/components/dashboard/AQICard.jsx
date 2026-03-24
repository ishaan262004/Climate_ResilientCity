import { motion } from 'framer-motion';

const getAQIConfig = (aqi) => {
  if (aqi <= 50) return { label: 'Good', bg: 'from-green-500/20 to-green-600/5', border: 'border-green-500/30', text: 'text-green-400', ring: 'ring-green-500/20' };
  if (aqi <= 100) return { label: 'Moderate', bg: 'from-yellow-500/20 to-yellow-600/5', border: 'border-yellow-500/30', text: 'text-yellow-400', ring: 'ring-yellow-500/20' };
  if (aqi <= 150) return { label: 'Unhealthy (Sensitive)', bg: 'from-orange-500/20 to-orange-600/5', border: 'border-orange-500/30', text: 'text-orange-400', ring: 'ring-orange-500/20' };
  if (aqi <= 200) return { label: 'Unhealthy', bg: 'from-red-500/20 to-red-600/5', border: 'border-red-500/30', text: 'text-red-400', ring: 'ring-red-500/20' };
  if (aqi <= 300) return { label: 'Very Unhealthy', bg: 'from-purple-500/20 to-purple-600/5', border: 'border-purple-500/30', text: 'text-purple-400', ring: 'ring-purple-500/20' };
  return { label: 'Hazardous', bg: 'from-rose-900/30 to-rose-800/5', border: 'border-rose-800/30', text: 'text-rose-400', ring: 'ring-rose-800/20' };
};

export default function AQICard({ data, index = 0 }) {
  const config = getAQIConfig(data.aqi);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      whileHover={{ y: -4, scale: 1.02 }}
      className={`relative rounded-2xl bg-gradient-to-br ${config.bg} border ${config.border} p-5 transition-all duration-300 hover:shadow-lg group`}
    >
      {/* AQI Ring */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="font-display font-semibold text-white text-sm">{data.area}</h3>
          <p className={`text-xs ${config.text} mt-1`}>{config.label}</p>
        </div>
        <div className={`relative w-14 h-14 rounded-full ring-2 ${config.ring} flex items-center justify-center`}>
          <span className={`font-display font-bold text-lg ${config.text}`}>{data.aqi}</span>
          {/* Animated ring */}
          <svg className="absolute inset-0 -rotate-90" viewBox="0 0 56 56">
            <circle
              cx="28" cy="28" r="24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeDasharray={`${Math.min(data.aqi / 500, 1) * 150} 150`}
              className={`${config.text} opacity-40`}
            />
          </svg>
        </div>
      </div>

      {/* Details */}
      <div className="space-y-2">
        <div className="flex justify-between text-xs">
          <span className="text-white/40">PM2.5</span>
          <span className="text-white/70 font-mono">{data.pm25} µg/m³</span>
        </div>
        <div className="flex justify-between text-xs">
          <span className="text-white/40">PM10</span>
          <span className="text-white/70 font-mono">{data.pm10} µg/m³</span>
        </div>
      </div>

      {/* Hover glow */}
      <div className={`absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none`}
        style={{ boxShadow: `inset 0 0 30px ${data.color}15` }}
      />
    </motion.div>
  );
}
