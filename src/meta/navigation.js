// API metadata for the navigation group. Format: see src/meta/README.md
const SIZE = "'xs' | 'sm' | 'md' | 'lg' | 'xl'";
const SIZES = ['xs', 'sm', 'md', 'lg', 'xl'];
const size = (what) => ({ type: SIZE, values: SIZES, default: 'md', description: `Scale of ${what}.` });
const current = { type: 'string | number', description: 'Value of the active item (aria-current="page").' };

export default {
  TopNav: {
    description: 'Horizontal app header with a brand area, navigation items and an actions area.',
    props: {
      brand: { type: 'string | VNode', description: 'Logo or product name on the left.' },
      items: { type: '{ value: string | number; label: string; icon?: string; count?: string | number; children?: ({ value: string | number; label: string; icon?: string; count?: string | number; disabled?: boolean } | { heading: string } | { separator: true })[] }[]', default: '[]', description: 'Navigation entries. count renders a small counter after the label. An entry with children becomes a drop-down: click or ArrowDown opens a menu of its children (each with an optional icon and count, headings and separators allowed); selecting one calls change with the child value. The entry is marked current when one of its children is.' },
      value: current,
      overflow: { type: "'menu' | 'none'", values: ['menu', 'none'], default: 'menu', description: "'menu': entries that do not fit move into a trailing \"More\" drop-down (measured after render and on resize; server rendering shows all entries). 'none': no collapsing, the row scrolls sideways and sub-menus are clipped, so avoid children with it." },
      moreLabel: { type: 'string', default: 'More', description: 'Accessible name of the overflow drop-down button.' },
      size: size('header padding, item height and text'),
    },
    slots: { actions: 'Right side of the header (buttons, avatar). React also accepts an actions prop.' },
    events: { change: 'Called with the value of the clicked item or sub-menu item.' },
    notes: ['Controlled: update value yourself in the change handler.', 'Items use count; SubNav uses badge for the same purpose.', 'Entries with children and the More menu share the Dropdown keyboard behaviour: ArrowDown opens, arrows and Home/End move, Escape closes and returns focus to the button.'],
  },

  SideNav: {
    description: 'Vertical sidebar with a brand, grouped navigation items, a footer and an optional collapse toggle.',
    props: {
      brand: { type: 'string | VNode', description: 'Logo or product name at the top.' },
      items: { type: '({ value: string | number; label: string; icon?: string; count?: string | number; children?: ({ value: string | number; label: string; icon?: string; count?: string | number } | { separator: true })[] } | { group: string })[]', default: '[]', description: 'Entries. An object with group renders a section heading (hidden when collapsed); others are links with an optional icon and count. An entry with children is an expandable group: its button toggles the list of children (open by default while one of them is current); selecting a child calls change with the child value.' },
      value: current,
      collapsed: { type: 'boolean', default: false, description: 'Icon-only mode; labels move to the title tooltip.' },
      collapsible: { type: 'boolean', default: false, description: 'Always draw the collapse button, even without a toggle handler (the button is also drawn when a toggle handler is set).' },
      collapseLabel: { type: 'string', default: 'Collapse', description: 'Label of the collapse button.' },
      size: size('width (216 to 336 px), padding and item height'),
    },
    slots: { footer: 'Bottom area above the collapse button, e.g. user card. React also accepts a footer prop.' },
    events: { change: 'Called with the value of the clicked item.', toggle: 'Called when the collapse button is clicked. The button is drawn when this handler is set (Vue: @toggle) or when collapsible is true.' },
    notes: ['Collapsing is controlled: flip collapsed in the toggle handler.', 'Group entries are keyed by their title, so keep group names unique.', 'In the collapsed rail the children of an open group show as icons (children without an icon get a dot).'],
  },

  SubNav: {
    description: 'Compact vertical list of sections with an optional title; use for settings and secondary page navigation.',
    props: {
      title: { type: 'string', description: 'Small heading above the list; also the aria-label.' },
      items: { type: '{ value: string | number; label: string; icon?: string; badge?: string | number }[]', default: '[]', description: 'Entries. badge renders a counter on the right.' },
      value: current,
      size: size('item height and text'),
    },
    events: { change: 'Called with the value of the clicked item.' },
  },

  Tabs: {
    description: 'Underlined tab strip for switching between views of the same page.',
    props: {
      modelValue: { type: 'string | number', model: true, description: 'Value of the selected tab. Vue v-model, React modelValue + onChange.' },
      items: { type: '{ value: string | number; label: string; disabled?: boolean; count?: string | number; badge?: string | number }[]', default: '[]', description: 'Tabs. count (or badge) shows a small number after the label, for example "Media 3"; 0 is shown, null or empty is not.' },
      size: size('tab height and text'),
    },
    events: { change: 'Called with the value of the clicked tab.' },
    notes: ['Renders only the tab buttons (role="tablist"); you show the matching panel yourself.'],
  },

  PillTabs: {
    description: 'Pill-style tab buttons with optional icons, horizontal or vertical; use for settings and profile sections.',
    props: {
      items: { type: '{ value: string | number; label: string; icon?: string; disabled?: boolean; count?: string | number; badge?: string | number }[]', default: '[]', description: 'Tabs. count (or badge) shows a small number after the label; 0 is shown, null or empty is not.' },
      value: { type: 'string', description: 'Value of the selected tab. Changed via the change event.' },
      vertical: { type: 'boolean', default: false, description: 'Stacks the tabs in a column.' },
      size: size('button height, gap and text'),
    },
    events: { change: 'Called with the value of the clicked tab.' },
    notes: ['Renders only the tab buttons; you show the matching panel yourself.'],
  },

  Breadcrumbs: {
    description: 'Path trail with chevron separators; the last item is the current page.',
    props: {
      items: { type: '{ label: string; href?: string }[]', default: '[]', description: 'Trail from root to current. All but the last render as links (href defaults to "#"); the last is bold with aria-current="page".' },
      size: size('text and separator size'),
      separator: { type: "'chevron' | 'slash' | 'dot'", values: ['chevron', 'slash', 'dot'], default: 'chevron', description: 'Glyph between items.' },
    },
  },

  Pagination: {
    description: 'Page navigation with numbered buttons, ellipsis windowing and previous/next; use under tables and lists.',
    props: {
      page: { type: 'number', description: 'Current page, 1-based. Changed via the change event.' },
      pages: { type: 'number', default: 1, description: 'Total number of pages.' },
      siblings: { type: 'number', default: 1, description: 'Page buttons shown on each side of the current page. First and last page are always shown; gaps become an ellipsis.' },
      label: { type: 'string', default: 'Pagination', description: 'Accessible name of the navigation landmark.' },
      hideArrows: { type: 'boolean', default: false, description: 'Hides the previous and next buttons.' },
      labels: { type: '{ prev?: string; next?: string; page?: string }', default: "{ prev: 'Previous page', next: 'Next page', page: 'Page' }", description: 'Accessible names of the arrow buttons and of each page button ("Page 3").' },
      size: size('button size and text'),
    },
    events: { change: 'Called with the clicked page number (also from the previous and next buttons).' },
    notes: ['Shows first, last and current plus or minus siblings with an ellipsis for gaps, so it scales to hundreds of pages. A gap of a single page shows that page instead of an ellipsis.', 'Previous and next buttons carry aria-label "Previous page" and "Next page" and are disabled at the ends; the current page has aria-current="page".'],
  },

  Accordion: {
    description: 'Vertical list of collapsible sections where one is open at a time; use for FAQs and grouped details.',
    props: {
      items: { type: '{ id: string; title: string; body: string | VNode }[]', default: '[]', description: 'Sections. id must be unique; body is shown when the section is open.' },
      size: size('header padding and text'),
    },
    notes: ['Open state is internal and single: opening one closes the others, all start closed.'],
  },
};
