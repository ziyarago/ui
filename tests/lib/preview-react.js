// React port of the docs preview: same variant -> render mapping as preview-vue.js, with modelValue/value/index + onChange state.
import React, { createElement as h, Fragment, useState } from 'react';
import * as UI from '../../src/react/index.js';
import { revive, record } from './spy.js';

const build = (c, key) => {
  const comp = /^[a-z]/.test(c.name) ? c.name : UI['Ui' + c.name];
  if (!comp) throw new Error('Unknown component in example tree: ' + c.name);
  const kids = [...(c.text ? [c.text] : []), ...(c.children ?? []).map((x, i) => build(x, i))];
  return h(comp, { key, ...(c.props ?? {}) }, ...kids);
};
const slotNode = (t) => (typeof t === 'string' ? t : h(Fragment, null, ...t.map((x, i) => build(x, i))));

export function Preview({ name, variant: v, open: initOpen = false }) {
  const [models, setModels] = useState({});
  const [open, setOpen] = useState(initOpen);
  const comp = UI['Ui' + name];
  if (!comp) throw new Error('No React component Ui' + name);
  const setM = (k, val) => { record('model', val); setModels(m => ({ ...m, [k]: val })); };
  const get = (k, init) => (k in models ? models[k] : init);
  const items = v.items?.length ? v.items : [v];
  const els = items.map((it, i) => {
    const p = revive({ ...(it.props ?? {}) });
    if ('modelValue' in p) { p.modelValue = get(i, p.modelValue); p.onChange = x => setM(i, x); }
    if ('value' in p) { const k = 'v' + i; p.value = get(k, p.value); p.onChange = x => setM(k, x); }
    if ('page' in p) { const k = 'p' + i; p.page = get(k, p.page); p.onChange = x => setM(k, x); }
    if ('index' in p) { const k = 'i' + i; p.index = get(k, p.index); p.onChange = x => setM(k, x); }
    if (name === 'PipelineBoard' && Array.isArray(p.stages)) {
      const k = 's' + i;
      const cur = get(k, p.stages);
      p.stages = cur;
      p.onMove = ({ id, from, to }) => {
        const next = cur.map(s => ({ ...s, cards: [...(s.cards ?? [])] }));
        const src = next.find(s => s.id === from), dst = next.find(s => s.id === to);
        const at = src ? src.cards.findIndex((c, n) => (c.id ?? n) === id) : -1;
        if (src && dst && at >= 0) dst.cards.push(src.cards.splice(at, 1)[0]);
        setM(k, next);
      };
    }
    if (v.overlay) { p.open = open; p.onClose = () => setOpen(false); if (name === 'ConfirmDialog') p.onCancel = p.onClose; }
    for (const [k, t] of Object.entries(it.slots ?? {})) p[k] = slotNode(t);
    const kids = [...(it.text ? [it.text] : []), ...(it.children ?? []).map((x, k) => build(x, k))];
    return h(comp, { key: i, ...p }, ...kids);
  });
  const body = v.overlay ? [h(UI.UiButton, { key: 'open', variant: 'primary', onClick: () => setOpen(true) }, 'Open'), ...els] : els;
  return h('div', { className: 'doc-preview', style: v.width ? { width: '100%', maxWidth: v.width, flexDirection: 'column', alignItems: 'stretch' } : undefined }, ...body);
}
export { UI };
