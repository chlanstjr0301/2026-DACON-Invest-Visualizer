import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    include: ['xlsx'],
  },
  server: {
    // Proxy /api/* to the backend during development.
    // In production, Nginx handles this reverse proxy (see DEPLOYMENT.md).
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
        // Do not rewrite — backend already has /api prefix
      },
    },
  },
})
