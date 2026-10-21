import { defineNuxtPlugin, useRuntimeConfig } from '#imports';
import { useUiTheme } from '../theme.js';

export default defineNuxtPlugin(() => {
  const ui = useUiTheme();
  const d = useRuntimeConfig().public.ziyarago || {};
  const saved = (() => { try { return localStorage.getItem('zg-ui'); } catch { return null; } })();
  if (!saved) { ui.setTheme(d.theme || 'dark'); ui.setPalette(d.palette || 'gold'); ui.setDir(d.dir || 'ltr'); }
});
