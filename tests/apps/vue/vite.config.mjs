import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
export default defineConfig({
  root: here,
  plugins: [vue()],
  publicDir: resolve(here, '../.generated'),
  server: { fs: { allow: [resolve(here, '../../..')] } },
  build: { target: 'esnext', outDir: resolve(here, '../../.build/vue'), emptyOutDir: true },
  logLevel: 'warn',
});
