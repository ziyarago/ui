import { inPopOf } from './float.js';
// Shared dialog behaviour: Escape, focus move/trap/restore. Used as a function ref on the dialog element, so
// it runs only in a browser (SSR ignores refs) and listeners exist only while a dialog is mounted.
const reg = new WeakMap(), stack = [], pend = new WeakMap();
// Adapters may call a ref before the element is attached (Transition, detached parents): wait until it is in the document.
const whenConnected = (el, opts, run) => {
  if (el.isConnected) return run(el, opts);
  const w = pend.get(el); if (w) { w.opts = opts; return; }
  const q = { opts }; pend.set(el, q);
  const step = n => { if (el.isConnected) { pend.delete(el); run(el, q.opts); } else if (n < 60) requestAnimationFrame(() => step(n + 1)); else pend.delete(el); };
  queueMicrotask(() => step(0));
};
const SEL = 'a[href],button:not([disabled]),input:not([disabled]):not([type=hidden]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"]),[contenteditable="true"]';
const focusables = el => [...el.querySelectorAll(SEL)].filter(n => n.tabIndex >= 0 && n.getClientRects().length > 0 && !n.closest('[inert]'));
const onKey = e => {
  const r = stack[stack.length - 1]; if (!r) return;
  const o = r.opts;
  if (o.onKey && o.onKey(e) === true) return;
  if (e.key === 'Escape' && !e.defaultPrevented && o.onClose) { e.preventDefault(); o.onClose(e); return; }
  if (e.key !== 'Tab' || o.focus === false) return;
  const list = focusables(r.el), a = document.activeElement;
  if (!list.length) { e.preventDefault(); r.el.focus(); return; }
  const first = list[0], last = list[list.length - 1], inside = (r.el.contains(a) || inPopOf(a, r.el)) && a !== r.el;
  if (e.shiftKey && (!inside || a === first)) { e.preventDefault(); last.focus(); }
  else if (!e.shiftKey && (!inside || a === last)) { e.preventDefault(); first.focus(); }
};
const mount = (el, opts) => {
  let prev = document.activeElement;
  for (const o of [...stack]) if (!o.el.isConnected) { if ((!prev || prev === document.body) && o.prev) prev = o.prev; drop(o, true); }
  const r = { el, opts, prev };
  reg.set(el, r);
  if (opts.mount) r.cleanup = opts.mount(el, () => r.opts);
  if (!stack.length) document.addEventListener('keydown', onKey);
  stack.push(r);
  if (opts.focus !== false) {
    if (!el.hasAttribute('tabindex')) el.setAttribute('tabindex', '-1');
    (el.querySelector('[data-autofocus],[autofocus]') || focusables(el)[0] || el).focus({ preventScroll: true });
  }
};
const drop = (r, silent) => {
  const i = stack.indexOf(r); if (i >= 0) stack.splice(i, 1);
  reg.delete(r.el);
  if (r.cleanup) r.cleanup();
  if (!stack.length) document.removeEventListener('keydown', onKey);
  const p = r.prev;
  const a = document.activeElement;
  if (!silent && r.opts.focus !== false && p && p.isConnected && typeof p.focus === 'function' && (!a || a === document.body || r.el.contains(a))) p.focus({ preventScroll: true });
};
const sweep = () => { for (const r of [...stack]) if (!r.el.isConnected) drop(r); };
// opts: { mount(el, getOpts) -> cleanup fn (runs once per open), onClose, onKey(e) (return true to skip default handling), focus: false to disable focus handling }
export const trap = (opts = {}) => el => {
  if (typeof document === 'undefined') return;
  if (!el) return queueMicrotask(sweep);
  const r = reg.get(el);
  if (r) r.opts = opts; else whenConnected(el, opts, mount);
};

// Lifecycle-only ref (no keys/focus): mount(el, getOpts) runs once when the element appears and returns a cleanup run when it goes away.
const lreg = new Map();
const lsweep = () => { for (const [el, r] of [...lreg]) if (!el.isConnected) { lreg.delete(el); if (r.cleanup) r.cleanup(); } };
export const life = opts => el => {
  if (typeof document === 'undefined') return;
  if (!el) return queueMicrotask(lsweep);
  const r = lreg.get(el);
  if (r) r.opts = opts; else whenConnected(el, opts, (e, o) => { const n = { opts: o }; lreg.set(e, n); if (o.mount) n.cleanup = o.mount(e, () => n.opts); });
};
