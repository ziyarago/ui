import type { Example } from '../types'

const examples: Example[] = [
  {
    name: 'Button',
    description: 'Triggers an action. Variants set emphasis; size (xs, sm, md, lg, xl) sets density.',
    variants: [
      { label: 'Variants', items: [{ props: { variant: 'primary' }, text: 'Primary' }, { props: { variant: 'secondary' }, text: 'Secondary' }, { props: { variant: 'ghost' }, text: 'Ghost' }] },
      { label: 'Sizes', items: [{ props: { variant: 'primary', size: 'xs' }, text: 'XS' }, { props: { variant: 'primary', size: 'sm' }, text: 'SM' }, { props: { variant: 'primary', size: 'md' }, text: 'MD' }, { props: { variant: 'primary', size: 'lg' }, text: 'LG' }, { props: { variant: 'primary', size: 'xl' }, text: 'XL' }] },
      { label: 'States', items: [{ props: { variant: 'primary', disabled: true }, text: 'Disabled' }, { props: { variant: 'primary', loading: true }, text: 'Saving' }] },
    ],
  },
  {
    name: 'IconButton',
    description: 'Square button that holds only an icon; always give it an accessible label. Use size (xs, sm, md, lg, xl) to change density.',
    variants: [
      { label: 'Default', items: [{ props: { icon: 'heart', label: 'Save' } }, { props: { icon: 'share-2', label: 'Share' } }, { props: { icon: 'map-pin', label: 'Location' } }] },
      { label: 'Ghost and small', items: [{ props: { icon: 'settings', label: 'Settings', ghost: true } }, { props: { icon: 'x', label: 'Close', ghost: true, size: 'sm' } }] },
      { label: 'Sizes', items: [{ props: { icon: 'heart', label: 'Save', size: 'xs' } }, { props: { icon: 'heart', label: 'Save', size: 'sm' } }, { props: { icon: 'heart', label: 'Save', size: 'md' } }, { props: { icon: 'heart', label: 'Save', size: 'lg' } }, { props: { icon: 'heart', label: 'Save', size: 'xl' } }] },
    ],
  },
  {
    name: 'Pressable',
    description: 'Unstyled pressable wrapper that gives any custom content a tap feedback and button semantics.',
    variants: [
      { label: 'Button', props: { label: 'Open hotel' }, text: 'Hilton Makkah, 5 nights' },
      { label: 'Disabled', props: { label: 'Sold out', disabled: true }, text: 'Sold out' },
    ],
  },
  {
    name: 'Fab',
    description: 'Floating action button for the primary action of a screen, optionally extended with a label. Use size (xs, sm, md, lg, xl) to change density.',
    variants: [
      { label: 'Icon only', props: { icon: 'plus', label: 'New booking' } },
      { label: 'Other icons', items: [{ props: { icon: 'message-circle', label: 'Chat' } }, { props: { icon: 'phone', label: 'Call' } }] },
      { label: 'Sizes', items: [{ props: { icon: 'plus', label: 'New booking', size: 'xs' } }, { props: { icon: 'plus', label: 'New booking', size: 'sm' } }, { props: { icon: 'plus', label: 'New booking', size: 'md' } }, { props: { icon: 'plus', label: 'New booking', size: 'lg' } }, { props: { icon: 'plus', label: 'New booking', size: 'xl' } }] },
    ],
  },
  {
    name: 'CopyButton',
    description: 'Copies a value to the clipboard and briefly confirms with a check icon. Use size (xs, sm, md, lg, xl) to change density.',
    variants: [
      { label: 'Default', props: { value: 'BK-2026-0412' } },
      { label: 'Custom label', items: [{ props: { value: 'https://ziyarago.com/t/umrah-14', label: 'Copy link', variant: 'secondary' } }, { props: { value: 'BK-2026-0412', label: 'Copy ID', variant: 'ghost', size: 'md' } }] },
      { label: 'Sizes', items: [{ props: { value: 'BK-2026-0412', size: 'xs' } }, { props: { value: 'BK-2026-0412', size: 'sm' } }, { props: { value: 'BK-2026-0412', size: 'md' } }, { props: { value: 'BK-2026-0412', size: 'lg' } }, { props: { value: 'BK-2026-0412', size: 'xl' } }] },
    ],
  },
  {
    name: 'ToggleGroup',
    description: 'Group of toggle buttons for single or multiple selection, with optional icons. Use size (xs, sm, md, lg, xl) to change density.',
    variants: [
      { label: 'Single', props: { modelValue: 'grid', options: [{ value: 'list', label: 'List' }, { value: 'grid', label: 'Grid' }, { value: 'map', label: 'Map' }] } },
      { label: 'Single, allowEmpty (click the active one to clear)', props: { allowEmpty: true, modelValue: 'grid', options: [{ value: 'list', label: 'List' }, { value: 'grid', label: 'Grid' }, { value: 'map', label: 'Map' }] } },
      { label: 'Multiple', props: { multiple: true, modelValue: ['wifi', 'meals'], options: [{ value: 'wifi', label: 'Wi-Fi' }, { value: 'meals', label: 'Meals' }, { value: 'shuttle', label: 'Shuttle' }] } },
      { label: 'Icon only', props: { iconOnly: true, modelValue: 'list', options: [{ value: 'list', label: 'List', icon: 'list' }, { value: 'grid', label: 'Grid', icon: 'layout-grid' }, { value: 'map', label: 'Map', icon: 'map' }] } },
      { label: 'Sizes', items: [{ props: { modelValue: 'b', options: [{ value: 'a', label: 'Day' }, { value: 'b', label: 'Week' }, { value: 'c', label: 'Month' }], size: 'xs' } }, { props: { modelValue: 'b', options: [{ value: 'a', label: 'Day' }, { value: 'b', label: 'Week' }, { value: 'c', label: 'Month' }], size: 'sm' } }, { props: { modelValue: 'b', options: [{ value: 'a', label: 'Day' }, { value: 'b', label: 'Week' }, { value: 'c', label: 'Month' }], size: 'md' } }, { props: { modelValue: 'b', options: [{ value: 'a', label: 'Day' }, { value: 'b', label: 'Week' }, { value: 'c', label: 'Month' }], size: 'lg' } }, { props: { modelValue: 'b', options: [{ value: 'a', label: 'Day' }, { value: 'b', label: 'Week' }, { value: 'c', label: 'Month' }], size: 'xl' } }] },
    ],
  },
  {
    name: 'SegmentedControl',
    description: 'Compact switch between a few mutually exclusive views. Use size (xs, sm, md, lg, xl) to change density.',
    variants: [
      { label: 'Default', props: { modelValue: 'umrah', items: [{ value: 'umrah', label: 'Umrah' }, { value: 'hajj', label: 'Hajj' }, { value: 'ziyarat', label: 'Ziyarat' }] } },
      { label: 'Small', props: { size: 'sm', modelValue: 'week', items: [{ value: 'day', label: 'Day' }, { value: 'week', label: 'Week' }, { value: 'month', label: 'Month' }] } },
      { label: 'Sizes', items: [{ props: { modelValue: 'b', items: [{ value: 'a', label: 'Day' }, { value: 'b', label: 'Week' }, { value: 'c', label: 'Month' }], size: 'xs' } }, { props: { modelValue: 'b', items: [{ value: 'a', label: 'Day' }, { value: 'b', label: 'Week' }, { value: 'c', label: 'Month' }], size: 'sm' } }, { props: { modelValue: 'b', items: [{ value: 'a', label: 'Day' }, { value: 'b', label: 'Week' }, { value: 'c', label: 'Month' }], size: 'md' } }, { props: { modelValue: 'b', items: [{ value: 'a', label: 'Day' }, { value: 'b', label: 'Week' }, { value: 'c', label: 'Month' }], size: 'lg' } }, { props: { modelValue: 'b', items: [{ value: 'a', label: 'Day' }, { value: 'b', label: 'Week' }, { value: 'c', label: 'Month' }], size: 'xl' } }] },
    ],
  },
  {
    name: 'FilterChips',
    description: 'Row of selectable chips used to filter lists, in single or multi selection mode. Use size (xs, sm, md, lg, xl) to change density.',
    variants: [
      { label: 'Single', props: { modelValue: 'all', items: [{ value: 'all', label: 'All' }, { value: 'makkah', label: 'Makkah' }, { value: 'madinah', label: 'Madinah' }, { value: 'jeddah', label: 'Jeddah' }] } },
      { label: 'Multi', props: { multi: true, modelValue: ['5star', 'haram'], items: [{ value: '5star', label: '5 stars' }, { value: 'haram', label: 'Near Haram' }, { value: 'breakfast', label: 'Breakfast' }, { value: 'free', label: 'Free cancellation' }] } },
      { label: 'Sizes', items: [{ props: { modelValue: 'all', items: [{ value: 'all', label: 'All' }, { value: 'makkah', label: 'Makkah' }, { value: 'madinah', label: 'Madinah' }], size: 'xs' } }, { props: { modelValue: 'all', items: [{ value: 'all', label: 'All' }, { value: 'makkah', label: 'Makkah' }, { value: 'madinah', label: 'Madinah' }], size: 'sm' } }, { props: { modelValue: 'all', items: [{ value: 'all', label: 'All' }, { value: 'makkah', label: 'Makkah' }, { value: 'madinah', label: 'Madinah' }], size: 'md' } }, { props: { modelValue: 'all', items: [{ value: 'all', label: 'All' }, { value: 'makkah', label: 'Makkah' }, { value: 'madinah', label: 'Madinah' }], size: 'lg' } }, { props: { modelValue: 'all', items: [{ value: 'all', label: 'All' }, { value: 'makkah', label: 'Makkah' }, { value: 'madinah', label: 'Madinah' }], size: 'xl' } }] },
    ],
  },
  {
    name: 'Chip',
    description: 'Small label with tone, variant and optional icon or remove button; size (xs, sm, md, lg, xl) sets density.',
    variants: [
      { label: 'Tones', items: [{ props: { tone: 'brand' }, text: 'Brand' }, { props: { tone: 'sky' }, text: 'Sky' }, { props: { tone: 'success' }, text: 'Confirmed' }, { props: { tone: 'warning' }, text: 'Pending' }, { props: { tone: 'danger' }, text: 'Cancelled' }, { props: { tone: 'neutral' }, text: 'Draft' }] },
      { label: 'With icon', items: [{ props: { tone: 'success', icon: 'check' }, text: 'Visa ready' }, { props: { tone: 'sky', icon: 'plane', pill: true }, text: 'Flight included' }] },
      { label: 'Sizes', items: [{ props: { tone: 'brand', size: 'xs' }, text: 'XS' }, { props: { tone: 'brand', size: 'sm' }, text: 'SM' }, { props: { tone: 'brand', size: 'md' }, text: 'MD' }, { props: { tone: 'brand', size: 'lg' }, text: 'LG' }, { props: { tone: 'brand', size: 'xl' }, text: 'XL' }] },
    ],
  },
  {
    name: 'Tag',
    description: 'Neutral keyword tag; becomes removable when onRemove is passed. Use size (xs, sm, md, lg, xl) to change density.',
    variants: [
      { label: 'Plain', items: [{ text: 'Near Haram' }, { text: 'Family' }, { text: 'Halal food' }] },
      { label: 'Sizes', items: [{ props: { size: 'xs' }, text: 'Near Haram' }, { props: { size: 'sm' }, text: 'Near Haram' }, { props: { size: 'md' }, text: 'Near Haram' }, { props: { size: 'lg' }, text: 'Near Haram' }, { props: { size: 'xl' }, text: 'Near Haram' }] },
    ],
  },
  {
    name: 'Badge',
    description: 'Tiny status marker or counter, optionally with a leading dot. Use size (xs, sm, md, lg, xl) to change density.',
    variants: [
      { label: 'Tones', items: [{ text: 'Default' }, { props: { tone: 'brand' }, text: 'Brand' }, { props: { tone: 'success' }, text: 'Paid' }, { props: { tone: 'warning' }, text: 'Pending' }, { props: { tone: 'danger' }, text: 'Overdue' }, { props: { tone: 'info' }, text: 'New' }] },
      { label: 'With dot', items: [{ props: { tone: 'success', dot: true }, text: 'Online' }, { props: { tone: 'danger', dot: true }, text: 'Offline' }] },
      { label: 'Sizes', items: [{ props: { tone: 'brand', size: 'xs' }, text: 'New' }, { props: { tone: 'brand', size: 'sm' }, text: 'New' }, { props: { tone: 'brand', size: 'md' }, text: 'New' }, { props: { tone: 'brand', size: 'lg' }, text: 'New' }, { props: { tone: 'brand', size: 'xl' }, text: 'New' }] },
    ],
  },
  {
    name: 'ActionRail',
    description: 'Floating glass toolbar of icon buttons with separators; the active one is highlighted. Use size (xs, sm, md, lg, xl) to change density.',
    variants: [
      { label: 'Toolbar', props: { value: 'select', items: [{ value: 'select', icon: 'mouse-pointer', label: 'Select' }, { value: 'draw', icon: 'pen-line', label: 'Draw' }, { separator: true }, { value: 'zoom-in', icon: 'zoom-in', label: 'Zoom in' }, { value: 'zoom-out', icon: 'zoom-out', label: 'Zoom out' }] } },
      { label: 'Sizes', items: [{ props: { value: 'select', items: [{ value: 'select', icon: 'mouse-pointer', label: 'Select' }, { value: 'draw', icon: 'pen-line', label: 'Draw' }, { separator: true }, { value: 'zoom-in', icon: 'zoom-in', label: 'Zoom in' }], size: 'xs' } }, { props: { value: 'select', items: [{ value: 'select', icon: 'mouse-pointer', label: 'Select' }, { value: 'draw', icon: 'pen-line', label: 'Draw' }, { separator: true }, { value: 'zoom-in', icon: 'zoom-in', label: 'Zoom in' }], size: 'sm' } }, { props: { value: 'select', items: [{ value: 'select', icon: 'mouse-pointer', label: 'Select' }, { value: 'draw', icon: 'pen-line', label: 'Draw' }, { separator: true }, { value: 'zoom-in', icon: 'zoom-in', label: 'Zoom in' }], size: 'md' } }, { props: { value: 'select', items: [{ value: 'select', icon: 'mouse-pointer', label: 'Select' }, { value: 'draw', icon: 'pen-line', label: 'Draw' }, { separator: true }, { value: 'zoom-in', icon: 'zoom-in', label: 'Zoom in' }], size: 'lg' } }, { props: { value: 'select', items: [{ value: 'select', icon: 'mouse-pointer', label: 'Select' }, { value: 'draw', icon: 'pen-line', label: 'Draw' }, { separator: true }, { value: 'zoom-in', icon: 'zoom-in', label: 'Zoom in' }], size: 'xl' } }] },
    ],
  },
  {
    name: 'ActionCard',
    description: 'Card with a header that can be collapsed, refreshed or removed. Use size (xs, sm, md, lg, xl) to change density.',
    variants: [
      { label: 'Default', width: '420px', props: { title: 'Upcoming departures', subtitle: 'Next 7 days' }, text: '3 groups depart from Tashkent to Jeddah this week.' },
      { label: 'No subtitle', width: '420px', props: { title: 'Pending visas' }, text: '12 applications are waiting for embassy approval.' },
      { label: 'Sizes', width: '420px', items: [{ props: { title: 'Upcoming departures', subtitle: 'Next 7 days', size: 'xs' }, text: '3 groups depart this week.' }, { props: { title: 'Upcoming departures', subtitle: 'Next 7 days', size: 'sm' }, text: '3 groups depart this week.' }, { props: { title: 'Upcoming departures', subtitle: 'Next 7 days', size: 'md' }, text: '3 groups depart this week.' }, { props: { title: 'Upcoming departures', subtitle: 'Next 7 days', size: 'lg' }, text: '3 groups depart this week.' }, { props: { title: 'Upcoming departures', subtitle: 'Next 7 days', size: 'xl' }, text: '3 groups depart this week.' }] },
    ],
  },
  {
    name: 'NotificationBell',
    description: 'Bell button with unread counter that opens a dropdown list of notifications. Use size (xs, sm, md, lg, xl) to change density.',
    variants: [
      { label: 'Unread', props: { items: [{ id: 1, title: 'Booking confirmed', message: 'Hilton Makkah, 5 nights', time: '2 min ago' }, { id: 2, title: 'Payment received', message: '$1,240 from Aziz K.', time: '1 h ago' }, { id: 3, title: 'Visa approved', message: 'Group UM-14', time: 'Yesterday', read: true }] } },
      { label: 'All read', props: { items: [{ id: 1, title: 'Visa approved', message: 'Group UM-14', time: 'Yesterday', read: true }] } },
      { label: 'Sizes', items: [{ props: { items: [{ id: 1, title: 'Booking confirmed', message: 'Hilton Makkah,  5 nights', time: '2 min ago' }], size: 'xs' } }, { props: { items: [{ id: 1, title: 'Booking confirmed', message: 'Hilton Makkah,  5 nights', time: '2 min ago' }], size: 'sm' } }, { props: { items: [{ id: 1, title: 'Booking confirmed', message: 'Hilton Makkah,  5 nights', time: '2 min ago' }], size: 'md' } }, { props: { items: [{ id: 1, title: 'Booking confirmed', message: 'Hilton Makkah,  5 nights', time: '2 min ago' }], size: 'lg' } }, { props: { items: [{ id: 1, title: 'Booking confirmed', message: 'Hilton Makkah,  5 nights', time: '2 min ago' }], size: 'xl' } }] },
    ],
  },
]
export default examples
