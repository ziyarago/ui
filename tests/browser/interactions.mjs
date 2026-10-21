// Real-browser behaviour checks, run against the Vue app and the React app with the same fixtures.
// usage: node tests/browser/interactions.mjs [--fw=vue|react] [--case=Select]
import { writeFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';
import assert from 'node:assert/strict';
import { GEN, startServers, launch, stubExternal, watch, FRAMEWORKS } from './lib.mjs';
import { CASES } from './interaction-cases.mjs';

const arg = k => (process.argv.find(a => a.startsWith('--' + k + '=')) || '').split('=')[1];
const fws = arg('fw') ? [arg('fw')] : FRAMEWORKS;
const only = arg('case');

mkdirSync(GEN, { recursive: true });
writeFileSync(join(GEN, 'cases.json'), JSON.stringify(CASES));

const sleep = ms => new Promise(r => setTimeout(r, ms));

// ---- helpers bound to a page
const tools = page => {
  const sel = (name, idx = 0) => `[data-component="${name}"] [data-variant="${idx}"]`;
  const $ = async (s) => page.$(s);
  const count = (s) => page.$$eval(s, els => els.length);
  const text = (s) => page.$eval(s, el => el.textContent.replace(/\s+/g, ' ').trim());
  const attr = (s, a) => page.$eval(s, (el, a) => el.getAttribute(a), a);
  const exists = async (s) => (await page.$(s)) !== null;
  // click the first element matching css whose text equals / includes the text
  const clickText = async (scope, css, t, exact = true) => {
    const h = await page.evaluateHandle((scope, css, t, exact) => [...document.querySelectorAll(`${scope} ${css}`)].find(e => { const x = e.textContent.replace(/\s+/g, ' ').trim(); return exact ? x === t : x.includes(t); }) || null, scope, css, t, exact);
    const el = h.asElement();
    if (!el) throw new Error(`no ${css} with text "${t}" in ${scope}`);
    await el.click(); await sleep(60);
  };
  const waitFor = async (fn, what, ms = 2000) => {
    const t0 = Date.now();
    for (;;) {
      let v; try { v = await fn(); } catch { v = false; }
      if (v) return v;
      if (Date.now() - t0 > ms) throw new Error('timeout waiting for ' + what);
      await sleep(30);
    }
  };
  const spy = () => page.evaluate(() => (window.__zgSpy || []).slice());
  const clearSpy = () => page.evaluate(() => { window.__zgSpy = []; });
  const lastModel = async () => { const s = (await spy()).filter(e => e.label === 'model'); return s.length ? s[s.length - 1].args[0] : undefined; };
  const activeIn = (scope) => page.evaluate(scope => { const a = document.activeElement, r = document.querySelector(scope); return !!(a && r && r.contains(a)); }, scope);
  const active = () => page.evaluate(() => { const a = document.activeElement; return a ? `${a.tagName.toLowerCase()}${a.getAttribute('aria-label') ? '[' + a.getAttribute('aria-label') + ']' : ''}:${(a.textContent || '').trim().slice(0, 20)}` : 'none'; });
  return { sel, $, count, text, attr, exists, clickText, waitFor, spy, clearSpy, lastModel, activeIn, active };
};

// ---- the checks. Each receives (page, t) and throws on a violated expectation.
const checks = {
  async Select(page, t) {
    const S = t.sel('Select');
    assert.equal(await t.text(`${S} .zg-select__trigger`), 'Alpha');
    assert.equal(await t.exists(`${S} [role=listbox]`), false, 'closed initially');
    await page.click(`${S} .zg-select__trigger`);
    await t.waitFor(() => t.exists(`${S} [role=listbox]`), 'listbox to open');
    assert.equal(await t.count(`${S} [role=option]`), 3);
    assert.equal(await t.attr(`${S} .zg-select__trigger`, 'aria-expanded'), 'true');
    assert.equal(await t.attr(`${S} [role=option][aria-selected=true]`, 'aria-selected'), 'true');
    // outside click closes
    await page.mouse.click(5, 5);
    await t.waitFor(async () => !(await t.exists(`${S} [role=listbox]`)), 'outside click to close');
    // Escape closes and returns focus to the trigger
    await page.click(`${S} .zg-select__trigger`);
    await t.waitFor(() => t.exists(`${S} [role=listbox]`), 'reopen');
    await page.keyboard.press('Escape');
    await t.waitFor(async () => !(await t.exists(`${S} [role=listbox]`)), 'Escape to close');
    assert.ok(await t.activeIn(`${S} .zg-select__trigger`) || (await t.active()).startsWith('button'), 'focus returns to trigger, got ' + await t.active());
    // choose
    await t.clearSpy();
    await page.click(`${S} .zg-select__trigger`);
    await t.clickText(S, '[role=option]', 'Beta');
    await t.waitFor(async () => (await t.text(`${S} .zg-select__trigger`)) === 'Beta', 'trigger to show Beta');
    assert.equal(await t.exists(`${S} [role=listbox]`), false, 'closes after choosing');
    assert.equal(await t.lastModel(), 'b');
  },

  async MultiSelect(page, t) {
    const S = t.sel('MultiSelect');
    assert.equal(await t.text(`${S} .zg-select__trigger`), '1 selected');
    await page.click(`${S} .zg-select__trigger`);
    await t.waitFor(() => t.exists(`${S} [role=listbox]`), 'listbox');
    await t.clickText(S, '[role=option]', 'Beta');
    await t.clickText(S, '[role=option]', 'Gamma');
    assert.equal(await t.text(`${S} .zg-select__trigger`), '3 selected');
    assert.deepEqual(await t.lastModel(), ['a', 'b', 'c']);
    assert.equal(await t.exists(`${S} [role=listbox]`), true, 'stays open while picking');
    await t.clickText(S, '[role=option]', 'Alpha');
    assert.deepEqual(await t.lastModel(), ['b', 'c']);
    assert.equal(await t.count(`${S} [role=option][aria-selected=true]`), 2);
    await page.keyboard.press('Escape');
    await t.waitFor(async () => !(await t.exists(`${S} [role=listbox]`)), 'Escape closes');
  },

  async Combobox(page, t) {
    const S = t.sel('Combobox');
    assert.equal(await page.$eval(`${S} input`, e => e.value), 'Alpha');
    await page.click(`${S} input`);
    await t.waitFor(() => t.exists(`${S} [role=listbox]`), 'listbox on focus');
    assert.equal(await t.count(`${S} [role=option]`), 3);
    await page.keyboard.type('gam');
    await t.waitFor(async () => (await t.count(`${S} [role=option]`)) === 1, 'filter to 1 option');
    assert.equal(await t.text(`${S} [role=option]`), 'Gamma');
    await page.keyboard.type('zzz');
    await t.waitFor(async () => (await t.count(`${S} [role=option]`)) === 0 && await t.exists(`${S} .zg-empty`), 'empty state');
    for (let i = 0; i < 3; i++) await page.keyboard.press('Backspace');
    await t.waitFor(async () => (await t.count(`${S} [role=option]`)) === 1, 'filter back to 1');
    await t.clickText(S, '[role=option]', 'Gamma');
    await t.waitFor(async () => (await page.$eval(`${S} input`, e => e.value)) === 'Gamma', 'input shows chosen label');
    assert.equal(await t.lastModel(), 'c');
    assert.equal(await t.exists(`${S} [role=listbox]`), false);
  },

  async DatePicker(page, t) {
    const S = t.sel('DatePicker');
    assert.match(await t.text(`${S} .zg-select__trigger`), /10 Mar 2026/);
    await page.click(`${S} .zg-select__trigger`);
    await t.waitFor(() => t.exists(`${S} .zg-cal`), 'calendar');
    assert.match(await t.text(`${S} .zg-cal__h b`), /March 2026/);
    assert.equal(await t.attr(`${S} .zg-cal__d[aria-pressed=true]`, 'aria-pressed'), 'true');
    assert.equal(await t.text(`${S} .zg-cal__d[aria-pressed=true]`), '10');
    await page.click(`${S} [aria-label="Next month"]`);
    await t.waitFor(async () => /April 2026/.test(await t.text(`${S} .zg-cal__h b`)), 'next month');
    await page.click(`${S} [aria-label="Previous month"]`);
    await t.waitFor(async () => /March 2026/.test(await t.text(`${S} .zg-cal__h b`)), 'previous month');
    await t.clickText(S, '.zg-cal__d', '15');
    await t.waitFor(async () => /15 Mar 2026/.test(await t.text(`${S} .zg-select__trigger`)), 'trigger shows 15 Mar 2026');
    assert.equal(await t.exists(`${S} .zg-cal`), false, 'closes after choosing a day');
    assert.equal(await t.lastModel(), 'date:2026-03-15');
  },

  async Tabs(page, t) {
    const S = t.sel('Tabs');
    assert.equal(await t.attr(`${S} [role=tab]:nth-child(1)`, 'aria-selected'), 'true');
    await t.clickText(S, '[role=tab]', 'Two');
    await t.waitFor(async () => (await t.attr(`${S} [role=tab]:nth-child(2)`, 'aria-selected')) === 'true', 'Two selected');
    assert.equal(await t.attr(`${S} [role=tab]:nth-child(1)`, 'aria-selected'), 'false');
    assert.equal(await t.lastModel(), 'two');
  },

  async SegmentedControl(page, t) {
    const S = t.sel('SegmentedControl');
    assert.equal(await t.attr(`${S} button:nth-child(1)`, 'aria-pressed'), 'true');
    await t.clickText(S, 'button', 'Three');
    await t.waitFor(async () => (await t.attr(`${S} button:nth-child(3)`, 'aria-pressed')) === 'true', 'Three pressed');
    assert.equal(await t.attr(`${S} button:nth-child(1)`, 'aria-pressed'), 'false');
    assert.equal(await t.lastModel(), 'three');
  },

  async Switch(page, t) {
    const S = `${t.sel('Switch')} [role=switch]`;
    assert.equal(await t.attr(S, 'aria-checked'), 'false');
    await page.click(S);
    await t.waitFor(async () => (await t.attr(S, 'aria-checked')) === 'true', 'switch on');
    assert.equal(await t.lastModel(), true);
    await page.click(S);
    await t.waitFor(async () => (await t.attr(S, 'aria-checked')) === 'false', 'switch off');
    assert.equal(await t.lastModel(), false);
  },

  async Checkbox(page, t) {
    const S = `${t.sel('Checkbox')} [role=checkbox]`;
    assert.equal(await t.attr(S, 'aria-checked'), 'false');
    await page.click(S);
    await t.waitFor(async () => (await t.attr(S, 'aria-checked')) === 'true', 'checked');
    assert.equal(await t.lastModel(), true);
    await page.focus(S); await page.keyboard.press('Space');
    await t.waitFor(async () => (await t.attr(S, 'aria-checked')) === 'false', 'unchecked via keyboard');
  },

  async Modal(page, t) { await dialogCheck(page, t, 'Modal', 'Confirm booking', 'Body text'); },
  async Drawer(page, t) { await dialogCheck(page, t, 'Drawer', 'Guest details', 'Drawer body'); },

  async Pagination(page, t) {
    const S = t.sel('Pagination');
    assert.equal(await t.attr(`${S} [aria-current=page]`, 'aria-current'), 'page');
    assert.equal(await t.text(`${S} [aria-current=page]`), '2');
    await t.clickText(S, 'button', '3');
    await t.waitFor(async () => (await t.text(`${S} [aria-current=page]`)) === '3', 'page 3 current');
    assert.equal(await t.lastModel(), 3);
    await page.click(`${S} [aria-label="Next page"]`);
    await t.waitFor(async () => (await t.text(`${S} [aria-current=page]`)) === '4', 'next page');
    await page.click(`${S} [aria-label="Previous page"]`);
    await t.waitFor(async () => (await t.text(`${S} [aria-current=page]`)) === '3', 'previous page');
  },

  async Accordion(page, t) {
    const S = t.sel('Accordion');
    assert.equal(await t.count(`${S} .zg-acc__b`), 0);
    await t.clickText(S, '.zg-acc__h', 'First');
    await t.waitFor(async () => (await t.count(`${S} .zg-acc__b`)) === 1, 'first panel');
    assert.equal(await t.text(`${S} .zg-acc__b`), 'Body A');
    assert.equal(await t.attr(`${S} .zg-acc__h`, 'aria-expanded'), 'true');
    await t.clickText(S, '.zg-acc__h', 'Second');
    await t.waitFor(async () => (await t.text(`${S} .zg-acc__b`)) === 'Body B', 'second panel replaces first');
    assert.equal(await t.count(`${S} .zg-acc__b`), 1);
    await t.clickText(S, '.zg-acc__h', 'Second');
    await t.waitFor(async () => (await t.count(`${S} .zg-acc__b`)) === 0, 'collapse');
  },

  async Dropdown(page, t) {
    const S = t.sel('Dropdown');
    assert.equal(await t.exists(`${S} [role=menu]`), false);
    await page.click(`${S} [aria-haspopup=menu]`);
    await t.waitFor(() => t.exists(`${S} [role=menu]`), 'menu');
    assert.equal(await t.count(`${S} [role=menuitem]`), 2);
    await t.clearSpy();
    await t.clickText(S, '[role=menuitem]', 'Edit');
    await t.waitFor(async () => !(await t.exists(`${S} [role=menu]`)), 'menu closes after choosing');
    const calls = await t.spy();
    assert.deepEqual(calls.map(c => c.label), ['edit', 'select']);
    assert.equal(calls[0].args[0].label, 'Edit');
    assert.deepEqual(calls[1].args, ['edit']);
    await page.click(`${S} [aria-haspopup=menu]`);
    await page.mouse.click(5, 5);
    await t.waitFor(async () => !(await t.exists(`${S} [role=menu]`)), 'outside click closes');
  },

  async TabsKeyboard(page, t) {
    const S = t.sel('Tabs'), tabs = `${S} [role=tab]`;
    const txt = () => page.evaluate(() => document.activeElement.textContent.trim());
    const idx = () => page.$$eval('[data-component="Tabs"] [data-variant="0"] [role=tab]', els => els.map(e => e.tabIndex));
    assert.deepEqual(await page.$$eval(tabs, els => els.map(e => e.tabIndex === 0)), await page.$$eval(tabs, els => els.map(e => e.getAttribute('aria-selected') === 'true')), 'roving tabindex: only the selected tab is in the tab order');
    await page.focus(`${tabs}:nth-child(1)`);
    await page.keyboard.press('ArrowRight'); assert.equal(await txt(), 'Two');
    assert.deepEqual(await idx(), [-1, 0, -1], 'tabindex follows focus');
    await page.keyboard.press('End'); assert.equal(await txt(), 'Three');
    await page.keyboard.press('ArrowRight'); assert.equal(await txt(), 'One', 'wraps to the first tab');
    await page.keyboard.press('ArrowLeft'); assert.equal(await txt(), 'Three', 'wraps to the last tab');
    await page.keyboard.press('Home'); assert.equal(await txt(), 'One');
    await page.keyboard.press('ArrowRight'); await t.clearSpy(); await page.keyboard.press('Enter');
    await t.waitFor(async () => (await t.lastModel()) === 'two', 'Enter activates the focused tab');
    await page.evaluate(() => { document.documentElement.dir = 'rtl'; });
    try {
      await page.focus(`${tabs}:nth-child(1)`);
      await page.keyboard.press('ArrowLeft'); assert.equal(await txt(), 'Two', 'ArrowLeft is "next" in RTL');
      await page.keyboard.press('ArrowRight'); assert.equal(await txt(), 'One', 'ArrowRight is "previous" in RTL');
    } finally { await page.evaluate(() => { document.documentElement.dir = 'ltr'; }); }
  },

  async PillTabs(page, t) {
    const S = t.sel('PillTabs'), tabs = `${S} [role=tab]`;
    const txt = () => page.evaluate(() => document.activeElement.textContent.trim());
    assert.deepEqual(await page.$$eval(tabs, els => els.map(e => e.tabIndex)), [0, -1, -1]);
    await page.focus(`${tabs}:nth-child(1)`);
    await page.keyboard.press('ArrowRight'); assert.equal(await txt(), 'Two');
    await page.keyboard.press('End'); assert.equal(await txt(), 'Three');
    await page.keyboard.press('Home'); assert.equal(await txt(), 'One');
  },

  async SegmentedKeyboard(page, t) {
    const S = t.sel('SegmentedControl');
    const txt = () => page.evaluate(() => document.activeElement.textContent.trim());
    assert.deepEqual(await page.$$eval(`${S} button`, els => els.map(e => e.tabIndex === 0)), await page.$$eval(`${S} button`, els => els.map(e => e.getAttribute('aria-pressed') === 'true')), 'only the pressed segment is in the tab order');
    await page.focus(`${S} button:nth-child(1)`);
    await page.keyboard.press('ArrowRight'); assert.equal(await txt(), 'Two');
    await page.keyboard.press('End'); assert.equal(await txt(), 'Three');
    await page.keyboard.press('ArrowLeft'); assert.equal(await txt(), 'Two');
    await t.clearSpy(); await page.keyboard.press('Space');
    await t.waitFor(async () => (await t.lastModel()) === 'two', 'Space presses the focused segment');
  },

  async SelectKeyboard(page, t) {
    const S = t.sel('Select'), T = `${S} .zg-select__trigger`;
    const txt = () => page.evaluate(() => document.activeElement.textContent.trim());
    const cur = await page.$eval(T, e => e.textContent.trim());
    await page.focus(T);
    await page.keyboard.press('ArrowDown');
    await t.waitFor(() => t.exists(`${S} [role=listbox]`), 'ArrowDown on the trigger opens the list');
    await t.waitFor(async () => (await txt()) === cur, 'focus moves to the selected option');
    await page.keyboard.press('Home'); assert.equal(await txt(), 'Alpha');
    await page.keyboard.press('ArrowDown'); assert.equal(await txt(), 'Beta');
    await page.keyboard.press('End'); assert.equal(await txt(), 'Gamma');
    await page.keyboard.press('ArrowDown'); assert.equal(await txt(), 'Gamma', 'listbox does not wrap');
    await page.keyboard.press('Home'); assert.equal(await txt(), 'Alpha');
    await page.keyboard.press('g'); assert.equal(await txt(), 'Gamma', 'type-ahead');
    await page.keyboard.press('Escape');
    await t.waitFor(async () => !(await t.exists(`${S} [role=listbox]`)), 'Escape closes');
    assert.ok(await t.activeIn(T), 'focus returns to the trigger');
    await page.keyboard.press('ArrowDown');
    await t.waitFor(() => t.exists(`${S} [role=listbox]`), 'reopen');
    await t.waitFor(async () => (await txt()) === cur, 'focus in list');
    await page.keyboard.press('Home'); await page.keyboard.press('ArrowDown'); await t.clearSpy(); await page.keyboard.press('Enter');
    await t.waitFor(async () => (await t.lastModel()) === 'b', 'Enter chooses Beta');
    await t.waitFor(async () => !(await t.exists(`${S} [role=listbox]`)), 'closes after Enter');
    assert.ok(await t.activeIn(T), 'focus returns to the trigger after choosing');
  },

  async TopNavSubmenu(page, t) {
    const S = t.sel('TopNav'), T = `${S} .zg-topnav__dd > .zg-navitem`;
    const txt = () => page.evaluate(() => document.activeElement.textContent.trim());
    assert.equal(await page.$eval(`${S} .zg-topnav__items`, n => getComputedStyle(n).maskImage), 'none', 'no edge fade on the item row');
    await page.click(T);
    await t.waitFor(() => t.exists(`${S} [role=menu]`), 'click opens the sub-menu');
    assert.equal(await page.$eval(T, n => n.getAttribute('aria-expanded')), 'true');
    await t.waitFor(async () => (await txt()).startsWith('Upcoming'), 'focus moves to the first child');
    await page.keyboard.press('ArrowDown'); assert.ok((await txt()).startsWith('Past'), 'separator is skipped');
    await page.keyboard.press('Escape');
    await t.waitFor(async () => !(await t.exists(`${S} [role=menu]`)), 'Escape closes');
    assert.ok(await t.activeIn(T), 'focus returns to the trigger');
    await page.keyboard.press('ArrowDown');
    await t.waitFor(() => t.exists(`${S} [role=menu]`), 'ArrowDown opens');
    await t.clearSpy(); await page.keyboard.press('Enter');
    await t.waitFor(async () => !(await t.exists(`${S} [role=menu]`)), 'choosing closes the menu');
    const calls = await t.spy();
    assert.ok(calls.some(c => JSON.stringify(c.args || []).includes('upcoming')), 'change called with the child value: ' + JSON.stringify(calls));
  },

  async DropdownKeyboard(page, t) {
    const S = t.sel('Dropdown'), T = `${S} [aria-haspopup=menu]`;
    const txt = () => page.evaluate(() => document.activeElement.textContent.trim());
    await page.focus(T);
    await page.keyboard.press('ArrowDown');
    await t.waitFor(() => t.exists(`${S} [role=menu]`), 'ArrowDown opens the menu');
    await t.waitFor(async () => (await txt()) === 'Edit', 'focus moves to the first item');
    await page.keyboard.press('ArrowDown'); assert.equal(await txt(), 'Delete', 'separator is skipped');
    await page.keyboard.press('ArrowDown'); assert.equal(await txt(), 'Edit', 'menu wraps');
    await page.keyboard.press('ArrowUp'); assert.equal(await txt(), 'Delete');
    await page.keyboard.press('Home'); assert.equal(await txt(), 'Edit');
    await page.keyboard.press('End'); assert.equal(await txt(), 'Delete');
    await page.keyboard.press('Escape');
    await t.waitFor(async () => !(await t.exists(`${S} [role=menu]`)), 'Escape closes');
    assert.ok(await t.activeIn(T), 'focus returns to the trigger');
    await page.keyboard.press('Enter');
    await t.waitFor(() => t.exists(`${S} [role=menu]`), 'Enter opens');
    await t.clearSpy(); await page.keyboard.press('Enter');
    await t.waitFor(async () => !(await t.exists(`${S} [role=menu]`)), 'Enter on an item closes');
    assert.ok((await t.spy()).some(c => c.label === 'edit'), 'item handler ran');
    assert.ok(await t.activeIn(T), 'focus returns to the trigger after choosing');
  },

  async MenuKeyboard(page, t) {
    const S = t.sel('Menu');
    const txt = () => page.evaluate(() => document.activeElement.textContent.trim());
    assert.deepEqual(await page.$$eval(`${S} [role=menuitem]`, els => els.map(e => e.tabIndex)), [0, -1, -1], 'one tab stop');
    await page.focus(`${S} [role=menuitem]`);
    await page.keyboard.press('ArrowDown'); assert.equal(await txt(), 'Paste', 'disabled item is skipped');
    await page.keyboard.press('ArrowDown'); assert.equal(await txt(), 'Open', 'wraps');
    await page.keyboard.press('End'); assert.equal(await txt(), 'Paste');
  },

  async Tooltip(page, t) {
    const S = `${t.sel('Tooltip')} .zg-tip`;
    const r = await page.$eval(S, el => { const d = document.getElementById(el.getAttribute('aria-describedby')); return d ? { role: d.getAttribute('role'), text: d.textContent } : null; });
    assert.deepEqual(r, { role: 'tooltip', text: 'Copies the link' }, 'aria-describedby points to a role=tooltip element with the text');
  },

  async CalendarToday(page, t) {
    const S = t.sel('Calendar');
    const want = await page.evaluate(() => new Date().getDate());
    await t.waitFor(async () => (await t.count(`${S} [data-today=true]`)) === 1, 'today is marked after mount');
    assert.equal(await t.text(`${S} [data-today=true]`), String(want), 'the marked day is the browser date');
    assert.equal(await t.attr(`${S} [data-today=true]`, 'aria-current'), 'date');
    const P = t.sel('Calendar', 1);
    assert.equal(await t.text(`${P} [data-today=true]`), '15', 'the today prop wins over the clock');
    assert.match(await t.text(`${P} .zg-cal__h b`), /March 2026/);
  },

  async TooltipEscape(page, t) {
    const S = `${t.sel('Tooltip')} .zg-tip`;
    const op = () => page.$eval(S, el => getComputedStyle(el, '::after').opacity);
    await page.mouse.click(5, 5);
    assert.equal(await op(), '0', 'hidden at rest');
    await page.hover(S);
    await t.waitFor(async () => (await op()) === '1', 'bubble on hover');
    const box = await (await page.$(S)).boundingBox();
    await page.mouse.move(box.x + box.width / 2, box.y - 5);
    await sleep(250);
    assert.equal(await op(), '1', 'stays visible while the pointer crosses the gap to the bubble');
    await page.keyboard.press('Escape');
    await t.waitFor(async () => (await op()) === '0', 'Escape hides the hovered bubble');
    assert.equal(await page.evaluate(() => document.activeElement === document.body), true, 'Escape does not move focus');
    await page.mouse.move(5, 5); await sleep(150);
    await page.hover(S);
    await t.waitFor(async () => (await op()) === '1', 'bubble returns on the next hover');
    await page.mouse.move(5, 5); await sleep(150);
    await page.keyboard.press('Tab'); await page.focus(S);
    await t.waitFor(async () => (await op()) === '1', 'bubble on focus');
    await page.keyboard.press('Escape');
    await t.waitFor(async () => (await op()) === '0', 'Escape hides the focused bubble');
    assert.equal(await page.evaluate(sel => document.activeElement === document.querySelector(sel), S), true, 'focus stays on the trigger');
  },

  async ComboboxKeyboard(page, t) {
    const S = t.sel('Combobox', 1), I = `${S} input`, ao = () => page.$eval(I, e => { const o = document.getElementById(e.getAttribute('aria-activedescendant')); return o ? o.textContent : null; });
    assert.equal(await t.attr(I, 'role'), 'combobox');
    assert.equal(await t.attr(I, 'aria-expanded'), 'false');
    assert.equal(await page.$eval(I, e => e.hasAttribute('aria-controls')), false, 'no aria-controls while closed');
    await page.focus(I);
    await t.waitFor(() => t.exists(`${S} [role=listbox]`), 'opens on focus');
    assert.equal(await t.attr(I, 'aria-expanded'), 'true');
    assert.equal(await page.$eval(I, e => e.getAttribute('aria-controls') === document.querySelector('[role=listbox]').id), true, 'aria-controls points to the listbox');
    assert.equal(await ao(), null, 'no active option before arrows');
    await page.keyboard.press('ArrowDown'); assert.equal(await ao(), 'Alpha');
    await page.keyboard.press('ArrowDown'); assert.equal(await ao(), 'Beta');
    await page.keyboard.press('ArrowUp'); await page.keyboard.press('ArrowUp'); assert.equal(await ao(), 'Gamma', 'wraps to the last option');
    assert.equal(await t.activeIn(I), true, 'real focus stays in the input');
    await t.clearSpy(); await page.keyboard.press('Enter');
    await t.waitFor(async () => (await t.lastModel()) === 'c', 'Enter chooses the active option');
    await t.waitFor(async () => !(await t.exists(`${S} [role=listbox]`)), 'list closes after Enter');
    assert.equal(await t.attr(I, 'aria-expanded'), 'false');
    assert.equal(await t.activeIn(I), true, 'focus stays in the input after choosing');
    await page.keyboard.press('ArrowDown');
    await t.waitFor(() => t.exists(`${S} [role=listbox]`), 'ArrowDown reopens the closed list');
    assert.equal(await ao(), 'Gamma', 'the chosen option is active on open');
    await page.keyboard.press('Escape');
    await t.waitFor(async () => !(await t.exists(`${S} [role=listbox]`)), 'Escape closes');
    assert.equal(await t.activeIn(I), true, 'focus stays in the input after Escape');
    await page.keyboard.press('ArrowDown'); await page.keyboard.type('be');
    await t.waitFor(async () => (await t.count(`${S} [role=option]`)) === 1, 'filter');
    await page.keyboard.press('ArrowDown'); assert.equal(await ao(), 'Beta');
  },

  async MultiSelectKeyboard(page, t) {
    const S = t.sel('MultiSelect', 1), T = `${S} .zg-select__trigger`;
    const txt = () => page.evaluate(() => document.activeElement.textContent.trim());
    await page.focus(T);
    await page.keyboard.press('ArrowDown');
    await t.waitFor(() => t.exists(`${S} [role=listbox]`), 'ArrowDown opens');
    await t.waitFor(async () => (await txt()) === 'Alpha', 'focus moves to the first selected option');
    await page.keyboard.press('ArrowDown'); assert.equal(await txt(), 'Beta');
    await page.keyboard.press('End'); assert.equal(await txt(), 'Gamma');
    await page.keyboard.press('ArrowDown'); assert.equal(await txt(), 'Gamma', 'does not wrap');
    await page.keyboard.press('Home'); await page.keyboard.press('b'); assert.equal(await txt(), 'Beta', 'type-ahead');
    await t.clearSpy(); await page.keyboard.press('Space');
    await t.waitFor(async () => JSON.stringify(await t.lastModel()) === '["a","b"]', 'Space toggles the option');
    assert.equal(await t.exists(`${S} [role=listbox]`), true, 'stays open while picking');
    assert.equal(await txt(), 'Beta', 'focus stays on the option');
    await page.keyboard.press('Escape');
    await t.waitFor(async () => !(await t.exists(`${S} [role=listbox]`)), 'Escape closes');
    assert.ok(await t.activeIn(T), 'focus returns to the trigger');
    await page.keyboard.press('ArrowDown');
    await t.waitFor(() => t.exists(`${S} [role=listbox]`), 'reopen');
    await page.keyboard.press('Tab');
    await t.waitFor(async () => !(await t.exists(`${S} [role=listbox]`)), 'Tab closes the list');
  },

  async DatePickerKeyboard(page, t) {
    const S = t.sel('DatePicker', 1), T = `${S} .zg-select__trigger`;
    const cur = () => page.evaluate(() => { const a = document.activeElement; return a && a.getAttribute('data-date'); });
    const key = async (k, want, why) => { await page.keyboard.press(k); await t.waitFor(async () => (await cur()) === want, `${why}: ${k} to reach ${want}, at ${await cur()}`); };
    await page.focus(T);
    await page.keyboard.press('ArrowDown');
    await t.waitFor(() => t.exists(`${S} .zg-cal`), 'ArrowDown opens the calendar');
    await t.waitFor(async () => (await cur()) === '2026-03-10', 'focus lands on the selected day');
    assert.equal(await page.$$eval(`${S} .zg-cal__d`, els => els.filter(e => e.tabIndex === 0).length), 1, 'one tab stop in the grid');
    await key('ArrowRight', '2026-03-11', 'next day');
    await key('ArrowDown', '2026-03-18', 'next week');
    await key('ArrowUp', '2026-03-11', 'previous week');
    await key('ArrowLeft', '2026-03-10', 'previous day');
    await key('Home', '2026-03-09', 'week start (Monday)');
    await key('End', '2026-03-15', 'week end (Sunday)');
    await key('PageDown', '2026-04-15', 'next month');
    assert.match(await t.text(`${S} .zg-cal__h b`), /April 2026/);
    await key('PageUp', '2026-03-15', 'previous month');
    await key('ArrowDown', '2026-03-22', 'week'); await key('ArrowDown', '2026-03-29', 'week');
    await key('ArrowDown', '2026-04-05', 'across the month end');
    assert.match(await t.text(`${S} .zg-cal__h b`), /April 2026/);
    await page.keyboard.down('Shift'); await page.keyboard.press('PageDown'); await page.keyboard.up('Shift');
    await t.waitFor(async () => (await cur()) === '2027-04-05', 'Shift+PageDown changes the year');
    await page.keyboard.down('Shift'); await page.keyboard.press('PageUp'); await page.keyboard.up('Shift');
    await t.waitFor(async () => (await cur()) === '2026-04-05', 'Shift+PageUp');
    await key('ArrowLeft', '2026-04-04', 'day'); await key('ArrowLeft', '2026-04-03', 'day');
    await t.clearSpy(); await page.keyboard.press('Enter');
    await t.waitFor(async () => (await t.lastModel()) === 'date:2026-04-03', 'Enter selects the focused day');
    await t.waitFor(async () => !(await t.exists(`${S} .zg-cal`)), 'closes after Enter');
    assert.ok(await t.activeIn(T), 'focus returns to the trigger after choosing');
    await page.keyboard.press('ArrowDown');
    await t.waitFor(() => t.exists(`${S} .zg-cal`), 'reopen');
    await t.waitFor(async () => (await cur()) === '2026-04-03', 'selected day is focused');
    await page.keyboard.press('ArrowRight');
    await page.keyboard.press('Escape');
    await t.waitFor(async () => !(await t.exists(`${S} .zg-cal`)), 'Escape closes');
    assert.ok(await t.activeIn(T), 'focus returns to the trigger after Escape');
    assert.equal(await t.lastModel(), 'date:2026-04-03', 'Escape does not change the value');
  },

  async TextField(page, t) {
    const S = `${t.sel('TextField')} input`;
    await page.click(S);
    await page.keyboard.type('Ahmed');
    await t.waitFor(async () => (await t.lastModel()) === 'Ahmed', 'model to equal typed text');
    assert.equal(await page.$eval(S, e => e.value), 'Ahmed', 'controlled input keeps the typed value');
    await page.keyboard.press('Backspace');
    await t.waitFor(async () => (await page.$eval(S, e => e.value)) === 'Ahme', 'backspace');
    assert.equal(await t.lastModel(), 'Ahme');
  },

  async CommandPalette(page, t) {
    const S = t.sel('CommandPalette');
    await page.click(`${S} .doc-preview > button`);
    await t.waitFor(() => t.exists(`${S} [role=dialog]`), 'palette to open');
    assert.equal(await page.evaluate(() => document.activeElement && document.activeElement.getAttribute('role')), 'combobox', 'search input is focused');
    assert.equal(await t.count(`${S} [role=option]`), 3);
    await page.keyboard.type('set');
    await t.waitFor(async () => (await t.count(`${S} [role=option]`)) === 1, 'filter');
    assert.equal(await t.text(`${S} [role=option]`), 'Settings');
    for (let i = 0; i < 3; i++) await page.keyboard.press('Backspace');
    await t.waitFor(async () => (await t.count(`${S} [role=option]`)) === 3, 'unfiltered');
    assert.equal(await t.attr(`${S} [role=option]:nth-child(1)`, 'aria-selected'), 'true');
    await page.keyboard.press('ArrowDown');
    await t.waitFor(async () => (await t.attr(`${S} [role=option]:nth-child(2)`, 'aria-selected')) === 'true', 'ArrowDown moves the highlight');
    await page.keyboard.press('ArrowUp'); await page.keyboard.press('ArrowUp');
    await t.waitFor(async () => (await t.attr(`${S} [role=option]:nth-child(3)`, 'aria-selected')) === 'true', 'ArrowUp wraps to the last');
    await page.keyboard.press('ArrowUp');
    await t.clearSpy();
    await page.keyboard.press('Enter');
    await t.waitFor(async () => !(await t.exists(`${S} [role=dialog]`)), 'palette closes on Enter');
    assert.deepEqual((await t.spy()).filter(c => c.label === 'run').map(c => c.args), [['find']]);
    // Escape path
    await page.click(`${S} .doc-preview > button`);
    await t.waitFor(() => t.exists(`${S} [role=dialog]`), 'reopen');
    await page.keyboard.press('Escape');
    await t.waitFor(async () => !(await t.exists(`${S} [role=dialog]`)), 'Escape closes');
  },

  async ContextMenu(page, t) {
    const S = t.sel('ContextMenu');
    assert.equal(await t.exists(`${S} [role=menu]`), false);
    const box = await page.evaluate(sel => { document.querySelector(sel).parentElement.scrollIntoView({ block: 'center' }); const r = document.createRange(); r.selectNodeContents(document.querySelector(sel)); const b = r.getBoundingClientRect(); return { x: b.x, y: b.y }; }, `${S} .zg-ctx`);
    await page.mouse.click(box.x + 10, box.y + 6, { button: 'right' });
    await t.waitFor(() => t.exists(`${S} [role=menu]`), 'context menu on right click (contextmenu event)');
    assert.equal(await t.count(`${S} [role=menuitem]`), 2);
    await t.clearSpy();
    await t.clickText(S, '[role=menuitem]', 'Copy');
    await t.waitFor(async () => !(await t.exists(`${S} [role=menu]`)), 'menu closes');
    assert.deepEqual((await t.spy()).map(c => [c.label, c.args]), [['ctx', ['copy']]]);
  },
};

async function dialogCheck(page, t, name, title, bodyText) {
  const S = t.sel(name), D = `${S} [role=dialog]`, OPEN = `${S} .doc-preview > button`;
  assert.equal(await t.exists(D), false, 'closed initially');
  const open = async () => { await page.click(OPEN); await t.waitFor(() => t.exists(D), `${name} to open`); };
  await open();
  assert.equal(await t.attr(D, 'aria-modal'), 'true');
  assert.equal(await t.attr(D, 'aria-label'), title);
  assert.ok((await t.text(D)).includes(bodyText));
  // focus moved inside, and Tab / Shift+Tab never leave
  await t.waitFor(() => t.activeIn(D), 'focus to move into the dialog');
  for (let i = 0; i < 7; i++) { await page.keyboard.press('Tab'); assert.ok(await t.activeIn(D), `Tab #${i + 1} left the dialog; focus is on ${await t.active()}`); }
  for (let i = 0; i < 7; i++) {
    await page.keyboard.down('Shift'); await page.keyboard.press('Tab'); await page.keyboard.up('Shift');
    assert.ok(await t.activeIn(D), `Shift+Tab #${i + 1} left the dialog; focus is on ${await t.active()}`);
  }
  // Escape closes and restores focus to the trigger
  await page.keyboard.press('Escape');
  await t.waitFor(async () => !(await t.exists(D)), 'Escape to close');
  await t.waitFor(async () => (await t.active()).startsWith('button:Open'), 'focus to return to the Open button, got ' + await t.active());
  // close button
  await open();
  await page.click(`${D} [aria-label="Close"]`);
  await t.waitFor(async () => !(await t.exists(D)), 'close button');
  // backdrop click
  await open();
  const r = await (await page.$(D)).boundingBox();
  await page.mouse.click(r.x > 40 ? r.x - 20 : r.x + r.width + 20 > 1260 ? 10 : r.x + r.width + 20, 10);
  await t.waitFor(async () => !(await t.exists(D)), 'backdrop click to close');
  // clicking inside must not close
  await open();
  await page.click(`${D} .zg-modal__body`);
  await sleep(100);
  assert.equal(await t.exists(D), true, 'click inside stays open');
  await page.keyboard.press('Escape');
}

// ---- run
const servers = await startServers(fws);
const browser = await launch();
const results = [];
for (const fw of fws) {
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 900 });
  await stubExternal(page);
  const bad = watch(page);
  await page.goto(`${servers[fw].url}/?data=cases&theme=dark`, { waitUntil: 'load' });
  await page.waitForFunction('window.__zg && window.__zg.done', { timeout: 60000 });
  const t = tools(page);
  for (const [name, fn] of Object.entries(checks)) {
    if (only && only !== name) continue;
    await t.clearSpy();
    await page.evaluate(() => { document.activeElement && document.activeElement.blur && document.activeElement.blur(); window.scrollTo(0, 0); });
    const before = bad.length;
    let err = null;
    try { await fn(page, t); } catch (e) { err = e; }
    await page.mouse.click(5, 5).catch(() => {}); await page.keyboard.press('Escape').catch(() => {});
    const noise = bad.slice(before);
    if (!err && noise.length) err = new Error('console/page problems during the case: ' + noise.map(n => n.kind + ' ' + n.text).join(' || '));
    results.push({ fw, name, err });
  }
  const preErrors = await page.evaluate(() => window.__zg.errors);
  if (preErrors.length) results.push({ fw, name: 'render', err: new Error(JSON.stringify(preErrors).slice(0, 400)) });
  await page.close();
}
await browser.close();
for (const s of Object.values(servers)) await s.server.close();

const failed = results.filter(r => r.err);
console.log(`\nInteractions: ${results.length - failed.length}/${results.length} passed (${fws.join(' + ')}; ${Object.keys(checks).length} scenarios each)`);
for (const r of results) console.log(`  ${r.err ? 'FAIL' : 'ok  '} ${r.fw.padEnd(5)} ${r.name}${r.err ? '\n         ' + String(r.err.message).split('\n').slice(0, 6).join('\n         ') : ''}`);
process.exit(failed.length ? 1 : 0);
