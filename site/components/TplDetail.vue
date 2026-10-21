<script setup lang="ts">
const tab = ref('about')
const dates = ref('a')
const guests = ref(2)
const sar = (n: number) => 'SAR ' + String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
const images = ['/3d/hotel.png', '/3d/kaaba.png', '/3d/mosque.png', '/3d/tour360.png']
const about = [
  { label: 'Distance', value: '300 m to gate 1' },
  { label: 'Check-in', value: '14:00' },
  { label: 'Rooms', value: '412' },
  { label: 'Languages', value: 'EN · AR · RU · UZ' },
  { label: 'Wheelchair', value: null },
]
const rooms = [
  { label: 'Deluxe twin', value: 'SAR 1 200 / night' },
  { label: 'Haram view suite', value: 'SAR 1 650 / night' },
  { label: 'Family suite', value: 'SAR 2 100 / night' },
]
const reviews = [
  { label: 'Aziz K.', value: '“Walked to the Haram in five minutes, staff spoke Uzbek.”' },
  { label: 'Madina Y.', value: '“Breakfast and the Haram-view room were excellent.”' },
]
const items = computed(() => ({ about, rooms, rev: reviews } as Record<string, typeof about>)[tab.value])
</script>

<template>
  <div class="td">
    <TplSlot id="header">
      <UiPageHeader title="Hilton Suites Makkah" subtitle="★★★★★ · 300 m to the Haram · 9.2/10" :crumbs="[{ label: 'Home' }, { label: 'Hotels' }, { label: 'Hilton Suites' }]">
        <template #actions>
          <div class="td-row">
            <UiIconButton icon="share-2" label="Share" />
            <UiIconButton icon="heart" label="Save" />
            <UiButton variant="primary" icon="rotate-3d">360° tour</UiButton>
          </div>
        </template>
      </UiPageHeader>
    </TplSlot>
    <div class="td-wrap">
      <div class="td-main">
        <TplSlot id="gallery"><UiGallery :images="images" alt="Hilton Suites" /></TplSlot>
        <TplSlot id="summary">
          <UiCard>
            <div class="td-sum">
              <div><span class="zg-hint">From</span><div class="zg-num td-price">{{ sar(1200) }}<span class="zg-hint"> / night</span></div></div>
              <div class="td-row"><UiBadge tone="success" dot>Free cancellation</UiBadge><UiBadge tone="info">360° tour</UiBadge><UiBadge tone="brand">Top pick</UiBadge></div>
            </div>
          </UiCard>
        </TplSlot>
        <TplSlot id="tabs">
          <UiCard>
            <UiTabs v-model="tab" :items="[{ value: 'about', label: 'About' }, { value: 'rooms', label: 'Rooms' }, { value: 'rev', label: 'Reviews' }]" />
            <UiDescriptions :items="items" />
          </UiCard>
        </TplSlot>
        <TplSlot id="history">
          <UiCard title="Price history">
            <UiTimeline :items="[{ title: 'Price changed', text: 'SAR 1 100 → SAR 1 200', time: 'Oct 8' }, { title: '360° tour added', time: 'Oct 2' }]" />
          </UiCard>
        </TplSlot>
      </div>
      <TplSlot id="booking" class="td-side">
        <UiCard title="Book this hotel" subtitle="Free cancellation until Oct 12">
          <UiSelect v-model="dates" label="Dates" :options="[{ value: 'a', label: 'Oct 21 – Oct 28' }, { value: 'b', label: 'Nov 2 – Nov 9' }]" />
          <UiNumberInput v-model="guests" label="Guests" :min="1" :max="6" />
          <div class="td-total"><span class="zg-num td-big">{{ sar(8400) }}</span><span class="zg-hint">7 nights</span></div>
          <UiButton variant="primary" block>Reserve</UiButton>
        </UiCard>
      </TplSlot>
    </div>
  </div>
</template>

<style scoped>
.td { display: flex; flex-direction: column; gap: 16px; min-width: 0 }
.td-row { display: flex; gap: 10px; flex-wrap: wrap; align-items: center }
.td-wrap { display: flex; flex-wrap: wrap; gap: 16px; align-items: flex-start }
.td-main { flex: 999 1 420px; min-width: 0; display: flex; flex-direction: column; gap: 16px }
.td-wrap > :deep(.td-side), .td-side { flex: 1 1 320px; min-width: 0; position: sticky; top: 12px }
.td-sum { display: flex; flex-wrap: wrap; gap: 12px; align-items: center; justify-content: space-between }
.td-price { font-size: 26px }
.td-total { display: flex; align-items: baseline; gap: 8px }
.td-big { font-size: 36px }
</style>
