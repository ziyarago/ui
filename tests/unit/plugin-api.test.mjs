import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { registerComponents, components } from '../../src/core/index.js';
import { meta, registerMeta } from '../../src/meta/index.js';
import { isPro } from '../../src/meta/tiers.js';
import { ZiyaragoUiResolver } from '../../src/resolver.js';
import { defs, meta as fakeMeta, names } from '../fixtures/fake-pro/defs.js';

describe('plugin extension API', () => {
  test('registerComponents adds definitions and throws on a clash', () => {
    registerComponents(defs);
    assert.ok(components.FakeBadge && components.FakeAction);
    registerComponents({ FakeBadge: defs.FakeBadge });
    const other = { render: () => null };
    assert.throws(() => registerComponents({ FakeBadge: other }), /already registered/);
    assert.throws(() => registerComponents({ Button: other }), /already registered/);
    registerComponents({ FakeBadge: other }, { override: true });
    assert.equal(components.FakeBadge, other);
    registerComponents({ FakeBadge: defs.FakeBadge }, { override: true });
  });
  test('registerMeta adds metadata, tiers and groups', () => {
    registerMeta(fakeMeta, { tiers: names, groups: [{ id: 'fake', title: 'Fake', names }] });
    assert.equal(meta.FakeAction.description, 'Fake action built on Button');
    assert.ok(isPro('FakeBadge'));
  });
  test('resolver maps plugin names to the plugin module', () => {
    const r = ZiyaragoUiResolver({ plugins: [{ from: 'fake-pro/vue', names }] });
    assert.deepEqual(r.resolve('UiFakeBadge'), { name: 'UiFakeBadge', from: 'fake-pro/vue' });
    assert.equal(r.resolve('UiButton').from, '@ziyarago/ui/vue');
    assert.equal(r.resolve('UiNope'), undefined);
  });
});
