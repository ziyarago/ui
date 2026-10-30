// @ziyarago/ui · components, part 4 — gaps closed after the Vuexy audit.
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
export const more4 = {
  Footer: { render: ({ h, props: p, children }) => h('footer', { class: 'zg-foot' }, h('span', { class: 'zg-u-fcopy' }, p.copyright || '© 2026 ZiyaraGo'), h('nav', { class: 'zg-u-fnav' }, ...(p.links || []).map((l, i) => h('a', { key: i + ':' + l.label, href: l.href || '#', class: 'zg-u-flink' }, l.label))), ...children) },
};
