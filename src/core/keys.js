// Keyboard helpers shared by the core components. Handlers run in the browser only (SSR renders no events).
const isRtl = el => typeof getComputedStyle === 'function' && getComputedStyle(el).direction === 'rtl';
const live = (root, sel) => [...root.querySelectorAll(sel)].filter(n => !n.disabled && n.getAttribute('aria-disabled') !== 'true');
const mod = e => e.altKey || e.ctrlKey || e.metaKey;

/** Roving tabindex value per item: the active one (or the first enabled when none) is 0, the rest -1. Returns i => 0 | -1. */
export const tabIdx = (items, isOn) => {
  let on = items.findIndex(it => isOn(it) && !it.disabled);
  if (on < 0) on = items.findIndex(it => !it.disabled);
  return i => (i === on ? 0 : -1);
};

const park = (items, n) => { for (const i of items) i.tabIndex = i === n ? 0 : -1; n.focus(); };

/** Tablist / button group: Left/Right (mirrored in RTL, Up/Down when vertical), Home, End. Focus moves, Enter/Space activates. */
export const rove = (sel, o = {}) => e => {
  if (mod(e)) return;
  const root = e.currentTarget, items = live(root, sel), cur = items.indexOf(e.target.closest && e.target.closest(sel));
  if (cur < 0 || !items.length) return;
  const rtl = isRtl(root), fwd = o.vertical ? 'ArrowDown' : rtl ? 'ArrowLeft' : 'ArrowRight', back = o.vertical ? 'ArrowUp' : rtl ? 'ArrowRight' : 'ArrowLeft';
  const n = e.key === fwd ? (cur + 1) % items.length : e.key === back ? (cur - 1 + items.length) % items.length : e.key === 'Home' ? 0 : e.key === 'End' ? items.length - 1 : -1;
  if (n < 0) return;
  e.preventDefault(); park(items, items[n]);
};

/** The element that opened a popup list: the first button or input of the component root that is not inside the list. */
export const trigger = list => { const root = list && list.parentElement; return root && [...root.querySelectorAll('button,input')].find(x => !list.contains(x)); };
/** Call from an item's onClick so focus lands on the trigger instead of being lost when the list unmounts. */
export const toTrigger = e => { const l = e.currentTarget && e.currentTarget.closest && e.currentTarget.closest('[data-zg-dd]'), t = l && trigger(l); if (t) t.focus({ preventScroll: true }); };

/** Popup listbox / menu: Up/Down (menus wrap, listboxes stop at the ends), Home, End, type-ahead, Tab closes. */
export const listKeys = (sel, o = {}) => e => {
  if (mod(e)) return;
  const root = e.currentTarget, items = live(root, sel), cur = items.indexOf(e.target.closest && e.target.closest(sel)), len = items.length;
  if (!len) return;
  if (e.key === 'Tab') { if (o.onTab) o.onTab(e); return; }
  let n = -1;
  if (e.key === 'ArrowDown') n = cur < 0 ? 0 : o.wrap ? (cur + 1) % len : Math.min(cur + 1, len - 1);
  else if (e.key === 'ArrowUp') n = cur < 0 ? len - 1 : o.wrap ? (cur - 1 + len) % len : Math.max(cur - 1, 0);
  else if (e.key === 'Home') n = 0;
  else if (e.key === 'End') n = len - 1;
  else if (e.key.length === 1 && e.key !== ' ') {
    const c = e.key.toLowerCase(), order = [...items.slice(cur + 1), ...items.slice(0, cur + 1)];
    const hit = order.find(i => (i.textContent || '').trim().toLowerCase().startsWith(c));
    if (hit) n = items.indexOf(hit);
  }
  if (n < 0) return;
  e.preventDefault(); park(items, items[n]);
};

/** onKeydown for a popup trigger: ArrowDown / ArrowUp open the closed list. */
export const openKeys = (isOpen, open) => e => { if (!isOpen && !mod(e) && (e.key === 'ArrowDown' || e.key === 'ArrowUp')) { e.preventDefault(); open(); } };

/** Focus the entry point of a freshly opened popup: the item with tabindex 0, else the first one. */
export const focusIn = el => { const t = el.querySelector('[tabindex="0"]') || el.querySelector('button:not([disabled])'); if (t && t.focus) t.focus({ preventScroll: true }); };
