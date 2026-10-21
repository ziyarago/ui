// Auto-import resolver for unplugin-vue-components (Vite, Webpack, Rollup, Rspack).
//   import Components from 'unplugin-vue-components/vite'
//   import { ZiyaragoUiResolver } from '@ziyarago/ui/resolver'
//   Components({ resolvers: [ZiyaragoUiResolver()] })
// Zero dependencies: it only maps <UiButton> to { name: 'UiButton', from: '@ziyarago/ui/vue' }.
import { createRequire } from 'node:module';
import { components } from './core/index.js';

const NAMES = new Set(Object.keys(components));

// Plugin packages (see docs-private/PRO-SPLIT.md, "Plugin contract") export ./names (JSON array of component names without the Ui prefix) and ./vue.
// A plugin may be a package name or { from, names } for tests and custom setups.
const loadPlugin = p => {
  if (typeof p !== 'string') return { from: p.from, names: new Set(p.names) };
  const req = createRequire(process.cwd() + '/');
  return { from: p + '/vue', names: new Set(req(p + '/names')) };
};

/**
 * @param {{ prefix?: string, css?: boolean | string, exclude?: string[], from?: string, plugins?: Array<string | { from: string, names: string[] }> }} [options]
 *   prefix  component prefix, default 'Ui' (must match the registered names, which are always Ui*)
 *   css     true: import '@ziyarago/ui/style.css' as a side effect together with the first resolved component (once per module that uses one);
 *           a string: import that path instead (for example your own entry that imports the css inside a Tailwind @layer). Default false.
 *   exclude component names (without prefix) that must not be auto-imported, e.g. ['Button'] if you keep your own UiButton.
 *   from    module the components are imported from, default '@ziyarago/ui/vue'
 *   plugins add-on packages whose components auto-import too: ['@ziyarago/ui-pro'] (needs its ./names and ./vue exports) or [{ from, names }]
 */
export function ZiyaragoUiResolver(options = {}) {
  const { prefix = 'Ui', css = false, exclude = [], from = '@ziyarago/ui/vue', plugins = [] } = options;
  const loaded = plugins.map(loadPlugin);
  const skip = new Set(exclude.map(n => n.replace(/^Ui/, '')));
  const sideEffects = css ? (css === true ? '@ziyarago/ui/style.css' : css) : undefined;
  return {
    type: 'component',
    resolve(name) {
      if (!name.startsWith(prefix)) return;
      const bare = name.slice(prefix.length);
      if (skip.has(bare)) return;
      const pl = NAMES.has(bare) ? null : loaded.find(x => x.names.has(bare));
      if (!pl && !NAMES.has(bare)) return;
      return { name: 'Ui' + bare, from: pl ? pl.from : from, ...(sideEffects ? { sideEffects } : {}) };
    },
  };
}

export default ZiyaragoUiResolver;
