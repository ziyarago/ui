import type { Example } from '../types'

const nav = [
  { value: 'home', label: 'Home', icon: 'house' },
  { value: 'tours', label: 'Tours', icon: 'map' },
  { value: 'hotels', label: 'Hotels', icon: 'building-2' },
  { value: 'bookings', label: 'Bookings', icon: 'calendar-check', count: 4 },
]

const examples: Example[] = [
  {
    name: 'TopNav',
    description: 'Horizontal app header with brand, navigation items and an actions area. Use size (xs, sm, md, lg, xl) to change density.',
    variants: [
      { label: 'Default', props: { brand: 'ZiyaraGo', value: 'tours', items: nav }, slots: { actions: 'Sign in' } },
      { label: 'Text only', props: { brand: 'ZiyaraGo', value: 'home', items: [{ value: 'home', label: 'Home' }, { value: 'tours', label: 'Tours' }, { value: 'about', label: 'About' }] } },
      { label: 'Sub-menus', props: { brand: 'ZiyaraGo', value: 'invoices', items: [{ value: 'home', label: 'Home', icon: 'house' }, { value: 'bookings', label: 'Bookings', icon: 'calendar-check', children: [{ value: 'upcoming', label: 'Upcoming', icon: 'calendar-clock' }, { value: 'past', label: 'Past', icon: 'history' }, { separator: true }, { value: 'cancelled', label: 'Cancelled', icon: 'calendar-x', count: 3 }] }, { value: 'billing', label: 'Billing', icon: 'receipt', children: [{ heading: 'Money' }, { value: 'invoices', label: 'Invoices', icon: 'file-text' }, { value: 'payouts', label: 'Payouts', icon: 'banknote' }, { heading: 'Setup' }, { value: 'plans', label: 'Plans', icon: 'layers' }] }, { value: 'settings', label: 'Settings', icon: 'settings' }] }, slots: { actions: 'Sign in' } },
      { label: 'Overflow into More (narrow)', width: '520px', props: { brand: 'ZiyaraGo', value: 'content', items: [{ value: 'platform', label: 'Platform', icon: 'house' }, { value: 'tenants', label: 'Tenants', icon: 'shield-check' }, { value: 'billing', label: 'Billing', icon: 'receipt' }, { value: 'ops', label: 'Operations', icon: 'wrench', count: 4 }, { value: 'content', label: 'Content', icon: 'layout-grid' }, { value: 'support', label: 'Support', icon: 'life-buoy' }, { value: 'audit', label: 'Audit', icon: 'scroll-text' }] } },
      { label: 'Sizes', items: [{ props: { brand: 'ZiyaraGo', value: 'tours', items: nav, size: 'xs' }, slots: { actions: 'Sign in' } }, { props: { brand: 'ZiyaraGo', value: 'tours', items: nav, size: 'sm' }, slots: { actions: 'Sign in' } }, { props: { brand: 'ZiyaraGo', value: 'tours', items: nav, size: 'md' }, slots: { actions: 'Sign in' } }, { props: { brand: 'ZiyaraGo', value: 'tours', items: nav, size: 'lg' }, slots: { actions: 'Sign in' } }, { props: { brand: 'ZiyaraGo', value: 'tours', items: nav, size: 'xl' }, slots: { actions: 'Sign in' } }] },
    ],
  },
  {
    name: 'SideNav',
    description: 'Vertical sidebar with grouped items, counters, a footer and optional collapse toggle. Use size (xs, sm, md, lg, xl) to change density.',
    variants: [
      { label: 'Grouped', width: '260px', props: { brand: 'ZiyaraGo', value: 'tours', items: [{ group: 'Catalog' }, ...nav.slice(0, 3), { group: 'Sales' }, nav[3], { value: 'clients', label: 'Clients', icon: 'users' }] }, slots: { footer: 'v1.0' } },
      { label: 'Expandable groups', width: '280px', props: { brand: 'ZiyaraGo', value: 'invoices', items: [{ value: 'home', label: 'Home', icon: 'house' }, { value: 'bookings', label: 'Bookings', icon: 'calendar-check', children: [{ value: 'upcoming', label: 'Upcoming' }, { value: 'past', label: 'Past' }, { value: 'cancelled', label: 'Cancelled', count: 3 }] }, { value: 'billing', label: 'Billing', icon: 'receipt', children: [{ value: 'invoices', label: 'Invoices', icon: 'file-text' }, { value: 'payouts', label: 'Payouts', icon: 'banknote' }] }, { value: 'settings', label: 'Settings', icon: 'settings' }] } },
      { label: 'Collapsed', width: '90px', props: { brand: 'Z', collapsed: true, value: 'home', items: nav } },
      { label: 'Sizes', width: '340px', items: [{ props: { brand: 'ZiyaraGo', value: 'tours', items: nav.slice(0, 3), size: 'xs' } }, { props: { brand: 'ZiyaraGo', value: 'tours', items: nav.slice(0, 3), size: 'sm' } }, { props: { brand: 'ZiyaraGo', value: 'tours', items: nav.slice(0, 3), size: 'md' } }, { props: { brand: 'ZiyaraGo', value: 'tours', items: nav.slice(0, 3), size: 'lg' } }, { props: { brand: 'ZiyaraGo', value: 'tours', items: nav.slice(0, 3), size: 'xl' } }] },
    ],
  },
  {
    name: 'SubNav',
    description: 'Secondary vertical menu for sections inside a page, with icons and badges. Use size (xs, sm, md, lg, xl) to change density.',
    variants: [
      { label: 'Settings', width: '260px', props: { title: 'Settings', value: 'profile', items: [{ value: 'profile', label: 'Profile', icon: 'user' }, { value: 'security', label: 'Security', icon: 'shield' }, { value: 'notifications', label: 'Notifications', icon: 'bell', badge: 3 }, { value: 'billing', label: 'Billing', icon: 'credit-card' }] } },
      { label: 'Sizes', width: '300px', items: [{ props: { title: 'Settings', value: 'profile', items: [{ value: 'profile', label: 'Profile', icon: 'user' }, { value: 'security', label: 'Security', icon: 'shield' }], size: 'xs' } }, { props: { title: 'Settings', value: 'profile', items: [{ value: 'profile', label: 'Profile', icon: 'user' }, { value: 'security', label: 'Security', icon: 'shield' }], size: 'sm' } }, { props: { title: 'Settings', value: 'profile', items: [{ value: 'profile', label: 'Profile', icon: 'user' }, { value: 'security', label: 'Security', icon: 'shield' }], size: 'md' } }, { props: { title: 'Settings', value: 'profile', items: [{ value: 'profile', label: 'Profile', icon: 'user' }, { value: 'security', label: 'Security', icon: 'shield' }], size: 'lg' } }, { props: { title: 'Settings', value: 'profile', items: [{ value: 'profile', label: 'Profile', icon: 'user' }, { value: 'security', label: 'Security', icon: 'shield' }], size: 'xl' } }] },
    ],
  },
  {
    name: 'Tabs',
    description: 'Underlined tab bar for switching between views of the same content. Use size (xs, sm, md, lg, xl) to change density.',
    variants: [
      { label: 'Default', props: { modelValue: 'overview', items: [{ value: 'overview', label: 'Overview' }, { value: 'itinerary', label: 'Itinerary' }, { value: 'hotels', label: 'Hotels' }, { value: 'reviews', label: 'Reviews' }] } },
      { label: 'With counts', props: { modelValue: 'media', items: [{ value: 'info', label: 'Info' }, { value: 'media', label: 'Media', count: 3 }, { value: 'files', label: 'Files', count: 0 }, { value: 'log', label: 'History', count: 128 }] } },
      { label: 'Sizes', items: [{ props: { modelValue: 'overview', items: [{ value: 'overview', label: 'Overview' }, { value: 'itinerary', label: 'Itinerary' }, { value: 'hotels', label: 'Hotels' }], size: 'xs' } }, { props: { modelValue: 'overview', items: [{ value: 'overview', label: 'Overview' }, { value: 'itinerary', label: 'Itinerary' }, { value: 'hotels', label: 'Hotels' }], size: 'sm' } }, { props: { modelValue: 'overview', items: [{ value: 'overview', label: 'Overview' }, { value: 'itinerary', label: 'Itinerary' }, { value: 'hotels', label: 'Hotels' }], size: 'md' } }, { props: { modelValue: 'overview', items: [{ value: 'overview', label: 'Overview' }, { value: 'itinerary', label: 'Itinerary' }, { value: 'hotels', label: 'Hotels' }], size: 'lg' } }, { props: { modelValue: 'overview', items: [{ value: 'overview', label: 'Overview' }, { value: 'itinerary', label: 'Itinerary' }, { value: 'hotels', label: 'Hotels' }], size: 'xl' } }] },
    ],
  },
  {
    name: 'PillTabs',
    description: 'Pill-shaped tabs with optional icons, horizontal or vertical. Use size (xs, sm, md, lg, xl) to change density.',
    variants: [
      { label: 'Horizontal', props: { value: 'flights', items: [{ value: 'flights', label: 'Flights', icon: 'plane' }, { value: 'hotels', label: 'Hotels', icon: 'bed' }, { value: 'transfers', label: 'Transfers', icon: 'car' }] } },
      { label: 'Vertical', width: '200px', props: { vertical: true, value: 'hotels', items: [{ value: 'flights', label: 'Flights', icon: 'plane' }, { value: 'hotels', label: 'Hotels', icon: 'bed' }, { value: 'transfers', label: 'Transfers', icon: 'car' }] } },
      { label: 'Sizes', items: [{ props: { value: 'flights', items: [{ value: 'flights', label: 'Flights', icon: 'plane' }, { value: 'hotels', label: 'Hotels', icon: 'bed' }, { value: 'transfers', label: 'Transfers', icon: 'car' }], size: 'xs' } }, { props: { value: 'flights', items: [{ value: 'flights', label: 'Flights', icon: 'plane' }, { value: 'hotels', label: 'Hotels', icon: 'bed' }, { value: 'transfers', label: 'Transfers', icon: 'car' }], size: 'sm' } }, { props: { value: 'flights', items: [{ value: 'flights', label: 'Flights', icon: 'plane' }, { value: 'hotels', label: 'Hotels', icon: 'bed' }, { value: 'transfers', label: 'Transfers', icon: 'car' }], size: 'md' } }, { props: { value: 'flights', items: [{ value: 'flights', label: 'Flights', icon: 'plane' }, { value: 'hotels', label: 'Hotels', icon: 'bed' }, { value: 'transfers', label: 'Transfers', icon: 'car' }], size: 'lg' } }, { props: { value: 'flights', items: [{ value: 'flights', label: 'Flights', icon: 'plane' }, { value: 'hotels', label: 'Hotels', icon: 'bed' }, { value: 'transfers', label: 'Transfers', icon: 'car' }], size: 'xl' } }] },
    ],
  },
  {
    name: 'Breadcrumbs',
    description: 'Shows the path to the current page; the last item is the current location. Use size (xs, sm, md, lg, xl) to change density.',
    variants: [
      { label: 'Default', props: { items: [{ label: 'Home', href: '#' }, { label: 'Hotels', href: '#' }, { label: 'Makkah', href: '#' }, { label: 'Hilton Suites' }] } },
      { label: 'Short', props: { items: [{ label: 'Tours', href: '#' }, { label: 'Umrah 14 days' }] } },
      { label: 'Sizes', items: [{ props: { items: [{ label: 'Home', href: '#' }, { label: 'Hotels', href: '#' }, { label: 'Hilton Suites' }], size: 'xs' } }, { props: { items: [{ label: 'Home', href: '#' }, { label: 'Hotels', href: '#' }, { label: 'Hilton Suites' }], size: 'sm' } }, { props: { items: [{ label: 'Home', href: '#' }, { label: 'Hotels', href: '#' }, { label: 'Hilton Suites' }], size: 'md' } }, { props: { items: [{ label: 'Home', href: '#' }, { label: 'Hotels', href: '#' }, { label: 'Hilton Suites' }], size: 'lg' } }, { props: { items: [{ label: 'Home', href: '#' }, { label: 'Hotels', href: '#' }, { label: 'Hilton Suites' }], size: 'xl' } }] },
    ],
  },
  {
    name: 'Pagination',
    description: 'Numbered page buttons with the current page highlighted. Use size (xs, sm, md, lg, xl) to change density.',
    variants: [
      { label: 'Few pages', props: { pages: 5, page: 2 } },
      { label: 'Many pages', props: { pages: 9, page: 6 } },
      { label: 'Hundreds of pages (ellipsis)', props: { pages: 240, page: 57 } },
      { label: 'Siblings 2', props: { pages: 240, page: 120, siblings: 2 } },
      { label: 'Sizes', items: [{ props: { pages: 5, page: 2, size: 'xs' } }, { props: { pages: 5, page: 2, size: 'sm' } }, { props: { pages: 5, page: 2, size: 'md' } }, { props: { pages: 5, page: 2, size: 'lg' } }, { props: { pages: 5, page: 2, size: 'xl' } }] },
    ],
  },
  {
    name: 'Accordion',
    description: 'Vertically stacked sections where one panel can be expanded at a time. Use size (xs, sm, md, lg, xl) to change density.',
    variants: [
      {
        label: 'FAQ',
        width: '480px',
        props: {
          items: [
            { id: 'visa', title: 'Is the visa included?', body: 'Yes, visa processing is included in all Umrah packages.' },
            { id: 'cancel', title: 'Can I cancel my booking?', body: 'Free cancellation up to 14 days before departure.' },
            { id: 'kids', title: 'Do children pay full price?', body: 'Children under 2 travel free, ages 2 to 11 get a 30% discount.' },
          ],
        },
      },
      { label: 'Sizes', width: '480px', items: [{ props: { size: 'xs', items: [{ id: 'visa', title: 'Is the visa included?', body: 'Yes, visa processing is included.' }] } }, { props: { size: 'sm', items: [{ id: 'visa', title: 'Is the visa included?', body: 'Yes, visa processing is included.' }] } }, { props: { size: 'md', items: [{ id: 'visa', title: 'Is the visa included?', body: 'Yes, visa processing is included.' }] } }, { props: { size: 'lg', items: [{ id: 'visa', title: 'Is the visa included?', body: 'Yes, visa processing is included.' }] } }, { props: { size: 'xl', items: [{ id: 'visa', title: 'Is the visa included?', body: 'Yes, visa processing is included.' }] } }] },
    ],
  },
]
export default examples
