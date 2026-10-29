// Scripted multi-step flows in real Chrome, Vue and React: rapid prop churn on every component, unmount with an open popup,
// stacked overlays, popups inside modals/drawers/clipped cells, event contracts, calendars across months and DST edges.
// usage: node tests/behaviour/flows.mjs [--fw=vue|react] [--group=rapid,unmount,stack,popups,contracts,calendar,table] [--out=flows-out]
// Failures not listed in tests/behaviour/flows-baseline.json fail the run.
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { generate, startServers, launch, stubExternal, watch, FRAMEWORKS } from '../browser/lib.mjs';
import { stressExamples, MODES } from './stress.mjs';

const here = dirname(fileURLToPath(import.meta.url));
const arg = k => (process.argv.find(a => a.startsWith('--' + k + '=')) || '').split('=').slice(1).join('=');
const fws = arg('fw') ? [arg('fw')] : FRAMEWORKS;
const OUT = arg('out') || 'flows-out';
const groups = (arg('group') || 'rapid,unmount,stack,popups,contracts,calendar,table').split(',');
const BASE = join(here, 'flows-baseline.json');
const baseline = new Set(existsSync(BASE) ? JSON.parse(readFileSync(BASE, 'utf8')) : []);
mkdirSync(OUT, { recursive: true });
const sleep = ms => new Promise(r => setTimeout(r, ms));

const examples = await generate({ ssr: false });
const stressed = Object.fromEntries(MODES.map(m => [m, stressExamples(examples, m)]));
const servers = await startServers(fws);
const browser = await launch();
const results = [];

async function newPage(fw, { w = 1280, tz, dir = 'ltr', touch = false } = {}) {
  const page = await browser.newPage();
  await page.setViewport({ width: w, height: 900, hasTouch: touch });
  if (tz) await page.emulateTimezone(tz);
  await stubExternal(page, []);
  const bad = watch(page);
  await page.goto(`${servers[fw].url}/?only=__none__&theme=dark&motion=off&dir=${dir}`, { waitUntil: 'load', timeout: 120000 });
  await page.waitForFunction('window.__zg && window.__zg.done && window.__zgMount', { timeout: 60000 });
  return { page, bad };
}
const mount = (page, name, variant, open) => page.evaluate((n, v, o) => { window.__zg.current = n + '#flow'; return window.__zgMount(n, v, o); }, name, variant, !!open);
const spy = page => page.evaluate(() => (window.__zgSpy || []).slice());
const clearSpy = page => page.evaluate(() => { window.__zgSpy = []; });
const assert = (c, m) => { if (!c) throw new Error(m); };

async function flow(fw, group, name, fn, opts) {
  if (!groups.includes(group)) return;
  const id = `${group}|${name}`;
  let ctx;
  try {
    ctx = await newPage(fw, opts);
    const errs0 = await ctx.page.evaluate(() => window.__zg.errors.length);
    await fn(ctx.page, ctx);
    const errs = await ctx.page.evaluate(n => window.__zg.errors.slice(n), errs0);
    const bad = ctx.bad.filter(b => !/Failed to load resource|unknown size/.test(b.text));
    if (errs.length) throw new Error('render error: ' + String(errs[0].message).split('\n')[0]);
    if (bad.length) throw new Error(`${bad[0].kind}: ${bad[0].text}`);
    results.push({ fw, id, ok: true });
  } catch (e) {
    const msg = String(e && e.message || e).split('\n')[0].slice(0, 300);
    results.push({ fw, id, ok: false, msg });
    try { if (ctx) await ctx.page.screenshot({ path: join(OUT, `${fw}-${id.replace(/[^A-Za-z0-9]+/g, '_')}.png`) }); } catch {}
  }
  if (ctx) await ctx.page.close().catch(() => {});
}

const variantOf = (list, name, idx = 0) => { const e = list.find(x => x.name === name); return e && e.variants[Math.min(idx, e.variants.length - 1)]; };

// ---------- rapid prop churn on every component, in every data mode
for (const fw of fws) await flow(fw, 'rapid', 'all components, 6 data modes x 6 rounds', async (page, ctx) => {
  const failed = [];
  for (const e of examples) {
    const seq = [e.variants[0], ...MODES.map(m => variantOf(stressed[m], e.name, 0)).filter(Boolean)];
    const open = !!e.variants[0].overlay;
    const before = ctx.bad.length;
    const res = await page.evaluate(async (name, seq, open) => {
      window.__zg.current = name + '#rapid';
      const errs0 = window.__zg.errors.length;
      let id;
      try {
        id = window.__zgMount(name, seq[0], open);
        for (let r = 0; r < 6; r++) for (const v of seq) { window.__zgSet(id, v); await new Promise(x => setTimeout(x, 0)); }
        await new Promise(x => setTimeout(x, 30));
        window.__zgUnmount(id);
      } catch (err) { return 'threw: ' + String(err && err.message || err).split('\n')[0]; }
      const errs = window.__zg.errors.slice(errs0);
      return errs.length ? 'render error: ' + errs[0].message.split('\n')[0] : '';
    }, e.name, seq, open);
    const newBad = ctx.bad.slice(before).filter(b => !/Failed to load resource/.test(b.text));
    if (res) failed.push(`${e.name}: ${res}`);
    else if (newBad.length) failed.push(`${e.name}: ${newBad[0].kind} ${newBad[0].text.slice(0, 160)}`);
  }
  ctx.bad.length = 0;
  if (failed.length) throw new Error(`${failed.length} components: ` + failed.slice(0, 12).join(' || '));
});

// ---------- unmount while a popup is open
const POPUPS = ['Select', 'MultiSelect', 'Combobox', 'DatePicker', 'TimePicker', 'ColorPicker', 'TreeSelect', 'GroupedSelect', 'PillSelect', 'Dropdown', 'Menu', 'Popover', 'HoverCard', 'Tooltip', 'ContextMenu', 'Popconfirm', 'Modal', 'Drawer', 'ConfirmDialog', 'CommandPalette', 'CommandBar', 'BottomSheet', 'Actionsheet', 'FullscreenDialog', 'StepDialog', 'ImageViewer', 'Tour', 'TopNav', 'SideNav', 'PhoneInput', 'RangeSlider'];
for (const fw of fws) await flow(fw, 'unmount', 'unmount with the popup open leaves nothing behind', async (page, ctx) => {
  const problems = [];
  for (const name of POPUPS) {
    const ex = examples.find(e => e.name === name);
    if (!ex) continue;
    const variant = ex.variants.find(v => v.overlay) || ex.variants[0];
    const before = ctx.bad.length;
    const id = await mount(page, name, variant, !!variant.overlay);
    await sleep(80);
    const root = `[data-flow="${id}"]`;
    if (!variant.overlay) {
      const trig = await page.$(`${root} [aria-haspopup], ${root} .zg-select__trigger, ${root} input, ${root} button`);
      if (trig) {
        if (name === 'ContextMenu') await page.evaluate(sel => { const el = document.querySelector(sel + ' .doc-preview > *'); el && el.dispatchEvent(new MouseEvent('contextmenu', { bubbles: true, clientX: 100, clientY: 100 })); }, root);
        else if (/Tooltip|HoverCard/.test(name)) { await trig.hover(); await sleep(400); }
        else await trig.click().catch(() => {});
      }
    }
    await sleep(150);
    await page.evaluate(i => window.__zgUnmount(i), id);
    await sleep(120);
    const left = await page.evaluate(() => ({
      nodes: [...document.querySelectorAll('.zg-float, .zg-modal-scrim, .zg-modal, [role=dialog], [role=listbox], [role=menu], [role=tooltip]')].map(e => e.className || e.getAttribute('role')).slice(0, 3),
      lock: getComputedStyle(document.body).overflow === 'hidden' || document.documentElement.style.overflow === 'hidden' || document.body.style.position === 'fixed',
      inert: !!document.querySelector('#root[inert], #root[aria-hidden="true"], body[inert]'),
      extra: [...document.body.children].filter(e => e.id !== 'root' && !/^(SCRIPT|STYLE)$/.test(e.tagName)).map(e => e.tagName + '.' + e.className).slice(0, 3),
    }));
    const nb = ctx.bad.slice(before).filter(b => !/Failed to load resource/.test(b.text));
    if (left.nodes.length) problems.push(`${name}: leftover ${left.nodes.join(',')}`);
    else if (left.lock) problems.push(`${name}: scroll lock not released`);
    else if (left.inert) problems.push(`${name}: root left inert/aria-hidden`);
    else if (left.extra.length) problems.push(`${name}: stray body children ${left.extra.join(',')}`);
    else if (nb.length) problems.push(`${name}: ${nb[0].kind} ${nb[0].text.slice(0, 140)}`);
  }
  ctx.bad.length = 0;
  if (problems.length) throw new Error(`${problems.length}: ` + problems.join(' || '));
});

// ---------- overlay stacking
const OPEN_COUNT = `[...document.querySelectorAll('[role=dialog]')].map(e => e.getAttribute('aria-label'))`;
for (const fw of fws) {
  await flow(fw, 'stack', 'Modal over Modal: top receives input, Escape closes one at a time, scroll lock survives', async page => {
    const A = { label: 'a', overlay: true, props: { title: 'Outer' }, text: 'Outer body' };
    const B = { label: 'b', overlay: true, props: { title: 'Inner' }, text: 'Inner body' };
    await mount(page, 'Modal', A, true); await sleep(100);
    await mount(page, 'Modal', B, true); await sleep(100);
    assert((await page.evaluate(OPEN_COUNT)).length === 2, 'both dialogs open: ' + await page.evaluate(OPEN_COUNT));
    const top = await page.evaluate(() => { const d = [...document.querySelectorAll('[role=dialog]')].find(e => e.getAttribute('aria-label') === 'Inner'); const r = d.getBoundingClientRect(); const el = document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2); return !!(el && el.closest('[role=dialog]') === d); });
    assert(top, 'inner dialog is not on top');
    await page.keyboard.press('Escape'); await sleep(150);
    const after1 = await page.evaluate(OPEN_COUNT);
    assert(after1.length === 1 && after1[0] === 'Outer', 'first Escape should close only Inner, left: ' + JSON.stringify(after1));
    await page.keyboard.press('Escape'); await sleep(150);
    assert((await page.evaluate(OPEN_COUNT)).length === 0, 'second Escape should close Outer');
  });
  await flow(fw, 'stack', 'Drawer then Modal on top: Escape closes Modal first', async page => {
    await mount(page, 'Drawer', { label: 'd', overlay: true, props: { title: 'Drawer' }, text: 'x' }, true); await sleep(100);
    await mount(page, 'Modal', { label: 'm', overlay: true, props: { title: 'Dialog' }, text: 'y' }, true); await sleep(100);
    await page.keyboard.press('Escape'); await sleep(150);
    const left = await page.evaluate(OPEN_COUNT);
    assert(left.length === 1 && left[0] === 'Drawer', 'Escape should close Dialog only, left: ' + JSON.stringify(left));
  });
  await flow(fw, 'stack', 'Backdrop click on the top dialog closes only it', async page => {
    await mount(page, 'Modal', { label: 'a', overlay: true, props: { title: 'Outer' }, text: 'x' }, true); await sleep(80);
    await mount(page, 'Modal', { label: 'b', overlay: true, props: { title: 'Inner' }, text: 'y' }, true); await sleep(80);
    await page.mouse.click(4, 4); await sleep(150);
    const left = await page.evaluate(OPEN_COUNT);
    assert(left.length === 1 && left[0] === 'Outer', 'backdrop click should close Inner only, left: ' + JSON.stringify(left));
  });
  await flow(fw, 'stack', 'Modal with an unknown size does not stretch to the full width', async page => {
    await mount(page, 'Modal', { label: 'u', overlay: true, props: { title: 'Odd', size: 'nonsense' }, text: 'x' }, true); await sleep(100);
    const w = await page.evaluate(() => document.querySelector('[role=dialog]').getBoundingClientRect().width);
    assert(w < 900, 'modal width ' + w + ' at viewport 1280');
  });
}

// ---------- popups inside modals, drawers and clipped containers
const OPTS = [{ value: 'a', label: 'Alpha' }, { value: 'b', label: 'Beta' }, { value: 'c', label: 'Gamma' }, { value: 'd', label: 'Delta' }, { value: 'e', label: 'Epsilon' }];
const POP = {
  Select: { props: { label: 'City', modelValue: 'a', options: OPTS }, trig: '.zg-select__trigger' },
  MultiSelect: { props: { modelValue: ['a'], options: OPTS }, trig: '.zg-select__trigger, [aria-haspopup]' },
  Combobox: { props: { modelValue: 'a', options: OPTS }, trig: 'input' },
  Dropdown: { props: { label: 'Actions', items: [{ label: 'Edit', value: 'edit' }, { label: 'Delete', value: 'del' }] }, trig: '[aria-haspopup]' },
  DatePicker: { props: { label: 'Date', modelValue: '2027-03-10', locale: 'en-GB' }, trig: '[aria-haspopup], .zg-select__trigger, input, button' },
};
const CONTAINERS = {
  Modal: p => ({ outer: 'Modal', variant: { overlay: true, props: { title: 'Host' }, children: [{ name: p.name, props: p.props }] }, open: true }),
  Drawer: p => ({ outer: 'Drawer', variant: { overlay: true, props: { title: 'Host' }, children: [{ name: p.name, props: p.props }] }, open: true }),
  'clipped cell': p => ({ outer: p.name, variant: { inside: { name: 'div', props: { style: { overflow: 'hidden', height: '56px', width: '280px', border: '1px solid #888', display: 'flex', alignItems: 'center', padding: '0 8px' } }, children: [{ name: '$' }] }, props: p.props } }),
  'scroll cell': p => ({ outer: p.name, variant: { inside: { name: 'div', props: { style: { overflow: 'auto', height: '70px', width: '280px', border: '1px solid #888', padding: '8px' } }, children: [{ name: '$' }] }, props: p.props } }),
};
for (const fw of fws) for (const [pname, pop] of Object.entries(POP)) for (const [cname, mk] of Object.entries(CONTAINERS)) {
  await flow(fw, 'popups', `${pname} inside ${cname}`, async page => {
    const m = mk({ name: pname, props: pop.props });
    const id = await mount(page, m.outer, m.variant, m.open);
    await sleep(150);
    const root = `[data-flow="${id}"]`;
    const trigSel = cname === 'Modal' || cname === 'Drawer' ? `[role=dialog] .zg-modal__body ${pop.trig.split(',').join(', [role=dialog] .zg-modal__body ')}` : `${root} ${pop.trig.split(',').join(`, ${root} `)}`;
    const trig = await page.$(trigSel);
    assert(trig, 'trigger not found: ' + trigSel);
    await trig.click(); await sleep(250);
    const info = await page.evaluate(() => {
      const f = [...document.querySelectorAll('.zg-float')].pop();
      if (!f) return null;
      const r = f.getBoundingClientRect(), vw = innerWidth, vh = innerHeight;
      let clipped = null;
      for (let p = f.parentElement; p && p !== document.body; p = p.parentElement) { const s = getComputedStyle(p); if (/(hidden|auto|scroll|clip)/.test(s.overflow + s.overflowX + s.overflowY)) { clipped = p.className || p.tagName; break; } }
      const el = document.elementFromPoint(Math.min(vw - 1, Math.max(0, r.left + r.width / 2)), Math.min(vh - 1, Math.max(0, r.top + Math.min(r.height / 2, 20))));
      const ix = Math.max(0, Math.min(r.right, vw) - Math.max(r.left, 0)) * Math.max(0, Math.min(r.bottom, vh) - Math.max(r.top, 0));
      return { onTop: !!(el && f.contains(el)), visibleShare: r.width * r.height ? ix / (r.width * r.height) : 0, clipped, w: r.width, h: r.height };
    });
    assert(info, 'popup did not open');
    assert(!info.clipped, 'popup is rendered inside a clipping ancestor: ' + info.clipped);
    assert(info.onTop, 'popup is covered by something else');
    assert(info.visibleShare > 0.9, 'popup leaves the viewport (visible ' + Math.round(info.visibleShare * 100) + '%)');
    await page.keyboard.press('Escape'); await sleep(200);
    const stillThere = await page.evaluate(() => ({ float: !!document.querySelector('.zg-float'), dialog: !!document.querySelector('[role=dialog]') }));
    assert(!stillThere.float, 'Escape did not close the popup');
    if (cname === 'Modal' || cname === 'Drawer') assert(stillThere.dialog, 'Escape closed the whole ' + cname + ' instead of only the popup');
  });
}

// ---------- event contracts
const click = async (page, sel) => { const el = await page.$(sel); if (!el) throw new Error('no element ' + sel); await el.click(); await sleep(60); };
const labels = async page => (await spy(page)).map(s => s.label + ':' + JSON.stringify(s.args));
const CONTRACTS = [
  ['Button click fires once with the event', 'Button', { props: { variant: 'primary', onClick: '$spy:click' }, text: 'Go' }, async (page, r) => { await click(page, `${r} button`); const l = await labels(page); assert(l.length === 1 && l[0].startsWith('click:'), 'click calls: ' + l.join()); }],
  ['Button Enter and Space fire once each', 'Button', { props: { onClick: '$spy:click' }, text: 'Go' }, async (page, r) => { await page.focus(`${r} button`); await page.keyboard.press('Enter'); await sleep(50); await page.keyboard.press('Space'); await sleep(50); const l = await labels(page); assert(l.length === 2, 'Enter+Space calls: ' + l.length); }],
  ['Button touch tap fires once', 'Button', { props: { onClick: '$spy:click' }, text: 'Go' }, async (page, r) => { const b = await (await page.$(`${r} button`)).boundingBox(); await page.touchscreen.tap(b.x + b.width / 2, b.y + b.height / 2); await sleep(120); const l = await labels(page); assert(l.length === 1, 'tap calls: ' + l.length); }, { touch: true }],
  ['Disabled Button never fires', 'Button', { props: { disabled: true, onClick: '$spy:click' }, text: 'Go' }, async (page, r) => { await page.click(`${r} button`).catch(() => {}); await page.focus(`${r} button`).catch(() => {}); await page.keyboard.press('Enter'); await page.keyboard.press('Space'); await sleep(60); assert((await spy(page)).length === 0, 'disabled button fired'); }],
  ['Loading Button never fires', 'Button', { props: { loading: true, onClick: '$spy:click' }, text: 'Go' }, async (page, r) => { await page.click(`${r} button`).catch(() => {}); await sleep(60); assert((await spy(page)).length === 0, 'loading button fired'); }],
  ['IconButton click fires once', 'IconButton', { props: { icon: 'heart', label: 'Save', onClick: '$spy:click' } }, async (page, r) => { await click(page, `${r} button`); assert((await spy(page)).length === 1, 'calls ' + (await spy(page)).length); }],
  ['Tabs click -> model once with the value', 'Tabs', { props: { items: [{ value: 'one', label: 'One' }, { value: 'two', label: 'Two' }], modelValue: 'one' } }, async (page, r) => { await page.evaluate(sel => [...document.querySelectorAll(sel + ' [role=tab]')].find(b => b.textContent.trim() === 'Two').click(), r); await sleep(80); const l = await labels(page); assert(l.length === 1 && l[0] === 'model:["two"]', 'model calls: ' + l.join()); }],
  ['SegmentedControl click -> model once', 'SegmentedControl', { props: { items: [{ value: 'one', label: 'One' }, { value: 'two', label: 'Two' }], modelValue: 'one' } }, async (page, r) => { await page.evaluate(sel => [...document.querySelectorAll(sel + ' button, ' + sel + ' [role=radio], ' + sel + ' [role=tab]')].find(b => b.textContent.trim() === 'Two').click(), r); await sleep(80); const l = await labels(page); assert(l.length === 1 && l[0] === 'model:["two"]', 'model calls: ' + l.join()); }],
  ['Switch click and Space toggle once each', 'Switch', { props: { label: 'Wi-Fi', modelValue: false } }, async (page, r) => { await click(page, `${r} [role=switch], ${r} input, ${r} button`); let l = await labels(page); assert(l.length === 1 && l[0] === 'model:[true]', 'click: ' + l.join()); await page.keyboard.press('Space'); await sleep(80); l = await labels(page); assert(l.length === 2 && l[1] === 'model:[false]', 'space: ' + l.join()); }],
  ['Disabled Switch never fires', 'Switch', { props: { label: 'Wi-Fi', modelValue: false, disabled: true } }, async (page, r) => { await page.click(`${r} [role=switch], ${r} input, ${r} button, ${r} label`).catch(() => {}); await page.keyboard.press('Space'); await sleep(60); assert((await spy(page)).length === 0, 'disabled switch fired'); }],
  ['Checkbox click toggles once', 'Checkbox', { props: { label: 'Agree', modelValue: false } }, async (page, r) => { await click(page, `${r} [role=checkbox], ${r} input, ${r} button, ${r} label`); const l = await labels(page); assert(l.length === 1 && l[0] === 'model:[true]', 'calls: ' + l.join()); }],
  ['Disabled Checkbox never fires', 'Checkbox', { props: { label: 'Agree', modelValue: false, disabled: true } }, async (page, r) => { await page.click(`${r} [role=checkbox], ${r} input, ${r} button, ${r} label`).catch(() => {}); await sleep(60); assert((await spy(page)).length === 0, 'disabled checkbox fired'); }],
  ['TextField typing round-trips the value', 'TextField', { props: { label: 'Name', modelValue: '' } }, async (page, r) => { await click(page, `${r} input`); await page.keyboard.type('Zayd 🌙 زيد', { delay: 5 }); await sleep(100); const v = await page.$eval(`${r} input`, e => e.value); assert(v === 'Zayd 🌙 زيد', 'input shows "' + v + '"'); const l = await spy(page); assert(l.length && l[l.length - 1].args[0] === 'Zayd 🌙 زيد', 'last model ' + JSON.stringify(l[l.length - 1])); }],
  ['Pagination click -> model once', 'Pagination', { props: { page: 2, pages: 10 } }, async (page, r) => { await page.evaluate(sel => [...document.querySelectorAll(sel + ' button')].find(b => b.textContent.trim() === '3').click(), r); await sleep(80); const l = await labels(page); assert(l.length === 1 && l[0] === 'model:[3]', 'calls: ' + l.join()); }],
  ['DataTable sort header calls onSort once with key and direction', 'DataTable', { props: { onSort: '$spy:sort', columns: [{ key: 'a', label: 'A', sortable: true }, { key: 'b', label: 'B' }], rows: [{ id: 1, a: 3, b: 'x' }, { id: 2, a: 1, b: 'y' }] } }, async (page, r) => { await click(page, `${r} th button`); const l = await labels(page); assert(l.length === 1 && l[0] === 'sort:["a","asc"]', 'calls: ' + l.join()); }],
  ['DataTable select all / one row', 'DataTable', { props: { onSelect: '$spy:sel', selected: [], columns: [{ key: 'a', label: 'A' }], rows: [{ id: 1, a: 3 }, { id: 2, a: 1 }, { id: 3, a: 7 }] } }, async (page, r) => { await click(page, `${r} thead [role=checkbox]`); let l = await labels(page); assert(l.length === 1 && l[0] === 'sel:[[1,2,3]]', 'all: ' + l.join()); await clearSpy(page); await page.evaluate(sel => document.querySelectorAll(sel + ' tbody [role=checkbox]')[1].click(), r); await sleep(60); l = await labels(page); assert(l.length === 1 && l[0] === 'sel:[[2]]', 'row: ' + l.join()); }],
  ['DataTable with 200 rows keeps header and rows aligned', 'DataTable', { props: { columns: [{ key: 'a', label: 'A' }, { key: 'b', label: 'B' }], rows: Array.from({ length: 200 }, (_, i) => ({ id: i, a: 'row ' + i, b: i * 1e9 })) } }, async (page, r) => { const n = await page.$$eval(`${r} tbody tr`, e => e.length); assert(n === 200, 'rows ' + n); }],
];
const VUE_ONLY = [
  ['Vue kebab-case model-value is read (Tabs)', 'Tabs', { props: { items: [{ value: 'one', label: 'One' }, { value: 'two', label: 'Two' }], 'model-value': 'two' } }, async (page, r) => { const t = await page.$$eval(`${r} [role=tab][aria-selected=true]`, e => e.map(x => x.textContent.trim())); assert(t.length === 1 && t[0] === 'Two', 'selected: ' + t.join()); }],
  ['Vue kebab-case model-value is read (TextField)', 'TextField', { props: { label: 'Name', 'model-value': 'hello' } }, async (page, r) => { const v = await page.$eval(`${r} input`, e => e.value); assert(v === 'hello', 'value "' + v + '"'); }],
  ['Vue kebab-case model-value is read (Switch)', 'Switch', { props: { label: 'Wi-Fi', 'model-value': true } }, async (page, r) => { const v = await page.evaluate(sel => { const e = document.querySelector(sel + ' [role=switch], ' + sel + ' input'); return e.getAttribute('aria-checked') || String(e.checked); }, r); assert(v === 'true', 'checked ' + v); }],
  ['Vue explicit onChange prop is called (Tabs)', 'Tabs', { props: { items: [{ value: 'one', label: 'One' }, { value: 'two', label: 'Two' }], modelValue: 'one', onChange: '$spy:chg' } }, async (page, r) => { await page.evaluate(sel => [...document.querySelectorAll(sel + ' [role=tab]')].find(b => b.textContent.trim() === 'Two').click(), r); await sleep(80); const l = (await labels(page)).filter(x => x.startsWith('chg')); assert(l.length === 1, 'onChange calls: ' + l.length); }],
  ['Vue explicit onChange prop is called (Switch)', 'Switch', { props: { label: 'Wi-Fi', modelValue: false, onChange: '$spy:chg' } }, async (page, r) => { await click(page, `${r} [role=switch], ${r} input, ${r} button`); const l = (await labels(page)).filter(x => x.startsWith('chg')); assert(l.length === 1, 'onChange calls: ' + l.length); }],
  ['Vue explicit onChange prop is called (Checkbox)', 'Checkbox', { props: { label: 'Agree', modelValue: false, onChange: '$spy:chg' } }, async (page, r) => { await click(page, `${r} [role=checkbox], ${r} input, ${r} button, ${r} label`); const l = (await labels(page)).filter(x => x.startsWith('chg')); assert(l.length === 1, 'onChange calls: ' + l.length); }],
];
for (const fw of fws) for (const [title, name, variant, fn, opts] of [...CONTRACTS, ...(fw === 'vue' ? VUE_ONLY : [])]) {
  await flow(fw, 'contracts', title, async (page) => {
    await clearSpy(page);
    const id = await mount(page, name, { label: 'c', ...variant });
    await sleep(120);
    await fn(page, `[data-flow="${id}"]`);
  }, opts);
}

// ---------- calendars across months, locales and DST edges
const TZ = ['UTC', 'America/New_York', 'Europe/London', 'America/Sao_Paulo', 'Australia/Lord_Howe', 'Pacific/Apia', 'Asia/Tehran', 'Asia/Riyadh'];
for (const fw of fws) for (const tz of TZ) {
  await flow(fw, 'calendar', `Calendar 30 months in ${tz}`, async page => {
    const id = await mount(page, 'Calendar', { label: 'cal', width: '340px', props: { modelValue: '2027-03-13', today: '2027-03-14', locale: 'en-GB' } });
    await sleep(150);
    const root = `[data-flow="${id}"]`;
    let y = 2027, m = 3;
    for (let i = 0; i < 30; i++) {
      const days = await page.$$eval(`${root} .zg-cal__d`, e => e.map(x => x.getAttribute('data-date')));
      const dim = new Date(Date.UTC(y, m, 0)).getUTCDate();
      const want = Array.from({ length: dim }, (_, d) => `${y}-${String(m).padStart(2, '0')}-${String(d + 1).padStart(2, '0')}`);
      assert(days.length === dim && days.every((d, k) => d === want[k]), `month ${y}-${m}: got ${days.length} days [${days.slice(0, 3)}..${days.slice(-1)}] want ${dim}`);
      await page.click(`${root} .zg-cal__h button:last-of-type`); await sleep(40);
      m++; if (m > 12) { m = 1; y++; }
    }
    for (let i = 0; i < 30; i++) { await page.click(`${root} .zg-cal__h button:first-of-type`); await sleep(20); }
    const back = await page.$eval(`${root} .zg-cal__d`, e => e.getAttribute('data-date'));
    assert(back === '2027-03-01', 'after 30 forward + 30 back the first day is ' + back);
    await clearSpy(page);
    await click(page, `${root} .zg-cal__d[data-date="2027-03-28"]`);
    const l = await spy(page);
    assert(l.length === 1 && String(l[0].args[0]).includes('2027-03-28'), 'picking 28 March gave ' + JSON.stringify(l.map(x => x.args)));
  }, { tz });
}

// ---------- tables: sort + selection + pagination round trip with a stateful host is covered by contracts; here a rapid-click stress
for (const fw of fws) await flow(fw, 'table', 'rapid clicks on sort and select do not double fire', async page => {
  await clearSpy(page);
  const id = await mount(page, 'DataTable', { label: 't', props: { onSort: '$spy:sort', onSelect: '$spy:sel', selected: [], columns: [{ key: 'a', label: 'A', sortable: true }], rows: [{ id: 1, a: 1 }, { id: 2, a: 2 }] } });
  await sleep(100);
  const root = `[data-flow="${id}"]`;
  for (let i = 0; i < 5; i++) { await page.click(`${root} th:last-child button`); await page.click(`${root} tbody [role=checkbox]`); }
  await sleep(100);
  const l = await spy(page);
  assert(l.filter(x => x.label === 'sort').length === 5 && l.filter(x => x.label === 'sel').length === 5, 'sort/select calls ' + JSON.stringify(l.map(x => x.label)));
});

await browser.close();
for (const s of Object.values(servers)) await s.server.close();

// ---------- report
const fail = results.filter(r => !r.ok);
const fresh = fail.filter(r => !baseline.has(r.id) && !baseline.has(`${r.fw}:${r.id}`));
writeFileSync(join(OUT, 'flows.json'), JSON.stringify(results, null, 1));
const byId = new Map();
for (const r of results) { if (!byId.has(r.id)) byId.set(r.id, {}); byId.get(r.id)[r.fw] = r; }
const md = ['| flow | ' + fws.join(' | ') + ' |', '| --- |' + fws.map(() => ' --- |').join('')];
for (const [id, v] of byId) md.push(`| ${id} | ${fws.map(f => v[f] ? (v[f].ok ? 'ok' : 'FAIL: ' + v[f].msg.replace(/\|/g, '/')) : '-').join(' | ')} |`);
writeFileSync(join(OUT, 'flows.md'), md.join('\n') + '\n');
console.log(`\nFlows: ${results.length} runs, ${fail.length} failed, ${fresh.length} not in baseline`);
for (const r of fail) console.log(`  ${baseline.has(r.id) || baseline.has(`${r.fw}:${r.id}`) ? 'known' : 'NEW  '} [${r.fw}] ${r.id}: ${r.msg}`);
if (process.argv.includes('--write-baseline')) writeFileSync(BASE, JSON.stringify([...new Set([...baseline, ...fail.map(r => r.id)])].sort(), null, 1) + '\n');
process.exit(fresh.length && !process.argv.includes('--report-only') ? 1 : 0);
