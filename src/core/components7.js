// @ziyarago/ui · components, part 7 — gluestack parity: typography, layout primitives, Link, Pressable, Icon, Portal, sheets, ImageViewer, ChatAi, LiquidGlass.
import { icon, cx } from './components.js';
import { trap } from './dialog.js';
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const sp = v => (typeof v === 'number' ? v + 'px' : v);
const stack = (dir) => ({ render: ({ h, props: p, children }) => h(p.as || 'div', { class: 'zg-stack', style: { flexDirection: dir, gap: sp(p.gap ?? 12), alignItems: p.align, justifyContent: p.justify, flexWrap: p.wrap ? 'wrap' : undefined, ...(p.style || {}) } }, ...children) });

export const more7 = {
  Heading: { render: ({ h, props: p, children }) => h('h' + clamp(p.level || 2, 1, 6), { class: cx('zg-heading', 'zg-heading--' + (p.size || 'lg'), p.brand && 'zg-heading--brand') }, ...children) },
  Text: { render: ({ h, props: p, children }) => h(p.as || 'p', { class: cx('zg-text', 'zg-text--' + (p.size || 'md'), p.tone && 'zg-text--' + p.tone, p.bold && 'zg-text--bold', p.truncate && 'zg-text--truncate') }, ...children) },
  Box: { render: ({ h, props: p, children }) => h(p.as || 'div', { class: cx('zg-box', p.glass && 'zg-glass'), style: { padding: sp(p.p), ...(p.style || {}) } }, ...children) },
  Center: { render: ({ h, props: p, children }) => h(p.as || 'div', { class: 'zg-center', style: p.style }, ...children) },
  HStack: stack('row'),
  VStack: stack('column'),
  Grid: { render: ({ h, props: p, children }) => h(p.as || 'div', { class: 'zg-grid', style: { gap: sp(p.gap ?? 16), gridTemplateColumns: p.cols ? `repeat(${p.cols}, minmax(0, 1fr))` : `repeat(auto-fit, minmax(${sp(p.min || 240)}, 1fr))`, ...(p.style || {}) } }, ...children) },
  Link: { render: ({ h, props: p, children }) => h('a', { class: cx('zg-link', p.plain && 'zg-link--plain'), href: p.href || '#', target: p.external ? '_blank' : undefined, rel: p.external ? 'noopener noreferrer' : undefined, onClick: p.onClick }, ...children, p.external ? icon(h, 'external-link', 12) : null) },
  Pressable: { render: ({ h, props: p, children }) => h(p.as || 'button', { type: (p.as || 'button') === 'button' ? 'button' : undefined, class: 'zg-press', disabled: p.disabled, 'aria-label': p.label, onClick: p.onClick }, ...children) },
  Icon: { render: ({ h, props: p }) => icon(h, p.name || 'circle', { xs: 14, sm: 16, md: 20, lg: 24, xl: 32 }[p.size] || p.size || 20) },
  Portal: { render: ({ props: p, children, portal }) => (portal ? portal(children, p.to) : null) },
  BottomSheet: { render: ({ h, props: p, children, slots }) => !p.open ? null : h('div', { class: 'zg-modal-scrim zg-sheet-scrim', onClick: () => p.onClose && p.onClose() }, h('div', { class: 'zg-sheet', role: 'dialog', 'aria-modal': 'true', 'aria-label': p.title, ref: trap({ onClose: p.onClose }), style: { maxHeight: sp(p.maxHeight || '85vh') }, onClick: e => e.stopPropagation() },
    h('span', { class: 'zg-sheet__grab', 'aria-hidden': 'true' }), p.title ? h('h3', { class: 'zg-sheet__t' }, p.title) : null, h('div', { class: 'zg-sheet__b' }, ...children), (slots.footer || p.footer) ? h('div', { class: 'zg-sheet__f' }, slots.footer || p.footer) : null)) },
};
