#!/usr/bin/env node
// Generates dist/manifest.json, dist/llms.txt and dist/llms-full.txt from src/meta + groups. Run by npm run build.
import { writeFileSync, mkdirSync, readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { meta } from '../src/meta/index.js';
import { GROUPS } from '../src/meta/groups.js';
const templates = JSON.parse(readFileSync(new URL('../src/meta/templates.json', import.meta.url), 'utf8'));

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const pkg = JSON.parse(readFileSync(join(root, 'package.json'), 'utf8'));
mkdirSync(join(root, 'dist'), { recursive: true });

const components = GROUPS.flatMap(g => g.names.map(name => ({ name, tag: 'Ui' + name, group: g.id, ...meta[name] })));
const manifest = {
  name: pkg.name, version: pkg.version, homepage: 'https://ziyara.vip',
  imports: { vue: "import { UiButton } from '@ziyarago/ui/vue'", react: "import { UiButton } from '@ziyarago/ui/react'", nuxt: "modules: ['@ziyarago/ui/nuxt']", css: "import '@ziyarago/ui/style.css'", theme: "import { useUiTheme } from '@ziyarago/ui/theme'" },
  conventions: [
    'Component names are Ui<Name>. Vue and React share names and props.',
    'Controlled inputs: Vue v-model, React modelValue + onChange(value). Components that read value/page use :value + @change (React onChange).',
    'Slots: Vue named slots; React props with the same name, default slot = children.',
    'Sizes: size="xs|sm|md|lg|xl" (default md) where documented.',
    'Style only with tokens: var(--zg-*). Theme: data-theme dark|light, data-palette gold|tamam, dir ltr|rtl.',
    'Cards: variant default|inverse|gradient (tone, intensity soft|vivid).',
  ],
  groups: GROUPS.map(g => ({ id: g.id, title: g.title, blurb: g.blurb, components: g.names })),
  templates: { shell: templates.shell, footer: templates.footer, pages: templates.pages.map(p => ({ id: p.route, label: p.label, component: 'Ui' + p.component, description: p.desc, shell: p.shell, slots: p.slots })) },
  components,
};
writeFileSync(join(root, 'dist/manifest.json'), JSON.stringify(manifest, null, 1));

const propLine = (n, p) => `- \`${n}\`${p.required ? ' (required)' : ''}: ${p.type}${p.default !== undefined ? ` = ${JSON.stringify(p.default)}` : ''}${p.model ? ' [v-model]' : ''}. ${p.description || ''}`;
const full = c => [
  `## Ui${c.name}  (${c.group})`, c.description || '',
  ...(Object.keys(c.props || {}).length ? ['Props:', ...Object.entries(c.props).map(([n, p]) => propLine(n, p))] : []),
  ...(Object.keys(c.slots || {}).length ? ['Slots:', ...Object.entries(c.slots).map(([n, d]) => `- ${n}: ${d}`)] : []),
  ...(Object.keys(c.events || {}).length ? ['Events:', ...Object.entries(c.events).map(([n, d]) => `- ${n}: ${d}`)] : []),
  ...(c.notes?.length ? ['Notes:', ...c.notes.map(n => `- ${n}`)] : []),
  '',
].filter(x => x !== undefined).join('\n');

const head = `# ${pkg.name}\n\n> ${pkg.description}\n\nVersion ${pkg.version}. Docs: https://ziyara.vip . Manifest (machine readable): https://ziyara.vip/manifest.json\n\n## Setup\n${Object.values(manifest.imports).map(x => '- ' + x).join('\n')}\n\n## Conventions\n${manifest.conventions.map(x => '- ' + x).join('\n')}\n`;
const index = GROUPS.map(g => `\n## ${g.title}\n${g.blurb}\n${g.names.map(n => `- Ui${n}: ${meta[n]?.description || ''}`).join('\n')}`).join('\n');
writeFileSync(join(root, 'dist/llms.txt'), head + index + '\n\nPage templates: ' + templates.pages.map(p => `Ui${p.component} (${p.slots.map(s => s.id).join(', ')})`).join('; ') + '\n\nFull API of every component: llms-full.txt\n');
writeFileSync(join(root, 'dist/llms-full.txt'), head + '\n' + components.map(full).join('\n'));
console.log(`manifest: ${components.length} components, llms.txt ${(head.length + index.length) / 1024 | 0} KB, llms-full.txt ${(components.map(full).join('\n').length / 1024) | 0} KB`);
