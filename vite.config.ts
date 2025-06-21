import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/tournaments': 'http://localhost:8080',
      '/teams': 'http://localhost:8080',
      '/participants': 'http://localhost:8080',
      '/venues': 'http://localhost:8080',
    },
  },
});
