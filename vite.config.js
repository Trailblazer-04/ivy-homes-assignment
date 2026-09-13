import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  root: 'frontend',
  server: { host: '0.0.0.0', port: 5173, strictPort: true, proxy: { '/api': 'http://localhost:4000' } },
  build: { outDir: '../dist', emptyOutDir: true }
});