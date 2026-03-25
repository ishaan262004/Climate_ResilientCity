import { useRef, useState } from 'react';
import { motion, useScroll, useTransform, useMotionValueEvent } from 'framer-motion';
import Earth3D from './Earth3D';
import { ArrowDown, ArrowRight } from 'lucide-react';

export default function HeroSection() {
  const containerRef = useRef(null);
  const [scrollNum, setScrollNum] = useState(0);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  });

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
      <div className="sticky top-0 h-screen overflow-hidden">
        {/* 3D Earth — pushed right and lower for asymmetric layout */}
        <motion.div
          className="absolute inset-0"
          style={{ opacity: useTransform(scrollYProgress, [0, 1], [1, 0.5]) }}
        >
          <Earth3D scrollProgress={scrollNum} />
        </motion.div>

        {/* Gradient overlays — stronger for text legibility */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/30 to-black pointer-events-none z-10" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-transparent to-black/50 pointer-events-none z-10" />
        {/* Extra left-side darkness for title area */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-transparent to-transparent pointer-events-none z-10" />

        {/* Hero Content */}
        <motion.div
          className="relative z-20 flex flex-col items-center justify-center h-full px-4 sm:px-8 lg:px-16"
          style={{ opacity: textOpacity, y: textY }}
        >
          <div className="max-w-5xl w-full text-center">

            {/* Eyebrow */}
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.7 }}
              className="text-[11px] sm:text-xs uppercase tracking-[0.35em] text-resilient-green/80 font-medium mb-6"
            >
              Climate Awareness Platform — Delhi, India
            </motion.p>

            {/* Title */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="font-black text-5xl sm:text-7xl lg:text-8xl xl:text-[8.5rem] leading-[0.9] tracking-tight mb-8"
            >
              <span className="block text-white drop-shadow-[0_4px_30px_rgba(0,0,0,0.8)]">
                Resilient
              </span>
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-green-400 to-teal-400 drop-shadow-[0_4px_30px_rgba(34,197,94,0.3)]">
                City
              </span>
            </motion.h1>

            {/* Tagline */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.8 }}
              className="text-white/50 text-base sm:text-lg lg:text-xl max-w-2xl mx-auto mb-5 leading-relaxed font-light"
            >
              Delhi's air is choking its future. Every breath matters.
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.85, duration: 0.7 }}
              className="text-white/30 text-sm sm:text-base max-w-xl mx-auto mb-12 leading-relaxed"
            >
              Track real-time pollution, understand the crisis, and join the movement
              to reclaim clean air for 20 million people.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.0, duration: 0.8 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <a
                href="#dashboard"
                className="group inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-white text-black font-semibold text-sm hover:bg-white/90 transition-all duration-300 shadow-[0_0_30px_rgba(255,255,255,0.08)]"
              >
                See Live AQI Data
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
              </a>
              <a
                href="#report"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-white/[0.06] border border-white/[0.08] text-white font-semibold text-sm hover:bg-white/[0.1] hover:border-white/[0.15] transition-all duration-300"
              >
                Report Pollution
              </a>
            </motion.div>
          </div>

          {/* Scroll indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.8, duration: 1 }}
            className="absolute bottom-8 left-1/2 -translate-x-1/2"
          >
            <motion.div
              animate={{ y: [0, 6, 0] }}
              transition={{ repeat: Infinity, duration: 2.5, ease: 'easeInOut' }}
              className="flex flex-col items-center gap-2"
            >
              <span className="text-[10px] uppercase tracking-[0.2em] text-white/20">Scroll</span>
              <div className="w-px h-8 bg-gradient-to-b from-white/20 to-transparent" />
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
