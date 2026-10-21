#!/usr/bin/env node
// After `nuxt generate`: writes sitemap.xml and robots.txt into .output/public from the generated pages.
import { readdirSync, statSync, writeFileSync, readFileSync, existsSync } from 'node:fs';
import { join, relative, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const out = join(here, '../.output/public');
const site = (process.env.NUXT_PUBLIC_SITE_URL || 'https://ziyara.vip').replace(/\/$/, '');
const pkg = JSON.parse(readFileSync(join(here, '../../package.json'), 'utf8'));
const date = new Date().toISOString().slice(0, 10);

const urls = [];
(function walk(dir) {
  for (const f of readdirSync(dir)) {
    const p = join(dir, f);
    if (statSync(p).isDirectory()) { if (!['_nuxt', '3d'].includes(f)) walk(p); continue; }
    if (f !== 'index.html') continue;
    const html = readFileSync(p, 'utf8');
    if (/name="robots" content="noindex/.test(html)) continue;
    const route = '/' + relative(out, dirname(p)).replace(/\\/g, '/');
    urls.push(route === '/.' || route === '/' ? '/' : route);
  }
})(out);

const prio = u => (u === '/' ? '1.0' : u === '/docs' || u === '/docs/components' || u === '/docs/templates' ? '0.9' : u.startsWith('/docs/components/') ? '0.7' : '0.8');
const sorted = [...new Set(urls)].sort();
const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${sorted.map(u => `  <url><loc>${site}${u === '/' ? '/' : u}</loc><lastmod>${date}</lastmod><changefreq>weekly</changefreq><priority>${prio(u)}</priority></url>`).join('\n')}\n</urlset>\n`;
writeFileSync(join(out, 'sitemap.xml'), xml);
writeFileSync(join(out, 'robots.txt'), `User-agent: *\nAllow: /\n\nSitemap: ${site}/sitemap.xml\n`);
writeFileSync(join(out, 'version.json'), JSON.stringify({ version: pkg.version, built: new Date().toISOString() }) + '\n');
console.log(`sitemap.xml: ${sorted.length} URLs, robots.txt, version.json (${pkg.version})`);
