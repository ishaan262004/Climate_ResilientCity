import { motion } from 'framer-motion';
import { Thermometer, Droplets, Wind, Eye, Sun, Gauge } from 'lucide-react';

export default function WeatherCard({ data }) {
  if (!data) return null;

  const stats = [
    { icon: Thermometer, label: 'Feels Like', value: `${data.feelsLike}°C`, color: 'text-orange-400' },
    { icon: Droplets, label: 'Humidity', value: `${data.humidity}%`, color: 'text-blue-400' },
    { icon: Wind, label: 'Wind', value: `${data.windSpeed} km/h`, color: 'text-cyan-400' },
    { icon: Eye, label: 'Visibility', value: `${data.visibility} km`, color: 'text-emerald-400' },
    { icon: Sun, label: 'UV Index', value: data.uvIndex, color: 'text-yellow-400' },
    { icon: Gauge, label: 'Pressure', value: `${data.pressure} hPa`, color: 'text-purple-400' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="rounded-2xl glass-green p-6 lg:p-8"
    >
      {/* Main weather */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-white/40 text-sm mb-1">Delhi Weather</p>
          <div className="flex items-baseline gap-2">
            <span className="font-display font-black text-5xl text-white">{data.temperature}°</span>
            <span className="text-white/40 text-lg">C</span>
          </div>
          <p className="text-white/60 text-sm mt-1 flex items-center gap-2">
            <span className="text-2xl">{data.icon}</span>
            {data.condition}
          </p>
        </div>
        <div className="text-right">
          <p className="text-white/30 text-xs">Sunrise</p>
          <p className="text-white/60 text-sm">{data.sunrise}</p>
          <p className="text-white/30 text-xs mt-2">Sunset</p>
          <p className="text-white/60 text-sm">{data.sunset}</p>
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-3 gap-3">
        {stats.map(({ icon: Icon, label, value, color }, i) => (
          <motion.div
            key={label}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.05 }}
            className="rounded-xl bg-black/30 p-3 text-center"
          >
            <Icon className={`w-4 h-4 ${color} mx-auto mb-1`} />
            <p className="text-white font-semibold text-sm">{value}</p>
            <p className="text-white/30 text-[10px]">{label}</p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
