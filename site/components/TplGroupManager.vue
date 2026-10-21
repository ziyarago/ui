<script setup lang="ts">
import { h } from 'vue'

const sar = (n: number) => 'SAR ' + String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
const VTONE: Record<string, string> = { Approved: 'success', Submitted: 'info', Pending: 'warning', Missing: 'danger' }
const DTONE: Record<string, string> = { Complete: 'success', Expiring: 'warning', Missing: 'danger' }
const all = [
  { id: 1, name: 'Aziz Karimov', sub: 'FA 1204551 · 42', docs: 'Complete', visa: 'Approved', paid: 100, room: 'M-401' },
  { id: 2, name: 'Madina Karimova', sub: 'FA 1204552 · 39', docs: 'Complete', visa: 'Approved', paid: 100, room: 'M-401' },
  { id: 3, name: 'Jafar Rakhimov', sub: 'AB 7731205 · 58', docs: 'Expiring', visa: 'Submitted', paid: 60, room: 'M-402' },
  { id: 4, name: 'Zaynab Aliyeva', sub: 'AC 5520187 · 51', docs: 'Complete', visa: 'Approved', paid: 100, room: 'M-402' },
  { id: 5, name: 'Osiyo Nazarova', sub: 'AD 3019846 · 33', docs: 'Missing', visa: 'Pending', paid: 30, room: '' },
  { id: 6, name: 'Imona Safarova', sub: 'AD 3019847 · 29', docs: 'Missing', visa: 'Missing', paid: 30, room: '' },
  { id: 7, name: 'Bobur Tursunov', sub: 'AB 6648120 · 47', docs: 'Complete', visa: 'Submitted', paid: 100, room: 'M-403' },
  { id: 8, name: 'Dilnoza Rahimova', sub: 'AB 6648121 · 45', docs: 'Complete', visa: 'Submitted', paid: 100, room: 'M-403' },
]
const chip = ref('all')
const q = ref('')
const selected = ref<number[]>([2, 5])
const FILTER: Record<string, (r: typeof all[number]) => boolean> = { all: () => true, visa: r => r.visa === 'Pending' || r.visa === 'Missing' || r.visa === 'Submitted', docs: r => r.docs !== 'Complete', unpaid: r => r.paid < 100 }
const rows = computed(() => all.filter(r => FILTER[chip.value](r) && (!q.value || (r.name + r.sub).toLowerCase().includes(q.value.toLowerCase()))))
const columns = [
  { key: 'name', label: 'Pilgrim', render: (v: string, r: any) => h('span', { style: 'display:flex;align-items:center;gap:10px' }, [h(resolveComponent('UiAvatar') as any, { name: v, size: 32 }), h('span', { style: 'display:flex;flex-direction:column;line-height:1.25' }, [h('b', { style: 'font-weight:500' }, v), h('small', { class: 'zg-hint' }, r.sub)])]) },
  { key: 'docs', label: 'Documents', render: (v: string) => h(resolveComponent('UiBadge') as any, { tone: DTONE[v], dot: true }, () => v) },
  { key: 'visa', label: 'Visa', render: (v: string) => h(resolveComponent('UiBadge') as any, { tone: VTONE[v], dot: true }, () => v) },
  { key: 'paid', label: 'Paid', num: true, render: (v: number) => v + '%' },
  { key: 'room', label: 'Room', render: (v: string) => v || '—' },
]
const STATS = [{ icon: 'users', tone: 'brand', value: '32', label: 'Pilgrims' }, { icon: 'stamp', tone: 'success', value: '27', label: 'Visas approved' }, { icon: 'file-warning', tone: 'warning', value: '5', label: 'Documents missing' }, { icon: 'bed-double', tone: 'sky', value: '14/16', label: 'Rooms assigned' }]
const RS: Record<string, string> = { full: 'success', partial: 'warning', empty: 'neutral' }
const rooms = [
  { no: 'M-401', type: 'Double', status: 'full' }, { no: 'M-402', type: 'Double', status: 'full' }, { no: 'M-403', type: 'Double', status: 'partial' }, { no: 'M-404', type: 'Triple', status: 'empty' },
  { no: 'M-405', type: 'Triple', status: 'empty' }, { no: 'M-406', type: 'Quad', status: 'partial' }, { no: 'M-407', type: 'Quad', status: 'full' }, { no: 'M-408', type: 'Quad', status: 'empty' },
]
const room = ref('M-404')
</script>

<template>
  <div class="tg">
    <TplSlot id="header">
      <UiPageHeader title="Ramadan Umrah · RU-0308" subtitle="8 to 12 March · Tashkent, Madinah, Makkah" :crumbs="[{ label: 'Groups' }, { label: 'RU-0308' }]">
        <template #actions>
          <div class="tg__row"><UiButton icon="download">Manifest</UiButton><UiButton variant="primary" icon="user-plus">Add pilgrim</UiButton></div>
        </template>
      </UiPageHeader>
    </TplSlot>
    <TplSlot id="trip">
      <UiCard>
        <div class="tg__trip">
          <div class="tg__hd"><UiIconTile icon="plane" tone="brand" size="lg" /><span class="tg__ht"><b>HY 561 to Madinah, HY 562 back</b><small>Anwar Al Madinah Movenpick · Hilton Suites Makkah</small></span><UiBadge tone="warning" dot>Visas in progress</UiBadge></div>
          <UiStatStrip :items="STATS" />
          <UiProgress :value="78" label="Group readiness" meta="25 of 32 pilgrims ready" />
        </div>
      </UiCard>
    </TplSlot>
    <div class="tg__two">
      <div class="tg__main">
        <TplSlot id="toolbar">
          <div class="tg__row tg__tb"><div class="tg__q"><UiSearchInput v-model="q" placeholder="Search name or passport" /></div><UiFilterChips v-model="chip" :items="[{ value: 'all', label: 'All' }, { value: 'visa', label: 'Visa open' }, { value: 'docs', label: 'Documents' }, { value: 'unpaid', label: 'Unpaid' }]" /></div>
        </TplSlot>
        <TplSlot id="bulk">
          <UiAlert v-if="selected.length" tone="info" :title="selected.length + ' selected'">
            <div class="tg__row"><UiButton size="sm" variant="primary" icon="send">Remind to upload</UiButton><UiButton size="sm" icon="bed-double">Assign room</UiButton><UiButton size="sm" icon="download">Export</UiButton><UiButton size="sm" variant="ghost" @click="selected = []">Clear</UiButton></div>
          </UiAlert>
          <div v-else class="zg-hint">Select pilgrims to see bulk actions</div>
        </TplSlot>
        <TplSlot id="pilgrims">
          <UiCard padding="none"><div class="tg__scroll"><UiDataTable :columns="columns" :rows="rows" :selected="selected" @select="selected = $event" /></div></UiCard>
        </TplSlot>
        <TplSlot id="rooms">
          <UiCard title="Rooming" subtitle="Anwar Al Madinah Movenpick · 4th floor">
            <div class="tg__rooms">
              <UiRoomGrid :rooms="rooms" :status-tones="RS" @select="room = $event" />
              <div class="tg__leg"><UiBadge tone="success" dot>Full</UiBadge><UiBadge tone="warning" dot>Free beds</UiBadge><UiBadge tone="neutral" dot>Empty</UiBadge><span class="zg-hint">Selected: {{ room }}</span></div>
            </div>
          </UiCard>
        </TplSlot>
      </div>
      <div class="tg__side">
        <div class="tg__stick">
          <TplSlot id="payments">
            <UiCard title="Payments">
              <div class="tg__pay">
                <div><span class="zg-hint">Collected</span><div class="tg__big zg-num">{{ sar(412800) }}</div></div>
                <UiProgress :value="84" tone="success" label="84% of the group total" :meta="sar(491400)" />
                <UiDescriptions :items="[{ label: 'Outstanding', value: sar(78600) }, { label: 'Unpaid pilgrims', value: '9' }, { label: 'Next deadline', value: '1 March' }]" />
                <UiButton variant="primary" icon="send" block>Send payment reminder</UiButton>
                <UiContactPanel name="Abdulaziz Rahimov" role="Group manager" phone="+998 90 123 45 67" telegram="@abdulaziz" city="Tashkent" />
              </div>
            </UiCard>
          </TplSlot>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.tg { display: flex; flex-direction: column; gap: 16px; min-width: 0; }
.tg__row { display: flex; gap: 8px; flex-wrap: wrap; align-items: center; }
.tg__trip { display: flex; flex-direction: column; gap: 18px; }
.tg__hd { display: flex; align-items: center; gap: 14px; flex-wrap: wrap; }
.tg__ht { flex: 1 1 220px; min-width: 0; display: flex; flex-direction: column; font-size: 16px; }
.tg__ht small { color: var(--zg-text-3); font-size: 13px; }
.tg__two { display: flex; flex-wrap: wrap; gap: 16px; align-items: stretch; }
.tg__main { flex: 999 1 460px; min-width: 0; display: flex; flex-direction: column; gap: 16px; }
.tg__side { flex: 1 1 300px; min-width: 0; }
.tg__stick { position: sticky; top: 16px; }
.tg__tb { gap: 12px; }
.tg__q { flex: 1 1 220px; max-width: 340px; }
.tg__scroll { overflow-x: auto; }
.tg__scroll :deep(table) { min-width: 560px; }
.tg__rooms { display: flex; flex-direction: column; gap: 14px; }
.tg__leg { display: flex; flex-wrap: wrap; gap: 8px; align-items: center; }
.tg__pay { display: flex; flex-direction: column; gap: 16px; }
.tg__big { font-size: 28px; font-weight: 300; letter-spacing: -.02em; }
@media (max-width: 860px) { .tg__stick { position: static; } }
</style>
