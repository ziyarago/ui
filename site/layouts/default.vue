<script setup lang="ts">
import { GROUPS } from '~/docs-data/groups'
const route = useRoute()
const version = useRuntimeConfig().public.version

const q = ref('')
const palette_ = ref(false)
const router = useRouter()
const commands = GROUPS.flatMap(g => g.names.map(n => ({ id: n, label: n, keywords: g.title, icon: 'box' })))
const MORE = [
  { label: 'Integration', value: '/docs/integration' }, { label: 'Theming', value: '/docs/theming' },
  { label: 'Colors', value: '/docs/colors' }, { label: 'Fonts', value: '/docs/fonts' }, { label: 'Backgrounds', value: '/docs/backgrounds' },
  { label: 'AI and MCP', value: '/docs/ai' }, { label: 'Accessibility', value: '/docs/accessibility' },
  { label: 'Changelog', value: '/docs/changelog' }, { label: 'Roadmap', value: '/docs/roadmap' },
]
const go2 = (it: string | { value: string }) => router.push(typeof it === 'string' ? it : it.value)
const go = (id: string) => router.push(`/docs/components/${id}`)
onMounted(() => {
  const onKey = (e: KeyboardEvent) => { if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); palette_.value = !palette_.value } }
  window.addEventListener('keydown', onKey)
  onBeforeUnmount(() => window.removeEventListener('keydown', onKey))
})
const wide = computed(() => /^\/docs\/templates\/.+/.test(route.path))
const isDocs = computed(() => route.path.startsWith('/docs') && !wide.value)
const sideOpen = ref(false)
watch(() => route.path, () => (sideOpen.value = false))
const groups = computed(() => GROUPS.map(g => ({ ...g, names: g.names.filter(n => !q.value || n.toLowerCase().includes(q.value.toLowerCase())) })).filter(g => g.names.length))
</script>

<template>
  <div class="site zg-root">
    <a class="skip" href="#main">Skip to content</a>
    <header class="top">
      <NuxtLink to="/" class="logo"><img src="/3d/logo.png" alt="" width="28" height="28"> ziyarago/ui <UiBadge>v{{ version }}</UiBadge></NuxtLink>
      <nav class="links" aria-label="Main">
        <NuxtLink to="/docs" :class="{ on: route.path === '/docs' }">Docs</NuxtLink>
        <NuxtLink to="/docs/components" :class="{ on: route.path.startsWith('/docs/components') }">Components</NuxtLink>
        <NuxtLink to="/docs/templates" :class="{ on: route.path.startsWith('/docs/templates') }">Templates</NuxtLink>
        <NuxtLink to="/pricing" :class="{ on: route.path === '/pricing' }">Pricing</NuxtLink>
        <UiDropdown class="more" label="More" icon="chevron-down" size="sm" :items="MORE" @select="go2" />
      </nav>
      <div class="ctl">
        <UiButton size="sm" class="search" aria-label="Search components" @click="palette_ = true"><span class="search__t">Search</span> <kbd class="zg-kbd">⌘K</kbd></UiButton>
        <ClientOnly><SiteSettings /><template #fallback><span class="ss-fb" /></template></ClientOnly>
        <UiButton v-if="isDocs" class="burger" size="sm" @click="sideOpen = !sideOpen">Menu</UiButton>
      </div>
    </header>

    <div :class="['body', { 'body--docs': isDocs, 'body--wide': wide }]">
      <aside v-if="isDocs" :class="['side', { 'side--open': sideOpen }]">
        <UiSearchInput v-model="q" placeholder="Search components" />
        <NuxtLink to="/docs" class="s-link">Getting started</NuxtLink>
        <NuxtLink to="/docs/integration" class="s-link">Integration</NuxtLink>
        <NuxtLink to="/docs/theming" class="s-link">Theming</NuxtLink>
        <NuxtLink to="/docs/colors" class="s-link">Colors</NuxtLink>
        <NuxtLink to="/docs/backgrounds" class="s-link">Backgrounds</NuxtLink>
        <NuxtLink to="/docs/fonts" class="s-link">Fonts</NuxtLink>
        <NuxtLink to="/docs/ai" class="s-link">AI and MCP</NuxtLink>
        <NuxtLink to="/docs/accessibility" class="s-link">Accessibility</NuxtLink>
        <NuxtLink to="/docs/changelog" class="s-link">Changelog</NuxtLink>
        <NuxtLink to="/docs/roadmap" class="s-link">Roadmap</NuxtLink>
        <NuxtLink to="/docs/components" class="s-link">All components</NuxtLink>
        <NuxtLink to="/docs/templates" class="s-link">Page templates</NuxtLink>
        <div v-for="g in groups" :key="g.id" class="s-group">
          <div class="s-title">{{ g.title }}</div>
          <NuxtLink v-for="n in g.names" :key="n" :to="`/docs/components/${n}`" class="s-link">{{ n }}</NuxtLink>
        </div>
      </aside>
      <main id="main" class="main" tabindex="-1"><slot /></main>
    </div>

    <UiCommandPalette :open="palette_" :commands="commands" placeholder="Search components" @close="palette_ = false" @run="go" />

    <footer class="foot">
      <span>© 2026 ZiyaraGo. MIT license.</span>
      <nav class="foot__l" aria-label="Footer">
        <NuxtLink to="/docs/changelog">Changelog</NuxtLink>
        <NuxtLink to="/docs/roadmap">Roadmap</NuxtLink>
        <NuxtLink to="/docs/accessibility">Accessibility</NuxtLink>
        <NuxtLink to="/docs/integration">Integration</NuxtLink>
      </nav>
      <span>Vue 3.5+ · Nuxt 3/4 · React 18+</span>
    </footer>
  </div>
</template>

<style scoped>
.site { min-height: 100vh; display: flex; flex-direction: column; }
.top { position: sticky; top: 0; z-index: 50; display: flex; align-items: center; gap: 14px; padding: 12px 20px; background: color-mix(in oklch, var(--zg-bg) 82%, transparent); backdrop-filter: blur(14px); box-shadow: inset 0 -1px 0 var(--zg-stroke); flex-wrap: wrap; }
.logo { display: inline-flex; align-items: center; gap: 8px; font-weight: 600; color: var(--zg-text-1); text-decoration: none; }
.links { display: flex; gap: 4px; flex-wrap: wrap; align-items: center; min-width: 0; }
.links a { padding: 8px 10px; border-radius: 10px; color: var(--zg-text-2); text-decoration: none; font-size: 15px; }
.links a:hover, .links a.on { color: var(--zg-text-1); background: color-mix(in oklch, var(--zg-text-1) 8%, transparent); }
.ctl { margin-inline-start: auto; display: flex; gap: 8px; flex-wrap: wrap; align-items: center; }
.burger { display: none; }
.foot__l { display: flex; gap: 14px; flex-wrap: wrap; }
.foot__l a:hover { color: var(--zg-text-1); }
.ss-fb { display: inline-block; width: 190px; height: 32px; }
@media (max-width: 1500px) { .search__t { display: none; } }
.skip { position: absolute; left: 8px; top: -48px; z-index: 300; padding: 10px 14px; border-radius: 10px; background: var(--zg-brand); color: var(--zg-on-brand); text-decoration: none; transition: top .15s; }
.skip:focus { top: 8px; }
.body { flex: 1; width: 100%; margin: 0; padding: 0 clamp(16px, 2.5vw, 40px); box-sizing: border-box; }
.body--docs { display: grid; grid-template-columns: 240px minmax(0, 1fr); gap: 40px; }
.side { position: sticky; top: 70px; align-self: start; max-height: calc(100vh - 80px); overflow: auto; padding: 24px 0; display: flex; flex-direction: column; gap: 2px; }
.s-group { display: flex; flex-direction: column; margin-top: 14px; }
.s-title { font-size: 12px; letter-spacing: .08em; text-transform: uppercase; color: var(--zg-text-3); padding: 6px 10px; }
.s-link { padding: 6px 10px; border-radius: 8px; color: var(--zg-text-2); text-decoration: none; font-size: 14px; }
.s-link:hover { color: var(--zg-text-1); background: color-mix(in oklch, var(--zg-text-1) 6%, transparent); }
.s-link.router-link-active { color: var(--zg-brand-text); background: var(--zg-brand-soft); }
.main { min-width: 0; padding: 32px 0 80px; }
.foot { display: flex; justify-content: space-between; gap: 12px; flex-wrap: wrap; padding: 20px; color: var(--zg-text-3); font-size: 13px; box-shadow: inset 0 1px 0 var(--zg-stroke); }
@media (max-width: 900px) {
  .body--docs { grid-template-columns: minmax(0, 1fr); gap: 0; }
  .burger { display: inline-flex; }
  .side { display: none; position: static; max-height: none; }
  .side--open { display: flex; }
}
</style>
