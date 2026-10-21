import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readdirSync } from 'node:fs';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { join, dirname } from 'node:path';
import { LOCALES, FREE_LOCALES, RTL_LOCALES, t, setUiLocale, setUiMessages, getUiLocale, isRtlLocale } from '../../src/i18n/index.js';
import '../../src/i18n/components/index.js';

const dir = join(dirname(fileURLToPath(import.meta.url)), '../../src/i18n/components');
const files = readdirSync(dir).filter(f => /^[A-Z]/.test(f));
const ph = s => (s.match(/\{\w+\}/g) || []).sort().join();

test('locale lists', () => {
  assert.equal(LOCALES.length, 16);
  assert.deepEqual([...FREE_LOCALES], ['en', 'ar', 'ru']);
  assert.deepEqual([...RTL_LOCALES].sort(), ['ar', 'fa', 'ur']);
});

test('every component file ships en, ar and ru with the same keys and placeholders, and nothing else', async () => {
  assert.ok(files.length > 60);
  for (const f of files) {
    const m = (await import(pathToFileURL(join(dir, f)).href)).default;
    assert.deepEqual(Object.keys(m).sort(), ['ar', 'en', 'ru'], f);
    for (const l of ['ar', 'ru']) {
      assert.deepEqual(Object.keys(m[l]).sort(), Object.keys(m.en).sort(), `${f} ${l} keys`);
      for (const k of Object.keys(m.en)) assert.equal(ph(m[l][k]), ph(m.en[k]), `${f} ${l}.${k} placeholders`);
    }
  }
});

test('t() follows the locale, falls back to English and honours overrides', () => {
  setUiLocale('en'); assert.equal(t('CopyButton', 'copy'), 'Copy');
  setUiLocale('ru'); assert.equal(t('CopyButton', 'copy'), 'Копировать');
  setUiLocale('ar'); assert.equal(t('CopyButton', 'copy'), 'نسخ');
  setUiLocale('uz'); assert.equal(getUiLocale(), 'uz'); assert.equal(t('CopyButton', 'copy'), 'Copy');
  setUiLocale('ru'); setUiMessages('ru', { CopyButton: { copy: 'Скопировать' } });
  assert.equal(t('CopyButton', 'copy'), 'Скопировать');
  setUiMessages('ru', null); assert.equal(t('CopyButton', 'copy'), 'Копировать');
  assert.equal(t('CopyButton', 'nope'), 'nope');
  setUiLocale('en');
});

test('RTL detection', () => {
  assert.ok(isRtlLocale('ar') && isRtlLocale('fa') && isRtlLocale('ur-PK'));
  assert.ok(!isRtlLocale('ru') && !isRtlLocale('en'));
});
