// API metadata for the actions group. Format: see src/meta/README.md
const SIZES = ['xs', 'sm', 'md', 'lg', 'xl'];
const sizeProp = (def = 'md', desc = 'Component size.') => ({ type: "'xs' | 'sm' | 'md' | 'lg' | 'xl'", values: SIZES, default: def, description: desc });
const TONES = ['brand', 'sky', 'success', 'warning', 'danger', 'neutral'];
const toneType = "'brand' | 'sky' | 'success' | 'warning' | 'danger' | 'neutral'";
const icon = (desc = 'Icon name.') => ({ type: 'string', description: desc });

export default {
  Button: {
    description: 'Primary action control with visual variants, tones, sizes, icons and a loading state.',
    props: {
      variant: { type: "'primary' | 'secondary' | 'ghost' | 'danger' | 'inverse' | 'tonal' | 'outlined' | 'text' | 'elevated'", values: ['primary', 'secondary', 'ghost', 'danger', 'inverse', 'tonal', 'outlined', 'text', 'elevated'], default: 'secondary', description: 'Visual emphasis. primary is the main call to action, danger is destructive, inverse is for dark surfaces.' },
      tone: { type: toneType, values: TONES, description: 'Accent color applied to tonal, outlined, text and elevated variants.' },
      size: sizeProp('md', 'Button height: xs 28px, sm 32px, md 40px, lg 48px, xl 56px.'),
      icon: icon('Icon shown before the label.'),
      iconRight: icon('Icon shown after the label.'),
      loading: { type: 'boolean', default: false, description: 'Shows a spinner instead of the icon and disables the button.' },
      disabled: { type: 'boolean', default: false, description: 'Blocks interaction and dims the button.' },
      block: { type: 'boolean', default: false, description: 'Stretches the button to the full width of its container.' },
      type: { type: "'button' | 'submit' | 'reset'", values: ['button', 'submit', 'reset'], default: 'button', description: 'Native button type. Use submit inside a form.' },
      iconOnly: { type: 'boolean', default: false, description: 'Square button (width equals height) with no horizontal padding, for a lone icon. Pass an aria-label.' },
      title: { type: 'string', description: 'Native tooltip text.' },
    },
    events: { click: 'Native click event. Not fired while disabled or loading.' },
    slots: { default: 'Button label.' },
    notes: ['Renders type="button" unless type is set, so it never submits a form by itself.'],
  },
  IconButton: {
    description: 'Square button with only an icon; use for toolbars and compact actions.',
    props: {
      icon: { type: 'string', required: true, description: 'Icon name.' },
      label: { type: 'string', required: true, description: 'Accessible name (aria-label). Required because there is no visible text.' },
      size: sizeProp('md', 'Button size: xs 28px, sm 32px, md 40px, lg 48px, xl 56px.'),
      ghost: { type: 'boolean', default: false, description: 'Transparent background until hover.' },
    },
    events: { click: 'Native click event.' },
  },
  Pressable: {
    description: 'Unstyled pressable wrapper that makes any content a button with press feedback.',
    props: {
      as: { type: 'string', default: 'button', description: 'HTML tag. type="button" is set only when this is button.' },
      label: { type: 'string', description: 'Accessible name (aria-label).' },
      disabled: { type: 'boolean', default: false, description: 'Blocks interaction.' },
    },
    events: { click: 'Native click event.' },
    slots: { default: 'Pressable content.' },
    notes: ['For a non-button tag add role and keyboard handling yourself.'],
  },
  Fab: {
    description: 'Floating action button for the main action of a screen; extended when a label is given.',
    props: {
      icon: { type: 'string', default: 'plus', description: 'Icon name.' },
      label: { type: 'string', description: 'Text next to the icon (extended FAB) and the accessible name.' },
      size: sizeProp('md', 'Button height: xs 36px, sm 44px, md 56px, lg 64px, xl 72px.'),
    },
    events: { click: 'Native click event.' },
    notes: ['Always pass label: it is the accessible name. Without it the button falls back to the icon name as aria-label (for example "plus"), which is rarely a good description.'],
  },
  CopyButton: {
    description: 'Button that copies a value to the clipboard and briefly confirms with a check icon, or reports a failure.',
    props: {
      value: { type: 'string', required: true, description: 'Text copied to the clipboard.' },
      label: { type: 'string', description: 'Button text. Defaults to "Copy", then "Copied" for 1.5s after a click.' },
      variant: { type: "'primary' | 'secondary' | 'ghost' | 'danger' | 'inverse' | 'tonal' | 'outlined' | 'text' | 'elevated'", values: ['primary', 'secondary', 'ghost', 'danger', 'inverse', 'tonal', 'outlined', 'text', 'elevated'], default: 'secondary', description: 'Button variant, same values as Button.' },
      size: sizeProp('sm', 'Button size.'),
    },
    events: { copy: 'Called with the value after it was written to the clipboard.', error: 'Called with the error when the clipboard is unavailable or rejects the write. The button turns red with "Copy failed" for 1.5s.' },
    notes: ['Needs a secure context (https or localhost) for navigator.clipboard. The result ("Copied" or "Copy failed") is announced through an aria-live region.'],
  },
  ToggleGroup: {
    description: 'Group of toggle buttons with single or multiple selection, optionally icon-only.',
    props: {
      options: { type: '{ value: string | number; label: string; icon?: string }[]', default: '[]', required: true, description: 'Buttons to render. label is also used as the tooltip.' },
      modelValue: { type: 'string | number | (string | number)[]', model: true, description: 'Selected value, or array of values when multiple.' },
      multiple: { type: 'boolean', default: false, description: 'Allows several pressed buttons; modelValue becomes an array.' },
      iconOnly: { type: 'boolean', default: false, description: 'Hides labels and shows only icons.' },
      allowEmpty: { type: 'boolean', default: false, description: 'Single mode only: clicking the pressed button deselects it and emits null.' },
      size: sizeProp('md', 'Control size.'),
    },
    events: { change: 'Called with the new value (string), null when deselected with allowEmpty, or the new array when multiple.' },
    notes: ['Each button exposes aria-pressed. In single mode clicking the active option keeps it selected.'],
  },
  SegmentedControl: {
    description: 'Segmented switch for choosing exactly one of a few options.',
    props: {
      items: { type: '{ value: string | number; label: string; icon?: string; disabled?: boolean }[]', default: '[]', required: true, description: 'Segments to render. icon is an icon name; disabled: true dims one segment.' },
      modelValue: { type: 'string | number', model: true, description: 'Value of the selected segment.' },
      size: sizeProp('md', 'Control size. sm and md also have a dedicated compact style.'),
      block: { type: 'boolean', default: false, description: 'Stretches the control to the container width with equal-width segments.' },
      iconOnly: { type: 'boolean', default: false, description: 'Hides labels of segments that have an icon; the label stays as tooltip and aria-label.' },
      ariaLabel: { type: 'string', description: 'Accessible name of the group.' },
    },
    events: { change: 'Called with the value of the clicked segment.' },
  },
  FilterChips: {
    description: 'Row of selectable filter chips with single or multiple selection.',
    props: {
      items: { type: '{ value: string | number; label: string }[]', default: '[]', required: true, description: 'Chips to render.' },
      modelValue: { type: 'string | number | (string | number)[]', model: true, description: 'Selected value, or array of values when multi.' },
      multi: { type: 'boolean', default: false, description: 'Allows several selected chips; modelValue becomes an array.' },
      size: sizeProp('md', 'Chip size.'),
    },
    events: { change: 'Called with the new value, or the new array when multi. Toggles chips off in multi mode only.' },
  },
  Chip: {
    description: 'Compact label with optional icon and remove button; use for statuses, filters and attributes.',
    props: {
      variant: { type: "'tonal' | 'outlined' | 'solid'", values: ['tonal', 'outlined', 'solid'], default: 'tonal', description: 'Visual style.' },
      tone: { type: toneType, values: TONES, default: 'brand', description: 'Accent color. Unknown values fall back to brand.' },
      size: sizeProp('md', 'Chip height: xs 22px, sm 26px, md 32px, lg 38px, xl 46px.'),
      pill: { type: 'boolean', default: false, description: 'Fully rounded corners.' },
      icon: icon('Icon shown before the label.'),
    },
    events: { close: 'Canonical. Called when the remove button is clicked. The button is shown only when close or remove is provided.', remove: 'Alias of close, matching Tag.' },
    slots: { default: 'Chip label.' },
  },
  Tag: {
    description: 'Small pill label, optionally removable; use for keywords and selected values.',
    props: {
      size: sizeProp('md', 'Tag height: xs 22px, sm 24px, md 28px, lg 34px, xl 40px.'),
    },
    events: { remove: 'Called when the x button is clicked. The button is shown only when remove or close is provided.', close: 'Alias of remove, matching Chip. Use one name across both components in your app (close is the canonical one).' },
    slots: { default: 'Tag label.' },
  },
  Badge: {
    description: 'Status badge with a colored tone and optional dot.',
    props: {
      tone: { type: "'neutral' | 'brand' | 'success' | 'warning' | 'danger' | 'info' | 'inverse'", values: ['neutral', 'brand', 'success', 'warning', 'danger', 'info', 'inverse'], description: 'Color. neutral is the default grey, the same as passing no tone, so status maps can use it directly. inverse is a solid high-contrast badge (dark on light themes, light on dark). Omit for the neutral style.' },
      dot: { type: 'boolean', default: false, description: 'Shows a status dot before the content.' },
      shape: { type: "'pill' | 'square'", values: ['pill', 'square'], default: 'pill', description: 'square uses small rounded corners instead of a full pill.' },
      size: sizeProp('md', 'Badge height: xs 18px, sm 20px, md 24px, lg 28px, xl 32px.'),
    },
    slots: { default: 'Badge content.' },
    notes: ['Badge uses info for blue; Chip and Button use the tone name sky instead.'],
  },
  ActionRail: {
    description: 'Floating vertical or horizontal rail of icon buttons with a highlighted active item.',
    props: {
      items: { type: '{ value?: string; icon?: string; label?: string; separator?: boolean }[]', default: '[]', required: true, description: 'Rail entries. An item with separator: true renders a divider instead of a button.' },
      value: { type: 'string', description: 'Value of the active item. Changed via the change event.' },
      size: sizeProp('md', 'Button size inside the rail.'),
    },
    events: { change: 'Called with the value of the clicked item.' },
    notes: ['Items other than the active one are shown as ghost buttons; label is the accessible name.'],
  },
  ActionCard: {
    description: 'Card with a title and built-in collapse, refresh and remove controls.',
    props: {
      title: { type: 'string', required: true, description: 'Card title.' },
      subtitle: { type: 'string', description: 'Text under the title.' },
      collapsed: { type: 'boolean', description: 'Controlled collapsed state. When omitted the card keeps it internally.' },
      loading: { type: 'boolean', description: 'Controlled refresh spinner. When omitted, Refresh shows the spinner for 1.8s by itself.' },
      size: sizeProp('md', 'Card padding and font size.'),
    },
    events: { collapse: 'Called with the new collapsed boolean when the collapse button is clicked.', refresh: 'Refresh button clicked. Pass loading to show your own spinner.', remove: 'Remove button clicked; the card hides itself afterwards.' },
    slots: { default: 'Card body. Hidden while collapsed.' },
    notes: ['With collapsed set, update it from the collapse event, otherwise the card will not toggle.', 'Removing hides the card until the component is remounted; also remove it from your data on the remove event.'],
  },
  NotificationBell: {
    description: 'Bell icon button with an unread counter and a dropdown list of notifications.',
    props: {
      items: { type: '{ id: string | number; title: string; message?: string; time?: string; read?: boolean }[]', default: '[]', description: 'Notifications. Items without read: true count as unread and show a dot.' },
      size: sizeProp('md', 'Bell button size.'),
    },
    events: { read: 'Called with the item id when an unread item is clicked.', markAllRead: 'Called when "Mark all read" is clicked (shown while something is unread).', select: 'Called with the item when any item is clicked.' },
    notes: ['If you handle read or markAllRead the component is controlled: it trusts only the read flags in items, so update them in your state. Without these handlers it marks items read internally.', 'The dropdown opens and closes internally, and closes on outside click or Escape.'],
  },
};
