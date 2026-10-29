// Reads a packed tarball the way a customer receives it: extract to a temp dir, then inspect files.
import { execFileSync } from 'node:child_process';
import { mkdtempSync, readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, relative } from 'node:path';
import { pathToFileURL } from 'node:url';

export function extract(tgz) {
  const dir = mkdtempSync(join(tmpdir(), 'zg-tgz-'));
  execFileSync('tar', ['-xzf', tgz, '-C', dir]);
  return join(dir, 'package');
}

export function walk(dir, base = dir, out = []) {
  for (const n of readdirSync(dir)) {
    const p = join(dir, n);
    const s = statSync(p);
    if (s.isDirectory()) walk(p, base, out);
    else out.push({ path: relative(base, p).replace(/\\/g, '/'), size: s.size });
  }
  return out;
}

export const readJson = p => JSON.parse(readFileSync(p, 'utf8'));

/** Names of the icons shipped in the built-in set (keys of src/icons/builtin.js). */
export async function builtinIcons(pkgDir) {
  const f = join(pkgDir, 'src/icons/builtin.js');
  if (!existsSync(f)) return [];
  return Object.keys((await import(pathToFileURL(f).href)).default);
}

/** { Component: { en: [keys], ar: [...], ru: [...] , values: {en:{key:value}} } } from src/i18n/components/*.js of a package. */
export async function i18nKeys(pkgDir) {
  const dir = join(pkgDir, 'src/i18n/components');
  const out = {};
  if (!existsSync(dir)) return out;
  for (const f of readdirSync(dir)) {
    if (!/^[A-Z][A-Za-z0-9]*\.js$/.test(f)) continue;
    const m = (await import(pathToFileURL(join(dir, f)).href)).default;
    out[f.replace(/\.js$/, '')] = m;
  }
  return out;
}

/** Selectors of simple rules that set backdrop-filter in the (readable) dist CSS of a package. */
export function backdropSelectors(css) {
  const out = new Set();
  const re = /([^{}]+)\{([^{}]*)\}/g;
  let m;
  while ((m = re.exec(css))) {
    if (!/(^|;|\s)(-webkit-)?backdrop-filter\s*:\s*(?!none)/.test(m[2])) continue;
    for (let sel of m[1].split(',')) {
      sel = sel.replace(/\/\*[\s\S]*?\*\//g, '').trim();
      if (!sel || /^@/.test(sel) || /[:](hover|focus|active|disabled|checked|before|after|first|last|nth|not|has|where|is)|::|\[data-fx|\[data-open|\[data-state|\[aria-/.test(sel)) continue;
      out.add(sel);
    }
  }
  return [...out];
}
