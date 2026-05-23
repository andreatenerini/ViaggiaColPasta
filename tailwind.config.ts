import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/app/**/*.{ts,tsx}',
    './src/components/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: '#0E5C7A',
          dark: '#08384A',
          deeper: '#052530',
          light: '#E8F4F8',
          accent: '#F2A03D',
          'accent-dark': '#D4882A',
          sand: '#F7F2EA',
          'sand-dark': '#EDE7DB',
        },
      },
      fontFamily: {
        display: ['var(--font-display)', 'Georgia', 'serif'],
        body: ['var(--font-body)', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'brand-sm': '0 4px 20px -4px rgba(14,92,122,0.3)',
        'brand-md': '0 10px 40px -10px rgba(14,92,122,0.4)',
        'accent-sm': '0 4px 20px -4px rgba(242,160,61,0.35)',
        'card': '0 4px 24px rgba(0,0,0,0.06)',
        'card-hover': '0 20px 60px rgba(0,0,0,0.12)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4,0,0.6,1) infinite',
        'fade-up': 'fadeUp 0.5s ease forwards',
      },
      keyframes: {
        fadeUp: {
          from: { opacity: '0', transform: 'translateY(16px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}
export default config
