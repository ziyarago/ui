// Nuxt 3/4 module. nuxt.config: modules: ['@ziyarago/ui/nuxt'], ziyarago: { theme: true }
import { defineNuxtModule, addComponent, addImports, addPlugin, createResolver } from '@nuxt/kit';
import { components } from '../core/index.js';
import { themeInitScript } from '../theme.js';

export default defineNuxtModule({
  meta: { name: '@ziyarago/ui', configKey: 'ziyarago', compatibility: { nuxt: '>=3.0.0' } },
  defaults: { css: true, prefix: 'Ui', theme: { theme: 'dark', palette: 'gold', dir: 'ltr' } },
  setup(opts, nuxt) {
    const { resolve } = createResolver(import.meta.url);
    if (opts.css) nuxt.options.css.push('@ziyarago/ui/style.css');
    nuxt.options.build.transpile.push('@ziyarago/ui');
    for (const name of Object.keys(components)) {
      addComponent({ name: opts.prefix + name, export: opts.prefix + name, filePath: '@ziyarago/ui/vue' });
    }
    addImports([
      { name: 'useUiTheme', from: '@ziyarago/ui/theme' },
      { name: 'fmt', from: '@ziyarago/ui/vue' },
      { name: 'rules', from: '@ziyarago/ui/vue' },
    ]);
    if (opts.theme) {
      nuxt.options.runtimeConfig.public.ziyarago = opts.theme;
      const head = nuxt.options.app.head ||= {};
      head.htmlAttrs = { ...(head.htmlAttrs || {}), 'data-theme': opts.theme.theme, 'data-palette': opts.theme.palette, dir: opts.theme.dir };
      addPlugin(resolve('./plugin.mjs'));
      head.script = [...(head.script || []), { innerHTML: themeInitScript, tagPosition: 'head' }];
    }
  },
});
