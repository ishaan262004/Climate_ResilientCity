import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Globe2 } from 'lucide-react';

const navLinks = [
  { name: 'Home', path: '/' },
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
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'glass-strong shadow-lg shadow-black/20'
          : 'bg-transparent'
      }`}
    >
      <div className="container-custom flex items-center justify-between h-16 sm:h-20 px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <div className="relative">
            <Globe2 className="w-8 h-8 text-resilient-green transition-transform duration-300 group-hover:rotate-12" />
            <div className="absolute inset-0 bg-resilient-green/20 rounded-full blur-lg opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
          <span className="font-display font-bold text-xl tracking-tight">
            Resilient<span className="text-resilient-green">City</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`relative px-4 py-2 text-sm font-medium rounded-lg transition-all duration-300 ${
                location.pathname === link.path
                  ? 'text-resilient-green'
                  : 'text-white/70 hover:text-white hover:bg-white/5'
              }`}
            >
              {link.name}
              {location.pathname === link.path && (
                <motion.div
                  layoutId="activeNav"
                  className="absolute bottom-0 left-2 right-2 h-0.5 bg-resilient-green rounded-full"
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                />
              )}
            </Link>
          ))}
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden p-2 rounded-lg text-white/70 hover:text-white hover:bg-white/5 transition-colors"
          aria-label="Toggle menu"
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden glass-strong border-t border-white/5"
          >
            <div className="px-4 py-4 space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`block px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                    location.pathname === link.path
                      ? 'text-resilient-green bg-resilient-green/10'
                      : 'text-white/70 hover:text-white hover:bg-white/5'
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
