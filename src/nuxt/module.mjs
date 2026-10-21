// Nuxt 3/4 module. nuxt.config: modules: ['@ziyarago/ui/nuxt'], ziyarago: { theme: true }
import { defineNuxtModule, addComponent, addImports, addPlugin, createResolver } from '@nuxt/kit';
import { createRequire } from 'node:module';
import { components } from '../core/index.js';
import { themeInitScript } from '../theme.js';

export default defineNuxtModule({
  meta: { name: '@ziyarago/ui', configKey: 'ziyarago', compatibility: { nuxt: '>=3.0.0' } },
  defaults: { css: true, plugins: [], prefix: 'Ui', theme: { theme: 'dark', palette: 'gold', dir: 'ltr', bg: 'none', locale: 'en' } },
  setup(opts, nuxt) {
    const { resolve } = createResolver(import.meta.url);
    if (opts.css) nuxt.options.css.push('@ziyarago/ui/style.css');
    nuxt.options.build.transpile.push('@ziyarago/ui');
    for (const name of Object.keys(components)) {
      addComponent({ name: opts.prefix + name, export: opts.prefix + name, filePath: '@ziyarago/ui/vue' });
    }
    for (const pkg of opts.plugins) {
      nuxt.options.build.transpile.push(pkg);
      let names = [];
      try { names = createRequire(import.meta.url)(pkg + '/names'); } catch { try { names = createRequire(nuxt.options.rootDir + '/')(pkg + '/names'); } catch { console.warn(`[@ziyarago/ui] plugin ${pkg}: cannot load ${pkg}/names`); } }
      for (const name of names) addComponent({ name: opts.prefix + name, export: 'Ui' + name, filePath: pkg + '/vue' });
      if (opts.css) nuxt.options.css.push(pkg + '/style.css');
    }
    addImports([
      { name: 'useUiTheme', from: '@ziyarago/ui/theme' },
      { name: 'fmt', from: '@ziyarago/ui/vue' },
      { name: 'rules', from: '@ziyarago/ui/vue' },
    ]);
    if (opts.theme) {
      nuxt.options.runtimeConfig.public.ziyarago = opts.theme;
      const head = nuxt.options.app.head ||= {};
      head.htmlAttrs = { ...(head.htmlAttrs || {}), 'data-theme': opts.theme.theme, 'data-palette': opts.theme.palette, 'data-bg': opts.theme.bg || 'none', dir: opts.theme.dir };
      addPlugin(resolve('./plugin.mjs'));
      head.script = [...(head.script || []), { innerHTML: themeInitScript, tagPosition: 'head' }];
    }
  },
});
