import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { fmt } from '../../src/core/index.js';

const THIN = ' ', NBSP = ' ';

describe('fmt.num', () => {
  test('groups thousands with a thin space', () => {
    assert.equal(fmt.num(0), '0');
    assert.equal(fmt.num(999), '999');
    assert.equal(fmt.num(1000), `1${THIN}000`);
    assert.equal(fmt.num(1234567), `1${THIN}234${THIN}567`);
  });
  test('rounds to integers, also for negatives', () => {
    assert.equal(fmt.num(1234.5), `1${THIN}235`);
    assert.equal(fmt.num(0.4), '0');
    assert.equal(fmt.num(-1234), `-1${THIN}234`);
  });
  test('placeholders: null, undefined and NaN give a dash, -1 means unlimited', () => {
    assert.equal(fmt.num(null), '—');
    assert.equal(fmt.num(undefined), '—');
    assert.equal(fmt.num(NaN), '—');
    assert.equal(fmt.num(-1), '∞');
  });
});

describe('fmt.sar', () => {
  test('prefixes SAR with a non-breaking space', () => {
    assert.equal(fmt.sar(0), `SAR${NBSP}0`);
    assert.equal(fmt.sar(1500), `SAR${NBSP}1${THIN}500`);
    assert.equal(fmt.sar(2499.6), `SAR${NBSP}2${THIN}500`);
  });
  test('placeholders', () => {
    assert.equal(fmt.sar(null), '—');
    assert.equal(fmt.sar(NaN), '—');
  });
});

describe('fmt.dur', () => {
  test('minutes and zero-padded seconds, default units', () => {
    assert.equal(fmt.dur(0), '0 m 00 s');
    assert.equal(fmt.dur(5), '0 m 05 s');
    assert.equal(fmt.dur(65), '1 m 05 s');
    assert.equal(fmt.dur(3600), '60 m 00 s');
  });
  test('custom (English and other) units', () => {
    assert.equal(fmt.dur(125, { m: 'min', s: 'sec' }), '2 min 05 sec');
    assert.equal(fmt.dur(61, { m: 'мин', s: 'сек' }), '1 мин 01 сек');
    assert.equal(fmt.dur(61, { m: 'min' }), '1 min 01 s', 'a missing unit falls back to the default');
  });
  test('accepts numeric strings, rounds, clamps negatives', () => {
    assert.equal(fmt.dur('90'), '1 m 30 s');
    assert.equal(fmt.dur(59.6), '1 m 00 s');
    assert.equal(fmt.dur(-30), '0 m 00 s');
  });
  test('placeholders', () => {
    assert.equal(fmt.dur(null), '—');
    assert.equal(fmt.dur(undefined), '—');
    assert.equal(fmt.dur('abc'), '—');
  });
});
