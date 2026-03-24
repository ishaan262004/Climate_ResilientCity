import { useRef, useState } from 'react';
import { motion, useScroll, useTransform, useMotionValueEvent } from 'framer-motion';
import Earth3D from './Earth3D';
import { ArrowDown, Wind, Thermometer, Droplets } from 'lucide-react';

export default function HeroSection() {
  const containerRef = useRef(null);
  const [scrollNum, setScrollNum] = useState(0);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  });

  // Track scroll progress as a plain number for Three.js
  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    setScrollNum(v);
  });

  const textOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);
  const textY = useTransform(scrollYProgress, [0, 0.3], [0, -100]);

  return (
    <section
      ref={containerRef}
      className="relative min-h-[200vh]"
      id="hero"
    >
      {/* Sticky container for the 3D scene */}
      <div className="sticky top-0 h-screen overflow-hidden">
        {/* 3D Earth */}
        <motion.div className="absolute inset-0" style={{ opacity: useTransform(scrollYProgress, [0, 1], [1, 0.6]) }}>
          <Earth3D scrollProgress={scrollNum} />
        </motion.div>

        {/* Gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black pointer-events-none z-10" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-black/40 pointer-events-none z-10" />

        {/* Hero Content */}
        <motion.div
          className="relative z-20 flex flex-col items-center justify-center h-full px-4 text-center"
          style={{ opacity: textOpacity, y: textY }}
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="glass px-4 py-2 rounded-full mb-8 flex items-center gap-2"
          >
            <span className="w-2 h-2 bg-resilient-green rounded-full animate-pulse" />
            <span className="text-xs sm:text-sm text-white/70">Real-time Climate Monitoring</span>
          </motion.div>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="font-display font-black text-5xl sm:text-7xl lg:text-8xl xl:text-9xl leading-none mb-6"
          >
            <span className="block text-white">Resilient</span>
            <span className="block text-gradient-green">City</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.8 }}
            className="text-white/60 text-base sm:text-lg lg:text-xl max-w-2xl mb-10 leading-relaxed"
          >
            Empowering Delhi with climate intelligence. Track air quality, 
            weather patterns, and environmental risks in real-time.
          </motion.p>

          {/* Stats row */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.8 }}
            className="flex flex-wrap justify-center gap-6 sm:gap-10 mb-12"
          >
            {[
              { icon: Wind, value: '8+', label: 'AQI Stations' },
              { icon: Thermometer, value: '24/7', label: 'Monitoring' },
              { icon: Droplets, value: '100+', label: 'Reports' },
            ].map(({ icon: Icon, value, label }, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg glass-green flex items-center justify-center">
                  <Icon className="w-5 h-5 text-resilient-green" />
                </div>
                <div className="text-left">
                  <p className="font-display font-bold text-white text-lg">{value}</p>
                  <p className="text-white/40 text-xs">{label}</p>
                </div>
              </div>
            ))}
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1, duration: 0.8 }}
            className="flex flex-col sm:flex-row gap-4"
          >
            <a
              href="#dashboard"
              className="px-8 py-3.5 rounded-xl bg-resilient-green text-black font-semibold text-sm hover:bg-resilient-green-light transition-all duration-300 glow-green hover:glow-green-strong"
            >
              Explore Dashboard
            </a>
            <a
              href="#report"
              className="px-8 py-3.5 rounded-xl glass text-white font-semibold text-sm hover:bg-white/10 transition-all duration-300"
            >
              Report an Issue
            </a>
          </motion.div>

          {/* Scroll indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5, duration: 1 }}
            className="absolute bottom-8 left-1/2 -translate-x-1/2"
          >
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
              className="flex flex-col items-center gap-2"
            >
              <span className="text-xs text-white/30">Scroll to explore</span>
              <ArrowDown className="w-4 h-4 text-white/30" />
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
