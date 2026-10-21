// @ziyarago/ui · components, part 7 — gluestack parity: typography, layout primitives, Link, Pressable, Icon, Portal, sheets, ImageViewer, ChatAi, LiquidGlass.
import { t } from '../i18n/index.js';
import { icon, cx } from './components.js';
import { trap } from './dialog.js';
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const sp = v => (typeof v === 'number' ? v + 'px' : v);
const stack = (dir) => ({ render: ({ h, props: p, children }) => h(p.as || 'div', { class: 'zg-stack', style: { flexDirection: dir, gap: sp(p.gap ?? 12), alignItems: p.align, justifyContent: p.justify, flexWrap: p.wrap ? 'wrap' : undefined, ...(p.style || {}) } }, ...children) });

export const more7 = {
  QiblaCompass: { render: ({ h, props: p }) => {
    const px = { xs: 120, sm: 160, md: 200, lg: 250, xl: 300 }[p.size] || (Number(p.size) > 0 ? Number(p.size) : 200), norm = v => ((Number(v) || 0) % 360 + 360) % 360, b = norm(p.bearing), hd = norm(p.heading), deg = Math.round(b), ticks = [];
    for (let i = 0; i < 72; i++) { const major = i % 9 === 0, a = i * 5 * Math.PI / 180, r1 = 92, r2 = major ? 80 : i % 3 ? 87 : 84; ticks.push(h('line', { key: i, class: major ? 'zg-qb__tk zg-qb__tk--m' : 'zg-qb__tk', x1: +(100 + Math.sin(a) * r1).toFixed(2), y1: +(100 - Math.cos(a) * r1).toFixed(2), x2: +(100 + Math.sin(a) * r2).toFixed(2), y2: +(100 - Math.cos(a) * r2).toFixed(2) })); }
    return h('div', { class: 'zg-qb zg-dm', role: 'img', 'aria-label': t('QiblaCompass', 'label', { deg }), style: { width: px + 'px' } },
      h('svg', { class: 'zg-qb__svg', viewBox: '0 0 200 200', 'aria-hidden': 'true', focusable: 'false' },
        h('circle', { class: 'zg-qb__ring', cx: 100, cy: 100, r: 98 }),
        h('g', { class: 'zg-qb__dial', transform: `rotate(${-hd} 100 100)` }, ...ticks, h('path', { class: 'zg-qb__n', d: 'M100 6 L106 20 L94 20 Z' })),
        h('g', { class: 'zg-qb__ptr', transform: `rotate(${b - hd} 100 100)` },
          h('line', { class: 'zg-qb__ln', x1: 100, y1: 100, x2: 100, y2: 46 }),
          h('rect', { class: 'zg-qb__kb', x: 88, y: 24, width: 24, height: 24, rx: 5 }),
          h('rect', { class: 'zg-qb__kg', x: 88, y: 31, width: 24, height: 4 })),
        h('circle', { class: 'zg-qb__hub', cx: 100, cy: 100, r: 5 })),
      h('div', { class: 'zg-qb__txt' }, h('b', { class: 'zg-num' }, deg + '°'), h('span', null, t('QiblaCompass', 'qibla')), p.distance ? h('small', null, p.distance) : null)); } },
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
  LiquidGlass: { render: ({ h, props: p, children }) => h('div', { class: 'zg-liquid', style: { '--zg-liquid-r': sp(p.radius ?? 24), '--zg-liquid-b': sp(p.blur ?? 18) } }, ...children) },
  BottomSheet: { render: ({ h, props: p, children, slots }) => !p.open ? null : h('div', { class: 'zg-modal-scrim zg-sheet-scrim', onClick: p.onClose }, h('div', { class: 'zg-sheet', role: 'dialog', 'aria-modal': 'true', 'aria-label': p.title, ref: trap({ onClose: p.onClose }), style: { maxHeight: sp(p.maxHeight || '85vh') }, onClick: e => e.stopPropagation() },
    h('span', { class: 'zg-sheet__grab', 'aria-hidden': 'true' }), p.title ? h('h3', { class: 'zg-sheet__t' }, p.title) : null, h('div', { class: 'zg-sheet__b' }, ...children), (slots.footer || p.footer) ? h('div', { class: 'zg-sheet__f' }, slots.footer || p.footer) : null)) },
  Actionsheet: { render: ({ C, h, props: p }) => h(C.BottomSheet, { open: p.open, size: p.size, onClose: p.onClose, title: p.title },
    h('div', { class: 'zg-as' }, ...(p.items || []).map((it, i) => h('button', { key: i, type: 'button', class: cx('zg-as__i', it.tone && 'zg-as__i--' + it.tone), disabled: it.disabled, onClick: () => { it.onClick && it.onClick(); p.onSelect && p.onSelect(it); p.onClose && p.onClose(); } }, it.icon ? icon(h, it.icon, 18) : null, h('span', null, it.label)))),
    h('button', { type: 'button', class: 'zg-as__i zg-as__i--cancel', onClick: p.onClose }, p.cancelLabel || t('Actionsheet', 'cancel'))) },
  ImageViewer: { state: { i: null }, render: ({ h, props: p, state, set }) => {
    if (!p.open) return null;
    const im = p.images || [], i = clamp(state.i ?? p.index ?? 0, 0, Math.max(0, im.length - 1)), go = d => set({ i: (i + d + im.length) % im.length });
    return h('div', { class: 'zg-iv', role: 'dialog', 'aria-modal': 'true', 'aria-label': p.alt || t('ImageViewer', 'label'), onClick: p.onClose },
      h('button', { type: 'button', class: 'zg-ibtn zg-ibtn--ghost zg-iv__x', 'aria-label': t('ImageViewer', 'close'), onClick: p.onClose }, icon(h, 'x', 20)),
      im.length > 1 ? h('button', { type: 'button', class: 'zg-ibtn zg-ibtn--ghost zg-iv__p', 'aria-label': t('ImageViewer', 'previous'), onClick: e => { e.stopPropagation(); go(-1); } }, icon(h, 'chevron-left', 22)) : null,
      h('img', { class: 'zg-iv__img', src: im[i], alt: p.alt || '', onClick: e => e.stopPropagation() }),
      im.length > 1 ? h('button', { type: 'button', class: 'zg-ibtn zg-ibtn--ghost zg-iv__n', 'aria-label': t('ImageViewer', 'next'), onClick: e => { e.stopPropagation(); go(1); } }, icon(h, 'chevron-right', 22)) : null,
      h('span', { class: 'zg-badge zg-iv__c' }, `${i + 1} / ${im.length}`)); } },
  ChatAi: { state: { q: '' }, render: ({ h, props: p, state, set }) => {
    const send = () => { const t = state.q.trim(); if (!t || p.loading) return; set({ q: '' }); p.onSend && p.onSend(t); };
    return h('section', { class: 'zg-chat zg-glass', 'aria-label': p.title || t('ChatAi', 'assistant') },
      p.title ? h('div', { class: 'zg-chat__h' }, h('b', null, p.title), p.subtitle ? h('span', { class: 'zg-hint' }, p.subtitle) : null) : null,
      h('div', { class: 'zg-chat__m', role: 'log', 'aria-live': 'polite' }, ...(p.messages || []).map((m, i) => h('div', { key: i, class: cx('zg-chat__b', 'zg-chat__b--' + (m.role === 'user' ? 'user' : 'ai')) }, m.text)), p.loading ? h('div', { class: 'zg-chat__b zg-chat__b--ai zg-chat__dots', 'aria-label': t('ChatAi', 'typing') }, h('i'), h('i'), h('i')) : null),
      h('div', { class: 'zg-chat__f' }, h('input', { class: 'zg-chat__in', value: state.q, placeholder: p.placeholder || t('ChatAi', 'placeholder'), 'aria-label': t('ChatAi', 'message'), onInput: e => set({ q: e.target.value }), onKeydown: e => { if (e.key === 'Enter') { e.preventDefault(); send(); } } }),
        h('button', { type: 'button', class: 'zg-ibtn zg-ibtn--brand', 'aria-label': t('ChatAi', 'send'), disabled: p.loading || !state.q.trim(), onClick: send }, icon(h, 'send', 18)))); } },
};
