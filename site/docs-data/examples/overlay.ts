import type { Example } from '../types'

const images = ["data:image/svg+xml,%3Csvg%20xmlns='http://www.w3.org/2000/svg'%20width='800'%20height='500'%3E%3Crect%20width='800'%20height='500'%20fill='%230f766e'/%3E%3Ctext%20x='400'%20y='260'%20font-size='48'%20fill='white'%20text-anchor='middle'%20font-family='sans-serif'%3EHaram%20view%3C/text%3E%3C/svg%3E", "data:image/svg+xml,%3Csvg%20xmlns='http://www.w3.org/2000/svg'%20width='800'%20height='500'%3E%3Crect%20width='800'%20height='500'%20fill='%239a3412'/%3E%3Ctext%20x='400'%20y='260'%20font-size='48'%20fill='white'%20text-anchor='middle'%20font-family='sans-serif'%3EHotel%20lobby%3C/text%3E%3C/svg%3E", "data:image/svg+xml,%3Csvg%20xmlns='http://www.w3.org/2000/svg'%20width='800'%20height='500'%3E%3Crect%20width='800'%20height='500'%20fill='%231d4ed8'/%3E%3Ctext%20x='400'%20y='260'%20font-size='48'%20fill='white'%20text-anchor='middle'%20font-family='sans-serif'%3EDeluxe%20room%3C/text%3E%3C/svg%3E"]

const examples: Example[] = [
  {
    name: 'Modal',
    description: 'Centered dialog with a title, body and optional footer slot. The size prop (xs, sm, md, lg, xl) sets the dialog width and padding.',
    variants: [
      { label: 'Basic', overlay: true, props: { title: 'Trip details' }, text: 'Umrah package, 10 nights: 5 in Makkah, 5 in Madinah. Flights and transfers included.' },
      { label: 'With footer', overlay: true, props: { title: 'Share itinerary' }, text: 'Send the full day-by-day plan to your group.', slots: { footer: 'Footer actions go here' } },
      { label: 'With a DatePicker', overlay: true, props: { title: 'Schedule pickup' }, children: [{ name: 'div', props: { style: { overflow: 'auto', maxHeight: '160px', display: 'flex', flexDirection: 'column', gap: '12px' } }, children: [{ name: 'Select', props: { label: 'Hotel', modelValue: 'a', options: [{ value: 'a', label: 'Makkah Clock Tower' }, { value: 'b', label: 'Madinah Oberoi' }] } }, { name: 'DatePicker', props: { label: 'Pickup date', modelValue: '2026-03-10' } }] }] },
      { label: 'Sizes', overlay: true, props: { size: 'lg', title: 'Trip details' }, text: 'Pick xs (320px) up to xl (720px) wide; the demo shows lg.' },
    ],
  },
  {
    name: 'Drawer',
    description: 'Side panel that slides in from the start or end edge. The size prop (xs, sm, md, lg, xl) sets the panel width.',
    variants: [
      { label: 'End', overlay: true, props: { title: 'Filters', side: 'end' }, text: 'Price, star rating and distance to Haram filters.' },
      { label: 'Start', overlay: true, props: { title: 'Menu', side: 'start' }, text: 'Navigation links and account settings.' },
      { label: 'Sizes', overlay: true, props: { size: 'lg', title: 'Filters', side: 'end' }, text: 'Pick xs (280px) up to xl (640px) wide; the demo shows lg.' },
    ],
  },
  {
    name: 'ConfirmDialog',
    description: 'Confirmation modal with cancel and confirm buttons; danger tone for destructive actions. The size prop (xs, sm, md, lg, xl) sets the dialog width and padding.',
    variants: [
      { label: 'Default', overlay: true, props: { title: 'Confirm booking', description: 'Reserve this room for 5 nights?', confirmLabel: 'Reserve' } },
      { label: 'Danger', overlay: true, props: { title: 'Cancel booking', description: 'This cannot be undone. A fee may apply.', tone: 'danger', confirmLabel: 'Cancel booking', cancelLabel: 'Keep it' } },
      { label: 'Sizes', overlay: true, props: { size: 'sm', title: 'Confirm booking', description: 'Reserve this room for 5 nights?', confirmLabel: 'Reserve' } },
    ],
  },
  {
    name: 'Popconfirm',
    description: 'Small inline confirmation popover attached to a trigger button. The size prop (xs, sm, md, lg, xl) sets the trigger button and panel density.',
    variants: [
      { label: 'Danger', props: { label: 'Delete guest', title: 'Delete this guest?' } },
      { label: 'Primary', props: { label: 'Send invoice', title: 'Send invoice now?', variant: 'primary' } },
      { label: 'Custom labels', props: { label: 'Cancel booking', title: 'Cancel this booking?', confirmLabel: 'Cancel booking', cancelLabel: 'Keep it' } },
      { label: 'Sizes', items: [
        { props: { size: 'xs', label: 'Delete guest', title: 'Delete this guest?' } },
        { props: { size: 'sm', label: 'Delete guest', title: 'Delete this guest?' } },
        { props: { size: 'md', label: 'Delete guest', title: 'Delete this guest?' } },
        { props: { size: 'lg', label: 'Delete guest', title: 'Delete this guest?' } },
        { props: { size: 'xl', label: 'Delete guest', title: 'Delete this guest?' } },
      ] },
    ],
  },
  {
    name: 'StepDialog',
    description: 'Wizard modal with a steps sidebar and previous/next navigation. The size prop (xs, sm, md, lg, xl) sets the dialog width.',
    variants: [
      { label: 'Step 2 of 3', overlay: true, props: { title: 'New booking', current: 1, steps: [{ title: 'Guest', sub: 'Who is travelling' }, { title: 'Room', sub: 'Pick a room type' }, { title: 'Payment', sub: 'Confirm and pay' }] }, text: 'Choose between Double, Twin and Family rooms.' },
      { label: 'Sizes', overlay: true, props: { size: 'lg', title: 'New booking', current: 1, steps: [{ title: 'Guest', sub: 'Who is travelling' }, { title: 'Room', sub: 'Pick a room type' }, { title: 'Payment', sub: 'Confirm and pay' }] }, text: 'Choose between Double, Twin and Family rooms.' },
    ],
  },
  {
    name: 'FullscreenDialog',
    description: 'Full-screen dialog with close button, title and a save action.',
    variants: [
      { label: 'Default', overlay: true, props: { title: 'Edit itinerary', saveLabel: 'Save changes' }, text: 'Day 1: arrival in Jeddah and transfer to Makkah.' },
    ],
  },
  {
    name: 'BottomSheet',
    description: 'Mobile-style sheet that rises from the bottom, with optional title and footer. The size prop (xs, sm, md, lg, xl) sets the sheet width and padding.',
    variants: [
      { label: 'Basic', overlay: true, props: { title: 'Select room' }, text: 'Double room, 2 adults, breakfast included.' },
      { label: 'With footer', overlay: true, props: { title: 'Price breakdown', maxHeight: '60vh' }, text: 'Room 5 nights: $450. Taxes: $45.', slots: { footer: 'Total $495' } },
      { label: 'Sizes', overlay: true, props: { size: 'lg', title: 'Select room' }, text: 'Double room, 2 adults, breakfast included.' },
    ],
  },
  {
    name: 'Actionsheet',
    description: 'Bottom sheet listing tappable actions with a cancel row. The size prop (xs, sm, md, lg, xl) sets the sheet width and padding.',
    variants: [
      { label: 'Actions', overlay: true, props: { title: 'Booking #2041', items: [{ label: 'Edit dates', icon: 'calendar' }, { label: 'Share', icon: 'share' }, { label: 'Cancel booking', icon: 'trash', tone: 'danger' }] } },
      { label: 'Sizes', overlay: true, props: { size: 'lg', title: 'Booking #2041', items: [{ label: 'Edit dates', icon: 'calendar' }, { label: 'Share', icon: 'share' }] } },
    ],
  },
  {
    name: 'Popover',
    description: 'Click-to-toggle floating panel anchored to a button. The size prop (xs, sm, md, lg, xl) sets the trigger button and panel density.',
    variants: [
      { label: 'Default', props: { label: 'Cancellation policy' }, text: 'Free cancellation up to 7 days before arrival.' },
      { label: 'Small trigger', props: { label: 'Details', size: 'sm' }, text: 'Breakfast and airport transfer included.' },
      { label: 'Sizes', items: [
        { props: { size: 'xs', label: 'Details' }, text: 'Breakfast and airport transfer included.' },
        { props: { size: 'sm', label: 'Details' }, text: 'Breakfast and airport transfer included.' },
        { props: { size: 'md', label: 'Details' }, text: 'Breakfast and airport transfer included.' },
        { props: { size: 'lg', label: 'Details' }, text: 'Breakfast and airport transfer included.' },
        { props: { size: 'xl', label: 'Details' }, text: 'Breakfast and airport transfer included.' },
      ] },
    ],
  },
  {
    name: 'HoverCard',
    description: 'Rich card revealed when hovering or focusing the trigger text. The size prop (xs, sm, md, lg, xl) sets the card width, padding and text.',
    variants: [
      { label: 'Default', props: { trigger: 'Hover over Makkah Clock Tower' }, text: '5-star hotel, 80 m from the Haram gate. Rooms from $180.' },
      { label: 'Sizes', items: [
        { props: { size: 'xs', trigger: 'Makkah Clock Tower' }, text: '5-star hotel, 80 m from the Haram gate.' },
        { props: { size: 'sm', trigger: 'Makkah Clock Tower' }, text: '5-star hotel, 80 m from the Haram gate.' },
        { props: { size: 'md', trigger: 'Makkah Clock Tower' }, text: '5-star hotel, 80 m from the Haram gate.' },
        { props: { size: 'lg', trigger: 'Makkah Clock Tower' }, text: '5-star hotel, 80 m from the Haram gate.' },
        { props: { size: 'xl', trigger: 'Makkah Clock Tower' }, text: '5-star hotel, 80 m from the Haram gate.' },
      ] },
    ],
  },
  {
    name: 'Tooltip',
    description: 'Short hint shown on hover or focus of the wrapped element. The size prop (xs, sm, md, lg, xl) sets the tooltip padding and text.',
    variants: [
      { label: 'Default', props: { text: 'Copy booking ID' }, text: 'Hover me' },
      { label: 'Several', items: [{ props: { text: 'Free Wi-Fi' }, text: 'Wi-Fi' }, { props: { text: 'Shuttle to Haram' }, text: 'Shuttle' }] },
      { label: 'Sizes', items: [
        { props: { size: 'xs', text: 'Copy booking ID' }, text: 'Hover me' },
        { props: { size: 'sm', text: 'Copy booking ID' }, text: 'Hover me' },
        { props: { size: 'md', text: 'Copy booking ID' }, text: 'Hover me' },
        { props: { size: 'lg', text: 'Copy booking ID' }, text: 'Hover me' },
        { props: { size: 'xl', text: 'Copy booking ID' }, text: 'Hover me' },
      ] },
    ],
  },
  {
    name: 'Dropdown',
    description: 'Button that opens a menu of actions with icons, shortcuts and separators. The size prop (xs, sm, md, lg, xl) sets the button and menu item density.',
    variants: [
      { label: 'Actions', props: { label: 'Actions', items: [{ label: 'Edit', value: 'edit', icon: 'pencil', shortcut: 'E' }, { label: 'Duplicate', value: 'dup', icon: 'copy' }, { separator: true }, { label: 'Delete', value: 'del', icon: 'trash', tone: 'danger' }] } },
      { label: 'Small with icon', props: { label: 'Sort', size: 'sm', icon: 'arrow-up-down', items: [{ label: 'Price', value: 'price' }, { label: 'Rating', value: 'rating' }, { label: 'Distance', value: 'dist' }] } },
      { label: 'Icon only', props: { iconOnly: true, ghost: true, label: 'Row actions', items: [{ label: 'Edit', value: 'edit', icon: 'pencil' }, { label: 'Duplicate', value: 'dup', icon: 'copy' }, { separator: true }, { label: 'Delete', value: 'del', icon: 'trash-2', tone: 'danger' }] } },
      { label: 'Custom trigger', slots: { trigger: [{ name: 'Avatar', props: { name: 'Amina Yusuf', size: 36 } }] }, props: { items: [{ label: 'Profile', value: 'profile', icon: 'user' }, { label: 'Settings', value: 'settings', icon: 'settings' }, { separator: true }, { label: 'Sign out', value: 'out', icon: 'log-out' }] } },
      { label: 'In a table row', width: '420px', inside: { name: 'div', props: { style: { overflow: 'hidden', border: '1px solid var(--zg-stroke)', borderRadius: '16px' } }, children: [{ name: 'table', props: { class: 'zg-table' }, children: [{ name: 'tbody', children: [{ name: 'tr', children: [{ name: 'td', text: 'Umrah Economy, 10 nights' }, { name: 'td', props: { style: { width: '56px', textAlign: 'end' } }, children: [{ name: '$' }] }] }] }] }] }, props: { iconOnly: true, ghost: true, icon: 'ellipsis', label: 'Row actions', items: [{ label: 'View booking', value: 'view', icon: 'eye' }, { label: 'Edit', value: 'edit', icon: 'pencil' }, { separator: true }, { label: 'Cancel', value: 'cancel', icon: 'trash-2', tone: 'danger' }] } },
      { label: 'Sizes', items: [
        { props: { size: 'xs', label: 'Actions', items: [{ label: 'Edit', value: 'edit', icon: 'pencil', shortcut: 'E' }, { label: 'Duplicate', value: 'dup', icon: 'copy' }, { separator: true }, { label: 'Delete', value: 'del', icon: 'trash', tone: 'danger' }] } },
        { props: { size: 'sm', label: 'Actions', items: [{ label: 'Edit', value: 'edit', icon: 'pencil', shortcut: 'E' }, { label: 'Duplicate', value: 'dup', icon: 'copy' }, { separator: true }, { label: 'Delete', value: 'del', icon: 'trash', tone: 'danger' }] } },
        { props: { size: 'md', label: 'Actions', items: [{ label: 'Edit', value: 'edit', icon: 'pencil', shortcut: 'E' }, { label: 'Duplicate', value: 'dup', icon: 'copy' }, { separator: true }, { label: 'Delete', value: 'del', icon: 'trash', tone: 'danger' }] } },
        { props: { size: 'lg', label: 'Actions', items: [{ label: 'Edit', value: 'edit', icon: 'pencil', shortcut: 'E' }, { label: 'Duplicate', value: 'dup', icon: 'copy' }, { separator: true }, { label: 'Delete', value: 'del', icon: 'trash', tone: 'danger' }] } },
        { props: { size: 'xl', label: 'Actions', items: [{ label: 'Edit', value: 'edit', icon: 'pencil', shortcut: 'E' }, { label: 'Duplicate', value: 'dup', icon: 'copy' }, { separator: true }, { label: 'Delete', value: 'del', icon: 'trash', tone: 'danger' }] } },
      ] },
    ],
  },
  {
    name: 'Menu',
    description: 'Static menu list, useful on its own or as the content of custom popups. The size prop (xs, sm, md, lg, xl) sets the item height, padding and text.',
    variants: [
      { label: 'Default', width: '240px', props: { items: [{ label: 'Profile', value: 'p', icon: 'user' }, { label: 'My trips', value: 't', icon: 'map' }, { separator: true }, { label: 'Sign out', value: 'out', icon: 'log-out', tone: 'danger' }] } },
      { label: 'Sizes', items: [
        { props: { size: 'xs', items: [{ label: 'Edit', value: 'edit', icon: 'pencil', shortcut: 'E' }, { label: 'Duplicate', value: 'dup', icon: 'copy' }, { separator: true }, { label: 'Delete', value: 'del', icon: 'trash', tone: 'danger' }] } },
        { props: { size: 'sm', items: [{ label: 'Edit', value: 'edit', icon: 'pencil', shortcut: 'E' }, { label: 'Duplicate', value: 'dup', icon: 'copy' }, { separator: true }, { label: 'Delete', value: 'del', icon: 'trash', tone: 'danger' }] } },
        { props: { size: 'md', items: [{ label: 'Edit', value: 'edit', icon: 'pencil', shortcut: 'E' }, { label: 'Duplicate', value: 'dup', icon: 'copy' }, { separator: true }, { label: 'Delete', value: 'del', icon: 'trash', tone: 'danger' }] } },
        { props: { size: 'lg', items: [{ label: 'Edit', value: 'edit', icon: 'pencil', shortcut: 'E' }, { label: 'Duplicate', value: 'dup', icon: 'copy' }, { separator: true }, { label: 'Delete', value: 'del', icon: 'trash', tone: 'danger' }] } },
        { props: { size: 'xl', items: [{ label: 'Edit', value: 'edit', icon: 'pencil', shortcut: 'E' }, { label: 'Duplicate', value: 'dup', icon: 'copy' }, { separator: true }, { label: 'Delete', value: 'del', icon: 'trash', tone: 'danger' }] } },
      ] },
    ],
  },
  {
    name: 'ContextMenu',
    description: 'Right-click menu that opens at the cursor over its content. The size prop (xs, sm, md, lg, xl) sets the item height, padding and text.',
    variants: [
      { label: 'Right-click area', width: '360px', props: { items: [{ label: 'Open', value: 'open', icon: 'external-link' }, { label: 'Copy link', value: 'copy', icon: 'copy', shortcut: 'C' }, { separator: true }, { label: 'Remove', value: 'rm', icon: 'trash', tone: 'danger' }] }, text: 'Right-click anywhere on this text to open the menu.' },
      { label: 'Sizes', items: [
        { props: { size: 'xs', items: [{ label: 'Edit', value: 'edit', icon: 'pencil', shortcut: 'E' }, { label: 'Duplicate', value: 'dup', icon: 'copy' }, { separator: true }, { label: 'Delete', value: 'del', icon: 'trash', tone: 'danger' }] }, text: 'Right-click here' },
        { props: { size: 'sm', items: [{ label: 'Edit', value: 'edit', icon: 'pencil', shortcut: 'E' }, { label: 'Duplicate', value: 'dup', icon: 'copy' }, { separator: true }, { label: 'Delete', value: 'del', icon: 'trash', tone: 'danger' }] }, text: 'Right-click here' },
        { props: { size: 'md', items: [{ label: 'Edit', value: 'edit', icon: 'pencil', shortcut: 'E' }, { label: 'Duplicate', value: 'dup', icon: 'copy' }, { separator: true }, { label: 'Delete', value: 'del', icon: 'trash', tone: 'danger' }] }, text: 'Right-click here' },
        { props: { size: 'lg', items: [{ label: 'Edit', value: 'edit', icon: 'pencil', shortcut: 'E' }, { label: 'Duplicate', value: 'dup', icon: 'copy' }, { separator: true }, { label: 'Delete', value: 'del', icon: 'trash', tone: 'danger' }] }, text: 'Right-click here' },
        { props: { size: 'xl', items: [{ label: 'Edit', value: 'edit', icon: 'pencil', shortcut: 'E' }, { label: 'Duplicate', value: 'dup', icon: 'copy' }, { separator: true }, { label: 'Delete', value: 'del', icon: 'trash', tone: 'danger' }] }, text: 'Right-click here' },
      ] },
    ],
  },
  {
    name: 'CommandBar',
    description: 'Floating glass toolbar of icon actions, with separators. The size prop (xs, sm, md, lg, xl) sets the button size and toolbar padding.',
    variants: [
      { label: 'Toolbar', props: { items: [{ id: 'edit', label: 'Edit', icon: 'pencil' }, { id: 'copy', label: 'Copy', icon: 'copy' }, { separator: true }, { id: 'share', label: 'Share', icon: 'share' }, { id: 'del', label: 'Delete', icon: 'trash', disabled: true }] } },
      { label: 'Sizes', items: [
        { props: { size: 'xs', items: [{ id: 'edit', label: 'Edit', icon: 'pencil' }, { id: 'copy', label: 'Copy', icon: 'copy' }, { separator: true }, { id: 'share', label: 'Share', icon: 'share' }] } },
        { props: { size: 'sm', items: [{ id: 'edit', label: 'Edit', icon: 'pencil' }, { id: 'copy', label: 'Copy', icon: 'copy' }, { separator: true }, { id: 'share', label: 'Share', icon: 'share' }] } },
        { props: { size: 'md', items: [{ id: 'edit', label: 'Edit', icon: 'pencil' }, { id: 'copy', label: 'Copy', icon: 'copy' }, { separator: true }, { id: 'share', label: 'Share', icon: 'share' }] } },
        { props: { size: 'lg', items: [{ id: 'edit', label: 'Edit', icon: 'pencil' }, { id: 'copy', label: 'Copy', icon: 'copy' }, { separator: true }, { id: 'share', label: 'Share', icon: 'share' }] } },
        { props: { size: 'xl', items: [{ id: 'edit', label: 'Edit', icon: 'pencil' }, { id: 'copy', label: 'Copy', icon: 'copy' }, { separator: true }, { id: 'share', label: 'Share', icon: 'share' }] } },
      ] },
    ],
  },
  {
    name: 'CommandPalette',
    description: 'Searchable command launcher modal with keyboard shortcut hints. The size prop (xs, sm, md, lg, xl) sets the palette width (xs 400px to xl 720px).',
    variants: [
      { label: 'Default', overlay: true, props: { placeholder: 'Search commands', commands: [{ id: 'new', label: 'New booking', icon: 'plus', shortcut: 'N' }, { id: 'guests', label: 'Open guests', icon: 'users', keywords: 'people' }, { id: 'rooms', label: 'Room calendar', icon: 'calendar' }, { id: 'settings', label: 'Settings', icon: 'settings', shortcut: ',' }] } },
      { label: 'Sizes', overlay: true, props: { size: 'lg', placeholder: 'Search commands', commands: [{ id: 'new', label: 'New booking', icon: 'plus', shortcut: 'N' }, { id: 'guests', label: 'Open guests', icon: 'users' }] } },
    ],
  },
  {
    name: 'ImageViewer',
    description: 'Full-screen image lightbox with previous and next arrows.',
    variants: [
      { label: 'Gallery', overlay: true, props: { images, index: 0, alt: 'Hotel photos' } },
      { label: 'Single image', overlay: true, props: { images: [images[0]], alt: 'Haram view' } },
    ],
  },
  {
    name: 'Tour',
    description: 'Guided product tour that highlights page elements by CSS selector.',
    variants: [
      { label: 'Centered steps', overlay: true, props: { steps: [{ title: 'Welcome', text: 'Let us show you around the booking tools.' }, { title: 'Search', text: 'Find hotels by city and dates.' }, { title: 'Done', text: 'You are ready to book.' }] } },
      { label: 'Highlight element', overlay: true, props: { steps: [{ target: 'h1', title: 'Page title', text: 'This highlights the page heading.' }, { title: 'All set', text: 'That is the tour.' }] } },
    ],
  },
  {
    name: 'TourPopover',
    description: 'The step card used by Tour, usable standalone for custom onboarding.',
    variants: [
      { label: 'Middle step', width: '380px', props: { title: 'Room calendar', text: 'Drag across dates to block rooms.', step: '2 / 4' } },
      { label: 'Last step', width: '380px', props: { title: 'All set', text: 'You can restart the tour in Settings.', step: '4 / 4', last: true } },
    ],
  },
  {
    name: 'Screensaver',
    description: 'Idle-screen overlay with a live clock and date; click to dismiss.',
    variants: [
      { label: 'Default', overlay: true, props: { hint: 'Tap anywhere to continue' } },
      { label: 'Locale', overlay: true, props: { locale: 'en-US', hint: 'Touch to wake' } },
    ],
  },
]
export default examples
