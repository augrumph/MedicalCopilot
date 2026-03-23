import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    headers: {
      'Cross-Origin-Opener-Policy': 'same-origin-allow-popups',
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    // Target modern browsers — smaller bundles
    target: 'es2020',
    // Warn when any chunk exceeds 800kb
    chunkSizeWarningLimit: 800,
    rollupOptions: {
      output: {
        manualChunks: {
          // Core React runtime — cached long-term
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          // UI libraries
          'vendor-ui': ['@radix-ui/react-dialog', '@radix-ui/react-dropdown-menu', 'framer-motion', 'lucide-react'],
          // Data layer
          'vendor-data': ['@tanstack/react-query', 'zustand'],
          // AI/audio — heavy, loaded only when needed
          'vendor-ai': ['@google/generative-ai'],
          // Chart/analytics
          'vendor-charts': ['recharts'],
        },
      },
    },
  },
})
