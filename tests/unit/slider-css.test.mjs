import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const css = f => readFileSync(new URL(`../../src/styles/${f}`, import.meta.url), 'utf8');

test('slider track and fill are drawn on the track pseudo-elements, not on the input box', () => {
  const base = css('components2.css');
  assert.match(base, /\.zg-range::-webkit-slider-runnable-track\{[^}]*var\(--c\)/, 'webkit fill uses --c');
  assert.match(base, /\.zg-range::-moz-range-progress\{/, 'firefox progress is styled');
  assert.match(base, /\.zg-range\{[^}]*background:none/, 'the input box itself has no background (a padded box paints a fat bar)');
});

test('the fill stop follows the thumb centre', () => {
  const base = css('components2.css');
  assert.match(base, /--c:calc\(var\(--zg-fm-box,22px\) \/ 2 \+ \(100% - var\(--zg-fm-box,22px\)\) \* var\(--pn,0\) \/ 100\)/);
});

test('every data-zg-p step also sets the numeric --zg-pn used by the fill', () => {
  const csp = css('csp.css');
  for (const n of [0, 1, 50, 99, 100]) assert.ok(csp.includes(`[data-zg-p="${n}"]{--zg-p:${n}%;--zg-pn:${n}}`), `step ${n}`);
  assert.ok(csp.includes('.zg-range{--p:var(--zg-p,0%);--pn:var(--zg-pn,0)}'));
});
