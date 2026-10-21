// unplugin-vue-components resolver for the compat layer: <UiInput>, <UiTable>, <UiSidebar> ... -> import from '@ziyarago/ui/compat'.
//   Components({ dirs: [], resolvers: [ZiyaragoCompatResolver(), ZiyaragoUiResolver({ exclude: [...] })] })
// Put it BEFORE ZiyaragoUiResolver: names that exist in both kits (UiButton, UiCard, ...) then resolve to the compat wrapper.
import { COMPAT_COMPONENTS } from './map.js';

const NAMES = new Set(COMPAT_COMPONENTS);

/** @param {{ from?: string, exclude?: string[], css?: boolean | string }} [options]  exclude: full component names to leave alone, e.g. ['UiTable']. */
export function ZiyaragoCompatResolver(options = {}) {
  const { from = '@ziyarago/ui/compat', exclude = [], css = false } = options;
  const skip = new Set(exclude);
  const sideEffects = css ? (css === true ? '@ziyarago/ui/style.css' : css) : undefined;
  return {
    type: 'component',
    resolve(name) {
      if (!NAMES.has(name) || skip.has(name)) return;
      return { name, from, ...(sideEffects ? { sideEffects } : {}) };
    },
  };
}

export default ZiyaragoCompatResolver;
