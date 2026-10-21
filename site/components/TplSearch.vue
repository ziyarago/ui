<script setup lang="ts">
const q = ref('hilton')
const tab = ref('all')
const city = ref('all')
const star = ref([true, false])
const G = [
  { t: 'Hotels', icon: 'building-2', items: [{ a: 'Hilton Suites Makkah', b: '5 stars · 120 m to Haram', c: 'from $182' }, { a: 'Hilton Madinah', b: '5 stars · Near Masjid an-Nabawi', c: 'from $164' }] },
  { t: 'Bookings', icon: 'calendar-check', items: [{ a: 'BK-2041 Aziz Karimov', b: 'Hilton Suites · 12 to 17 May', c: 'Paid' }] },
  { t: 'Guests', icon: 'users', items: [{ a: 'Omar Hassan', b: 'Booked Hilton Suites twice', c: 'VIP' }] },
]
const res = computed(() => q.value.trim().toLowerCase() === 'zzz' ? [] : G.filter(g => tab.value === 'all' || g.t.toLowerCase() === tab.value))
</script>

<template>
  <div class="ts">
    <UiPageHeader title="Search results" :subtitle="`Showing results for “${q}”`" />
    <TplSlot id="search">
      <div class="ts__s"><UiSearchInput v-model="q" size="lg" placeholder="Search hotels, bookings, guests" /><UiTabs v-model="tab" :items="[{ value: 'all', label: 'All' }, { value: 'hotels', label: 'Hotels' }, { value: 'bookings', label: 'Bookings' }, { value: 'guests', label: 'Guests' }]" /></div>
    </TplSlot>
    <div class="ts__two">
      <div class="ts__aside">
        <TplSlot id="filters">
          <UiCard title="Filters">
            <div class="ts__f"><UiSelect v-model="city" label="City" :options="[{ value: 'all', label: 'Any city' }, { value: 'makkah', label: 'Makkah' }, { value: 'madinah', label: 'Madinah' }]" /><UiCheckbox v-model="star[0]" label="5 stars" /><UiCheckbox v-model="star[1]" label="4 stars" /><UiButton variant="ghost" size="sm">Reset filters</UiButton></div>
          </UiCard>
        </TplSlot>
      </div>
      <div class="ts__main">
        <TplSlot id="results">
          <template v-for="g in res" :key="g.t">
            <UiDivider :label="`${g.t} · ${g.items.length}`" />
            <UiCard padding="none">
              <div v-for="i in g.items" :key="i.a" class="ts__row"><UiIconTile :icon="g.icon" tone="brand" /><span class="ts__t"><b>{{ i.a }}</b><span>{{ i.b }}</span></span><UiChip tone="neutral" size="sm">{{ i.c }}</UiChip></div>
            </UiCard>
          </template>
        </TplSlot>
        <TplSlot id="empty"><UiEmptyState v-if="!res.length" icon="search-x" title="No results" description="Try a different word or reset the filters." /></TplSlot>
      </div>
    </div>
  </div>
</template>

<style scoped>
.ts { display: flex; flex-direction: column; gap: 16px; min-width: 0; }
.ts__s { display: flex; flex-direction: column; gap: 12px; }
.ts__two { display: flex; gap: 16px; align-items: flex-start; }
.ts__aside { flex: 0 0 260px; min-width: 0; }
.ts__main { flex: 1 1 0; min-width: 0; display: flex; flex-direction: column; gap: 12px; }
.ts__f { display: flex; flex-direction: column; gap: 12px; align-items: flex-start; }
.ts__row { display: flex; align-items: center; gap: 14px; padding: 14px 16px; flex-wrap: wrap; }
.ts__row + .ts__row { box-shadow: 0 -1px 0 var(--zg-stroke); }
.ts__t { flex: 1 1 200px; min-width: 0; display: flex; flex-direction: column; font-size: 14px; }
.ts__t span { color: var(--zg-text-2); }
@media (max-width: 860px) { .ts__two { flex-direction: column; align-items: stretch; } .ts__aside { flex-basis: auto; } }
</style>
