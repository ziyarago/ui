import { anchorOf, triggerIn } from './float.js';
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
export const trigger = list => { if (!list) return; const u = list.getAttribute && list.getAttribute('data-zg-for'); return triggerIn(u ? anchorOf(u) : list.parentElement, list); };
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

const pad2 = n => String(n).padStart(2, '0');
/** YYYY-MM-DD of a local date, the value of a day cell's data-date attribute. */
export const dateKey = d => d.getFullYear() + '-' + pad2(d.getMonth() + 1) + '-' + pad2(d.getDate());
/**
 * Month grid of day buttons carrying data-date="YYYY-MM-DD" and a roving tabindex. Put it on the grid element.
 * Arrows move one day (Left/Right mirrored in RTL) or one week, Home/End jump to the start/end of the week, PageUp/PageDown change month (Shift: year).
 * Blocked days are skipped. When the target day is in another month, show(date, key) must make that month visible; the cell is focused once it renders.
 */
export const calKeys = o => e => {
  if (mod(e)) return;
  const root = e.currentTarget, cell = e.target.closest && e.target.closest('[data-date]');
  if (!cell) return;
  const [Y, M, D] = cell.getAttribute('data-date').split('-').map(Number), ws = o.ws ?? 1, rtl = isRtl(root), day = (n) => new Date(Y, M - 1, D + n);
  const month = n => { const f = new Date(Y, M - 1 + n, 1); return new Date(f.getFullYear(), f.getMonth(), Math.min(D, new Date(f.getFullYear(), f.getMonth() + 1, 0).getDate())); };
  const wk = (new Date(Y, M - 1, D).getDay() - ws + 7) % 7;
  let t, unit = 1;
  switch (e.key) {
    case 'ArrowRight': t = day(rtl ? -1 : 1); unit = rtl ? -1 : 1; break;
    case 'ArrowLeft': t = day(rtl ? 1 : -1); unit = rtl ? 1 : -1; break;
    case 'ArrowDown': t = day(7); unit = 7; break;
    case 'ArrowUp': t = day(-7); unit = -7; break;
    case 'Home': t = day(-wk); break;
    case 'End': t = day(6 - wk); unit = -1; break;
    case 'PageUp': t = month(e.shiftKey ? -12 : -1); break;
    case 'PageDown': t = month(e.shiftKey ? 12 : 1); break;
    default: return;
  }
  e.preventDefault();
  for (let i = 0; i < 62 && o.blocked && o.blocked(t); i++) t = new Date(t.getFullYear(), t.getMonth(), t.getDate() + unit);
  if (o.blocked && o.blocked(t)) return;
  const k = dateKey(t), find = () => root.querySelector('[data-date="' + k + '"]:not(:disabled)');
  const el = find();
  if (el) { el.focus(); return; }
  o.show(t, k);
  let n = 0; const tick = () => { const x = find(); if (x) x.focus(); else if (++n < 12) setTimeout(tick, 16); }; setTimeout(tick, 0);
};
