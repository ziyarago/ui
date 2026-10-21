import { components as base, fmt, setIconBase } from './components.js';
import { more } from './components2.js';
import { more3 } from './components3.js';
import { more4, rules } from './components4.js';
import { pages } from './pages.js';
import { more6 } from './components6.js';
import { more7 } from './components7.js';
export const components = { ...base, ...more, ...more3, ...more4, ...more6, ...more7, ...pages };
export { fmt, setIconBase, rules };
/** Extension API: adds definitions to the shared registry (used by add-on packages such as @ziyarago/ui-pro). Registering the very same definition twice is a no-op (Vue and React adapters can both load one plugin). */
export function registerComponents(defs, { override = false } = {}) {
  for (const name of Object.keys(defs)) if (!override && name in components && components[name] !== defs[name]) throw new Error(`@ziyarago/ui: component "${name}" is already registered (pass { override: true } to replace it)`);
  Object.assign(components, defs);
  return components;
}
export { LOCALES, FREE_LOCALES, t, setUiLocale, getUiLocale, setUiMessages, isRtlLocale, subscribeUiLocale, getUiVersion, defineMessages } from '../i18n/index.js';
import '../i18n/components/index.js';
