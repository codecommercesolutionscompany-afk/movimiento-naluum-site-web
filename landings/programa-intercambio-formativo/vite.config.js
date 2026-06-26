import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: '/programa-intercambio-formativo/',
  plugins: [react()],
  build: {
    assetsDir: 'assets',
  },
});
