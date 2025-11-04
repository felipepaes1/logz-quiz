import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        primary: '#6A3EB0',
        secondary: '#E0AF3B',
        accent: '#37B24D'
      }
    }
  },
  plugins: []
}

export default config;