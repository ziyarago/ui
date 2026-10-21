<script setup lang="ts">
const p = ref('30d')
const cmp = ref(true)
const COLS = [{ key: 'channel', label: 'Channel', sortable: true }, { key: 'visits', label: 'Visits', num: true }, { key: 'bookings', label: 'Bookings', num: true }, { key: 'rev', label: 'Revenue', num: true }]
const ROWS = [{ id: 1, channel: 'Direct', visits: '12 480', bookings: 312, rev: '$48 200' }, { id: 2, channel: 'Telegram', visits: '8 120', bookings: 204, rev: '$31 900' }, { id: 3, channel: 'Partners', visits: '5 340', bookings: 118, rev: '$22 750' }, { id: 4, channel: 'Search', visits: '3 910', bookings: 64, rev: '$9 480' }]
</script>

<template>
  <div class="ta">
    <UiPageHeader title="Analytics" subtitle="Revenue and bookings across all channels"><template #actions><UiButton icon="download">Export CSV</UiButton></template></UiPageHeader>
    <TplSlot id="period">
      <div class="ta__bar"><UiSegmentedControl v-model="p" size="sm" :items="[{ value: '7d', label: '7 days' }, { value: '30d', label: '30 days' }, { value: '90d', label: '90 days' }, { value: 'y', label: 'Year' }]" /><UiSwitch v-model="cmp" label="Compare to previous" /></div>
    </TplSlot>
    <TplSlot id="kpis">
      <div class="ta__kpis"><UiKpiTile label="Revenue" value="$112k" delta="+8.4%" /><UiKpiTile label="Bookings" value="698" delta="+5.1%" /><UiKpiTile label="Conversion" value="3.2%" delta="-0.3%" /><UiKpiTile label="Avg. order" value="$160" delta="+2.2%" /></div>
    </TplSlot>
    <div class="ta__auto">
      <TplSlot id="trend"><UiChartCard title="Revenue" subtitle="Daily, last 30 days" :menu="['Export', 'Fullscreen']"><UiMiniChart :values="[12, 18, 15, 22, 28, 24, 30, 26, 34, 38, 33, 41, 45, 40, 48]" type="line" :height="180" /></UiChartCard></TplSlot>
      <TplSlot id="breakdown"><UiChartCard title="By channel" subtitle="Share of revenue"><div class="ta__bd"><UiSegBar :segments="[{ label: 'Direct', value: 43 }, { label: 'Telegram', value: 28 }, { label: 'Partners', value: 20 }, { label: 'Search', value: 9 }]" /><UiCountryRow code="UZ" name="Uzbekistan" amount="$51 200" pct="+6%" /><UiCountryRow code="TR" name="Turkey" amount="$28 400" pct="+11%" /></div></UiChartCard></TplSlot>
    </div>
    <TplSlot id="table"><UiCard title="Channel detail"><UiDataTable :columns="COLS" :rows="ROWS" /></UiCard></TplSlot>
  </div>
</template>

<style scoped>
.ta { display: flex; flex-direction: column; gap: 16px; min-width: 0; }
.ta__bar { display: flex; gap: 16px; align-items: center; flex-wrap: wrap; justify-content: space-between; }
.ta__kpis { display: grid; grid-template-columns: repeat(auto-fit, minmax(min(100%, 200px), 1fr)); gap: 16px; }
.ta__auto { display: grid; grid-template-columns: repeat(auto-fit, minmax(min(100%, 420px), 1fr)); gap: 16px; align-items: start; }
.ta__bd { display: flex; flex-direction: column; gap: 14px; }
</style>
