// Isolated bundle audit (Pro): one Pro component. No other Pro component and no free component it does not depend on may end up in this bundle.
import { createApp, h } from 'vue';
import { createI18n } from 'vue-i18n';
import { UiLineChart } from '@ziyarago/ui-pro/vue';
const i18n = createI18n({ legacy: false, locale: 'en', messages: { en: { title: 'Title' } } });
createApp({ render: () => h(UiLineChart, { label: 'Revenue', series: [{ key: 'a', label: 'A', data: [{ x: '2025-01-01', y: 3 }, { x: '2025-01-02', y: 5 }] }] }) }).use(i18n).mount('#app');
