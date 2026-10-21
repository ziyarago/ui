// API metadata for the data group. Format: see src/meta/README.md
const SZ = ['xs', 'sm', 'md', 'lg', 'xl'];
const SIZE = "'xs' | 'sm' | 'md' | 'lg' | 'xl'";
const TONES = ['brand', 'sky', 'success', 'warning', 'danger', 'neutral'];
const TONE = "'brand' | 'sky' | 'success' | 'warning' | 'danger' | 'neutral'";
const size = (d, extra) => ({ type: SIZE, values: SZ, default: d || 'md', description: extra || 'Component scale.' });
const delta = (d) => ({ type: 'string', description: d || 'Change indicator such as "+12%" or "-3.4%". A leading "-" renders as a decrease, anything else as an increase.' });

export default {
  Card: {
    description: 'Glass surface container with an optional title header, used to group related content.',
    props: {
      title: { type: 'string', description: 'Header title. The header renders only when title or the actions slot is set.' },
      subtitle: { type: 'string', description: 'Muted line under the title.' },
      variant: { type: "'inverse' | 'gradient'", values: ['inverse', 'gradient'], description: 'inverse is a dark card regardless of the page theme; gradient is a tinted gradient card colored by tone. Omit for the default glass card.' },
      tone: { type: "'brand' | 'sky' | 'success' | 'warning' | 'danger' | 'neutral' | 'rose' | 'violet'", values: ['brand', 'sky', 'success', 'warning', 'danger', 'neutral', 'rose', 'violet'], default: 'brand', description: 'Gradient color. Used only with variant="gradient".' },
      intensity: { type: "'vivid'", values: ['vivid'], description: 'With variant="gradient", fills the card with a saturated color instead of a soft tint.' },
      size: size('md', 'Padding, gap and title size.'),
    },
    slots: { default: 'Card body.', actions: 'Right side of the header, for buttons or menus.' },
    notes: ['Vue slot names are React props (actions) and children (default).'],
  },

  DataTable: {
    description: 'Table with sortable columns, custom cell rendering and optional row selection checkboxes.',
    props: {
      columns: { type: '{ key: string; label: string; sortable?: boolean; num?: boolean; render?: (value, row, h) => VNode | string }[]', required: true, default: [], description: 'Column definitions. key reads row[key]; num right-aligns numbers; render customizes the cell; sortable shows a sort button in the header.' },
      rows: { type: '({ id: string | number; [key: string]: any })[]', required: true, default: [], description: 'Row objects. Every row needs a unique id; missing cell values render as an em dash.' },
      selected: { type: '(string | number)[]', default: [], description: 'Ids of selected rows. Checkboxes show only when the select event is handled.' },
      sortKey: { type: 'string', description: 'Key of the column currently sorted. The component does not sort rows itself.' },
      sortDir: { type: "'asc' | 'desc'", values: ['asc', 'desc'], default: 'asc', description: 'Direction of the current sort, shown by the header arrow and aria-sort.' },
      empty: { type: 'string', default: '—', description: 'Text shown when rows is empty.' },
      labels: { type: '{ selectAll?: string; selectRow?: string }', default: "{ selectAll: 'Select all', selectRow: 'Select row' }", description: 'Accessible names of the selection checkboxes.' },
      size: size('md', 'Row density and font size.'),
    },
    events: {
      select: 'Called with the new array of selected row ids. Handling it enables the checkbox column and select-all.',
      sort: 'Called with (key, dir) where dir is "asc" or "desc". Sort the rows yourself and pass sortKey/sortDir back.',
    },
    notes: ['Sorting and selection are fully controlled: the table never reorders rows or stores selection.', 'render receives (value, row) and, in React/Vue, the h function as third argument.'],
  },

  DataGroup: {
    description: 'Table whose rows are collapsed into labeled groups, with optional per-row expandable details.',
    props: {
      columns: { type: '{ key: string; label: string; num?: boolean; render?: (value, row) => VNode | string }[]', required: true, default: [], description: 'Column definitions, same shape as DataTable without sorting.' },
      groups: { type: '{ label: string; rows: ({ id: string | number; [key: string]: any })[] }[]', required: true, default: [], description: 'Groups shown as collapsible header rows with a row count. Group labels must be unique.' },
      expand: { type: '(row) => VNode | string', description: 'Renders the detail panel under a row. When set, an expand chevron column appears.' },
      size: size('md', 'Row density and font size.'),
    },
    notes: ['Open/collapsed state is internal; groups start expanded.'],
  },

  Descriptions: {
    description: 'Definition list of label and value pairs for record details.',
    props: {
      items: { type: '{ label: string; value?: string | number | VNode }[]', required: true, default: [], description: 'Pairs rendered as dt/dd. Missing value renders an em dash.' },
      size: size('md', 'Font size and spacing.'),
    },
  },

  Timeline: {
    description: 'Vertical list of events connected by a line, for activity history and status progress.',
    props: {
      items: { type: '{ title: string; text?: string; time: string }[]', required: true, default: [], description: 'Events from top to bottom. title is bold, text is optional detail, time is the caption.' },
      size: size('md', 'Dot, spacing and font size.'),
    },
  },

  TreeView: {
    description: 'Expandable tree of nodes for hierarchies such as folders, categories or regions.',
    props: {
      nodes: { type: '{ id: string; label: string; icon?: string; children?: Node[] }[]', required: true, default: [], description: 'Root nodes. children nest recursively; icon is an icon name. Ids must be unique.' },
      selected: { type: 'string', description: 'Id of the highlighted node.' },
      size: size('md', 'Row height and font size.'),
    },
    events: { select: 'Called with the node id when a node is clicked. Nodes with children also toggle open.' },
    notes: ['The first level is open by default; deeper levels start collapsed.'],
  },

  CalendarView: {
    description: 'Month calendar that marks days with events, wrapping Calendar with a list-style events prop.',
    props: {
      events: { type: '{ date: string; label: string }[]', default: [], description: 'Marked days. date is "YYYY-MM-DD"; label shows as the day tooltip.' },
      modelValue: { type: 'string | number | Date', model: true, forwarded: true, description: 'Selected date. Vue v-model, React modelValue + onChange.' },
      locale: { type: 'string', default: 'en-GB', forwarded: true, description: 'BCP 47 locale for month and weekday names.' },
      weekStartsOn: { type: '0 | 1 | 2 | 3 | 4 | 5 | 6', values: [0, 1, 2, 3, 4, 5, 6], default: 1, forwarded: true, description: 'First day of the week, 0 is Sunday and 1 is Monday.' },
    },
    events: { change: 'Called with the clicked Date (local time). Forwarded to Calendar.' },
  },

  KpiTile: {
    description: 'Key metric tile with a label, large value and optional delta, for dashboards.',
    props: {
      label: { type: 'string', required: true, description: 'Metric name.' },
      value: { type: 'string | number', required: true, description: 'Main value, shown large.' },
      sub: { type: 'string', description: 'Small text next to the delta.' },
      delta: delta(),
      variant: { type: "'brand' | 'inverse'", values: ['brand', 'inverse'], description: 'Filled brand tile or dark inverse tile. Omit for the default glass tile.' },
      size: size('md', 'Padding and value size.'),
    },
  },

  KpiInline: {
    description: 'Compact inline metric with a label, value and delta, for toolbars and card headers.',
    props: {
      label: { type: 'string', required: true, description: 'Metric name.' },
      value: { type: 'string | number', required: true, description: 'Main value.' },
      delta: delta(),
      size: size('md', 'Value font size.'),
    },
  },

  StatsCard: {
    description: 'Metric card with an optional icon, value and an up or down trend.',
    props: {
      label: { type: 'string', required: true, description: 'Metric name.' },
      value: { type: 'string | number', required: true, description: 'Main value.' },
      icon: { type: 'string', description: 'Icon name shown before the label.' },
      delta: { type: 'string', description: 'Change text such as "12%". The arrow is added automatically from trend.' },
      trend: { type: "'up' | 'down'", values: ['up', 'down'], default: 'up', description: 'Direction and color of the delta.' },
      size: size('md', 'Padding and value size.'),
    },
  },

  StatRow: {
    description: 'List row with an icon tile, title, subtitle and a right-aligned value with delta.',
    props: {
      title: { type: 'string', required: true, description: 'Primary text.' },
      sub: { type: 'string', description: 'Muted secondary text.' },
      value: { type: 'string | number', description: 'Right-aligned value.' },
      delta: delta('Change shown under the value. A leading "-" is a decrease; the sign is stripped and an arrow added.'),
      icon: { type: 'string', description: 'Icon name for the leading tile.' },
      tone: { type: TONE, values: TONES, default: 'brand', description: 'Color of the icon tile. Unknown values fall back to brand.' },
      size: { type: "'xs' | 'sm' | 'md' | 'lg' | 'xl' | number", values: SZ, default: 'md', description: 'Row height and icon tile size. Named sizes map to a 28/34/40/48/56 px tile; a number is used as the tile size in px.' },
    },
  },

  StatLine: {
    description: 'Card with a large value, icon tile, label and an accent bar, for a single headline number.',
    props: {
      label: { type: 'string', required: true, description: 'Metric name under the value.' },
      value: { type: 'string | number', required: true, description: 'Main value.' },
      icon: { type: 'string', description: 'Icon name for the tile.' },
      tone: { type: TONE, values: TONES, default: 'brand', description: 'Accent color of the tile and bar. Unknown values fall back to brand.' },
      delta: delta(),
      size: { type: "'xs' | 'sm' | 'md' | 'lg' | 'xl' | number", values: SZ, default: 'md', description: 'Icon tile size. Named sizes map to 28/34/40/48/56 px; a number is used in px.' },
    },
  },

  StatStrip: {
    description: 'Horizontal strip of several icon, value and label stats in one card.',
    props: {
      items: { type: '{ icon?: string; tone?: ' + TONE + '; value: string | number; label: string }[]', required: true, default: [], description: 'Stats shown side by side. tone defaults to brand.' },
      size: { type: "'xs' | 'sm' | 'md' | 'lg' | 'xl' | number", values: SZ, default: 'md', description: 'Icon tile size. Named sizes map to 30/36/44/52/60 px; a number is used in px.' },
    },
  },

  CountryRow: {
    description: 'Row with a country code badge, amount, country name and a percentage change.',
    props: {
      code: { type: 'string', required: true, description: 'Short code shown in the circle, such as "UZ".' },
      name: { type: 'string', required: true, description: 'Country name.' },
      amount: { type: 'string | number', required: true, description: 'Formatted amount shown in bold.' },
      pct: delta('Percentage change such as "+8%" or "-2%".'),
    },
  },

  VersusBar: {
    description: 'Head-to-head comparison of two values with a proportional two-color bar.',
    props: {
      left: { type: '{ label: string; value: number }', required: true, description: 'Left side. Its share of the bar is value / (left.value + right.value) in the brand color.' },
      right: { type: '{ label: string; value: number }', required: true, description: 'Right side, filling the remainder of the bar in sky.' },
      size: size('md', 'Value font size and bar thickness.'),
    },
    notes: ['A missing side renders an empty label and 0; with both at 0 the bar is split with no brand share.'],
  },

  SegBar: {
    description: 'Single stacked bar split into proportional segments with a legend, for distributions.',
    props: {
      segments: { type: '{ label: string; value: number; color?: string }[]', required: true, default: [], description: 'Segments; widths are value / sum of values. color is any CSS color; the default cycles brand, sky, green, amber, red.' },
    },
  },

  MiniChart: {
    description: 'Tiny sparkline in bar or line form for trends inside cards and tables.',
    props: {
      values: { type: 'number[]', required: true, default: [], description: 'Non-negative data points, scaled to the maximum value.' },
      type: { type: "'bar' | 'line'", values: ['bar', 'line'], default: 'bar', description: 'Bar columns or a single line.' },
      highlightLast: { type: 'boolean', default: false, description: 'Bar type only: paints the last bar in the brand color.' },
      height: { type: 'number', description: 'Height in px. Overrides size when set.' },
      size: { type: SIZE, values: SZ, default: 'md', description: 'Preset height: xs 28, sm 36, md 48, lg 64, xl 80 px.' },
    },
    notes: ['The chart is decorative (no axes or values); pair it with a visible number.'],
  },

  ChartCard: {
    description: 'Card shell for a chart with title, subtitle and an optional overflow menu; put the chart in the default slot.',
    props: {
      title: { type: 'string', required: true, description: 'Card title.' },
      subtitle: { type: 'string', description: 'Muted line under the title.' },
      menu: { type: 'string[]', description: 'Labels of overflow menu items shown behind a three-dot button. An item named "Delete" is styled as danger.' },
      size: size('md', 'Padding, gap and title size.'),
    },
    slots: { default: 'Chart or any content shown below the header.' },
    events: { menu: 'Called with the clicked menu item label (the string from menu); the menu closes afterwards.' },
  },

  Ring: {
    description: 'Circular progress gauge with a percentage in the center and a tick scale around it.',
    props: {
      value: { type: 'number', required: true, default: 0, description: 'Progress from 0 to 100; values are clamped.' },
      label: { type: 'string', description: 'Caption under the percentage.' },
      color: { type: 'string', default: 'var(--zg-brand)', description: 'Any CSS color for the arc and ticks.' },
      thickness: { type: 'number', description: 'Stroke width in px. Defaults to about 8% of the diameter, minimum 8.' },
      ticks: { type: 'boolean', default: true, description: 'Shows the outer 60-tick scale; false removes it and enlarges the arc.' },
      valueSize: { type: 'number', description: 'Percentage font size in px. Defaults to 22% of the diameter.' },
      size: { type: "'xs' | 'sm' | 'md' | 'lg' | 'xl' | number", values: SZ, default: 'md', description: 'Diameter: xs 72, sm 120, md 180, lg 240, xl 300 px; a number is used as px.' },
    },
  },

  OccupancyChart: {
    description: 'Bar chart of percentages by label, such as hotel occupancy per day or month.',
    props: {
      values: { type: 'number[]', required: true, default: [], description: 'Percentages from 0 to 100, one per bar. Values above 90 are highlighted in brand color.' },
      labels: { type: 'string[]', default: [], description: 'Axis label under each bar, matched by index.' },
    },
  },

  SalesFunnel: {
    description: 'Horizontal funnel of steps with bars scaled to the largest value, for conversion flows.',
    props: {
      steps: { type: '{ label: string; value: number }[]', required: true, default: [], description: 'Steps from top to bottom. Bars scale to the max value; the last step is highlighted in brand color.' },
    },
  },

  SystemStatus: {
    description: 'List of services with a status dot and a value such as uptime or latency.',
    props: {
      items: { type: "{ name: string; value: string; state?: 'ok' | 'warn' | 'down' }[]", required: true, default: [], description: 'Services. state sets the color: ok green (default), warn amber, down red.' },
    },
  },

  UserCell: {
    description: 'Avatar with a name and optional subtitle, for table cells and lists of people.',
    props: {
      name: { type: 'string', required: true, description: 'Display name, also used for avatar initials.' },
      sub: { type: 'string', description: 'Muted line under the name, such as an email or role.' },
      src: { type: 'string', description: 'Avatar image URL. Initials are shown without it.' },
      size: { type: "'xs' | 'sm' | 'md' | 'lg' | 'xl' | number", values: SZ, default: 'md', description: 'Avatar diameter: xs 24, sm 30, md 36, lg 44, xl 56 px; a number is used as px.' },
    },
  },

  IconTile: {
    description: 'Square or circular tinted tile holding an icon, used as a leading visual in lists and cards.',
    props: {
      icon: { type: 'string', default: 'circle', description: 'Icon name.' },
      tone: { type: TONE, values: TONES, default: 'brand', description: 'Tint color. Unknown values fall back to brand.' },
      shape: { type: "'square' | 'circle'", values: ['square', 'circle'], default: 'square', description: 'Rounded square or full circle. Only "circle" changes the shape.' },
      size: { type: "'xs' | 'sm' | 'md' | 'lg' | 'xl' | number", values: SZ, default: 'md', description: 'Tile size: xs 28, sm 32, md 40, lg 48, xl 56 px; a number is used as px. The icon is half the tile.' },
    },
  },

  StatusIcon: {
    description: 'Round tinted icon with a hover and focus tooltip, for compact status markers.',
    props: {
      icon: { type: 'string', default: 'circle', description: 'Icon name.' },
      tone: { type: TONE, values: TONES, default: 'brand', description: 'Tint color. Unknown values fall back to brand.' },
      tip: { type: 'string', description: 'Tooltip text shown on hover and keyboard focus.' },
      size: { type: "'xs' | 'sm' | 'md' | 'lg' | 'xl' | number", values: SZ, default: 'md', description: 'Diameter: xs 24, sm 30, md 36, lg 44, xl 52 px; a number is used as px.' },
    },
    notes: ['Focusable (tabindex 0) so the tooltip works from the keyboard; the icon itself is aria-hidden, so put the meaning in tip.'],
  },

  HeroBanner: {
    description: 'Wide promotional banner with title, text, a big value, optional action and a background image.',
    props: {
      title: { type: 'string', required: true, description: 'Banner heading.' },
      text: { type: 'string', description: 'Supporting paragraph.' },
      value: { type: 'string | number', description: 'Large number or price shown under the text.' },
      cta: { type: 'string', description: 'Label of the primary button. The button renders only when set.' },
      image: { type: 'string', description: 'Image URL shown on the right side.' },
    },
    events: { cta: 'Called when the call-to-action button is clicked.' },
    slots: { default: 'Extra content placed before the button.' },
  },

  TabTiles: {
    description: 'Row of icon tiles that work as tabs, with an optional add button.',
    props: {
      items: { type: '{ value: string; label: string; icon?: string }[]', required: true, default: [], description: 'Tiles. icon defaults to circle.' },
      value: { type: 'string', description: 'Value of the active tile. Controlled; change it in the change handler.' },
      addable: { type: 'boolean', default: false, description: 'Shows a trailing plus tile that fires the add event.' },
    },
    events: { change: 'Called with the value of the clicked tile.', add: 'Called when the plus tile is clicked.' },
    notes: ['Active state is exposed as aria-pressed on buttons, not as a tablist.'],
  },

  PricingCard: {
    description: 'Pricing plan card with price, feature list and a select button.',
    props: {
      name: { type: 'string', required: true, description: 'Plan name.' },
      price: { type: 'string | number', required: true, description: 'Price text, shown large.' },
      period: { type: 'string', description: 'Suffix after the price, such as "/mo".' },
      features: { type: 'string[]', default: [], description: 'Feature bullets with check icons.' },
      badge: { type: 'string', description: 'Brand badge next to the name, such as "Popular".' },
      featured: { type: 'boolean', default: false, description: 'Highlights the card and makes the button primary.' },
      cta: { type: 'string', default: 'Choose', description: 'Button label.' },
      size: size('md', 'Card padding and title size.'),
    },
    events: { select: 'Called when the button is clicked.' },
  },

  IntegrationCard: {
    description: 'Card for a third-party integration showing its connection status and a connect or manage button.',
    props: {
      name: { type: 'string', required: true, description: 'Integration name.' },
      description: { type: 'string', description: 'Short explanation under the name.' },
      status: { type: "'connected' | 'error' | 'off'", values: ['connected', 'error', 'off'], default: 'off', description: 'Connection state. Sets the badge (Connected, Error, Not linked) and button (Manage, Reconnect, Link).' },
      labels: { type: '{ connected?: string; error?: string; off?: string; manage?: string; reconnect?: string; link?: string }', default: "{ connected: 'Connected', error: 'Error', off: 'Not linked', manage: 'Manage', reconnect: 'Reconnect', link: 'Link' }", description: 'Badge and button texts per status; missing keys keep the English defaults.' },
      size: size('md', 'Card padding and title size.'),
    },
    events: { toggle: 'Called when the button is clicked, for connecting, reconnecting or managing.' },
    notes: ['Translate badge and button texts with labels.', 'Unknown status values behave as "off".'],
  },
};
