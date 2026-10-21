import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';
import { loadManifest } from './manifest.mjs';

const text = t => ({ content: [{ type: 'text', text: typeof t === 'string' ? t : JSON.stringify(t, null, 2) }] });
const fail = t => ({ isError: true, content: [{ type: 'text', text: t }] });

function fmtComponent(c) {
  const props = Object.entries(c.props || {}).map(([n, p]) => `- ${n}${p.required ? ' (required)' : ''}: ${p.type}${p.default !== undefined ? ` = ${JSON.stringify(p.default)}` : ''}${p.model ? ' [v-model]' : ''}. ${p.description || ''}`);
  const slots = Object.entries(c.slots || {}).map(([n, d]) => `- ${n}: ${d}`);
  const events = Object.entries(c.events || {}).map(([n, d]) => `- ${n}: ${d}`);
  return [`# ${c.tag} (${c.group})`, c.description, props.length ? '\n## Props\n' + props.join('\n') : '', slots.length ? '\n## Slots (Vue slot name = React prop, default = children)\n' + slots.join('\n') : '', events.length ? '\n## Events (React: onXxx)\n' + events.join('\n') : '', c.notes?.length ? '\n## Notes\n' + c.notes.map(n => '- ' + n).join('\n') : '',
    `\n## Import\nVue/Nuxt: import { ${c.tag} } from '@ziyarago/ui/vue'   (Nuxt module auto-imports it)\nReact: import { ${c.tag} } from '@ziyarago/ui/react'`].filter(Boolean).join('\n');
}

export async function startServer() {
  const m = loadManifest();
  const byName = new Map(m.components.map(c => [c.name.toLowerCase(), c]));
  const find = n => byName.get(String(n).replace(/^Ui/, '').toLowerCase());
  const server = new McpServer({ name: 'ziyarago-ui', version: m.version });

  server.tool('list_components', 'List @ziyarago/ui components, optionally for one group (typography, layout, actions, forms, data, feedback, overlay, navigation, media, domain, pages).', { group: z.string().optional() }, async ({ group }) => {
    const list = m.components.filter(c => !group || c.group === group);
    return text(list.map(c => `${c.tag} (${c.group}): ${c.description || ''}`).join('\n') || 'No components in that group. Groups: ' + m.groups.map(g => g.id).join(', '));
  });

  server.tool('search_components', 'Find components by keywords (name, purpose, prop names). Use first when you need a UI element.', { query: z.string(), limit: z.number().int().min(1).max(30).optional() }, async ({ query, limit = 10 }) => {
    const words = query.toLowerCase().split(/[^a-z0-9]+/).filter(w => w.length > 1);
    const scored = m.components.map(c => {
      const hay = { name: c.name.toLowerCase(), desc: (c.description || '').toLowerCase(), props: Object.keys(c.props || {}).join(' ').toLowerCase(), notes: (c.notes || []).join(' ').toLowerCase() };
      let s = 0; for (const w of words) { if (hay.name === w) s += 10; else if (hay.name.includes(w)) s += 5; if (hay.desc.includes(w)) s += 3; if (hay.props.includes(w)) s += 1; if (hay.notes.includes(w)) s += 1; }
      return { c, s };
    }).filter(x => x.s > 0).sort((a, b) => b.s - a.s).slice(0, limit);
    return text(scored.length ? scored.map(({ c }) => `${c.tag} (${c.group}): ${c.description || ''}`).join('\n') : 'No match. Try list_components.');
  });

  server.tool('get_component', 'Full API of one component: props with all allowed values and defaults, slots, events, notes, import lines. Always call this before using a component.', { name: z.string() }, async ({ name }) => {
    const c = find(name);
    return c ? text(fmtComponent(c)) : fail(`Unknown component "${name}". Use search_components.`);
  });

  server.tool('list_templates', 'List page templates (dashboard, CRM, bookings, catalog, detail, settings, auth, ...) with their slots.', {}, async () => text(m.templates.pages.map(p => `${p.component} [${p.id}]: ${p.description}\n  slots: ${p.slots.map(s => s.id).join(', ')}`).join('\n')));

  server.tool('get_template', 'Slot documentation for one page template: what each slot accepts, its props and an example.', { id: z.string() }, async ({ id }) => {
    const p = m.templates.pages.find(x => x.id === id || x.component.toLowerCase() === String(id).toLowerCase() || ('Ui' + x.component).toLowerCase() === String(id).toLowerCase());
    if (!p) return fail(`Unknown template "${id}". Use list_templates.`);
    const shell = p.shell ? `\nInside <UiAppShell nav="top|side" :items v-model>. Shell slots: ${m.templates.shell.map(s => s.id).join(', ')}.` : '\nFull-screen page (no app shell).';
    return text(`# ${p.component}: ${p.label}\n${p.description}${shell}\n\n` + p.slots.map(s => `## slot ${s.id}: ${s.title}\n${s.desc}\nAccepts: ${s.accepts.join(', ')}\n${s.props.map(x => `- ${x.name}: ${x.type}. ${x.desc}`).join('\n')}\nExample:\n${s.use}`).join('\n\n'));
  });

  server.tool('get_setup', 'Install and setup steps for vue, nuxt or react, plus theming.', { framework: z.enum(['vue', 'nuxt', 'react']) }, async ({ framework }) => {
    const base = 'npm i @ziyarago/ui';
    const f = { vue: "import '@ziyarago/ui/style.css'\nimport ui from '@ziyarago/ui/vue'\ncreateApp(App).use(ui).mount('#app')  // or import { UiButton } from '@ziyarago/ui/vue'", nuxt: "// nuxt.config.ts\nmodules: ['@ziyarago/ui/nuxt'],\nziyarago: { theme: { theme: 'dark', palette: 'gold', dir: 'ltr' } }\n// all Ui* components and useUiTheme() are auto-imported", react: "import '@ziyarago/ui/style.css'\nimport { UiButton, UiCard } from '@ziyarago/ui/react'" }[framework];
    return text(`${base}\n\n${f}\n\nTheme: import { useUiTheme } from '@ziyarago/ui/theme'; setTheme('dark'|'light'), setPalette('gold'|'tamam'), setDir('ltr'|'rtl'), setMotion('auto'|'on'|'off'), setEffects('auto'|'full'|'lite'), setBackground(name).\nConventions:\n${m.conventions.map(x => '- ' + x).join('\n')}`);
  });

  server.tool('suggest_ui', 'Given a UI task in plain words ("booking table with filters and status badges"), return candidate components and page templates to start from. You compose the result, then call get_component for each one you use.', { task: z.string() }, async ({ task }) => {
    const words = [...new Set(task.toLowerCase().split(/[^a-z0-9]+/).filter(w => w.length > 2))];
    const sc = list => list.map(c => ({ c, s: words.reduce((n, w) => n + ((c.name || c.label || '').toLowerCase().includes(w) ? 4 : 0) + (((c.description || '').toLowerCase()).includes(w) ? 2 : 0), 0) })).filter(x => x.s > 0).sort((a, b) => b.s - a.s);
    const comps = sc(m.components).slice(0, 12).map(({ c }) => `${c.tag}: ${c.description}`);
    const pages = sc(m.templates.pages).slice(0, 3).map(({ c }) => `${c.component}: ${c.description}`);
    return text(`Components:\n${comps.join('\n') || '(none, try search_components)'}\n\nPage templates:\n${pages.join('\n') || '(none)'}\n\nRules: use only documented props; style with var(--zg-*) tokens; one brand-filled element per view; wrap pages in UiAppShell when the app has navigation.`);
  });

  await server.connect(new StdioServerTransport());
}
