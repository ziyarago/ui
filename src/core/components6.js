// @ziyarago/ui · components, part 6 — last catalog gaps: TreeSelect, ContextMenu, Sortable, Map, Screensaver, ImageUpload, Tour.
import { icon, cx, ddRef } from './components.js';
import { listKeys, tabIdx } from './keys.js';
export const more6 = {
  ContextMenu: { state: { x: 0, y: 0, open: false }, render: ({ h, props: p, state, set, children }) => {
    const close = () => set({ open: false });
    return h('div', { class: 'zg-ctx', onContextmenu: e => { e.preventDefault(); set({ open: true, x: e.clientX, y: e.clientY }); } }, ...children,
      state.open ? h('div', { class: 'zg-ctx__scrim', onClick: close, onContextmenu: e => { e.preventDefault(); close(); } }, h('div', { class: 'zg-menu', role: 'menu', 'data-zg-dd': '', ref: ddRef(close, { self: true, focus: true }), onKeydown: listKeys('[role=menuitem]', { wrap: true, onTab: close }), style: { position: 'fixed', left: Math.min(state.x, innerWidth - 240) + 'px', top: Math.min(state.y, innerHeight - (p.items || []).length * 42 - 20) + 'px', insetInlineStart: 'auto' }, onClick: e => e.stopPropagation() }, ...(p.items || []).map((it, i, all) => it.separator ? h('div', { key: i, class: 'zg-menu__sep', role: 'separator' }) : h('button', { key: i, type: 'button', role: 'menuitem', tabIndex: tabIdx(all.map(x => ({ disabled: x.separator || x.disabled })), () => false)(i), class: cx('zg-menu__i', it.tone === 'danger' && 'zg-menu__i--danger'), onClick: () => { close(); p.onSelect && p.onSelect(it.value); } }, it.icon ? icon(h, it.icon, 16) : null, it.label, it.shortcut ? h('span', { class: 'zg-kbd' }, it.shortcut) : null)))) : null); } },
};
