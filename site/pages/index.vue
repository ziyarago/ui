<script setup lang="ts">
import { isPro } from '../../src/meta/tiers.js'
import { GROUPS } from '~/docs-data/groups'
import { TEMPLATES } from '~/docs-data/templates'
useSeo({ title: '@ziyarago/ui — Vue, Nuxt and React UI components and page templates', description: 'Glass design system: 102 free components and 6 page templates for Vue 3, Nuxt and React, with 106 more components and 33 templates in Pro. OKLCH tokens, dark and light themes, RTL and Arabic, AI-ready catalog.' })

const { siteUrl, version } = useRuntimeConfig().public
useHead({ script: [{ type: 'application/ld+json', innerHTML: JSON.stringify({ '@context': 'https://schema.org', '@graph': [
  { '@type': 'Organization', '@id': siteUrl + '/#org', name: 'ZiyaraGo', url: 'https://ziyarago.com', logo: siteUrl + '/favicon.png' },
  { '@type': 'WebSite', '@id': siteUrl + '/#site', url: siteUrl + '/', name: '@ziyarago/ui', publisher: { '@id': siteUrl + '/#org' }, inLanguage: 'en' },
  { '@type': 'SoftwareSourceCode', name: '@ziyarago/ui', description: 'Glass design system for Vue 3, Nuxt and React: 102 free components and 6 page templates (106 components and 33 templates more in Pro).', codeRepository: 'https://github.com/ziyarago/ui', programmingLanguage: 'JavaScript', license: 'https://opensource.org/licenses/MIT', version, publisher: { '@id': siteUrl + '/#org' } },
] }) }] })
const total = GROUPS.reduce((n, g) => n + g.names.filter(x => !isPro(x)).length, 0)
const proTotal = GROUPS.reduce((n, g) => n + g.names.filter(isPro).length, 0)
const templatesCount = new Set(TEMPLATES.pages.map(p => p.component).filter(c => !isPro(c))).size
const proTemplates = new Set(TEMPLATES.pages.map(p => p.component).filter(isPro)).size
const install = 'npm i @ziyarago/ui'
const sw = ref(true)
const chk = ref(true)
const tab = ref('a')
const vol = ref(40)
const stars = ref(4)
const same = {
  vue: `<script setup>
import { UiCard, UiButton } from '@ziyarago/ui/vue'
<\/script>

<template>
  <UiCard title="Umrah package" subtitle="7 nights">
    <UiButton variant="primary">Book now</UiButton>
  </UiCard>
</template>`,
  react: `import { UiCard, UiButton } from '@ziyarago/ui/react'

export default () => (
  <UiCard title="Umrah package" subtitle="7 nights">
    <UiButton variant="primary">Book now</UiButton>
  </UiCard>
)`,
}
const features = [
  { icon: 'kaaba', title: `${total} free components`, text: `Actions, forms, data, feedback, overlays and navigation. Pro adds ${proTotal} more: Umrah, hotel and CRM blocks, charts, editors.` },
  { icon: 'logo', title: `${templatesCount} free page templates`, text: `Dashboard, settings, user list, pricing and auth, plus ${proTemplates} more in Pro. Fill named slots only.` },
  { icon: 'map', title: 'RTL and Arabic', text: 'Direction flips with one attribute. Thmanyah ships in the package.' },
  { icon: 'tour360', title: 'Tokens for any client', text: 'OKLCH CSS variables and tokens.json for Flutter and native apps.' },
]
</script>

<template>
  <div class="land">
    <section class="hero">
      <div class="hero__t">
        <UiBadge tone="brand">Vue 3 · Nuxt · React 18</UiBadge>
        <h1>Vue, Nuxt &amp; React <span class="grad">UI components</span> and patterns</h1>
        <p>A glass design system for Umrah and Hajj products. One core, adapters for each framework, {{ total }} free components, {{ templatesCount }} free page templates (Pro: {{ proTotal }} components, {{ proTemplates }} templates), dark and light, RTL and Arabic.</p>
        <div class="row">
          <NuxtLink to="/docs"><UiButton variant="primary" size="lg">Get started</UiButton></NuxtLink>
          <NuxtLink to="/docs/components"><UiButton size="lg">Browse components</UiButton></NuxtLink>
          <a href="#customize"><UiButton size="lg" variant="ghost">Customize live</UiButton></a>
        </div>
        <div class="install"><UiCode :code="install" title="terminal" /></div>
      </div>
      <HeroStage class="hero__s" />
    </section>

    <section class="mosaic" aria-label="Component preview">
      <UiCard title="Buttons"><div class="row"><UiButton variant="primary">Primary</UiButton><UiButton>Secondary</UiButton><UiButton variant="ghost">Ghost</UiButton></div></UiCard>
      <UiCard title="Form">
        <UiVStack :gap="12">
          <UiTextField label="Email" placeholder="you@example.com" />
          <UiSwitch v-model="sw" label="Notifications" />
          <UiCheckbox v-model="chk" label="Remember me" />
        </UiVStack>
      </UiCard>
      <UiCard title="Feedback">
        <UiVStack :gap="12">
          <UiAlert tone="success" title="Saved">Your changes are live.</UiAlert>
          <UiProgress :value="68" label="Upload" meta="68%" />
        </UiVStack>
      </UiCard>
      <UiCard title="Navigation">
        <UiVStack :gap="12">
          <UiTabs v-model="tab" :items="[{ value: 'a', label: 'Overview' }, { value: 'b', label: 'Bookings' }, { value: 'c', label: 'Team' }]" />
          <div class="row"><UiAvatar name="Shaxzod A" /><UiBadge tone="success" dot>Online</UiBadge><UiBadge>Admin</UiBadge></div>
        </UiVStack>
      </UiCard>
      <UiKpiTile label="Bookings" value="1 248" />
      <UiCard title="Inputs">
        <UiVStack :gap="14">
          <UiSlider v-model="vol" />
          <UiRating v-model="stars" />
        </UiVStack>
      </UiCard>
    </section>

    <section class="sec">
      <h2>Same code for Vue, Nuxt and React</h2>
      <p class="muted">Same component names and props. Vue uses <code>v-model</code> and named slots; React uses <code>modelValue</code>, <code>onChange</code> and slot props.</p>
      <CodeTabs :vue="same.vue" :react="same.react" />
    </section>

    <LiveCustomize />

    <section class="sec">
      <h2>What is inside</h2>
      <div class="feat">
        <UiCard v-for="f in features" :key="f.title" :title="f.title">
          <img :src="`/3d/${f.icon}.png`" alt="" width="56" height="56">
          <p class="muted">{{ f.text }}</p>
        </UiCard>
      </div>
    </section>

    <section class="sec">
      <h2>Components by group</h2>
      <div class="chips">
        <NuxtLink v-for="g in GROUPS" :key="g.id" :to="`/docs/components#${g.id}`" class="chip"><b>{{ g.title }}</b><span>{{ g.names.length }}</span></NuxtLink>
      </div>
    </section>
  </div>
</template>

<style scoped>
.land { display: flex; flex-direction: column; gap: 80px; padding: 64px 0 40px; }
.hero { display: grid; grid-template-columns: minmax(0, 1.05fr) minmax(0, .95fr); gap: 40px; align-items: center; }
.hero__t { display: flex; flex-direction: column; align-items: flex-start; gap: 20px; }
.grad { background: linear-gradient(100deg, var(--zg-brand-text), var(--zg-sky-text), oklch(0.72 0.17 320), var(--zg-brand-text)); background-size: 300% 100%; -webkit-background-clip: text; background-clip: text; color: transparent; }
[data-motion="on"] .grad { animation: grad-shift 9s linear infinite; }
@keyframes grad-shift { to { background-position: -300% 0; } }
@media (max-width: 980px) { .hero { grid-template-columns: minmax(0, 1fr); } }
.hero h1 { margin: 0; font: 300 clamp(38px, 6.5vw, 68px) / 1.04 var(--zg-font); letter-spacing: -.035em; }
.hero p { margin: 0; font-size: 19px; line-height: 1.5; color: var(--zg-text-2); max-width: 60ch; }
.row { display: flex; gap: 12px; flex-wrap: wrap; align-items: center; }
.install { width: min(100%, 360px); }
a { text-decoration: none; color: inherit; }
.mosaic { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 16px; align-items: start; }
.sec { display: flex; flex-direction: column; gap: 16px; }
.sec h2 { margin: 0; font: 300 clamp(28px, 4vw, 40px) var(--zg-font); letter-spacing: -.02em; }
.muted { color: var(--zg-text-2); margin: 0; line-height: 1.55; max-width: 70ch; }
code { font-family: var(--zg-font-mono); font-size: .92em; background: var(--zg-s2); padding: 1px 6px; border-radius: 6px; }
.feat { display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 16px; }
.chips { display: flex; flex-wrap: wrap; gap: 10px; }
.chip { display: inline-flex; align-items: center; gap: 10px; padding: 10px 16px; border-radius: 999px; background: var(--zg-s1); box-shadow: var(--zg-rim); }
.chip span { color: var(--zg-text-3); font-size: 13px; }
</style>
