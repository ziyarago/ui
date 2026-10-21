import type { Example } from '../types'

const examples: Example[] = [
  {
    name: 'Box',
    description: 'Generic container with optional padding and glass background.',
    variants: [
      { label: 'Padded', width: '360px', props: { p: 16, style: { border: '1px solid var(--zg-stroke)', borderRadius: '12px' } }, children: [{ name: 'Text', text: 'A box with 16px padding.' }] },
      { label: 'Glass', width: '360px', props: { p: 20, glass: true, style: { borderRadius: '20px' } }, children: [{ name: 'Heading', props: { level: 3, size: 'sm' }, text: 'Glass surface' }, { name: 'Text', props: { tone: 'muted' }, text: 'Blurred background with a rim light.' }] },
    ],
  },
  {
    name: 'Center',
    description: 'Centers its content horizontally and vertically.',
    variants: [
      { label: 'Centered', width: '360px', props: { style: { height: '140px', border: '1px dashed var(--zg-stroke)', borderRadius: '12px' } }, children: [{ name: 'Badge', props: { tone: 'brand' }, text: 'Centered' }] },
    ],
  },
  {
    name: 'HStack',
    description: 'Horizontal flex row with gap, alignment and wrapping.',
    variants: [
      { label: 'Default', width: '420px', props: { gap: 12, style: { border: '1px dashed var(--zg-stroke)', padding: '12px', borderRadius: '12px' } }, children: [{ name: 'Button', props: { variant: 'secondary', size: 'sm' }, text: 'One' }, { name: 'Button', props: { variant: 'secondary', size: 'sm' }, text: 'Two' }, { name: 'Button', props: { variant: 'secondary', size: 'sm' }, text: 'Three' }] },
      { label: 'Space between', width: '420px', props: { justify: 'space-between', align: 'center', style: { border: '1px dashed var(--zg-stroke)', padding: '12px', borderRadius: '12px' } }, children: [{ name: 'Text', props: { bold: true }, text: 'Makkah' }, { name: 'Button', props: { variant: 'primary', size: 'sm' }, text: 'Details' }] },
    ],
  },
  {
    name: 'VStack',
    description: 'Vertical flex column with a configurable gap.',
    variants: [
      { label: 'Gap 12', width: '320px', props: { gap: 12, style: { border: '1px dashed var(--zg-stroke)', padding: '12px', borderRadius: '12px' } }, children: [{ name: 'Badge', text: 'Visa' }, { name: 'Badge', text: 'Hotel' }, { name: 'Badge', text: 'Transfer' }] },
      { label: 'Centered, gap 4', width: '320px', props: { gap: 4, align: 'center', style: { border: '1px dashed var(--zg-stroke)', padding: '12px', borderRadius: '12px' } }, children: [{ name: 'Heading', props: { level: 3, size: 'sm' }, text: 'Umrah 7 nights' }, { name: 'Text', props: { tone: 'muted', size: 'sm' }, text: 'From 1 200 SAR' }, { name: 'Button', props: { variant: 'primary', size: 'sm' }, text: 'Book' }] },
    ],
  },
  {
    name: 'Grid',
    description: 'CSS grid with a fixed column count or auto-fit minimum width.',
    variants: [
      { label: 'Three columns', width: '520px', props: { cols: 3, gap: 12 }, children: [{ name: 'Card', props: { title: 'Makkah' }, text: 'Haram' }, { name: 'Card', props: { title: 'Madinah' }, text: 'Nabawi' }, { name: 'Card', props: { title: 'Jeddah' }, text: 'Airport' }] },
      { label: 'Auto-fit', width: '520px', props: { min: 140, gap: 12 }, children: [{ name: 'Card', props: { title: 'Taif' }, text: 'Hills' }, { name: 'Card', props: { title: 'Al-Ula' }, text: 'Heritage' }, { name: 'Card', props: { title: 'Yanbu' }, text: 'Coast' }, { name: 'Card', props: { title: 'Abha' }, text: 'Mountains' }] },
    ],
  },
  {
    name: 'Divider',
    description: 'Horizontal separator with an optional centered label. Size prop: xs, sm, md, lg, xl.',
    variants: [
      { label: 'Sizes', width: '360px', items: [{ props: { size: 'xs', label: 'or continue with' } }, { props: { size: 'sm', label: 'or continue with' } }, { props: { size: 'md', label: 'or continue with' } }, { props: { size: 'lg', label: 'or continue with' } }, { props: { size: 'xl', label: 'or continue with' } }] },
      { label: 'Plain', width: '360px', props: {} },
      { label: 'Labeled', width: '360px', props: { label: 'or continue with' } },
    ],
  },
  {
    name: 'ScrollArea',
    description: 'Scrollable region with a capped height.',
    variants: [
      { label: 'Max height 120px', width: '360px', props: { maxHeight: '120px' }, children: [{ name: 'VStack', props: { gap: 8 }, children: [{ name: 'Text', text: 'Day 1: Arrival in Jeddah and transfer to Makkah.' }, { name: 'Text', text: 'Day 2: Umrah rituals with a guide.' }, { name: 'Text', text: 'Day 3: Free day for prayers at the Haram.' }, { name: 'Text', text: 'Day 4: Visit Jabal al-Nour.' }, { name: 'Text', text: 'Day 5: Train to Madinah.' }, { name: 'Text', text: 'Day 6: Masjid an-Nabawi and Quba.' }, { name: 'Text', text: 'Day 7: Departure.' }] }] },
    ],
  },
  {
    name: 'SplitLayout',
    description: 'Two-column layout with configurable column widths and left/right slots.',
    variants: [
      { label: 'Even', width: '560px', props: { columns: '1fr 1fr' }, slots: { left: 'Left pane content', right: 'Right pane content' } },
      { label: 'Sidebar and content', width: '560px', props: { columns: '200px 1fr' }, slots: { left: 'Filters', right: 'Search results go here' } },
    ],
  },
  {
    name: 'AppShell',
    description: 'Application frame with a top or side navigation and a main area; use frame to keep it inside its container.',
    variants: [
      { label: 'Top navigation', width: '640px', props: { frame: true, brand: 'ZiyaraGo', nav: 'top', value: 'bookings', items: [{ value: 'home', label: 'Home' }, { value: 'bookings', label: 'Bookings' }, { value: 'guests', label: 'Guests' }] }, text: 'Main content area' },
      { label: 'Side navigation', width: '640px', props: { frame: true, brand: 'ZiyaraGo', nav: 'side', value: 'bookings', items: [{ group: 'Manage' }, { value: 'home', label: 'Home' }, { value: 'bookings', label: 'Bookings', icon: 'calendar', count: 4 }, { value: 'guests', label: 'Guests', icon: 'users' }] }, text: 'Main content area' },
    ],
  },
  {
    name: 'PageHeader',
    description: 'Page title with optional breadcrumbs, subtitle and action slot. Size prop: xs, sm, md, lg, xl.',
    variants: [
      { label: 'Sizes', width: '640px', items: [{ props: { size: 'xs', title: 'Bookings', subtitle: 'All upcoming trips' } }, { props: { size: 'sm', title: 'Bookings', subtitle: 'All upcoming trips' } }, { props: { size: 'md', title: 'Bookings', subtitle: 'All upcoming trips' } }, { props: { size: 'lg', title: 'Bookings', subtitle: 'All upcoming trips' } }, { props: { size: 'xl', title: 'Bookings', subtitle: 'All upcoming trips' } }] },
      { label: 'Title and subtitle', width: '640px', props: { title: 'Bookings', subtitle: 'Manage upcoming Umrah group departures.' } },
      { label: 'With breadcrumbs and actions', width: '640px', props: { title: 'Ramadan Umrah', subtitle: '14 nights, Makkah and Madinah', crumbs: [{ label: 'Tours', href: '#' }, { label: 'Umrah', href: '#' }, { label: 'Ramadan Umrah' }] }, slots: { actions: 'Edit tour' } },
    ],
  },
  {
    name: 'AuthLayout',
    description: 'Centered glass card for sign-in style screens; it fills the viewport height by design.',
    variants: [
      { label: 'Card', width: '480px', props: { title: 'Welcome back', subtitle: 'Sign in to manage your bookings.', style: { minHeight: '320px' } }, text: 'Form fields go here' },
    ],
  },
  {
    name: 'SettingsSection',
    description: 'Settings block with a title, description and a column of fields. Size prop: xs, sm, md, lg, xl.',
    variants: [
      { label: 'Sizes', width: '520px', items: [{ props: { size: 'xs', title: 'Notifications', description: 'Choose when we contact you.' }, text: 'Email updates, SMS reminders' }, { props: { size: 'sm', title: 'Notifications', description: 'Choose when we contact you.' }, text: 'Email updates, SMS reminders' }, { props: { size: 'md', title: 'Notifications', description: 'Choose when we contact you.' }, text: 'Email updates, SMS reminders' }, { props: { size: 'lg', title: 'Notifications', description: 'Choose when we contact you.' }, text: 'Email updates, SMS reminders' }, { props: { size: 'xl', title: 'Notifications', description: 'Choose when we contact you.' }, text: 'Email updates, SMS reminders' }] },
      { label: 'Section', width: '520px', props: { title: 'Notifications', description: 'Choose when we contact you about bookings.' }, text: 'Email updates, SMS reminders' },
    ],
  },
  {
    name: 'LiquidGlass',
    description: 'Frosted glass surface with adjustable radius and blur. Size prop (padding): xs, sm, md, lg, xl.',
    variants: [
      { label: 'Sizes', width: '360px', items: [{ props: { size: 'xs' }, text: 'Liquid glass surface' }, { props: { size: 'sm' }, text: 'Liquid glass surface' }, { props: { size: 'md' }, text: 'Liquid glass surface' }, { props: { size: 'lg' }, text: 'Liquid glass surface' }, { props: { size: 'xl' }, text: 'Liquid glass surface' }] },
      { label: 'Default', width: '360px', props: {}, text: 'Liquid glass surface' },
      { label: 'Large radius, strong blur', width: '360px', props: { radius: 40, blur: 30, style: { padding: '24px' } }, text: 'Softer, rounder glass' },
    ],
  },
  {
    name: 'Footer',
    description: 'Page footer with copyright text and a row of links. Size prop: xs, sm, md, lg, xl.',
    variants: [
      { label: 'Sizes', width: '640px', items: [{ props: { size: 'xs', copyright: '© 2026 ZiyaraGo', links: [{ label: 'Terms', href: '#' }, { label: 'Privacy', href: '#' }] } }, { props: { size: 'sm', copyright: '© 2026 ZiyaraGo', links: [{ label: 'Terms', href: '#' }, { label: 'Privacy', href: '#' }] } }, { props: { size: 'md', copyright: '© 2026 ZiyaraGo', links: [{ label: 'Terms', href: '#' }, { label: 'Privacy', href: '#' }] } }, { props: { size: 'lg', copyright: '© 2026 ZiyaraGo', links: [{ label: 'Terms', href: '#' }, { label: 'Privacy', href: '#' }] } }, { props: { size: 'xl', copyright: '© 2026 ZiyaraGo', links: [{ label: 'Terms', href: '#' }, { label: 'Privacy', href: '#' }] } }] },
      { label: 'Default', width: '640px', props: { copyright: '© 2026 ZiyaraGo', links: [{ label: 'Terms', href: '#' }, { label: 'Privacy', href: '#' }, { label: 'Support', href: '#' }] } },
    ],
  },
  {
    name: 'Sortable',
    description: 'Drag-and-drop reorderable list with up and down buttons. Size prop: xs, sm, md, lg, xl.',
    variants: [
      { label: 'Sizes', width: '380px', items: [{ props: { size: 'xs', items: [{ id: 1, label: 'Arrive in Jeddah' }, { id: 2, label: 'Umrah rituals' }] } }, { props: { size: 'sm', items: [{ id: 1, label: 'Arrive in Jeddah' }, { id: 2, label: 'Umrah rituals' }] } }, { props: { size: 'md', items: [{ id: 1, label: 'Arrive in Jeddah' }, { id: 2, label: 'Umrah rituals' }] } }, { props: { size: 'lg', items: [{ id: 1, label: 'Arrive in Jeddah' }, { id: 2, label: 'Umrah rituals' }] } }, { props: { size: 'xl', items: [{ id: 1, label: 'Arrive in Jeddah' }, { id: 2, label: 'Umrah rituals' }] } }] },
      { label: 'Itinerary order', width: '380px', props: { items: [{ id: 1, label: 'Arrive in Jeddah' }, { id: 2, label: 'Umrah rituals' }, { id: 3, label: 'Train to Madinah' }, { id: 4, label: 'Visit Quba Mosque' }] } },
    ],
  },
  {
    name: 'Portal',
    description: 'Teleports its children to document.body (or the target given in to); the text below renders outside the preview.',
    variants: [
      { label: 'To body', text: 'Rendered in a portal on document.body' },
    ],
  },
]
export default examples
