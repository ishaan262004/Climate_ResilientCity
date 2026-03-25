/**
 * SafetyPlanSection.jsx — AI Action Plan Generator
 * Generates step-by-step climate safety advice based on current AQI & weather.
 * Premium futuristic UI with glassmorphism, animated steps, typed output.
 */
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Sparkles, AlertTriangle, Sun, Wind, Droplets, Timer, Heart, MapPin, Eye, Loader2, ChevronRight } from 'lucide-react';

// Safety plan templates based on AQI levels and conditions
const generateSafetyPlan = (aqi, weather = {}) => {
  const aqiNum = typeof aqi === 'number' ? aqi : 150;
  const temp = weather?.temp || 35;
  const humidity = weather?.humidity || 60;

  const plans = [];

  // AQI-based advice
  if (aqiNum > 300) {
    plans.push(
      { icon: AlertTriangle, color: '#ef4444', title: 'Emergency Alert', text: 'Stay indoors at all times. AQI is hazardous. Close all windows and doors immediately.', priority: 'critical' },
      { icon: Wind, color: '#a855f7', title: 'Air Purification', text: 'Run air purifiers on maximum. If unavailable, use wet towels on windows to filter incoming air.', priority: 'critical' },
      { icon: Shield, color: '#3b82f6', title: 'Mask Required', text: 'If you must go outside, wear N95/KN95 mask. Surgical masks are NOT effective against PM2.5.', priority: 'high' },
      { icon: Heart, color: '#ec4899', title: 'Health Watch', text: 'Monitor for cough, breathlessness, eye irritation. Seek immediate medical help if chest pain occurs.', priority: 'high' },
      { icon: Timer, color: '#f97316', title: 'Limit Exposure', text: 'Outdoor activity should be zero. If unavoidable, limit to under 15 minutes.', priority: 'high' },
      { icon: Eye, color: '#06b6d4', title: 'Monitor AQI', text: 'Check AQI every 2 hours. Conditions can change rapidly. Plan indoor activities for the next 48 hours.', priority: 'medium' },
    );
  } else if (aqiNum > 200) {
    plans.push(
      { icon: AlertTriangle, color: '#f97316', title: 'Very Unhealthy — Stay Alert', text: 'Reduce outdoor activity significantly. Sensitive groups should stay indoors entirely.', priority: 'high' },
      { icon: Shield, color: '#3b82f6', title: 'Wear N95 Outdoors', text: 'Use N95 masks when outside. Avoid morning walks and evening jogs — peak pollution hours.', priority: 'high' },
      { icon: Wind, color: '#a855f7', title: 'Ventilation Tips', text: 'Keep windows closed from 6-10 AM and 5-9 PM. Brief ventilation at midday when AQI dips.', priority: 'medium' },
      { icon: Heart, color: '#ec4899', title: 'Hydrate & Breathe', text: 'Drink warm water with tulsi or ginger. Steam inhalation twice daily helps clear airways.', priority: 'medium' },
      { icon: MapPin, color: '#22c55e', title: 'Avoid Traffic Zones', text: 'Stay away from heavy traffic areas — ITO, Anand Vihar, Mundka. Pollution is 3-4x higher near roads.', priority: 'medium' },
    );
  } else if (aqiNum > 100) {
    plans.push(
      { icon: Shield, color: '#eab308', title: 'Moderate Caution', text: 'Sensitive individuals (children, elderly, asthma) should reduce prolonged outdoor exertion.', priority: 'medium' },
      { icon: Timer, color: '#f97316', title: 'Best Hours', text: 'Exercise between 11 AM - 3 PM when pollution levels typically dip. Avoid early morning outdoor activity.', priority: 'medium' },
      { icon: Wind, color: '#3b82f6', title: 'Natural Ventilation', text: 'Open windows between 12-3 PM for fresh air. Use indoor plants (money plant, aloe vera) for air purification.', priority: 'low' },
      { icon: Eye, color: '#06b6d4', title: 'Stay Informed', text: 'Monitor AQI trends. If rising, prepare to limit outdoor time and stock up on essentials.', priority: 'low' },
    );
  } else {
    plans.push(
      { icon: Shield, color: '#22c55e', title: 'Air Quality Good', text: 'Safe for all outdoor activities. Great day for exercise, walks, and outdoor events.', priority: 'low' },
      { icon: Sun, color: '#eab308', title: 'Enjoy Outdoors', text: 'Take advantage of good air quality. This is ideal for cycling, running, and park visits.', priority: 'low' },
      { icon: Heart, color: '#ec4899', title: 'Preventive Care', text: 'Stay hydrated. Use sunscreen if UV index is high. Maintain regular exercise routine.', priority: 'low' },
    );
  }

  // Temperature-based additions
  if (temp > 40) {
    plans.push(
      { icon: Sun, color: '#ef4444', title: 'Heat Alert', text: `Temperature is ${temp}°C. Avoid outdoors 12-4 PM. Carry ORS sachets. Watch for heat exhaustion symptoms.`, priority: 'critical' },
      { icon: Droplets, color: '#06b6d4', title: 'Hydration Critical', text: 'Drink 3-4 liters of water daily. Avoid tea/coffee during peak heat. Eat water-rich fruits.', priority: 'high' },
    );
  } else if (temp > 35) {
    plans.push(
      { icon: Sun, color: '#f97316', title: 'High Temperature', text: `Temperature is ${temp}°C. Wear light, loose clothing. Use sunscreen. Stay in shade during 12-3 PM.`, priority: 'medium' },
    );
  }

  return plans.sort((a, b) => {
    const p = { critical: 0, high: 1, medium: 2, low: 3 };
    return (p[a.priority] || 3) - (p[b.priority] || 3);
  });
};

const priorityStyles = {
  critical: { bg: 'rgba(239,68,68,0.06)', border: 'rgba(239,68,68,0.12)', badge: '#ef4444' },
  high: { bg: 'rgba(249,115,22,0.04)', border: 'rgba(249,115,22,0.10)', badge: '#f97316' },
  medium: { bg: 'rgba(234,179,8,0.03)', border: 'rgba(234,179,8,0.08)', badge: '#eab308' },
  low: { bg: 'rgba(34,197,94,0.03)', border: 'rgba(34,197,94,0.08)', badge: '#22c55e' },
};

export default function SafetyPlanSection({ aqi, weather }) {
  const [plan, setPlan] = useState(null);
  const [generating, setGenerating] = useState(false);
  const [visibleSteps, setVisibleSteps] = useState(0);
  const containerRef = useRef(null);

  const handleGenerate = () => {
    setGenerating(true);
    setPlan(null);
    setVisibleSteps(0);

    // Simulate AI processing
    setTimeout(() => {
      const result = generateSafetyPlan(aqi, weather);
      setPlan(result);
      setGenerating(false);

      // Stagger reveal steps
      result.forEach((_, i) => {
        setTimeout(() => setVisibleSteps(v => v + 1), (i + 1) * 200);
      });
    }, 1200);
  };

  return (
    <section className="section-padding pt-0">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="rounded-[22px] overflow-hidden relative"
          style={{ background: 'rgba(255,255,255,0.015)', border: '1px solid rgba(255,255,255,0.04)' }}
        >
          {/* Top accent */}
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-500/25 to-transparent z-10" />

          {/* Ambient orb */}
          <div className="absolute top-0 right-0 w-[300px] h-[200px] rounded-full blur-[120px] opacity-[0.04] pointer-events-none"
            style={{ background: 'radial-gradient(ellipse, #06b6d4, transparent 60%)' }} />

          <div className="p-7 sm:p-9" ref={containerRef}>
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-7">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 rounded-[10px] flex items-center justify-center"
                    style={{ background: 'rgba(6,182,212,0.08)', border: '1px solid rgba(6,182,212,0.15)' }}>
                    <Shield className="w-4 h-4 text-cyan-400" />
                  </div>
                  <span className="text-[10px] text-white/25 uppercase tracking-[0.15em] font-medium">AI Safety Intelligence</span>
                </div>
                <h3 className="font-display font-bold text-2xl text-white tracking-tight">
                  Action <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">Plan</span>
                </h3>
                <p className="text-[12px] text-white/25 mt-1">Personalized safety recommendations based on live conditions</p>
              </div>

              <motion.button
                whileTap={{ scale: 0.96 }}
                onClick={handleGenerate}
                disabled={generating}
                className="px-6 py-3 rounded-[14px] font-semibold text-sm flex items-center gap-2.5 transition-all duration-300 disabled:opacity-50 self-start"
                style={{
                  background: generating ? 'rgba(6,182,212,0.06)' : 'linear-gradient(135deg, #06b6d4, #3b82f6)',
                  color: generating ? '#06b6d4' : '#000',
                  border: generating ? '1px solid rgba(6,182,212,0.15)' : 'none',
                  boxShadow: generating ? 'none' : '0 0 20px rgba(6,182,212,0.2)',
                }}
              >
                {generating ? (
                  <><Loader2 className="w-4 h-4 animate-spin" /> Analyzing…</>
                ) : (
                  <><Sparkles className="w-4 h-4" /> Generate Safety Plan</>
                )}
              </motion.button>
            </div>

            {/* Plan output */}
            <AnimatePresence>
              {plan && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-3"
                >
                  {plan.map((step, i) => {
                    const style = priorityStyles[step.priority] || priorityStyles.medium;
                    const Icon = step.icon;
                    return (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -20 }}
                        animate={i < visibleSteps ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
                        transition={{ duration: 0.3, ease: 'easeOut' }}
                        className="flex items-start gap-4 rounded-[16px] p-5 group"
                        style={{ background: style.bg, border: `1px solid ${style.border}` }}
                      >
                        {/* Step number */}
                        <div className="flex flex-col items-center gap-1 flex-shrink-0">
                          <span className="text-[9px] font-black text-white/15 font-mono">{String(i + 1).padStart(2, '0')}</span>
                          <div className="w-9 h-9 rounded-[10px] flex items-center justify-center"
                            style={{ background: `${step.color}10`, border: `1px solid ${step.color}18` }}>
                            <Icon className="w-4 h-4" style={{ color: step.color }} />
                          </div>
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1.5">
                            <h4 className="text-sm font-semibold text-white">{step.title}</h4>
                            <span className="text-[8px] uppercase tracking-[0.12em] font-bold px-2 py-0.5 rounded-full"
                              style={{ background: `${style.badge}12`, color: style.badge }}>
                              {step.priority}
                            </span>
                          </div>
                          <p className="text-[12px] text-white/40 leading-relaxed">{step.text}</p>
                        </div>

                        <ChevronRight className="w-4 h-4 text-white/8 flex-shrink-0 mt-1" />
                      </motion.div>
                    );
                  })}

                  {/* Disclaimer */}
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: plan.length * 0.2 + 0.3 }}
                    className="text-[10px] text-white/15 text-center pt-3"
                  >
                    Generated based on current AQI ({aqi || 'N/A'}) and weather conditions. For medical emergencies, contact 112.
                  </motion.p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Empty state */}
            {!plan && !generating && (
              <div className="text-center py-8">
                <div className="w-14 h-14 rounded-2xl mx-auto mb-4 flex items-center justify-center"
                  style={{ background: 'rgba(6,182,212,0.04)', border: '1px solid rgba(6,182,212,0.08)' }}>
                  <Shield className="w-6 h-6 text-cyan-400/30" />
                </div>
                <p className="text-[12px] text-white/20">Click "Generate Safety Plan" for AI-powered safety recommendations</p>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
