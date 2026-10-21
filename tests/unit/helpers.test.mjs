import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { cx, DZ, dzp, dzf, dzb, setIconBase, ZG_ICON_BASE } from '../../src/core/components.js';
import { components } from '../../src/core/index.js';

describe('cx', () => {
  test('joins truthy class names only', () => {
    assert.equal(cx('a', false, null, undefined, 0, '', 'b'), 'a b');
    assert.equal(cx(), '');
  });
});

describe('size helpers', () => {
  test('DZ scale is monotonic from xs to xl with md = 1', () => {
    const order = ['xs', 'sm', 'md', 'lg', 'xl'].map(k => DZ[k]);
    assert.equal(DZ.md, 1);
    assert.deepEqual([...order].sort((a, b) => a - b), order);
  });
  test('dzp scales a base size by the size prop and rounds', () => {
    assert.equal(dzp({ size: 'md' }, 36), 36);
    assert.equal(dzp({ size: 'xs' }, 36), Math.round(36 * 0.82));
    assert.equal(dzp({ size: 'xl' }, 36), 45);
    assert.equal(dzp({}, 36), 36, 'no size = md');
    assert.equal(dzp({ size: 'bogus' }, 36), 36, 'unknown size = md');
  });
  test('dzf builds a calc() driven by --dz', () => {
    assert.equal(dzf(14), 'calc(14px*var(--dz,1))');
  });
  test('dzb maps size to the nested button size', () => {
    assert.deepEqual(['xs', 'sm', 'md', 'lg', 'xl', undefined, 'x'].map(s => dzb({ size: s })), ['xs', 'xs', 'sm', 'md', 'lg', 'sm', 'sm']);
  });
});

describe('icon base', () => {
  test('setIconBase normalises the trailing slash', async () => {
    const mod = await import('../../src/core/components.js');
    const before = mod.ZG_ICON_BASE;
    try {
      setIconBase('/icons'); assert.equal((await import('../../src/core/components.js')).ZG_ICON_BASE, '/icons/');
      setIconBase('/icons/'); assert.equal((await import('../../src/core/components.js')).ZG_ICON_BASE, '/icons/');
    } finally { setIconBase(before); }
  });
});

describe('component registry', () => {
  test('every definition has a render function; state is a plain object', () => {
    for (const [name, def] of Object.entries(components)) {
      assert.equal(typeof def.render, 'function', name);
      if (def.state) assert.equal(Object.getPrototypeOf(def.state), Object.prototype, name);
    }
  });
  test('component names are PascalCase and there are 196 of them', () => {
    const names = Object.keys(components);
    assert.ok(names.every(n => /^[A-Z][A-Za-z0-9]*$/.test(n)));
    assert.equal(names.length, 196);
  });
});
