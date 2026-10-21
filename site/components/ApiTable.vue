<script setup lang="ts">
import { meta } from '@ziyarago/ui/meta'
const props = defineProps<{ name: string }>()
const m = computed<any>(() => (meta as Record<string, any>)[props.name])
const rows = computed(() => Object.entries(m.value?.props ?? {}) as [string, any][])
const slots = computed(() => Object.entries(m.value?.slots ?? {}) as [string, string][])
const events = computed(() => Object.entries(m.value?.events ?? {}) as [string, string][])
const dv = (v: unknown) => (typeof v === 'string' ? `'${v}'` : JSON.stringify(v))
</script>

<template>
  <section v-if="m" id="api" class="api">
    <h2>API reference</h2>
    <p class="api__d">{{ m.description }}</p>

    <template v-if="rows.length">
      <h3>Props</h3>
      <div class="api__tbl" role="table" aria-label="Props">
        <div class="api__row api__row--h" role="row"><span>Prop</span><span>Type and values</span><span>Default</span><span>Description</span></div>
        <div v-for="[n, p] in rows" :key="n" class="api__row" role="row">
          <span class="api__n"><code>{{ n }}</code><i v-if="p.required" class="api__req">required</i><i v-if="p.model" class="api__mod">v-model</i></span>
          <span class="api__t">
            <template v-if="p.values?.length"><span v-for="v in p.values" :key="String(v)" class="api__v">{{ v }}</span></template>
            <code v-else class="api__ty">{{ p.type }}</code>
            <code v-if="p.values?.length && !/^'/.test(p.type)" class="api__ty">{{ p.type }}</code>
          </span>
          <span class="api__def">{{ p.default !== undefined ? dv(p.default) : '—' }}</span>
          <span class="api__desc">{{ p.description }}</span>
        </div>
      </div>
    </template>

    <template v-if="slots.length">
      <h3>Slots</h3>
      <p class="api__hint">Vue: named slots. React: a prop with the same name; <code>default</code> is <code>children</code>.</p>
      <div class="api__tbl"><div v-for="[n, d] in slots" :key="n" class="api__row api__row--2"><span class="api__n"><code>{{ n }}</code></span><span class="api__desc">{{ d }}</span></div></div>
    </template>

    <template v-if="events.length">
      <h3>Events</h3>
      <p class="api__hint">Vue: <code>@name</code>. React: <code>onName</code>.</p>
      <div class="api__tbl"><div v-for="[n, d] in events" :key="n" class="api__row api__row--2"><span class="api__n"><code>{{ n }}</code></span><span class="api__desc">{{ d }}</span></div></div>
    </template>

    <template v-if="m.notes?.length">
      <h3>Notes</h3>
      <ul><li v-for="n in m.notes" :key="n">{{ n }}</li></ul>
    </template>
  </section>
</template>

<style scoped>
.api { display: flex; flex-direction: column; gap: 12px; margin-top: 24px; }
.api h2 { margin: 0; font: 500 24px var(--zg-font); }
.api h3 { margin: 12px 0 0; font: 600 14px var(--zg-font); letter-spacing: .04em; text-transform: uppercase; color: var(--zg-text-3); }
.api__d { margin: 0; color: var(--zg-text-2); line-height: 1.55; max-width: 80ch; }
.api__hint { margin: 0; font-size: 13px; color: var(--zg-text-3); }
.api__tbl { display: flex; flex-direction: column; border-radius: 18px; background: var(--zg-s1); box-shadow: var(--zg-rim); overflow: hidden; }
.api__row { display: grid; grid-template-columns: minmax(130px, .9fr) minmax(180px, 2fr) minmax(70px, .6fr) minmax(200px, 2.4fr); gap: 16px; padding: 12px 16px; align-items: start; font-size: 14px; }
.api__row + .api__row { box-shadow: inset 0 1px 0 var(--zg-stroke); }
.api__row--h { font: 600 11px var(--zg-font); letter-spacing: .08em; text-transform: uppercase; color: var(--zg-text-3); background: var(--zg-s2); }
.api__row--2 { grid-template-columns: minmax(130px, .9fr) minmax(0, 6fr); }
.api__n { display: flex; flex-wrap: wrap; gap: 6px; align-items: center; }
.api__n code { font: 600 13px var(--zg-font-mono); color: var(--zg-brand-text); }
.api__req, .api__mod { font: 600 10px var(--zg-font); letter-spacing: .04em; padding: 1px 6px; border-radius: 6px; font-style: normal; }
.api__req { background: color-mix(in oklch, var(--zg-red) 20%, transparent); color: var(--zg-red); }
.api__mod { background: var(--zg-brand-soft); color: var(--zg-brand-text); }
.api__t { display: flex; flex-wrap: wrap; gap: 6px; align-items: center; min-width: 0; }
.api__v { font: 500 12px var(--zg-font-mono); padding: 2px 8px; border-radius: 8px; background: var(--zg-s2); box-shadow: inset 0 0 0 1px var(--zg-stroke); }
.api__ty { font: 12px var(--zg-font-mono); color: var(--zg-sky-text); word-break: break-word; }
.api__def { font: 12px var(--zg-font-mono); color: var(--zg-text-2); }
.api__desc { color: var(--zg-text-2); line-height: 1.5; }
code { font-family: var(--zg-font-mono); background: var(--zg-s2); padding: 1px 5px; border-radius: 5px; font-size: .92em; }
ul { margin: 0; padding-inline-start: 20px; color: var(--zg-text-2); line-height: 1.7; }
@media (max-width: 800px) { .api__row, .api__row--2 { grid-template-columns: minmax(0, 1fr); gap: 4px; } .api__row--h { display: none; } }
</style>
