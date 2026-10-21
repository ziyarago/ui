import type { Example } from '../types'

const crumbs = [{ label: 'Home' }, { label: 'Section' }]

const e = (name: string, description: string, props: Record<string, any>, slots: Record<string, any>, label = 'Default'): Example => ({
  name,
  description,
  variants: [{ label, width: '100%', props, slots }],
})

const examples: Example[] = [
  e('PageDashboard', 'Dashboard layout. Slots: header, hero, kpis, occupancy, funnel, top, activity; title/subtitle build the header.', { title: 'Dashboard', subtitle: 'Today across all hotels' }, {
  hero: [{ name: 'HeroBanner', props: { title: 'Ramadan season', text: 'Bookings are 18% ahead of last year.', cta: 'View report' } }],
  kpis: [{ name: 'HStack', props: { gap: 12, wrap: true }, children: [
    { name: 'KpiTile', props: { label: 'Bookings', value: '1 248' } },
    { name: 'KpiTile', props: { label: 'Revenue, SAR', value: '3.4M' } },
    { name: 'KpiTile', props: { label: 'Occupancy', value: '92%' } },
  ] }],
  occupancy: [{ name: 'Card', props: { title: 'Occupancy, last 7 days' }, children: [{ name: 'OccupancyChart', props: { values: [72, 80, 88, 94, 97, 91, 85] } }] }],
  funnel: [{ name: 'Card', props: { title: 'Sales funnel' }, children: [{ name: 'SalesFunnel', props: { steps: [{ label: 'Leads', value: 420 }, { label: 'Quotes', value: 260 }, { label: 'Booked', value: 150 }] } }] }],
}),
  e('PagePatterns', 'Showcase of analytics blocks. Slots: header, hero, strip, statlines, chartcard, tiles, listrows, countries, versus, segbar, activity, actioncard.', { title: 'Patterns', subtitle: 'Analytics building blocks' }, { hero: 'Hero slot', strip: 'Stat strip slot', chartcard: 'Chart card slot', tiles: 'Tiles slot' }),
  e('PageCrm', 'CRM workspace. Slots: header, summary, filters, board, calls.', { title: 'CRM', subtitle: 'Leads and calls' }, { summary: 'Summary slot', filters: 'Filters slot', board: 'Pipeline board slot', calls: 'Calls slot' }),
  e('PageBookings', 'Bookings list page. Slots: header, stats, toolbar, bulk, table, pager.', { title: 'Bookings', subtitle: '248 reservations this month' }, { stats: 'Stats slot', toolbar: 'Toolbar slot', table: 'Table slot', pager: 'Pager slot' }),
  e('PageCatalog', 'Catalog with a filter sidebar. Slots: header, filters, toolbar, grid, pager.', { title: 'Hotels', subtitle: 'Makkah and Madinah' }, { filters: 'Filters slot', toolbar: 'Toolbar slot', grid: 'Card grid slot', pager: 'Pager slot' }),
  e('PageDetail', 'Detail page with a booking sidebar. Slots: header, gallery, summary, tabs, history, booking.', { title: 'Swissotel Makkah', subtitle: '5 stars, 120 m to Haram', crumbs }, { gallery: 'Gallery slot', summary: 'Summary slot', tabs: 'Tabs slot', booking: 'Booking panel slot' }),
  e('PageSettings', 'Settings page with a side sub-navigation. Slots: header, subnav, profile, notifications, integrations, danger.', { title: 'Settings', subtitle: 'Manage your workspace' }, { subnav: 'Sub-navigation slot', profile: 'Profile section slot', notifications: 'Notifications section slot', danger: 'Danger zone slot' }),
  e('PageUserList', 'User directory with a detail drawer. Slots: header, stats, filters, toolbar, table, drawer.', { title: 'Users', subtitle: '1 204 accounts' }, { stats: 'Stats slot', filters: 'Filters slot', table: 'Table slot', drawer: 'Drawer slot' }),
  e('PageProfile', 'Profile page without a title prop. Slots: profile, tabs, about, activity, plan.', {}, { profile: 'Profile header slot', tabs: 'Tabs slot', about: 'About slot', activity: 'Activity slot', plan: 'Plan slot' }),
  e('PageForm', 'Two-column form page. Slots: header, main, media, side, actions.', { title: 'New tour', subtitle: 'Fill in the package details' }, { main: 'Main fields slot', media: 'Media upload slot', side: 'Sidebar slot' }),
  e('PageOrder', 'Order details page. Slots: header, status, items, shipping, side.', { title: 'Order BK-20418', subtitle: 'Placed on 12 Mar', crumbs }, { status: 'Status stepper slot', items: 'Items slot', shipping: 'Shipping slot', side: 'Summary slot' }),
  e('PageAccount', 'Account page with tabs and one panel. Slots: header, tabs, panel.', { title: 'Account', subtitle: 'Profile, security and billing' }, { tabs: 'Tabs slot', panel: 'Active panel slot' }),
  e('PagePricing', 'Pricing page. Slots: toggle, plans, faq.', {}, { toggle: 'Billing toggle slot', plans: 'Pricing plans slot', faq: 'FAQ slot' }),
  e('PageFaq', 'Help center page. Slots: search, cats, answers, contact.', {}, { search: 'Search slot', cats: 'Categories slot', answers: 'Answers slot', contact: 'Contact slot' }),
  e('PageCalendar', 'Calendar and schedule page. Slots: toolbar, grid, mini, details.', { title: 'Calendar and schedule', subtitle: 'Section' }, { toolbar: 'Toolbar slot', grid: 'Event grid slot', mini: 'Mini calendar slot', details: 'Event details slot' }),
  e('PageKanban', 'Kanban and tasks page. Slots: filters, board, detail.', { title: 'Kanban and tasks', subtitle: 'Section' }, { filters: 'Filters slot', board: 'Board slot', detail: 'Card detail slot' }),
  e('PageBilling', 'Billing page. Slots: plan, usage, invoices, methods, upgrade.', { title: 'Billing', subtitle: 'Section' }, { plan: 'Current plan slot', usage: 'Usage slot', invoices: 'Invoices slot', methods: 'Payment methods slot', upgrade: 'Upgrade slot' }),
  e('PageTeam', 'Team and roles page. Slots: stats, members, roles, invite.', { title: 'Team and roles', subtitle: 'Section' }, { stats: 'Summary slot', members: 'Members slot', roles: 'Roles and permissions slot', invite: 'Invite slot' }),
  e('PageIntegrations', 'Integrations and API keys page. Slots: filters, connections, keys, webhooks.', { title: 'Integrations and API keys', subtitle: 'Section' }, { filters: 'Filters slot', connections: 'Connections slot', keys: 'API keys slot', webhooks: 'Webhooks slot' }),
  e('PageSearch', 'Search results page. Slots: search, filters, results, empty.', { title: 'Search results', subtitle: 'Section' }, { search: 'Search field slot', filters: 'Filters slot', results: 'Results slot', empty: 'Empty state slot' }),
  e('PageAnalytics', 'Analytics page. Slots: period, kpis, trend, breakdown, table.', { title: 'Analytics', subtitle: 'Section' }, { period: 'Period slot', kpis: 'KPI strip slot', trend: 'Trend chart slot', breakdown: 'Breakdown slot', table: 'Detail table slot' }),
  e('PageNotifications', 'Notifications page. Slots: filters, feed, empty.', { title: 'Notifications', subtitle: 'Section' }, { filters: 'Filters slot', feed: 'Feed slot', empty: 'Empty state slot' }),
  e('PageInbox', 'Inbox page. Slots: filters, list, thread, composer, customer.', { title: 'Inbox', subtitle: 'Section' }, { filters: 'Filters slot', list: 'Conversations slot', thread: 'Thread slot', composer: 'Composer slot', customer: 'Customer slot' }),
  e('PageCheckout', 'Checkout page. Slots: steps, items, address, payment, summary.', { title: 'Checkout', subtitle: 'Section' }, { steps: 'Steps slot', items: 'Cart items slot', address: 'Address slot', payment: 'Payment slot', summary: 'Order summary slot' }),
  e('PageOnboarding', 'Onboarding page. Slots: progress, steps, checklist, tips.', { title: 'Onboarding', subtitle: 'Section' }, { progress: 'Progress slot', steps: 'Step content slot', checklist: 'Checklist slot', tips: 'Tips slot' }),
  e('PageLanding', 'Landing page. Slots: hero, logos, features, proof, pricing, cta, footer.', {}, { hero: 'Hero slot', logos: 'Logo strip slot', features: 'Features slot', proof: 'Social proof slot', pricing: 'Pricing teaser slot', cta: 'Call to action slot', footer: 'Footer slot' }),
  {
    name: 'PageAuth',
    description: 'Full-screen auth page. Slots: background, logo, aside, form, footer; props: title, subtitle, layout (card or split).',
    variants: [
      { label: 'Card', width: '100%', props: { title: 'Sign in', subtitle: 'Welcome back to ZiyaraGo' }, slots: { logo: 'ZiyaraGo', form: 'Form slot', footer: 'Footer slot' } },
      { label: 'Split', width: '100%', props: { layout: 'split', title: 'Sign in', subtitle: 'Welcome back to ZiyaraGo' }, slots: { logo: 'ZiyaraGo', aside: 'Aside slot', form: 'Form slot' } },
    ],
  },
  {
    name: 'PageStatus',
    description: 'Full-screen status page. Use kind (404, 401, maintenance, soon) or fill the code, message and action slots.',
    variants: [
      { label: '404', width: '100%', props: { kind: '404' } },
      { label: 'Maintenance', width: '100%', props: { kind: 'maintenance' } },
      { label: 'Custom slots', width: '100%', slots: { code: '503', message: 'Service is temporarily unavailable', action: 'Try again' } },
    ],
  },
]
export default examples
