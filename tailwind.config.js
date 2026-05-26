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
        'titulo': '#4ecdc4',
        'titulo-secundario': '#00a86b',
        'texto': '#ffffff',
        'tarjeta-borde': '#2d6a4f',
        'boton-primario': '#00a86b',
        'boton-secundario': '#4ecdc4',
      },
      fontFamily: {
        cinzel: ['Cinzel', 'serif'],
        dm: ['DM Sans', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
