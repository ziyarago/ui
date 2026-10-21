import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { rules } from '../../src/core/index.js';

const ok = r => assert.equal(r, true);
const msg = r => { assert.equal(typeof r, 'string'); return r; };

describe('rules', () => {
  test('required: empty, null, blank string fail; 0 and false pass', () => {
    const r = rules.required();
    for (const v of [null, undefined, '', '   ']) msg(r(v));
    for (const v of ['a', 0, false, ' x ']) ok(r(v));
  });
  test('email', () => {
    const r = rules.email();
    ok(r('')); ok(r(undefined));
    ok(r('a@b.co')); ok(r('first.last+tag@sub.example.org'));
    for (const v of ['a', 'a@b', '@b.co', 'a b@c.de', 'a@b .co']) msg(r(v));
  });
  test('url', () => {
    const r = rules.url();
    ok(r('')); ok(r('https://ziyara.vip')); ok(r('http://a.co/x?y=1'));
    for (const v of ['ziyara.vip', 'ftp://a.co', 'https://nodot', 'javascript:alert(1)']) msg(r(v));
  });
  test('digits(n): exactly n digits', () => {
    const r = rules.digits(4);
    ok(r('')); ok(r('1234'));
    assert.match(msg(r('123')), /4/);
    msg(r('12345')); msg(r('12a4'));
  });
  test('alpha accepts unicode letters and spaces only', () => {
    const r = rules.alpha();
    ok(r('')); ok(r('Muhammad Ali')); ok(r('Ахмедов')); ok(r('محمد'));
    for (const v of ['a1', 'a_b', 'a-b', '1']) msg(r(v));
  });
  test('alphaDash', () => {
    const r = rules.alphaDash();
    ok(r('user_name-1')); ok(r('Имя'));
    msg(r('a b')); msg(r('a!'));
  });
  test('minLength / maxLength', () => {
    ok(rules.minLength(3)('abc')); msg(rules.minLength(3)('ab')); ok(rules.minLength(3)(''));
    ok(rules.maxLength(3)('abc')); msg(rules.maxLength(3)('abcd')); ok(rules.maxLength(3)(''));
  });
  test('range is inclusive and numeric', () => {
    const r = rules.range(1, 10);
    ok(r('1')); ok(r(10)); ok(r('5.5'));
    msg(r(0)); msg(r('11')); msg(r('abc'));
  });
  test('regex: custom message and default', () => {
    const r = rules.regex(/^[A-Z]{2}\d{2}$/, 'Bad code');
    ok(r('AB12')); assert.equal(r('ab12'), 'Bad code');
    assert.equal(rules.regex(/x/)('y'), 'Invalid format');
    ok(rules.regex(/x/)(''));
  });
  test('confirmed compares to the live getter value', () => {
    let pw = 'secret1A';
    const r = rules.confirmed(() => pw);
    ok(r('secret1A')); msg(r('other'));
    pw = 'changed'; ok(r('changed')); msg(r('secret1A'));
  });
  test('password: 8+ chars, a digit and a capital (latin or cyrillic)', () => {
    const r = rules.password();
    ok(r('')); ok(r('Abcdefg1')); ok(r('Пароль123'));
    for (const v of ['abcdefg1', 'Abcdefgh', 'Ab1', 'ABCDEFG1x'.slice(0, 7)]) msg(r(v));
  });
  test('every rule factory returns a validator that returns true or a string', () => {
    const samples = { required: [], email: [], url: [], digits: [3], alpha: [], alphaDash: [], minLength: [2], maxLength: [2], range: [0, 1], regex: [/a/], confirmed: [() => 'a'], password: [] };
    assert.deepEqual(Object.keys(rules).sort(), Object.keys(samples).sort(), 'a rule was added without a test');
    for (const [k, a] of Object.entries(samples)) for (const v of ['', 'a', 'zzzz', 5]) {
      const out = rules[k](...a)(v);
      assert.ok(out === true || typeof out === 'string', `${k}(${v})`);
    }
  });
});
