/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'resilient': {
          green: '#22c55e',
          'green-dark': '#16a34a',
          'green-light': '#4ade80',
          neon: '#00ff9f',
          dark: '#050505',
          'dark-card': '#0a0a0a',
          'dark-border': '#151515',
          'dark-hover': '#111111',
          'dark-surface': '#080808',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Outfit', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      backdropBlur: {
        xs: '2px',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'gradient-shift': 'gradient-shift 8s ease infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'border-glow-pulse': 'border-glow-pulse 3s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        glow: {
          '0%': { boxShadow: '0 0 5px rgba(34, 197, 94, 0.2)' },
          '100%': { boxShadow: '0 0 20px rgba(34, 197, 94, 0.6)' },
        },
        'gradient-shift': {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
        'border-glow-pulse': {
          '0%, 100%': { opacity: '0.3' },
          '50%': { opacity: '0.8' },
        },
      },
      boxShadow: {
        'glow-green': '0 0 20px rgba(34, 197, 94, 0.15), 0 0 60px rgba(34, 197, 94, 0.05)',
        'glow-green-strong': '0 0 20px rgba(34, 197, 94, 0.25), 0 0 80px rgba(34, 197, 94, 0.1)',
        'glow-red': '0 0 20px rgba(239, 68, 68, 0.15), 0 0 60px rgba(239, 68, 68, 0.05)',
        'glow-yellow': '0 0 20px rgba(234, 179, 8, 0.15), 0 0 60px rgba(234, 179, 8, 0.05)',
        'card-hover': '0 20px 60px -15px rgba(0, 0, 0, 0.5), 0 0 40px rgba(34, 197, 94, 0.05)',
      },
    },
  },
  plugins: [],
}
