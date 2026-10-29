import { createApp, createSSRApp, h, shallowRef } from 'vue';
import '../shared/style.css';
import { Preview } from '../../lib/preview-vue.js';
import { useUiTheme } from '../../../src/vue/index.js';
import { params, report, load, finish, state } from '../shared/page.js';

const theme = useUiTheme();
if (params.theme) theme.setTheme(params.theme);
if (params.dir) theme.setDir(params.dir);
if (params.palette) theme.setPalette(params.palette);
if (params.motion) theme.setMotion(params.motion);

const items = await load();
for (const it of items) {
  state.current = it.name + '#' + it.idx;
  try {
    const app = (params.hydrate ? createSSRApp : createApp)({ render: () => h(Preview, { name: it.name, variant: it.variant, open: it.open }) });
    app.config.errorHandler = (err) => report(it.name, it.idx, err);
    app.mount(it.container);
  } catch (err) { report(it.name, it.idx, err); }
  state.mounted++;
}
await new Promise(r => setTimeout(r, 300));
finish();

// Mount API for scripted flows (tests/behaviour/flows.mjs): mount a docs-format variant, swap it, unmount it.
let flowId = 0;
const flows = new Map();
window.__zgMount = (name, variant, open) => {
  const id = ++flowId, el = document.createElement('div');
  el.setAttribute('data-flow', String(id));
  document.getElementById('root').append(el);
  const v = shallowRef(variant);
  const app = createApp({ render: () => h(Preview, { name, variant: v.value, open: !!open }) });
  app.config.errorHandler = err => report(name, id, err);
  app.mount(el);
  flows.set(id, { app, v, el });
  return id;
};
window.__zgSet = (id, variant) => { flows.get(id).v.value = variant; };
window.__zgUnmount = id => { const f = flows.get(id); f.app.unmount(); f.el.remove(); flows.delete(id); };
