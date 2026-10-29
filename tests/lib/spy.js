// Interaction tests describe callbacks in JSON as "$spy:<label>"; they become functions that record their arguments on window.__zgSpy.
const ser = (a, d = 0) => {
  if (d > 4 || (typeof Node !== 'undefined' && a instanceof Node) || (a && typeof a === 'object' && ('nativeEvent' in a || (typeof Event !== 'undefined' && a instanceof Event)))) return '[event]';
  if (a instanceof Date) return 'date:' + a.getFullYear() + '-' + String(a.getMonth() + 1).padStart(2, '0') + '-' + String(a.getDate()).padStart(2, '0');
  if (Array.isArray(a)) return a.map(x => ser(x, d + 1));
  if (a && typeof a === 'object') { const o = {}; for (const k of Object.keys(a)) if (typeof a[k] !== 'function') o[k] = ser(a[k], d + 1); return o; }
  return a;
};
export const record = (label, ...args) => {
  if (typeof window === 'undefined') return;
  (window.__zgSpy || (window.__zgSpy = [])).push({ label, args: args.map(ser) });
};
export const revive = v => {
  if (typeof v === 'string' && v.startsWith('$spy:')) { const label = v.slice(5); return (...a) => record(label, ...a); }
  if (Array.isArray(v)) return v.map(revive);
  if (v && typeof v === 'object') { const o = {}; for (const k of Object.keys(v)) o[k] = revive(v[k]); return o; }
  return v;
};
