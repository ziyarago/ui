<script setup lang="ts">
useSeo({ title: 'AI and MCP server — @ziyarago/ui', description: 'Connect Claude Code, Cursor and other AI tools to the component catalog with the @ziyarago/ui-mcp server, llms.txt and manifest.json.' })
const init = `npm i @ziyarago/ui
npx @ziyarago/ui-mcp init`
const initOut = `.mcp.json                          MCP server entry
AGENTS.md / CLAUDE.md              rules: use the library, check props, use tokens
.claude/skills/ziyarago-ui/        Claude skill
.cursor/rules/ziyarago-ui.mdc      Cursor rule`
const manual = `claude mcp add ziyarago-ui -- npx -y @ziyarago/ui-mcp`
const json = `{ "mcpServers": { "ziyarago-ui": { "command": "npx", "args": ["-y", "@ziyarago/ui-mcp"] } } }`
const rules = `## UI: @ziyarago/ui
Build interfaces with @ziyarago/ui. Do not write custom components or raw CSS for things the library has.
1. suggest_ui / search_components / list_templates to find what to use.
2. Start from a page template when one fits; wrap app pages in UiAppShell.
3. get_component for EVERY component before using it; use only documented props.
4. Style with var(--zg-*) tokens. Sizes: size="xs|sm|md|lg|xl".
5. One brand-filled element per view. Check light, dark and RTL.`
const tools = [
  ['suggest_ui', 'Components and page templates for a task in plain words'],
  ['search_components', 'Keyword search over names, purposes and props'],
  ['list_components', 'Every component, optionally per group'],
  ['get_component', 'Full API: props with every allowed value, defaults, slots, events, notes'],
  ['list_templates', 'Page templates and their slots'],
  ['get_template', 'What each slot of a template accepts, with props and an example'],
  ['get_setup', 'Install and setup for Vue, Nuxt or React'],
]
const prompts = [
  'Build a bookings page: table with filters, status badges and bulk actions.',
  'Redesign this settings screen with the library, keep dark and light theme working.',
  'Add a date range picker and a price slider to the catalog filters.',
]
</script>

<template>
  <article class="g">
    <h1>AI and MCP</h1>
    <p class="lead">Plug the library into a project and let your AI coding tool find components, read their props and assemble screens on its own. The library ships a machine-readable catalog; an MCP server serves it to Claude Code, Cursor, Windsurf, Zed and VS Code.</p>

    <h2>1. Set up a project</h2>
    <UiCode :code="init" title="terminal" />
    <UiCode :code="initOut" title="creates" />
    <p class="muted">Restart the AI tool to load the server. Or add it by hand:</p>
    <UiCode :code="manual" title="Claude Code" />
    <UiCode :code="json" title=".mcp.json (Cursor, Windsurf, VS Code)" />

    <h2>2. What the AI can do</h2>
    <div class="tbl"><div v-for="[n, d] in tools" :key="n" class="row"><code>{{ n }}</code><span>{{ d }}</span></div></div>
    <p class="muted">Try: </p>
    <ul><li v-for="p in prompts" :key="p">{{ p }}</li></ul>

    <h2>3. Without MCP</h2>
    <ul>
      <li><a href="/llms.txt">/llms.txt</a>: the index with one line per component and template.</li>
      <li><a href="/llms-full.txt">/llms-full.txt</a>: every prop, value, slot and event (about 110 KB).</li>
      <li><a href="/manifest.json">/manifest.json</a>: the same as JSON. Also in the package: <code>@ziyarago/ui/manifest.json</code>, <code>@ziyarago/ui/llms.txt</code>, <code>@ziyarago/ui/llms-full.txt</code>.</li>
    </ul>

    <h2>4. Rules for the agent</h2>
    <p class="muted"><code>init</code> writes this into AGENTS.md. Paste it into any tool that reads project instructions.</p>
    <UiCode :code="rules" title="AGENTS.md" />

    <h2>Why it works</h2>
    <p class="muted">The catalog is generated from the same metadata that builds the props tables in these docs and is checked against the component code on every release, so the AI sees exactly what the installed version accepts. The MCP server reads the manifest of the version in the project's <code>node_modules</code>.</p>
  </article>
</template>

<style scoped>
.g { display: flex; flex-direction: column; gap: 14px; }
.g h1 { margin: 0; font: 300 clamp(34px, 5vw, 52px) var(--zg-font); letter-spacing: -.03em; }
.g h2 { margin: 22px 0 0; font: 500 22px var(--zg-font); }
.lead { margin: 0; color: var(--zg-text-2); font-size: 17px; max-width: 75ch; line-height: 1.55; }
.muted { margin: 0; color: var(--zg-text-3); font-size: 14px; line-height: 1.55; max-width: 80ch; }
code { font-family: var(--zg-font-mono); font-size: .9em; background: var(--zg-s2); padding: 1px 6px; border-radius: 6px; }
a { color: var(--zg-brand-text); }
ul { color: var(--zg-text-2); line-height: 1.8; padding-inline-start: 20px; margin: 0; }
.tbl { display: flex; flex-direction: column; border-radius: 18px; background: var(--zg-s1); box-shadow: var(--zg-rim); overflow: hidden; }
.row { display: grid; grid-template-columns: 200px minmax(0, 1fr); gap: 16px; padding: 12px 16px; font-size: 14px; color: var(--zg-text-2); }
.row + .row { box-shadow: inset 0 1px 0 var(--zg-stroke); }
.row code { align-self: start; color: var(--zg-brand-text); font-weight: 600; }
@media (max-width: 700px) { .row { grid-template-columns: 1fr; gap: 4px; } }
</style>
