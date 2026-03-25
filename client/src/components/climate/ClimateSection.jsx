import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowUpRight, Flame, Wind, CloudRain, TreePine, TrendingUp, BarChart3 } from 'lucide-react';

const risks = [
  {
    icon: Flame,
    title: 'Heatwaves',
    path: '/heatwaves',
    stat: '47°C',
    statLabel: 'Peak Recorded',
    description: 'Delhi faces extreme heat events with temperatures crossing 47°C. Urban heat islands amplify the danger for millions.',
    color: '#f97316',
    gradient: 'linear-gradient(135deg, rgba(249,115,22,0.08) 0%, rgba(239,68,68,0.03) 100%)',
  },
  {
    icon: Wind,
    title: 'Air Pollution',
    path: '/air-pollution',
    stat: '300+',
    statLabel: 'AQI Peak',
    description: 'With AQI frequently exceeding 300, Delhi battles hazardous air quality from vehicular emissions and stubble burning.',
    color: '#a855f7',
    gradient: 'linear-gradient(135deg, rgba(168,85,247,0.08) 0%, rgba(139,92,246,0.03) 100%)',
  },
  {
    icon: CloudRain,
    title: 'Flooding',
    path: '/flooding',
    stat: '24hr',
    statLabel: 'Response Time',
    description: 'Monsoon flooding disrupts life annually. Poor drainage, encroached floodplains, and rapid urbanization worsen the crisis.',
    color: '#3b82f6',
    gradient: 'linear-gradient(135deg, rgba(59,130,246,0.08) 0%, rgba(6,182,212,0.03) 100%)',
  },
  {
    icon: TreePine,
    title: 'Environment',
    path: '/environment',
    stat: '21%',
    statLabel: 'Green Cover',
    description: 'Water scarcity, loss of green cover, and groundwater depletion threaten Delhi\'s ecological sustainability.',
    color: '#22c55e',
    gradient: 'linear-gradient(135deg, rgba(34,197,94,0.08) 0%, rgba(16,185,129,0.03) 100%)',
  },
];

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
};
const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
};

export default function ClimateSection() {
  return (
    <section className="section-padding relative overflow-hidden">
      {/* Ambient background */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] rounded-full blur-[250px] opacity-[0.03] pointer-events-none"
        style={{ background: 'radial-gradient(ellipse, #22c55e, transparent 60%)' }} />

      <div className="container-custom">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <div className="inline-flex items-center gap-2 bg-white/[0.02] border border-white/[0.05] px-5 py-2 rounded-full mb-5 backdrop-blur-sm">
            <BarChart3 className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-[11px] text-white/35 tracking-widest uppercase font-medium">Risk Analysis</span>
          </div>
          <h2 className="font-display font-bold text-3xl sm:text-4xl lg:text-5xl text-white mb-4 tracking-tight">
            Climate <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-cyan-400 to-blue-400">Risks</span>
          </h2>
          <p className="text-white/30 max-w-2xl mx-auto text-sm font-light">
            Understanding the environmental challenges threatening Delhi and what we can do about them.
          </p>
        </motion.div>

        {/* Risk Cards */}
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-50px' }}
          className="grid grid-cols-1 md:grid-cols-2 gap-5"
        >
          {risks.map((risk) => (
            <motion.div key={risk.title} variants={fadeUp}>
              <Link
                to={risk.path}
                className="group block rounded-[20px] p-7 sm:p-8 transition-all duration-500 relative overflow-hidden"
                style={{ background: risk.gradient, border: '1px solid rgba(255,255,255,0.04)' }}
              >
                {/* Top accent line */}
                <div className="absolute top-0 left-0 right-0 h-px transition-opacity duration-500"
                  style={{ background: `linear-gradient(90deg, transparent, ${risk.color}30, transparent)` }} />

                {/* Hover glow corner */}
                <div className="absolute -top-20 -right-20 w-48 h-48 rounded-full blur-[60px] opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
                  style={{ background: `${risk.color}0a` }} />

                <div className="relative z-10">
                  <div className="flex items-start justify-between mb-5">
                    <div className="w-12 h-12 rounded-[14px] flex items-center justify-center transition-all duration-300"
                      style={{ background: `${risk.color}08`, border: `1px solid ${risk.color}15` }}>
                      <risk.icon className="w-5 h-5" style={{ color: risk.color }} />
                    </div>
                    <div className="flex items-center gap-1.5">
                      {/* Stat badge */}
                      <div className="text-right">
                        <p className="text-lg font-black font-mono" style={{ color: risk.color }}>{risk.stat}</p>
                        <p className="text-[8px] text-white/20 uppercase tracking-wider">{risk.statLabel}</p>
                      </div>
                      <ArrowUpRight className="w-4 h-4 text-white/10 group-hover:text-white/50 transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5 ml-2" />
                    </div>
                  </div>

                  <h3 className="font-display font-bold text-lg text-white mb-2 tracking-tight group-hover:text-white transition-colors">
                    {risk.title}
                  </h3>
                  <p className="text-white/35 text-[13px] leading-relaxed group-hover:text-white/45 transition-colors">
                    {risk.description}
                  </p>

                  <div className="mt-6 flex items-center gap-2 text-[12px] font-medium text-white/20 group-hover:text-white/60 transition-colors">
                    <TrendingUp className="w-3.5 h-3.5" />
                    <span>Explore data</span>
                    <ArrowUpRight className="w-3 h-3" />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
