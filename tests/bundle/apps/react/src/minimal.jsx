import './style.css';
import { createElement as h } from 'react';
import { createRoot } from 'react-dom/client';
import { UiButton, UiCopyButton, UiPagination, UiAlert, UiSelect, UiDataTable, UiEmptyState, UiSearchInput, setUiLocale } from '@ziyarago/ui/react';

const params = Object.fromEntries(new URLSearchParams(location.search));
const locale = params.locale || 'en';
setUiLocale(locale);
document.documentElement.dir = locale === 'ar' ? 'rtl' : 'ltr';
window.__zg = { errors: [], mounted: 0, expected: 1, done: false, fingerprints: {} };
const options = [{ value: 'a', label: 'Alpha' }, { value: 'b', label: 'Beta' }];
const App = () => h('div', { className: 'zg-root p-4 flex flex-col gap-4', 'data-minimal': '' },
  h(UiButton, { variant: 'primary', icon: 'rocket' }, 'Primary'),
  h(UiCopyButton, { value: 'hello' }),
  h(UiPagination, { pages: 12, page: 3 }),
  h(UiAlert, { tone: 'info', title: 'Heads up' }, 'Plain alert'),
  h(UiSelect, { options, modelValue: 'a' }),
  h(UiDataTable, { columns: [{ key: 'name', label: 'Name' }], rows: [{ name: 'Ahmed' }] }),
  h(UiEmptyState, { title: 'Nothing here', description: 'Add something', icon: 'inbox' }),
  h(UiSearchInput, {}));
createRoot(document.getElementById('app'), { onRecoverableError: e => window.__zg.errors.push({ component: 'Minimal', variant: 0, message: String(e) }) }).render(h(App));
setTimeout(() => { window.__zg.mounted = 1; window.__zg.done = true; }, 800);
