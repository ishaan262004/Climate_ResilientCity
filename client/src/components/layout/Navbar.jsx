import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Globe2 } from 'lucide-react';

const navLinks = [
  { name: 'Home', path: '/' },
  { name: 'Weather', path: '/weather' },
  { name: 'Climate Risk', path: '/climate-risk' },
  { name: 'AI Story', path: '/climate-story' },
  { name: 'Heatwaves', path: '/heatwaves' },
  { name: 'Air Pollution', path: '/air-pollution' },
  { name: 'Flooding', path: '/flooding' },
  { name: 'Environment', path: '/environment' },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-black/70 backdrop-blur-2xl shadow-[0_4px_30px_rgba(0,0,0,0.5)]'
          : 'bg-transparent'
      }`}
    >
      <div className="container-custom relative flex items-center justify-between h-16 sm:h-[72px] px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 group z-10">
          <div className="relative">
            <Globe2 className="w-7 h-7 text-resilient-green transition-all duration-300 group-hover:rotate-12 group-hover:scale-110" />
            <div className="absolute inset-0 bg-resilient-green/25 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          </div>
          <span className="font-display font-bold text-lg tracking-tight">
            Resilient<span className="text-gradient-green-cyan">City</span>
          </span>
        </Link>

        {/* Desktop Nav — centered */}
        <div className="hidden md:flex items-center gap-0.5 absolute left-1/2 -translate-x-1/2">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`relative px-3 py-2 text-[12px] font-medium rounded-lg transition-all duration-300 whitespace-nowrap ${
                  isActive
                    ? 'text-resilient-green'
                    : 'text-white/50 hover:text-white/80 hover:bg-white/[0.03]'
                }`}
              >
                {link.name}
                {isActive && (
                  <motion.div
                    layoutId="activeNav"
                    className="absolute -bottom-px left-2 right-2 h-[2px] rounded-full"
                    style={{
                      background: 'linear-gradient(90deg, #22c55e, #06b6d4)',
                      boxShadow: '0 0 8px rgba(34, 197, 94, 0.5)',
                    }}
                    transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                  />
                )}
              </Link>
            );
          })}
        </div>

        {/* Right spacer for desktop / Mobile Menu Button */}
        <div className="z-10">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-xl text-white/60 hover:text-white hover:bg-white/[0.04] transition-all"
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="md:hidden bg-black/80 backdrop-blur-2xl border-t border-white/[0.04]"
          >
            <div className="px-4 py-3 space-y-0.5">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`block px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                    location.pathname === link.path
                      ? 'text-resilient-green bg-resilient-green/[0.06] border border-resilient-green/10'
                      : 'text-white/60 hover:text-white hover:bg-white/[0.03]'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
