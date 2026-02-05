/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      backdropBlur: {
        xs: '2px',
        sm: '4px',
        DEFAULT: '8px',
        md: '12px',
        lg: '16px',
        xl: '24px',
      },
      boxShadow: {
        glass: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
        'glass-light': '0 8px 32px 0 rgba(255, 255, 255, 0.25)',
        'glass-dark': '0 8px 32px 0 rgba(31, 38, 135, 0.25)',
      },
      backgroundColor: {
        glass: 'rgba(255, 255, 255, 0.25)',
        'glass-light': 'rgba(255, 255, 255, 0.25)',
        'glass-dark': 'rgba(31, 38, 135, 0.25)',
        'glass-card': 'rgba(255, 255, 255, 0.1)',
        'glass-card-dark': 'rgba(31, 38, 135, 0.15)',
      },
      borderColor: {
        glass: 'rgba(255, 255, 255, 0.18)',
        'glass-dark': 'rgba(31, 38, 135, 0.18)',
      },
      textColor: {
        glass: '#ffffff',
        'glass-dark': '#e0e0ff',
      },
      gradientColorStops: {
        'purple-pink': ['#a855f7', '#ec4899'],
        'indigo-purple': ['#6366f1', '#8b5cf6'],
      },
    },
  },
  plugins: [],
}