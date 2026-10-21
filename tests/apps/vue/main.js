import { createApp, createSSRApp, h } from 'vue';
import '../shared/style.css';
import { Preview } from '../../lib/preview-vue.js';
import { useUiTheme } from '../../../src/vue/index.js';
import { params, report, load, finish, state } from '../shared/page.js';

const theme = useUiTheme();
if (params.theme) theme.setTheme(params.theme);
if (params.dir) theme.setDir(params.dir);

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
