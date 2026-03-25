/**
 * CitySearch.jsx — Premium Pill Search with Glow Focus
 */
import { useState } from 'react';
import { Search, MapPin, Loader2 } from 'lucide-react';

const QUICK_CITIES = ['Delhi', 'Mumbai', 'Bangalore', 'Chennai', 'Kolkata', 'Hyderabad', 'Pune', 'Jaipur'];

export default function CitySearch({ value, onSearch, loading = false }) {
  const [input, setInput] = useState(value || 'Delhi');
  const [focused, setFocused] = useState(false);

  const submit = () => {
    const trimmed = input.trim();
    if (trimmed) onSearch(trimmed);
  };

  return (
    <div className="w-full max-w-xl mx-auto">
      {/* Search bar — pill shape with glow on focus */}
      <div className="relative">
        {/* Focus glow ring */}
        <div
          className="absolute -inset-px rounded-2xl transition-all duration-500 pointer-events-none"
          style={{
            background: focused
              ? 'linear-gradient(135deg, rgba(34,197,94,0.2), rgba(6,182,212,0.15))'
              : 'transparent',
            filter: focused ? 'blur(1px)' : 'none',
          }}
        />
        <div className="relative flex items-center">
          <div className="absolute left-5 text-white/25">
            {loading
              ? <Loader2 className="w-4 h-4 animate-spin text-resilient-green" />
              : <MapPin className="w-4 h-4" />
            }
          </div>
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && submit()}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            placeholder="Enter city name…"
            className="w-full pl-12 pr-36 py-4 rounded-2xl bg-white/[0.03] border border-white/[0.06] focus:border-resilient-green/30 focus:outline-none text-white placeholder-white/20 text-sm transition-all duration-300 focus:bg-white/[0.04]"
            id="city-search-input"
          />
          <button
            onClick={submit}
            disabled={loading}
            className="absolute right-2.5 flex items-center gap-2 px-5 py-2.5 rounded-xl text-black text-xs font-bold transition-all duration-300 active:scale-95 disabled:opacity-50"
            style={{
              background: 'linear-gradient(135deg, #22c55e, #16a34a)',
              boxShadow: '0 0 12px rgba(34, 197, 94, 0.25)',
            }}
            id="city-search-submit"
          >
            <Search className="w-3.5 h-3.5" />
            Analyse
          </button>
        </div>
      </div>

      {/* Quick select chips */}
      <div className="flex flex-wrap gap-1.5 mt-4 justify-center">
        {QUICK_CITIES.map(city => (
          <button
            key={city}
            onClick={() => { setInput(city); onSearch(city); }}
            className={`text-[10px] px-3 py-1.5 rounded-full border transition-all duration-300 ${
              value === city
                ? 'bg-resilient-green/15 border-resilient-green/30 text-green-300 shadow-[0_0_10px_rgba(34,197,94,0.1)]'
                : 'bg-white/[0.02] border-white/[0.04] text-white/35 hover:text-white/60 hover:border-white/10 hover:bg-white/[0.03]'
            }`}
          >
            {city}
          </button>
        ))}
      </div>
    </div>
  );
}
