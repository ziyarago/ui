<script setup lang="ts">
const price = ref(900)
const trip = ref('u')
const rating = ref(4)
const tour = ref(true)
const view = ref('grid')
const page = ref(1)
const q = ref('')
const sar = (n: number) => 'SAR ' + String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
const hotels = [
  { name: 'Hilton Suites Makkah', stars: 5, distance: '300 m to the Haram', rating: '9.2/10', price: 1200, tags: ['Top pick', '360°'] },
  { name: 'Swissôtel Makkah', stars: 5, distance: '450 m to the Haram', rating: '8.9/10', price: 980, tags: ['360°'] },
  { name: 'Anwar Al Madinah', stars: 4, distance: '120 m to the Prophet’s Mosque', rating: '8.7/10', price: 640, tags: ['Haram view'] },
  { name: 'Al Ebaa Hotel', stars: 3, distance: '900 m to the Haram', rating: '8.1/10', price: 380, tags: ['360°'] },
]
const shown = computed(() => hotels.filter(h => !q.value || h.name.toLowerCase().includes(q.value.toLowerCase())))
</script>

<template>
  <div class="tc">
    <TplSlot id="header">
      <UiPageHeader title="Hotels" subtitle="128 hotels in Makkah" :crumbs="[{ label: 'Home' }, { label: 'Hotels' }, { label: 'Makkah' }]">
        <template #actions><UiButton icon="map">Map</UiButton></template>
      </UiPageHeader>
    </TplSlot>
    <div class="tc-wrap">
      <aside class="tc-aside">
        <TplSlot id="filters">
          <UiCard title="Filters">
            <UiSlider v-model="price" label="Price per night" :min="200" :max="2000" :step="50" :format-value="sar" />
            <UiRadioGroup v-model="trip" label="Trip type" :options="[{ value: 'u', label: 'Umrah' }, { value: 'h', label: 'Hajj' }, { value: 'r', label: 'Ramadan' }]" />
            <div class="zg-field"><span class="zg-label">Rating</span><UiRating v-model="rating" /></div>
            <UiCheckbox v-model="tour" label="360° tour" />
            <UiCheckbox label="Haram view" />
          </UiCard>
        </TplSlot>
      </aside>
      <div class="tc-main">
        <TplSlot id="toolbar">
          <div class="tc-row">
            <div class="tc-search"><UiSearchInput v-model="q" placeholder="Hotel or area" /></div>
            <UiToggleGroup v-model="view" icon-only :options="[{ value: 'grid', label: 'Grid', icon: 'layout-grid' }, { value: 'list', label: 'List', icon: 'list' }]" />
          </div>
        </TplSlot>
        <TplSlot id="grid">
          <div class="tc-grid" :data-view="view">
            <UiHotelCard v-for="h in shown" :key="h.name" v-bind="h" />
          </div>
        </TplSlot>
        <TplSlot id="pager"><UiPagination :page="page" @change="page = $event" :pages="6" /></TplSlot>
      </div>
    </div>
  </div>
</template>

<style scoped>
.tc { display: flex; flex-direction: column; gap: 16px; min-width: 0 }
.tc-wrap { display: flex; flex-wrap: wrap; gap: 16px; align-items: flex-start }
.tc-aside { flex: 1 1 260px; min-width: 0; max-width: 100% }
.tc-main { flex: 999 1 420px; min-width: 0; display: flex; flex-direction: column; gap: 16px }
.tc-row { display: flex; gap: 10px; flex-wrap: wrap; align-items: center }
.tc-search { flex: 1; min-width: 160px }
.tc-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(min(100%, 260px), 1fr)); gap: 16px; align-items: start }
.tc-grid[data-view='list'] { grid-template-columns: 1fr }
</style>
