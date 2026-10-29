import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, cpSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { build } from 'esbuild';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');

// A bundler may drop modules that the package.json "sideEffects" field calls pure. The built-in component strings are registered by importing
// src/i18n/components/index.js for its side effect, so a production bundle that only uses the Vue adapter must still contain them.
test('built-in component strings survive tree shaking in an app bundle', async () => {
  const tmp = mkdtempSync(join(tmpdir(), 'zg-shake-'));
  try {
    const pkg = join(tmp, 'node_modules/@ziyarago/ui');
    mkdirSync(pkg, { recursive: true });
    cpSync(join(root, 'package.json'), join(pkg, 'package.json'));
    cpSync(join(root, 'src'), join(pkg, 'src'), { recursive: true });
    writeFileSync(join(tmp, 'entry.js'), "import { UiCopyButton } from '@ziyarago/ui/vue';\nwindow.x = UiCopyButton;\n");
    const out = await build({ entryPoints: [join(tmp, 'entry.js')], bundle: true, minify: true, write: false, format: 'esm', charset: 'utf8', external: ['vue'], logLevel: 'silent', treeShaking: true });
    const code = out.outputFiles[0].text;
    assert.ok(code.includes('Copy failed'), 'English string is in the bundle');
    assert.ok(code.includes('Скопировано'), 'Russian string is in the bundle');
  } finally { rmSync(tmp, { recursive: true, force: true }); }
});
