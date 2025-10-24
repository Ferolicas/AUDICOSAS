import type { Config } from 'tailwindcss'

export default {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        primary: '#0ea5e9',
        accent: '#22c55e',
        dark: '#0f172a'
      }
    }
  },
  plugins: []
} satisfies Config

