import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { TreePine, ArrowLeft, Droplets, Leaf, Sprout, AlertTriangle, TrendingDown } from 'lucide-react';

const issues = [
  {
    icon: Droplets,
    title: 'Water Scarcity',
    color: 'text-cyan-400',
    gradient: 'from-cyan-500/10 to-transparent',
    border: 'border-cyan-500/10',
    facts: [
      'Delhi receives 3,600 MLD water but needs 4,200 MLD — a 15% deficit',
      'Groundwater levels dropping by 1-2 meters annually in South Delhi',
      '60% of Delhi\'s water supply is wasted through leaks and theft',
      'Many colonies receive water for only 2-3 hours daily',
    ]
  },
  {
    icon: TreePine,
    title: 'Loss of Green Cover',
    color: 'text-green-400',
    gradient: 'from-green-500/10 to-transparent',
    border: 'border-green-500/10',
    facts: [
      'Over 17,000 trees felled in Delhi from 2018-2022 for development projects',
      'Delhi\'s tree cover is 20% vs the recommended minimum of 33%',
      'The Aravalli Ridge — Delhi\'s green lung — faces constant encroachment',
      'Each mature tree absorbs ~22 kg of CO₂ per year and produces oxygen for 2 people',
    ]
  },
  {
    icon: TrendingDown,
    title: 'Groundwater Depletion',
    color: 'text-blue-400',
    gradient: 'from-blue-500/10 to-transparent',
    border: 'border-blue-500/10',
    facts: [
      'Delhi extracts 4x more groundwater than is recharged naturally',
      'Water table has dropped from 3m to 20m+ in many parts of South Delhi',
      'Tubewells going dry during summer months in several areas',
      'Only 10% of Delhi\'s area has adequate rainwater harvesting infrastructure',
    ]
  },
  {
    icon: Leaf,
    title: 'Yamuna River Pollution',
    color: 'text-emerald-400',
    gradient: 'from-emerald-500/10 to-transparent',
    border: 'border-emerald-500/10',
    facts: [
      'The 22-km stretch through Delhi contributes 76% of the Yamuna\'s total pollution',
      '3,800 MLD of sewage flows into the river, most untreated',
      'Dissolved oxygen levels drop to near zero through Delhi',
      'Despite ₹8,000 crore spent on cleanup, no significant improvement',
    ]
  },
];

export default function Environment() {
  return (
    <div className="min-h-screen pt-20">
      {/* Hero */}
      <section className="relative section-padding overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-gradient-to-b from-emerald-500/10 to-transparent rounded-full blur-[100px] pointer-events-none" />
        
        <div className="container-custom relative">
          <Link to="/" className="inline-flex items-center gap-2 text-sm text-white/40 hover:text-white mb-8 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </Link>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="inline-flex items-center gap-2 glass px-4 py-2 rounded-full mb-6">
              <TreePine className="w-4 h-4 text-emerald-400" />
              <span className="text-xs text-white/60">Environmental Crisis</span>
            </div>
            <h1 className="font-display font-black text-4xl sm:text-6xl lg:text-7xl text-white mb-6">
              Environment <span className="text-emerald-400">Crisis</span>
            </h1>
            <p className="text-white/60 text-lg max-w-3xl leading-relaxed">
              Beyond air pollution, Delhi faces interconnected environmental challenges — from water scarcity 
              and groundwater depletion to loss of green cover and river pollution.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Issues */}
      <section className="section-padding">
        <div className="container-custom space-y-12">
          {issues.map((issue, i) => (
            <motion.div
              key={issue.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.6 }}
              className={`rounded-2xl bg-gradient-to-br ${issue.gradient} border ${issue.border} p-6 sm:p-8`}
            >
              <div className="flex items-center gap-3 mb-6">
                <issue.icon className={`w-8 h-8 ${issue.color}`} />
                <h2 className="font-display font-bold text-2xl text-white">{issue.title}</h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {issue.facts.map((fact, j) => (
                  <motion.div
                    key={j}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: j * 0.1 }}
                    className="flex items-start gap-3 bg-black/20 rounded-xl p-4"
                  >
                    <AlertTriangle className={`w-4 h-4 ${issue.color} flex-shrink-0 mt-0.5`} />
                    <p className="text-white/60 text-sm">{fact}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Call to Action */}
      <section className="section-padding">
        <div className="container-custom text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="glass-green rounded-2xl p-8 sm:p-12"
          >
            <Sprout className="w-12 h-12 text-resilient-green mx-auto mb-4" />
            <h2 className="font-display font-bold text-2xl sm:text-3xl text-white mb-4">
              Be Part of the Solution
            </h2>
            <p className="text-white/50 max-w-xl mx-auto mb-6">
              Every action counts. From planting trees to conserving water, 
              your choices shape Delhi's environmental future.
            </p>
            <Link
              to="/"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-resilient-green text-black font-semibold text-sm hover:bg-resilient-green-light transition-all glow-green"
            >
              Report an Issue
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
