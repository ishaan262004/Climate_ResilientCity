/**
 * AIChatbot.jsx — Premium AI Climate Assistant
 * Features: typing animation, quick suggestions, voice input,
 *           session memory, premium glassmorphism, no Gemini branding.
 */
import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, Bot, User, Sparkles, Mic, MicOff, Trash2, Loader2 } from 'lucide-react';
import { sendChatMessage, clearChatSession } from '../../services/climateRiskApi';

const SUGGESTIONS = [
  'Is it safe to go outside today?',
  'Will it rain in Delhi?',
  'What precautions should I take?',
  'Tell me about air quality',
];

function TypingIndicator() {
  return (
    <div className="flex gap-2 items-start">
      <div className="w-7 h-7 rounded-[10px] flex items-center justify-center flex-shrink-0 mt-0.5"
        style={{ background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.15)' }}>
        <Bot className="w-3.5 h-3.5 text-emerald-400" />
      </div>
      <div className="rounded-2xl rounded-bl-sm px-4 py-3" style={{ background: 'rgba(255,255,255,0.03)' }}>
        <div className="flex gap-1.5 items-center h-3">
          <span className="w-1.5 h-1.5 bg-emerald-400/60 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
          <span className="w-1.5 h-1.5 bg-emerald-400/60 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
          <span className="w-1.5 h-1.5 bg-emerald-400/60 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
        </div>
      </div>
    </div>
  );
}

export default function AIChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'bot', text: "Hey! 🌍 I'm your Climate Intelligence Assistant. Ask me about weather, air quality, climate risks, or safety tips for any city!" }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  const [city, setCity] = useState('Delhi');
  const [isListening, setIsListening] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const messagesEndRef = useRef(null);
  const recognitionRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  useEffect(() => {
    if (isOpen) setTimeout(() => inputRef.current?.focus(), 300);
  }, [isOpen]);

  const handleSend = useCallback(async (customMessage) => {
    const text = (customMessage || input).trim();
    if (!text) return;

    setMessages(prev => [...prev, { role: 'user', text }]);
    setInput('');
    setIsTyping(true);
    setShowSuggestions(false);

    try {
      const result = await sendChatMessage(text, city, sessionId);
      setSessionId(result.sessionId);
      setMessages(prev => [...prev, { role: 'bot', text: result.reply }]);
    } catch (err) {
      const fallbackReply = err?.response?.data?.reply ||
        "I'm having trouble connecting. Please try again in a moment. 🌍";
      setMessages(prev => [...prev, { role: 'bot', text: fallbackReply, isError: true }]);
    } finally {
      setIsTyping(false);
    }
  }, [input, city, sessionId]);

  const handleClear = async () => {
    if (sessionId) {
      try { await clearChatSession(sessionId); } catch (e) { /* ignore */ }
    }
    setMessages([
      { role: 'bot', text: "Chat cleared! 🧹 What would you like to know about climate conditions?" }
    ]);
    setSessionId(null);
    setShowSuggestions(true);
  };

  const toggleVoice = () => {
    if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      setMessages(prev => [...prev, { role: 'bot', text: "Voice input isn't supported in this browser. Try Chrome! 🎤" }]);
      return;
    }
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      return;
    }
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setInput(transcript);
      setIsListening(false);
      setTimeout(() => handleSend(transcript), 300);
    };
    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);
    recognitionRef.current = recognition;
    recognition.start();
    setIsListening(true);
  };

  return (
    <>
      {/* Floating button */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 1.5, type: 'spring', stiffness: 200, damping: 15 }}
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-300 active:scale-95"
        style={{
          background: isOpen ? 'rgba(255,255,255,0.06)' : 'linear-gradient(135deg, #22c55e, #16a34a)',
          border: isOpen ? '1px solid rgba(255,255,255,0.08)' : 'none',
          boxShadow: isOpen ? 'none' : '0 0 24px rgba(34,197,94,0.3), 0 4px 16px rgba(0,0,0,0.3)',
          color: isOpen ? '#fff' : '#000',
        }}
        aria-label="Open AI Climate Assistant"
        id="ai-chatbot-toggle"
      >
        {isOpen ? <X className="w-5 h-5" /> : <MessageCircle className="w-6 h-6" />}
      </motion.button>

      {/* Chat window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.92 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="fixed bottom-24 right-6 z-50 w-[390px] max-w-[calc(100vw-48px)] h-[530px] rounded-[22px] flex flex-col overflow-hidden"
            style={{
              background: 'rgba(8,8,8,0.92)',
              backdropFilter: 'blur(40px)',
              border: '1px solid rgba(255,255,255,0.06)',
              boxShadow: '0 20px 60px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.03)',
            }}
            id="ai-chatbot-window"
          >
            {/* Top accent line */}
            <div className="h-px bg-gradient-to-r from-transparent via-emerald-500/30 to-transparent" />

            {/* Header */}
            <div className="px-5 py-4 flex items-center justify-between" style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-[12px] flex items-center justify-center"
                  style={{ background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.15)' }}>
                  <Sparkles className="w-4 h-4 text-emerald-400" />
                </div>
                <div>
                  <h4 className="text-[13px] font-semibold text-white flex items-center gap-1.5">
                    Climate Assistant
                    <span className="text-[8px] px-1.5 py-0.5 rounded-full font-medium tracking-wider"
                      style={{ background: 'rgba(34,197,94,0.08)', color: '#22c55e' }}>AI</span>
                  </h4>
                  <p className="text-[10px] text-emerald-400/60 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse shadow-[0_0_4px_rgba(34,197,94,0.5)]" />
                    Online
                  </p>
                </div>
              </div>
              <button
                onClick={handleClear}
                title="Clear conversation"
                className="w-7 h-7 rounded-lg flex items-center justify-center text-white/15 hover:text-white/40 transition-all"
                style={{ background: 'rgba(255,255,255,0.02)' }}
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  className={`flex gap-2 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {msg.role === 'bot' && (
                    <div className="w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0 mt-1"
                      style={{ background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.12)' }}>
                      <Bot className="w-3 h-3 text-emerald-400" />
                    </div>
                  )}
                  <div className={`max-w-[82%] rounded-2xl px-4 py-2.5 text-[12px] leading-relaxed ${
                    msg.role === 'user'
                      ? 'rounded-br-sm font-medium text-black'
                      : `rounded-bl-sm text-white/75 ${msg.isError ? '' : ''}`
                  }`}
                    style={msg.role === 'user'
                      ? { background: 'linear-gradient(135deg, #22c55e, #16a34a)' }
                      : { background: 'rgba(255,255,255,0.03)', border: msg.isError ? '1px solid rgba(234,179,8,0.15)' : '1px solid rgba(255,255,255,0.03)' }
                    }
                  >
                    {msg.text}
                  </div>
                  {msg.role === 'user' && (
                    <div className="w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0 mt-1"
                      style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}>
                      <User className="w-3 h-3 text-white/40" />
                    </div>
                  )}
                </motion.div>
              ))}

              {isTyping && <TypingIndicator />}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick suggestions */}
            {showSuggestions && messages.length <= 2 && (
              <div className="px-4 pb-2">
                <p className="text-[9px] text-white/15 mb-2 uppercase tracking-[0.15em] font-medium">Quick questions</p>
                <div className="flex flex-wrap gap-1.5">
                  {SUGGESTIONS.map((s, i) => (
                    <button
                      key={i}
                      onClick={() => handleSend(s)}
                      className="text-[10px] px-3 py-1.5 rounded-lg text-white/30 hover:text-emerald-400 transition-all duration-200 active:scale-95"
                      style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.04)' }}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Input */}
            <form
              onSubmit={(e) => { e.preventDefault(); handleSend(); }}
              className="px-4 py-3 flex gap-2 items-center"
              style={{ borderTop: '1px solid rgba(255,255,255,0.04)' }}
            >
              <button
                type="button"
                onClick={toggleVoice}
                title={isListening ? 'Stop listening' : 'Voice input'}
                className="w-9 h-9 rounded-xl flex items-center justify-center transition-all flex-shrink-0"
                style={isListening
                  ? { background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', color: '#ef4444' }
                  : { background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.25)' }
                }
              >
                {isListening ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5" />}
              </button>

              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={isListening ? 'Listening…' : 'Ask about climate…'}
                disabled={isTyping}
                className="flex-1 rounded-xl px-4 py-2.5 text-[12px] text-white placeholder:text-white/15 focus:outline-none disabled:opacity-50 transition-colors"
                style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}
                onFocus={e => e.target.style.borderColor = 'rgba(34,197,94,0.25)'}
                onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.05)'}
                id="ai-chatbot-input"
              />
              <button
                type="submit"
                disabled={isTyping || !input.trim()}
                className="w-10 h-10 rounded-xl flex items-center justify-center disabled:opacity-30 active:scale-95 flex-shrink-0 transition-all"
                style={{
                  background: 'linear-gradient(135deg, #22c55e, #16a34a)',
                  color: '#000',
                  boxShadow: '0 0 10px rgba(34,197,94,0.15)',
                }}
                id="ai-chatbot-send"
              >
                {isTyping ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
