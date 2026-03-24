import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, Bot, User } from 'lucide-react';

const climateResponses = {
  aqi: "Delhi's AQI often exceeds 300, especially in winter. Major contributors include vehicular emissions, construction dust, industrial pollution, and crop stubble burning from neighboring states. During severe episodes, authorities issue health advisories recommending limited outdoor exposure.",
  heatwave: "Delhi experiences extreme heatwaves from April to June with temperatures often crossing 45°C. The urban heat island effect makes dense areas 3-5°C hotter than rural surroundings. Stay hydrated, avoid sun exposure between 11 AM and 4 PM, and check on vulnerable neighbors.",
  flood: "Monsoon flooding in Delhi is driven by heavy rainfall, poor drainage infrastructure, and encroachments on the Yamuna floodplain. Areas like ITO, Pragati Maidan, and parts of East Delhi are most vulnerable. Waterlogging can disrupt traffic for hours.",
  pollution: "Air pollution in Delhi comes from multiple sources: 40% from vehicles, 20% from industry, 10% from construction, and significant seasonal contribution from farm fires in Punjab and Haryana. PM2.5 particles are the most dangerous, penetrating deep into the lungs.",
  water: "Delhi faces a severe water crisis. With groundwater depleting at alarming rates, the city depends heavily on the Yamuna and water from neighboring states. Many areas face daily shortages, and water tanker mafias operate in several colonies.",
  trees: "Delhi has lost significant green cover to urban development. The city's tree cover is around 20%, though the recommended standard is 33%. Recent initiatives include large-scale plantation drives and protection of Ridge forest areas.",
  help: "I can answer questions about: AQI & air pollution, heatwaves, flooding, water scarcity, deforestation, and climate resilience in Delhi. Just ask me anything!",
  default: "I'm the Resilient City climate assistant. I can help with information about Delhi's environmental challenges including AQI, heatwaves, flooding, water scarcity, and loss of green cover. What would you like to know?",
};

function getResponse(message) {
  const lower = message.toLowerCase();
  if (lower.includes('aqi') || lower.includes('air quality')) return climateResponses.aqi;
  if (lower.includes('heat') || lower.includes('temperature') || lower.includes('hot')) return climateResponses.heatwave;
  if (lower.includes('flood') || lower.includes('rain') || lower.includes('waterlog')) return climateResponses.flood;
  if (lower.includes('pollut') || lower.includes('pm2.5') || lower.includes('smog')) return climateResponses.pollution;
  if (lower.includes('water') || lower.includes('scarcity') || lower.includes('drought')) return climateResponses.water;
  if (lower.includes('tree') || lower.includes('green') || lower.includes('forest') || lower.includes('deforest')) return climateResponses.trees;
  if (lower.includes('help') || lower.includes('what can')) return climateResponses.help;
  return climateResponses.default;
}

export default function AIChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'bot', text: "Hi! I'm the Resilient City climate assistant. Ask me about Delhi's environmental challenges! 🌍" }
  ]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;
    const userMsg = input.trim();
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setInput('');

    // Simulate typing delay
    setTimeout(() => {
      setMessages(prev => [...prev, { role: 'bot', text: getResponse(userMsg) }]);
    }, 600);
  };

  return (
    <>
      {/* Float button */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 2, type: 'spring' }}
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-resilient-green text-black flex items-center justify-center shadow-lg glow-green-strong hover:scale-110 transition-transform"
      >
        {isOpen ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
      </motion.button>

      {/* Chat window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ duration: 0.3 }}
            className="fixed bottom-24 right-6 z-50 w-[360px] max-w-[calc(100vw-48px)] h-[480px] rounded-2xl glass-strong border border-white/10 flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="px-5 py-4 border-b border-white/5 flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-resilient-green/20 flex items-center justify-center">
                <Bot className="w-4 h-4 text-resilient-green" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-white">Climate Assistant</h4>
                <p className="text-[10px] text-resilient-green flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-resilient-green rounded-full animate-pulse" />
                  Online
                </p>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex gap-2 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {msg.role === 'bot' && (
                    <div className="w-6 h-6 rounded-full bg-resilient-green/20 flex items-center justify-center flex-shrink-0 mt-1">
                      <Bot className="w-3 h-3 text-resilient-green" />
                    </div>
                  )}
                  <div className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-xs leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-resilient-green text-black rounded-br-sm'
                      : 'bg-white/5 text-white/80 rounded-bl-sm'
                  }`}>
                    {msg.text}
                  </div>
                </motion.div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <form
              onSubmit={(e) => { e.preventDefault(); handleSend(); }}
              className="px-4 py-3 border-t border-white/5 flex gap-2"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about climate..."
                className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white placeholder:text-white/20 focus:outline-none focus:border-resilient-green/40"
              />
              <button
                type="submit"
                className="w-10 h-10 rounded-xl bg-resilient-green text-black flex items-center justify-center hover:bg-resilient-green-light transition-colors"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
