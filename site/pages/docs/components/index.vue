<script setup lang="ts">
import { EXAMPLES } from '~/docs-data'
import { GROUPS } from '~/docs-data/groups'
useSeo({ title: '203 UI components for Vue, Nuxt and React — @ziyarago/ui', description: 'Browse 203 components with live previews, code for Vue and React, and full props tables: buttons, forms, tables, charts, overlays and more.' })
const total = GROUPS.reduce((n, g) => n + g.names.length, 0)
</script>

<template>
  <div class="idx">
    <h1>Components</h1>
    <p class="lead">{{ total }} components for Vue, Nuxt and React. Every page shows a live preview and the code for both frameworks.</p>
    <section v-for="g in GROUPS" :key="g.id" class="grp">
      <h2>{{ g.title }} <UiBadge>{{ g.names.length }}</UiBadge></h2>
      <p class="muted">{{ g.blurb }}</p>
      <div class="grid">
        <NuxtLink v-for="n in g.names" :key="n" :to="`/docs/components/${n}`" class="tile">
          <b>{{ n }}</b>
          <span v-if="EXAMPLES[n]">{{ EXAMPLES[n].variants.length }} example{{ EXAMPLES[n].variants.length > 1 ? 's' : '' }}</span>
          <span v-else class="muted">import only</span>
        </NuxtLink>
      </div>
    </section>
  </div>
</template>

<style scoped>
.idx h1 { margin: 0 0 8px; font: 300 clamp(34px, 5vw, 52px) var(--zg-font); letter-spacing: -.03em; }
.lead { margin: 0 0 32px; color: var(--zg-text-2); font-size: 17px; max-width: 70ch; }
.grp { margin-bottom: 40px; }
.grp h2 { margin: 0; font: 500 22px var(--zg-font); display: flex; align-items: center; gap: 10px; }
.muted { color: var(--zg-text-3); margin: 4px 0 14px; font-size: 14px; }
.grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(190px, 1fr)); gap: 10px; }
.tile { display: flex; flex-direction: column; gap: 4px; padding: 14px 16px; border-radius: 14px; background: var(--zg-s1); box-shadow: var(--zg-rim); text-decoration: none; color: var(--zg-text-1); }
.tile:hover { background: var(--zg-s2); }
.tile span { font-size: 12px; color: var(--zg-text-2); }
</style>
