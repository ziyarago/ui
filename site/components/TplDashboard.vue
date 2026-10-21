<script setup lang="ts">
const period = ref('week')
const periods = [{ value: 'day', label: 'Today' }, { value: 'week', label: 'Week' }, { value: 'month', label: 'Month' }]
const Badge = resolveComponent('UiBadge')
const Progress = resolveComponent('UiProgress')
const sar = (n: number) => 'SAR ' + String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
const cols = [
  { key: 'n', label: 'Hotel', render: (v: string) => h('b', null, v) },
  { key: 'c', label: 'City', render: (v: string) => h(Badge as any, { tone: 'info' }, () => v) },
  { key: 'sh', label: 'Share', render: (v: number) => h(Progress as any, { value: v }) },
  { key: 'sar', label: 'Revenue', num: true, render: (v: number) => sar(v) },
]
const rows = [
  { id: 1, n: 'Hilton Suites', c: 'Makkah', sh: 82, sar: 214000 },
  { id: 2, n: 'Swissôtel', c: 'Makkah', sh: 64, sar: 168000 },
  { id: 3, n: 'Anwar Al Madinah', c: 'Madinah', sh: 41, sar: 97000 },
]
</script>

<template>
  <div class="col">
    <TplSlot id="header">
      <UiPageHeader title="Dashboard" :subtitle="`Hotels · Makkah & Madinah · ${period}`">
        <template #actions>
          <div class="rowx">
            <UiSegmentedControl v-model="period" size="sm" :items="periods" />
            <UiButton icon="download">Export</UiButton>
          </div>
        </template>
      </UiPageHeader>
    </TplSlot>
    <div class="auto" style="--min: 340px">
      <TplSlot id="hero">
        <UiCard variant="inverse">
          <div class="hero">
            <UiRing :value="72" :size="140" label="plan" />
            <div class="hero__t">
              <b>Good morning, Shodiya</b>
              <span>14 of 20 sales this month. Six more unlock the next bonus.</span>
              <UiButton variant="primary" size="sm">Open leads</UiButton>
            </div>
          </div>
        </UiCard>
      </TplSlot>
      <TplSlot id="kpis">
        <div class="auto" style="--min: 190px">
          <UiKpiTile label="Bookings" value="1 248" delta="+12%" sub="vs last week" />
          <UiKpiTile label="Revenue" value="$214k" delta="+8%" variant="brand" />
          <UiKpiTile label="Avg. walk" value="7 min" sub="to the Haram" />
          <UiKpiTile label="Cancelled" value="34" delta="-3%" />
        </div>
      </TplSlot>
    </div>
    <div class="auto" style="--min: 360px">
      <TplSlot id="occupancy">
        <UiCard title="Occupancy" subtitle="Next 7 days · all hotels">
          <UiOccupancyChart :values="[62, 74, 88, 95, 91, 70, 58]" :labels="['M', 'T', 'W', 'T', 'F', 'S', 'S']" />
        </UiCard>
      </TplSlot>
      <TplSlot id="funnel">
        <UiCard title="Guest booking journey" subtitle="This month">
          <UiSalesFunnel :steps="[{ label: 'Leads', value: 1240 }, { label: 'Contacted', value: 843 }, { label: 'Meeting', value: 268 }, { label: 'Paid', value: 86 }]" />
        </UiCard>
      </TplSlot>
    </div>
    <div class="auto" style="--min: 360px">
      <TplSlot id="top">
        <UiCard title="Top hotels" subtitle="By revenue">
          <UiDataTable :columns="cols" :rows="rows" />
        </UiCard>
      </TplSlot>
      <TplSlot id="activity">
        <UiCard title="Activity">
          <UiTimeline :items="[{ title: 'Payment received', text: 'BK-2041 · SAR 18 400', time: '2 min ago' }, { title: 'Status changed', text: 'Pending → Confirmed', time: '10 min ago' }, { title: 'Note added', text: 'Haram-view room requested', time: 'Today 11:20' }]" />
        </UiCard>
      </TplSlot>
    </div>
  </div>
</template>

<style scoped>
.col { display: flex; flex-direction: column; gap: 16px; min-width: 0; }
.rowx { display: flex; gap: 10px; flex-wrap: wrap; align-items: center; }
.auto { display: grid; grid-template-columns: repeat(auto-fit, minmax(min(100%, var(--min)), 1fr)); gap: 16px; align-items: start; }
:deep(td.num) { white-space: nowrap; }
.hero { display: flex; align-items: center; gap: 20px; flex-wrap: wrap; }
.hero__t { flex: 1 1 160px; display: flex; flex-direction: column; gap: 8px; align-items: flex-start; }
.hero__t b { font-size: 20px; }
.hero__t span { opacity: .75; font-size: 14px; line-height: 1.5; }
</style>
