// Fixtures for interactions.mjs, in the docs example format so the same apps can render them (?data=cases).
// Props written as "$spy:label" become functions that record their arguments (see tests/lib/spy.js).
const OPTS = [{ value: 'a', label: 'Alpha' }, { value: 'b', label: 'Beta' }, { value: 'c', label: 'Gamma' }];
const TABS = [{ value: 'one', label: 'One' }, { value: 'two', label: 'Two' }, { value: 'three', label: 'Three' }];
const FOOT = { footer: [{ name: 'Button', props: { variant: 'secondary' }, text: 'Cancel' }, { name: 'Button', props: { variant: 'primary' }, text: 'Save' }] };
const one = (name, variant, ...more) => ({ name, description: '', variants: [{ label: 'case', ...variant }, ...more.map((m, i) => ({ label: 'case' + (i + 2), ...m }))] });

export const CASES = [
  one('Select', { props: { label: 'City', modelValue: 'a', options: OPTS } }),
  one('MultiSelect', { props: { modelValue: ['a'], options: OPTS } }, { props: { modelValue: ['a'], options: OPTS } }),
  one('Combobox', { props: { modelValue: 'a', options: OPTS } }, { props: { modelValue: 'a', options: OPTS } }),
  one('DatePicker', { props: { label: 'Date', modelValue: '2026-03-10', locale: 'en-GB' } }, { props: { label: 'Date', modelValue: '2026-03-10', locale: 'en-GB' } }),
  one('Calendar', { props: { locale: 'en-GB' } }, { props: { modelValue: '2026-03-10', today: '2026-03-15', locale: 'en-GB' } }),
  one('Tabs', { props: { items: TABS, modelValue: 'one' } }),
  one('SegmentedControl', { props: { items: TABS, modelValue: 'one' } }),
  one('PillTabs', { props: { items: TABS, value: 'one' } }),
  one('Menu', { props: { items: [{ label: 'Open', value: 'open' }, { label: 'Copy', value: 'copy', disabled: true }, { label: 'Paste', value: 'paste' }] } }),
  one('Tooltip', { props: { text: 'Copies the link' }, text: 'Hover me' }),
  one('Switch', { props: { label: 'Wi-Fi', modelValue: false } }),
  one('Checkbox', { props: { label: 'Agree', modelValue: false } }),
  one('Modal', { overlay: true, props: { title: 'Confirm booking' }, text: 'Body text', slots: FOOT },
    { overlay: true, props: { title: 'Schedule' }, children: [{ name: 'div', props: { style: { overflow: 'auto', height: '100px', flex: 'none' } }, children: [{ name: 'div', props: { style: { height: '50px', flex: 'none' } } }, { name: 'DatePicker', props: { label: 'Date', modelValue: '2026-03-10', locale: 'en-GB' } }, { name: 'div', props: { style: { height: '40px', flex: 'none' } } }] }] }),
  one('Drawer', { overlay: true, props: { title: 'Guest details' }, text: 'Drawer body', slots: FOOT }),
  one('Pagination', { props: { page: 2, pages: 10 } }),
  one('Accordion', { props: { items: [{ id: 'a', title: 'First', body: 'Body A' }, { id: 'b', title: 'Second', body: 'Body B' }] } }),
  one('Dropdown', { props: { label: 'Actions', onSelect: '$spy:select', items: [{ label: 'Edit', value: 'edit', onClick: '$spy:edit' }, { separator: true }, { label: 'Delete', value: 'del', tone: 'danger', onClick: '$spy:delete' }] } },
    { inside: { name: 'div', props: { style: { overflow: 'hidden', height: '56px', width: '260px', border: '1px solid #888', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', padding: '0 8px' } }, children: [{ name: '$' }] }, props: { iconOnly: true, ghost: true, label: 'Row actions', items: [{ label: 'View', value: 'view' }, { label: 'Edit', value: 'edit' }, { label: 'Delete', value: 'del', tone: 'danger' }] } },
    { slots: { trigger: [{ name: 'Avatar', props: { name: 'Amina Yusuf' } }] }, props: { items: [{ label: 'Profile', value: 'profile' }, { label: 'Sign out', value: 'out' }] } }),
  one('TopNav', { props: { brand: 'Brand', value: 'home', onChange: '$spy:nav', items: [{ value: 'home', label: 'Home' }, { value: 'bookings', label: 'Bookings', children: [{ value: 'upcoming', label: 'Upcoming', icon: 'calendar-clock' }, { separator: true }, { value: 'past', label: 'Past', count: 3 }] }] } }),
  one('SideNav', { props: { brand: 'Brand', value: 'home', onChange: '$spy:side', items: [{ value: 'home', label: 'Home', icon: 'house' }, { value: 'bookings', label: 'Bookings', icon: 'calendar-check', children: [{ value: 'upcoming', label: 'Upcoming' }, { value: 'past', label: 'Past' }] }] } }),
  one('TextField', { props: { label: 'Name', modelValue: '' } }),
  one('CommandPalette', { overlay: true, props: { onRun: '$spy:run', commands: [{ id: 'new', label: 'New booking' }, { id: 'find', label: 'Find guest' }, { id: 'set', label: 'Settings' }] } }),
  one('ContextMenu', { props: { onSelect: '$spy:ctx', items: [{ label: 'Open', value: 'open' }, { label: 'Copy', value: 'copy' }] }, text: 'Right-click here' }),
];
