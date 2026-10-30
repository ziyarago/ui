// @ziyarago/ui · components, part 7 — gluestack parity: typography, layout primitives, Link, Pressable, Icon, Portal, sheets, ImageViewer, ChatAi, LiquidGlass.
import { icon, cx } from './components.js';
import { trap } from './dialog.js';
import { st, gap, alignItems, justify, cols, gmin, pd } from './csp.js';
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const sp = v => (typeof v === 'number' ? v + 'px' : v);
const stack = (dir) => ({ render: ({ h, props: p, children }) => { const g = gap(p.gap ?? 12), a = alignItems(p.align), j = justify(p.justify); return h(p.as || 'div', { class: cx('zg-stack', dir === 'row' ? 'zg-stack--row' : 'zg-stack--col', g[0], a[0], j[0], p.wrap && 'zg-wrap'), style: st(g[1], a[1], j[1], p.style) }, ...children); } });

export const HeadingDef = { render: ({ h, props: p, children }) => h('h' + clamp(p.level || 2, 1, 6), { class: cx('zg-heading', 'zg-heading--' + (p.size || 'lg'), p.brand && 'zg-heading--brand') }, ...children) };
export const TextDef = { render: ({ h, props: p, children }) => h(p.as || 'p', { class: cx('zg-text', 'zg-text--' + (p.size || 'md'), p.tone && 'zg-text--' + p.tone, p.bold && 'zg-text--bold', p.truncate && 'zg-text--truncate') }, ...children) };
export const BoxDef = { render: ({ h, props: p, children }) => h(p.as || 'div', { class: cx('zg-box', p.glass && 'zg-glass', p.p !== undefined && p.p !== null && pd(p.p)[0]), style: st(p.p !== undefined && p.p !== null && pd(p.p)[1], p.style) }, ...children) };
export const CenterDef = { render: ({ h, props: p, children }) => h(p.as || 'div', { class: 'zg-center', style: p.style }, ...children) };
export const HStackDef = /*#__PURE__*/ stack('row');
export const VStackDef = /*#__PURE__*/ stack('column');
export const GridDef = { render: ({ h, props: p, children }) => { const g = gap(p.gap ?? 16), c = p.cols ? cols(p.cols) : gmin(p.min || 240); return h(p.as || 'div', { class: cx('zg-grid', p.cols ? c[0] : cx('zg-grid--auto', c[0]), g[0]), style: st(g[1], c[1], p.style) }, ...children); } };
export const LinkDef = { render: ({ h, props: p, children }) => h('a', { class: cx('zg-link', p.plain && 'zg-link--plain'), href: p.href || '#', target: p.external ? '_blank' : undefined, rel: p.external ? 'noopener noreferrer' : undefined, onClick: p.onClick }, ...children, p.external ? icon(h, 'external-link', 12) : null) };
export const PressableDef = { render: ({ h, props: p, children }) => h(p.as || 'button', { type: (p.as || 'button') === 'button' ? 'button' : undefined, class: 'zg-press', disabled: p.disabled, 'aria-label': p.label, onClick: p.onClick }, ...children) };
export const IconDef = { render: ({ h, props: p }) => icon(h, p.name || 'circle', { xs: 14, sm: 16, md: 20, lg: 24, xl: 32 }[p.size] || p.size || 20) };
export const PortalDef = { render: ({ props: p, children, portal }) => (portal ? portal(children, p.to) : null) };
export const BottomSheetDef = { render: ({ h, props: p, children, slots }) => !p.open ? null : h('div', { class: 'zg-modal-scrim zg-sheet-scrim', onClick: () => p.onClose && p.onClose() }, h('div', { class: cx('zg-sheet', !p.maxHeight && 'zg-u-mh85'), role: 'dialog', 'aria-modal': 'true', 'aria-label': p.title, ref: trap({ onClose: p.onClose }), style: p.maxHeight ? { maxHeight: sp(p.maxHeight) } : undefined, onClick: e => e.stopPropagation() },
    h('span', { class: 'zg-sheet__grab', 'aria-hidden': 'true' }), p.title ? h('h3', { class: 'zg-sheet__t' }, p.title) : null, h('div', { class: 'zg-sheet__b' }, ...children), (slots.footer || p.footer) ? h('div', { class: 'zg-sheet__f' }, slots.footer || p.footer) : null)) };
