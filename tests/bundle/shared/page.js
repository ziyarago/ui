// Framework-neutral page scaffolding of the consumer apps.
// URL params: locale=en|ar|ru  dir=ltr|rtl  theme=dark|light  overlays=1 (only overlay variants, opened)  kebab=1 (Vue: kebab-case props)  only=A,B
import { params } from './params.js';
export { params };
export const state = (window.__zg = { errors: [], mounted: 0, expected: 0, done: false, current: '', fingerprints: {} });

for (const k of ['error', 'warn']) {
  const orig = console[k].bind(console);
  console[k] = (...a) => orig(...a, state.current ? ' @@' + state.current : '');
}

export const report = (name, idx, err) => {
  const message = (err && (err.stack || err.message)) || String(err);
  state.errors.push({ component: name, variant: idx, message: String(message).split('\n').slice(0, 4).join('\n') });
  const el = document.querySelector(`[data-component="${name}"] [data-variant="${idx}"]`);
  if (el) el.setAttribute('data-error', String(err && err.message || err).slice(0, 300));
};

export async function load() {
  const data = await (await fetch('/examples.json')).json();
  window.__zgData = { edition: data.edition };
  const only = params.only ? new Set(params.only.split(',')) : null;
  const items = [];
  const root = document.getElementById('root');
  root.textContent = '';
  for (const ex of data.examples) {
    if (only && !only.has(ex.name)) continue;
    if (params.overlays && !ex.variants.some(v => v.overlay)) continue;
    const section = document.createElement('section');
    section.setAttribute('data-component', ex.name);
    const h = document.createElement('h2');
    h.textContent = ex.name;
    section.append(h);
    ex.variants.forEach((variant, idx) => {
      if (params.overlays && !variant.overlay) return;
      const box = document.createElement('div');
      box.setAttribute('data-variant', String(idx));
      box.setAttribute('data-label', variant.label);
      const mountPoint = document.createElement('div');
      mountPoint.className = 'zg-test-mount';
      box.append(mountPoint);
      section.append(box);
      items.push({ name: ex.name, idx, variant, open: !!params.overlays && !!variant.overlay, container: mountPoint, proNames: data.proNames });
    });
    root.append(section);
  }
  state.expected = items.length;
  return items;
}

/** Stable text fingerprint of a mounted variant (ids and uid counters normalised) used to compare two runs of the same page. */
export const fingerprint = el => el.innerHTML.replace(/--zg-icon:\s*url\([^;]*\);?/g, '').replace(/\bzg[0-9a-z]{1,6}(-[a-z0-9]+)?\b/g, 'ID').replace(/\s+/g, ' ');
export const finish = () => { state.done = true; };
