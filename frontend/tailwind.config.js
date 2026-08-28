/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        dark: {
          900: '#0B0F19',
          800: '#111827',
          700: '#1F2937',
          600: '#374151'
        },
        cyber: {
          blue: '#3B82F6',
          cyan: '#06B6D4',
          red: '#EF4444',
          green: '#10B981',
          amber: '#F59E0B',
          purple: '#8B5CF6'
        }
      }
    },
  },
  plugins: [],
}
