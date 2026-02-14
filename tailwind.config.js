/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        surface: {
          light: '#f6f7f9',
          card: '#ffffff',
          dark: '#0f1720',
          darkCard: '#18212e'
        },
        accent: {
          DEFAULT: '#0ea5a3',
          soft: '#ccfbf1'
        }
      },
      boxShadow: {
        soft: '0 8px 24px rgba(12, 18, 28, 0.08)'
      },
      keyframes: {
        popIn: {
          '0%': { opacity: '0', transform: 'translateY(6px) scale(0.98)' },
          '100%': { opacity: '1', transform: 'translateY(0) scale(1)' }
        }
      },
      animation: {
        popIn: 'popIn 220ms ease-out'
      }
    }
  },
  plugins: []
};
