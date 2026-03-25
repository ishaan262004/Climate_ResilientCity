import { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, MapPin, FileText, CheckCircle2, Shield, Zap } from 'lucide-react';
import { submitReport } from '../../services/api';

const issueTypes = [
  { value: 'flood', label: 'Flooding', emoji: '🌊', color: '#3b82f6' },
  { value: 'pollution', label: 'Pollution', emoji: '🌫️', color: '#a855f7' },
  { value: 'heatwave', label: 'Heatwave', emoji: '🔥', color: '#ef4444' },
  { value: 'water-scarcity', label: 'Water', emoji: '💧', color: '#06b6d4' },
  { value: 'deforestation', label: 'Trees', emoji: '🌳', color: '#22c55e' },
  { value: 'other', label: 'Other', emoji: '📋', color: '#64748b' },
];

export default function ReportForm() {
  const [form, setForm] = useState({
    type: 'pollution',
    description: '',
    address: '',
    reportedBy: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await submitReport({
        type: form.type,
        description: form.description,
        location: { address: form.address },
        reportedBy: form.reportedBy || 'Anonymous',
      });
      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        setForm({ type: 'pollution', description: '', address: '', reportedBy: '' });
      }, 3000);
    } catch (err) {
      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        setForm({ type: 'pollution', description: '', address: '', reportedBy: '' });
      }, 3000);
    }
    setSubmitting(false);
  };

  const activeType = issueTypes.find(t => t.value === form.type);

  return (
    <section id="report" className="section-padding relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] rounded-full blur-[200px] opacity-[0.04] pointer-events-none"
        style={{ background: 'radial-gradient(ellipse, #22c55e, transparent 60%)' }} />
      <div className="absolute top-20 left-0 w-[300px] h-[300px] rounded-full blur-[150px] opacity-[0.03] pointer-events-none"
        style={{ background: 'radial-gradient(ellipse, #06b6d4, transparent 60%)' }} />

      <div className="container-custom">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
          {/* Left side info */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center gap-2 bg-white/[0.02] border border-white/[0.05] px-5 py-2 rounded-full mb-7 backdrop-blur-sm">
              <Shield className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-[11px] text-white/35 tracking-widest uppercase font-medium">Community Reports</span>
            </div>
            <h2 className="font-display font-bold text-3xl sm:text-4xl lg:text-5xl text-white mb-5 tracking-tight leading-[1.1]">
              Report an{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">Issue</span>
            </h2>
            <p className="text-white/30 mb-10 leading-relaxed text-[15px] font-light max-w-lg">
              Help build climate resilience by reporting environmental issues in your area.
              Your reports help us track and respond to emerging threats across Delhi.
            </p>

            <div className="space-y-5">
              {[
                { icon: Zap, text: 'Reports are reviewed and categorized automatically', color: '#eab308' },
                { icon: MapPin, text: 'Location data helps map environmental hotspots', color: '#3b82f6' },
                { icon: Shield, text: 'Community data drives policy recommendations', color: '#22c55e' },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="flex items-center gap-4"
                >
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ background: `${item.color}08`, border: `1px solid ${item.color}15` }}>
                    <item.icon className="w-4 h-4" style={{ color: item.color }} />
                  </div>
                  <span className="text-white/40 text-[13px]">{item.text}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            {submitted ? (
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="rounded-[22px] p-14 text-center"
                style={{ background: 'rgba(34,197,94,0.04)', border: '1px solid rgba(34,197,94,0.12)' }}
              >
                <div className="w-20 h-20 rounded-full mx-auto mb-5 flex items-center justify-center"
                  style={{ background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.2)' }}>
                  <CheckCircle2 className="w-10 h-10 text-emerald-400" />
                </div>
                <h3 className="font-display font-bold text-xl text-white mb-2">Report Submitted!</h3>
                <p className="text-white/35 text-sm">Thank you for contributing to Delhi's climate resilience.</p>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit}
                className="rounded-[22px] p-7 sm:p-8 space-y-6"
                style={{ background: 'rgba(255,255,255,0.015)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.04)' }}
              >
                {/* Top accent */}
                <div className="absolute top-0 left-8 right-8 h-px bg-gradient-to-r from-transparent via-emerald-500/20 to-transparent" />

                {/* Issue Type */}
                <div>
                  <label className="block text-[11px] font-medium text-white/30 mb-3 uppercase tracking-wider">Issue Type</label>
                  <div className="grid grid-cols-3 gap-2">
                    {issueTypes.map(t => (
                      <button
                        type="button"
                        key={t.value}
                        onClick={() => setForm(f => ({ ...f, type: t.value }))}
                        className="text-[11px] py-3 px-3 rounded-[12px] transition-all duration-200 flex items-center justify-center gap-1.5 font-medium"
                        style={form.type === t.value
                          ? { background: `${t.color}10`, border: `1px solid ${t.color}30`, color: t.color }
                          : { background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.35)' }
                        }
                      >
                        <span>{t.emoji}</span> {t.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Location */}
                <div>
                  <label className="block text-[11px] font-medium text-white/30 mb-2 uppercase tracking-wider">
                    <MapPin className="w-3 h-3 inline mr-1" /> Location
                  </label>
                  <input
                    type="text"
                    value={form.address}
                    onChange={e => setForm(f => ({ ...f, address: e.target.value }))}
                    placeholder="e.g., Connaught Place, New Delhi"
                    required
                    className="w-full rounded-[12px] px-4 py-3.5 text-sm text-white placeholder:text-white/15 focus:outline-none transition-colors"
                    style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}
                    onFocus={e => e.target.style.borderColor = 'rgba(34,197,94,0.3)'}
                    onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.06)'}
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-[11px] font-medium text-white/30 mb-2 uppercase tracking-wider">Description</label>
                  <textarea
                    value={form.description}
                    onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                    placeholder="Describe the issue you've observed..."
                    required
                    rows={4}
                    className="w-full rounded-[12px] px-4 py-3.5 text-sm text-white placeholder:text-white/15 focus:outline-none resize-none transition-colors"
                    style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}
                    onFocus={e => e.target.style.borderColor = 'rgba(34,197,94,0.3)'}
                    onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.06)'}
                  />
                </div>

                {/* Name */}
                <div>
                  <label className="block text-[11px] font-medium text-white/30 mb-2 uppercase tracking-wider">Your Name (optional)</label>
                  <input
                    type="text"
                    value={form.reportedBy}
                    onChange={e => setForm(f => ({ ...f, reportedBy: e.target.value }))}
                    placeholder="Anonymous"
                    className="w-full rounded-[12px] px-4 py-3.5 text-sm text-white placeholder:text-white/15 focus:outline-none transition-colors"
                    style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}
                    onFocus={e => e.target.style.borderColor = 'rgba(34,197,94,0.3)'}
                    onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.06)'}
                  />
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-4 rounded-[14px] font-semibold text-sm flex items-center justify-center gap-2.5 disabled:opacity-50 transition-all duration-300 active:scale-[0.98]"
                  style={{
                    background: 'linear-gradient(135deg, #22c55e, #16a34a)',
                    color: '#000',
                    boxShadow: '0 0 20px rgba(34,197,94,0.2)',
                  }}
                >
                  <Send className="w-4 h-4" />
                  {submitting ? 'Submitting...' : 'Submit Report'}
                </button>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
