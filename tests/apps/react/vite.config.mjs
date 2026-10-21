import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
export default defineConfig({
  root: here,
  plugins: [react()],
  publicDir: resolve(here, '../.generated'),
  server: { fs: { allow: [resolve(here, '../../..')] } },
  build: { target: 'esnext', outDir: resolve(here, '../../.build/react'), emptyOutDir: true },
  logLevel: 'warn',
});
