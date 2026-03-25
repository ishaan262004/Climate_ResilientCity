/**
 * StoryPanel.jsx — AI Climate Storytelling with Animated Text Reveal
 * Premium "AI insight" card with Play/Regenerate, gradient background, typewriter effect.
 */
import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Play, Square, RefreshCw, Sparkles } from 'lucide-react';
import { fetchClimateStory } from '../../services/climateRiskApi';

export default function StoryPanel({ city = 'Delhi', delay = 0 }) {
  const [story, setStory] = useState('');
  const [displayedText, setDisplayedText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [speaking, setSpeaking] = useState(false);
  const [isRevealing, setIsRevealing] = useState(false);
  const utteranceRef = useRef(null);

  useEffect(() => { loadStory(city); }, [city]);

  // Typewriter text reveal
  useEffect(() => {
    if (!story) return;
    setIsRevealing(true);
    setDisplayedText('');
    let i = 0;
    const interval = setInterval(() => {
      if (i < story.length) {
        setDisplayedText(story.slice(0, i + 1));
        i++;
      } else {
        clearInterval(interval);
        setIsRevealing(false);
      }
    }, 12);
    return () => clearInterval(interval);
  }, [story]);

  async function loadStory(targetCity) {
    setLoading(true);
    setError(null);
    setDisplayedText('');
    try {
      const data = await fetchClimateStory(targetCity);
      setStory(data.story || data.fallback || '');
    } catch (err) {
      setError('AI storytelling unavailable.');
      setStory(`${targetCity} faces dynamic climate challenges. Conditions are being monitored in real-time to ensure community safety and resilience.`);
    } finally {
      setLoading(false);
    }
  }

  function toggleSpeech() {
    if (speaking) {
      window.speechSynthesis.cancel();
      setSpeaking(false);
      return;
    }
    if (!story) return;
    const utterance = new SpeechSynthesisUtterance(story);
    utterance.rate = 0.95;
    utterance.pitch = 1.0;
    utterance.onend = () => setSpeaking(false);
    utterance.onerror = () => setSpeaking(false);
    utteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
    setSpeaking(true);
  }

  useEffect(() => () => window.speechSynthesis.cancel(), []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="relative rounded-[20px] overflow-hidden group"
    >
      {/* Multi-layer gradient background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-950/30 via-black to-cyan-950/15" />
        <div className="absolute top-0 right-0 w-80 h-60 rounded-full blur-[120px] opacity-[0.08]"
          style={{ background: 'radial-gradient(circle, #22c55e, transparent)' }} />
        <div className="absolute bottom-0 left-0 w-60 h-40 rounded-full blur-[100px] opacity-[0.05]"
          style={{ background: 'radial-gradient(circle, #06b6d4, transparent)' }} />
      </div>

      {/* Border */}
      <div className="absolute inset-0 rounded-[20px] border border-emerald-500/[0.08] pointer-events-none" />
      {/* Top accent line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-emerald-500/25 to-transparent pointer-events-none" />

      <div className="relative p-7">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{
                background: 'rgba(34,197,94,0.06)',
                border: '1px solid rgba(34,197,94,0.12)',
              }}>
              <Sparkles className="w-4.5 h-4.5 text-emerald-400" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                AI Climate Story
                <span className="text-[8px] px-2 py-0.5 rounded-full font-bold tracking-widest uppercase"
                  style={{
                    background: 'linear-gradient(135deg, rgba(34,197,94,0.12), rgba(6,182,212,0.08))',
                    color: '#4ade80',
                    border: '1px solid rgba(34,197,94,0.15)',
                  }}>
                  Gemini
                </span>
              </h3>
              <p className="text-[10px] text-white/25 mt-0.5">Powered by Google Gemini AI</p>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <button
              onClick={toggleSpeech}
              disabled={loading || !story}
              title={speaking ? 'Stop narration' : 'Play story aloud'}
              className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-300 ${
                speaking
                  ? 'bg-red-500/15 border border-red-500/25 text-red-400 shadow-[0_0_15px_rgba(239,68,68,0.1)]'
                  : 'bg-white/[0.03] border border-white/[0.06] text-white/30 hover:text-emerald-400 hover:border-emerald-500/20 hover:bg-emerald-500/[0.04]'
              }`}
            >
              {speaking ? <Square className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            </button>
            <button
              onClick={() => loadStory(city)}
              disabled={loading}
              title="Regenerate story"
              className="w-9 h-9 rounded-xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-center text-white/30 hover:text-emerald-400 hover:border-emerald-500/20 hover:bg-emerald-500/[0.04] transition-all duration-300"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        {/* Story content */}
        {loading ? (
          <div className="space-y-3">
            {[100, 95, 88, 72, 80].map((w, i) => (
              <div key={i} className="skeleton-shimmer rounded" style={{ height: '12px', width: `${w}%`, background: 'rgba(255,255,255,0.03)' }} />
            ))}
          </div>
        ) : (
          <div className="relative">
            <BookOpen className="w-5 h-5 text-emerald-500/15 absolute -left-0.5 -top-0.5 pointer-events-none" />
            <p className="text-[13px] text-white/60 leading-[1.9] pl-7 italic font-light">
              "{displayedText}"
              {isRevealing && (
                <span className="inline-block w-0.5 h-4 bg-emerald-400/60 animate-pulse ml-0.5 align-middle" />
              )}
            </p>
          </div>
        )}

        {error && (
          <p className="text-[10px] text-yellow-400/50 mt-3">Note: Using fallback narrative — {error}</p>
        )}

        {/* Footer */}
        <div className="mt-6 flex items-center gap-2 text-[10px] text-white/15">
          <div className="w-1 h-1 rounded-full bg-emerald-500/30" />
          <span>AI-generated narrative using real-time climate data</span>
        </div>
      </div>
    </motion.div>
  );
}
