import { Link } from 'react-router-dom';
import { Globe2, Github, Twitter, Mail, Heart, ExternalLink } from 'lucide-react';

const footerLinks = [
  { name: 'Heatwaves', path: '/heatwaves' },
  { name: 'Air Pollution', path: '/air-pollution' },
  { name: 'Flooding', path: '/flooding' },
  { name: 'Environment', path: '/environment' },
];

const platformLinks = [
  { name: 'Weather', path: '/weather' },
  { name: 'Climate Risk', path: '/climate-risk' },
  { name: 'AI Story', path: '/climate-story' },
];

export default function Footer() {
  return (
    <footer className="relative overflow-hidden" style={{ background: 'linear-gradient(180deg, #000 0%, #030503 100%)' }}>
      {/* Top accent line */}
      <div className="h-px bg-gradient-to-r from-transparent via-emerald-500/20 to-transparent" />

      {/* Ambient orb */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full blur-[200px] opacity-[0.03] pointer-events-none"
        style={{ background: 'radial-gradient(ellipse, #22c55e, transparent 60%)' }} />

      <div className="container-custom relative">
        <div className="py-16 grid grid-cols-1 md:grid-cols-12 gap-12">
          {/* Brand — wider column */}
          <div className="md:col-span-5">
            <Link to="/" className="flex items-center gap-2.5 mb-5 group">
              <div className="relative">
                <Globe2 className="w-8 h-8 text-emerald-400 transition-all duration-300 group-hover:rotate-12" />
                <div className="absolute inset-0 bg-emerald-400/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>
              <span className="font-display font-bold text-xl tracking-tight">
                Resilient<span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">City</span>
              </span>
            </Link>
            <p className="text-white/25 text-[13px] leading-relaxed max-w-sm mb-6 font-light">
              Building climate resilience for Delhi through data-driven insights,
              community engagement, and real-time environmental monitoring.
            </p>
            {/* Social icons */}
            <div className="flex gap-2.5">
              {[
                { icon: Github, href: '#' },
                { icon: Twitter, href: '#' },
                { icon: Mail, href: '#' },
              ].map(({ icon: Icon, href }, i) => (
                <a
                  key={i}
                  href={href}
                  className="w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-300 group/icon"
                  style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.04)' }}
                >
                  <Icon className="w-3.5 h-3.5 text-white/20 group-hover/icon:text-emerald-400 transition-colors" />
                </a>
              ))}
            </div>
          </div>

          {/* Explore */}
          <div className="md:col-span-3">
            <h4 className="text-[10px] font-semibold uppercase tracking-[0.15em] text-white/20 mb-5">
              Explore
            </h4>
            <ul className="space-y-3">
              {footerLinks.map((item) => (
                <li key={item.name}>
                  <Link
                    to={item.path}
                    className="text-[13px] text-white/30 hover:text-emerald-400 transition-colors duration-200 flex items-center gap-1.5 group/link"
                  >
                    <span>{item.name}</span>
                    <ExternalLink className="w-3 h-3 opacity-0 group-hover/link:opacity-100 transition-opacity" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Platform */}
          <div className="md:col-span-2">
            <h4 className="text-[10px] font-semibold uppercase tracking-[0.15em] text-white/20 mb-5">
              Platform
            </h4>
            <ul className="space-y-3">
              {platformLinks.map((item) => (
                <li key={item.name}>
                  <Link
                    to={item.path}
                    className="text-[13px] text-white/30 hover:text-emerald-400 transition-colors duration-200 flex items-center gap-1.5 group/link"
                  >
                    <span>{item.name}</span>
                    <ExternalLink className="w-3 h-3 opacity-0 group-hover/link:opacity-100 transition-opacity" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Status */}
          <div className="md:col-span-2">
            <h4 className="text-[10px] font-semibold uppercase tracking-[0.15em] text-white/20 mb-5">
              Status
            </h4>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_6px_rgba(34,197,94,0.5)]" />
                <span className="text-[12px] text-white/30">All systems online</span>
              </div>
              <div className="rounded-xl p-3" style={{ background: 'rgba(255,255,255,0.015)', border: '1px solid rgba(255,255,255,0.03)' }}>
                <p className="text-[10px] text-white/15 uppercase tracking-wider mb-1">Monitoring</p>
                <p className="text-[12px] text-white/40">Delhi, India</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="py-6 flex flex-col sm:flex-row justify-between items-center gap-4"
          style={{ borderTop: '1px solid rgba(255,255,255,0.03)' }}>
          <p className="text-[11px] text-white/15 flex items-center gap-1.5">
            © 2026 Resilient City. Built with <Heart className="w-3 h-3 text-red-400/40" /> by COMPYUTE
          </p>
          <p className="text-[11px] text-white/15">
            Climate data for Delhi, India
          </p>
        </div>
      </div>
    </footer>
  );
}
