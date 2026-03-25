/**
 * AQITrendChart.jsx — 7-Day Historical + 3-Day Prediction AQI Trend
 * Uses Recharts with premium gradient area fill, glassmorphism card,
 * prediction zone with dashed line. Data is simulated from current AQI.
 */
import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Calendar, Activity, BarChart3 } from 'lucide-react';
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis,
  CartesianGrid, Tooltip, ReferenceLine, ReferenceArea,
} from 'recharts';

// Generate realistic trend data from current AQI
function generateTrendData(currentAqi) {
  const base = typeof currentAqi === 'number' ? currentAqi : 150;
  const data = [];
  const today = new Date();

  // Last 7 days — historical
  for (let i = 6; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const variation = Math.sin(i * 1.2) * (base * 0.15) + (Math.random() - 0.5) * (base * 0.1);
    const aqi = Math.max(20, Math.round(base + variation));
    data.push({
      date: date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }),
      shortDate: date.toLocaleDateString('en-US', { weekday: 'short' }),
      aqi,
      type: 'historical',
    });
  }

  // Next 3 days — prediction
  for (let i = 1; i <= 3; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() + i);
    // Prediction trends slightly downward (optimistic) with uncertainty
    const trend = base * (1 - i * 0.04) + Math.sin(i * 2) * (base * 0.08);
    const aqi = Math.max(15, Math.round(trend));
    data.push({
      date: date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }),
      shortDate: date.toLocaleDateString('en-US', { weekday: 'short' }),
      aqi,
      predicted: aqi,
      type: 'predicted',
    });
  }

  return data;
}

function aqiColor(aqi) {
  if (aqi <= 50) return '#22c55e';
  if (aqi <= 100) return '#eab308';
  if (aqi <= 150) return '#f97316';
  if (aqi <= 200) return '#ef4444';
  if (aqi <= 300) return '#a855f7';
  return '#be123c';
}

// Custom tooltip
function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  const d = payload[0]?.payload;
  const aqi = d?.aqi || d?.predicted;
  const isPredicted = d?.type === 'predicted';
  const color = aqiColor(aqi);

  return (
    <div style={{
      background: 'rgba(8,8,8,0.92)',
      backdropFilter: 'blur(20px)',
      border: '1px solid rgba(255,255,255,0.06)',
      borderRadius: '14px',
      padding: '14px 16px',
      minWidth: '140px',
      boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
    }}>
      <p style={{ fontSize: '10px', color: 'rgba(255,255,255,0.25)', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
        {d?.date}
      </p>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
        <span style={{ fontSize: '26px', fontWeight: 900, color, fontFamily: 'monospace' }}>{aqi}</span>
        <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.2)' }}>AQI</span>
      </div>
      {isPredicted && (
        <p style={{ fontSize: '9px', color: 'rgba(6,182,212,0.5)', marginTop: '4px', fontStyle: 'italic' }}>
          ● Predicted
        </p>
      )}
    </div>
  );
}

export default function AQITrendChart({ aqi }) {
  const data = useMemo(() => generateTrendData(aqi), [aqi]);
  const historicalData = data.filter(d => d.type === 'historical');
  const predictedData = data.filter(d => d.type === 'predicted');

  const maxAqi = Math.max(...data.map(d => d.aqi || d.predicted || 0));
  const minAqi = Math.min(...data.map(d => d.aqi || d.predicted || 999));
  const avgAqi = Math.round(historicalData.reduce((s, d) => s + d.aqi, 0) / historicalData.length);

  // Determine trend
  const firstHalf = historicalData.slice(0, 3).reduce((s, d) => s + d.aqi, 0) / 3;
  const secondHalf = historicalData.slice(4).reduce((s, d) => s + d.aqi, 0) / Math.max(historicalData.slice(4).length, 1);
  const trend = secondHalf > firstHalf * 1.05 ? 'rising' : secondHalf < firstHalf * 0.95 ? 'falling' : 'stable';
  const trendColor = trend === 'rising' ? '#ef4444' : trend === 'falling' ? '#22c55e' : '#eab308';

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
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-emerald-500/25 to-transparent z-10" />

          <div className="p-7 sm:p-9">
            {/* Header row */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 rounded-[10px] flex items-center justify-center"
                    style={{ background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.15)' }}>
                    <TrendingUp className="w-4 h-4 text-emerald-400" />
                  </div>
                  <span className="text-[10px] text-white/25 uppercase tracking-[0.15em] font-medium">Data Story</span>
                </div>
                <h3 className="font-display font-bold text-2xl text-white tracking-tight">
                  AQI <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">Trend</span>
                </h3>
                <p className="text-[12px] text-white/25 mt-1">7-day history + 3-day forecast</p>
              </div>

              {/* Quick stats */}
              <div className="flex gap-3">
                {[
                  { label: '7D Avg', value: avgAqi, color: aqiColor(avgAqi), icon: BarChart3 },
                  { label: 'Peak', value: maxAqi, color: aqiColor(maxAqi), icon: Activity },
                  { label: 'Trend', value: trend === 'rising' ? '↑' : trend === 'falling' ? '↓' : '→', color: trendColor, icon: TrendingUp },
                ].map((s, i) => (
                  <div key={i} className="text-center rounded-[14px] px-4 py-3"
                    style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.04)' }}>
                    <p className="text-[8px] text-white/15 uppercase tracking-wider mb-1">{s.label}</p>
                    <p className="text-lg font-black font-mono" style={{ color: s.color }}>{s.value}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Chart */}
            <div className="h-[280px] -mx-2">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="aqiGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#22c55e" stopOpacity={0.2} />
                      <stop offset="50%" stopColor="#eab308" stopOpacity={0.08} />
                      <stop offset="100%" stopColor="#ef4444" stopOpacity={0.01} />
                    </linearGradient>
                    <linearGradient id="predGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#06b6d4" stopOpacity={0.15} />
                      <stop offset="100%" stopColor="#06b6d4" stopOpacity={0.01} />
                    </linearGradient>
                  </defs>

                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.025)" vertical={false} />

                  <XAxis
                    dataKey="shortDate"
                    tick={{ fill: 'rgba(255,255,255,0.15)', fontSize: 10 }}
                    axisLine={{ stroke: 'rgba(255,255,255,0.04)' }}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fill: 'rgba(255,255,255,0.12)', fontSize: 10 }}
                    axisLine={false}
                    tickLine={false}
                    domain={[Math.max(0, minAqi - 30), maxAqi + 30]}
                  />

                  <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'rgba(255,255,255,0.06)', strokeWidth: 1 }} />

                  {/* Prediction zone highlight */}
                  <ReferenceArea
                    x1={data[6]?.shortDate}
                    x2={data[9]?.shortDate}
                    fill="rgba(6,182,212,0.02)"
                    stroke="rgba(6,182,212,0.06)"
                    strokeDasharray="3 3"
                  />

                  {/* Today line */}
                  <ReferenceLine
                    x={data[6]?.shortDate}
                    stroke="rgba(255,255,255,0.1)"
                    strokeDasharray="4 4"
                    label={{ value: 'Today', fill: 'rgba(255,255,255,0.15)', fontSize: 9, position: 'top' }}
                  />

                  {/* AQI threshold lines */}
                  <ReferenceLine y={100} stroke="rgba(234,179,8,0.15)" strokeDasharray="6 6" />
                  <ReferenceLine y={200} stroke="rgba(239,68,68,0.15)" strokeDasharray="6 6" />

                  {/* Historical area */}
                  <Area
                    type="monotone"
                    dataKey="aqi"
                    stroke="#22c55e"
                    strokeWidth={2.5}
                    fill="url(#aqiGradient)"
                    dot={{ r: 3, fill: '#0a0a0a', stroke: '#22c55e', strokeWidth: 2 }}
                    activeDot={{ r: 5, fill: '#22c55e', stroke: '#0a0a0a', strokeWidth: 2 }}
                    connectNulls={false}
                  />

                  {/* Predicted area */}
                  <Area
                    type="monotone"
                    dataKey="predicted"
                    stroke="#06b6d4"
                    strokeWidth={2}
                    strokeDasharray="6 4"
                    fill="url(#predGradient)"
                    dot={{ r: 3, fill: '#0a0a0a', stroke: '#06b6d4', strokeWidth: 2 }}
                    activeDot={{ r: 5, fill: '#06b6d4', stroke: '#0a0a0a', strokeWidth: 2 }}
                    connectNulls={false}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Legend */}
            <div className="flex items-center justify-center gap-6 mt-4 pt-4" style={{ borderTop: '1px solid rgba(255,255,255,0.03)' }}>
              <div className="flex items-center gap-2">
                <div className="w-5 h-0.5 rounded-full bg-emerald-400" />
                <span className="text-[10px] text-white/20">Historical</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-5 h-0.5 rounded-full bg-cyan-400" style={{ borderBottom: '2px dashed' }} />
                <span className="text-[10px] text-white/20">Predicted</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-3 h-3 text-white/15" />
                <span className="text-[10px] text-white/15">10-day window</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
