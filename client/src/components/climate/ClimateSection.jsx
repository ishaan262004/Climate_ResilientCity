import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowUpRight, Flame, Wind, CloudRain, TreePine } from 'lucide-react';

const risks = [
  {
    icon: Flame,
    title: 'Heatwaves',
    path: '/heatwaves',
    description: 'Delhi faces extreme heat events with temperatures crossing 47°C. Urban heat islands amplify the danger for millions.',
    gradient: 'from-orange-500/20 via-red-500/10 to-transparent',
    border: 'hover:border-orange-500/30',
    iconColor: 'text-orange-400',
    glowColor: 'rgba(249, 115, 22, 0.15)',
  },
  {
    icon: Wind,
    title: 'Air Pollution',
    path: '/air-pollution',
    description: 'With AQI frequently exceeding 300, Delhi battles hazardous air quality from vehicular emissions, stubble burning, and industrial pollutants.',
    gradient: 'from-purple-500/20 via-gray-500/10 to-transparent',
    border: 'hover:border-purple-500/30',
    iconColor: 'text-purple-400',
    glowColor: 'rgba(168, 85, 247, 0.15)',
  },
  {
    icon: CloudRain,
    title: 'Flooding',
    path: '/flooding',
    description: 'Monsoon flooding disrupts life annually. Poor drainage, encroached floodplains, and rapid urbanization worsen the crisis.',
    gradient: 'from-blue-500/20 via-cyan-500/10 to-transparent',
    border: 'hover:border-blue-500/30',
    iconColor: 'text-blue-400',
    glowColor: 'rgba(59, 130, 246, 0.15)',
  },
  {
    icon: TreePine,
    title: 'Environmental Crisis',
    path: '/environment',
    description: 'Water scarcity, loss of green cover, and groundwater depletion threaten Delhi\'s ecological sustainability.',
    gradient: 'from-emerald-500/20 via-green-500/10 to-transparent',
    border: 'hover:border-emerald-500/30',
    iconColor: 'text-emerald-400',
    glowColor: 'rgba(52, 211, 153, 0.15)',
  },
];

export default function ClimateSection() {
  return (
    <section className="section-padding relative overflow-hidden">
      <div className="container-custom">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="font-display font-bold text-3xl sm:text-4xl lg:text-5xl text-white mb-4">
            Climate <span className="text-gradient-green">Risks</span>
          </h2>
          <p className="text-white/50 max-w-2xl mx-auto">
            Understanding the environmental challenges threatening Delhi and what we can do about them.
          </p>
        </motion.div>

        {/* Risk Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {risks.map((risk, i) => (
            <motion.div
              key={risk.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ delay: i * 0.15, duration: 0.6 }}
            >
              <Link
                to={risk.path}
                className={`group block rounded-2xl bg-gradient-to-br ${risk.gradient} border border-white/5 ${risk.border} p-6 sm:p-8 transition-all duration-500 hover:shadow-2xl relative overflow-hidden`}
              >
                {/* Hover glow */}
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
                  style={{ boxShadow: `inset 0 0 60px ${risk.glowColor}` }}
                />

                <div className="relative z-10">
                  <div className="flex items-start justify-between mb-4">
                    <div className={`w-12 h-12 rounded-xl glass flex items-center justify-center ${risk.iconColor}`}>
                      <risk.icon className="w-6 h-6" />
                    </div>
                    <ArrowUpRight className="w-5 h-5 text-white/20 group-hover:text-white/60 transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </div>

                  <h3 className="font-display font-bold text-xl text-white mb-2 group-hover:text-white transition-colors">
                    {risk.title}
                  </h3>
                  <p className="text-white/50 text-sm leading-relaxed group-hover:text-white/60 transition-colors">
                    {risk.description}
                  </p>

                  <div className="mt-6 flex items-center gap-2 text-sm font-medium text-white/30 group-hover:text-resilient-green transition-colors">
                    <span>Learn more</span>
                    <ArrowUpRight className="w-4 h-4" />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
