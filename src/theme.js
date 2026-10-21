import { setUiLocale, isRtlLocale, LOCALES } from './i18n/index.js';
// Framework-free theme controller: palette, theme, direction, motion, effects, background → attributes on <html>. Persists to localStorage.
const KEY = 'zg-ui';
export const PALETTES = ['gold', 'tamam'];
export const BACKGROUNDS = ['none', 'aurora', 'sunset', 'ocean', 'emerald', 'rose', 'mesh'];
const DEFAULTS = { theme: 'dark', palette: 'gold', dir: 'ltr', motion: 'auto', effects: 'auto', bg: 'none', locale: 'en' };
const read = () => { try { return JSON.parse(localStorage.getItem(KEY) || '{}'); } catch { return {}; } };
let cur = typeof localStorage === 'undefined' ? { ...DEFAULTS } : { ...DEFAULTS, ...read() };

/** Set the app defaults (used when the visitor has no saved choice). Call before the first useUiTheme(). */
export function configureTheme(defaults = {}) {
  cur = typeof localStorage === 'undefined' ? { ...DEFAULTS, ...defaults } : { ...DEFAULTS, ...defaults, ...read() };
}
const subs = new Set();

export const capable = () => {
  if (typeof CSS === 'undefined' || !CSS.supports) return true;
  const mem = typeof navigator !== 'undefined' ? navigator.deviceMemory : undefined;
  const cores = typeof navigator !== 'undefined' ? navigator.hardwareConcurrency : undefined;
  return CSS.supports('backdrop-filter', 'blur(1px)') && CSS.supports('color', 'oklch(0.5 0.1 100)') && (mem == null || mem >= 4) && (cores == null || cores >= 4);
};
const reduced = () => typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches;
export const resolve = (s = cur) => ({
  motion: s.motion === 'auto' ? (reduced() ? 'off' : 'on') : s.motion,
  effects: s.effects === 'auto' ? (capable() ? 'full' : 'lite') : s.effects,
});

const apply = () => {
  if (typeof document === 'undefined') return;
  const r = document.documentElement, v = resolve();
  r.dataset.theme = cur.theme; r.dataset.palette = cur.palette; r.dir = cur.dir; r.lang = cur.locale;
  r.dataset.motion = v.motion; r.dataset.fx = v.effects; r.dataset.bg = cur.bg;
  try { localStorage.setItem(KEY, JSON.stringify(cur)); } catch {}
  subs.forEach(f => f({ ...cur }));
};

/** Inline script for <head>: applies the saved settings before first paint (no flash). */
export const themeInitScript = `try{var s=JSON.parse(localStorage.getItem('${KEY}')||'{}'),r=document.documentElement,d=r.dataset;if(s.theme)d.theme=s.theme;if(s.palette)d.palette=s.palette;if(s.dir)r.dir=s.dir;if(s.locale)r.lang=s.locale;if(s.bg)d.bg=s.bg;var m=s.motion||'auto',f=s.effects||'auto';d.motion=m==='auto'?(matchMedia('(prefers-reduced-motion: reduce)').matches?'off':'on'):m;d.fx=f==='auto'?((CSS.supports('backdrop-filter','blur(1px)')&&(navigator.deviceMemory||8)>=4&&(navigator.hardwareConcurrency||8)>=4)?'full':'lite'):f}catch(e){}`;

/** Apply the saved language to the built-in strings. Call AFTER the first render/hydration (the Nuxt module does it on app:mounted). */
export function applySavedLocale() { if (cur.locale && cur.locale !== 'en') setUiLocale(cur.locale); }

export function useUiTheme() {
  if (typeof document !== 'undefined') apply();
  const set = o => { cur = { ...cur, ...o }; apply(); };
  return {
    get theme() { return cur.theme; }, get palette() { return cur.palette; }, get dir() { return cur.dir; },
    get motion() { return cur.motion; }, get effects() { return cur.effects; }, get bg() { return cur.bg; },
    get resolved() { return resolve(); },
    palettes: PALETTES, backgrounds: BACKGROUNDS,
    setTheme: t => set({ theme: t }), toggleTheme: () => set({ theme: cur.theme === 'dark' ? 'light' : 'dark' }),
    setPalette: p => set({ palette: p }), setDir: d => set({ dir: d }),
    /** Language of the built-in component strings. Also sets dir (rtl for Arabic) and <html lang>. */
    get locale() { return cur.locale; }, locales: LOCALES,
    setLocale: l => { setUiLocale(l); set({ locale: String(l).toLowerCase().split(/[-_]/)[0], dir: isRtlLocale(l) ? 'rtl' : 'ltr' }); },
    /** 'auto' follows prefers-reduced-motion, 'on' enables animations, 'off' disables them */
    setMotion: m => set({ motion: m }),
    /** 'auto' picks by browser capability, 'full' = blur, glow and animated backgrounds, 'lite' = flat and fast */
    setEffects: e => set({ effects: e }),
    setBackground: b => set({ bg: b }),
    subscribe: f => { subs.add(f); return () => subs.delete(f); },
    snapshot: () => ({ ...cur }),
  };
}
