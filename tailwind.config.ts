import type { Config } from 'tailwindcss'

export default {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        primary: '#2563EB',
        accent: '#D97706',
        dark: '#1B2A4A',
        navy: '#0F1B33',
      }
    }
  },
  plugins: []
} satisfies Config
