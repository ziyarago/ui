import { test } from 'node:test';
import assert from 'node:assert/strict';
import { cssUrl } from '../../src/core/components.js';

test('cssUrl quotes and escapes so odd file names still load', () => {
  assert.equal(cssUrl('/media/pizza.jpg'), 'url("/media/pizza.jpg")');
  assert.equal(cssUrl('/media/photo (1).jpg'), 'url("/media/photo (1).jpg")');
  assert.equal(cssUrl('/media/a,b c.jpg'), 'url("/media/a,b c.jpg")');
  assert.equal(cssUrl('x"y\\z'), 'url("x\\"y\\\\z")');
  assert.equal(cssUrl('a\nb'), 'url("a\\a b")');
});
