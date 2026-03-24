import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { CloudRain, ArrowLeft, AlertTriangle, Droplets, Building, RouteIcon, MapPin } from 'lucide-react';

const causes = [
  { icon: CloudRain, title: 'Extreme Rainfall', desc: 'Climate change intensifies monsoon rainfall, overwhelming drainage systems designed for lower volumes.' },
  { icon: Building, title: 'Rapid Urbanization', desc: 'Concrete surfaces prevent natural absorption. Delhi has lost 60% of its permeable surfaces in 3 decades.' },
  { icon: RouteIcon, title: 'Clogged Drains', desc: 'Garbage and construction debris block 40% of Delhi\'s storm drains, reducing water flow capacity.' },
  { icon: MapPin, title: 'Floodplain Encroachment', desc: 'Construction on the Yamuna floodplain has reduced the river\'s natural overflow area by 70%.' },
];

const vulnerableAreas = [
  { name: 'Yamuna Vihar', risk: 'Critical', color: 'text-red-400' },
  { name: 'ITO & Pragati Maidan', risk: 'High', color: 'text-orange-400' },
  { name: 'Okhla', risk: 'High', color: 'text-orange-400' },
  { name: 'Minto Bridge', risk: 'High', color: 'text-orange-400' },
  { name: 'Civil Lines', risk: 'Moderate', color: 'text-yellow-400' },
  { name: 'Rohini Low Zone', risk: 'Moderate', color: 'text-yellow-400' },
];

const preparedness = [
  'Keep emergency supplies (water, flashlight, first aid) ready during monsoon',
  'Avoid driving through waterlogged roads — 6 inches of water can stall a car',
  'Store important documents in waterproof containers above ground level',
  'Know your area\'s flood risk level and evacuation routes',
  'Subscribe to IMD weather warnings and NDMA alerts',
  'Keep mobile phones charged and emergency numbers saved',
];

export default function Flooding() {
  return (
    <div className="min-h-screen pt-20">
      {/* Hero with rain-like effect */}
      <section className="relative section-padding overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-gradient-to-b from-blue-500/10 to-transparent rounded-full blur-[100px] pointer-events-none" />

        <div className="container-custom relative">
          <Link to="/" className="inline-flex items-center gap-2 text-sm text-white/40 hover:text-white mb-8 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </Link>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="inline-flex items-center gap-2 glass px-4 py-2 rounded-full mb-6">
              <CloudRain className="w-4 h-4 text-blue-400" />
              <span className="text-xs text-white/60">Climate Risk: Urban Flooding</span>
            </div>
            <h1 className="font-display font-black text-4xl sm:text-6xl lg:text-7xl text-white mb-6">
              Flooding in <span className="text-blue-400">Delhi</span>
            </h1>
            <p className="text-white/60 text-lg max-w-3xl leading-relaxed">
              Every monsoon season, Delhi faces severe urban flooding that paralyzes transportation, 
              damages property, and claims lives. Climate change is making these events more frequent and intense.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Causes */}
      <section className="section-padding">
        <div className="container-custom">
          <motion.h2 initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
            className="font-display font-bold text-3xl text-white mb-8">
            Root <span className="text-blue-400">Causes</span>
          </motion.h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {causes.map((cause, i) => (
              <motion.div
                key={cause.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="rounded-2xl bg-gradient-to-br from-blue-500/10 to-transparent border border-blue-500/10 p-6"
              >
                <cause.icon className="w-8 h-8 text-blue-400 mb-3" />
                <h3 className="font-display font-semibold text-lg text-white mb-2">{cause.title}</h3>
                <p className="text-white/50 text-sm leading-relaxed">{cause.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Vulnerable Areas */}
      <section className="section-padding">
        <div className="container-custom">
          <motion.h2 initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
            className="font-display font-bold text-3xl text-white mb-8">
            Vulnerable <span className="text-blue-400">Areas</span>
          </motion.h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {vulnerableAreas.map((area, i) => (
              <motion.div
                key={area.name}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="glass rounded-xl p-4 flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <Droplets className="w-5 h-5 text-blue-400" />
                  <span className="text-white text-sm font-medium">{area.name}</span>
                </div>
                <span className={`text-xs font-semibold ${area.color}`}>{area.risk}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Preparedness */}
      <section className="section-padding">
        <div className="container-custom">
          <motion.h2 initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
            className="font-display font-bold text-3xl text-white mb-8">
            Flood <span className="text-resilient-green">Preparedness</span>
          </motion.h2>
          <div className="space-y-3 max-w-3xl">
            {preparedness.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="flex items-start gap-3 glass-green rounded-xl p-4"
              >
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-resilient-green/20 text-resilient-green text-xs font-bold flex items-center justify-center">
                  {i + 1}
                </span>
                <p className="text-white/70 text-sm">{item}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
