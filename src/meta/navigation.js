// API metadata for the navigation group. Format: see src/meta/README.md
const SIZE = "'xs' | 'sm' | 'md' | 'lg' | 'xl'";
const SIZES = ['xs', 'sm', 'md', 'lg', 'xl'];
const size = (what) => ({ type: SIZE, values: SIZES, default: 'md', description: `Scale of ${what}.` });
const current = { type: 'string', description: 'Value of the active item (aria-current="page").' };

export default {
  TopNav: {
    description: 'Horizontal app header with a brand area, navigation items and an actions area.',
    props: {
      brand: { type: 'string | VNode', description: 'Logo or product name on the left.' },
      items: { type: '{ value: string; label: string; icon?: string; count?: string | number }[]', default: '[]', description: 'Navigation entries. count renders a small counter after the label.' },
      value: current,
      size: size('header padding, item height and text'),
    },
    slots: { actions: 'Right side of the header (buttons, avatar). React also accepts an actions prop.' },
    events: { change: 'Called with the value of the clicked item.' },
    notes: ['Controlled: update value yourself in the change handler.', 'Items use count; SubNav uses badge for the same purpose.'],
  },

  SideNav: {
    description: 'Vertical sidebar with a brand, grouped navigation items, a footer and an optional collapse toggle.',
    props: {
      brand: { type: 'string | VNode', description: 'Logo or product name at the top.' },
      items: { type: '({ value: string; label: string; icon?: string; count?: string | number } | { group: string })[]', default: '[]', description: 'Entries. An object with group renders a section heading (hidden when collapsed); others are links with an optional icon and count.' },
      value: current,
      collapsed: { type: 'boolean', default: false, description: 'Icon-only mode; labels move to the title tooltip.' },
      collapseLabel: { type: 'string', default: 'Collapse', description: 'Label of the collapse button.' },
      size: size('width (216 to 336 px), padding and item height'),
    },
    slots: { footer: 'Bottom area above the collapse button, e.g. user card. React also accepts a footer prop.' },
    events: { change: 'Called with the value of the clicked item.', toggle: 'Called when the collapse button is clicked. The button is rendered only when this handler is set.' },
    notes: ['Collapsing is controlled: flip collapsed in the toggle handler.', 'Group entries are keyed by their title, so keep group names unique.'],
  },

  SubNav: {
    description: 'Compact vertical list of sections with an optional title; use for settings and secondary page navigation.',
    props: {
      title: { type: 'string', description: 'Small heading above the list; also the aria-label.' },
      items: { type: '{ value: string; label: string; icon?: string; badge?: string | number }[]', default: '[]', description: 'Entries. badge renders a counter on the right.' },
      value: current,
      size: size('item height and text'),
    },
    events: { change: 'Called with the value of the clicked item.' },
  },

  Tabs: {
    description: 'Underlined tab strip for switching between views of the same page.',
    props: {
      modelValue: { type: 'string', model: true, description: 'Value of the selected tab. Vue v-model, React modelValue + onChange.' },
      items: { type: '{ value: string; label: string }[]', default: '[]', description: 'Tabs.' },
      size: size('tab height and text'),
    },
    events: { change: 'Called with the value of the clicked tab.' },
    notes: ['Renders only the tab buttons (role="tablist"); you show the matching panel yourself.'],
  },

  PillTabs: {
    description: 'Pill-style tab buttons with optional icons, horizontal or vertical; use for settings and profile sections.',
    props: {
      items: { type: '{ value: string; label: string; icon?: string }[]', default: '[]', description: 'Tabs.' },
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
    },
  },

  Pagination: {
    description: 'Page navigation with numbered buttons, ellipsis windowing and previous/next; use under tables and lists.',
    props: {
      page: { type: 'number', description: 'Current page, 1-based. Changed via the change event.' },
      pages: { type: 'number', default: 1, description: 'Total number of pages.' },
      siblings: { type: 'number', default: 1, description: 'Page buttons shown on each side of the current page. First and last page are always shown; gaps become an ellipsis.' },
      label: { type: 'string', default: 'Pagination', description: 'Accessible name of the navigation landmark.' },
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
