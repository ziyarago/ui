<script setup lang="ts">
import { TEMPLATES } from '~/docs-data/templates'
useSeo({ title: 'Page templates — @ziyarago/ui', description: '23 ready page templates with named slots: dashboard, CRM, bookings, catalog, settings, auth and more, for Vue, Nuxt and React.' })
</script>

<template>
  <div class="ti">
    <h1>Page templates</h1>
    <p class="lead">{{ TEMPLATES.pages.length }} ready layouts with named slots. Open one to see it inside the app shell with top or side menu, click any block to inspect its slot, accepted components, props and an example.</p>
    <div class="grid">
      <NuxtLink v-for="p in TEMPLATES.pages" :key="p.key" :to="`/docs/templates/${p.route}`" class="tile">
        <span class="tile__t"><b>{{ p.label }}</b><UiBadge>{{ p.slots.length }} slots</UiBadge></span>
        <span class="tile__d">{{ p.desc }}</span>
        <code>Ui{{ p.component }}</code>
      </NuxtLink>
    </div>
  </div>
</template>

<style scoped>
.ti h1 { margin: 0 0 8px; font: 300 clamp(34px, 5vw, 52px) var(--zg-font); letter-spacing: -.03em; }
.lead { margin: 0 0 28px; color: var(--zg-text-2); font-size: 17px; max-width: 70ch; }
.grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 12px; }
.tile { display: flex; flex-direction: column; gap: 8px; padding: 18px; border-radius: 20px; background: var(--zg-s1); box-shadow: var(--zg-rim); text-decoration: none; color: var(--zg-text-1); }
.tile:hover { background: var(--zg-s2); }
.tile__t { display: flex; align-items: center; justify-content: space-between; gap: 8px; font-size: 17px; }
.tile__d { font-size: 13.5px; color: var(--zg-text-2); line-height: 1.5; }
.tile code { font: 600 12px var(--zg-font-mono); color: var(--zg-brand-text); }
</style>
