/* eslint-env node */
module.exports = {
  content: [
  './index.html',
  './src/**/*.{js,ts,jsx,tsx}'
],
  theme: {
    extend: {
      colors: {
        axiom: '#FF5A00',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      boxShadow: {
        bento: '0 8px 30px rgb(0 0 0 / 0.04)',
        'bento-hover': '0 12px 40px rgb(0 0 0 / 0.06)',
        glass: '0 1px 0 rgb(0 0 0 / 0.04), 0 8px 24px rgb(0 0 0 / 0.04)',
      },
    },
  },
  plugins: [],
}

