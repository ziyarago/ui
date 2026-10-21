<script setup lang="ts">
const sar = (n: number) => 'SAR ' + String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
const columns = [
  { key: 's', label: 'Service' },
  { key: 'q', label: 'Qty', num: true },
  { key: 'p', label: 'Price', num: true, render: (v: number) => sar(v) },
]
const rows = [
  { id: 1, s: 'Room · Haram view · 7 nights', q: 7, p: 8400 },
  { id: 2, s: 'Airport transfer', q: 2, p: 480 },
]
</script>

<template>
  <div class="to">
    <TplSlot id="header">
      <UiPageHeader title="Booking BK-2041" subtitle="Oct 14 · Hilton Suites Makkah" :crumbs="[{ label: 'Bookings' }, { label: 'BK-2041' }]">
        <template #actions><UiButton variant="tonal" tone="danger" icon="trash-2">Cancel booking</UiButton></template>
      </UiPageHeader>
    </TplSlot>
    <TplSlot id="status">
      <div class="to-row"><UiChip tone="success" pill>Paid</UiChip><UiChip tone="warning" pill>Ready to check in</UiChip></div>
    </TplSlot>
    <div class="to-two">
      <div class="to-col to-main">
        <TplSlot id="items">
          <UiCard title="Services">
            <UiDataTable :columns="columns" :rows="rows" />
            <div class="to-total"><span class="zg-hint">Total</span><b class="zg-num to-big">{{ sar(8880) }}</b></div>
          </UiCard>
        </TplSlot>
        <TplSlot id="shipping">
          <UiCard title="Activity">
            <UiTimeline :items="[{ title: 'Payment received', time: 'Oct 8' }, { title: 'Confirmed by hotel', time: 'Oct 8' }, { title: 'Booking created', time: 'Oct 7' }]" />
          </UiCard>
        </TplSlot>
      </div>
      <TplSlot id="side" class="to-sideslot">
        <div class="to-col">
          <UiCard title="Customer">
            <UiUserCell name="Aziz Karimov" sub="+998 90 123 45 67" />
            <UiButton size="sm">Edit</UiButton>
          </UiCard>
          <UiCard title="Billing">
            <UiDescriptions :items="[{ label: 'Method', value: 'Visa ···· 4242' }, { label: 'Address', value: 'Tashkent, UZ' }]" />
          </UiCard>
        </div>
      </TplSlot>
    </div>
  </div>
</template>

<style scoped>
.to { display: flex; flex-direction: column; gap: 16px; min-width: 0 }
.to-row { display: flex; gap: 10px; flex-wrap: wrap; align-items: center }
.to-two { display: flex; flex-wrap: wrap; gap: 16px; align-items: flex-start }
.to-main { flex: 999 1 460px }
.to-two > :deep(.to-sideslot) { flex: 1 1 300px }
.to-col { display: flex; flex-direction: column; gap: 16px; min-width: 0 }
.to-total { display: flex; justify-content: flex-end; gap: 16px; align-items: baseline }
.to-big { font-size: 26px }
</style>
