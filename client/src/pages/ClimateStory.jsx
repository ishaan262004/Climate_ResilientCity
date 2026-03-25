/**
 * ClimateStory.jsx — Futuristic AI Climate Storytelling Page
 * Template-based narrative assembled from live weather/risk data.
 * No Gemini dependency — uses intelligent template fragments.
 * Features: floating glass cards, parallax, TTS, ambient particles.
 */
import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import {
  CloudRain, Flame, Wind, BookOpen, Play, Square,
  RefreshCw, Sparkles, MapPin, Shield, AlertTriangle, Zap,
} from 'lucide-react';
import { fetchClimateRisk } from '../services/climateRiskApi';

// ─── Story fragment templates based on conditions ────────────────────────────
const INTROS = {
  Low: [
    (c) => `${c.city} breathes easy today. Under a sky measured at ${c.temp}°C, the city hums with a quiet resilience that speaks of urban planning done right.`,
    (c) => `A gentle calm settles over ${c.city}. With temperatures holding at ${c.temp}°C and humidity at ${c.humidity}%, the metropolis enjoys a rare moment of climatic peace.`,
  ],
  Medium: [
    (c) => `${c.city} sits at a crossroads today. At ${c.temp}°C with ${c.humidity}% humidity, the city's climate pulse quickens — a reminder that vigilance is the price of safety.`,
    (c) => `Caution ripples through ${c.city}. The thermometer reads ${c.temp}°C, and the air — with an AQI of ${c.aqi} — carries whispers of challenges ahead.`,
  ],
  High: [
    (c) => `${c.city} is under siege. At ${c.temp}°C and an alarming AQI of ${c.aqi}, the city's 20 million residents face a climate emergency that demands immediate action.`,
    (c) => `A crisis unfolds across ${c.city}. Temperatures soar to ${c.temp}°C, humidity presses at ${c.humidity}%, and the air quality index has breached ${c.aqi} — every breath is a gamble.`,
  ],
};

const FLOOD_FRAGMENTS = {
  Low:  (c) => `The drainage systems rest easy with only ${c.rainfall}mm of rainfall recorded. Flood risk remains minimal, a testament to the city's infrastructure holding firm.`,
  Medium: (c) => `With ${c.rainfall}mm of rain and rising humidity at ${c.humidity}%, waterlogging has begun in low-lying areas. Emergency services are on standby.`,
  High: (c) => `Catastrophic rainfall of ${c.rainfall}mm is overwhelming drainage networks. Flood waters threaten neighborhoods, and evacuation routes are being activated.`,
};

const HEAT_FRAGMENTS = {
  Low:  (c) => `Temperatures remain comfortable at ${c.temp}°C. The heat index sits at a manageable level, and outdoor activities continue without concern.`,
  Medium: (c) => `At ${c.temp}°C, the heat is building. Sensitive groups — the elderly, children, outdoor workers — should seek shade and stay hydrated through peak hours.`,
  High: (c) => `A punishing ${c.temp}°C has transformed streets into furnaces. Heat stroke cases are rising, hospitals are bracing, and authorities urge everyone to stay indoors.`,
};

const POLLUTION_FRAGMENTS = {
  Low:  (c) => `Air quality stands at an AQI of ${c.aqi} — within safe limits. Lungs breathe freely today, a gift increasingly rare in India's urban landscape.`,
  Medium: (c) => `The AQI has climbed to ${c.aqi}, pushing into unhealthy territory. Masks are advised for sensitive individuals, and outdoor exercise should be reconsidered.`,
  High: (c) => `At AQI ${c.aqi}, a toxic haze blankets the skyline. Visibility drops, respiratory emergencies spike, and the very act of breathing becomes a health risk.`,
};

const OUTLOOK = {
  Low:  (c) => `Looking ahead, ${c.city} is well-positioned. With a resilience score of ${c.resScore}/100 (Grade ${c.resGrade}), the next 48 hours look manageable. Stay informed, stay prepared.`,
  Medium: (c) => `The next 24-48 hours demand attention. ${c.city}'s resilience score of ${c.resScore}/100 suggests the city can cope, but citizens must remain alert and follow advisories.`,
  High: (c) => `The outlook is concerning. Despite a resilience score of ${c.resScore}/100, the compounding risks make the next 48 hours critical. Follow all emergency protocols and stay safe.`,
};

function buildNarrative(data) {
  const ctx = {
    city: data.city,
    temp: data.weather.temperature,
    humidity: data.weather.humidity,
    rainfall: data.weather.rainfall,
    aqi: data.weather.aqi,
    resScore: data.resilience.score,
    resGrade: data.resilience.grade,
  };

  // Determine worst risk
  const risks = [data.risk.flood.risk, data.risk.heatwave.risk, data.risk.pollution.risk];
  const overallSeverity = risks.includes('High') ? 'High' : risks.includes('Medium') ? 'Medium' : 'Low';

  const introArr = INTROS[overallSeverity];
  const intro = introArr[Math.floor(Math.random() * introArr.length)](ctx);
  const flood = FLOOD_FRAGMENTS[data.risk.flood.risk](ctx);
  const heat = HEAT_FRAGMENTS[data.risk.heatwave.risk](ctx);
  const pollution = POLLUTION_FRAGMENTS[data.risk.pollution.risk](ctx);
  const outlook = OUTLOOK[overallSeverity](ctx);

  return { intro, flood, heat, pollution, outlook, severity: overallSeverity };
}

// ─── Ambient floating particles ──────────────────────────────────────────────
function AmbientParticles() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {Array.from({ length: 20 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 rounded-full bg-emerald-500/20"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, -30 - Math.random() * 40, 0],
            x: [0, (Math.random() - 0.5) * 20, 0],
            opacity: [0.1, 0.4, 0.1],
          }}
          transition={{
            duration: 4 + Math.random() * 4,
            repeat: Infinity,
            delay: Math.random() * 3,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  );
}

// ─── Floating narrative card ─────────────────────────────────────────────────
function FloatingCard({ icon: Icon, title, text, color, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40, rotateX: 8 }}
      whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.8, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
      whileHover={{ y: -8, transition: { duration: 0.3 } }}
      className="relative group"
      style={{ perspective: 1000 }}
    >
      <div
        className="relative rounded-[24px] p-7 overflow-hidden cursor-default"
        style={{
          background: 'rgba(255,255,255,0.02)',
          backdropFilter: 'blur(24px) saturate(130%)',
          border: `1px solid ${color}18`,
        }}
      >
        {/* Top accent */}
        <div className="absolute top-0 left-0 right-0 h-px"
          style={{ background: `linear-gradient(90deg, transparent, ${color}40, transparent)` }} />

        {/* Ambient corner glow */}
        <div className="absolute -top-12 -right-12 w-40 h-40 rounded-full blur-[80px] opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
          style={{ background: `${color}15` }} />

        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ background: `${color}0a`, border: `1px solid ${color}20` }}>
            <Icon className="w-5 h-5" style={{ color }} />
          </div>
          <h3 className="text-sm font-semibold text-white tracking-tight">{title}</h3>
        </div>
        <p className="text-[13px] text-white/55 leading-[1.85] font-light italic">
          "{text}"
        </p>
      </div>
    </motion.div>
  );
}

// ─── Main page ───────────────────────────────────────────────────────────────
export default function ClimateStory() {
  const [city, setCity] = useState('Delhi');
  const [inputCity, setInputCity] = useState('Delhi');
  const [data, setData] = useState(null);
  const [narrative, setNarrative] = useState(null);
  const [loading, setLoading] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const containerRef = useRef(null);

  const { scrollYProgress } = useScroll({ target: containerRef, offset: ['start start', 'end end'] });
  const bgY = useTransform(scrollYProgress, [0, 1], [0, -100]);

  const loadStory = useCallback(async (targetCity) => {
    setLoading(true);
    try {
      const risk = await fetchClimateRisk(targetCity);
      setData(risk);
      setNarrative(buildNarrative(risk));
      setCity(targetCity);
    } catch (e) {
      setNarrative(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadStory('Delhi'); }, [loadStory]);

  // TTS
  function toggleSpeech() {
    if (speaking) { window.speechSynthesis.cancel(); setSpeaking(false); return; }
    if (!narrative) return;
    const fullText = `${narrative.intro} ${narrative.flood} ${narrative.heat} ${narrative.pollution} ${narrative.outlook}`;
    const u = new SpeechSynthesisUtterance(fullText);
    u.rate = 0.92; u.pitch = 1.05;
    u.onend = () => setSpeaking(false);
    u.onerror = () => setSpeaking(false);
    window.speechSynthesis.speak(u);
    setSpeaking(true);
  }

  useEffect(() => () => window.speechSynthesis.cancel(), []);

  const severityColor = { Low: '#22c55e', Medium: '#eab308', High: '#ef4444' };
  const sc = narrative ? severityColor[narrative.severity] : '#22c55e';

  return (
    <main ref={containerRef} className="min-h-screen pt-20 relative overflow-hidden">
      {/* Ambient background */}
      <AmbientParticles />
      <motion.div className="absolute inset-0 pointer-events-none" style={{ y: bgY }}>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1200px] h-[600px] rounded-full blur-[250px] opacity-10"
          style={{ background: `radial-gradient(ellipse, ${sc}, transparent 65%)` }} />
        <div className="absolute top-40 right-1/4 w-[400px] h-[300px] rounded-full blur-[180px] opacity-[0.06]"
          style={{ background: 'radial-gradient(ellipse, #06b6d4, transparent 65%)' }} />
      </motion.div>

      {/* Hero */}
      <section className="section-padding pb-8 relative">
        <div className="container-custom text-center">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            <div className="inline-flex items-center gap-2 bg-white/[0.03] border border-white/[0.06] px-5 py-2 rounded-full mb-7 backdrop-blur-sm">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-[11px] text-white/40 tracking-widest uppercase font-medium">AI Climate Storytelling</span>
            </div>
            <h1 className="font-display font-black text-4xl sm:text-6xl lg:text-7xl text-white mb-5 tracking-tight leading-[1.05]">
              Climate <span className="text-gradient-green-cyan">Narratives</span>
            </h1>
            <motion.p
              initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.6 }}
              className="text-white/30 max-w-2xl mx-auto text-base leading-relaxed mb-10 font-light"
            >
              Live weather and risk data transformed into immersive stories. Understand your city's climate through narrative — not just numbers.
            </motion.p>

            {/* City search */}
            <div className="w-full max-w-md mx-auto flex gap-2">
              <div className="flex-1 relative">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                <input
                  type="text" value={inputCity}
                  onChange={(e) => setInputCity(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && loadStory(inputCity.trim())}
                  placeholder="Enter city…"
                  className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-white/[0.03] border border-white/[0.06] focus:border-emerald-500/30 focus:outline-none text-white placeholder-white/20 text-sm transition-all"
                />
              </div>
              <button
                onClick={() => loadStory(inputCity.trim())}
                disabled={loading}
                className="px-6 py-3.5 rounded-2xl text-black text-sm font-bold transition-all active:scale-95 disabled:opacity-50"
                style={{ background: 'linear-gradient(135deg, #22c55e, #16a34a)', boxShadow: '0 0 12px rgba(34,197,94,0.25)' }}
              >
                {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : 'Generate'}
              </button>
            </div>

            {/* Controls */}
            {narrative && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center justify-center gap-3 mt-6">
                <button
                  onClick={toggleSpeech}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-medium transition-all ${
                    speaking
                      ? 'bg-red-500/15 border border-red-500/25 text-red-400'
                      : 'bg-white/[0.03] border border-white/[0.06] text-white/40 hover:text-emerald-400 hover:border-emerald-500/20'
                  }`}
                >
                  {speaking ? <Square className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                  {speaking ? 'Stop Narration' : 'Play Story'}
                </button>
                <button
                  onClick={() => loadStory(city)}
                  disabled={loading}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06] text-white/40 hover:text-emerald-400 hover:border-emerald-500/20 text-xs font-medium transition-all"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} /> Regenerate
                </button>
              </motion.div>
            )}
          </motion.div>
        </div>
      </section>

      {/* Loading skeleton */}
      {loading && (
        <section className="container-custom px-4 mb-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {[0,1,2,3].map(i => (
              <div key={i} className="rounded-[24px] p-7 animate-pulse" style={{ background: 'rgba(255,255,255,0.015)', border: '1px solid rgba(255,255,255,0.03)' }}>
                <div className="flex gap-3 mb-4"><div className="w-10 h-10 rounded-xl bg-white/[0.03]" /><div className="h-4 w-32 bg-white/[0.03] rounded" /></div>
                <div className="space-y-2"><div className="h-3 w-full bg-white/[0.03] rounded" /><div className="h-3 w-[90%] bg-white/[0.03] rounded" /><div className="h-3 w-[70%] bg-white/[0.03] rounded" /></div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Narrative cards — floating layout */}
      {narrative && !loading && (
        <section className="container-custom px-4 pb-8">
          {/* Intro — full width */}
          <div className="max-w-4xl mx-auto mb-8">
            <FloatingCard
              icon={BookOpen}
              title={`${city} — Climate Overview`}
              text={narrative.intro}
              color={sc}
              delay={0}
            />
          </div>

          {/* Risk cards — 2-column grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto mb-8">
            <FloatingCard icon={CloudRain} title="Flood Situation" text={narrative.flood} color="#3b82f6" delay={0.1} />
            <FloatingCard icon={Flame} title="Heat Conditions" text={narrative.heat} color="#ef4444" delay={0.2} />
            <FloatingCard icon={Wind} title="Air Quality" text={narrative.pollution} color="#a855f7" delay={0.3} />
            <FloatingCard icon={Shield} title="48-Hour Outlook" text={narrative.outlook} color="#06b6d4" delay={0.4} />
          </div>

          {/* Weather data bar */}
          {data && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="max-w-4xl mx-auto"
            >
              <div className="flex flex-wrap gap-2 justify-center mb-4">
                {[
                  { label: 'Temperature', value: `${data.weather.temperature}°C` },
                  { label: 'Humidity', value: `${data.weather.humidity}%` },
                  { label: 'Rainfall', value: `${data.weather.rainfall}mm` },
                  { label: 'AQI', value: data.weather.aqi },
                  { label: 'Resilience', value: `${data.resilience.score}/100` },
                ].map(({ label, value }) => (
                  <div key={label} className="flex items-center gap-2 bg-white/[0.02] border border-white/[0.04] rounded-full px-4 py-1.5 backdrop-blur-sm">
                    <span className="text-[9px] text-white/20 uppercase tracking-[0.12em] font-medium">{label}</span>
                    <span className="text-[12px] font-semibold text-white font-mono">{value}</span>
                  </div>
                ))}
              </div>
              <p className="text-center text-[10px] text-white/15 flex items-center justify-center gap-1.5">
                <Zap className="w-3 h-3" /> Narrative generated from real-time climate data
              </p>
            </motion.div>
          )}
        </section>
      )}
    </main>
  );
}
