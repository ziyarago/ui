import { test } from 'node:test';
import assert from 'node:assert/strict';
import { ssrVue, ssrReact } from '../lib/ssr.mjs';

// "Today" comes from the browser clock after mount, so server HTML never marks a day: server and client cannot disagree near midnight.
for (const [fw, render] of [['vue', async (n, v) => (await ssrVue(n, v)).html], ['react', async (n, v) => ssrReact(n, v).html]]) {
  test(`Calendar (${fw}): no day is marked as today in server HTML`, async () => {
    const html = await render('Calendar', { props: { modelValue: '2026-03-10', locale: 'en-GB' } });
    assert.ok(!/data-today="true"/.test(html), 'data-today=true in SSR');
    assert.ok(!/aria-current/.test(html), 'aria-current in SSR');
  });
  test(`Calendar (${fw}): the today prop marks that day in server HTML`, async () => {
    const html = await render('Calendar', { props: { modelValue: '2026-03-10', today: '2026-03-15', locale: 'en-GB' } });
    assert.equal((html.match(/data-today="true"/g) || []).length, 1);
    assert.match(html, /data-date="2026-03-15"[^>]*aria-current="date"|aria-current="date"[^>]*data-date="2026-03-15"/);
  });
  test(`DatePicker (${fw}): renders closed with the today prop`, async () => {
    const html = await render('DatePicker', { props: { modelValue: '2026-03-10', today: '2026-03-15', locale: 'en-GB' } });
    assert.match(html, /10 Mar 2026/);
  });
}
