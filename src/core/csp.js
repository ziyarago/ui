// @ziyarago/ui · strict-CSP helpers. A server-rendered style="" attribute is ignored by a policy without style-src-attr 'unsafe-inline',
// so values that come from a finite set are emitted as a class (rules in src/styles/csp.css) and only the rest falls back to inline style.
// Every helper returns [className, styleObject]; continuous percentages go through data-zg-p (see pct) and are set precisely after mount.
const S = a => new Set(a);
const SQ = S([8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 44, 48, 52, 56, 60, 64, 72, 80, 96, 120, 180, 240, 300]), VS = S([20, 22, 24, 26, 28, 30, 32, 34, 36, 38, 40, 42, 44, 46, 48, 52, 56, 60, 64, 72, 80, 96]), FS = S([12, 13, 14, 16, 18, 20, 24, 28, 32, 36, 40]), HH = S([28, 36, 48, 64, 80]), GAP = S([0, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 24, 28, 32, 40, 48]), GMIN = S([160, 180, 200, 220, 240, 260, 280, 300, 320, 360, 400]), AL = S(['start', 'center', 'end', 'stretch', 'baseline', 'flex-start', 'flex-end']), JU = S(['start', 'center', 'end', 'space-between', 'space-around', 'space-evenly', 'flex-start', 'flex-end']);
export const st = (...o) => { const r = Object.assign({}, ...o.filter(Boolean)); for (const k in r) if (r[k] === undefined) delete r[k]; return Object.keys(r).length ? r : undefined; };
/** width + height in px (icons, ring, circular skeleton) */
export const sq = n => SQ.has(n) ? ['zg-sq-' + n] : [undefined, { width: n + 'px', height: n + 'px' }];
/** --s custom property in px (avatar, tiles) */
export const vs = n => VS.has(n) ? ['zg-s-' + n] : [undefined, { '--s': n + 'px' }];
export const fs = n => FS.has(n) ? ['zg-fs-' + n] : [undefined, { fontSize: n + 'px' }];
export const hh = n => HH.has(n) ? ['zg-h-' + n] : [undefined, { height: n + 'px' }];
/** gap of the layout primitives: number or CSS length */
export const gap = v => typeof v === 'number' && GAP.has(v) ? ['zg-g-' + v] : [undefined, { gap: typeof v === 'number' ? v + 'px' : v }];
export const gmin = v => typeof v === 'number' && GMIN.has(v) ? ['zg-gmin-' + v] : [undefined, { '--gmin': typeof v === 'number' ? v + 'px' : v }];
export const alignItems = v => v === undefined || v === null ? [] : AL.has(v) ? ['zg-ai-' + v] : [undefined, { alignItems: v }];
export const justify = v => v === undefined || v === null ? [] : JU.has(v) ? ['zg-jc-' + v] : [undefined, { justifyContent: v }];
export const cols = n => Number.isInteger(n) && n >= 1 && n <= 12 ? ['zg-gc-' + n] : [undefined, { gridTemplateColumns: `repeat(${n}, minmax(0, 1fr))` }];
/** 0..100 value as a rounded data attribute (rule [data-zg-p] sets --zg-p); a fractional value is also applied to the element after mount. */
export const pct = v => { const n = Math.max(0, Math.min(100, Number.isFinite(+v) ? +v : 0)), r = Math.round(n); return { 'data-zg-p': r, ref: el => { if (!el) return; if (n === r) el.style.removeProperty('--zg-p'); else el.style.setProperty('--zg-p', n + '%'); } }; };
export const pd = v => typeof v === 'number' && [0, 4, 8, 12, 16, 20, 24, 32, 40].includes(v) ? ['zg-pd-' + v] : [undefined, { padding: typeof v === 'number' ? v + 'px' : v }];
export const mn = v => [240, 260, 280, 300, 320, 340, 360, 400, 480].includes(v) ? ['zg-pgmin-' + v] : [undefined, { '--min': v + 'px' }];
export const fb = v => [180, 200, 220, 240, 260, 280, 300, 320, 360].includes(v) ? ['zg-fb-' + v] : [undefined, { flexBasis: v + 'px' }];
