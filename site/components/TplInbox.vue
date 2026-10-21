<script setup lang="ts">
const q = ref('')
const f = ref('all')
const reply = ref('')
const sel = ref(1)
const CONV = [
  { id: 1, name: 'Aziz Karimov', preview: 'Can I move check-in to Friday?', time: '2m', unread: 2 },
  { id: 2, name: 'Dilnoza Rahimova', preview: 'Thank you, the voucher arrived.', time: '1h', unread: 0 },
  { id: 3, name: 'Omar Hassan', preview: 'Is airport pickup included?', time: '3h', unread: 1 },
  { id: 4, name: 'Madina Yusupova', preview: 'We need two more rooms.', time: 'Mon', unread: 0 },
]
const MSG = [
  { me: false, text: 'Hello! Can I move check-in to Friday?', time: '10:12' },
  { me: true, text: 'Of course. Friday works, the room is free from 14:00.', time: '10:14' },
  { me: false, text: 'Perfect. Is airport pickup still included?', time: '10:15' },
]
</script>

<template>
  <div class="ti">
    <UiPageHeader title="Inbox" subtitle="4 open conversations"><template #actions><UiButton variant="primary" icon="plus">New message</UiButton></template></UiPageHeader>
    <div class="ti__wrap">
      <div class="ti__aside">
        <TplSlot id="filters"><div class="ti__f"><UiSearchInput v-model="q" placeholder="Search messages" /><UiFilterChips v-model="f" :items="[{ value: 'all', label: 'All' }, { value: 'unread', label: 'Unread' }, { value: 'mine', label: 'Mine' }]" /></div></TplSlot>
        <TplSlot id="list">
          <UiCard padding="none">
            <button v-for="c in CONV" :key="c.id" type="button" class="ti__row" :data-on="c.id === sel" @click="sel = c.id">
              <UiAvatar :name="c.name" :size="40" />
              <span class="ti__t"><b>{{ c.name }}</b><span>{{ c.preview }}</span></span>
              <span class="ti__m"><span class="zg-hint">{{ c.time }}</span><UiBadge v-if="c.unread" tone="brand">{{ c.unread }}</UiBadge></span>
            </button>
          </UiCard>
        </TplSlot>
      </div>
      <div class="ti__main">
        <div class="ti__thr">
          <TplSlot id="thread">
            <UiCard title="Aziz Karimov" subtitle="Hilton Suites · BK-2041">
              <div class="ti__msgs"><div v-for="(m, i) in MSG" :key="i" class="ti__msg" :data-me="m.me"><span class="ti__b">{{ m.text }}</span><span class="zg-hint">{{ m.time }}</span></div></div>
            </UiCard>
          </TplSlot>
          <TplSlot id="composer"><div class="ti__c"><UiTextarea v-model="reply" :rows="2" placeholder="Write a reply" /><UiButton variant="primary" icon="send">Send</UiButton></div></TplSlot>
        </div>
        <div class="ti__cust">
          <TplSlot id="customer">
            <UiContactPanel name="Aziz Karimov" role="Umrah, 4 guests" phone="+998 90 123 45 67" telegram="@aziz" city="Tashkent" />
            <UiCard title="Tags"><div class="ti__tags"><UiTag>VIP</UiTag><UiTag>Group</UiTag><UiTag>Friday</UiTag></div></UiCard>
          </TplSlot>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.ti { display: flex; flex-direction: column; gap: 16px; min-width: 0; }
.ti__wrap { display: flex; flex-wrap: wrap; gap: 16px; align-items: flex-start; }
.ti__aside { flex: 1 1 300px; max-width: 100%; min-width: 0; display: flex; flex-direction: column; gap: 12px; }
.ti__main { flex: 999 1 520px; min-width: 0; display: flex; flex-wrap: wrap; gap: 16px; align-items: flex-start; }
.ti__thr { flex: 999 1 320px; min-width: 0; display: flex; flex-direction: column; gap: 12px; }
.ti__cust { flex: 1 1 260px; min-width: 0; display: flex; flex-direction: column; gap: 12px; }
.ti__f { display: flex; flex-direction: column; gap: 10px; }
.ti__row { all: unset; box-sizing: border-box; width: 100%; display: flex; align-items: center; gap: 12px; padding: 12px 16px; cursor: pointer; }
.ti__row:hover, .ti__row[data-on="true"] { background: var(--zg-s2); }
.ti__row:focus-visible { outline: 2px solid var(--zg-brand); outline-offset: -2px; }
.ti__t { flex: 1; min-width: 0; display: flex; flex-direction: column; font-size: 14px; }
.ti__t span { color: var(--zg-text-2); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.ti__m { display: flex; flex-direction: column; align-items: flex-end; gap: 4px; }
.ti__msgs { display: flex; flex-direction: column; gap: 12px; }
.ti__msg { display: flex; flex-direction: column; align-items: flex-start; gap: 2px; }
.ti__msg[data-me="true"] { align-items: flex-end; }
.ti__b { max-width: 80%; padding: 10px 14px; border-radius: 18px; background: var(--zg-s2); font-size: 14px; line-height: 1.45; }
.ti__msg[data-me="true"] .ti__b { background: var(--zg-brand); color: var(--zg-on-brand, #fff); }
.ti__c { display: flex; gap: 10px; align-items: flex-end; } .ti__c > :first-child { flex: 1; min-width: 0; }
.ti__tags { display: flex; gap: 8px; flex-wrap: wrap; }
</style>
