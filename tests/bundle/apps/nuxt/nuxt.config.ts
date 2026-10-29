import tailwindcss from '@tailwindcss/vite';

const pro = process.env.ZG_PRO === '1';
export default defineNuxtConfig({
  compatibilityDate: '2025-07-01',
  srcDir: '.',
  devtools: { enabled: false },
  telemetry: false,
  // a strict style-src forbids the <style> blocks Nuxt inlines into the HTML
  features: { inlineStyles: false },
  modules: ['@ziyarago/ui/nuxt'],
  ziyarago: { css: false, plugins: pro ? ['@ziyarago/ui-pro'] : [] },
  css: ['~/assets/app.css'],
  vite: {
    plugins: [tailwindcss()],
    define: { __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: 'true' },
  },
});
