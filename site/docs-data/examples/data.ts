import type { Example } from '../types'

const SZ = ['xs', 'sm', 'md', 'lg', 'xl']
const sizes = (props: Record<string, any>, extra: Record<string, any> = {}) => SZ.map(size => ({ props: { ...props, size }, ...extra }))

const cols = [
  { key: 'code', label: 'Booking' },
  { key: 'guest', label: 'Guest' },
  { key: 'hotel', label: 'Hotel' },
  { key: 'nights', label: 'Nights', num: true },
  { key: 'total', label: 'Total (SAR)', num: true },
]
const bookings = [
  { id: 1, code: 'ZG-1042', guest: 'Ahmed Khan', hotel: 'Hilton Makkah', nights: 5, total: '4,250' },
  { id: 2, code: 'ZG-1043', guest: 'Fatima Noor', hotel: 'Pullman Zamzam', nights: 7, total: '6,120' },
  { id: 3, code: 'ZG-1044', guest: 'Yusuf Ali', hotel: 'Anwar Al Madinah', nights: 4, total: '2,380' },
  { id: 4, code: 'ZG-1045', guest: 'Maryam Said', hotel: 'Swissotel Makkah', nights: 10, total: '9,900' },
]

const examples: Example[] = [
  {
    name: 'Card',
    description: 'Glass surface that groups related content with an optional title and actions. The size prop (xs, sm, md, lg, xl) sets the padding and title size.',
    variants: [
      { label: 'With title', props: { title: 'Upcoming departure', subtitle: 'Umrah Economy, 14 nights' }, text: 'Flight SV 1234 leaves Tashkent on 12 November at 08:40.' },
      { label: 'With actions', props: { title: 'Group manifest' }, slots: { actions: 'Edit' }, text: '42 pilgrims confirmed, 3 documents pending.' },
      { label: 'Inverse', props: { variant: 'inverse', title: 'Premium package' }, text: 'Private transfer, 5-star hotel next to the Haram and a dedicated guide.' },
      { label: 'Gradient tones (soft)', width: '980px', items: [
        { props: { variant: 'gradient', tone: 'brand', title: 'Brand' }, text: 'Soft gradient tinted with the brand tone.' },
        { props: { variant: 'gradient', tone: 'sky', title: 'Sky' }, text: 'Soft gradient tinted with the sky tone.' },
        { props: { variant: 'gradient', tone: 'success', title: 'Success' }, text: 'Soft gradient tinted with the success tone.' },
        { props: { variant: 'gradient', tone: 'warning', title: 'Warning' }, text: 'Soft gradient tinted with the warning tone.' },
        { props: { variant: 'gradient', tone: 'danger', title: 'Danger' }, text: 'Soft gradient tinted with the danger tone.' },
        { props: { variant: 'gradient', tone: 'violet', title: 'Violet' }, text: 'Soft gradient tinted with the violet tone.' },
        { props: { variant: 'gradient', tone: 'rose', title: 'Rose' }, text: 'Soft gradient tinted with the rose tone.' },
        { props: { variant: 'gradient', tone: 'neutral', title: 'Neutral' }, text: 'Soft gradient tinted with the neutral tone.' } ] },
      { label: 'Gradient tones (vivid)', width: '980px', items: [
        { props: { variant: 'gradient', tone: 'brand', intensity: 'vivid', title: 'Brand' }, text: 'Vivid gradient, text switches to stay readable.' },
        { props: { variant: 'gradient', tone: 'sky', intensity: 'vivid', title: 'Sky' }, text: 'Vivid gradient, text switches to stay readable.' },
        { props: { variant: 'gradient', tone: 'success', intensity: 'vivid', title: 'Success' }, text: 'Vivid gradient, text switches to stay readable.' },
        { props: { variant: 'gradient', tone: 'warning', intensity: 'vivid', title: 'Warning' }, text: 'Vivid gradient, text switches to stay readable.' },
        { props: { variant: 'gradient', tone: 'danger', intensity: 'vivid', title: 'Danger' }, text: 'Vivid gradient, text switches to stay readable.' },
        { props: { variant: 'gradient', tone: 'violet', intensity: 'vivid', title: 'Violet' }, text: 'Vivid gradient, text switches to stay readable.' },
        { props: { variant: 'gradient', tone: 'rose', intensity: 'vivid', title: 'Rose' }, text: 'Vivid gradient, text switches to stay readable.' },
        { props: { variant: 'gradient', tone: 'neutral', intensity: 'vivid', title: 'Neutral' }, text: 'Vivid gradient, text switches to stay readable.' } ] },
      { label: 'Sizes', items: sizes({ title: 'Upcoming departure', subtitle: 'Umrah Economy, 14 nights' }, { text: 'Flight SV 1234 leaves Tashkent at 08:40.' }) },
    ],
  },
  {
    name: 'DataTable',
    description: 'Sortable table with optional row selection and an empty state. The size prop (xs, sm, md, lg, xl) sets the row density and font size.',
    variants: [
      { label: 'Basic', props: { columns: cols, rows: bookings } },
      { label: 'Sorted', props: { columns: cols.map((c, i) => (i >= 3 ? { ...c, sortable: true } : c)), rows: bookings, sortKey: 'nights', sortDir: 'desc' } },
      { label: 'Empty', props: { columns: cols, rows: [], empty: 'No bookings yet' } },
      { label: 'Sizes', items: sizes({ columns: cols, rows: bookings.slice(0, 3) }) },
    ],
  },
  {
    name: 'DataGroup',
    description: 'Table whose rows are split into collapsible groups with a header per group. The size prop (xs, sm, md, lg, xl) sets the row density and font size.',
    variants: [
      {
        label: 'Grouped by city',
        props: {
          columns: [{ key: 'hotel', label: 'Hotel' }, { key: 'stars', label: 'Stars', num: true }, { key: 'rooms', label: 'Rooms', num: true }],
          groups: [
            { label: 'Makkah', rows: [{ id: 'a', hotel: 'Hilton Makkah', stars: 5, rooms: 120 }, { id: 'b', hotel: 'Pullman Zamzam', stars: 5, rooms: 200 }] },
            { label: 'Madinah', rows: [{ id: 'c', hotel: 'Anwar Al Madinah', stars: 4, rooms: 90 }, { id: 'd', hotel: 'Dar Al Taqwa', stars: 4, rooms: 60 }] },
          ],
        },
      },
      { label: 'Sizes', items: sizes({ columns: [{ key: 'hotel', label: 'Hotel' }, { key: 'rooms', label: 'Rooms', num: true }], groups: [{ label: 'Makkah', rows: [{ id: 'a', hotel: 'Hilton Makkah', rooms: 120 }, { id: 'b', hotel: 'Pullman Zamzam', rooms: 200 }] }] }) },
    ],
  },
  {
    name: 'Descriptions',
    description: 'Key and value pairs for summaries and detail panels. The size prop (xs, sm, md, lg, xl) sets the font size and spacing.',
    variants: [
      { label: 'Booking details', width: '420px', props: { items: [{ label: 'Booking', value: 'ZG-1042' }, { label: 'Guest', value: 'Ahmed Khan' }, { label: 'Hotel', value: 'Hilton Makkah' }, { label: 'Dates', value: '12 - 17 Nov 2026' }, { label: 'Notes' }] } },
      { label: 'Sizes', items: sizes({ items: [{ label: 'Booking', value: 'ZG-1042' }, { label: 'Guest', value: 'Ahmed Khan' }, { label: 'Hotel', value: 'Hilton Makkah' }] }) },
    ],
  },
  {
    name: 'Timeline',
    description: 'Vertical sequence of events with title, text and time. The size prop (xs, sm, md, lg, xl) sets the dot, font size and spacing.',
    variants: [
      {
        label: 'Trip progress',
        width: '420px',
        props: {
          items: [
            { title: 'Booking confirmed', text: 'Payment received', time: '10:02' },
            { title: 'Visa issued', text: 'Sent to the pilgrim by email', time: '12:30' },
            { title: 'Check-in opened', time: 'Tomorrow' },
          ],
        },
      },
      { label: 'Sizes', items: sizes({ items: [{ title: 'Booking confirmed', text: 'Payment received', time: '10:02' }, { title: 'Visa issued', time: '12:30' }] }) },
    ],
  },
  {
    name: 'TreeView',
    description: 'Expandable hierarchy with icons and a selected node. The size prop (xs, sm, md, lg, xl) sets the row height and font size.',
    variants: [
      {
        label: 'Destinations',
        width: '320px',
        props: {
          selected: 'haram',
          nodes: [
            { id: 'ksa', label: 'Saudi Arabia', icon: 'globe', children: [
              { id: 'makkah', label: 'Makkah', icon: 'map-pin', children: [{ id: 'haram', label: 'Masjid al-Haram', icon: 'landmark' }, { id: 'hira', label: 'Cave Hira' }] },
              { id: 'madinah', label: 'Madinah', icon: 'map-pin', children: [{ id: 'nabawi', label: 'Masjid an-Nabawi', icon: 'landmark' }] },
            ] },
          ],
        },
      },
      { label: 'Sizes', items: sizes({ nodes: [{ id: 'ksa', label: 'Saudi Arabia', icon: 'globe', children: [{ id: 'makkah', label: 'Makkah', icon: 'map-pin' }] }] }) },
    ],
  },
  {
    name: 'CalendarView',
    description: 'Month calendar that highlights days with events and shows the label on hover.',
    variants: [
      { label: 'With events', width: '360px', props: { modelValue: '2026-10-14', events: [{ date: '2026-10-05', label: 'Group departure' }, { date: '2026-10-14', label: 'Visa deadline' }, { date: '2026-10-22', label: 'Return flight' }] } },
    ],
  },
  {
    name: 'KpiTile',
    description: 'Compact metric tile with a label, a value and an optional delta. The size prop (xs, sm, md, lg, xl) sets the padding and value font size.',
    variants: [
      { label: 'Default', width: '260px', props: { label: 'Bookings today', value: '128', delta: '+12%', sub: 'vs yesterday' } },
      { label: 'Negative delta', width: '260px', props: { label: 'Cancellations', value: '7', delta: '-3%', sub: 'this week' } },
      { label: 'Sizes', items: sizes({ label: 'Bookings today', value: '128', delta: '+12%', sub: 'vs yesterday' }) },
    ],
  },
  {
    name: 'KpiInline',
    description: 'Single-line metric with label, value and delta for dense toolbars. The size prop (xs, sm, md, lg, xl) sets the value font size.',
    variants: [
      { label: 'Inline', items: [{ props: { label: 'Revenue', value: 'SAR 84k', delta: '+8%' } }, { props: { label: 'Refunds', value: 'SAR 2k', delta: '-1%' } }] },
      { label: 'Sizes', items: sizes({ label: 'Revenue', value: 'SAR 84k', delta: '+8%' }) },
    ],
  },
  {
    name: 'StatsCard',
    description: 'Metric card with an icon, a value and an up or down trend. The size prop (xs, sm, md, lg, xl) sets the padding and value font size.',
    variants: [
      { label: 'Trends', items: [{ props: { icon: 'users', label: 'Pilgrims', value: '1,284', delta: '12%', trend: 'up' } }, { props: { icon: 'plane', label: 'Flights delayed', value: '9', delta: '4%', trend: 'down' } }] },
      { label: 'Sizes', items: sizes({ icon: 'users', label: 'Pilgrims', value: '1,284', delta: '12%', trend: 'up' }) },
    ],
  },
  {
    name: 'StatRow',
    description: 'List row with an icon tile, a title, a subtitle and a value with delta. The size prop (xs, sm, md, lg, xl) sets the icon tile, fonts and row height.',
    variants: [
      { label: 'Rows', width: '420px', items: [{ props: { icon: 'hotel', tone: 'brand', title: 'Hotels', sub: 'Makkah and Madinah', value: 'SAR 52,400', delta: '+6%' } }, { props: { icon: 'plane', tone: 'sky', title: 'Flights', sub: 'Charter', value: 'SAR 31,900', delta: '-2%' } }] },
      { label: 'Sizes', width: '420px', items: sizes({ icon: 'hotel', tone: 'brand', title: 'Hotels', sub: 'Makkah and Madinah', value: 'SAR 52,400', delta: '+6%' }) },
    ],
  },
  {
    name: 'StatLine',
    description: 'Large statistic with a tinted icon, a label and a colored accent bar. The size prop (xs, sm, md, lg, xl) sets the icon tile, value font and card padding.',
    variants: [
      { label: 'Tones', items: [{ props: { icon: 'users', tone: 'brand', value: '1,284', label: 'Pilgrims', delta: '+12%' } }, { props: { icon: 'circle-check', tone: 'success', value: '96%', label: 'Visas approved', delta: '+2%' } }, { props: { icon: 'triangle-alert', tone: 'warning', value: '14', label: 'Documents missing' } }] },
      { label: 'Sizes', items: sizes({ icon: 'users', tone: 'brand', value: '1,284', label: 'Pilgrims', delta: '+12%' }) },
    ],
  },
  {
    name: 'StatStrip',
    description: 'Horizontal strip of several icon statistics inside one card. The size prop (xs, sm, md, lg, xl) sets the icon tiles, value font and padding.',
    variants: [
      { label: 'Overview', props: { items: [{ icon: 'users', tone: 'brand', value: '1,284', label: 'Pilgrims' }, { icon: 'hotel', tone: 'sky', value: '86', label: 'Hotels' }, { icon: 'plane', tone: 'success', value: '24', label: 'Flights' }, { icon: 'bus', tone: 'warning', value: '58', label: 'Transfers' }] } },
      { label: 'Sizes', items: sizes({ items: [{ icon: 'users', tone: 'brand', value: '1,284', label: 'Pilgrims' }, { icon: 'hotel', tone: 'sky', value: '86', label: 'Hotels' }] }) },
    ],
  },
  {
    name: 'CountryRow',
    description: 'Country code badge with an amount, a name and a change percentage.',
    variants: [
      { label: 'Top markets', width: '380px', items: [{ props: { code: 'UZ', name: 'Uzbekistan', amount: 'SAR 42,100', pct: '+14%' } }, { props: { code: 'KZ', name: 'Kazakhstan', amount: 'SAR 28,600', pct: '+5%' } }, { props: { code: 'TR', name: 'Turkey', amount: 'SAR 19,300', pct: '-3%' } }] },
    ],
  },
  {
    name: 'VersusBar',
    description: 'Head-to-head comparison of two values on one proportional bar. The size prop (xs, sm, md, lg, xl) sets the bar thickness.',
    variants: [
      { label: 'Missing side', width: '420px', props: { left: { label: 'Direct', value: 42 } } },
      { label: 'Comparison', width: '420px', props: { left: { label: 'Umrah', value: 840 }, right: { label: 'Hajj', value: 460 } } },
      { label: 'Sizes', width: '320px', items: sizes({ left: { label: 'Umrah', value: 840 }, right: { label: 'Hajj', value: 460 } }) },
    ],
  },
  {
    name: 'SegBar',
    description: 'Stacked segmented bar with a legend, for shares of a total. The size prop (xs, sm, md, lg, xl) sets the bar height.',
    variants: [
      { label: 'Empty', width: '420px', props: { segments: [] } },
      { label: 'Booking sources', width: '460px', props: { segments: [{ label: 'Website', value: 52 }, { label: 'Agents', value: 28 }, { label: 'Mobile', value: 14 }, { label: 'Walk-in', value: 6 }] } },
      { label: 'Custom colors', width: '460px', props: { segments: [{ label: 'Paid', value: 70, color: 'var(--zg-green)' }, { label: 'Pending', value: 20, color: 'var(--zg-amber)' }, { label: 'Overdue', value: 10, color: 'var(--zg-red)' }] } },
      { label: 'Sizes', width: '320px', items: sizes({ segments: [{ label: 'Website', value: 52 }, { label: 'Agents', value: 28 }, { label: 'Mobile', value: 14 }] }) },
    ],
  },
  {
    name: 'MiniChart',
    description: 'Tiny sparkline as bars or a line, without axes. The size prop (xs, sm, md, lg, xl) sets the chart height (an explicit height prop wins).',
    variants: [
      { label: 'Empty', width: '240px', props: { values: [] } },
      { label: 'Bars', width: '260px', props: { values: [12, 18, 9, 22, 30, 24, 36, 28, 40, 34, 46, 52], height: 64, highlightLast: true } },
      { label: 'Line', width: '260px', props: { type: 'line', values: [12, 18, 9, 22, 30, 24, 36, 28, 40, 34, 46, 52], height: 64 } },
      { label: 'Sizes', width: '260px', items: sizes({ values: [12, 18, 9, 22, 30, 24, 36, 28, 40, 34, 46, 52], highlightLast: true }) },
    ],
  },
  {
    name: 'ChartCard',
    description: 'Card shell for a chart with a title, a subtitle and an optional overflow menu.',
    variants: [
      { label: 'With chart', width: '420px', props: { title: 'Weekly bookings', subtitle: 'Last 12 weeks', menu: ['Export', 'Share', 'Delete'] }, text: 'Chart goes here' },
    ],
  },
  {
    name: 'Ring',
    description: 'Circular progress gauge with a tick scale and a centered value. The size prop (xs, sm, md, lg, xl) sets the diameter (a number in px still works).',
    variants: [
      { label: 'Default', props: { value: 72, label: 'Seats sold' } },
      { label: 'Small, no ticks', items: [{ props: { value: 45, size: 120, ticks: false, label: 'Visas' } }, { props: { value: 88, size: 120, ticks: false, color: 'var(--zg-green)', label: 'Paid' } }] },
      { label: 'Sizes', items: sizes({ value: 72, label: 'Seats sold' }) },
    ],
  },
  {
    name: 'OccupancyChart',
    description: 'Column chart of occupancy per period, with peaks above 90% highlighted.',
    variants: [
      { label: 'Empty', width: '420px', props: { values: [] } },
      { label: 'Week', width: '460px', props: { values: [62, 74, 81, 93, 97, 88, 70], labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] } },
    ],
  },
  {
    name: 'SalesFunnel',
    description: 'Horizontal funnel showing how many leads remain at each stage.',
    variants: [
      { label: 'Empty', width: '420px', props: { steps: [] } },
      { label: 'Lead funnel', width: '520px', props: { steps: [{ label: 'Visitors', value: 12400 }, { label: 'Leads', value: 3200 }, { label: 'Quotes', value: 1150 }, { label: 'Booked', value: 420 }] } },
    ],
  },
  {
    name: 'SystemStatus',
    description: 'List of services with a colored state dot and a value.',
    variants: [
      { label: 'Services', width: '380px', props: { items: [{ name: 'Booking API', value: '99.98%', state: 'ok' }, { name: 'Payments', value: '97.2%', state: 'warn' }, { name: 'SMS gateway', value: 'Down', state: 'down' }] } },
    ],
  },
  {
    name: 'UserCell',
    description: 'Avatar with a name and a secondary line for table cells and lists. The size prop (xs, sm, md, lg, xl) sets the avatar and text size (a number in px still works).',
    variants: [
      { label: 'Users', items: [{ props: { name: 'Ahmed Khan', sub: 'ahmed@ziyarago.com' } }, { props: { name: 'Fatima Noor', sub: 'Group leader', src: '/3d/guide.png', size: 44 } }] },
      { label: 'Sizes', items: sizes({ name: 'Ahmed Khan', sub: 'ahmed@ziyarago.com' }) },
    ],
  },
  {
    name: 'IconTile',
    description: 'Rounded tinted square (or circle) holding an icon. The size prop (xs, sm, md, lg, xl) sets the tile and icon size (a number in px still works).',
    variants: [
      { label: 'Tones', items: ['brand', 'sky', 'success', 'warning', 'danger', 'neutral'].map(tone => ({ props: { icon: 'star', tone } })) },
      { label: 'Shapes and sizes', items: [{ props: { icon: 'plane', tone: 'sky', size: 32 } }, { props: { icon: 'hotel', tone: 'brand', size: 48, shape: 'circle' } }, { props: { icon: 'map-pin', tone: 'success', size: 64 } }] },
      { label: 'Sizes', items: sizes({ icon: 'plane', tone: 'sky' }) },
    ],
  },
  {
    name: 'StatusIcon',
    description: 'Circular icon badge that shows a tooltip on hover or focus. The size prop (xs, sm, md, lg, xl) sets the badge and icon size (a number in px still works).',
    variants: [
      { label: 'States', items: [{ props: { icon: 'check', tone: 'success', tip: 'Confirmed' } }, { props: { icon: 'clock', tone: 'warning', tip: 'Pending' } }, { props: { icon: 'x', tone: 'danger', tip: 'Cancelled' } }] },
      { label: 'Sizes', items: sizes({ icon: 'check', tone: 'success', tip: 'Confirmed' }) },
    ],
  },
  {
    name: 'HeroBanner',
    description: 'Promo banner with a title, text, a big value, a call to action and a side image.',
    variants: [
      { label: 'With image', props: { title: 'Ramadan Umrah 2027', text: 'Early-bird packages with flights, hotel and transfers.', value: 'From $1,290', cta: 'View packages', image: '/3d/kaaba.png' } },
      { label: 'Text only', props: { title: 'Welcome back, Ahmed', text: 'You have 5 bookings waiting for confirmation.' } },
    ],
  },
  {
    name: 'TabTiles',
    description: 'Row of icon tiles that act as tabs, with an optional add button.',
    variants: [
      { label: 'Services', props: { value: 'hotels', items: [{ value: 'hotels', label: 'Hotels', icon: 'hotel' }, { value: 'flights', label: 'Flights', icon: 'plane' }, { value: 'tours', label: 'Tours', icon: 'map' }, { value: 'visa', label: 'Visa', icon: 'file-text' }], addable: true } },
    ],
  },
  {
    name: 'PricingCard',
    description: 'Plan card with a price, a feature list and a select button. The size prop (xs, sm, md, lg, xl) sets the padding and title size.',
    variants: [
      {
        label: 'Plans',
        items: [
          { props: { name: 'Economy', price: '$1,290', period: '/ person', features: ['3-star hotel', 'Shared transfer', '10 nights'], cta: 'Choose' } },
          { props: { name: 'Premium', price: '$2,490', period: '/ person', badge: 'Popular', featured: true, features: ['5-star near Haram', 'Private transfer', 'Personal guide'], cta: 'Choose Premium' } },
        ],
      },
      { label: 'Sizes', width: '300px', items: sizes({ name: 'Economy', price: '$1,290', period: '/ person', features: ['3-star hotel', 'Shared transfer'], cta: 'Choose' }) },
    ],
  },
  {
    name: 'IntegrationCard',
    description: 'Card for a third-party integration with its connection status and an action. The size prop (xs, sm, md, lg, xl) sets the padding and title size.',
    variants: [
      {
        label: 'Statuses',
        items: [
          { props: { name: 'Stripe', description: 'Card payments', status: 'connected' } },
          { props: { name: 'Twilio', description: 'SMS notifications', status: 'error' } },
          { props: { name: 'Google Calendar', description: 'Sync departures', status: 'off' } },
        ],
      },
      { label: 'Sizes', width: '360px', items: sizes({ name: 'Stripe', description: 'Card payments', status: 'connected' }) },
    ],
  },
]
export default examples
