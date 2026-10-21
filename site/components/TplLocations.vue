<script setup lang="ts">
const q = ref('')
const cat = ref('all')
const sel = ref('haram')
const P = [
  { id: 'haram', t: 'Masjid al-Haram', c: 'mosque', d: '0 m', r: 5, lat: 21.4225, lon: 39.8262, x: 52, y: 44 },
  { id: 'clock', t: 'Abraj Al-Bait Hotels', c: 'hotel', d: '120 m', r: 4, lat: 21.4189, lon: 39.8256, x: 38, y: 66 },
  { id: 'jabal', t: 'Jabal al-Nour', c: 'site', d: '4.1 km', r: 5, lat: 21.4592, lon: 39.8579, x: 74, y: 22 },
  { id: 'arafat', t: 'Mount Arafat', c: 'site', d: '19 km', r: 5, lat: 21.355, lon: 39.9843, x: 86, y: 74 },
  { id: 'mall', t: 'Makkah Mall', c: 'shop', d: '3.6 km', r: 4, lat: 21.3851, lon: 39.8656, x: 24, y: 30 },
]
const ICON: Record<string, string> = { mosque: 'landmark', hotel: 'building-2', site: 'mountain', shop: 'shopping-bag' }
const list = computed(() => P.filter(p => (cat.value === 'all' || p.c === cat.value) && p.t.toLowerCase().includes(q.value.toLowerCase())))
</script>

<template>
  <div class="tlo">
    <UiPageHeader title="Locations" subtitle="Places near your hotel" />
    <TplSlot id="filters">
      <div class="tlo__f"><div class="tlo__q"><UiSearchInput v-model="q" placeholder="Search places" /></div><UiFilterChips v-model="cat" :items="[{ value: 'all', label: 'All' }, { value: 'mosque', label: 'Mosques' }, { value: 'hotel', label: 'Hotels' }, { value: 'site', label: 'Sites' }, { value: 'shop', label: 'Shops' }]" /></div>
    </TplSlot>
    <div class="tlo__two">
      <div class="tlo__aside">
        <TplSlot id="list">
          <UiCard padding="none">
            <div v-for="p in list" :key="p.id" role="button" tabindex="0" class="tlo__row" :class="{ on: sel === p.id }" @click="sel = p.id" @keydown.enter="sel = p.id">
              <UiIconTile :icon="ICON[p.c]" tone="brand" /><span class="tlo__t"><b>{{ p.t }}</b><small>{{ p.d }} · {{ p.c }}</small></span><span class="tlo__r"><UiIcon name="star" :size="14" />{{ p.r }}.0</span>
            </div>
            <UiEmptyState v-if="!list.length" icon="map-pin-off" title="No places" description="Change the filters." />
          </UiCard>
        </TplSlot>
      </div>
      <div class="tlo__main">
        <div class="tlo__stick">
          <TplSlot id="map">
            <div class="tlo__map" role="img" aria-label="Map of places">
              <span v-for="p in list" :key="p.id" class="tlo__pin" :class="{ on: sel === p.id }" :style="{ insetInlineStart: p.x + '%', top: p.y + '%' }" :title="p.t"><UiIcon :name="ICON[p.c]" :size="16" /></span>
              <div class="tlo__card"><b>{{ P.find(p => p.id === sel)?.t }}</b><small>{{ P.find(p => p.id === sel)?.d }} from the Haram</small></div>
            </div>
          </TplSlot>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.tlo { display: flex; flex-direction: column; gap: 16px; min-width: 0; }
.tlo__f { display: flex; flex-wrap: wrap; gap: 12px; align-items: center; }
.tlo__q { flex: 1 1 240px; max-width: 360px; }
.tlo__two { display: flex; flex-wrap: wrap; gap: 16px; align-items: stretch; }
.tlo__aside { flex: 1 1 380px; max-width: 100%; min-width: 0; }
.tlo__main { flex: 999 1 460px; min-width: 0; }
.tlo__stick { position: sticky; top: 16px; }
.tlo__r { display: inline-flex; align-items: center; gap: 4px; font-size: 13px; color: var(--zg-amber); }
.tlo__row { box-sizing: border-box; width: 100%; outline: none; display: flex; align-items: center; gap: 14px; padding: 14px 16px; cursor: pointer; color: var(--zg-text-1); }
.tlo__row + .tlo__row { box-shadow: 0 -1px 0 var(--zg-stroke); }
.tlo__row.on { background: color-mix(in oklch, var(--zg-brand) 12%, transparent); }
.tlo__row:focus-visible { box-shadow: inset 0 0 0 2px var(--zg-brand); }
.tlo__t { flex: 1; min-width: 0; display: flex; flex-direction: column; font-size: 14px; }
.tlo__t small { color: var(--zg-text-3); }
.tlo__map { position: relative; height: min(560px, 70vh); min-height: 320px; overflow: hidden; border-radius: 28px; background: radial-gradient(40% 30% at 30% 30%, color-mix(in oklch, var(--zg-green) 18%, transparent), transparent), radial-gradient(35% 40% at 75% 70%, color-mix(in oklch, var(--zg-sky) 20%, transparent), transparent), repeating-linear-gradient(0deg, transparent 0 47px, var(--zg-stroke) 47px 48px), repeating-linear-gradient(90deg, transparent 0 47px, var(--zg-stroke) 47px 48px), var(--zg-s1); box-shadow: var(--zg-rim); }
.tlo__pin { position: absolute; width: 34px; height: 34px; margin: -17px; display: grid; place-items: center; border-radius: 50%; background: var(--zg-s2); color: var(--zg-text-1); box-shadow: var(--zg-rim), var(--zg-shadow-2); }
.tlo__pin.on { background: var(--zg-brand); color: var(--zg-on-brand); transform: scale(1.2); }
.tlo__card { position: absolute; inset-inline: 16px; bottom: 16px; padding: 12px 16px; border-radius: 20px; display: flex; flex-direction: column; background: color-mix(in oklch, var(--zg-bg) 55%, transparent); backdrop-filter: blur(18px); -webkit-backdrop-filter: blur(18px); box-shadow: var(--zg-rim); font-size: 14px; }
.tlo__card small { color: var(--zg-text-3); }
@media (max-width: 860px) { .tlo__stick { position: static; } }
</style>
