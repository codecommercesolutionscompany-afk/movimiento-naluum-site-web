import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: '/voluntariado-otono-invierno/',
  plugins: [react()],
  build: {
    assetsDir: 'assets',
  },
});
