/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cyber: {
          bg: '#070a12',
          card: '#0f172a',
          emerald: '#10b981',
          cyan: '#06b6d4',
          accent: '#3b82f6',
        }
      },
      fontFamily: {
        mono: ['D2Coding', 'JetBrains Mono', 'Nanum Gothic Coding', 'Fira Code', 'monospace'],
        sans: ['Inter', 'Noto Sans KR', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
