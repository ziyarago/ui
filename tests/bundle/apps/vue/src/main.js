import './style.css';
import { createApp, h } from 'vue';
import { createI18n } from 'vue-i18n';
import { Preview, setProNames } from '../auditkit/preview-vue.js';
import { UI } from '../auditkit/ui-entry.js';
import { useUiTheme } from '@ziyarago/ui/vue';
import { t } from '@ziyarago/ui/internal';
import { params, report, load, finish, state, fingerprint } from '../auditkit/page.js';

const theme = useUiTheme();
theme.setEffects('full');
theme.setTheme(params.theme || 'dark');
if (params.locale) theme.setLocale(params.locale);
if (params.dir) theme.setDir(params.dir);
window.__zgT = t;
window.__zgNames = Object.keys(UI);

const i18n = createI18n({ legacy: false, locale: params.locale || 'en', messages: { en: { hello: 'Hello' } } });
const items = await load();
if (items[0]) setProNames(items[0].proNames);
for (const it of items) {
  state.current = it.name + '#' + it.idx;
  try {
    const app = createApp({ render: () => h(Preview, { name: it.name, variant: it.variant, open: it.open }) });
    app.use(i18n);
    app.config.errorHandler = err => report(it.name, it.idx, err);
    app.mount(it.container);
  } catch (err) { report(it.name, it.idx, err); }
  state.mounted++;
}
await new Promise(r => setTimeout(r, 600));
for (const it of items) state.fingerprints[it.name + '#' + it.idx] = fingerprint(it.container);
finish();
