// Isolated bundle audit (Pro): 8 Pro components.
import { createApp, h } from 'vue';
import { createI18n } from 'vue-i18n';
import { UiLineChart, UiDonutChart, UiHotelCard, UiLeadCard, UiKanbanColumn, UiActionCard, UiPricingCard, UiTreeSelect } from '@ziyarago/ui-pro/vue';
const items = [
  [UiLineChart, { label: 'Revenue', series: [{ key: 'a', label: 'A', data: [{ x: '2025-01-01', y: 3 }, { x: '2025-01-02', y: 5 }] }] }],
  [UiDonutChart, { label: 'Share', data: [{ label: 'A', value: 3 }, { label: 'B', value: 5 }] }],
  [UiHotelCard, { name: 'Hotel', stars: 5, rating: 9.1 }],
  [UiLeadCard, { name: 'Lead', phone: '+1 555 0100' }],
  [UiKanbanColumn, { title: 'New' }],
  [UiActionCard, { title: 'Card' }],
  [UiPricingCard, { name: 'Plan', price: '9' }],
  [UiTreeSelect, { options: [{ value: 'a', label: 'A' }] }],
];
const i18n = createI18n({ legacy: false, locale: 'en', messages: { en: { title: 'Title' } } });
createApp({ render: () => h('div', null, items.map(([c, p]) => h(c, p))) }).use(i18n).mount('#app');
