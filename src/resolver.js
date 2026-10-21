// Auto-import resolver for unplugin-vue-components (Vite, Webpack, Rollup, Rspack).
//   import Components from 'unplugin-vue-components/vite'
//   import { ZiyaragoUiResolver } from '@ziyarago/ui/resolver'
//   Components({ resolvers: [ZiyaragoUiResolver()] })
// Zero dependencies: it only maps <UiButton> to { name: 'UiButton', from: '@ziyarago/ui/vue' }.
import { components } from './core/index.js';

const NAMES = new Set(Object.keys(components));

/**
 * @param {{ prefix?: string, css?: boolean | string, exclude?: string[], from?: string }} [options]
 *   prefix  component prefix, default 'Ui' (must match the registered names, which are always Ui*)
 *   css     true: import '@ziyarago/ui/style.css' as a side effect together with the first resolved component (once per module that uses one);
 *           a string: import that path instead (for example your own entry that imports the css inside a Tailwind @layer). Default false.
 *   exclude component names (without prefix) that must not be auto-imported, e.g. ['Button'] if you keep your own UiButton.
 *   from    module the components are imported from, default '@ziyarago/ui/vue'
 */
export function ZiyaragoUiResolver(options = {}) {
  const { prefix = 'Ui', css = false, exclude = [], from = '@ziyarago/ui/vue' } = options;
  const skip = new Set(exclude.map(n => n.replace(/^Ui/, '')));
  const sideEffects = css ? (css === true ? '@ziyarago/ui/style.css' : css) : undefined;
  return {
    type: 'component',
    resolve(name) {
      if (!name.startsWith(prefix)) return;
      const bare = name.slice(prefix.length);
      if (!NAMES.has(bare) || skip.has(bare)) return;
      return { name: 'Ui' + bare, from, ...(sideEffects ? { sideEffects } : {}) };
    },
  };
}

export default ZiyaragoUiResolver;
