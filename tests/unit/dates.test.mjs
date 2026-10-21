import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { pd as pd2 } from '../../src/core/components2.js';
import { pd as pd4 } from '../../src/core/components4.js';

for (const [file, pd] of [['components2 (Calendar, DatePicker)', pd2], ['components4 (RangeCalendar)', pd4]]) {
  describe('pd date parsing in ' + file, () => {
    test('empty values give null', () => {
      for (const v of [null, undefined, '']) assert.equal(pd(v), null);
    });
    test('ISO yyyy-mm-dd is parsed as a LOCAL date, not UTC', () => {
      const d = pd('2026-03-15');
      assert.equal(d.getFullYear(), 2026); assert.equal(d.getMonth(), 2); assert.equal(d.getDate(), 15);
      assert.equal(d.getHours(), 0);
    });
    test('surrounding whitespace is tolerated', () => {
      assert.equal(pd(' 2026-01-02 ').getDate(), 2);
    });
    test('Date objects pass through; invalid Date gives null', () => {
      const d = new Date(2026, 0, 5);
      assert.equal(pd(d), d);
      assert.equal(pd(new Date('nope')), null);
    });
    test('timestamps and other date strings', () => {
      assert.equal(pd(new Date(2026, 5, 1, 12).getTime()).getMonth(), 5);
      assert.equal(pd('2026-03-15T10:30:00').getHours(), 10);
      assert.equal(pd('garbage'), null);
    });
    test('month overflow in the ISO form follows Date semantics (no throw)', () => {
      const d = pd('2026-02-31');
      assert.ok(d instanceof Date && !isNaN(d));
    });
  });
}
