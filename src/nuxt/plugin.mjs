import { defineNuxtPlugin, useRuntimeConfig } from '#imports';
import { applySavedLocale, configureTheme, useUiTheme } from '../theme.js';
import { setUiLocale } from '../i18n/index.js';

export default defineNuxtPlugin(nuxtApp => {
  const d = useRuntimeConfig().public.ziyarago || {};
  configureTheme({ theme: d.theme || 'dark', palette: d.palette || 'gold', dir: d.dir || 'ltr', bg: d.bg || 'none', locale: d.locale || 'en' });
  useUiTheme();
  nuxtApp.hook('app:mounted', () => { if (d.locale) setUiLocale(d.locale); applySavedLocale(); });
});
