<script setup lang="ts">
const files = import.meta.glob('../../../docs/INTEGRATION.md', { query: '?raw', import: 'default', eager: true }) as Record<string, string>
const md = Object.values(files)[0] as string | undefined

useSeo({ title: 'Integration guide — @ziyarago/ui', description: 'Add @ziyarago/ui to Vite, Nuxt, Vue and React projects: install, styles, plugin, auto-import, theme and RTL setup.' })

const install = 'npm i @ziyarago/ui'
const vue = `import { createApp } from 'vue'
import '@ziyarago/ui/style.css'
import ui from '@ziyarago/ui/vue'

createApp(App).use(ui).mount('#app')`
const vueTree = `import '@ziyarago/ui/style.css'
import { UiButton, UiCard } from '@ziyarago/ui/vue'`
const nuxt = `// nuxt.config.ts
export default defineNuxtConfig({
  modules: ['@ziyarago/ui/nuxt'],
  ziyarago: { theme: { theme: 'dark', palette: 'gold', dir: 'ltr' } },
})`
const react = `import '@ziyarago/ui/style.css'
import { UiButton, UiCard } from '@ziyarago/ui/react'`
const theme = `import { useUiTheme } from '@ziyarago/ui/theme'

const ui = useUiTheme()
ui.setTheme('light')
ui.setLocale('ar') // dir="rtl"`
</script>

<template>
  <article class="g">
    <h1>Integration</h1>
    <template v-if="md">
      <SiteMarkdown :source="md" skip-title="Integration" />
    </template>
    <template v-else>
      <p class="lead">How to add the library to a project. The package is plain ES modules plus one CSS file, so any bundler that handles ESM and CSS imports works.</p>

      <h2>Install</h2>
      <UiCode :code="install" title="terminal" />
      <p class="muted">Vue 3.5+ or React 18+ is a peer dependency; <code>@nuxt/kit</code> is needed only for the Nuxt module. Node 18+ for tooling.</p>

      <h2>Vue 3 (Vite)</h2>
      <UiCode :code="vue" title="main.ts" />
      <p class="muted">The plugin registers every <code>Ui*</code> component globally. To import only what a file uses:</p>
      <UiCode :code="vueTree" title="Component.vue" />

      <h2>Nuxt 3 and 4</h2>
      <UiCode :code="nuxt" title="nuxt.config.ts" />
      <p class="muted">The module loads the styles, auto-imports every <code>Ui*</code> component and <code>useUiTheme()</code>, and writes an inline script that applies the saved theme before first paint, so there is no flash.</p>

      <h2>React</h2>
      <UiCode :code="react" title="App.tsx" />
      <p class="muted">Controlled inputs take <code>modelValue</code> and <code>onChange(value)</code>; slots become props with the same name.</p>

      <h2>Theme, palette and RTL</h2>
      <UiCode :code="theme" title="theme" />

      <UiAlert tone="info">The full guide with the Vite component resolver, Tailwind 4 coexistence and Next.js is being written. It will appear here when <code>docs/INTEGRATION.md</code> is added to the repository.</UiAlert>
    </template>
    <p class="muted">See also <NuxtLink to="/docs">Getting started</NuxtLink>, <NuxtLink to="/docs/theming">Theming</NuxtLink> and <NuxtLink to="/docs/ai">AI and MCP</NuxtLink>.</p>
  </article>
</template>

<style scoped>
.g { display: flex; flex-direction: column; gap: 16px; min-width: 0; }
.g h1 { margin: 0; font: 300 clamp(34px, 5vw, 52px) var(--zg-font); letter-spacing: -.03em; }
.g h2 { margin: 20px 0 0; font: 500 22px var(--zg-font); }
.lead { margin: 0; color: var(--zg-text-2); font-size: 17px; max-width: 70ch; }
.muted { margin: 0; color: var(--zg-text-3); font-size: 14px; line-height: 1.6; }
.muted a { color: var(--zg-brand-text); }
code { font-family: var(--zg-font-mono); font-size: .92em; background: var(--zg-s2); padding: 1px 6px; border-radius: 6px; }
</style>
