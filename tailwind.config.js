/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'bg-principal': '#0a0508',
        'dorado': '#c9a84c',
        'purpura': '#7b2d8b',
        'fuego': '#e85d26',
        'texto': '#f5f0e8',
        'surface': '#130a13',
        'border-custom': '#2a1a2a',
      },
      fontFamily: {
        cinzel: ['Cinzel', 'serif'],
        dm: ['DM Sans', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
