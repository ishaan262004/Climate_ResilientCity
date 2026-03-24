import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Flame, ArrowLeft, Thermometer, Shield, AlertTriangle, Users, Building2, Leaf } from 'lucide-react';

const stats = [
  { value: '47°C+', label: 'Peak Temperature', icon: Thermometer },
  { value: '200+', label: 'Heat Deaths/Year', icon: AlertTriangle },
  { value: '3-5°C', label: 'Urban Heat Island Effect', icon: Building2 },
];

const impacts = [
  'Heat stroke and dehydration in outdoor workers',
  'Increased mortality among elderly and children',
  'Power grid failures due to peak AC demand',
  'Water scarcity as demand spikes',
  'Reduced agricultural productivity',
  'Mental health impacts from prolonged heat stress',
];

const solutions = [
  { title: 'Cool Roofs', desc: 'Reflective roof coatings reduce indoor temperatures by 3-5°C, cutting AC use significantly.' },
  { title: 'Urban Forests', desc: 'Strategic tree planting creates natural cooling zones. A single tree can cool the area around it by 2-9°C.' },
  { title: 'Early Warning Systems', desc: 'Heat action plans with color-coded alerts help communities prepare 72 hours in advance.' },
  { title: 'Water Infrastructure', desc: 'Public drinking water stations and misting fans in high-traffic areas reduce heat casualties.' },
];

export default function Heatwaves() {
  return (
    <div className="min-h-screen pt-20">
      {/* Hero */}
      <section className="relative section-padding overflow-hidden">
        {/* Heat glow effect */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-b from-orange-500/10 via-red-500/5 to-transparent rounded-full blur-[100px] pointer-events-none" />
        
        <div className="container-custom relative">
          <Link to="/" className="inline-flex items-center gap-2 text-sm text-white/40 hover:text-white mb-8 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </Link>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="inline-flex items-center gap-2 glass px-4 py-2 rounded-full mb-6">
              <Flame className="w-4 h-4 text-orange-400" />
              <span className="text-xs text-white/60">Climate Risk: Extreme Heat</span>
            </div>
            <h1 className="font-display font-black text-4xl sm:text-6xl lg:text-7xl text-white mb-6">
              Heatwaves in <span className="text-orange-400">Delhi</span>
            </h1>
            <p className="text-white/60 text-lg max-w-3xl leading-relaxed">
              Delhi is one of the fastest-warming cities globally. Extreme heat events are becoming more frequent, 
              lasting longer, and reaching higher temperatures — putting millions of lives at risk every summer.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="rounded-2xl bg-gradient-to-br from-orange-500/10 to-transparent border border-orange-500/10 p-6 text-center"
              >
                <stat.icon className="w-8 h-8 text-orange-400 mx-auto mb-3" />
                <p className="font-display font-black text-3xl text-white mb-1">{stat.value}</p>
                <p className="text-white/40 text-sm">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Impacts */}
      <section className="section-padding">
        <div className="container-custom">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-display font-bold text-3xl text-white mb-8"
          >
            Health & Social <span className="text-orange-400">Impacts</span>
          </motion.h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {impacts.map((impact, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="flex items-start gap-3 glass rounded-xl p-4"
              >
                <AlertTriangle className="w-5 h-5 text-orange-400 flex-shrink-0 mt-0.5" />
                <p className="text-white/70 text-sm">{impact}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Solutions */}
      <section className="section-padding">
        <div className="container-custom">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-display font-bold text-3xl text-white mb-8"
          >
            Resilience <span className="text-resilient-green">Solutions</span>
          </motion.h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {solutions.map((sol, i) => (
              <motion.div
                key={sol.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="glass-green rounded-2xl p-6"
              >
                <h3 className="font-display font-semibold text-lg text-white mb-2">{sol.title}</h3>
                <p className="text-white/50 text-sm leading-relaxed">{sol.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
