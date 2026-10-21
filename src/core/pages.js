// @ziyarago/ui · page templates — real slot contracts. Put inside <UiAppShell>, fill only the slots you need.
// Vue:   <UiPageDashboard title="Dashboard"><template #kpis>…</template></UiPageDashboard>
// React: <UiPageDashboard title="Dashboard" kpis={<…/>} />
import { cx } from './components.js';

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

const page = (name, slots, tree) => [name, {
  slots,
  render: ({ C, h, props: p, slots: s }) => {
    const header = () => s.header ? region(h, 'header', s.header) : (p.title ? h('div', { class: 'zg-pg__r', 'data-slot': 'header' }, h('div', { class: 'zg-page-head' }, h('div', { style: { flex: 1, minWidth: 0 } }, p.crumbs ? h(C.Breadcrumbs, { items: p.crumbs }) : null, h('h1', null, p.title), p.subtitle ? h('p', null, p.subtitle) : null), s.actions || null)) : (s.actions ? h('div', { class: 'zg-pg__r', 'data-slot': 'header' }, h('div', { class: 'zg-page-head', style: { justifyContent: 'flex-end' } }, s.actions)) : null));
    return h('div', { class: 'zg-pgroot' }, draw(h, tree, { slots: s, header }));
  }
}];

const T = Object.fromEntries([
  page('PageDashboard', ['header', 'hero', 'kpis', 'occupancy', 'funnel', 'top', 'activity'], ['col', 'header', ['auto', 340, 'hero', 'kpis'], ['auto', 360, 'occupancy', 'funnel'], ['auto', 360, 'top', 'activity']]),
  page('PagePatterns', ['header', 'hero', 'strip', 'statlines', 'chartcard', 'tiles', 'listrows', 'countries', 'versus', 'segbar', 'activity', 'actioncard'], ['col', 'header', ['auto', 340, 'hero', 'strip'], 'statlines', ['auto', 360, 'chartcard', 'tiles'], ['auto', 320, 'listrows', 'countries', 'versus'], 'segbar', ['auto', 360, 'activity', 'actioncard']]),
  page('PageCrm', ['header', 'summary', 'filters', 'board', 'calls'], ['col', 'header', 'summary', 'filters', 'board', 'calls']),
  page('PageBookings', ['header', 'stats', 'toolbar', 'bulk', 'table', 'pager'], ['col', 'header', 'stats', 'toolbar', 'bulk', 'table', 'pager']),
  page('PageCatalog', ['header', 'filters', 'toolbar', 'grid', 'pager'], ['col', 'header', ['wrap', ['filters'], ['toolbar', 'grid', 'pager'], 260]]),
  page('PageDetail', ['header', 'gallery', 'summary', 'tabs', 'history', 'booking'], ['col', 'header', ['two', ['gallery', 'summary', 'tabs', 'history'], ['booking']]]),
  page('PageSettings', ['header', 'subnav', 'profile', 'notifications', 'integrations', 'danger'], ['col', 'header', ['wrap', ['subnav'], ['profile', 'notifications', 'integrations', 'danger'], 220]]),
  page('PageUserList', ['header', 'stats', 'filters', 'toolbar', 'table', 'drawer'], ['col', 'header', 'stats', ['two', ['filters', 'toolbar', 'table'], ['drawer']]]),
  page('PageProfile', ['header', 'profile', 'tabs', 'about', 'activity', 'plan'], ['col', 'header', 'profile', 'tabs', ['wrap', ['about'], ['activity', 'plan'], 320]]),
  page('PageForm', ['header', 'main', 'media', 'side', 'actions'], ['col', 'header', ['two', ['main', 'media'], ['side']]]),
  page('PageOrder', ['header', 'status', 'items', 'shipping', 'side'], ['col', 'header', 'status', ['two', ['items', 'shipping'], ['side']]]),
  page('PageAccount', ['header', 'tabs', 'panel'], ['col', 'header', 'tabs', 'panel']),
  page('PagePricing', ['header', 'toggle', 'plans', 'faq'], ['col', 'header', 'toggle', 'plans', 'faq']),
  page('PageFaq', ['header', 'search', 'cats', 'answers', 'contact'], ['col', 'header', 'search', ['wrap', ['cats'], ['answers'], 200], 'contact']),
  page('PageLanding', ['hero', 'logos', 'features', 'proof', 'pricing', 'cta', 'footer'], ['col', 'hero', 'logos', 'features', 'proof', 'pricing', 'cta', 'footer']),
  page('PageOnboarding', ['header', 'progress', 'steps', 'checklist', 'tips'], ['col', 'header', 'progress', ['two', ['steps', 'checklist'], ['tips']]]),
  page('PageCheckout', ['header', 'steps', 'items', 'address', 'payment', 'summary'], ['col', 'header', 'steps', ['two', ['items', 'address', 'payment'], ['summary']]]),
  page('PageInbox', ['header', 'filters', 'list', 'thread', 'composer', 'customer'], ['col', 'header', ['wrap', ['filters', 'list'], [['two', ['thread', 'composer'], ['customer']]], 320]]),
  page('PageNotifications', ['header', 'filters', 'feed', 'empty'], ['col', 'header', 'filters', 'feed', 'empty']),
  page('PageAnalytics', ['header', 'period', 'kpis', 'trend', 'breakdown', 'table'], ['col', 'header', 'period', 'kpis', ['auto', 420, 'trend', 'breakdown'], 'table']),
  page('PageCalendar', ['header', 'toolbar', 'grid', 'mini', 'details'], ['col', 'header', 'toolbar', ['two', ['grid'], ['mini', 'details']]]),
  page('PageKanban', ['header', 'filters', 'board', 'detail'], ['col', 'header', 'filters', ['two', ['board'], ['detail']]]),
  page('PageBilling', ['header', 'plan', 'usage', 'invoices', 'methods', 'upgrade'], ['col', 'header', ['two', ['plan', 'usage', 'invoices'], ['methods', 'upgrade']]]),
  page('PageTeam', ['header', 'stats', 'members', 'roles', 'invite'], ['col', 'header', 'stats', ['two', ['members', 'roles'], ['invite']]]),
  page('PageIntegrations', ['header', 'filters', 'connections', 'keys', 'webhooks'], ['col', 'header', 'filters', 'connections', ['auto', 420, 'keys', 'webhooks']]),
  page('PageSearch', ['header', 'search', 'filters', 'results', 'empty'], ['col', 'header', 'search', ['wrap', ['filters'], ['results', 'empty'], 260]]),
  page('PageArticle', ['header', 'cover', 'body', 'toc', 'share', 'related'], ['col', 'header', 'cover', ['two', ['body', 'share', 'related'], ['toc'], 'sticky:toc']]),
  page('PageChangelog', ['header', 'filters', 'timeline', 'subscribe'], ['col', 'header', ['two', ['filters', 'timeline'], ['subscribe'], 'sticky:subscribe']]),
  page('PageHelp', ['header', 'search', 'categories', 'popular', 'contact'], ['col', 'header', 'search', 'categories', ['auto', 360, 'popular', 'contact']]),
  page('PageStates', ['header', 'empty', 'noresults', 'forbidden', 'offline', 'error', 'loading', 'success'], ['col', 'header', ['auto', 300, 'empty', 'noresults', 'forbidden'], ['auto', 300, 'offline', 'error', 'loading'], 'success']),
  page('PageLegal', ['header', 'meta', 'toc', 'document', 'contact'], ['col', 'header', 'meta', ['wrap', ['toc'], ['document', 'contact'], 260, 'sticky:toc']]),
  page('PageLocations', ['header', 'filters', 'list', 'map'], ['col', 'header', 'filters', ['wrap', ['list'], ['map'], 380, 'sticky:map']]),
  page('PageBookingFlow', ['header', 'steps', 'content', 'nav', 'summary'], ['col', 'header', 'steps', ['two', ['content', 'nav'], ['summary'], 'sticky:summary']])
]);

T.PageAuth = { slots: ['background', 'logo', 'aside', 'form', 'footer'], render: ({ C, h, props: p, slots: s }) => {
  const body = [s.form || null, s.footer ? h('div', { class: 'zg-pg__r', 'data-slot': 'footer' }, s.footer) : null];
  if (['photo', 'light', 'tint'].includes(p.layout)) return h(C.AuthShowcase, { variant: p.layout, title: p.title, subtitle: p.subtitle, logo: s.logo, footer: s.footer, image: p.image, headline: p.headline, caption: p.caption, quote: p.quote, chips: p.chips, people: p.people, proof: p.proof, proofHint: p.proofHint }, s.form || null);
  return p.layout === 'split'
    ? h(C.AuthSplit, { title: p.title, subtitle: p.subtitle, logo: s.logo, aside: s.aside }, ...body)
    : h('div', { class: 'zg-pgauth' }, s.background ? h('div', { class: 'zg-pg__r zg-pgauth__bg', 'data-slot': 'background' }, s.background) : null, h('div', { class: 'zg-pgauth__c' }, h(C.AuthLayout, { title: p.title, subtitle: p.subtitle, logo: s.logo }, ...body)));
} };
T.PageStatus = { slots: ['code', 'message', 'action'], render: ({ C, h, props: p, slots: s }) => h(C.StatusPage, { kind: p.kind, title: p.title, description: p.description, onAction: p.onAction, actionLabel: p.actionLabel, notifyLabel: p.notifyLabel, emailLabel: p.emailLabel, onNotify: p.onNotify, codeNode: s.code || undefined, messageNode: s.message || undefined, actionNode: s.action || undefined }) };

export const pages = T;
