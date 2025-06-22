import react from '@vitejs/plugin-react';
import wyw from '@wyw-in-js/vite';
import { defineConfig } from 'vite';

const BASE_URL = process.env.BASE_URL || "";

export default defineConfig({
  base: `${BASE_URL}/`,
  plugins: [
    react(),
    wyw(),
  ]
})
