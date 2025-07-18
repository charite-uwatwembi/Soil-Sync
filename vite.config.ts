import react from '@vitejs/plugin-react';
import path from 'path';
// Use vitest/config to enable Vitest options in Vite config
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [react()],

  // Vitest configuration
  test: {
    environment: 'jsdom', // Provide DOM APIs like document/window
    globals: true // Allow using global expect/describe without importing everywhere
  },

  server: {
    proxy: {
      '/api/send-sms': {
        target: 'https://soil-sync-nq0s.onrender.com',
        changeOrigin: true,
        rewrite: (path) => '/send-sms'
      }
    }
  },
  build: {
    outDir: 'dist'
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  }
});
