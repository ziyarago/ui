import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { resolve } from 'node:path';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: { rollupOptions: { input: process.env.ZG_ONLY ? { only: resolve(import.meta.dirname, process.env.ZG_ONLY) } : { main: resolve(import.meta.dirname, 'index.html'), minimal: resolve(import.meta.dirname, 'minimal.html') } } },
});
