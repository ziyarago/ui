import './style.css';
import { createApp } from 'vue';
import { createI18n } from 'vue-i18n';
import { setUiLocale } from '@ziyarago/ui/vue';
import Minimal from './Minimal.vue';

// A typical consumer: unplugin-vue-components pulls only the components used in templates, vue-i18n drives the language.
const params = Object.fromEntries(new URLSearchParams(location.search));
const locale = params.locale || 'en';
const i18n = createI18n({ legacy: false, locale, messages: { en: { title: 'Title' }, ar: { title: 'عنوان' }, ru: { title: 'Заголовок' } } });
setUiLocale(locale);
document.documentElement.dir = locale === 'ar' ? 'rtl' : 'ltr';
window.__zg = { errors: [], mounted: 0, expected: 1, done: false, fingerprints: {} };
const app = createApp(Minimal);
app.use(i18n);
app.config.errorHandler = e => window.__zg.errors.push({ component: 'Minimal', variant: 0, message: String(e && e.stack || e) });
app.mount('#app');
setTimeout(() => { window.__zg.mounted = 1; window.__zg.done = true; }, 800);
