// Size baseline of the isolated bundle audit: the same Vue + vue-i18n app without the kit.
import { createApp, h } from 'vue';
import { createI18n } from 'vue-i18n';
const i18n = createI18n({ legacy: false, locale: 'en', messages: { en: { title: 'Title' } } });
createApp({ render: () => h('div', null, 'base') }).use(i18n).mount('#app');
