// Built-in component strings. One file per component in ./components/<Name>.js with all locales:
//   export default { en: { copy: 'Copy' } }     (the open source package ships English; other languages come from a language pack
//   that calls defineMessages(component, { ru: {...} }) or from the app via setUiMessages)
// The kit has its own translator: it never depends on the host app's i18n library. Sync it with yours:
//   watch(() => i18n.locale.value, l => setUiLocale(l))        // vue-i18n
//   setUiMessages('ru', { CopyButton: { copy: 'Скопировать' } }) // override single strings from the app
export const LOCALES = ['en', 'uz', 'ru', 'tr', 'zh', 'ar'];
export const RTL_LOCALES = ['ar'];

const registry = {};
const overrides = {};
const subs = new Set();
let locale = 'en';
let version = 0;

const norm = l => { const k = String(l || 'en').toLowerCase().split(/[-_]/)[0]; return LOCALES.includes(k) ? k : 'en'; };
const bump = () => { version++; subs.forEach(f => f(locale)); };

/** Register strings of a component. Calling it again for the same component MERGES locales: an extra pack can add uz, ru, tr, zh, ar on top of the built-in English. */
export function defineMessages(component, messages) {
  const cur = registry[component] || (registry[component] = {});
  for (const [l, msgs] of Object.entries(messages)) cur[l] = { ...(cur[l] || {}), ...msgs };
  return registry[component];
}
export function getUiLocale() { return locale; }
export function isRtlLocale(l = locale) { return RTL_LOCALES.includes(norm(l)); }
export function setUiLocale(l) { const n = norm(l); if (n === locale) return; locale = n; bump(); }
/** Override single strings: setUiMessages('ru', { Pagination: { prev: 'Назад' } }). Call again to change; pass null to clear a locale. */
export function setUiMessages(l, partial) {
  const k = norm(l);
  if (partial === null) delete overrides[k];
  else for (const [c, msgs] of Object.entries(partial || {})) overrides[k] = { ...(overrides[k] || {}), [c]: { ...(overrides[k]?.[c] || {}), ...msgs } };
  bump();
}
export function subscribeUiLocale(fn) { subs.add(fn); return () => subs.delete(fn); }
export function getUiVersion() { return version; }

const fill = (s, p) => (p ? s.replace(/\{(\w+)\}/g, (m, k) => (k in p ? String(p[k]) : m)) : s);

/** Translate a component string. Order: app overrides, component file in the current locale, app overrides in English, component file in English, the key. */
export function t(component, key, params) {
  const hit = overrides[locale]?.[component]?.[key] ?? registry[component]?.[locale]?.[key]
    ?? overrides.en?.[component]?.[key] ?? registry[component]?.en?.[key] ?? key;
  return fill(hit, params);
}

/** Locale-aware helper for numbers and dates in components (uses the browser/Node Intl). */
export const intlLocale = () => ({ en: 'en-US', uz: 'uz-UZ', ru: 'ru-RU', tr: 'tr-TR', zh: 'zh-CN', ar: 'ar' })[locale];
