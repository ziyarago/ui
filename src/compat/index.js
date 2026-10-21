// @ziyarago/ui/compat · the OLD glass-ui-kit component names (UiInput, UiTable, UiSidebar, ...) as thin Vue wrappers over the new components.
// Switch the imports first, refactor to the new names later. See docs/MIGRATION.md. Vue 3 only (the old kit never had a React build).
import { h, defineComponent, Teleport, ref, readonly, computed, provide, inject, watch, getCurrentInstance, onMounted, onBeforeUnmount, Fragment, Comment } from 'vue';
import * as K from '../vue/index.js';
import { useUiTheme } from '../theme.js';
import { ddRef } from '../core/components.js';
import { config, configureCompat, SPECS, translate, emitsOf, buildHandlers, translateSlots, warnOnce, iconName, mapSize, twWidth, sortRows, camelizeKeys } from './map.js';

export { configureCompat, iconName };
export { COMPAT_NAMES, COMPAT_COMPONENTS, SPECS, translate } from './map.js';

const N = n => K['Ui' + n];
const cx = (...a) => a.filter(Boolean).join(' ');
const truthy = v => v === '' || !!v;

/** (key, fallback) => string. Order: configureCompat({ t }), then the host app's vue-i18n ($t, only when the key exists), then the English fallback. */
function useT() {
  const g = (getCurrentInstance() || { appContext: { config: { globalProperties: {} } } }).appContext.config.globalProperties;
  return (key, fb) => {
    if (config.t) return config.t(key, fb);
    if (g.$t && (!g.$te || g.$te(key))) return g.$t(key);
    return fb;
  };
}

/** () => BCP 47 locale of the host vue-i18n (or undefined). Date pickers use it when no locale prop is passed, like the old kit did. */
function useLocale() {
  const g = (getCurrentInstance() || { appContext: { config: { globalProperties: {} } } }).appContext.config.globalProperties;
  return () => (g.$i18n && typeof g.$i18n.locale === 'string' ? g.$i18n.locale : undefined);
}

const vtext = vnodes => [].concat(vnodes || []).map(v => (typeof v === 'string' || typeof v === 'number' ? String(v) : v && v.children ? vtext(typeof v.children === 'function' ? v.children() : v.children) : '')).join('');

// ───────────────────────── table-driven wrappers ─────────────────────────
// pre(attrs, slots) -> { attrs?, slots?, render? } lets a wrapper adjust input or bypass the new component entirely.
const PRE = {
  Calendar: (attrs, _s, ctx) => (attrs.locale === undefined && ctx.locale() ? { attrs: { ...attrs, locale: ctx.locale() } } : undefined),
  Skeleton: attrs => (/(^|\s)h-/.test(String(attrs.class || '')) && attrs.variant !== 'text' && attrs.variant !== 'circle' ? { attrs: { ...attrs, height: '100%' } } : undefined),
};

function makeCompat(name) {
  return defineComponent({
    name: 'Ui' + name, inheritAttrs: false, emits: emitsOf(name),
    setup(_, { attrs, slots, emit }) {
      const t = useT(), locale = useLocale();
      return () => {
        let a = attrs, s = slots;
        const pre = PRE[name] && PRE[name](a, s, { t, locale });
        if (pre && pre.render) return pre.render();
        if (pre) { a = pre.attrs || a; s = pre.slots || s; }
        const r = translate(name, a, { ...config, t });
        warnOnce(name, r.dropped);
        return h(N(r.component), { ...r.props, ...buildHandlers(name, r.src, emit) }, translateSlots(name, s, r.src));
      };
    },
  });
}

const generated = {};
for (const name of Object.keys(SPECS)) generated[name] = makeCompat(name);

// ───────────────────────── Tabs (compound) ─────────────────────────
const TabsKey = Symbol('UiTabs');
export const UiTabs = defineComponent({
  name: 'UiTabs', props: { modelValue: { type: [String, Number], default: undefined }, variant: { type: String, default: 'pill' } }, emits: ['update:modelValue'],
  setup(props, { slots, emit }) {
    provide(TabsKey, { modelValue: computed(() => props.modelValue), variant: computed(() => props.variant), setValue: v => emit('update:modelValue', v) });
    return () => h('div', null, slots.default && slots.default());
  },
});
export const UiTabsList = defineComponent({
  name: 'UiTabsList',
  setup(_, { slots }) { const ctx = inject(TabsKey); return () => h('div', { class: ctx && ctx.variant.value === 'underline' ? 'zg-tabs' : 'zg-pt', role: 'tablist' }, slots.default && slots.default()); },
});
export const UiTab = defineComponent({
  name: 'UiTab', props: { value: { type: [String, Number], required: true }, disabled: Boolean },
  setup(props, { slots }) {
    const ctx = inject(TabsKey);
    return () => h('button', { type: 'button', role: 'tab', 'aria-selected': String(ctx.modelValue.value === props.value), disabled: props.disabled, onClick: () => !props.disabled && ctx.setValue(props.value) }, slots.default && slots.default());
  },
});
export const UiTabPanel = defineComponent({
  name: 'UiTabPanel', props: { value: { type: [String, Number], required: true } },
  setup(props, { slots }) { const ctx = inject(TabsKey); return () => (ctx.modelValue.value === props.value ? h('div', { role: 'tabpanel', tabindex: 0 }, slots.default && slots.default()) : null); },
});

// ───────────────────────── Radio / RadioGroup ─────────────────────────
const RadioItem = defineComponent({ name: 'UiRadio', inheritAttrs: false, props: { value: null, label: String, hint: String, disabled: Boolean, modelValue: null, size: String, name: String, id: String }, emits: ['update:modelValue'],
  setup(props, { emit, attrs }) {
    return () => h(N('RadioGroup'), { ...attrs, modelValue: props.modelValue, size: props.size, options: [{ value: props.value, label: props.label, hint: props.hint, disabled: props.disabled }], onChange: v => emit('update:modelValue', v) });
  } });
export const UiRadio = RadioItem;
function collectRadios(vnodes, out = []) {
  for (const v of vnodes || []) {
    if (!v || v.type === Comment) continue;
    if (v.type === Fragment) collectRadios(v.children, out);
    else if (v.type === RadioItem) { const p = camelizeKeys(v.props || {}); out.push({ value: p.value, label: p.label, hint: p.hint, disabled: truthy(p.disabled) }); }
  }
  return out;
}
export const UiRadioGroup = defineComponent({
  name: 'UiRadioGroup', inheritAttrs: false, emits: ['update:modelValue'],
  setup(_, { attrs, slots, emit }) {
    return () => {
      const a = camelizeKeys(attrs), { modelValue, label, hint, error, size, disabled, orientation, name, ...rest } = a;
      return h(N('RadioGroup'), { ...rest, modelValue, label, hint, error: error === true ? ' ' : error || undefined, size, disabled: truthy(disabled), orientation, options: collectRadios(slots.default && slots.default()), onChange: v => emit('update:modelValue', v) });
    };
  },
});

// ───────────────────────── Dropdown / Menu / MenuItem / MenuSeparator ─────────────────────────
const DropdownKey = Symbol('UiDropdown');
export const UiDropdown = defineComponent({
  name: 'UiDropdown', inheritAttrs: false, props: { open: { type: Boolean, default: undefined }, placement: { type: String, default: 'bottom-start' }, offset: { type: Number, default: 8 }, closeOnOutsideClick: { type: Boolean, default: true }, closeOnEsc: { type: Boolean, default: true } }, emits: ['update:open'],
  setup(props, { slots, emit }) {
    const inner = ref(false), trig = ref(null), panel = ref(null), pos = ref({ position: 'fixed', top: '0px', left: '0px', visibility: 'hidden' });
    const isOpen = computed(() => (props.open !== undefined ? props.open : inner.value));
    const setOpen = v => { inner.value = v; emit('update:open', v); };
    const close = () => { if (isOpen.value) setOpen(false); }, toggle = () => setOpen(!isOpen.value);
    provide(DropdownKey, { close });
    // Panel is teleported to <body> and positioned with fixed coordinates (flip + clamp to the viewport), so overflow:hidden parents (tables, cards) never clip it.
    const place = () => {
      const t = trig.value, f = panel.value; if (!t || !f) return;
      const r = t.getBoundingClientRect(), fw = f.offsetWidth, fh = f.offsetHeight, pad = 8, off = props.offset;
      let [side, align = 'start'] = props.placement.split('-'), x, y;
      if (side === 'bottom' && r.bottom + off + fh > innerHeight - pad && r.top - off - fh >= pad) side = 'top'; else if (side === 'top' && r.top - off - fh < pad && r.bottom + off + fh <= innerHeight - pad) side = 'bottom';
      if (side === 'top' || side === 'bottom') { y = side === 'bottom' ? r.bottom + off : r.top - off - fh; x = align === 'end' ? r.right - fw : align === 'center' ? r.left + (r.width - fw) / 2 : r.left; }
      else { x = side === 'right' ? r.right + off : r.left - off - fw; y = align === 'end' ? r.bottom - fh : r.top; }
      pos.value = { position: 'fixed', top: Math.max(pad, Math.min(y, innerHeight - fh - pad)) + 'px', left: Math.max(pad, Math.min(x, innerWidth - fw - pad)) + 'px', visibility: 'visible' };
    };
    const onDown = e => { if (isOpen.value && props.closeOnOutsideClick && !(trig.value && trig.value.contains(e.target)) && !(panel.value && panel.value.contains(e.target))) close(); };
    const onKey = e => { if (e.key === 'Escape' && isOpen.value && props.closeOnEsc) { e.stopPropagation(); close(); const b = trig.value && trig.value.querySelector('button,[href],[tabindex]'); if (b) b.focus(); } };
    onMounted(() => { document.addEventListener('mousedown', onDown); document.addEventListener('keydown', onKey); addEventListener('resize', place); addEventListener('scroll', place, true); });
    onBeforeUnmount(() => { document.removeEventListener('mousedown', onDown); document.removeEventListener('keydown', onKey); removeEventListener('resize', place); removeEventListener('scroll', place, true); });
    watch(isOpen, o => { if (o) { pos.value = { ...pos.value, visibility: 'hidden' }; Promise.resolve().then(() => requestAnimationFrame(place)); } });
    return () => [
      h('span', { ref: trig, class: 'zg-dd-trig', onClick: toggle }, slots.trigger ? slots.trigger({ isOpen: isOpen.value, toggle }) : null),
      isOpen.value ? h(Teleport, { to: 'body' }, h('div', { ref: panel, class: 'zg-dd__panel', style: pos.value }, slots.default && slots.default())) : null,
    ];
  },
});
export const UiMenu = defineComponent({
  name: 'UiMenu', props: { minWidth: { type: String, default: '12rem' }, autofocus: { type: Boolean, default: true } },
  setup(props, { slots }) {
    const el = ref(null);
    const items = () => (el.value ? [...el.value.querySelectorAll("[role='menuitem']:not([aria-disabled='true'])")] : []);
    onMounted(() => { if (props.autofocus) Promise.resolve().then(() => { const i = items()[0]; if (i) i.focus(); }); });
    const onKeydown = e => {
      const list = items(); if (!list.length) return;
      const i = list.indexOf(document.activeElement), go = n => { e.preventDefault(); list[n].focus(); };
      if (e.key === 'ArrowDown') go((i + 1) % list.length); else if (e.key === 'ArrowUp') go(i <= 0 ? list.length - 1 : i - 1); else if (e.key === 'Home') go(0); else if (e.key === 'End') go(list.length - 1);
    };
    return () => h('div', { ref: el, class: 'zg-menu zg-menu--static', role: 'menu', style: { minWidth: props.minWidth }, onKeydown }, slots.default && slots.default());
  },
});
export const UiMenuItem = defineComponent({
  name: 'UiMenuItem', props: { disabled: Boolean, tone: { type: String, default: 'default' }, closeOnClick: { type: Boolean, default: true }, loading: Boolean }, emits: ['click'],
  setup(props, { slots, emit }) {
    const ctx = inject(DropdownKey, null);
    return () => h('button', {
      type: 'button', role: 'menuitem', disabled: props.disabled, 'aria-disabled': props.disabled ? 'true' : undefined, class: cx('zg-menu__i', props.tone === 'danger' && 'zg-menu__i--danger'),
      onClick: e => { if (props.disabled) return; emit('click', e); if (props.closeOnClick && ctx) ctx.close(); },
    }, slots['icon-left'] && slots['icon-left'](), h('span', { style: { flex: 1, textAlign: 'start' } }, slots.default && slots.default()), slots.shortcut ? h('span', { class: 'zg-kbd' }, slots.shortcut()) : null, slots['icon-right'] && slots['icon-right']());
  },
});
export const UiMenuSeparator = defineComponent({
  name: 'UiMenuSeparator', props: { label: String },
  setup(props) { return () => (props.label ? h('div', { class: 'zg-menu__lbl', role: 'separator' }, props.label) : h('div', { class: 'zg-menu__sep', role: 'separator' })); },
});

// ───────────────────────── Table ─────────────────────────
export const UiTable = defineComponent({
  name: 'UiTable', inheritAttrs: false, emits: ['rowClick'],
  setup(_, { attrs, slots, emit }) {
    const t = useT();
    const sortKey = ref(null), sortDir = ref('asc');
    const value = (row, col) => (col.accessor ? col.accessor(row) : row[col.key]);
    return () => {
      const a = camelizeKeys(attrs), cols = a.columns || [], rows = a.rows || [];
      const sorted = sortKey.value && cols.find(c => c.key === sortKey.value) ? sortRows(rows, cols.find(c => c.key === sortKey.value), sortDir.value, value) : rows;
      const loading = truthy(a.loading), sk = a.skeletonRows || 5;
      const newCols = cols.map(c => ({
        key: c.key, sortable: c.sortable, align: c.align, width: twWidth(c.width),
        label: slots['header-' + c.key] ? slots['header-' + c.key]({ column: c }) : c.label,
        render: (_v, nr) => (nr.__sk ? h(N('Skeleton'), { lines: 1 }) : slots['cell-' + c.key] ? slots['cell-' + c.key]({ row: nr.__row, value: value(nr.__row, c), index: nr.__i }) : (value(nr.__row, c) ?? '')),
      }));
      const data = loading ? Array.from({ length: sk }, (_x, i) => ({ id: 'sk' + i, __sk: true })) : sorted.map((row, i) => ({ id: a.rowKey ? a.rowKey(row, i) : i, __row: row, __i: i }));
      const root = {};
      for (const k of Object.keys(attrs)) if (/^(aria|data)-|^(class|style|id)$/.test(k)) root[k] = attrs[k];
      return h(N('DataTable'), {
        ...root, columns: newCols, rows: data, size: a.density === 'compact' ? 'sm' : 'md', sortKey: sortKey.value, sortDir: sortDir.value,
        empty: t('common.noData', 'No data to display'),
        onSort: (key, dir) => { sortKey.value = key; sortDir.value = dir; },
        onRowClick: (nr) => { if (!nr.__sk) emit('rowClick', nr.__row, nr.__i); },
      }, slots.empty ? { empty: () => slots.empty() } : undefined);
    };
  },
});

// ───────────────────────── Sidebar / Navbar / SubNav ─────────────────────────
const SidebarKey = Symbol('UiSidebar');
export const UiSidebar = defineComponent({
  name: 'UiSidebar', props: { collapsed: { type: Boolean, default: undefined }, defaultCollapsed: Boolean, open: { type: Boolean, default: undefined }, storageKey: String, widthExpanded: String, widthCollapsed: String }, emits: ['update:collapsed', 'update:open'],
  setup(props, { slots, emit }) {
    const innerCollapsed = ref(props.defaultCollapsed), innerOpen = ref(false), desktop = ref(true);
    onMounted(() => {
      if (props.storageKey) { try { const v = localStorage.getItem(props.storageKey); if ((v === 'true' || v === 'false') && props.collapsed === undefined) innerCollapsed.value = v === 'true'; } catch { /* storage blocked */ } }
      if (typeof matchMedia === 'function') { const mq = matchMedia('(min-width:1024px)'); desktop.value = mq.matches; const f = () => { desktop.value = mq.matches; }; mq.addEventListener('change', f); onBeforeUnmount(() => mq.removeEventListener('change', f)); }
    });
    watch(() => props.collapsed, v => { if (v !== undefined && props.storageKey) { try { localStorage.setItem(props.storageKey, String(v)); } catch { /* storage blocked */ } } });
    const collapsed = computed(() => (props.collapsed !== undefined ? props.collapsed : innerCollapsed.value));
    const isOpen = computed(() => (props.open !== undefined ? props.open : innerOpen.value));
    const eff = computed(() => collapsed.value && desktop.value);
    const closeMobile = () => { innerOpen.value = false; emit('update:open', false); };
    provide(SidebarKey, { collapsed: eff, closeMobile });
    return () => [
      isOpen.value ? h('div', { class: 'zg-sidenav-scrim', 'aria-hidden': 'true', onClick: closeMobile }) : null,
      h('aside', { class: cx('zg-sidenav zg-sidenav--compat', eff.value && 'zg-sidenav--collapsed', isOpen.value && 'is-open'), 'data-theme': 'dark' },
        h('button', { type: 'button', class: 'zg-sidenav__close zg-ibtn zg-ibtn--sm zg-ibtn--ghost', 'aria-label': 'Close menu', onClick: closeMobile }, h(N('Icon'), { name: 'x', size: 16 })),
        slots.header ? h('div', { class: 'zg-sidenav__brand' }, slots.header({ collapsed: eff.value })) : null,
        h('nav', { class: 'zg-sidenav__nav' }, slots.default && slots.default()),
        slots.footer ? h('div', { class: 'zg-sidenav__foot' }, slots.footer({ collapsed: eff.value })) : null),
    ];
  },
});
export const UiSidebarSection = defineComponent({
  name: 'UiSidebarSection', props: { label: String },
  setup(props, { slots }) { const ctx = inject(SidebarKey, null); return () => h('div', { class: 'zg-sidenav__sec' }, props.label && !(ctx && ctx.collapsed.value) ? h('div', { class: 'zg-sidenav__group' }, props.label) : null, slots.default && slots.default()); },
});
export const UiSidebarItem = defineComponent({
  name: 'UiSidebarItem', props: { label: { type: String, required: true }, icon: null, active: Boolean, badge: [Number, String], href: String, disabled: Boolean }, emits: ['click'],
  setup(props, { emit }) {
    const ctx = inject(SidebarKey, null);
    return () => h(props.href ? 'a' : 'button', {
      class: 'zg-navitem', 'aria-current': props.active ? 'page' : undefined, title: ctx && ctx.collapsed.value ? props.label : undefined, href: props.href, type: props.href ? undefined : 'button', disabled: props.href ? undefined : props.disabled, 'aria-disabled': props.disabled ? 'true' : undefined,
      onClick: e => { if (props.disabled) return; emit('click', e); if (ctx) ctx.closeMobile(); },
    }, props.icon ? h(props.icon, { size: 18, class: 'zg-navitem__ic' }) : null, h('span', null, props.label), props.badge !== undefined && props.badge !== null && props.badge !== '' ? h('span', { class: 'zg-navitem__count' }, props.badge) : null);
  },
});
export const UiNavbar = defineComponent({
  name: 'UiNavbar', props: { variant: String, size: String, sticky: Boolean },
  setup(props, { slots }) {
    return () => h('header', { class: cx('zg-topnav zg-topnav--compat', props.size === 'md' && 'zg-topnav--md'), style: props.sticky ? undefined : { position: 'static' } },
      h('div', { class: 'zg-topnav__brand' }, slots.left && slots.left()), h('div', { class: 'zg-topnav__mid' }, slots.center && slots.center()), h('div', { class: 'zg-topnav__actions' }, slots.right && slots.right()));
  },
});
export const UiSubNav = defineComponent({
  name: 'UiSubNav', props: { items: { type: Array, default: () => [] }, title: String, titleIcon: null, matchExact: { type: Boolean, default: true } },
  setup(props) {
    const g = getCurrentInstance().appContext.config.globalProperties;
    const path = () => (g.$route ? g.$route.path : typeof location !== 'undefined' ? location.pathname : '');
    const active = p => (props.matchExact ? path() === p : path() === p || path().startsWith(p + '/'));
    return () => h('nav', { class: 'zg-subnav zg-subnav--compat', 'aria-label': props.title },
      props.title ? h('div', { class: 'zg-sidenav__group' }, props.titleIcon ? h(props.titleIcon, { size: 16 }) : null, props.title) : null,
      ...props.items.map(it => h('a', { key: it.path, href: it.path, class: 'zg-navitem', 'aria-current': active(it.path) ? 'page' : undefined, onClick: e => { if (g.$router && !(e.metaKey || e.ctrlKey || e.shiftKey || e.button)) { e.preventDefault(); g.$router.push(it.path); } } },
        it.icon ? h(it.icon, { size: 16 }) : null, h('span', { style: { flex: 1, textAlign: 'start' } }, it.label), it.badge !== undefined && it.badge !== '' ? h('span', { class: 'zg-navitem__count' }, it.badge) : null)));
  },
});

// ───────────────────────── Toast ─────────────────────────
const toasts = ref([]);
let toastId = 0;
export function useToast() {
  const dismiss = id => { const i = toasts.value.findIndex(t => t.id === id); if (i !== -1) toasts.value.splice(i, 1); };
  const push = input => {
    const id = `toast-${Date.now()}-${++toastId}`;
    const toast = { id, tone: input.tone || 'default', duration: input.duration ?? 5000, title: input.title, message: input.message, action: input.action };
    toasts.value.push(toast);
    if (toast.duration > 0 && typeof window !== 'undefined') window.setTimeout(() => dismiss(id), toast.duration);
    return id;
  };
  const tone = t => (message, options) => push({ tone: t, message, ...options });
  return { toasts, push, dismiss, clear: () => { toasts.value = []; }, success: tone('success'), info: tone('info'), warning: tone('warning'), danger: tone('danger') };
}
export const UiToastContainer = defineComponent({
  name: 'UiToastContainer', props: { position: { type: String, default: 'top-right' } },
  setup(props) {
    const { toasts: list, dismiss } = useToast();
    return () => h('div', { class: cx('zg-toasts', 'zg-toasts--' + props.position), 'aria-live': 'polite' }, list.value.map(t =>
      h('div', { class: 'zg-toasts__i', key: t.id },
        h(N('Toast'), { tone: t.tone === 'default' ? 'info' : t.tone, title: t.title }, () => [t.message, t.action ? h('div', { class: 'zg-toasts__act' }, h(N('Button'), { size: 'xs', variant: 'ghost', onClick: () => { t.action.onClick(); dismiss(t.id); } }, () => t.action.label)) : null]),
        h('button', { type: 'button', class: 'zg-toasts__x zg-ibtn zg-ibtn--sm zg-ibtn--ghost', 'aria-label': 'Dismiss', onClick: () => dismiss(t.id) }, h(N('Icon'), { name: 'x', size: 14 })))));
  },
});

// ───────────────────────── Command palette ─────────────────────────
const commands = ref([]), paletteOpen = ref(false);
export function useCommandPalette() {
  return {
    commands, isOpen: paletteOpen,
    register: c => { const i = commands.value.findIndex(x => x.id === c.id); if (i !== -1) commands.value[i] = c; else commands.value.push(c); },
    unregister: id => { commands.value = commands.value.filter(c => c.id !== id); },
    clear: () => { commands.value = []; },
    open: () => { paletteOpen.value = true; }, close: () => { paletteOpen.value = false; }, toggle: () => { paletteOpen.value = !paletteOpen.value; },
  };
}
export const UiCommandPalette = defineComponent({
  name: 'UiCommandPalette', props: { shortcutKey: { type: String, default: 'k' }, disableShortcut: Boolean, emptyText: String, placeholder: String },
  setup(props) {
    const pal = useCommandPalette();
    const onKey = e => { if (!props.disableShortcut && (e.metaKey || e.ctrlKey) && e.key.toLowerCase() === props.shortcutKey) { e.preventDefault(); pal.toggle(); } };
    onMounted(() => document.addEventListener('keydown', onKey));
    onBeforeUnmount(() => document.removeEventListener('keydown', onKey));
    return () => h(N('CommandPalette'), {
      open: pal.isOpen.value, placeholder: props.placeholder,
      commands: pal.commands.value.map(c => ({ id: c.id, label: c.label, icon: iconName(c.icon), shortcut: c.shortcut, keywords: [c.description, c.group, ...(c.keywords || [])].filter(Boolean).join(' ') })),
      onRun: id => { const c = pal.commands.value.find(x => x.id === id); pal.close(); if (c) c.action(); },
      onClose: pal.close,
    });
  },
});

// ───────────────────────── FileUpload (adds the file list the old component had) ─────────────────────────
const fileSize = b => (b < 1024 ? b + ' B' : b < 1048576 ? (b / 1024).toFixed(1) + ' KB' : (b / 1048576).toFixed(1) + ' MB');
export const UiFileUpload = defineComponent({
  name: 'UiFileUpload', inheritAttrs: false, emits: ['update:modelValue', 'reject'],
  setup(_, { attrs, slots, emit }) {
    const t = useT(), inner = ref([]);
    return () => {
      const a = camelizeKeys(attrs), files = a.modelValue || inner.value, multiple = truthy(a.multiple);
      const set = list => { inner.value = list; emit('update:modelValue', list); };
      const root = {}; for (const k of Object.keys(attrs)) if (/^(aria|data)-|^(class|style|id)$/.test(k)) root[k] = attrs[k];
      return h('div', { ...root, style: [{ display: 'flex', flexDirection: 'column', gap: '10px' }, root.style] },
        h(N('FileUpload'), {
          label: a.label, hint: a.hint, error: a.error === true ? ' ' : a.error || undefined, accept: a.accept, maxSize: a.maxSize, multiple,
          title: slots.title ? vtext(slots.title()) : t('common.dropFilesOrBrowse', 'Drop files here or browse'),
          onChange: list => set(multiple ? [...files, ...list] : list.slice(0, 1)),
          onReject: (file, reason) => emit('reject', { file, cause: reason }),
        }),
        files.length ? h('div', { style: { display: 'flex', flexWrap: 'wrap', gap: '8px' } }, files.map((f, i) => h(N('Chip'), { key: f.name + i, size: 'sm', icon: 'file', onClose: () => set(files.filter((_x, j) => j !== i)) }, () => `${f.name} · ${fileSize(f.size)}`))) : null);
    };
  },
});

// ───────────────────────── DatePicker (adds range) and DateTimePicker ─────────────────────────
const pad = n => String(n).padStart(2, '0');
const RangePicker = defineComponent({
  name: 'UiRangePicker', props: { value: Object, label: String, hint: String, error: String, placeholder: String, disabled: Boolean, locale: String, weekStartsOn: Number, size: String }, emits: ['pick'],
  setup(props, { emit }) {
    const open = ref(false);
    const fmt = d => new Intl.DateTimeFormat(props.locale || 'en-GB', { dateStyle: 'medium' }).format(d);
    return () => {
      const v = props.value || {}, text = v.start ? fmt(v.start) + (v.end ? ' – ' + fmt(v.end) : ' – …') : props.placeholder || 'Select dates';
      return h('div', { class: 'zg-field', 'data-size': props.size }, props.label ? h('span', { class: 'zg-label' }, props.label) : null,
        h('div', { class: 'zg-select' }, h('button', { type: 'button', class: cx('zg-btn zg-select__trigger', props.error && 'zg-select__trigger--error'), disabled: props.disabled, 'aria-expanded': String(open.value), onClick: () => { open.value = !open.value; } }, h('span', null, text), h(N('Icon'), { name: 'calendar', size: 16 })),
          open.value ? h('div', { class: 'zg-select__list', 'data-zg-dd': '', style: { padding: '12px' }, ref: ddRef(() => { open.value = false; }) },
            h(N('RangeCalendar'), { modelValue: v.start ? [v.start, v.end || null] : [], locale: props.locale, weekStartsOn: props.weekStartsOn, onChange: r => { emit('pick', { start: r[0] || null, end: r[1] || null }); if (r[0] && r[1]) open.value = false; } })) : null),
        props.error ? h('span', { class: 'zg-hint zg-hint--error', role: 'alert' }, props.error) : props.hint ? h('span', { class: 'zg-hint' }, props.hint) : null);
    };
  },
});
const BaseDatePicker = generated.DatePicker;
export const UiDatePicker = defineComponent({
  name: 'UiDatePicker', inheritAttrs: false, emits: ['update:modelValue'],
  setup(_, { attrs, emit }) {
    const t = useT(), locale = useLocale();
    return () => {
      const a = camelizeKeys(attrs);
      if (!truthy(a.range)) return h(BaseDatePicker, { ...attrs, locale: attrs.locale === undefined ? locale() : attrs.locale, 'onUpdate:modelValue': v => emit('update:modelValue', v) });
      return h(RangePicker, { value: a.modelValue, label: a.label, hint: a.hint, error: typeof a.error === 'string' ? a.error : undefined, placeholder: a.placeholder || t('common.selectDates', 'Select dates'), disabled: truthy(a.disabled), locale: a.locale === undefined ? locale() : a.locale, weekStartsOn: a.weekStartsOn, size: mapSize('control', a.size || 'lg'), onPick: r => emit('update:modelValue', r) });
    };
  },
});
export const UiDateTimePicker = defineComponent({
  name: 'UiDateTimePicker', inheritAttrs: false, emits: ['update:modelValue'],
  setup(_, { attrs, emit }) {
    const t = useT(), locale = useLocale(), buffer = ref('');
    const combine = (d, time) => { const m = /^(\d{1,2}):(\d{1,2})$/.exec(time || ''); return new Date(d.getFullYear(), d.getMonth(), d.getDate(), m ? Math.min(23, +m[1]) : 0, m ? Math.min(59, +m[2]) : 0).toISOString(); };
    return () => {
      const a = camelizeKeys(attrs), d = a.modelValue ? new Date(a.modelValue) : null, valid = d && !Number.isNaN(d.getTime());
      const date = valid ? d : null, time = valid ? `${pad(d.getHours())}:${pad(d.getMinutes())}` : buffer.value;
      const defaultTime = a.defaultTime === undefined ? '12:00' : a.defaultTime;
      const err = a.error === true ? ' ' : a.error || undefined;
      const root = {}; for (const k of Object.keys(attrs)) if (/^(aria|data)-|^(class|style|id)$/.test(k)) root[k] = attrs[k];
      return h('div', { ...root, class: cx('zg-field', root.class) },
        a.label ? h('span', { class: 'zg-label' }, a.label) : null,
        h('div', { style: { display: 'grid', gridTemplateColumns: '1fr 140px', gap: '8px' } },
          h(N('DatePicker'), { modelValue: date, size: 'xl', clearable: true, locale: locale(), disabled: truthy(a.disabled), error: err ? ' ' : undefined, placeholder: a.placeholder || t('common.datePlaceholder', 'dd/mm/yyyy'), onChange: nd => emit('update:modelValue', nd ? combine(nd, time || defaultTime || '00:00') : null) }),
          h(N('TextField'), {
            modelValue: time, size: 'xl', icon: 'clock', placeholder: '23:59', maxlength: 5, inputmode: 'numeric', disabled: truthy(a.disabled), error: err ? ' ' : undefined,
            onChange: v => { let val = v; if (/^\d{2}$/.test(val) && !val.includes(':')) val += ':'; buffer.value = val; if (date && /^\d{1,2}:\d{1,2}$/.test(val)) emit('update:modelValue', combine(date, val)); },
            onBlur: () => { const dg = buffer.value.replace(/\D/g, '').slice(0, 4); if (dg.length >= 3) { buffer.value = `${dg.slice(0, 2)}:${dg.slice(2).padEnd(2, '0')}`; if (date) emit('update:modelValue', combine(date, buffer.value)); } },
          })),
        err && err.trim() ? h('span', { class: 'zg-hint zg-hint--error', role: 'alert' }, err) : a.hint ? h('span', { class: 'zg-hint' }, a.hint) : null);
    };
  },
});

// ───────────────────────── Tooltip (teleported, so overflow:hidden parents never clip it) ─────────────────────────
export const UiTooltip = defineComponent({
  name: 'UiTooltip', props: { text: String, placement: { type: String, default: 'top' }, tone: { type: String, default: 'ink' }, delay: { type: Number, default: 0 }, disabled: Boolean, anchorClass: { type: String, default: 'inline-flex' } },
  setup(props, { slots }) {
    const anchor = ref(null), tip = ref(null), shown = ref(false), pos = ref({ top: '0px', left: '0px', visibility: 'hidden' });
    let timer = 0;
    const place = () => {
      const a = anchor.value, f = tip.value; if (!a || !f) return;
      const r = a.getBoundingClientRect(), w = f.offsetWidth, hh = f.offsetHeight, gap = 8, pad = 4;
      const fit = { top: r.top - gap - hh >= pad, bottom: r.bottom + gap + hh <= innerHeight - pad, left: r.left - gap - w >= pad, right: r.right + gap + w <= innerWidth - pad };
      let side = props.placement; if (!fit[side]) { const o = { top: 'bottom', bottom: 'top', left: 'right', right: 'left' }[side]; if (o && fit[o]) side = o; }
      const cx0 = r.left + r.width / 2 - w / 2, cy0 = r.top + r.height / 2 - hh / 2;
      const [x, y] = side === 'top' ? [cx0, r.top - gap - hh] : side === 'bottom' ? [cx0, r.bottom + gap] : side === 'left' ? [r.left - gap - w, cy0] : [r.right + gap, cy0];
      pos.value = { top: Math.max(pad, Math.min(y, innerHeight - hh - pad)) + 'px', left: Math.max(pad, Math.min(x, innerWidth - w - pad)) + 'px', visibility: 'visible' };
    };
    const show = () => { if (props.disabled) return; clearTimeout(timer); timer = setTimeout(() => { shown.value = true; Promise.resolve().then(() => requestAnimationFrame(place)); }, props.delay); };
    const hide = () => { clearTimeout(timer); shown.value = false; pos.value = { ...pos.value, visibility: 'hidden' }; };
    onBeforeUnmount(() => clearTimeout(timer));
    return () => [
      h('span', { ref: anchor, class: props.anchorClass, onMouseenter: show, onMouseleave: hide, onFocusin: show, onFocusout: hide }, slots.default && slots.default()),
      shown.value && !props.disabled && (slots.content || props.text) ? h(Teleport, { to: 'body' }, h('div', { ref: tip, role: 'tooltip', class: cx('zg-tipbox', props.tone === 'glass' && 'zg-tipbox--glass'), style: pos.value }, slots.content ? slots.content() : props.text)) : null,
    ];
  },
});

// ───────────────────────── small ones ─────────────────────────
export const UiAvatarGroup = defineComponent({
  name: 'UiAvatarGroup', props: { spacing: { type: String, default: 'normal' }, reverse: Boolean },
  setup(props, { slots }) { return () => h('div', { class: cx('zg-avgroup', 'zg-avgroup--' + props.spacing, props.reverse && 'zg-avgroup--rev') }, slots.default && slots.default()); },
});
export const UiForm = defineComponent({
  name: 'UiForm', props: { novalidate: Boolean }, emits: ['submit'],
  setup(props, { slots, emit }) { return () => h('form', { novalidate: props.novalidate, onSubmit: e => { e.preventDefault(); emit('submit', e); } }, slots.default && slots.default()); },
});
const LANGS = [['ru', 'RU'], ['uz', 'UZ'], ['en', 'EN']];
export const UiMultilangInput = defineComponent({
  name: 'UiMultilangInput', props: { modelValue: { type: Object, default: () => ({}) }, label: String, placeholder: String, required: Boolean, error: [String, Boolean], disabled: Boolean }, emits: ['update:modelValue'],
  setup(props, { emit }) {
    const active = ref('ru');
    return () => {
      const v = props.modelValue || {}, invalid = props.required && !LANGS.some(([c]) => (v[c] || '').trim());
      return h('div', { class: 'zg-field' },
        h('div', { style: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' } }, props.label ? h('span', { class: 'zg-label' }, props.label, props.required ? h('span', { class: 'zg-req' }, ' *') : null) : h('span'),
          h(N('SegmentedControl'), { size: 'sm', modelValue: active.value, items: LANGS.map(([c, l]) => ({ value: c, label: (v[c] || '').trim() && c !== active.value ? l + ' •' : l })), onChange: c => { if (!props.disabled) active.value = c; } })),
        h(N('TextField'), { modelValue: v[active.value] || '', placeholder: props.placeholder, disabled: props.disabled, size: 'lg', error: props.error === true || invalid ? ' ' : props.error || undefined, onChange: s => emit('update:modelValue', { ...v, [active.value]: s }) }),
        typeof props.error === 'string' && props.error ? h('span', { class: 'zg-hint zg-hint--error', role: 'alert' }, props.error) : null);
    };
  },
});

// ───────────────────────── theme ─────────────────────────
const LEGACY_KEY = 'glass-ui-theme', themeRef = ref('light');
let themeInit = false;
/** Drop-in for the old useTheme(): { theme, setTheme, toggleTheme }. Also toggles the .dark class (for Tailwind dark:) next to the new data-theme attribute. Reads the old localStorage key once. */
export function useTheme() {
  const ui = useUiTheme();
  if (!themeInit && typeof window !== 'undefined') {
    themeInit = true;
    const sync = tm => { themeRef.value = tm; document.documentElement.classList.toggle('dark', tm === 'dark'); try { localStorage.setItem(LEGACY_KEY, tm); } catch { /* storage blocked */ } };
    let legacy = null, hasNew = false;
    try { legacy = localStorage.getItem(LEGACY_KEY); hasNew = !!JSON.parse(localStorage.getItem('zg-ui') || '{}').theme; } catch { /* storage blocked */ }
    if (!hasNew) ui.setTheme(legacy === 'light' || legacy === 'dark' ? legacy : (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'));
    sync(ui.theme);
    ui.subscribe(s => sync(s.theme));
  }
  return { theme: readonly(themeRef), setTheme: tm => ui.setTheme(tm), toggleTheme: () => ui.toggleTheme() };
}

// ───────────────────────── exports ─────────────────────────
const all = {
  ...Object.fromEntries(Object.entries(generated).map(([k, v]) => ['Ui' + k, v])),
  UiDatePicker, UiTabs, UiTabsList, UiTab, UiTabPanel, UiRadio, UiRadioGroup, UiDropdown, UiMenu, UiMenuItem, UiMenuSeparator, UiTable, UiSidebar, UiSidebarSection, UiSidebarItem,
  UiNavbar, UiSubNav, UiToastContainer, UiCommandPalette, UiFileUpload, UiDateTimePicker, UiAvatarGroup, UiForm, UiMultilangInput, UiTooltip,
};
export const { UiButton, UiInput, UiTextarea, UiSelect, UiCombobox, UiCheckbox, UiSwitch, UiBadge, UiAlert, UiSkeleton, UiModal, UiConfirmModal, UiCard, UiProgress, UiBreadcrumbs, UiPagination, UiStatsCard, UiSegmentedControl, UiAvatar, UiCalendar, UiSpinner, UiDivider, UiBanner, UiEmptyState, UiDrawer, UiTag, UiOtpInput, UiKpiCard, UiFormField } = all;
export const MultilangInput = UiMultilangInput;
export const compatComponents = all;
export const install = app => { for (const [n, c] of Object.entries(all)) app.component(n, c); };
export default { install };
export { mapSize };
