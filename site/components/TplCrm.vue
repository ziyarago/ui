<script setup lang="ts">
const tab = ref('all')
const period = ref('week')
const q = ref('')
const periods = [{ value: 'day', label: 'Today' }, { value: 'week', label: 'Week' }, { value: 'month', label: 'Month' }]
const sar = (n: number) => 'SAR ' + String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
const stages = [
  { id: 'n', title: 'New', cards: [
    { title: 'Aziz Karimov · Umrah', amount: sar(18400), probability: 30, stage: 'New', owner: 'Shodiya', due: 'Today' },
    { title: 'Zaynab A. · family', amount: sar(26100), probability: 25, stage: 'New', owner: 'Jafar', due: 'Tomorrow' },
  ] },
  { id: 'm', title: 'Meeting', cards: [
    { title: 'Madina Y. · Ramadan', amount: sar(9250), probability: 60, stage: 'Meeting', tone: 'warning', owner: 'Jafar', due: 'Tomorrow' },
  ] },
  { id: 'p', title: 'Paid', cards: [
    { title: 'Group of 14 · Hajj', amount: sar(88200), probability: 100, stage: 'Paid', tone: 'success', owner: 'Shodiya', due: '—' },
  ] },
]
const board = computed(() => {
  const f = q.value.trim().toLowerCase()
  return stages.map(s => ({ ...s, cards: s.cards.filter(c => (tab.value === 'all' || (tab.value === 'hot' ? c.probability >= 60 && c.probability < 100 : c.probability === 100)) && (!f || c.title.toLowerCase().includes(f))) }))
})
</script>

<template>
  <div class="col">
    <TplSlot id="header">
      <UiPageHeader title="CRM" subtitle="Leads and deals">
        <template #actions><UiButton variant="primary" icon="plus">New lead</UiButton></template>
      </UiPageHeader>
    </TplSlot>
    <TplSlot id="summary">
      <div class="auto" style="--min: 170px">
        <UiStatsCard label="Leads" value="124" delta="9%" icon="users" />
        <UiStatsCard label="In progress" value="$42k" delta="4%" icon="wallet" />
        <UiStatsCard label="Conversion" value="11,2%" delta="1,4 pp" icon="trending-up" />
        <UiStatsCard label="Overdue" value="7" delta="2" trend="down" icon="clock" />
      </div>
    </TplSlot>
    <TplSlot id="filters">
      <div class="rowx">
        <UiTabs v-model="tab" :items="[{ value: 'all', label: 'All' }, { value: 'hot', label: 'Hot' }, { value: 'won', label: 'Won' }]" />
        <div class="search"><UiSearchInput v-model="q" placeholder="Search leads" /></div>
        <UiSegmentedControl v-model="period" size="sm" :items="periods" />
      </div>
    </TplSlot>
    <TplSlot id="board"><UiPipelineBoard :stages="board" /></TplSlot>
    <TplSlot id="calls">
      <UiCard title="Recent calls" subtitle="Today">
        <UiCallRow name="Zaynab Aliyeva" status="Answered" :duration="65" />
        <UiCallRow name="Jafar Rakhimov" status="Missed" :duration="NaN" />
      </UiCard>
    </TplSlot>
  </div>
</template>

<style scoped>
.col { display: flex; flex-direction: column; gap: 16px; min-width: 0; }
.rowx { display: flex; gap: 10px; flex-wrap: wrap; align-items: center; }
.auto { display: grid; grid-template-columns: repeat(auto-fit, minmax(min(100%, var(--min)), 1fr)); gap: 16px; align-items: start; }
.search { flex: 1; min-width: 180px; max-width: 320px; }
</style>
