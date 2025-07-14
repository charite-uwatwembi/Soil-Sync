import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [react()],
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
    outDir: 'dist',
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
