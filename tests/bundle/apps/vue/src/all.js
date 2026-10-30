// Isolated bundle audit: the whole namespace is used, so every component stays in.
import { createApp, h } from 'vue';
import { createI18n } from 'vue-i18n';
import * as UI from '@ziyarago/ui/vue';
const i18n = createI18n({ legacy: false, locale: 'en', messages: { en: { title: 'Title' } } });
window.__all = UI;
createApp({ render: () => h('div', null, 'all') }).use(i18n).mount('#app');
