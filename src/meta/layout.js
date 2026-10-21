// API metadata for the layout group. Format: see src/meta/README.md
const SIZES = ['xs', 'sm', 'md', 'lg', 'xl'];
const sizeProp = (def = 'md', desc = 'Component size.') => ({ type: "'xs' | 'sm' | 'md' | 'lg' | 'xl'", values: SIZES, default: def, description: desc });
const as = { type: 'string', default: 'div', description: 'HTML tag to render.' };
const style = { type: 'Record<string, string | number>', description: 'Inline styles merged over the component styles.' };
const gap = { type: 'number | string', default: 12, description: 'Gap between children. Numbers are pixels, strings any CSS length.' };
const stackProps = {
  gap: { ...gap, forwarded: true },
  align: { forwarded: true, type: 'string', description: 'CSS align-items value, for example center, flex-start, stretch.' },
  justify: { forwarded: true, type: 'string', description: 'CSS justify-content value, for example space-between, center.' },
  wrap: { forwarded: true, type: 'boolean', default: false, description: 'Allows children to wrap onto several lines.' },
  as: { ...as, forwarded: true },
  style: { ...style, forwarded: true },
};

export default {
  Box: {
    description: 'Generic container with optional padding and glass background.',
    props: {
      p: { type: 'number | string', description: 'Padding. Numbers are pixels, strings any CSS value.' },
      glass: { type: 'boolean', default: false, description: 'Applies the glass surface style.' },
      as,
      style,
    },
    slots: { default: 'Box content.' },
  },
  Center: {
    description: 'Centers its children horizontally and vertically.',
    props: { as, style },
    slots: { default: 'Centered content.' },
  },
  HStack: {
    description: 'Horizontal flex row with a configurable gap.',
    props: { ...stackProps },
    slots: { default: 'Items laid out in a row.' },
  },
  VStack: {
    description: 'Vertical flex column with a configurable gap.',
    props: { ...stackProps },
    slots: { default: 'Items laid out in a column.' },
  },
  Grid: {
    description: 'CSS grid with a fixed column count or auto-fit columns of a minimum width.',
    props: {
      cols: { type: 'number', description: 'Fixed number of equal columns. When set, min is ignored.' },
      min: { type: 'number | string', default: 240, description: 'Minimum column width for auto-fit layout (used when cols is not set).' },
      gap: { type: 'number | string', default: 16, description: 'Gap between cells. Numbers are pixels, strings any CSS length.' },
      as,
      style,
    },
    slots: { default: 'Grid items.' },
  },
  Divider: {
    description: 'Horizontal separator line with an optional centered label.',
    props: {
      label: { type: 'string', description: 'Text shown in the middle of the line.' },
      size: sizeProp('md', 'Label font size and spacing.'),
    },
    notes: ['Renders role="separator".'],
  },
  ScrollArea: {
    description: 'Vertically scrollable container with a max height and styled scrollbar.',
    props: {
      maxHeight: { type: 'string', default: '240px', description: 'CSS max-height; content scrolls beyond it. Must be a string with a unit.' },
    },
    slots: { default: 'Scrollable content.' },
  },
  SplitLayout: {
    description: 'Two-column layout with configurable column widths; use for master-detail or side-by-side content.',
    props: {
      columns: { type: 'string', default: '1fr 1fr', description: 'CSS grid-template-columns value, for example "280px 1fr".' },
    },
    slots: { left: 'First column. Falls back to the first child.', right: 'Second column. Falls back to the second child.' },
    notes: ['Exactly two columns; extra children beyond the second are ignored.'],
  },
  AppShell: {
    description: 'Application frame with a top or side navigation and a main content area.',
    props: {
      nav: { type: "'top' | 'side'", values: ['top', 'side'], default: 'top', description: 'Navigation placement: TopNav or SideNav.' },
      brand: { type: 'VNode | string', description: 'Brand/logo content shown in the navigation.' },
      items: { type: '{ value: string; label: string; icon?: string }[]', description: 'Navigation items, passed to TopNav or SideNav.' },
      value: { type: 'string', description: 'Value of the active navigation item. Changed via the change event.' },
      actions: { type: 'VNode', description: 'Right side of the top navigation (nav="top" only).' },
      collapsed: { type: 'boolean', description: 'Controlled collapsed state of the side navigation. Uncontrolled (internal state, initially false) when omitted.' },
      collapsible: { type: 'boolean', default: true, description: 'Shows the collapse toggle in the side navigation. Set false to hide it.' },
      collapseLabel: { type: 'string', description: 'Label of the collapse toggle in the side navigation.' },
      frame: { type: 'boolean', default: false, description: 'Renders the shell as a framed block instead of full viewport (useful in previews).' },
    },
    events: { change: 'Called with the value of the clicked navigation item.', collapse: 'Called with the new collapsed boolean when the toggle is pressed.' },
    slots: { default: 'Main page content.', footer: 'Bottom area of the side navigation (nav="side" only).' },
    notes: ['The footer slot and collapse props apply only to nav="side".'],
  },
  PageHeader: {
    description: 'Page title block with optional breadcrumbs, subtitle and an actions area.',
    props: {
      title: { type: 'string', required: true, description: 'Page title (rendered as h1).' },
      subtitle: { type: 'string', description: 'Secondary text below the title.' },
      crumbs: { type: '{ label: string; href?: string }[]', description: 'Breadcrumb items shown above the title.' },
      size: sizeProp('md', 'Title and subtitle size.'),
    },
    slots: { actions: 'Right side of the header, usually buttons.' },
  },
  AuthLayout: {
    description: 'Centered card layout for sign-in and sign-up pages.',
    props: {
      title: { type: 'string', required: true, description: 'Heading inside the card.' },
      subtitle: { type: 'string', description: 'Text below the title.' },
      logo: { type: 'VNode', description: 'Logo element shown at the top of the card.' },
      style,
    },
    slots: { default: 'Card body, usually a form.' },
  },
  SettingsSection: {
    description: 'Settings block with a title and description on the left and fields below.',
    props: {
      title: { type: 'string', required: true, description: 'Section title.' },
      description: { type: 'string', description: 'Helper text under the title.' },
      size: sizeProp('md', 'Padding, title and field spacing.'),
    },
    slots: { default: 'Fields and controls of the section.' },
  },
  LiquidGlass: {
    description: 'Frosted liquid-glass panel with adjustable corner radius and blur.',
    props: {
      radius: { type: 'number | string', default: 24, description: 'Corner radius. Numbers are pixels.' },
      blur: { type: 'number | string', default: 18, description: 'Backdrop blur radius. Numbers are pixels.' },
      size: sizeProp('md', 'Inner padding.'),
    },
    slots: { default: 'Panel content.' },
    notes: ['Backdrop blur is visible only over a colorful or image background.'],
  },
  Footer: {
    description: 'Page footer with a copyright line and a row of links.',
    props: {
      copyright: { type: 'string', default: '© 2026 ZiyaraGo', description: 'Copyright text.' },
      links: { type: '{ label: string; href?: string }[]', default: '[]', description: 'Footer links; href defaults to "#".' },
      size: sizeProp('md', 'Padding and font size.'),
    },
    slots: { default: 'Extra content after the links.' },
  },
  Sortable: {
    description: 'Drag-and-drop reorderable list with grip handles and up/down buttons.',
    props: {
      items: { type: '{ id?: string | number; label: string }[]', default: '[]', required: true, description: 'Items in current order. id is used as the key, falling back to the index.' },
      render: { type: '(item, index) => VNode', description: 'Custom item renderer. Defaults to the bold item label.' },
      size: sizeProp('md', 'Row padding, gap and font size.'),
    },
    events: { change: 'Called with the reordered items array after a drop or up/down click.' },
    notes: ['Controlled: the parent must store the array from change and pass it back as items.', 'Keyboard-friendly reordering is available through the up/down buttons.'],
  },
  Portal: {
    description: 'Renders its children outside the component tree, for example into document.body.',
    props: {
      to: { type: 'string | HTMLElement', description: 'Target element or CSS selector. The adapter default (body) is used when omitted.' },
    },
    slots: { default: 'Content to teleport.' },
    notes: ['Renders nothing when the framework adapter provides no portal.'],
  },
};
