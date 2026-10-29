// Shared popup placement. A popup (select list, menu, calendar, popover) is rendered through the adapter's portal() into <body> and
// positioned with position:fixed from its anchor: flips above when there is no room below, clamped to the viewport, follows the anchor on
// scroll (any scrollable ancestor) and resize, mirrors in RTL. The anchor carries data-zg-anchor="uid", the popup data-zg-for="uid".
const GAP = 6, PAD = 8;

/**
 * Pure placement math. a: anchor rect { left, right, top, bottom }; w, h: natural popup size; vw, vh: viewport size.
 * align 'start' | 'end' is logical: it mirrors when rtl. Returns { left, top, side: 'bottom' | 'top', maxH, maxW } (maxH is null when the popup fits).
 */
export const place = ({ a, w, h, vw, vh, rtl = false, align = 'start', gap = GAP, pad = PAD }) => {
  const below = vh - a.bottom - gap - pad, above = a.top - gap - pad;
  const side = h <= below || below >= above ? 'bottom' : 'top';
  const avail = Math.max(side === 'bottom' ? below : above, 64);
  const maxH = h > avail ? avail : null, hh = maxH ?? h;
  const maxW = Math.max(vw - pad * 2, 0), ww = Math.min(w, maxW);
  let top = side === 'bottom' ? a.bottom + gap : a.top - gap - hh;
  top = Math.max(pad, Math.min(top, vh - hh - pad));
  const startEdge = align === 'end' ? !rtl : rtl;
  let left = startEdge ? a.right - ww : a.left;
  left = Math.max(pad, Math.min(left, vw - ww - pad));
  return { left, top, side, maxH, maxW };
};

export const anchorOf = uid => (uid && typeof document !== 'undefined' ? document.querySelector('[data-zg-anchor="' + uid + '"]') : null);
/** The anchor of the popup element (or of the popup that contains the node), null when the node is not inside a portalled popup. */
export const ownerOf = node => { const p = node && node.closest && node.closest('[data-zg-for]'); return p ? anchorOf(p.getAttribute('data-zg-for')) : null; };
/** True when node is inside a portalled popup that belongs (directly or through nested popups) to an element inside root. */
export const inPopOf = (node, root) => {
  for (let n = node, i = 0; n && i < 8; i++) { const a = ownerOf(n); if (!a) return false; if (root.contains(a)) return true; n = a; }
  return false;
};

const TAB = 'a[href],button:not([disabled]),input:not([disabled]):not([type=hidden]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])';
const clipped = (anchor, r) => {
  const vw = innerWidth, vh = innerHeight;
  if (!r.width && !r.height) return true;
  if (r.bottom < 0 || r.top > vh || r.right < 0 || r.left > vw) return true;
  for (let p = anchor.parentElement; p && p !== document.body && p !== document.documentElement; p = p.parentElement) {
    const cs = getComputedStyle(p);
    if (!/auto|scroll|hidden|clip/.test(cs.overflow + cs.overflowX + cs.overflowY)) continue;
    const b = p.getBoundingClientRect();
    if (r.bottom < b.top || r.top > b.bottom || r.right < b.left || r.left > b.right) return true;
  }
  return false;
};

const recs = new Map();
const sweep = () => { for (const [el, r] of [...recs]) if (!el.isConnected) { r.off(); recs.delete(el); } };
const make = (el, o) => {
  const r = { o };
  // The anchor attribute can land a moment after the popup's own ref ran (Vue runs refs of teleported content first): retry briefly.
  const upd = (n = 0) => {
    const a = anchorOf(r.o.uid);
    if (!el.isConnected) return;
    if (!a) { if (typeof n === 'number' && n < 20) (n ? requestAnimationFrame : queueMicrotask)(() => upd(n + 1)); return; }
    const o = r.o, rect = o.at ? { left: o.at.x, right: o.at.x, top: o.at.y, bottom: o.at.y, width: 0, height: 0 } : a.getBoundingClientRect();
    if (!o.at && clipped(a, rect)) { if (o.close) o.close(); return; }
    const dir = getComputedStyle(a).direction;
    if (el.getAttribute('dir') !== dir) el.setAttribute('dir', dir);
    for (const k of ['theme', 'palette', 'size']) { const s = a.closest('[data-' + k + ']'); if (s && s !== document.documentElement) el.setAttribute('data-' + k, s.getAttribute('data-' + k)); }
    const st = el.style;
    st.left = '0px'; st.top = '0px'; st.maxHeight = ''; st.maxWidth = '';
    st.minWidth = o.match ? Math.round(rect.width) + 'px' : '';
    const w = el.offsetWidth, h = el.offsetHeight;
    const p = place({ a: rect, w, h, vw: document.documentElement.clientWidth, vh: innerHeight, rtl: dir === 'rtl', align: o.align, gap: o.at ? 2 : GAP });
    st.left = Math.round(p.left) + 'px'; st.top = Math.round(p.top) + 'px';
    if (p.maxH != null) { st.maxHeight = Math.floor(p.maxH) + 'px'; st.overflowY = 'auto'; }
    if (w > p.maxW) st.maxWidth = p.maxW + 'px';
    st.transformOrigin = p.side === 'top' ? 'bottom' : 'top';
    el.setAttribute('data-side', p.side); el.setAttribute('data-placed', '');
    if (!r.placed) { r.placed = true; if (r.o.onFirst) r.o.onFirst(el); }
  };
  const onScroll = e => { if (!el.contains(e.target)) upd(); }, onResize = () => upd();
  const onTab = e => {
    if (e.key !== 'Tab' || e.altKey || e.ctrlKey || e.metaKey) return;
    const list = [...el.querySelectorAll(TAB)].filter(n => n.tabIndex >= 0 && n.getClientRects().length), a = document.activeElement;
    const edge = e.shiftKey ? a === list[0] : a === list[list.length - 1];
    if (!list.length || !edge) return;
    const t = triggerIn(anchorOf(r.o.uid), el);
    if (t && !t.disabled) { t.focus({ preventScroll: true }); if (e.shiftKey) e.preventDefault(); }
    if (r.o.close) r.o.close();
  };
  addEventListener('scroll', onScroll, { capture: true, passive: true });
  addEventListener('resize', onResize);
  el.addEventListener('keydown', onTab);
  const ro = typeof ResizeObserver === 'function' ? new ResizeObserver(() => upd()) : null;
  if (ro) ro.observe(el);
  r.upd = upd;
  r.off = () => { removeEventListener('scroll', onScroll, true); removeEventListener('resize', onResize); el.removeEventListener('keydown', onTab); if (ro) ro.disconnect(); };
  return r;
};

/** The element that opened a popup: the marked trigger, else the first button or input of the anchor that is not inside the popup. */
export const triggerIn = (root, list) => root && (root.querySelector('[data-zg-trigger]') || [...root.querySelectorAll('button,input')].find(x => !(list && list.contains(x))));

/**
 * Function ref for a portalled popup element. o: { uid, close, align: 'start' | 'end', match: min-width = anchor width, at: { x, y } fixed point instead of the anchor }.
 * Positions synchronously (before paint), then keeps it attached; the popup closes when its anchor scrolls completely out of view.
 */
export const floatRef = o => el => {
  if (typeof document === 'undefined') return;
  if (!el) return queueMicrotask(sweep);
  const r = recs.get(el);
  if (r) { r.o = o; r.upd(); return; }
  if (!el.isConnected) {
    let n = 0; const step = () => { if (recs.has(el)) return; if (el.isConnected) return floatRef(o)(el); if (++n < 30) requestAnimationFrame(step); };
    return queueMicrotask(step);
  }
  const n = make(el, o); recs.set(el, n); n.upd();
};

/** Attributes for the anchor element (the box the popup is placed against) and for the trigger that controls the popup. Only while open: ids exist on the client only. */
export const anchorAttr = (c, open) => ({ 'data-zg-anchor': open ? c.uid : undefined });
export const ctlAttr = (c, open, id) => ({ 'aria-controls': open ? (id || c.uid + '-p') : undefined });
