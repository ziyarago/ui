// @ziyarago/ui · page templates — real slot contracts. Put inside <UiAppShell>, fill only the slots you need.
// Vue:   <UiPageDashboard title="Dashboard"><template #kpis>…</template></UiPageDashboard>
// React: <UiPageDashboard title="Dashboard" kpis={<…/>} />

const region = (h, id, kids, stick) => (kids == null || (Array.isArray(kids) && !kids.length)) ? null : h('div', { key: id, class: stick ? 'zg-pg__r zg-pg__stick' : 'zg-pg__r', 'data-slot': id }, kids);

const draw = (h, node, ctx) => {
  if (typeof node === 'string') return node === 'header' ? ctx.header() : region(h, node, ctx.slots[node], ctx.stick === node);
  const [kind, ...a] = node, opt = kind === 'two' ? a[2] : kind === 'wrap' ? a[3] : null, st = typeof opt === 'string' && opt.startsWith('sticky:') ? opt.slice(7) : null, go = n => draw(h, n, st ? { ...ctx, stick: st } : ctx), cls = st ? 'zg-pg__two zg-pg__two--sticky' : 'zg-pg__two';
  if (kind === 'col') return h('div', { class: 'zg-pg' }, ...a.map(go));
  if (kind === 'auto') { const min = a.shift(); return h('div', { class: 'zg-pg__auto', style: { '--min': min + 'px' } }, ...a.map(go)); }
  if (kind === 'two') return h('div', { class: cls }, h('div', { class: 'zg-pg__main' }, ...a[0].map(go)), h('div', { class: 'zg-pg__side' }, ...a[1].map(go)));
  if (kind === 'wrap') return h('div', { class: cls }, h('div', { class: 'zg-pg__aside', style: { flexBasis: (a[2] || 300) + 'px' } }, ...a[0].map(go)), h('div', { class: 'zg-pg__main' }, ...a[1].map(go)));
  return null;
};

export const page = (name, slots, tree) => [name, {
  slots,
  render: ({ C, h, props: p, slots: s }) => {
    const header = () => s.header ? region(h, 'header', s.header) : (p.title ? h('div', { class: 'zg-pg__r', 'data-slot': 'header' }, h('div', { class: 'zg-page-head' }, h('div', { style: { flex: 1, minWidth: 0 } }, p.crumbs ? h(C.Breadcrumbs, { items: p.crumbs }) : null, h('h1', null, p.title), p.subtitle ? h('p', null, p.subtitle) : null), s.actions || null)) : (s.actions ? h('div', { class: 'zg-pg__r', 'data-slot': 'header' }, h('div', { class: 'zg-page-head', style: { justifyContent: 'flex-end' } }, s.actions)) : null));
    return h('div', { class: 'zg-pgroot' }, draw(h, tree, { slots: s, header }));
  }
}];

const T = Object.fromEntries([
  page('PageDashboard', ['header', 'hero', 'kpis', 'occupancy', 'funnel', 'top', 'activity'], ['col', 'header', ['auto', 340, 'hero', 'kpis'], ['auto', 360, 'occupancy', 'funnel'], ['auto', 360, 'top', 'activity']]),
  page('PageSettings', ['header', 'subnav', 'profile', 'notifications', 'integrations', 'danger'], ['col', 'header', ['wrap', ['subnav'], ['profile', 'notifications', 'integrations', 'danger'], 220]]),
  page('PageUserList', ['header', 'stats', 'filters', 'toolbar', 'table', 'drawer'], ['col', 'header', 'stats', ['two', ['filters', 'toolbar', 'table'], ['drawer']]]),
  page('PagePricing', ['header', 'toggle', 'plans', 'faq'], ['col', 'header', 'toggle', 'plans', 'faq']),
]);

T.PageAuth = { slots: ['background', 'logo', 'aside', 'form', 'footer'], render: ({ C, h, props: p, slots: s }) => {
  const body = [s.form || null, s.footer ? h('div', { class: 'zg-pg__r', 'data-slot': 'footer' }, s.footer) : null];
  if (C.AuthShowcase && ['photo', 'light', 'tint'].includes(p.layout)) return h(C.AuthShowcase, { variant: p.layout, title: p.title, subtitle: p.subtitle, logo: s.logo, footer: s.footer, image: p.image, headline: p.headline, caption: p.caption, quote: p.quote, chips: p.chips, people: p.people, proof: p.proof, proofHint: p.proofHint }, s.form || null);
  return p.layout === 'split'
    ? h(C.AuthSplit, { title: p.title, subtitle: p.subtitle, logo: s.logo, aside: s.aside }, ...body)
    : h('div', { class: 'zg-pgauth' }, s.background ? h('div', { class: 'zg-pg__r zg-pgauth__bg', 'data-slot': 'background' }, s.background) : null, h('div', { class: 'zg-pgauth__c' }, h(C.AuthLayout, { title: p.title, subtitle: p.subtitle, logo: s.logo }, ...body)));
} };
T.PageStatus = { slots: ['code', 'message', 'action'], render: ({ C, h, props: p, slots: s }) => h(C.StatusPage, { kind: p.kind, title: p.title, description: p.description, onAction: p.onAction, actionLabel: p.actionLabel, notifyLabel: p.notifyLabel, emailLabel: p.emailLabel, onNotify: p.onNotify, codeNode: s.code || undefined, messageNode: s.message || undefined, actionNode: s.action || undefined }) };

export const pages = T;
