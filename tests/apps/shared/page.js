// Framework-neutral page scaffolding shared by the Vue and React test apps.
// URL params: only=A,B  overlays=1 (only overlay components, opened)  hydrate=1 (hydrate server HTML)  theme=light|dark  dir=rtl|ltr
export const params = Object.fromEntries(new URLSearchParams(location.search));

if (params.fixh) document.documentElement.dataset.fixh = '';

export const state = (window.__zg = { errors: [], mounted: 0, expected: 0, done: false, current: '' });

// Tag console problems with the variant being mounted so the report can name the component.
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
  const examples = await (await fetch('/' + (params.data || 'examples') + '.json')).json();
  let ssr = null;
  if (params.hydrate) ssr = await (await fetch(`/ssr-${window.__zgFramework}.json`)).json();
  const only = params.only ? new Set(params.only.split(',')) : null;
  const items = [];
  const root = document.getElementById('root');
  root.textContent = '';
  for (const ex of examples) {
    const overlayComp = ex.variants.some(v => v.overlay);
    if (only && !only.has(ex.name)) continue;
    if (params.overlays && !overlayComp) continue;
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
      if (variant.overlay) box.setAttribute('data-overlay', '');
      const mountPoint = document.createElement('div');
      mountPoint.className = 'zg-test-mount';
      if (ssr) {
        // Vue puts <Teleport> output in ctx.teleports; a real SSR app injects it into the target, so do the same.
        const entry = ssr[ex.name][idx];
        mountPoint.innerHTML = typeof entry === 'string' ? entry : entry.html;
        if (typeof entry !== 'string') document.body.insertAdjacentHTML('beforeend', entry.tp);
      }
      box.append(mountPoint);
      section.append(box);
      items.push({ name: ex.name, idx, variant, open: !!params.overlays && !!variant.overlay, container: mountPoint });
    });
    root.append(section);
  }
  state.expected = items.length;
  return items;
}

export const finish = () => { state.done = true; };
