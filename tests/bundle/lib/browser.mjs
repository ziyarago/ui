// One page load of a consumer app in headless Chrome with everything a production emulation needs recorded.
import puppeteer from 'puppeteer-core';
import { existsSync } from 'node:fs';

export const chromePath = () => {
  const c = [process.env.CHROME_PATH, '/usr/bin/google-chrome', '/usr/bin/google-chrome-stable', '/usr/bin/chromium', '/usr/bin/chromium-browser', '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'].filter(Boolean);
  const p = c.find(existsSync);
  if (!p) throw new Error('Chrome not found; set CHROME_PATH');
  return p;
};

export const launch = () => puppeteer.launch({
  executablePath: chromePath(), headless: true,
  args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage', '--disable-gpu', '--force-prefers-reduced-motion=0'],
});

/** Runs inside the page after the app reports done. `input` is JSON: { strings, backdrop, locale }. */
function inPage(input) {
  const out = {};
  const z = window.__zg || {};
  const hash = s => { let x = 0; for (let i = 0; i < s.length; i++) x = (x * 31 + s.charCodeAt(i)) | 0; return x + ':' + s.length; };
  const fp = {};
  for (const [k, v] of Object.entries(z.fingerprints || {})) fp[k] = [hash(v), v.slice(0, 160)];
  out.zg = { errors: z.errors || [], mounted: z.mounted, expected: z.expected, fingerprints: fp };
  out.csp = window.__csp || [];
  out.html = { dir: document.documentElement.dir, lang: document.documentElement.lang, theme: document.documentElement.dataset.theme, fx: document.documentElement.dataset.fx };

  // icons
  const icons = {};
  for (const el of document.querySelectorAll('[data-zg-icon]')) {
    const n = el.getAttribute('data-zg-icon');
    const has = !!getComputedStyle(el).getPropertyValue('--zg-icon').trim();
    const e = icons[n] || (icons[n] = { ok: 0, missing: 0, in: new Set() });
    e[has ? 'ok' : 'missing']++;
    if (!has) { const sec = el.closest('[data-component]'); if (sec) e.in.add(sec.getAttribute('data-component')); }
  }
  out.icons = Object.fromEntries(Object.entries(icons).map(([k, v]) => [k, { ok: v.ok, missing: v.missing, in: [...v.in].slice(0, 6) }]));

  // fonts
  out.fonts = [...document.fonts].map(f => ({ family: f.family.replace(/["']/g, ''), status: f.status, weight: f.weight, style: f.style }));
  const cs = el => (el ? getComputedStyle(el).fontFamily : null);
  out.fontFamily = { body: cs(document.body), btn: cs(document.querySelector('.zg-btn')), mono: cs(document.querySelector('.zg-code, code, pre')) };

  // built-in strings
  const bad = [];
  if (typeof window.__zgT === 'function') {
    for (const [c, k, want] of input.strings) {
      let got; try { got = window.__zgT(c, k); } catch (e) { got = 'THROW ' + e.message; }
      if (got !== want) bad.push([c, k, want, got]);
    }
  } else if (input.strings.length) bad.push(['(page)', '__zgT', 'function', 'missing']);
  out.stringMismatch = bad.slice(0, 80);
  out.stringMismatchCount = bad.length;
  const keyed = new Map(input.keyed);
  const leaks = [];
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  let node;
  while ((node = walker.nextNode())) {
    const tx = node.nodeValue.trim();
    if (!tx || tx.length > 60) continue;
    const par = node.parentElement;
    if (!par || /^(SCRIPT|STYLE|H2)$/.test(par.tagName)) continue;
    let hit = null;
    if (/^[A-Z][A-Za-z]+\.[a-z][A-Za-z0-9]*$/.test(tx) && input.components.includes(tx.split('.')[0])) hit = 'dotted key';
    else if (keyed.has(tx)) hit = 'raw key (expected "' + keyed.get(tx) + '")';
    if (hit) { const sec = par.closest('[data-component]'); leaks.push({ text: tx, kind: hit, component: sec ? sec.getAttribute('data-component') : null }); }
  }
  out.leaks = leaks.slice(0, 60);

  // backdrop-filter in Chrome (survives minification only if it is really applied)
  const bd = {};
  for (const sel of input.backdrop) {
    let list; try { list = document.querySelectorAll(sel); } catch { continue; }
    if (!list.length) continue;
    let none = 0;
    for (const el of [...list].slice(0, 12)) { const s = getComputedStyle(el); const v = s.backdropFilter || s.webkitBackdropFilter; if (!v || v === 'none') none++; }
    if (none === Math.min(list.length, 12)) bd[sel] = { n: none, none };
  }
  out.backdrop = bd;

  // overflow
  const de = document.documentElement;
  out.pageOverflow = de.scrollWidth - de.clientWidth;
  const rtl = getComputedStyle(de).direction === 'rtl';
  const vw = de.clientWidth;
  const culprits = [];
  for (const box of document.querySelectorAll('[data-variant]')) {
    const mount = box.querySelector('.zg-test-mount') || box;
    let found = 0;
    for (const el of mount.querySelectorAll('*')) {
      if (found >= 2) break;
      const r = el.getBoundingClientRect();
      if (!r.width && !r.height) continue;
      const over = rtl ? r.left < -1 : r.right > vw + 1;
      if (!over) continue;
      const s = getComputedStyle(el);
      if (s.position === 'fixed' || s.visibility === 'hidden' || el.closest('.zg-float,[aria-hidden="true"]')) continue;
      let clipped = false;
      for (let a = el.parentElement; a && a !== box; a = a.parentElement) { const o = getComputedStyle(a); if (o.overflowX !== 'visible' || o.position === 'fixed') { clipped = true; break; } }
      if (clipped) continue;
      found++;
      const sec = box.closest('[data-component]');
      culprits.push({ component: sec ? sec.getAttribute('data-component') : '?', variant: box.getAttribute('data-variant'), el: el.tagName.toLowerCase() + (el.className && typeof el.className === 'string' ? '.' + el.className.split(/\s+/).slice(0, 2).join('.') : ''), left: Math.round(r.left), right: Math.round(r.right), width: Math.round(r.width) });
    }
  }
  out.culprits = culprits;
  // anything on the page (not only inside variants) that makes the document scroll sideways
  const wide = [];
  if (out.pageOverflow > 0) {
    for (const el of document.body.querySelectorAll('*')) {
      if (wide.length >= 8) break;
      const r = el.getBoundingClientRect();
      if (!r.width && !r.height) continue;
      const over = rtl ? r.left < -1 : r.right > vw + 1;
      if (!over) continue;
      const s = getComputedStyle(el);
      if (s.position === 'fixed') continue;
      let clipped = false;
      for (let a = el.parentElement; a && a !== document.body; a = a.parentElement) { const o = getComputedStyle(a); if (o.overflowX !== 'visible') { clipped = true; break; } }
      if (clipped) continue;
      const sec = el.closest('[data-component]');
      wide.push({ component: sec ? sec.getAttribute('data-component') : '(page)', el: el.tagName.toLowerCase() + (typeof el.className === 'string' && el.className ? '.' + el.className.split(/\s+/).slice(0, 2).join('.') : ''), pos: s.position, left: Math.round(r.left), right: Math.round(r.right), text: (el.textContent || '').trim().slice(0, 30) });
    }
  }
  out.pageCulprits = wide;
  // which component sections cause the sideways scroll: hide them one by one and see how much the overflow shrinks
  const drops = [];
  if (out.pageOverflow > 0) {
    const base = out.pageOverflow;
    for (const sec of document.querySelectorAll('section[data-component]')) {
      const prev = sec.style.display; sec.style.display = 'none';
      const o = de.scrollWidth - de.clientWidth;
      sec.style.display = prev;
      if (o < base) drops.push({ component: sec.getAttribute('data-component'), drop: base - o });
    }
    drops.sort((a, b) => b.drop - a.drop);
  }
  out.sectionDrops = drops.slice(0, 8);

  // remote @import / url() in loaded CSS
  const remote = [];
  for (const sh of document.styleSheets) {
    if (sh.href && !sh.href.startsWith(location.origin)) remote.push(sh.href);
    let rules; try { rules = sh.cssRules; } catch { continue; }
    const scan = rs => { for (const r of rs) { if (r.type === 3 && r.href && !r.href.startsWith(location.origin) && !r.href.startsWith('data:')) remote.push(r.href); if (r.cssRules) scan(r.cssRules); } };
    scan(rules);
  }
  out.remoteCss = remote;
  out.stress = [...document.querySelectorAll('[data-label="stress url()"]')].map(b => { const el = b.querySelector('.zg-es__img,.zg-lazy'); return (b.closest('[data-component]') || b).getAttribute('data-component') + ': ' + (el ? getComputedStyle(el).backgroundImage.slice(0, 80) : 'no element'); });
  out.errorsInDom = document.querySelectorAll('[data-error]').length;
  out.sheets = document.styleSheets.length;
  return out;
}

export async function runPage(browser, { extra, base, path = '/', query = '', viewport = { width: 1440, height: 900 }, after, strings = [], keyed = [], components = [], backdrop = [], timeout = 240000 }) {
  const page = await browser.newPage();
  await page.setViewport({ ...viewport, deviceScaleFactor: 1 });
  await page.setCacheEnabled(false);
  const origin = new URL(base).origin;
  const external = [], bad = [], failed = [];
  await page.setRequestInterception(true);
  page.on('request', req => {
    const u = req.url();
    if (u.startsWith(origin) || /^(data|blob|about):/.test(u)) return req.continue();
    external.push({ type: req.resourceType(), url: u.slice(0, 200) });
    return req.abort('blockedbyclient');
  });
  page.on('console', m => {
    const t = m.type();
    if (t !== 'error' && t !== 'warning' && t !== 'warn') return;
    const loc = m.location();
    bad.push({ kind: 'console.' + t, text: m.text().split('\n').slice(0, 3).join(' | ').slice(0, 400), url: loc && loc.url ? loc.url.replace(origin, '') : '' });
  });
  page.on('pageerror', e => bad.push({ kind: 'uncaught', text: String(e && e.message || e).slice(0, 400) }));
  page.on('response', r => { if (r.status() >= 400 && r.url().startsWith(origin)) failed.push({ status: r.status(), url: r.url().replace(origin, '') }); });
  page.on('requestfailed', r => { const u = r.url(); if (u.startsWith(origin) && !/ERR_ABORTED/.test(r.failure()?.errorText || '')) failed.push({ status: r.failure()?.errorText, url: u.replace(origin, '') }); });
  await page.evaluateOnNewDocument(() => {
    window.__csp = [];
    document.addEventListener('securitypolicyviolation', e => window.__csp.push({ directive: e.violatedDirective, blocked: e.blockedURI, source: (e.sourceFile || '').split('/').slice(-2).join('/'), line: e.lineNumber, sample: (e.sample || '').slice(0, 80) }), true);
  });
  const url = `${base}${path}${query ? '?' + query : ''}`;
  const t0 = Date.now();
  let fatal = null, data = null;
  try {
    await page.goto(url, { waitUntil: 'load', timeout });
    await page.waitForFunction('window.__zg && window.__zg.done', { timeout, polling: 500 });
    if (after) { await page.evaluate(after); await new Promise(r => setTimeout(r, 1000)); }
    await new Promise(r => setTimeout(r, 1200));
    await page.evaluate(() => document.fonts.ready);
    data = await page.evaluate(inPage, { strings, keyed, components, backdrop });
    if (extra) data.extra = await page.evaluate(extra.fn, extra.arg);
  } catch (e) { fatal = String(e && e.message || e).slice(0, 500); }
  await page.close();
  return { url: url.replace(origin, ''), ms: Date.now() - t0, fatal, bad, failed, external, data };
}
