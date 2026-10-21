// @ziyarago/ui/compat · declarative old-API to new-API translation tables. Pure data and small pure functions (no Vue, no DOM), so it is unit-testable in Node.
// Old API = glass-ui-kit (@ziyarago/glass-ui-kit, Vue 3 + Tailwind, Ui* components). New API = @ziyarago/ui.
// A spec describes ONE old component:
//   to        new component name (string) or (src) => name
//   defaults  old-API defaults applied before translation (old prop values, not new ones)
//   size      size profile ('control' | 'shift' | 'same'); maps the old size onto the xs..xl scale, see SIZES
//   props     per old prop: undefined = pass through unchanged, string = rename, null = unsupported (dropped, dev warning), false = consumed elsewhere (dropped silently),
//             { to, map } = rename and map values, (value, src, cfg) => object = set any new props
//   events    new event -> list of [oldEvent, fixedValue?] to emit; without fixedValue the original arguments are forwarded, NONE emits without arguments
//   eventsWhen  new event -> (src) => boolean, the handler is attached only when true (the new kit shows UI such as a close button only when a handler exists)
//   slots     old slot -> { into: 'default', at: 'start' | 'end', unless?: oldProp } (merge into the default slot) or a new slot name (rename)
//   after     (newProps, src, cfg) => void, last-chance adjustments
import { BOOL_PROPS } from '../core/bools.js';

export const config = { sizes: 'height', warn: true, t: null, legacyIcons: true, primary: 'primary' };

/** Global compat options. sizes: 'height' (default) keeps old pixel heights, 'name' maps sm/md/lg/xl to the same names. t: (key, fallback) => string, i18n bridge. warn: false silences dev warnings. legacyIcons: false disables the lucide rename table (use it after setIconBase to a lucide-static >= 1 build). primary: 'inverse' renders the old primary button (black pill in qrbon) with the new inverse variant instead of the brand-colored primary. */
export function configureCompat(o = {}) { return Object.assign(config, o); }

const camel = k => /^(aria|data)-/.test(k) || !k.includes('-') ? k : k.replace(/-([a-z])/g, (_, c) => c.toUpperCase());
export const camelizeKeys = o => { const r = {}; for (const k of Object.keys(o)) if (o[k] !== undefined) r[camel(k)] = o[k]; return r; };

// Old kit control heights: sm 36, md 48, lg 56, xl 64 px. New: xs 28, sm 32, md 40, lg 48, xl 56 px.
export const SIZES = {
  control: { height: { sm: 'md', md: 'lg', lg: 'xl', xl: 'xl' }, name: { sm: 'sm', md: 'md', lg: 'lg', xl: 'xl' } },
  shift: { height: { sm: 'md', md: 'lg', lg: 'xl' }, name: { sm: 'sm', md: 'md', lg: 'lg' } },
  same: { height: {}, name: {} },
};
export const mapSize = (profile, v, cfg = config) => (SIZES[profile] && SIZES[profile][cfg.sizes === 'name' ? 'name' : 'height'][v]) || v;

// lucide-vue-next 1.x renamed a few icons that lucide-static@0.460 (the kit's default icon CDN version) still knows under the old name.
export const ICON_RENAMES = { 'circle-question-mark': 'circle-help', 'text-align-start': 'align-left', 'text-align-center': 'align-center', 'text-align-end': 'align-right', 'text-align-justify': 'align-justify', 'file-code-corner': 'file-code-2', 'file-check-corner': 'file-check-2', funnel: 'filter', 'message-circle-question-mark': 'message-circle-question' };
const old = n => (config.legacyIcons === false ? n : ICON_RENAMES[n] || n);

/** Lucide component (lucide-vue-next) or string -> kebab-case icon name used by the new kit. Unknown shapes give undefined. */
export function iconName(c) {
  if (!c) return undefined;
  if (typeof c === 'string') return c;
  try {
    if (typeof c === 'function') { const v = c({}, { slots: {}, attrs: {} }); if (v && v.props && typeof v.props.name === 'string') return old(v.props.name); }
    const n = c.name || c.displayName || c.__name;
    if (n) return old(String(n).replace(/^Lucide/, '').replace(/([a-z])([A-Z0-9])/g, '$1-$2').replace(/([0-9])([A-Z])/g, '$1-$2').toLowerCase());
  } catch { /* not an icon component */ }
  return undefined;
}

/** Marker for events entries: emit the old event without arguments (the new kit passes a DOM event the old one never had). */
export const NONE = Symbol('none');
const err = v => (v === true ? { error: ' ' } : v ? { error: v } : {});
const BADGE_TONE = { sunshine: 'brand', cobalt: 'brand', petrol: 'info', ink: 'inverse', glass: undefined, neutral: undefined };
const ALERT_TONE = { success: 'success', warning: 'warning', danger: 'danger', info: 'info', glass: 'info', neutral: 'info' };
const CARD_TONE = { cobalt: 'brand', sunshine: 'warning', petrol: 'sky', ink: 'neutral' };
const AVATAR_TONE = { cobalt: 'brand', sunshine: 'warning', petrol: 'sky', pink: 'danger', ink: 'neutral' };
const PROGRESS_TONE = { success: 'success', warning: 'warning', danger: 'danger', sunshine: 'warning' };
const MODAL_SIZE = { sm: { size: 'sm' }, md: { size: 'md' }, lg: { size: 'lg' }, xl: { size: 'xl' }, '2xl': { size: 'xl' }, '3xl': { size: 'xl', width: '768px' }, '4xl': { size: 'xl', width: '896px' }, '5xl': { size: 'xl', width: '1024px' } };
const CARD_PADDING = { height: { none: 'md', sm: 'md', md: 'lg', lg: 'lg', xl: 'xl' }, name: { none: 'md', sm: 'sm', md: 'md', lg: 'lg', xl: 'xl' } };
const num = v => (Number.isFinite(+v) ? +v : 0);

export const SPECS = {
  Button: {
    to: 'Button', size: 'control', defaults: { variant: 'primary', size: 'lg' },
    props: { variant: (v, s, cfg) => ({ glass: { variant: 'secondary' }, gradient: { variant: 'tonal', tone: 'brand' }, ink: { variant: 'inverse' } }[v] || { variant: v === 'primary' && cfg.primary === 'inverse' ? 'inverse' : v }) },
    slots: { 'icon-left': { into: 'default', at: 'start', unless: 'loading' }, 'icon-right': { into: 'default', at: 'end', unless: 'loading' } },
  },
  Input: {
    to: 'TextField', size: 'control', defaults: { size: 'lg' },
    props: { error: err, help: 'hint', clearable: null },
  },
  Textarea: {
    to: 'Textarea', defaults: { size: 'lg', resize: false },
    props: { error: err },
  },
  Select: {
    to: 'Select', size: 'control', defaults: { size: 'lg' },
    props: { error: err },
    t: { placeholder: ['common.select', 'Select an option'] },
  },
  Combobox: {
    to: 'Combobox', size: 'control', defaults: { size: 'lg' },
    props: { error: err },
    t: { emptyText: ['common.noMatches', 'No matches'] },
  },
  Checkbox: { to: 'Checkbox', props: { error: err } },
  Switch: { to: 'Switch', props: { error: err } },
  Badge: {
    to: 'Badge', size: 'shift', defaults: { tone: 'sunshine', size: 'md' },
    props: { tone: v => (v in BADGE_TONE ? (BADGE_TONE[v] ? { tone: BADGE_TONE[v] } : {}) : { tone: v }) },
    slots: { 'icon-left': { into: 'default', at: 'start' }, 'icon-right': { into: 'default', at: 'end' } },
  },
  Alert: {
    to: 'Alert', defaults: { tone: 'info' },
    props: { tone: v => ({ tone: ALERT_TONE[v] || 'info' }), closable: false, dismissible: false },
    events: { close: [['close', NONE]] }, eventsWhen: { close: s => !!s.closable },
  },
  Skeleton: {
    to: 'Skeleton',
    props: { variant: v => (v === 'line' ? { variant: 'rect', height: '1px' } : { variant: v }), lastLineWidth: null },
  },
  Modal: {
    to: 'Modal', defaults: { size: 'md' },
    props: { size: v => MODAL_SIZE[v] || { size: v } },
    events: { close: [['update:open', false], ['close', NONE]] },
  },
  ConfirmModal: {
    to: 'ConfirmDialog', defaults: { confirmVariant: 'danger', size: 'sm' },
    props: { message: 'description', confirmVariant: v => ({ tone: v === 'danger' ? 'danger' : 'default' }) },
    t: { title: ['common.areYouSure', 'Are you sure?'], description: ['common.irreversible', 'This action cannot be undone.'], confirmLabel: ['common.delete', 'Delete'], cancelLabel: ['common.cancel', 'Cancel'] },
  },
  Card: {
    to: 'Card', defaults: { padding: 'lg', variant: 'glass' },
    props: {
      variant: (v, s) => ({ gradient: { variant: 'gradient' }, outline: { variant: 'outline' }, block: { variant: 'gradient', intensity: 'vivid', tone: CARD_TONE[s.tone] || 'brand' } }[v] || {}),
      tone: false, as: null,
      padding: (v, s, cfg) => ({ size: CARD_PADDING[cfg.sizes === 'name' ? 'name' : 'height'][v] || 'lg', ...(v === 'none' ? { padding: 'none' } : {}) }),
    },
  },
  Progress: {
    to: 'Progress', defaults: { tone: 'ink' },
    props: {
      value: (v, s) => (v === undefined ? {} : { value: Math.max(0, Math.min(100, (num(v) / (num(s.max) || 100)) * 100)) }),
      max: false,
      showValue: (v, s) => (v && s.value !== undefined ? { meta: Math.round(Math.max(0, Math.min(100, (num(s.value) / (num(s.max) || 100)) * 100))) + '%' } : {}),
      tone: v => (PROGRESS_TONE[v] ? { tone: PROGRESS_TONE[v] } : {}),
    },
  },
  Breadcrumbs: { to: 'Breadcrumbs' },
  Pagination: {
    to: 'Pagination', props: { current: 'page', total: 'pages' },
    events: { change: [['update:current']] },
    after: (p, s, cfg) => { if (cfg.t) p.labels = { prev: cfg.t('common.prevPage', 'Previous page'), next: cfg.t('common.nextPage', 'Next page') }; },
  },
  StatsCard: {
    to: s => (s.variant === 'block' ? 'KpiTile' : 'StatsCard'),
    props: {
      icon: v => ({ icon: iconName(v) }),
      variant: (v, s) => (v === 'block' ? { variant: s.tone === 'ink' ? 'inverse' : 'brand' } : {}),
      tone: false,
      delta: (v, s) => {
        if (v == null) return {};
        const d = typeof v === 'object' ? v : { value: v };
        const down = d.trend === 'down', text = String(d.value);
        return { delta: s.variant === 'block' && down && !text.startsWith('-') ? '-' + text : text, trend: down ? 'down' : 'up', ...(d.sublabel ? { sub: d.sublabel } : {}) };
      },
    },
  },
  SegmentedControl: {
    to: 'SegmentedControl', size: 'shift',
    props: { options: v => ({ items: (v || []).map(o => (o.icon ? { ...o, icon: iconName(o.icon) } : o)) }) },
  },
  Avatar: {
    to: 'Avatar', defaults: { size: 'md' },
    props: { alt: 'name', tone: v => ({ tone: AVATAR_TONE[v] || 'brand' }), shape: v => (v === 'squircle' ? { shape: 'rounded' } : {}) },
  },
  Calendar: { to: 'Calendar', props: { range: null, initialMonth: null } },
  DatePicker: {
    to: 'DatePicker', size: 'control', defaults: { size: 'lg', clearable: true },
    props: { error: err, range: false },
  },
  Spinner: { to: 'Spinner', props: { tone: null } },
  Divider: { to: 'Divider', props: { align: null, orientation: null, tone: null } },
  Banner: {
    to: 'Banner', props: { tone: v => ({ tone: ALERT_TONE[v] || 'info' }), closable: false, sticky: null },
    events: { close: [['close', NONE]] }, eventsWhen: { close: s => !!s.closable },
  },
  EmptyState: { to: 'EmptyState', props: { icon: v => ({ icon: iconName(v) }), tone: null, size: null }, slots: { actions: { into: 'default', at: 'end' } } },
  Drawer: {
    to: 'Drawer', defaults: { placement: 'right' },
    props: { placement: v => ({ side: v === 'left' ? 'start' : 'end' }), size: null, closable: null, closeOnBackdrop: null, closeOnEsc: null },
    events: { close: [['update:open', false], ['close', NONE]] },
  },
  Tag: {
    to: 'Tag', props: { tone: null, size: null, removable: false, disabled: null },
    slots: { 'icon-left': { into: 'default', at: 'start' } },
    events: { remove: [['remove', NONE]] }, eventsWhen: { remove: s => !!s.removable },
  },
  OtpInput: { to: 'CodeInput', props: { masked: null, disabled: null, error: null, hint: null } },
  KpiCard: {
    to: 'KpiTile',
    props: {
      secondary: 'sub', icon: null, tone: null, loading: null,
      delta: v => (v == null ? {} : { delta: String(typeof v === 'object' ? v.value : v) }),
    },
  },
  FormField: { to: 'FormField' },
};

/** Old components (and old-kit names) that exist only as hand-written compat components in index.js. */
export const CUSTOM = [
  'Tabs', 'TabsList', 'Tab', 'TabPanel', 'Radio', 'RadioGroup', 'Dropdown', 'Menu', 'MenuItem', 'MenuSeparator', 'Table', 'Sidebar', 'SidebarSection', 'SidebarItem',
  'Navbar', 'SubNav', 'ToastContainer', 'CommandPalette', 'FileUpload', 'DateTimePicker', 'AvatarGroup', 'MultilangInput', 'Form', 'Tooltip',
];

/** Every compat export name without the Ui prefix (components only; composables are listed in COMPAT_EXPORTS). */
export const COMPAT_NAMES = [...new Set([...Object.keys(SPECS), ...CUSTOM])].sort();
export const COMPAT_COMPONENTS = COMPAT_NAMES.map(n => 'Ui' + n);

// Names of dev-time notes for props the new kit cannot honour. Used for warnings and documented in docs/MIGRATION.md.
const warned = new Set();
export function warnOnce(name, props) {
  if (!config.warn || !props.length || (typeof process !== 'undefined' && process.env && process.env.NODE_ENV === 'production')) return;
  for (const p of props) { const key = name + '.' + p; if (!warned.has(key)) { warned.add(key); console.warn(`[@ziyarago/ui/compat] <Ui${name}> prop "${p}" is not supported by the new kit and is ignored.`); } }
}

/** Translate old attrs for the old component `name`. Returns { component, props, dropped, src } or null for unknown names. */
export function translate(name, attrs = {}, cfg = config) {
  const spec = SPECS[name];
  if (!spec) return null;
  const src = { ...(spec.defaults || {}), ...camelizeKeys(attrs) };
  for (const k of Object.keys(src)) if (src[k] === '' && BOOL_PROPS.has(k)) src[k] = true;
  const props = {}, dropped = [];
  for (const k of Object.keys(src)) {
    const v = src[k], rule = spec.props && Object.prototype.hasOwnProperty.call(spec.props, k) ? spec.props[k] : undefined;
    if (rule === undefined) {
      if (k === 'size' && spec.size) props.size = mapSize(spec.size, v, cfg);
      else props[k] = v;
    } else if (rule === false) continue;
    else if (rule === null) dropped.push(k);
    else if (typeof rule === 'string') props[rule] = v;
    else if (typeof rule === 'function') Object.assign(props, rule(v, src, cfg) || {});
    else { const nv = rule.map && v in rule.map ? rule.map[v] : v; if (nv !== undefined) props[rule.to || k] = nv; }
  }
  if (spec.t) for (const k of Object.keys(spec.t)) if (props[k] === undefined) props[k] = cfg.t ? cfg.t(spec.t[k][0], spec.t[k][1]) : spec.t[k][1];
  if (spec.after) spec.after(props, src, cfg);
  return { component: typeof spec.to === 'function' ? spec.to(src) : spec.to, props, dropped, src };
}

/** Old event names a compat component must declare in `emits` so Vue does not forward them as listeners. */
export function emitsOf(name) {
  const spec = SPECS[name];
  return spec && spec.events ? [...new Set(Object.values(spec.events).flatMap(t => t.map(e => e[0])))] : [];
}

/** Listener props for the new component: { onClose: fn } that re-emit old events. `emit` is the Vue emit function (or any (name, ...args) => void). */
export function buildHandlers(name, src, emit) {
  const spec = SPECS[name], out = {};
  if (!spec || !spec.events) return out;
  for (const ev of Object.keys(spec.events)) {
    if (spec.eventsWhen && spec.eventsWhen[ev] && !spec.eventsWhen[ev](src)) continue;
    out['on' + ev[0].toUpperCase() + ev.slice(1)] = (...a) => { for (const [n, ...fixed] of spec.events[ev]) { if (fixed[0] === NONE) emit(n); else emit(n, ...(fixed.length ? fixed : a)); } };
  }
  return out;
}

/** Old slot functions -> new slot functions. `slots` is { name: fn }, `src` the translated old props (for `unless`). Slot functions may receive args. */
export function translateSlots(name, slots, src = {}) {
  const spec = SPECS[name], rules = (spec && spec.slots) || {}, out = {}, pre = [], post = [];
  for (const k of Object.keys(slots)) {
    const r = rules[k];
    if (r === undefined) out[k] = slots[k];
    else if (typeof r === 'string') out[r] = slots[k];
    else if (!(r.unless && src[r.unless])) (r.at === 'start' ? pre : post).push(slots[k]);
  }
  if (pre.length || post.length) {
    const base = out.default;
    out.default = (...a) => [...pre.map(f => f()), ...(base ? [].concat(base(...a)) : []), ...post.map(f => f())];
  }
  return out;
}

/** Tailwind width utility (w-32, w-[120px], w-1/2, w-full) -> CSS width. Anything else gives undefined. */
export function twWidth(c) {
  if (!c || typeof c !== 'string') return undefined;
  const m = /(?:^|\s)w-(?:\[([^\]]+)\]|(\d+(?:\.\d+)?)|(full)|(\d+)\/(\d+))(?=\s|$)/.exec(c);
  if (!m) return undefined;
  if (m[1]) return m[1];
  if (m[2]) return +m[2] * 0.25 + 'rem';
  if (m[3]) return '100%';
  return +(100 * m[4] / m[5]).toFixed(4) + '%';
}

/** Client-side sort used by the compat UiTable (the new DataTable is controlled and never sorts). */
export function sortRows(rows, col, dir, getValue) {
  const d = dir === 'desc' ? -1 : 1;
  return [...rows].sort((a, b) => {
    const av = getValue(a, col), bv = getValue(b, col);
    if (av == null && bv == null) return 0;
    if (av == null) return -1 * d;
    if (bv == null) return 1 * d;
    if (typeof av === 'number' && typeof bv === 'number') return (av - bv) * d;
    return String(av).localeCompare(String(bv)) * d;
  });
}
