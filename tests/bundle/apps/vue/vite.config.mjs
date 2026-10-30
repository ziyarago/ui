import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import tailwindcss from '@tailwindcss/vite';
import Components from 'unplugin-vue-components/vite';
import { ZiyaragoUiResolver } from '@ziyarago/ui/resolver';
import { resolve } from 'node:path';

const pro = process.env.ZG_PRO === '1';
export default defineConfig({
  plugins: [
    vue(),
    tailwindcss(),
    Components({ dirs: [], dts: false, resolvers: [ZiyaragoUiResolver(pro ? { plugins: ['@ziyarago/ui-pro'] } : {})] }),
  ],
  build: {
    sourcemap: !!process.env.ZG_ONLY,
    rollupOptions: { input: process.env.ZG_ONLY ? { only: resolve(import.meta.dirname, process.env.ZG_ONLY) } : { main: resolve(import.meta.dirname, 'index.html'), minimal: resolve(import.meta.dirname, 'minimal.html') } },
  },
});
