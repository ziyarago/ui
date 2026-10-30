// Isolated bundle audit: one component. Nothing else of the kit may end up in this bundle.
import { createApp, h } from 'vue';
import { createI18n } from 'vue-i18n';
import { UiButton } from '@ziyarago/ui/vue';
const i18n = createI18n({ legacy: false, locale: 'en', messages: { en: { title: 'Title' } } });
createApp({ render: () => h(UiButton, { variant: 'primary' }, () => 'Button') }).use(i18n).mount('#app');
