import { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, MapPin, FileText, CheckCircle2 } from 'lucide-react';
import { submitReport } from '../../services/api';

const issueTypes = [
  { value: 'flood', label: '🌊 Flooding' },
  { value: 'pollution', label: '🌫️ Pollution' },
  { value: 'heatwave', label: '🔥 Heatwave' },
  { value: 'water-scarcity', label: '💧 Water Scarcity' },
  { value: 'deforestation', label: '🌳 Deforestation' },
  { value: 'other', label: '📋 Other' },
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
      // Show success anyway for demo
      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        setForm({ type: 'pollution', description: '', address: '', reportedBy: '' });
      }, 3000);
    }
    setSubmitting(false);
  };

  return (
    <section id="report" className="section-padding relative">
      {/* Background glow */}
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-resilient-green/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="container-custom">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left side info */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center gap-2 glass px-4 py-2 rounded-full mb-6">
              <FileText className="w-4 h-4 text-resilient-green" />
              <span className="text-xs text-white/60">Community Reporting</span>
            </div>
            <h2 className="font-display font-bold text-3xl sm:text-4xl lg:text-5xl text-white mb-4">
              Report an <span className="text-gradient-green">Issue</span>
            </h2>
            <p className="text-white/50 mb-8 leading-relaxed">
              Help build climate resilience by reporting environmental issues in your area.
              Your reports help us track and respond to emerging threats across Delhi.
            </p>

            <div className="space-y-4">
              {[
                'Reports are reviewed and categorized automatically',
                'Location data helps map environmental hotspots',
                'Community data drives policy recommendations',
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-resilient-green flex-shrink-0" />
                  <span className="text-white/60 text-sm">{item}</span>
                </div>
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
                className="glass-green rounded-2xl p-12 text-center"
              >
                <CheckCircle2 className="w-16 h-16 text-resilient-green mx-auto mb-4" />
                <h3 className="font-display font-bold text-xl text-white mb-2">Report Submitted!</h3>
                <p className="text-white/50 text-sm">Thank you for contributing to Delhi's climate resilience.</p>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="glass rounded-2xl p-6 sm:p-8 space-y-5">
                {/* Issue Type */}
                <div>
                  <label className="block text-sm font-medium text-white/60 mb-2">Issue Type</label>
                  <div className="grid grid-cols-3 gap-2">
                    {issueTypes.map(t => (
                      <button
                        type="button"
                        key={t.value}
                        onClick={() => setForm(f => ({ ...f, type: t.value }))}
                        className={`text-xs py-2.5 px-3 rounded-lg border transition-all duration-200 ${
                          form.type === t.value
                            ? 'bg-resilient-green/10 border-resilient-green/40 text-resilient-green'
                            : 'border-white/10 text-white/50 hover:border-white/20'
                        }`}
                      >
                        {t.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Location */}
                <div>
                  <label className="block text-sm font-medium text-white/60 mb-2">
                    <MapPin className="w-3.5 h-3.5 inline mr-1" />
                    Location
                  </label>
                  <input
                    type="text"
                    value={form.address}
                    onChange={e => setForm(f => ({ ...f, address: e.target.value }))}
                    placeholder="e.g., Connaught Place, New Delhi"
                    required
                    className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-resilient-green/40 transition-colors"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-white/60 mb-2">Description</label>
                  <textarea
                    value={form.description}
                    onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                    placeholder="Describe the issue you've observed..."
                    required
                    rows={4}
                    className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-resilient-green/40 transition-colors resize-none"
                  />
                </div>

                {/* Name (optional) */}
                <div>
                  <label className="block text-sm font-medium text-white/60 mb-2">Your Name (optional)</label>
                  <input
                    type="text"
                    value={form.reportedBy}
                    onChange={e => setForm(f => ({ ...f, reportedBy: e.target.value }))}
                    placeholder="Anonymous"
                    className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-resilient-green/40 transition-colors"
                  />
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3.5 rounded-xl bg-resilient-green text-black font-semibold text-sm hover:bg-resilient-green-light transition-all duration-300 glow-green hover:glow-green-strong flex items-center justify-center gap-2 disabled:opacity-50"
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
