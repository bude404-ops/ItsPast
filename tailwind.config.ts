import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        sepia: { 50: '#fbf5e9', 100: '#f3e4c7', 400: '#c79a45', 700: '#7c5320' },
        midnight: { 900: '#111827', 950: '#09090b' }
      },
      boxShadow: { glow: '0 0 60px rgba(199, 154, 69, 0.18)' }
    }
  },
  plugins: []
} satisfies Config;
