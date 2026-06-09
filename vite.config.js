import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api/ollin': {
        target: 'http://localhost:10001',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/ollin/, ''),
      },
      '/socket.io': {
        target: 'http://localhost:10001',
        ws: true,
      },
    },
  },
})
