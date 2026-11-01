<script setup lang="ts">
import { PRO, PRO_NAMES } from '../../../src/meta/tiers.js'

useSeo({ title: 'Pro — @ziyarago/ui', description: 'What @ziyarago/ui-pro adds to the free core, how to install it in Vue, React, Nuxt and Vite, how Pro components are registered, the 13 extra languages and the glass-ui-kit compat layer.' })

const GROUP_TITLES: Record<string, string> = { layout: 'Layout', actions: 'Actions', forms: 'Forms', data: 'Data and charts', overlay: 'Overlays', media: 'Media', domain: 'Domain blocks', pages: 'Page templates' }
const groups = Object.entries(PRO as Record<string, string[]>).map(([id, names]) => ({ id, title: GROUP_TITLES[id] || id, names }))
const proTotal = (PRO_NAMES as Set<string>).size
const templates = (PRO as Record<string, string[]>).pages.length

const fw = ref<'vue' | 'react' | 'nuxt' | 'vite'>('vue')
const install = `npm i ./ziyarago-ui-pro-<version>.tgz
# or in package.json: "@ziyarago/ui-pro": "file:vendor/ziyarago-ui-pro-<version>.tgz"`
const vue = `import { createApp } from 'vue'
import '@ziyarago/ui/style.css'
import { UiButton } from '@ziyarago/ui/vue'
import { UiLineChart } from '@ziyarago/ui-pro/vue'   // one Pro component, nothing else is pulled in

// components imported by name work in templates without app.use()
createApp(App).mount('#app')`
const react = `import '@ziyarago/ui/style.css'
import { UiCard } from '@ziyarago/ui/react'
import { UiLineChart } from '@ziyarago/ui-pro/react'

export default function Stats({ series }) {
  return <UiCard title="Visits"><UiLineChart series={series} /></UiCard>
}`
const nuxt = `// nuxt.config.ts
export default defineNuxtConfig({
  modules: ['@ziyarago/ui/nuxt'],
  ziyarago: { plugins: ['@ziyarago/ui-pro'] },
})

// <UiLineChart /> and every other Pro tag is auto-imported, one import per tag you use`
const vite = `// vite.config.ts
import Components from 'unplugin-vue-components/vite'
import { ZiyaragoUiResolver } from '@ziyarago/ui/resolver'

export default defineConfig({
  plugins: [vue(), Components({ resolvers: [ZiyaragoUiResolver({ plugins: ['@ziyarago/ui-pro'] })] })],
})`
const code = computed(() => ({ vue, react, nuxt, vite })[fw.value])

const plugin = `import { createApp } from 'vue'
import ui from '@ziyarago/ui/vue'
import { UiLineChart } from '@ziyarago/ui-pro/vue'   // imported somewhere in the app: now registered

createApp(App).use(ui)
// app.use(ui) registers every core component and only the Pro components imported (UiLineChart here).
// A Pro tag that is never imported is not registered: Vue warns "Failed to resolve component".`
const definePro = `// what the Pro entry does for each component (generated, shown for add-on authors)
import { defineUiComponent } from '@ziyarago/ui/vue'
import { LineChartDef } from '../core/defs.pro.js'
export const UiLineChart = /*#__PURE__*/ defineUiComponent('LineChart', LineChartDef)`
const internal = `import { defineUiComponent } from '@ziyarago/ui/vue'     // or '@ziyarago/ui/react'
import { ButtonDef } from '@ziyarago/ui/internal'         // every built-in <Name>Def

const MyCardDef = { deps: () => ({ Button: ButtonDef }), render: ({ C, h }) => h(C.Button, null, 'Hi') }
export const UiMyCard = /*#__PURE__*/ defineUiComponent('MyCard', MyCardDef)`
const langs = `import '@ziyarago/ui-pro/languages'      // once, before the app mounts
import { setUiLocale } from '@ziyarago/ui/i18n'
setUiLocale('uz')`
const css = `import '@ziyarago/ui/style.css'
import '@ziyarago/ui-pro/style.css'   // after the core file`

const compatVite = `// vite.config.ts (the redirect plugin runs before vue())
import Components from 'unplugin-vue-components/vite'
import { ZiyaragoCompatResolver } from '@ziyarago/ui-pro/compat/resolver'
import { ziyaragoCompat } from '@ziyarago/ui-pro/compat/vite'

export default defineConfig({
  plugins: [
    ziyaragoCompat(),     // rewrites imports of ".../components/ui/..." to "@ziyarago/ui-pro/compat"
    vue(),
    Components({
      dirs: ['src/components'],
      resolvers: [ZiyaragoCompatResolver()],   // <UiInput>, <UiTable>, ... resolve to the compat wrappers
    }),
  ],
})`
const compatCfg = `import { configureCompat } from '@ziyarago/ui-pro/compat'

configureCompat({
  sizes: 'height',   // default: old pixel heights are kept (old md 48px renders as new lg)
  warn: true,        // dev warnings for props the new components cannot honour
})`
const compatTheme = `// src/composables/useTheme.ts
export { useTheme } from '@ziyarago/ui-pro/compat'`
const compatIcons = `import { setIconBase } from '@ziyarago/ui/vue'
setIconBase('/lucide/')   // copy node_modules/lucide-static/icons to public/lucide`
</script>

<template>
  <article class="g">
    <h1>Pro</h1>
    <p class="lead">@ziyarago/ui is MIT and complete for real products. <code>@ziyarago/ui-pro</code> is a separate package that adds {{ proTotal }} components and templates, 13 more interface languages and the migration layer from local glass-ui-kit copies. It plugs into the same registry, themes and tokens as the core.</p>

    <h2>Core and Pro</h2>
    <div class="cmp">
      <div class="cmp__c">
        <b>Core <code>@ziyarago/ui</code></b>
        <ul>
          <li>102 components and 6 page templates (Dashboard, Settings, UserList, Pricing, Auth, Status)</li>
          <li>Vue 3, Nuxt, React; tokens, themes, RTL</li>
          <li>English, Arabic and Russian strings</li>
          <li>MIT license; versions 0.1 to 0.10 stay MIT</li>
        </ul>
      </div>
      <div class="cmp__c">
        <b>Pro <code>@ziyarago/ui-pro</code></b>
        <ul>
          <li>{{ proTotal - templates }} components and {{ templates }} page templates</li>
          <li>Vue and React entries, one export per component</li>
          <li>Strings in en, ar and ru come with each component; 13 more languages in <code>@ziyarago/ui-pro/languages</code></li>
          <li>Compat layer: <code>/compat</code>, <code>/compat/resolver</code>, <code>/compat/vite</code></li>
          <li>Requires <code>@ziyarago/ui</code>; the package is received after purchase or by agreement</li>
        </ul>
      </div>
    </div>
    <p class="muted">Everything not listed below is in Core. The list is generated from the tier table of the library, the same one that marks components Pro in the catalog.</p>
    <div class="tbl">
      <div v-for="gr in groups" :key="gr.id" class="row">
        <b>{{ gr.title }} <span class="muted">({{ gr.names.length }})</span></b>
        <span><code v-for="n in gr.names" :key="n">{{ n }}</code></span>
      </div>
    </div>

    <h2>Install</h2>
    <p>You receive a tarball, <code>ziyarago-ui-pro-&lt;version&gt;.tgz</code>. Do not commit it to a public repository. Its version follows the core (Pro 0.22.x goes with @ziyarago/ui 0.22.x). The peer range of the tarball starts at the exact core version it was built against and ends before the next minor, so update both packages together.</p>
    <UiCode :code="install" title="terminal" />
    <UiAlert tone="info">Pro needs the core installed as well: <code>npm i @ziyarago/ui</code> and Vue 3.5+ or React 18+ (both are optional peers, install the one you use).</UiAlert>

    <h2>Set up</h2>
    <p>Import the core stylesheet once. Pro components are styled by it, so no extra CSS is required.</p>
    <UiSegmentedControl v-model="fw" :items="[{ value: 'vue', label: 'Vue' }, { value: 'react', label: 'React' }, { value: 'nuxt', label: 'Nuxt' }, { value: 'vite', label: 'Vite resolver' }]" />
    <UiCode :code="code" :title="fw" />
    <p class="muted"><code>@ziyarago/ui-pro/style.css</code> is reserved for Pro-only rules and can be imported after the core file; today every Pro class is already in <code>@ziyarago/ui/style.css</code>.</p>
    <UiCode :code="css" title="main.ts" />
    <p class="muted">The resolver and the Nuxt module read the list of Pro names from <code>@ziyarago/ui-pro/names</code>, so Pro has to be installed in the project that runs them. Without it Nuxt prints a warning and the Pro tags stay unresolved.</p>

    <h2>How registration works</h2>
    <ul class="list">
      <li>Every Pro export is created by <code>defineUiComponent(name, definition)</code>, annotated as pure. Importing <code>@ziyarago/ui-pro/vue</code> registers nothing by itself: a component is registered when its export is part of your bundle.</li>
      <li>A bundler therefore keeps only the Pro components you import, the core definitions they depend on (<code>deps</code>) and their strings. The same holds for the core since 0.21.0: a Vue app with only <code>UiButton</code> went from 32 KB to 4.7 KB gzip.</li>
      <li>Registration also feeds the shared registry, so a Pro component can use <code>C.Button</code> and core pages can reference it.</li>
      <li><code>app.use(ui)</code> from <code>@ziyarago/ui/vue</code> registers every core component plus only the Pro components that were imported. That is the one place where the whole core is included; for the smallest bundle import components by name.</li>
      <li>With the Nuxt module and the Vite resolver the import is generated per tag, so nothing needs to be imported by hand.</li>
    </ul>
    <UiCode :code="plugin" title="main.ts" />

    <h3>Writing your own add-on</h3>
    <p>The same API is public. <code>@ziyarago/ui/internal</code> exports every built-in <code>&lt;Name&gt;Def</code> and the helpers the definitions use; it is semi-internal and may change in a minor release. Definitions without <code>deps</code> still work through <code>defineUiComponents(defs)</code> but then load the whole core registry.</p>
    <UiCode :code="internal" title="my-addon.js" />
    <UiCode :code="definePro" title="@ziyarago/ui-pro/vue (generated)" />

    <h2>Languages</h2>
    <p>The strings of a Pro component in English, Arabic and Russian travel with the component. The other 13 (uz, tg, tr, fr, fa, hi, ur, bn, id, kk, ky, ms, ha) are one side-effect import. A missing language shows English. See <NuxtLink to="/docs/localization">Localization</NuxtLink> for switching, RTL and overrides.</p>
    <UiCode :code="langs" title="main.ts" />

    <h2>Migrating from glass-ui-kit (compat layer)</h2>
    <p>For apps that keep local copies of <code>@ziyarago/glass-ui-kit</code> as <code>src/components/ui/Ui*.vue</code>. The compat layer is Vue only and exports the OLD component names (<code>UiInput</code>, <code>UiTable</code>, <code>UiSidebar</code>, <code>useToast</code>, <code>useTheme</code> and more) as thin wrappers over the new components with the old props, slots and events. The plan has two phases, so nothing has to be rewritten on day one:</p>
    <ol class="list">
      <li>Switch the imports to <code>@ziyarago/ui-pro/compat</code> (automatically, with the resolver and the Vite plugin below) and delete <code>src/components/ui</code>.</li>
      <li>Move to the new names (<code>UiTextField</code>, <code>UiDataTable</code>, <code>UiSideNav</code> ...) one component at a time and drop the wrappers you no longer use.</li>
    </ol>
    <UiCode :code="compatVite" title="vite.config.ts" />
    <p class="muted">With the resolver the old tags in templates, and with the plugin the old script imports (<code>useToast</code>, types such as <code>SelectOption</code> and <code>TableColumn</code>), point to compat. The resolver wins over the local files, so you can test with <code>src/components/ui</code> still in place. If you use both resolvers, put <code>ZiyaragoCompatResolver()</code> before <code>ZiyaragoUiResolver()</code>.</p>
    <UiCode :code="compatCfg" title="main.ts" />
    <UiCode :code="compatTheme" title="useTheme.ts" />
    <p class="muted">The shim keeps the old <code>useTheme()</code> signature, sets both <code>data-theme</code> and the <code>.dark</code> class, and adopts the old stored value on first run. Built-in texts of the wrappers are translated through your vue-i18n keys when they exist and fall back to English.</p>
    <UiAlert tone="warning">The new components take icons by name and fetch Lucide icons from a CDN at runtime. Under <code>connect-src 'self'</code> self-host them before shipping:</UiAlert>
    <UiCode :code="compatIcons" title="main.ts" />
    <p class="muted">Also see <NuxtLink to="/docs/integration">Integration</NuxtLink> (Tailwind 4 layers, CSP) and <NuxtLink to="/docs/migration">Migration 0.20 to 0.22</NuxtLink>.</p>
  </article>
</template>

<style scoped>
.g { display: flex; flex-direction: column; gap: 16px; min-width: 0; }
.g h1 { margin: 0; font: 300 clamp(34px, 5vw, 52px) var(--zg-font); letter-spacing: -.03em; }
.g h2 { margin: 20px 0 0; font: 500 22px var(--zg-font); }
.g h3 { margin: 8px 0 0; font: 500 17px var(--zg-font); }
.lead { margin: 0; color: var(--zg-text-2); font-size: 17px; max-width: 70ch; }
.muted { margin: 0; color: var(--zg-text-3); font-size: 14px; line-height: 1.6; max-width: 80ch; }
.muted a, p a { color: var(--zg-brand-text); }
p { margin: 0; color: var(--zg-text-2); max-width: 75ch; line-height: 1.6; }
.list { margin: 0; padding-inline-start: 20px; display: flex; flex-direction: column; gap: 8px; color: var(--zg-text-2); max-width: 75ch; line-height: 1.6; }
code { font-family: var(--zg-font-mono); font-size: .92em; background: var(--zg-s2); padding: 1px 6px; border-radius: 6px; overflow-wrap: anywhere; }
.cmp { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 12px; }
.cmp__c { padding: 16px 18px; border-radius: 14px; box-shadow: inset 0 0 0 1px var(--zg-stroke); color: var(--zg-text-2); }
.cmp__c b { color: var(--zg-text-1); }
.cmp__c ul { margin: 10px 0 0; padding-inline-start: 18px; display: flex; flex-direction: column; gap: 6px; line-height: 1.5; font-size: 14px; }
.tbl { display: flex; flex-direction: column; border-radius: 14px; box-shadow: inset 0 0 0 1px var(--zg-stroke); overflow: hidden; }
.row { display: grid; grid-template-columns: minmax(150px, 220px) minmax(0, 1fr); gap: 16px; padding: 10px 16px; color: var(--zg-text-2); font-size: 14px; }
.row + .row { box-shadow: inset 0 1px 0 var(--zg-stroke); }
.row b { color: var(--zg-text-1); font-weight: 600; }
.row span:not(.muted) { display: flex; gap: 6px; flex-wrap: wrap; }
@media (max-width: 700px) { .row { grid-template-columns: minmax(0, 1fr); gap: 4px; } }
</style>
