// Isolated bundle audit (Pro): the whole namespace is used, so every Pro component stays in.
import { createApp, h } from 'vue';
import { createI18n } from 'vue-i18n';
import * as PRO from '@ziyarago/ui-pro/vue';
const i18n = createI18n({ legacy: false, locale: 'en', messages: { en: { title: 'Title' } } });
window.__all = PRO;
createApp({ render: () => h('div', null, 'all') }).use(i18n).mount('#app');
