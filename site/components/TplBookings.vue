<script setup lang="ts">
import { h } from 'vue'

const sar = (n: number) => 'SAR ' + String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
const TONE: Record<string, string> = { Confirmed: 'success', Pending: 'warning', Cancelled: 'danger' }
const all = [
  { id: 1, code: 'BK-2041', guest: 'Aziz Karimov', hotel: 'Hilton Suites', st: 'Confirmed', sar: 18400 },
  { id: 2, code: 'BK-2042', guest: 'Madina Yusupova', hotel: 'Swissôtel', st: 'Pending', sar: 9250 },
  { id: 3, code: 'BK-2043', guest: 'Zaynab Aliyeva', hotel: 'Anwar Al Madinah', st: 'Confirmed', sar: 26100 },
  { id: 4, code: 'BK-2044', guest: 'Jafar Rakhimov', hotel: 'Hilton Suites', st: 'Cancelled', sar: 4200 },
  { id: 5, code: 'BK-2045', guest: 'Osiyo Nazarova', hotel: 'Al Ebaa', st: 'Confirmed', sar: 12800 },
  { id: 6, code: 'BK-2046', guest: 'Imona Safarova', hotel: 'Swissôtel', st: 'Pending', sar: 7400 },
]
const chip = ref('all')
const q = ref('')
const sortDir = ref<'asc' | 'desc'>('desc')
const selected = ref<number[]>([])
const page = ref(1)

const rows = computed(() =>
  all
    .filter(r => (chip.value === 'all' || r.st.toLowerCase() === chip.value) && (!q.value || (r.code + r.guest).toLowerCase().includes(q.value.toLowerCase())))
    .sort((a, b) => (sortDir.value === 'desc' ? -1 : 1) * (a.sar - b.sar)),
)

const columns = [
  { key: 'code', label: 'Code', render: (v: string) => h('span', { class: 'zg-mono' }, v) },
  { key: 'guest', label: 'Guest', render: (v: string) => h('span', { style: 'display:flex;align-items:center;gap:8px' }, [h(resolveComponent('UiAvatar') as any, { name: v, size: 28 }), v]) },
  { key: 'hotel', label: 'Hotel' },
  { key: 'st', label: 'Status', render: (v: string) => h(resolveComponent('UiBadge') as any, { tone: TONE[v], dot: true }, () => v) },
  { key: 'sar', label: 'Amount', num: true, sortable: true, render: (v: number) => sar(v) },
]
const onSort = (_k: string, d: 'asc' | 'desc') => { sortDir.value = d }
</script>

<template>
  <div class="tb">
    <TplSlot id="header">
      <UiPageHeader title="Bookings" subtitle="All hotels · October">
        <template #actions>
          <div class="tb-row">
            <UiButton icon="download">Export</UiButton>
            <UiButton variant="primary" icon="plus">New booking</UiButton>
          </div>
        </template>
      </UiPageHeader>
    </TplSlot>
    <TplSlot id="stats">
      <div class="tb-auto">
        <UiStatsCard label="Total" value="1 248" delta="12%" icon="calendar" />
        <UiStatsCard label="Confirmed" value="86" delta="9%" icon="check" />
        <UiStatsCard label="Pending" value="31" icon="clock" />
        <UiStatsCard label="Cancelled" value="34" delta="3%" trend="down" icon="x" />
      </div>
    </TplSlot>
    <TplSlot id="toolbar">
      <div class="tb-row">
        <div class="tb-search"><UiSearchInput v-model="q" placeholder="Search code or guest" /></div>
        <UiFilterChips v-model="chip" :items="[{ value: 'all', label: 'All' }, { value: 'confirmed', label: 'Confirmed' }, { value: 'pending', label: 'Pending' }, { value: 'cancelled', label: 'Cancelled' }]" />
      </div>
    </TplSlot>
    <TplSlot id="bulk">
      <UiAlert v-if="selected.length" tone="info" :title="selected.length + ' selected'">
        <div class="tb-row">
          <UiButton size="sm" variant="primary" icon="check">Confirm</UiButton>
          <UiButton size="sm" icon="send">Message in Telegram</UiButton>
          <UiButton size="sm" variant="danger" icon="x">Cancel</UiButton>
        </div>
      </UiAlert>
      <div v-else class="tb-hint">Select rows to see bulk actions</div>
    </TplSlot>
    <TplSlot id="table">
      <UiCard>
        <UiDataTable :columns="columns" :rows="rows" :selected="selected" sort-key="sar" :sort-dir="sortDir" @select="selected = $event" @sort="onSort" />
      </UiCard>
    </TplSlot>
    <TplSlot id="pager">
      <UiPagination :page="page" @change="page = $event" :pages="6" />
    </TplSlot>
  </div>
</template>

<style scoped>
.tb { display: flex; flex-direction: column; gap: 16px; min-width: 0 }
.tb-row { display: flex; gap: 10px; flex-wrap: wrap; align-items: center }
.tb-auto { display: grid; grid-template-columns: repeat(auto-fit, minmax(min(100%, 170px), 1fr)); gap: 16px; align-items: start }
.tb-search { flex: 1; min-width: 180px; max-width: 340px }
.tb-hint { padding: 10px 14px; border-radius: 16px; background: var(--zg-s1); color: var(--zg-text-3); font-size: 13px }
</style>
