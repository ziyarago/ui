// In-page oracles. `audit` is serialised by puppeteer and runs in the browser, so it must stay self-contained.
// cfg: { mode: 'variants' | 'portal', component?: string, minTarget: number, focus: boolean }
// Returns { findings, samples } where samples are text/graphics sitting on a gradient or image that need a screenshot to judge.

export function audit(cfg) {
  const findings = [];
  const samples = [];
  const CAP = 6;
  const counts = new Map();
  const INTERACTIVE = 'button, a[href], input:not([type=hidden]), select, textarea, summary, [tabindex]:not([tabindex="-1"]), [role=button], [role=tab], [role=menuitem], [role=option], [role=switch], [role=checkbox], [role=radio], [role=link], [role=slider]';

  const cv = document.createElement('canvas'); cv.width = 1; cv.height = 1;
  const ctx = cv.getContext('2d', { willReadFrequently: true });
  const flatten = (layers, base, extraAlpha) => {
    ctx.globalAlpha = 1; ctx.fillStyle = base; ctx.fillRect(0, 0, 1, 1);
    for (const l of layers) { ctx.globalAlpha = l.alpha === undefined ? 1 : l.alpha; ctx.fillStyle = '#000'; ctx.fillStyle = l.color; ctx.fillRect(0, 0, 1, 1); }
    ctx.globalAlpha = 1;
    const d = ctx.getImageData(0, 0, 1, 1).data; return [d[0], d[1], d[2]];
  };
  const lum = ([r, g, b]) => { const f = v => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); }; return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b); };
  const ratio = (a, b) => { const x = lum(a), y = lum(b); return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05); };
  const alphaOf = s => { const m = /\/\s*([\d.]+)(%?)\s*\)\s*$/.exec(s) || /^rgba\([^)]*,\s*([\d.]+)\s*\)$/.exec(s); if (!m) return /^(transparent)$/.test(s) ? 0 : 1; return m[2] ? +m[1] / 100 : +m[1]; };

  const baseStr = (() => {
    for (const e of [document.body, document.documentElement]) { const c = getComputedStyle(e).backgroundColor; if (alphaOf(c) >= 0.99) return c; }
    return document.documentElement.dataset.theme === 'light' ? '#ffffff' : '#000000';
  })();

  const csCache = new Map();
  const cs = el => { let c = csCache.get(el); if (!c) { c = getComputedStyle(el); csCache.set(el, c); } return c; };
  const rectOf = el => el.getBoundingClientRect();
  const visible = el => {
    const s = cs(el);
    if (s.display === 'none' || s.visibility !== 'visible' || +s.opacity === 0) return false;
    const r = rectOf(el);
    return r.width > 1 && r.height > 1;
  };
  const effOpacity = el => { let o = 1; for (let e = el; e && e !== document.documentElement; e = e.parentElement) o *= +cs(e).opacity; return o; };
  const desc = el => {
    const cls = typeof el.className === 'string' ? el.className.split(/\s+/).filter(Boolean).slice(0, 2).join('.') : '';
    const t = (el.textContent || '').replace(/\s+/g, ' ').trim().slice(0, 28);
    return el.tagName.toLowerCase() + (cls ? '.' + cls : '') + (t ? ` "${t}"` : '');
  };
  const sizeOf = r => ({ x: Math.round(r.left + scrollX), y: Math.round(r.top + scrollY), w: Math.round(r.width), h: Math.round(r.height) });

  let ctxInfo = null;
  const add = (o, el, detail, key) => {
    const k = ctxInfo.c + '|' + ctxInfo.v + '|' + o;
    const n = counts.get(k) || 0;
    if (n >= CAP) return;
    const dk = k + '|' + (key || desc(el));
    if (counts.has(dk)) return;
    counts.set(dk, 1); counts.set(k, n + 1);
    findings.push({ c: ctxInfo.c, v: ctxInfo.v, label: ctxInfo.label, o, d: detail, el: desc(el), r: sizeOf(rectOf(el)) });
  };

  const scrollParentClips = (el, stopAt) => {
    for (let p = el.parentElement; p && p !== document.body && p !== document.documentElement; p = p.parentElement) {
      const s = cs(p);
      if (/(auto|scroll|hidden|clip)/.test(s.overflowX)) return p;
      if (p === stopAt) break;
    }
    return null;
  };

  const bgOf = el => {
    const layers = []; let unresolved = false;
    for (let e = el; e; e = e.parentElement) {
      const s = cs(e);
      if (/gradient|url\(/.test(s.backgroundImage)) { unresolved = true; break; }
      const a = alphaOf(s.backgroundColor);
      if (a > 0.001) { layers.push({ color: s.backgroundColor, alpha: 1 }); if (a >= 0.999) break; }
    }
    if (!unresolved && !layers.length) for (const e of [document.body, document.documentElement]) if (cs(e).backgroundImage !== 'none') unresolved = true;
    layers.reverse();
    return { layers, unresolved };
  };

  const hasOwnText = el => { for (const n of el.childNodes) if (n.nodeType === 3 && n.nodeValue.trim()) return true; return false; };
  const isDisabled = el => !!el.closest('[disabled],[aria-disabled="true"],.is-disabled,[data-disabled]');
  const inSvg = el => !!el.closest('svg') && el.tagName.toLowerCase() !== 'svg';

  const scan = (root, info) => {
    ctxInfo = info;
    const all = [root, ...root.querySelectorAll('*')].slice(0, 4000);
    const vw = document.documentElement.clientWidth;
    const ids = new Map();
    let flaggedOverflow = false;

    for (const el of all) {
      if (el.closest('svg') && el.tagName.toLowerCase() !== 'svg') continue;
      const tag = el.tagName.toLowerCase();
      if (/^(script|style|template|option|source|meta|link|head|title|noscript|defs)$/.test(tag)) continue;
      const s = cs(el);
      if (s.display === 'contents') continue;
      if (el.id) ids.set(el.id, (ids.get(el.id) || 0) + 1);
      const r = rectOf(el);
      const vis = visible(el);

      // zero-size: has content or is interactive yet collapsed
      if (s.display !== 'none' && s.visibility === 'visible' && +s.opacity > 0 && (r.width === 0 || r.height === 0) && s.position !== 'absolute' && s.position !== 'fixed' && !el.closest('[aria-hidden="true"]')) {
        const content = hasOwnText(el) || el.matches(INTERACTIVE) || tag === 'img' || tag === 'svg' || tag === 'canvas';
        if (content && !(s.display === 'inline' && r.width === 0 && !hasOwnText(el))) add('zero-size', el, `${Math.round(r.width)}x${Math.round(r.height)}`);
      }
      if (!vis) continue;

      // horizontal overflow of the viewport, not clipped or scrolled by an ancestor
      if ((r.right > vw + 1 || r.left < -1) && s.position !== 'fixed' && !scrollParentClips(el, root) && !flaggedOverflow) {
        flaggedOverflow = true;
        add('overflow-viewport', el, `left ${Math.round(r.left)} right ${Math.round(r.right)} of ${vw}`);
      }
      // child sticks out of its (non-scrolling) parent
      const p = el.parentElement;
      if (p && p !== root.parentElement && s.position !== 'absolute' && s.position !== 'fixed' && s.position !== 'sticky') {
        const ps = cs(p);
        if (ps.display !== 'contents' && ps.display !== 'inline' && ps.overflowX === 'visible') {
          const pr = rectOf(p);
          if (pr.width > 0 && (r.right > pr.right + 2 || r.left < pr.left - 2) && (hasOwnText(el) || el.matches(INTERACTIVE)) && !inSvg(el) && !(r.width > 0 && (r.right < pr.left || r.left > pr.right))) {
            add('overflow-container', el, `child ${Math.round(r.left)}..${Math.round(r.right)} parent ${Math.round(pr.left)}..${Math.round(pr.right)}`);
          }
        }
      }

      // clipped text
      if (hasOwnText(el)) {
        const lineClamp = s.webkitLineClamp && s.webkitLineClamp !== 'none';
        if (/(hidden|clip)/.test(s.overflowX) && s.textOverflow !== 'ellipsis' && !lineClamp && el.scrollWidth > el.clientWidth + 1 && el.clientWidth > 0) add('text-clipped', el, `scrollWidth ${el.scrollWidth} > ${el.clientWidth}, no ellipsis`);
        if (/(hidden|clip)/.test(s.overflowY) && !lineClamp && el.scrollHeight > el.clientHeight + 2 && el.clientHeight > 0 && s.display !== 'inline') add('text-clipped', el, `scrollHeight ${el.scrollHeight} > ${el.clientHeight}`);
        // an ancestor with overflow hidden cuts the text
        let anc = el.parentElement, depth = 0, okEllipsis = s.textOverflow === 'ellipsis' || lineClamp;
        while (anc && depth < 6 && anc !== document.body) {
          const as = cs(anc);
          if (as.textOverflow === 'ellipsis' || (as.webkitLineClamp && as.webkitLineClamp !== 'none')) { okEllipsis = true; break; }
          if (/(hidden|clip)/.test(as.overflowX + as.overflowY) && !okEllipsis) {
            const ar = rectOf(anc);
            const cutX = /(hidden|clip)/.test(as.overflowX) && (r.right > ar.right + 2 || r.left < ar.left - 2) && ar.width > 0;
            const cutY = /(hidden|clip)/.test(as.overflowY) && (r.bottom > ar.bottom + 2 || r.top < ar.top - 2) && ar.height > 0;
            if ((cutX || cutY) && !(r.right < ar.left || r.left > ar.right || r.bottom < ar.top || r.top > ar.bottom)) { add('text-clipped', el, `cut by ancestor ${desc(anc)}`); break; }
          }
          anc = anc.parentElement; depth++;
        }
      }

      // squeezed: flex item smaller than its content
      if (p && el !== root) {
        const ps = cs(p);
        if (/flex/.test(ps.display) && s.flexShrink !== '0' && s.position !== 'absolute') {
          const col = ps.flexDirection.startsWith('column');
          if (col && /visible|hidden/.test(s.overflowY) && el.scrollHeight > el.clientHeight + 2 && el.clientHeight > 0 && !/(auto|scroll)/.test(s.overflowY)) add('squeezed', el, `height ${el.clientHeight} < content ${el.scrollHeight}`);
        }
        const lh = parseFloat(s.lineHeight);
        if (hasOwnText(el) && lh > 0 && r.height > 0 && r.height < lh * 0.9 && /flex|block|grid|inline-block/.test(s.display)) add('squeezed', el, `height ${Math.round(r.height)} < line ${Math.round(lh)}`);
      }

      // colour contrast of text
      if (hasOwnText(el) && !isDisabled(el) && !inSvg(el) && !/^(input|select|textarea)$/.test(tag)) {
        const fs = parseFloat(s.fontSize), fw = +s.fontWeight || 400;
        const large = fs >= 24 || (fs >= 18.66 && fw >= 700);
        const need = large ? 3 : 4.5;
        const { layers, unresolved } = bgOf(el);
        const op = effOpacity(el);
        if (unresolved) {
          if (samples.length < 400) { const id = samples.length; samples.push({ id, c: info.c, v: info.v, label: info.label, fg: s.color, op, need, r: sizeOf(r), el: desc(el), kind: 'text' }); }
        } else {
          const bg = flatten(layers, baseStr);
          const fg = flatten([...layers, { color: s.color, alpha: op }], baseStr);
          const cr = ratio(fg, bg);
          if (cr < need - 0.01) add('contrast-text', el, `${cr.toFixed(2)} < ${need} (${s.color} on rgb(${bg}))`);
        }
      }
      // svg graphics (icons)
      if (tag === 'svg') {
        if (!isDisabled(el) && r.width >= 8) {
          const stroke = s.stroke, fill = s.fill;
          const paint = (stroke && stroke !== 'none' ? stroke : fill && fill !== 'none' ? fill : null);
          if (paint) {
            const { layers, unresolved } = bgOf(el);
            const op = effOpacity(el);
            if (unresolved) { if (samples.length < 400) { const id = samples.length; samples.push({ id, c: info.c, v: info.v, label: info.label, fg: paint, op, need: 3, r: sizeOf(r), el: desc(el), kind: 'icon' }); } }
            else {
              const bg = flatten(layers, baseStr);
              const fg = flatten([...layers, { color: paint, alpha: op }], baseStr);
              const cr = ratio(fg, bg);
              if (cr < 3 - 0.01) add('contrast-graphic', el, `${cr.toFixed(2)} < 3 (${paint} on rgb(${bg}))`);
            }
          }
        }
      }
      // gradient patterns (stripes) must be distinguishable from their base
      if (/gradient/.test(s.backgroundImage) && r.width >= 8 && r.height >= 4) {
        const stops = (s.backgroundImage.match(/(rgba?\([^)]*\)|oklch\([^)]*\)|oklab\([^)]*\)|lab\([^)]*\)|lch\([^)]*\)|color\([^)]*\))/g) || []);
        if (stops.length >= 2) {
          const { layers } = bgOf(el.parentElement || el);
          const under = [...layers];
          if (alphaOf(s.backgroundColor) > 0.001) under.push({ color: s.backgroundColor, alpha: 1 });
          const flat = stops.map(c => flatten([...under, { color: c, alpha: 1 }], baseStr));
          let max = 1; for (let i = 0; i < flat.length; i++) for (let j = i + 1; j < flat.length; j++) max = Math.max(max, ratio(flat[i], flat[j]));
          if (/repeating/.test(s.backgroundImage) && max < 1.15) add('contrast-graphic', el, `repeating gradient stops differ by ${max.toFixed(2)} (<1.15), invisible pattern`);
        }
      }

      // directional icons must point the right way for the current direction (previous/back = start side, next/forward = end side)
      if (el.dataset && el.dataset.zgIcon && /(left|right)$/.test(el.dataset.zgIcon)) {
        const btn = el.closest('button, a, [role=button]');
        const label = btn ? ((btn.getAttribute('aria-label') || btn.getAttribute('title') || '') + ' ' + (btn.textContent || '')).toLowerCase() : '';
        const prev = /\b(prev|previous|back|earlier|older)\b/.test(label), next = /\b(next|forward|later|newer)\b/.test(label);
        if (prev !== next) {
          let mirrored = false;
          for (let e = el, i = 0; e && i < 4; e = e.parentElement, i++) { const t = cs(e).transform; const m = /^matrix\(([-\d.e]+),/.exec(t); if (m && +m[1] < 0) mirrored = !mirrored; }
          const rtl = getComputedStyle(el).direction === 'rtl';
          const visual = (/left$/.test(el.dataset.zgIcon) ? -1 : 1) * (mirrored ? -1 : 1);
          const want = (prev ? -1 : 1) * (rtl ? -1 : 1);
          if (visual !== want) add('rtl-icon-direction', el, `${el.dataset.zgIcon} points ${visual < 0 ? 'left' : 'right'} but ${prev ? 'previous' : 'next'} should point ${want < 0 ? 'left' : 'right'} in ${rtl ? 'rtl' : 'ltr'}`);
        }
      }

      // interactive elements
      if (el.matches(INTERACTIVE) && !isDisabled(el)) {
        // target size
        let tr = r;
        if (+s.opacity === 0 || (r.width <= 2 && r.height <= 2)) { const l = el.closest('label'); if (l) tr = rectOf(l); }
        if (tag === 'input' && (el.type === 'checkbox' || el.type === 'radio')) { const l = el.closest('label'); if (l && rectOf(l).width > tr.width) tr = rectOf(l); }
        const inlineLink = tag === 'a' && s.display === 'inline';
        if (!inlineLink && (tr.width < cfg.minTarget || tr.height < cfg.minTarget) && tr.width > 0) add('target-size', el, `${Math.round(tr.width)}x${Math.round(tr.height)} < ${cfg.minTarget}`);
        // tab order
        const ti = el.getAttribute('tabindex');
        if (ti && +ti > 0) add('tab-order', el, `positive tabindex ${ti}`);
        if (el.closest('[aria-hidden="true"]') && (ti === null || +ti >= 0) && !el.closest('[inert]')) add('tab-order', el, 'focusable inside aria-hidden');
      }
    }
    for (const [id, n] of ids) if (n > 1) findings.push({ c: info.c, v: info.v, label: info.label, o: 'duplicate-id', d: `#${id} x${n}`, el: '#' + id, r: sizeOf(rectOf(root)) });
    if (root.scrollWidth > root.clientWidth + 1 && root.clientWidth > 0 && /(visible)/.test(cs(root).overflowX)) add('overflow-container', root, `preview wider than its box: ${root.scrollWidth} > ${root.clientWidth}`);
  };

  const focusRing = (root, info) => {
    ctxInfo = info;
    const els = [...root.querySelectorAll(INTERACTIVE)].filter(e => visible(e) || (e.closest('label') && visible(e.closest('label')))).filter(e => !isDisabled(e)).slice(0, 25);
    const props = ['outlineStyle', 'outlineWidth', 'outlineColor', 'boxShadow', 'borderColor', 'backgroundColor', 'filter', 'textDecorationLine'];
    const snap = scope => [scope, ...scope.querySelectorAll('*')].slice(0, 60).map(e => { const s = getComputedStyle(e); return props.map(p => s[p]).join('|'); });
    for (const el of els) {
      const scope = el.closest('label') || el.parentElement || el;
      const before = snap(scope);
      el.focus({ preventScroll: true });
      if (document.activeElement !== el) continue;
      const after = snap(scope);
      const own = getComputedStyle(el);
      const ring = (own.outlineStyle !== 'none' && parseFloat(own.outlineWidth) > 0);
      const changed = before.some((b, i) => b !== after[i]);
      el.blur();
      if (!ring && !changed) add('focus-ring', el, 'focus changes no outline, shadow, border or background');
    }
  };

  const nameOf = el => { const sec = el.closest('[data-component]'); return sec ? sec.getAttribute('data-component') : '?'; };

  if (cfg.mode === 'variants') {
    for (const box of [...document.querySelectorAll('[data-variant]')].slice(cfg.from || 0, cfg.to === undefined ? undefined : cfg.to)) {
      const root = box.querySelector('.doc-preview') || box;
      const info = { c: nameOf(box), v: +box.dataset.variant, label: box.dataset.label };
      if (box.hasAttribute('data-error')) continue;
      scan(root, info);
      if (cfg.focus) focusRing(root, info);
    }
  } else {
    const nodes = [...document.body.children].filter(e => e.id !== 'root' && !/^(script|style)$/i.test(e.tagName));
    const info = { c: cfg.component, v: -1, label: 'open overlay' };
    for (const n of nodes) { scan(n, info); if (cfg.focus) focusRing(n, info); }
  }
  return { findings, samples };
}

/** Second pass: sample the real pixels behind text/icons that sit on a gradient or image. Runs in the page with the PNG of the region. */
export async function judgeSamples(b64, clip, items) {
  const bmp = await createImageBitmap(await (await fetch('data:image/png;base64,' + b64)).blob());
  const cv = document.createElement('canvas'); cv.width = bmp.width; cv.height = bmp.height;
  const g = cv.getContext('2d', { willReadFrequently: true }); g.drawImage(bmp, 0, 0);
  const sx = bmp.width / clip.w;
  const px = (x, y) => { const d = g.getImageData(Math.max(0, Math.min(bmp.width - 1, Math.round(x))), Math.max(0, Math.min(bmp.height - 1, Math.round(y))), 1, 1).data; return [d[0], d[1], d[2]]; };
  const lum = ([r, gg, b]) => { const f = v => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); }; return 0.2126 * f(r) + 0.7152 * f(gg) + 0.0722 * f(b); };
  const c1 = document.createElement('canvas'); c1.width = c1.height = 1; const x1 = c1.getContext('2d', { willReadFrequently: true });
  const fgOver = (color, op, bg) => { x1.globalAlpha = 1; x1.fillStyle = `rgb(${bg})`; x1.fillRect(0, 0, 1, 1); x1.globalAlpha = op; x1.fillStyle = '#000'; x1.fillStyle = color; x1.fillRect(0, 0, 1, 1); x1.globalAlpha = 1; const d = x1.getImageData(0, 0, 1, 1).data; return [d[0], d[1], d[2]]; };
  const out = [];
  for (const it of items) {
    const rs = [];
    for (let i = 0; i < 3; i++) for (let j = 0; j < 3; j++) {
      const x = (it.r.x - clip.x + it.r.w * (0.1 + 0.4 * i)) * sx, y = (it.r.y - clip.y + it.r.h * (0.15 + 0.35 * j)) * sx;
      const bg = px(x, y); const fg = fgOver(it.fg, it.op, bg);
      const a = lum(fg), b = lum(bg); rs.push((Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05));
    }
    rs.sort((a, b) => a - b);
    const med = rs[4];
    out.push({ id: it.id, ratio: +med.toFixed(2), bad: med < it.need - 0.01 });
  }
  return out;
}

/** axe over the whole document, mapped back to component and variant. */
export function runAxe(opts) {
  return axe.run(document, { runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa', 'best-practice'] }, rules: Object.fromEntries(opts.off.map(id => [id, { enabled: false }])), resultTypes: ['violations'] }).then(res => {
    const out = [];
    for (const v of res.violations) for (const n of v.nodes) {
      const el = document.querySelector(n.target[n.target.length - 1]);
      const box = el && el.closest('[data-variant]');
      const sec = el && el.closest('[data-component]');
      out.push({ rule: v.id, impact: v.impact, c: sec ? sec.getAttribute('data-component') : opts.component || '?', v: box ? +box.dataset.variant : -1, target: n.target.join(' ').slice(0, 160), msg: ((n.any[0] || n.all[0] || n.none[0] || {}).message || v.help).slice(0, 200) });
    }
    return out;
  });
}
