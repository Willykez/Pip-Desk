/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#05070A',
        surface: '#0D1219',
        panel: '#10161F',
        line: '#1C242F',
        paper: '#EDF1F5',
        mute: '#6B7684',
        long: '#17D897',
        short: '#FF5470',
        pending: '#FFB648',
        accent: '#4C8DFF',
        admin: '#8B7CFF'
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        sans: ['"Inter"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace']
      },
      boxShadow: {
        glow: '0 0 0 1px rgba(255,182,72,0.25), 0 0 24px -4px rgba(255,182,72,0.35)',
        'glow-admin': '0 0 0 1px rgba(139,124,255,0.3), 0 0 24px -6px rgba(139,124,255,0.4)'
      },
      backgroundImage: {
        grid: 'linear-gradient(rgba(237,241,245,0.035) 1px, transparent 1px), linear-gradient(90deg, rgba(237,241,245,0.035) 1px, transparent 1px)'
      },
      backgroundSize: {
        grid: '28px 28px'
      }
    }
  },
  plugins: []
}
