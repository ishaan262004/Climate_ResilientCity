/**
 * AlertPopup.jsx
 * Full-screen modal that fires when any climate risk is HIGH.
 * Includes a "Send Alert" button that posts to the backend.
 */
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, X, Send, CheckCircle } from 'lucide-react';
import { sendClimateAlert } from '../../services/climateRiskApi';

/**
 * @param {object}   props
 * @param {boolean}  props.open          - Whether modal is visible
 * @param {function} props.onClose       - Callback to close the modal
 * @param {string}   props.city          - City name
 * @param {string[]} props.highRisks     - Array of risk names that are High
 * @param {string[]} props.recommendations - Action recommendations
 */
export default function AlertPopup({ open, onClose, city, highRisks = [], recommendations = [] }) {
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSendAlert = async () => {
    setSending(true);
    try {
      await sendClimateAlert({
        city,
        risks: highRisks,
        message: `CRITICAL: High climate risk detected in ${city} — ${highRisks.join(', ')}`,
        severity: 'high',
      });
      setSent(true);
      setTimeout(() => setSent(false), 3000);
    } catch (e) {
      console.error('Alert send failed:', e);
    } finally {
      setSending(false);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <motion.div
            key="modal"
            initial={{ opacity: 0, scale: 0.92, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 12 }}
            transition={{ type: 'spring', stiffness: 280, damping: 22 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
          >
            <div className="pointer-events-auto w-full max-w-md rounded-2xl bg-[#0d0d0d] border border-red-500/30 shadow-2xl shadow-red-500/10 overflow-hidden">
              {/* Red accent header */}
              <div className="bg-gradient-to-r from-red-900/40 via-red-800/20 to-transparent px-6 py-5 border-b border-red-500/20 flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-red-500/15 border border-red-500/30 flex items-center justify-center flex-shrink-0 animate-pulse">
                  <AlertTriangle className="w-5 h-5 text-red-400" />
                </div>
                <div className="flex-1">
                  <h2 className="font-bold text-white text-lg leading-tight">⚠️ High Climate Risk Detected</h2>
                  <p className="text-sm text-red-300/70 mt-0.5">{city}</p>
                </div>
                <button onClick={onClose} className="text-white/30 hover:text-white/70 transition-colors mt-0.5">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Risk chips */}
              <div className="px-6 pt-5">
                <p className="text-xs text-white/40 uppercase tracking-widest mb-3">Active High Risks</p>
                <div className="flex flex-wrap gap-2 mb-5">
                  {highRisks.map(risk => (
                    <span key={risk}
                      className="px-3 py-1.5 rounded-full text-xs font-semibold bg-red-500/15 text-red-300 border border-red-500/25 uppercase tracking-wide">
                      {risk}
                    </span>
                  ))}
                </div>
              </div>

              {/* Recommendations */}
              {recommendations.length > 0 && (
                <div className="px-6 pb-5">
                  <p className="text-xs text-white/40 uppercase tracking-widest mb-3">Immediate Actions</p>
                  <ul className="space-y-2 max-h-44 overflow-y-auto pr-1">
                    {recommendations.slice(0, 6).map((rec, i) => (
                      <li key={i} className="text-xs text-white/70 leading-relaxed bg-white/[0.02] border border-white/[0.05] rounded-lg px-3 py-2">
                        {rec}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Actions */}
              <div className="px-6 pb-6 flex gap-3">
                <button
                  onClick={handleSendAlert}
                  disabled={sending || sent}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 disabled:opacity-60 text-white text-sm font-semibold transition-all duration-200 active:scale-95"
                >
                  {sent ? (
                    <><CheckCircle className="w-4 h-4" /><span>Sent!</span></>
                  ) : sending ? (
                    <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /><span>Sending…</span></>
                  ) : (
                    <><Send className="w-4 h-4" /><span>Send Alert</span></>
                  )}
                </button>
                <button
                  onClick={onClose}
                  className="px-4 py-2.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-white/60 text-sm font-medium transition-all duration-200"
                >
                  Dismiss
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
