import { Link } from 'react-router-dom';
import { Globe2, Github, Twitter, Mail } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="relative border-t border-white/5 bg-black">
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-resilient-green/5 to-transparent pointer-events-none" />
      
      <div className="container-custom section-padding relative">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <Globe2 className="w-8 h-8 text-resilient-green" />
              <span className="font-display font-bold text-xl">
                Resilient<span className="text-resilient-green">City</span>
              </span>
            </Link>
            <p className="text-white/50 text-sm leading-relaxed max-w-md">
              Building climate resilience for Delhi through data-driven insights, 
              community engagement, and real-time environmental monitoring.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display font-semibold text-sm uppercase tracking-wider text-white/30 mb-4">
              Explore
            </h4>
            <ul className="space-y-3">
              {['Heatwaves', 'Air Pollution', 'Flooding', 'Environment'].map((item) => (
                <li key={item}>
                  <Link
                    to={`/${item.toLowerCase().replace(' ', '-')}`}
                    className="text-sm text-white/50 hover:text-resilient-green transition-colors duration-200"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Connect */}
          <div>
            <h4 className="font-display font-semibold text-sm uppercase tracking-wider text-white/30 mb-4">
              Connect
            </h4>
            <div className="flex gap-3">
              {[
                { icon: Github, href: '#' },
                { icon: Twitter, href: '#' },
                { icon: Mail, href: '#' },
              ].map(({ icon: Icon, href }, i) => (
                <a
                  key={i}
                  href={href}
                  className="w-10 h-10 rounded-lg glass flex items-center justify-center text-white/40 hover:text-resilient-green hover:border-resilient-green/30 transition-all duration-300"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs text-white/30">
            © 2026 Resilient City. Built for a sustainable future by COMPYUTE.
          </p>
          <p className="text-xs text-white/30">
            Climate data for Delhi, India
          </p>
        </div>
      </div>
    </footer>
  );
}
