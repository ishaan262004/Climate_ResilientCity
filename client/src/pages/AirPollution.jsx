import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Wind, ArrowLeft, AlertTriangle, Heart, Factory, Car, Wheat } from 'lucide-react';

const aqiScale = [
  { range: '0-50', label: 'Good', color: 'bg-green-500', desc: 'Minimal health risk' },
  { range: '51-100', label: 'Moderate', color: 'bg-yellow-500', desc: 'Sensitive individuals may be affected' },
  { range: '101-150', label: 'Unhealthy (Sensitive)', color: 'bg-orange-500', desc: 'General public starts to be affected' },
  { range: '151-200', label: 'Unhealthy', color: 'bg-red-500', desc: 'Everyone may experience health effects' },
  { range: '201-300', label: 'Very Unhealthy', color: 'bg-purple-500', desc: 'Health alert: significant risk' },
  { range: '300+', label: 'Hazardous', color: 'bg-rose-900', desc: 'Emergency conditions for entire population' },
];

const sources = [
  { icon: Car, label: 'Vehicular Emissions', pct: '40%', color: 'text-red-400' },
  { icon: Factory, label: 'Industrial Pollution', pct: '20%', color: 'text-purple-400' },
  { icon: Wheat, label: 'Stubble Burning', pct: '25%', color: 'text-orange-400' },
  { icon: Wind, label: 'Dust & Construction', pct: '15%', color: 'text-yellow-400' },
];

const healthEffects = [
  'Aggravated asthma and respiratory diseases',
  'Increased risk of lung cancer with prolonged exposure',
  'Cardiovascular problems in elderly population',
  'Reduced lung function in children',
  'Eye, nose, and throat irritation',
  'Premature mortality during severe episodes',
];

export default function AirPollution() {
  return (
    <div className="min-h-screen pt-20">
      {/* Hero with fog effect */}
      <section className="relative section-padding overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-purple-500/5 via-gray-500/5 to-transparent pointer-events-none" />
        {/* Fog overlay */}
        <div className="absolute top-0 left-0 right-0 h-64 bg-gradient-to-b from-white/[0.02] to-transparent pointer-events-none" />
        
        <div className="container-custom relative">
          <Link to="/" className="inline-flex items-center gap-2 text-sm text-white/40 hover:text-white mb-8 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </Link>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="inline-flex items-center gap-2 glass px-4 py-2 rounded-full mb-6">
              <Wind className="w-4 h-4 text-purple-400" />
              <span className="text-xs text-white/60">Climate Risk: Air Quality</span>
            </div>
            <h1 className="font-display font-black text-4xl sm:text-6xl lg:text-7xl text-white mb-6">
              Air Pollution in <span className="text-purple-400">Delhi</span>
            </h1>
            <p className="text-white/60 text-lg max-w-3xl leading-relaxed">
              Delhi consistently ranks among the world's most polluted cities. Hazardous air quality 
              affects over 20 million residents, causing respiratory illness and reducing life expectancy by up to 10 years.
            </p>
          </motion.div>
        </div>
      </section>

      {/* AQI Scale */}
      <section className="section-padding">
        <div className="container-custom">
          <motion.h2 initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
            className="font-display font-bold text-3xl text-white mb-8">
            Understanding <span className="text-purple-400">AQI</span>
          </motion.h2>
          <div className="space-y-3">
            {aqiScale.map((item, i) => (
              <motion.div
                key={item.range}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="flex items-center gap-4 glass rounded-xl p-4"
              >
                <div className={`w-3 h-3 rounded-full ${item.color} flex-shrink-0`} />
                <span className="font-mono text-sm text-white/80 w-20">{item.range}</span>
                <span className="font-semibold text-white text-sm w-40">{item.label}</span>
                <span className="text-white/40 text-sm hidden sm:block">{item.desc}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Sources */}
      <section className="section-padding">
        <div className="container-custom">
          <motion.h2 initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
            className="font-display font-bold text-3xl text-white mb-8">
            Pollution <span className="text-purple-400">Sources</span>
          </motion.h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {sources.map((src, i) => (
              <motion.div
                key={src.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="glass rounded-2xl p-6 text-center"
              >
                <src.icon className={`w-8 h-8 ${src.color} mx-auto mb-3`} />
                <p className="font-display font-black text-2xl text-white mb-1">{src.pct}</p>
                <p className="text-white/40 text-xs">{src.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Health Effects */}
      <section className="section-padding">
        <div className="container-custom">
          <motion.h2 initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
            className="font-display font-bold text-3xl text-white mb-8">
            <Heart className="w-8 h-8 text-red-400 inline mr-2" />
            Health <span className="text-red-400">Impacts</span>
          </motion.h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {healthEffects.map((effect, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="flex items-start gap-3 glass rounded-xl p-4"
              >
                <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                <p className="text-white/70 text-sm">{effect}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
