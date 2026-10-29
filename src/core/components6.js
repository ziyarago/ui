// @ziyarago/ui · components, part 6 — last catalog gaps: TreeSelect, ContextMenu, Sortable, Map, Screensaver, ImageUpload, Tour.
import { icon, cx, pop, anchorAttr } from './components.js';
import { listKeys, tabIdx } from './keys.js';
export const more6 = {
  ContextMenu: { state: { x: 0, y: 0, open: false }, render: ({ h, props: p, state, set, children, uid, portal }) => {
    const close = () => set({ open: false }), P = { h, portal, uid };
    return h('div', { class: 'zg-ctx', ...anchorAttr(P, state.open), onContextmenu: e => { e.preventDefault(); set({ open: true, x: e.clientX, y: e.clientY }); } }, ...children,
      state.open ? [portal ? portal(h('div', { key: 'scrim', class: 'zg-ctx__scrim', onClick: close, onContextmenu: e => { e.preventDefault(); close(); } })) : null, pop(P, { key: 'menu', class: 'zg-menu', role: 'menu', close, self: true, focus: true, at: { x: state.x, y: state.y }, onKeydown: listKeys('[role=menuitem]', { wrap: true, onTab: close }), onClick: e => e.stopPropagation() }, ...(p.items || []).map((it, i, all) => it.separator ? h('div', { key: i, class: 'zg-menu__sep', role: 'separator' }) : h('button', { key: i, type: 'button', role: 'menuitem', tabIndex: tabIdx(all.map(x => ({ disabled: x.separator || x.disabled })), () => false)(i), class: cx('zg-menu__i', it.tone === 'danger' && 'zg-menu__i--danger'), onClick: () => { close(); p.onSelect && p.onSelect(it.value); } }, it.icon ? icon(h, it.icon, 16) : null, it.label, it.shortcut ? h('span', { class: 'zg-kbd' }, it.shortcut) : null)))] : null); } },
};
