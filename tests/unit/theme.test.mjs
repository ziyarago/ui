import { test, describe, beforeEach } from 'node:test';
import assert from 'node:assert/strict';

const store = new Map();
const root = { dataset: {}, dir: '' };
let reduceMotion = false;

const install = () => {
  store.clear(); root.dataset = {}; root.dir = ''; reduceMotion = false;
  globalThis.localStorage = { getItem: k => (store.has(k) ? store.get(k) : null), setItem: (k, v) => store.set(k, String(v)), removeItem: k => store.delete(k) };
  globalThis.document = { documentElement: root };
  globalThis.matchMedia = q => ({ matches: /reduce/.test(q) && reduceMotion });
  globalThis.CSS = { supports: () => true };
  Object.defineProperty(globalThis, 'navigator', { value: { deviceMemory: 8, hardwareConcurrency: 8 }, configurable: true, writable: true });
};
let n = 0;
const fresh = async () => (await import('../../src/theme.js?case=' + n++));

describe('theme controller', () => {
  beforeEach(install);

  test('defaults are applied to <html> when the hook is used', async () => {
    const { useUiTheme } = await fresh();
    const t = useUiTheme();
    assert.deepEqual([t.theme, t.palette, t.dir, t.bg], ['dark', 'gold', 'ltr', 'none']);
    assert.equal(root.dataset.theme, 'dark');
    assert.equal(root.dataset.palette, 'gold');
    assert.equal(root.dir, 'ltr');
    assert.equal(root.dataset.motion, 'on');
    assert.equal(root.dataset.fx, 'full');
  });

  test('setters update the attributes and persist to localStorage', async () => {
    const { useUiTheme } = await fresh();
    const t = useUiTheme();
    t.setTheme('light'); t.setPalette('tamam'); t.setDir('rtl'); t.setBackground('aurora');
    assert.equal(root.dataset.theme, 'light');
    assert.equal(root.dataset.palette, 'tamam');
    assert.equal(root.dir, 'rtl');
    assert.equal(root.dataset.bg, 'aurora');
    assert.deepEqual(JSON.parse(store.get('zg-ui')), { theme: 'light', palette: 'tamam', dir: 'rtl', motion: 'auto', effects: 'auto', bg: 'aurora', locale: 'en' });
  });

  test('toggleTheme flips dark and light', async () => {
    const { useUiTheme } = await fresh();
    const t = useUiTheme();
    t.toggleTheme(); assert.equal(t.theme, 'light'); assert.equal(root.dataset.theme, 'light');
    t.toggleTheme(); assert.equal(t.theme, 'dark');
  });

  test('setLocale: ar means rtl, anything else ltr', async () => {
    const { useUiTheme } = await fresh();
    const t = useUiTheme();
    t.setLocale('ar'); assert.equal(root.dir, 'rtl');
    t.setLocale('en'); assert.equal(root.dir, 'ltr');
  });

  test('saved settings are restored on the next load', async () => {
    store.set('zg-ui', JSON.stringify({ theme: 'light', palette: 'tamam', dir: 'rtl' }));
    const { useUiTheme } = await fresh();
    const t = useUiTheme();
    assert.equal(t.theme, 'light'); assert.equal(t.palette, 'tamam'); assert.equal(t.dir, 'rtl');
    assert.equal(t.bg, 'none', 'missing keys fall back to defaults');
    assert.equal(root.dir, 'rtl');
  });

  test('corrupt localStorage JSON falls back to defaults', async () => {
    store.set('zg-ui', '{not json');
    const { useUiTheme } = await fresh();
    assert.equal(useUiTheme().theme, 'dark');
  });

  test('motion auto follows prefers-reduced-motion; explicit values win', async () => {
    reduceMotion = true;
    const { useUiTheme } = await fresh();
    const t = useUiTheme();
    assert.equal(root.dataset.motion, 'off');
    t.setMotion('on'); assert.equal(root.dataset.motion, 'on');
    t.setMotion('auto'); assert.equal(root.dataset.motion, 'off');
  });

  test('effects auto is lite on weak devices, full otherwise', async () => {
    navigator.deviceMemory = 2;
    const { useUiTheme, resolve } = await fresh();
    const t = useUiTheme();
    assert.equal(root.dataset.fx, 'lite');
    assert.equal(resolve().effects, 'lite');
    t.setEffects('full'); assert.equal(root.dataset.fx, 'full');
    navigator.deviceMemory = 8; t.setEffects('auto'); assert.equal(root.dataset.fx, 'full');
  });

  test('effects auto is lite without backdrop-filter or oklch support', async () => {
    CSS.supports = p => p !== 'backdrop-filter';
    const { capable } = await fresh();
    assert.equal(capable(), false);
  });

  test('subscribe receives snapshots and can unsubscribe', async () => {
    const { useUiTheme } = await fresh();
    const t = useUiTheme();
    const seen = [];
    const off = t.subscribe(s => seen.push(s.theme));
    t.setTheme('light'); off(); t.setTheme('dark');
    assert.deepEqual(seen, ['light']);
    const snap = t.snapshot(); snap.theme = 'x'; assert.notEqual(t.theme, 'x', 'snapshot is a copy');
  });

  test('themeInitScript sets the attributes before first paint', async () => {
    const { themeInitScript } = await fresh();
    store.set('zg-ui', JSON.stringify({ theme: 'light', palette: 'tamam', dir: 'rtl', bg: 'mesh', motion: 'off', effects: 'lite' }));
    new Function(themeInitScript)();
    assert.deepEqual({ ...root.dataset }, { theme: 'light', palette: 'tamam', bg: 'mesh', motion: 'off', fx: 'lite' });
    assert.equal(root.dir, 'rtl');
  });

  test('SSR safety: no document, no localStorage', async () => {
    delete globalThis.document; delete globalThis.localStorage;
    const { useUiTheme } = await fresh();
    const t = useUiTheme();
    assert.equal(t.theme, 'dark');
    t.setTheme('light'); assert.equal(t.theme, 'light');
  });
});
