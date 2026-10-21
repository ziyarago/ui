#!/usr/bin/env node
// Builds an Atom feed (changelog.xml) from ../CHANGELOG.md into site/public and, when it exists, .output/public.
import { readFileSync, writeFileSync, mkdirSync, existsSync, statSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const root = join(here, '../..');
const site = (process.env.NUXT_PUBLIC_SITE_URL || 'https://ziyara.vip').replace(/\/$/, '');
const md = readFileSync(join(root, 'CHANGELOG.md'), 'utf8').replace(/\r\n?/g, '\n');
const esc = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const used = new Map();
const entries = [];
for (const part of md.split(/^(?=## )/m)) {
  const m = part.match(/^## (.*)\n/);
  if (!m || !/^\[?\d/.test(m[1])) continue;
  const title = m[1].replace(/\[([^\]]+)\]\([^)]*\)/g, '$1').trim();
  const ver = (m[1].match(/\b(\d+\.\d+\.\d+(?:-[\w.]+)?)\b/) || [])[1];
  let id = 'v' + ver;
  const n = (used.get(id) || 0) + 1; used.set(id, n); if (n > 1) id += '-' + n;
  const date = (m[1].match(/(\d{4}-\d{2}-\d{2})/) || [])[1];
  const body = part.slice(m[0].length).replace(/\(\[[0-9a-f]{7}\]\([^)]*\)\)/g, '').replace(/\[([^\]]+)\]\([^)]*\)/g, '$1').trim();
  entries.push({ id, ver, title, date, body });
}
const fallback = statSync(join(root, 'CHANGELOG.md')).mtime.toISOString();
const stamp = e => (e.date ? `${e.date}T00:00:00Z` : fallback);
const updated = entries.length ? entries.map(stamp).sort().pop() : fallback;

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<feed xmlns="http://www.w3.org/2005/Atom">
  <title>@ziyarago/ui changelog</title>
  <subtitle>Release notes for the ZiyaraGo UI library</subtitle>
  <link href="${site}/changelog.xml" rel="self" type="application/atom+xml"/>
  <link href="${site}/docs/changelog" rel="alternate" type="text/html"/>
  <id>${site}/docs/changelog</id>
  <updated>${updated}</updated>
  <author><name>ZiyaraGo</name></author>
${entries.map(e => `  <entry>
    <title>${esc(e.title)}</title>
    <link href="${site}/docs/changelog#${e.id}" rel="alternate" type="text/html"/>
    <id>${site}/docs/changelog#${e.id}</id>
    <updated>${stamp(e)}</updated>
    <content type="text">${esc(e.body)}</content>
  </entry>`).join('\n')}
</feed>
`;
for (const dir of [join(here, '../public'), join(here, '../.output/public')]) {
  if (dir.includes('.output') && !existsSync(dir)) continue;
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, 'changelog.xml'), xml);
}
console.log(`changelog.xml: ${entries.length} entries`);
