import { test } from 'node:test';
import assert from 'node:assert/strict';
import { place } from '../../src/core/float.js';

const vp = { vw: 1000, vh: 800 };
const rect = (left, top, w = 120, h = 40) => ({ left, top, right: left + w, bottom: top + h });

test('opens below the anchor with a 6px gap', () => {
  const p = place({ a: rect(100, 100), w: 200, h: 150, ...vp });
  assert.deepEqual([p.left, p.top, p.side, p.maxH], [100, 146, 'bottom', null]);
});

test('flips above when there is no room below but room above', () => {
  const p = place({ a: rect(100, 700), w: 200, h: 150, ...vp });
  assert.equal(p.side, 'top');
  assert.equal(p.top, 700 - 6 - 150);
});

test('stays below and limits the height when neither side fits', () => {
  const p = place({ a: rect(100, 300, 120, 40), w: 200, h: 900, ...vp });
  assert.equal(p.side, 'bottom');
  assert.equal(p.maxH, 800 - 340 - 6 - 8);
  assert.ok(p.top + p.maxH <= 800 - 8);
});

test('picks the roomier side when both are too small', () => {
  const p = place({ a: rect(100, 500, 120, 40), w: 200, h: 900, ...vp });
  assert.equal(p.side, 'top');
  assert.equal(p.maxH, 500 - 6 - 8);
});

test('clamps horizontally into the viewport', () => {
  assert.equal(place({ a: rect(950, 100, 40), w: 300, h: 100, ...vp }).left, 1000 - 300 - 8);
  assert.equal(place({ a: rect(-30, 100), w: 300, h: 100, ...vp }).left, 8);
});

test('start alignment mirrors in RTL', () => {
  const a = rect(400, 100, 120);
  assert.equal(place({ a, w: 300, h: 100, ...vp }).left, 400);
  assert.equal(place({ a, w: 300, h: 100, rtl: true, ...vp }).left, 520 - 300);
});

test('end alignment lines up the end edges and mirrors in RTL', () => {
  const a = rect(400, 100, 120);
  assert.equal(place({ a, w: 300, h: 100, align: 'end', ...vp }).left, 520 - 300);
  assert.equal(place({ a, w: 300, h: 100, align: 'end', rtl: true, ...vp }).left, 400);
});

test('a popup wider than the viewport is capped', () => {
  const p = place({ a: rect(100, 100), w: 1400, h: 100, ...vp });
  assert.equal(p.maxW, 984);
  assert.equal(p.left, 8);
});

test('point anchor (context menu) flips at the bottom edge', () => {
  const p = place({ a: { left: 500, right: 500, top: 780, bottom: 780 }, w: 200, h: 200, gap: 2, ...vp });
  assert.equal(p.side, 'top');
  assert.equal(p.top, 780 - 2 - 200);
});
