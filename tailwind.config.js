/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#0B0F14',
        panel: '#111823',
        line: '#1E2733',
        paper: '#E9EDF1',
        mute: '#6E7A8A',
        long: '#00D48A',
        short: '#FF5C6C',
        pending: '#F0A93B',
        accent: '#4C8DFF'
      },
      fontFamily: {
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
        sans: ['"Manrope"', 'ui-sans-serif', 'system-ui', 'sans-serif']
      }
    }
  },
  plugins: []
}
