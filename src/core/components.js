// @ziyarago/ui · framework-neutral component definitions.
// Each component: { state?, render({ h, props, children, slots, state, set }) }.
// h(tag, props, ...children) is supplied by the Vue / React adapter. No hooks inside.
import { trap } from './dialog.js';
import { t } from '../i18n/index.js';
import { rove, tabIdx, listKeys, openKeys, focusIn, toTrigger, trigger } from './keys.js';
export const cx = (...a) => a.filter(Boolean).join(' ');
// Quoted CSS url() for a background-image: URLs with spaces, parentheses, commas or quotes (photo (1).jpg, names with spaces) break the unquoted form and the image silently disappears.
export const cssUrl = u => 'url("' + String(u).replace(/["\\]/g, '\\$&').replace(/\n/g, '\\a ').replace(/\r/g, '\\d ') + '")';
// Copies the listed props that are set; used to forward native attributes and listeners to the real <input>/<textarea>.
const DOM_NAMES = { autocomplete: 'autoComplete', maxlength: 'maxLength', minlength: 'minLength', inputmode: 'inputMode', autocapitalize: 'autoCapitalize', spellcheck: 'spellCheck', autofocus: 'autoFocus' };
// DOM property spelling (autoComplete, maxLength ...) so React does not warn; Vue accepts it too.
export const pick = (p, keys) => { const o = {}; for (const k of keys) if (p[k] !== undefined) o[DOM_NAMES[k] || k] = p[k]; return o; };
export const INPUT_ATTRS = ['name', 'autocomplete', 'required', 'min', 'max', 'step', 'maxlength', 'minlength', 'inputmode', 'pattern', 'spellcheck', 'autofocus', 'autocapitalize', 'onBlur', 'onFocus', 'onKeydown', 'onKeyDown', 'onKeyup', 'onKeyUp', 'onPaste'];
export const DZ = { xs: .82, sm: .91, md: 1, lg: 1.12, xl: 1.25 };
// Shared outside-click / Escape close for popups. Put `ref: ddRef(close)` on the popup element; its parent is the component root
// (trigger + popup). Listeners attach only in the browser, only while a popup is mounted, and detach when the last one unmounts.
const ddReg = [];
const ddPrune = () => { for (let i = ddReg.length - 1; i >= 0; i--) if (!ddReg[i].el.isConnected) ddReg.splice(i, 1); ddSync(); };
const ddDown = e => { ddPrune(); for (const r of ddReg.slice()) { const root = r.self ? r.el : (r.el.parentElement || r.el); if (!root.contains(e.target)) r.close(); } };
const ddKey = e => {
  if (e.key !== 'Escape') return; ddPrune(); const r = ddReg[ddReg.length - 1]; if (!r) return;
  const root = r.self ? r.el : (r.el.parentElement || r.el);
  const t = [...root.querySelectorAll('button,input')].find(x => !r.el.contains(x));
  const ae = document.activeElement; r.close(); if (t && !t.disabled && !(ae && root.contains(ae) && !r.el.contains(ae))) t.focus();
};
let ddOn = false;
const ddSync = () => {
  if (typeof document === 'undefined') return;
  if (ddReg.length && !ddOn) { document.addEventListener('pointerdown', ddDown, true); document.addEventListener('keydown', ddKey); ddOn = true; }
  else if (!ddReg.length && ddOn) { document.removeEventListener('pointerdown', ddDown, true); document.removeEventListener('keydown', ddKey); ddOn = false; }
};
export const ddRef = (close, o = {}) => el => {
  if (typeof document === 'undefined') return;
  if (el) { const r = ddReg.find(x => x.el === el); if (r) { r.close = close; r.self = !!o.self; } else { ddReg.push({ el, close, self: !!o.self }); if (!o.self && el.scrollIntoView) el.scrollIntoView({ block: 'nearest', inline: 'nearest' }); if (o.focus) focusIn(el); } ddSync(); }
  else Promise.resolve().then(ddPrune);
};
export const dzp = (p, b) => Math.round(b * (DZ[p.size] || 1));
export const dzf = n => `calc(${n}px*var(--dz,1))`;
export const dzb = p => ({ xs: 'xs', sm: 'xs', md: 'sm', lg: 'md', xl: 'lg' }[p.size] || 'sm');
// Icons: Lucide SVGs inlined as data-URI masks. The ~100 icons the components use come from a lazily imported built-in set (no network, CSP-safe);
// any other name is fetched once from ZG_ICON_BASE (unpkg by default; override with setIconBase to self-host) or taken from registerIcons().
export let ZG_ICON_BASE = 'https://unpkg.com/lucide-static@0.460.0/icons/';
export const setIconBase = b => { ZG_ICON_BASE = b.endsWith('/') ? b : b + '/'; };
const iconCache = {}, iconPending = {}, iconExtra = {};
let iconBuiltin;
const getBuiltin = () => iconBuiltin || (iconBuiltin = import('../icons/builtin.js').then(m => m.default).catch(() => ({})));
/** Add or replace icons by name with inline SVG strings: registerIcons({ 'my-logo': '<svg ...>...</svg>' }). They win over the built-in set and the CDN. */
export const registerIcons = map => { Object.assign(iconExtra, map); for (const k of Object.keys(map)) { delete iconCache[k]; delete iconPending[k]; } };
const iconUri = svg => 'url("data:image/svg+xml,' + encodeURIComponent(svg.replace(/stroke="currentColor"/g, 'stroke="black"').replace(/currentColor/g, 'black')) + '")';
const loadIcon = name => {
  if (iconCache[name] || iconPending[name] || typeof document === 'undefined') return;
  iconPending[name] = (iconExtra[name] ? Promise.resolve(iconExtra[name]) : getBuiltin().then(b => b[name])).then(svg => svg || fetch(ZG_ICON_BASE + name + '.svg').then(r => r.text())).then(svg => {
    iconCache[name] = iconUri(svg);
    document.querySelectorAll('[data-zg-icon="' + name + '"]').forEach(el => el.style.setProperty('--zg-icon', iconCache[name]));
  }).catch(() => {});
};
export const icon = (h, name, size) => { loadIcon(name); return h('span', { class: 'zg-icon', 'data-zg-icon': name, style: { ...(iconCache[name] ? { '--zg-icon': iconCache[name] } : {}), ...(size ? { width: size + 'px', height: size + 'px' } : {}) }, 'aria-hidden': 'true' }); };
const fmt = {
  num: n => (n == null || Number.isNaN(n)) ? '—' : n === -1 ? '∞' : String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, '\u2009'),
  sar: n => (n == null || Number.isNaN(n)) ? '—' : 'SAR\u00a0' + String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, '\u2009'),
  dur: (s, u) => { if (s == null || Number.isNaN(+s)) return '—'; s = Math.max(0, Math.round(+s)); const m = Math.floor(s / 60), r = s % 60; return `${m} ${(u && u.m) || 'm'} ${String(r).padStart(2, '0')} ${(u && u.s) || 's'}`; },
};
// TopNav overflow: items that do not fit move into a trailing "More" menu. Measured in the browser after render (ResizeObserver on the header);
// item widths are cached from the render where every item is visible, so hidden items need no measuring. SSR renders every item.
const tn = new WeakMap();
const tnMeasure = (el, ctx) => {
  if (!el || !ctx.collapse || typeof ResizeObserver === 'undefined') return;
  let r = tn.get(el);
  if (!r) { r = { w: {}, sig: '' }; r.ro = new ResizeObserver(() => r.run()); tn.set(el, r); if (el.parentElement) r.ro.observe(el.parentElement); }
  r.ctx = ctx;
  r.run = () => {
    const { items, more, set, state } = r.ctx, kids = [...el.children], header = el.parentElement;
    if (!header || !items.length) return;
    const sig = items.map(i => i.value).join('|');
    if (sig !== r.sig) { r.sig = sig; r.w = {}; }
    const n = items.length, shownN = kids.length - (more ? 1 : 0);
    for (let i = 0; i < shownN; i++) r.w[items[i].value] = kids[i].offsetWidth;
    if (more) r.w.__more = kids[kids.length - 1].offsetWidth;
    if (items.some(i => r.w[i.value] == null)) { if (state.fit != null) set({ fit: null }); return; }
    const hs = getComputedStyle(header), es = getComputedStyle(el), bar = header.querySelector('.zg-topnav__brand'), act = header.querySelector('.zg-topnav__actions');
    const gap = parseFloat(hs.columnGap) || 0, ig = parseFloat(es.columnGap) || 0;
    const avail = header.clientWidth - parseFloat(hs.paddingLeft) - parseFloat(hs.paddingRight) - (bar ? bar.offsetWidth : 0) - (act ? act.offsetWidth : 0) - 2 * gap - parseFloat(es.paddingLeft) - parseFloat(es.paddingRight);
    const total = items.reduce((a, i) => a + r.w[i.value], 0) + ig * (n - 1);
    let want = n;
    if (total > avail) { let acc = r.w.__more || 56, k = 0; for (const i of items) { const need = r.w[i.value] + ig; if (acc + need <= avail) { acc += need; k++; } else break; } want = k; }
    if (want !== (state.fit == null ? n : state.fit)) set({ fit: want >= n ? null : want });
  };
  r.run();
};
const MODAL_SIZES = ['xs', 'sm', 'md', 'lg', 'xl', '2xl', '3xl', '4xl', '5xl'];
const warned = new Set();
// Development-only hint, printed once per message. import.meta.env is undefined outside Vite, then nothing is printed.
const devWarn = (name, msg) => { const dev = typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.DEV; if (!dev || warned.has(msg)) return; warned.add(msg); console.warn('[@ziyarago/ui] ' + name + ': ' + msg); };
const nav = (h, it, cur, onChange, collapsed) => h('button', { key: it.value, class: 'zg-navitem', 'aria-current': it.value === cur ? 'page' : undefined, title: collapsed ? it.label : undefined, onClick: () => onChange && onChange(it.value) },
  it.icon ? icon(h, it.icon, 18) : null, h('span', null, it.label), it.count ? h('span', { class: 'zg-navitem__count' }, it.count) : null);

export const components = {
  Button: { render: ({ h, props: p, children }) => h('button', { type: p.type || 'button', title: p.title, class: cx('zg-btn', 'zg-btn--' + (p.variant || 'secondary'), p.size && 'zg-btn--' + p.size, p.block && 'zg-btn--block', p.iconOnly && 'zg-btn--sq', p.tone && 'zg-t-' + p.tone), disabled: p.disabled || p.loading, onClick: p.onClick },
    p.loading ? h('span', { class: 'zg-spin' }) : p.icon ? icon(h, p.icon, 16) : null, ...children, p.iconRight ? icon(h, p.iconRight, 16) : null) },
  IconButton: { render: ({ h, props: p }) => h('button', { type: 'button', 'aria-label': p.label, class: cx('zg-ibtn', p.size && 'zg-ibtn--' + p.size, p.ghost && 'zg-ibtn--ghost'), onClick: p.onClick }, icon(h, p.icon)) },
  Badge: { render: ({ h, props: p, children }) => h('span', { class: cx('zg-badge', p.tone && 'zg-badge--' + p.tone, p.shape === 'square' && 'zg-badge--sq') }, p.dot ? h('span', { class: 'zg-badge__dot' }) : null, ...children) },
  Avatar: { render: ({ h, props: p }) => h('span', { class: cx('zg-avatar', p.shape === 'rounded' && 'zg-avatar--sq', p.ring && 'zg-avatar--ring', p.status && 'zg-avatar--st', p.tone && 'zg-avatar--' + p.tone), style: { '--s': ({ xs: 24, sm: 32, md: 40, lg: 56, xl: 72 }[p.size] || p.size || 40) + 'px' }, title: p.name },
    p.src ? h('img', { src: p.src, alt: p.name || '' }) : p.initials ? String(p.initials).slice(0, 3).toUpperCase() : (p.name || '?').split(/\s+/).slice(0, 2).map(w => w[0]).join('').toUpperCase(),
    p.status ? h('i', { class: 'zg-avatar__st zg-avatar__st--' + p.status, role: 'img', 'aria-label': p.status }) : null) },
  Switch: { render: ({ h, props: p }) => { const txt = p.label || p.hint || p.error ? h('span', null, p.label || null, p.hint && !p.error ? h('span', { class: 'zg-hint', style: { display: 'block' } }, p.hint) : null, p.error ? h('span', { class: 'zg-hint zg-hint--error', role: 'alert', style: { display: 'block' } }, p.error) : null) : null, tr = h('span', { class: 'zg-switch__track' }, h('span', { class: 'zg-switch__thumb' }));
    return h('button', { type: 'button', role: 'switch', class: 'zg-switch', 'aria-checked': String(!!p.modelValue), disabled: p.disabled, 'aria-disabled': p.disabled ? 'true' : undefined, onClick: () => !p.disabled && p.onChange && p.onChange(!p.modelValue) }, ...(p.labelLeft ? [txt, tr] : [tr, txt])); } },
  Checkbox: { render: ({ h, props: p }) => h('button', { type: 'button', role: 'checkbox', class: cx('zg-check', p.error && 'zg-check--error'), 'aria-checked': p.indeterminate ? 'mixed' : String(!!p.modelValue), disabled: p.disabled, 'aria-disabled': p.disabled ? 'true' : undefined, onClick: () => !p.disabled && p.onChange && p.onChange(p.indeterminate ? true : !p.modelValue) }, h('span', { class: 'zg-check__box' }, p.indeterminate ? icon(h, 'minus', 14) : p.modelValue ? icon(h, 'check', 14) : null),
    p.label || p.hint || p.error ? h('span', null, p.label || null, p.hint && !p.error ? h('span', { class: 'zg-hint', style: { display: 'block' } }, p.hint) : null, p.error && typeof p.error === 'string' ? h('span', { class: 'zg-hint zg-hint--error', role: 'alert', style: { display: 'block' } }, p.error) : null) : null) },
  SegmentedControl: { render: ({ h, props: p }) => h('div', { class: cx('zg-seg', p.size === 'sm' && 'zg-seg--sm', p.block && 'zg-seg--block'), role: 'group', 'aria-label': p.ariaLabel, onKeydown: rove('button') }, ...(p.items || []).map((it, i, all) => h('button', { key: it.value, type: 'button', tabIndex: tabIdx(all, x => x.value === p.modelValue)(i), disabled: it.disabled, title: p.iconOnly ? it.label : undefined, 'aria-label': p.iconOnly && it.icon ? it.label : undefined, 'aria-pressed': String(it.value === p.modelValue), onClick: () => !it.disabled && p.onChange && p.onChange(it.value) }, it.icon ? icon(h, it.icon, 16) : null, p.iconOnly && it.icon ? null : it.label))) },
  Tabs: { render: ({ h, props: p }) => h('div', { class: 'zg-tabs', role: 'tablist', onKeydown: rove('[role=tab]') }, ...(p.items || []).map((it, i, all) => h('button', { key: it.value, role: 'tab', type: 'button', tabIndex: tabIdx(all, x => x.value === p.modelValue)(i), disabled: it.disabled, 'aria-selected': String(it.value === p.modelValue), onClick: () => p.onChange && p.onChange(it.value) }, it.label, (it.count ?? it.badge) != null && (it.count ?? it.badge) !== '' ? h('span', { class: 'zg-tab__count' }, it.count ?? it.badge) : null))) },
  FilterChips: { render: ({ h, props: p }) => { const sel = p.multi ? (p.modelValue || []) : [p.modelValue]; return h('div', { class: 'zg-chips' }, ...(p.items || []).map(it => h('button', { key: it.value, type: 'button', class: 'zg-chip', 'aria-pressed': String(sel.includes(it.value)), onClick: () => { if (!p.onChange) return; p.onChange(p.multi ? (sel.includes(it.value) ? sel.filter(v => v !== it.value) : [...sel, it.value]) : it.value); } }, it.label))); } },
  TextField: { slots: ['prefix', 'suffix'], render: ({ h, props: p, slots }) => h('label', { class: 'zg-field' }, p.label ? h('span', { class: 'zg-label' }, p.label, p.required ? h('span', { class: 'zg-req', 'aria-hidden': 'true' }, ' *') : null) : null,
    h('span', { class: cx('zg-input', p.error && 'zg-input--error', p.variant && 'zg-input--' + p.variant, p.density === 'compact' && 'zg-input--compact', p.disabled && 'zg-input--disabled') }, slots.prefix || (p.icon ? icon(h, p.icon, 18) : null), h('input', { ...pick(p, INPUT_ATTRS), type: p.type || 'text', value: p.modelValue ?? '', placeholder: p.placeholder, disabled: p.disabled, readOnly: p.readonly, onInput: e => { p.onChange && p.onChange(e.target.value); p.onInput && p.onInput(e); } }), slots.suffix || p.suffix || null),
    p.error ? h('span', { class: 'zg-hint zg-hint--error', role: 'alert' }, p.error) : p.hint ? h('span', { class: 'zg-hint' }, p.hint) : null) },
  Select: { state: { open: false }, render: ({ h, props: p, state, set }) => { const cur = (p.options || []).find(o => o.value === p.modelValue), open = state.open && !p.disabled;
    return h('div', { class: 'zg-field' }, p.label ? h('span', { class: 'zg-label' }, p.label, p.required ? h('span', { class: 'zg-req', 'aria-hidden': 'true' }, ' *') : null) : null,
      h('div', { class: 'zg-select' }, h('button', { type: 'button', class: cx('zg-btn', 'zg-select__trigger', p.error && 'zg-select__trigger--error'), 'aria-haspopup': 'listbox', 'aria-expanded': String(open), disabled: p.disabled, style: { height: 'var(--zg-h-lg)' }, onClick: () => set({ open: !state.open }), onKeydown: openKeys(open, () => set({ open: true })) }, h('span', null, cur ? cur.label : p.placeholder || '—'), icon(h, open ? 'chevron-up' : 'chevron-down', 16)),
        open ? h('div', { class: 'zg-select__list', role: 'listbox', 'aria-label': p.label || p.placeholder, 'data-zg-dd': '', ref: ddRef(() => set({ open: false }), { focus: true }), onKeydown: listKeys('[role=option]', { onTab: e => { const t = trigger(e.currentTarget); t && t.focus(); set({ open: false }); } }) }, ...(p.options || []).map((o, i, all) => h('button', { key: o.value, type: 'button', role: 'option', tabIndex: tabIdx(all, x => x.value === p.modelValue)(i), class: 'zg-select__opt', disabled: o.disabled, 'aria-disabled': o.disabled ? 'true' : undefined, 'aria-selected': String(o.value === p.modelValue), onClick: e => { toTrigger(e); set({ open: false }); p.onChange && p.onChange(o.value); } }, o.label, o.value === p.modelValue ? icon(h, 'check', 16) : null))) : null),
      p.name ? h('input', { type: 'hidden', name: p.name, value: p.modelValue ?? '' }) : null, p.error ? h('span', { class: 'zg-hint zg-hint--error', role: 'alert' }, p.error) : p.hint ? h('span', { class: 'zg-hint' }, p.hint) : null); } },
  CodeInput: { render: ({ h, props: p }) => { const n = p.length || 6, v = p.modelValue || '';
    return h('div', { class: 'zg-code', style: { '--n': n } }, ...Array.from({ length: n }, (_, i) => h('span', { key: i, class: cx('zg-code__cell', i === v.length && 'zg-code__cell--on') }, v[i] || '')),
      h('input', { value: v, inputMode: 'numeric', autoComplete: 'one-time-code', maxLength: n, 'aria-label': p.label || t('CodeInput', 'label'), onInput: e => { const x = e.target.value.replace(/\D/g, '').slice(0, n); p.onChange && p.onChange(x); if (x.length === n && v.length !== n) p.onComplete && p.onComplete(x); } })); } },
  Card: { slots: ['header', 'footer'], render: ({ h, props: p, children, slots }) => h('section', { class: cx('zg-card', 'zg-glass', p.variant === 'inverse' && 'zg-card--inverse', p.variant === 'gradient' && 'zg-card--grad', p.variant === 'gradient' && 'zg-card--t-' + (p.tone || 'brand'), p.variant === 'gradient' && p.intensity === 'vivid' && 'zg-card--vivid', p.variant === 'outline' && 'zg-card--outline', p.padding === 'none' && 'zg-card--flush', p.interactive && 'zg-card--click'), 'data-theme': p.variant === 'inverse' ? 'dark' : (p.variant === 'gradient' && p.intensity === 'vivid' ? (['brand', 'warning', undefined].includes(p.tone) ? 'light' : 'dark') : undefined), onClick: p.onClick, tabIndex: p.interactive && p.onClick ? 0 : undefined, onKeydown: p.interactive && p.onClick ? e => { if (e.key === 'Enter' && e.target === e.currentTarget) p.onClick(e); } : undefined },
    slots.header ? h('div', { class: 'zg-card__head' }, slots.header) : (p.title || slots.actions) ? h('div', { class: 'zg-card__head' }, h('div', { style: { flex: 1, minWidth: 0 } }, h('h3', { class: 'zg-card__title' }, p.title), p.subtitle ? h('div', { class: 'zg-card__sub' }, p.subtitle) : null), slots.actions || null) : null, ...children, slots.footer ? h('div', { class: 'zg-card__foot' }, slots.footer) : null) },
  Modal: { slots: ['title', 'subtitle'], render: ({ h, props: p, children, slots }) => { if (p.size && !MODAL_SIZES.includes(p.size)) devWarn('Modal', 'unknown size "' + p.size + '", falling back to md. Use ' + MODAL_SIZES.join(', ') + ' or the width prop.'); const foot = slots.footer || p.footer, sub = slots.subtitle || p.subtitle, ttl = slots.title || p.title; return !p.open ? null : h('div', { class: 'zg-modal-scrim', onClick: p.closeOnBackdrop === false ? undefined : p.onClose }, h('div', { class: 'zg-modal', role: 'dialog', 'aria-modal': 'true', 'aria-label': p.title, style: p.width ? { maxWidth: p.width } : undefined, ref: trap({ onClose: p.closeOnEsc === false ? undefined : p.onClose }), onClick: e => e.stopPropagation() },
    h('div', { class: 'zg-modal__head' }, sub ? h('div', { style: { flex: 1, minWidth: 0 } }, h('h3', null, ttl), h('div', { class: 'zg-modal__sub' }, sub)) : h('h3', null, ttl), p.closable === false ? null : h('button', { type: 'button', class: 'zg-ibtn zg-ibtn--sm zg-ibtn--ghost', 'aria-label': t('Modal', 'close'), onClick: p.onClose }, icon(h, 'x'))), h('div', { class: 'zg-modal__body' }, ...children), foot ? h('div', { class: 'zg-modal__foot' }, foot) : null)); } },
  Drawer: { render: ({ h, props: p, children, slots }) => { const foot = slots.footer || p.footer; return !p.open ? null : h('div', { class: cx('zg-modal-scrim', 'zg-drawer-scrim', 'zg-drawer-scrim--' + (p.side || 'end')), onClick: p.onClose }, h('div', { class: 'zg-modal zg-drawer', role: 'dialog', 'aria-modal': 'true', 'aria-label': p.title, ref: trap({ onClose: p.onClose }), onClick: e => e.stopPropagation() },
    h('div', { class: 'zg-modal__head' }, h('h3', null, p.title), h('button', { type: 'button', class: 'zg-ibtn zg-ibtn--sm zg-ibtn--ghost', 'aria-label': t('Drawer', 'close'), onClick: p.onClose }, icon(h, 'x'))), h('div', { class: 'zg-modal__body' }, ...children), foot ? h('div', { class: 'zg-modal__foot' }, foot) : null)); } },
  Toast: { render: ({ h, props: p, children }) => h('div', { class: cx('zg-toast', 'zg-toast--' + (p.tone || 'info')), role: 'status' }, h('span', { class: 'zg-toast__icon' }, icon(h, { success: 'check', danger: 'circle-alert', warning: 'triangle-alert' }[p.tone] || 'info', 18)), h('div', null, p.title ? h('b', null, p.title) : null, h('span', null, ...children))) },
  Breadcrumbs: { render: ({ h, props: p }) => h('nav', { class: 'zg-crumbs', 'aria-label': t('Breadcrumbs', 'label') }, ...(p.items || []).flatMap((it, i, a) => [i ? (p.separator === 'slash' || p.separator === 'dot' ? h('span', { key: 's' + i, class: 'zg-crumbs__sep', 'aria-hidden': 'true' }, p.separator === 'slash' ? '/' : '\u00b7') : icon(h, 'chevron-right', 14)) : null, i === a.length - 1 ? h('b', { key: i, 'aria-current': 'page' }, it.label) : h('a', { key: i, href: it.href || '#' }, it.label)])) },
  Pagination: { render: ({ h, props: p }) => { const total = Math.max(1, Math.floor(+p.pages) || 1), cur = Math.min(total, Math.max(1, +p.page || 1)), s = Math.max(0, p.siblings == null ? 1 : Math.floor(+p.siblings) || 0), go = n => p.onChange && n >= 1 && n <= total && n !== p.page && p.onChange(n);
    const set = new Set([1, total]); for (let i = cur - s; i <= cur + s; i++) if (i >= 1 && i <= total) set.add(i);
    const nums = [...set].sort((a, b) => a - b), items = []; nums.forEach((n, i) => { const prev = nums[i - 1]; if (prev && n - prev === 2) items.push(prev + 1); else if (prev && n - prev > 2) items.push('…'); items.push(n); });
    return h('nav', { class: 'zg-pager', 'aria-label': p.label || t('Pagination', 'label') }, p.hideArrows ? null : h('button', { key: 'prev', type: 'button', class: 'zg-pager__nav', 'aria-label': (p.labels && p.labels.prev) || t('Pagination', 'prev'), disabled: cur <= 1, onClick: () => go(cur - 1) }, icon(h, 'chevron-left', 16)),
      ...items.map((n, i) => n === '…' ? h('span', { key: 'e' + i, class: 'zg-pager__gap', 'aria-hidden': 'true' }, '…') : h('button', { key: n, type: 'button', 'aria-label': ((p.labels && p.labels.page) || t('Pagination', 'page')) + ' ' + n, 'aria-current': n === p.page ? 'page' : undefined, onClick: () => go(n) }, n)),
      p.hideArrows ? null : h('button', { key: 'next', type: 'button', class: 'zg-pager__nav', 'aria-label': (p.labels && p.labels.next) || t('Pagination', 'next'), disabled: cur >= total, onClick: () => go(cur + 1) }, icon(h, 'chevron-right', 16))); } },
  Progress: { render: ({ h, props: p }) => h('div', { class: cx('zg-progress', p.tone && 'zg-progress--' + p.tone) }, (p.label || p.meta) ? h('div', { class: 'zg-progress__row' }, h('span', null, p.label), h('span', { class: 'zg-mono' }, p.meta)) : null, h('div', { class: 'zg-progress__track', role: 'progressbar', 'aria-label': p.label || t('Progress', 'label'), 'aria-valuenow': p.value, 'aria-valuemin': 0, 'aria-valuemax': 100 }, h('div', { class: 'zg-progress__bar', style: { width: Math.max(0, Math.min(100, p.value || 0)) + '%' } }))) },
  Ring: { render: ({ h, props: p }) => { const s = { xs: 72, sm: 120, md: 180, lg: 240, xl: 300 }[p.size] || (Number(p.size) > 0 ? Number(p.size) : 180), th = p.thickness || Math.max(8, Math.round(s * .078)), ticks = p.ticks !== false, v = Math.max(0, Math.min(100, p.value || 0)) / 100, col = p.color || 'var(--zg-brand)';
    const r = (s - th) / 2 - (ticks ? 12 : 0), cir = 2 * Math.PI * r, tk = [];
    if (ticks) for (let i = 0; i < 60; i++) { const an = i / 60 * 2 * Math.PI, R = s / 2 - 2, L = i % 5 ? 4 : 8; tk.push(h('line', { key: i, x1: +(s / 2 + Math.cos(an) * R).toFixed(2), y1: +(s / 2 + Math.sin(an) * R).toFixed(2), x2: +(s / 2 + Math.cos(an) * (R - L)).toFixed(2), y2: +(s / 2 + Math.sin(an) * (R - L)).toFixed(2), stroke: i / 60 <= v ? col : 'var(--zg-s3)', 'stroke-width': i % 5 ? 1 : 1.6, 'stroke-linecap': 'round' })); }
    return h('div', { class: 'zg-ring', style: { width: s + 'px', height: s + 'px' }, role: 'img', 'aria-label': Math.round(v * 100) + '%' }, h('svg', { width: s, height: s, viewBox: `0 0 ${s} ${s}` }, ...tk,
      h('circle', { cx: s / 2, cy: s / 2, r, fill: 'none', stroke: 'var(--zg-stroke)', 'stroke-width': th }),
      h('circle', { cx: s / 2, cy: s / 2, r, fill: 'none', stroke: col, 'stroke-width': th, 'stroke-linecap': 'round', 'stroke-dasharray': cir, 'stroke-dashoffset': cir * (1 - v), style: { filter: 'drop-shadow(0 0 10px color-mix(in oklch, ' + col + ' 45%, transparent))', transition: 'stroke-dashoffset 1.4s cubic-bezier(.2,.8,.2,1)' } })),
      h('div', { class: 'zg-ring__c' }, h('span', { class: 'zg-ring__v', style: { fontSize: (p.valueSize || s * .22) + 'px' } }, Math.round(v * 100), h('span', { style: { fontSize: '.45em', color: 'var(--zg-text-3)' } }, '%')), p.label ? h('span', { class: 'zg-ring__l' }, p.label) : null)); } },
  KpiTile: { render: ({ h, props: p }) => h('div', { class: cx('zg-kpi', p.variant && 'zg-kpi--' + p.variant) }, h('span', { class: 'zg-kpi__label' }, p.label), h('span', { class: 'zg-kpi__value zg-num' }, p.value), (p.sub || p.delta) ? h('span', { class: 'zg-kpi__sub' }, p.delta ? h('span', { class: cx('zg-delta', String(p.delta).startsWith('-') ? 'zg-delta--down' : 'zg-delta--up') }, p.delta + ' ') : null, p.sub) : null) },
  DataTable: { render: ({ h, props: p, slots }) => { const cs = c => (c.align || c.width) ? { textAlign: c.align, width: c.width } : undefined, cols = p.columns || [], rows = p.rows || [], sel = p.selected || [], all = rows.length && rows.every(r => sel.includes(r.id));
    const th = c => h('th', { key: c.key, 'aria-sort': p.sortKey === c.key ? (p.sortDir === 'desc' ? 'descending' : 'ascending') : undefined, class: c.num ? 'num' : undefined, style: cs(c) }, c.sortable ? h('button', { type: 'button', onClick: () => p.onSort && p.onSort(c.key, p.sortKey === c.key && p.sortDir !== 'desc' ? 'desc' : 'asc') }, c.label, p.sortKey === c.key ? icon(h, p.sortDir === 'desc' ? 'arrow-down' : 'arrow-up', 12) : null) : c.label);
    return h('div', { class: 'zg-table-wrap', tabIndex: 0 }, h('table', { class: 'zg-table' }, h('thead', null, h('tr', null, p.onSelect ? h('th', { style: { width: '44px' } }, h('button', { type: 'button', role: 'checkbox', class: 'zg-check', 'aria-checked': String(!!all), 'aria-label': (p.labels && p.labels.selectAll) || t('DataTable', 'selectAll'), onClick: () => p.onSelect(all ? [] : rows.map(r => r.id)) }, h('span', { class: 'zg-check__box' }, all ? icon(h, 'check', 14) : null))) : null, ...cols.map(th))),
      h('tbody', null, ...(rows.length ? rows.map((r, ri) => h('tr', { key: r.id, 'aria-selected': sel.includes(r.id) ? 'true' : undefined, class: p.onRowClick ? 'zg-tr--click' : undefined, onClick: p.onRowClick ? () => p.onRowClick(r, ri) : undefined }, p.onSelect ? h('td', null, h('button', { type: 'button', role: 'checkbox', class: 'zg-check', 'aria-checked': String(sel.includes(r.id)), 'aria-label': (p.labels && p.labels.selectRow) || t('DataTable', 'selectRow'), onClick: () => p.onSelect(sel.includes(r.id) ? sel.filter(i => i !== r.id) : [...sel, r.id]) }, h('span', { class: 'zg-check__box' }, sel.includes(r.id) ? icon(h, 'check', 14) : null))) : null, ...cols.map(c => h('td', { key: c.key, class: c.num ? 'num' : undefined, style: cs(c) }, c.render ? c.render(r[c.key], r, h) : (r[c.key] ?? '—'))))) : [h('tr', { key: 'e' }, h('td', { colSpan: cols.length + 1 }, h('div', { class: 'zg-empty' }, slots.empty || p.empty || '—')))])))); } },
  Timeline: { render: ({ h, props: p }) => h('div', { class: 'zg-timeline' }, ...(p.items || []).map((it, i, a) => h('div', { key: i, class: 'zg-tl' }, h('div', { class: 'zg-tl__rail' }, h('span', { class: 'zg-tl__dot' }), i < a.length - 1 ? h('span', { class: 'zg-tl__line' }) : null), h('div', { class: 'zg-tl__body' }, h('b', null, it.title), it.text ? h('span', null, it.text) : null, h('span', { class: 'zg-tl__time' }, it.time))))) },
  TopNav: { state: { open: null, fit: null }, render: ({ h, props: p, slots, state, set }) => {
    const items = p.items || [], collapse = p.overflow !== 'none';
    const fit = collapse && state.fit != null && state.fit < items.length ? state.fit : items.length;
    const shown = items.slice(0, fit), rest = items.slice(fit);
    const more = rest.length ? { value: '__more', label: p.moreLabel || t('TopNav', 'more'), icon: 'ellipsis', children: rest.flatMap(it => it.children && it.children.length ? [{ heading: it.label }, ...it.children] : [it]) } : null;
    const close = () => set({ open: null });
    const entry = it => {
      const kids = it.children;
      if (!kids || !kids.length) return nav(h, it, p.value, p.onChange);
      const open = state.open === it.value, active = it.value !== '__more' ? kids.some(c => c.value === p.value) : rest.some(r => r.value === p.value || (r.children || []).some(c => c.value === p.value));
      const flat = kids.map(c => ({ value: c.value, disabled: c.separator || c.heading || c.disabled }));
      return h('div', { key: it.value, class: 'zg-dd zg-topnav__dd' },
        h('button', { type: 'button', class: 'zg-navitem', 'aria-haspopup': 'menu', 'aria-expanded': String(open), 'aria-current': active ? 'page' : undefined, onClick: () => set({ open: open ? null : it.value }), onKeydown: openKeys(open, () => set({ open: it.value })) },
          it.icon ? icon(h, it.icon, 18) : null, it.value === '__more' ? h('span', { class: 'zg-sr' }, it.label) : h('span', null, it.label), it.count ? h('span', { class: 'zg-navitem__count' }, it.count) : null, it.value === '__more' ? null : icon(h, 'chevron-down', 14)),
        open ? h('div', { class: 'zg-menu', role: 'menu', 'data-zg-dd': '', ref: ddRef(close, { focus: true }), onKeydown: listKeys('[role=menuitem]', { wrap: true, onTab: e => { const tr = trigger(e.currentTarget); tr && tr.focus(); close(); } }) },
          ...kids.map((c, i) => c.separator ? h('div', { key: 's' + i, class: 'zg-menu__sep', role: 'separator' }) : c.heading ? h('div', { key: 'h' + i, class: 'zg-menu__h', role: 'presentation' }, c.heading)
            : h('button', { key: c.value, type: 'button', role: 'menuitem', tabIndex: tabIdx(flat, x => x.value === p.value)(i), disabled: c.disabled, 'aria-disabled': c.disabled ? 'true' : undefined, 'aria-current': c.value === p.value ? 'page' : undefined, class: 'zg-menu__i', onClick: e => { toTrigger(e); close(); p.onChange && p.onChange(c.value); } },
              c.icon ? icon(h, c.icon, 16) : null, h('span', null, c.label), c.count ? h('span', { class: 'zg-navitem__count' }, c.count) : null))) : null);
    };
    const measure = el => tnMeasure(el, { items, more, set, state, collapse });
    return h('header', { class: 'zg-topnav' }, h('div', { class: 'zg-topnav__brand' }, p.brand),
      h('nav', { class: 'zg-topnav__items', 'data-overflow': collapse ? 'menu' : 'none', 'aria-label': t('TopNav', 'label'), ref: measure }, ...shown.map(entry), more ? entry(more) : null),
      h('div', { class: 'zg-topnav__actions' }, slots.actions || p.actions || null)); } },
  SideNav: { state: { open: {} }, render: ({ h, props: p, slots, state, set }) => {
    const entry = it => {
      if (it.group) return h('div', { key: it.group, class: 'zg-sidenav__group', style: p.collapsed ? { display: 'none' } : undefined }, it.group);
      const kids = it.children;
      if (!kids || !kids.length) return nav(h, it, p.value, p.onChange, p.collapsed);
      const active = kids.some(c => c.value === p.value), open = state.open[it.value] ?? active;
      return h('div', { key: it.value, class: 'zg-sidenav__sub' },
        h('button', { type: 'button', class: 'zg-navitem', 'aria-expanded': String(open), 'aria-current': active && !open ? 'page' : undefined, title: p.collapsed ? it.label : undefined, onClick: () => set({ open: { ...state.open, [it.value]: !open } }) },
          it.icon ? icon(h, it.icon, 18) : null, h('span', null, it.label), it.count ? h('span', { class: 'zg-navitem__count' }, it.count) : null, h('span', { class: 'zg-sidenav__chev' }, icon(h, 'chevron-down', 14))),
        open ? h('div', { class: 'zg-sidenav__kids', role: 'group', 'aria-label': it.label }, ...kids.map((c, i) => c.separator ? h('div', { key: 's' + i, class: 'zg-menu__sep', role: 'separator' }) : nav(h, p.collapsed && !c.icon ? { ...c, icon: 'dot' } : c, p.value, p.onChange, p.collapsed))) : null);
    };
    return h('aside', { class: cx('zg-sidenav', p.collapsed && 'zg-sidenav--collapsed') }, h('div', { class: 'zg-sidenav__brand' }, p.brand), ...(p.items || []).map(entry), h('div', { class: 'zg-sidenav__sp' }), slots.footer || p.footer || null,
      (p.onToggle || p.collapsible) ? h('button', { type: 'button', class: 'zg-navitem', onClick: p.onToggle, 'aria-label': t('SideNav', 'toggle') }, icon(h, p.collapsed ? 'panel-left-open' : 'panel-left-close', 18), h('span', null, p.collapseLabel || t('SideNav', 'collapse'))) : null); } },
  AppShell: { state: { collapsed: false }, render: ({ C, h, props: p, children, slots, state, set }) => {
    const brand = p.brand, top = (p.nav || 'top') === 'top', col = p.collapsed ?? state.collapsed, toggle = () => p.onCollapse ? p.onCollapse(!col) : set({ collapsed: !state.collapsed });
    return h('div', { class: cx('zg-root', 'zg-shell', top && 'zg-shell--top', p.frame && 'zg-shell--frame'), style: { background: 'var(--zg-bg)' } },
      top ? h(C.TopNav, { brand, items: p.items, value: p.value, onChange: p.onChange, actions: p.actions }, null) : h(C.SideNav, { brand, items: p.items, value: p.value, onChange: p.onChange, collapsed: col, onToggle: p.collapsible !== false ? toggle : undefined, footer: slots.footer, collapseLabel: p.collapseLabel }),
      h('main', { class: 'zg-shell__main' }, ...children)); } },
  PageHeader: { render: ({ C, h, props: p, slots }) => h('div', { class: 'zg-page-head' }, h('div', { style: { flex: 1, minWidth: 0 } }, p.crumbs ? h(C.Breadcrumbs, { items: p.crumbs }) : null, h('h1', null, p.title), p.subtitle ? h('p', null, p.subtitle) : null), slots.actions || null) },
  AuthLayout: { render: ({ h, props: p, children }) => h('div', { class: 'zg-root zg-auth', style: p.style }, h('div', { class: 'zg-auth__card' }, p.logo || null, h('div', null, h('h1', { style: { margin: 0, font: '300 30px var(--zg-font)', letterSpacing: '-.03em' } }, p.title), p.subtitle ? h('p', { style: { margin: '6px 0 0', color: 'var(--zg-text-2)', lineHeight: 1.5 } }, p.subtitle) : null), ...children)) },
};
export { fmt };
