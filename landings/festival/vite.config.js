import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: '/festival/',
  plugins: [react()],
  build: {
    assetsDir: 'assets',
  },
});
