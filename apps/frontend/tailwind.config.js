/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        health: {
          50: '#f0fdf4',
          100: '#dcfce7',
          500: '#10b981',
          600: '#059669',
          700: '#047857',
          900: '#064e3b',
        },
        stripe: {
          dark: '#0a2540',
          card: '#1a1f36',
          accent: '#635bff',
          cyan: '#00d4ff'
        }
      }
    },
  },
  plugins: [],
}
