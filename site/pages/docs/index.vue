<script setup lang="ts">
useSeo({ title: 'Getting started with @ziyarago/ui', description: 'Install @ziyarago/ui and set it up in Vue 3, Nuxt or React: styles, components, theme and RTL in a few minutes.' })
const install = 'npm i @ziyarago/ui'
const vue = `import { createApp } from 'vue'
import '@ziyarago/ui/style.css'
import ui from '@ziyarago/ui/vue'
import App from './App.vue'

createApp(App).use(ui).mount('#app')

// or import only what you use
// import { UiButton, UiCard } from '@ziyarago/ui/vue'`
const nuxt = `// nuxt.config.ts
export default defineNuxtConfig({
  modules: ['@ziyarago/ui/nuxt'],
  ziyarago: { theme: { theme: 'dark', palette: 'gold', dir: 'ltr' } },
})

// every Ui* component and useUiTheme() are auto-imported`
const react = `import '@ziyarago/ui/style.css'
import { UiButton, UiCard } from '@ziyarago/ui/react'

export default function App() {
  return (
    <UiCard title="Hello">
      <UiButton variant="primary">Save</UiButton>
    </UiCard>
  )
}`
const theme = `import { useUiTheme } from '@ziyarago/ui/theme'

const ui = useUiTheme()
ui.setTheme('light')      // dark | light
ui.setPalette('tamam')    // gold | tamam
ui.setLocale('ar')        // dir="rtl" and the Arabic font`
const fw = ref<'vue' | 'nuxt' | 'react'>('vue')
const code = computed(() => ({ vue, nuxt, react })[fw.value])
</script>

<template>
  <article class="g">
    <h1>Getting started</h1>
    <p class="lead">One framework-neutral core, three ways to use it: Vue 3, Nuxt and React. Same component names, same props.</p>

    <h2>1. Install</h2>
    <UiCode :code="install" title="terminal" />
    <p class="muted">Vue 3.5+ or React 18+ is a peer dependency. Install the one you use. Node 18+ for tooling.</p>

    <h2>2. Set up</h2>
    <UiSegmentedControl v-model="fw" :items="[{ value: 'vue', label: 'Vue' }, { value: 'nuxt', label: 'Nuxt' }, { value: 'react', label: 'React' }]" />
    <UiCode :code="code" :title="fw" />

    <h2>3. Theme and direction</h2>
    <UiCode :code="theme" title="theme" />
    <p class="muted">The theme is stored in localStorage and written to <code>&lt;html&gt;</code> as <code>data-theme</code>, <code>data-palette</code> and <code>dir</code>. It is safe to call on the server.</p>

    <h2>Conventions</h2>
    <ul>
      <li>Controlled inputs: Vue <code>v-model</code>; React <code>modelValue</code> and <code>onChange(value)</code>.</li>
      <li>Slots: Vue named slots (<code>#actions</code>); React props with the same name (<code>actions</code>).</li>
      <li>Icons are Lucide names (<code>icon="search"</code>). They load from the network by default; self-host with <code>setIconBase('/icons/')</code>.</li>
      <li>CSS classes <code>zg-*</code> and variables <code>--zg-*</code> are public API.</li>
    </ul>

    <NuxtLink to="/docs/components"><UiButton variant="primary">Browse components</UiButton></NuxtLink>
  </article>
</template>

<style scoped>
.g { display: flex; flex-direction: column; gap: 16px; }
.g h1 { margin: 0; font: 300 clamp(34px, 5vw, 52px) var(--zg-font); letter-spacing: -.03em; }
.g h2 { margin: 20px 0 0; font: 500 22px var(--zg-font); }
.lead { margin: 0; color: var(--zg-text-2); font-size: 17px; max-width: 70ch; }
.muted { margin: 0; color: var(--zg-text-3); font-size: 14px; }
code { font-family: var(--zg-font-mono); font-size: .92em; background: var(--zg-s2); padding: 1px 6px; border-radius: 6px; }
ul { color: var(--zg-text-2); line-height: 1.7; padding-inline-start: 20px; margin: 0; }
a { text-decoration: none; align-self: flex-start; }
</style>
