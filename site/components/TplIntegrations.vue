<script setup lang="ts">
const f = ref('all')
const q = ref('')
const shown = ref<number[]>([])
const hooks = ref([{ id: 1, url: 'https://api.ziyara.vip/hooks/booking', ev: 'booking.created', on: true }, { id: 2, url: 'https://crm.example.com/webhook', ev: 'payment.paid', on: true }, { id: 3, url: 'https://hooks.example.com/old', ev: 'lead.updated', on: false }])
const INT = [{ n: 'Telegram', s: 'connected', c: 'chat' }, { n: 'Stripe', s: 'connected', c: 'payments' }, { n: 'Google Calendar', s: 'error', c: 'chat' }, { n: 'WhatsApp', s: 'off', c: 'chat' }, { n: 'Slack', s: 'off', c: 'chat' }, { n: 'Payme', s: 'off', c: 'payments' }]
const list = computed(() => INT.filter(i => (f.value === 'all' || i.c === f.value) && i.n.toLowerCase().includes(q.value.toLowerCase())))
const KEYS = [{ id: 1, name: 'Production', key: 'zg_live_8f3a91c2d4e7' }, { id: 2, name: 'Staging', key: 'zg_test_51b7e0aa93cd' }]
const mask = (k: string) => k.slice(0, 8) + '••••••••••••'
const flip = (id: number) => { shown.value = shown.value.includes(id) ? shown.value.filter(x => x !== id) : [...shown.value, id] }
</script>

<template>
  <div class="ti">
    <UiPageHeader title="Integrations" subtitle="Connect tools, manage API keys and webhooks"><template #actions><UiButton variant="primary" icon="plus">New API key</UiButton></template></UiPageHeader>
    <TplSlot id="filters"><div class="ti__bar"><div class="ti__q"><UiSearchInput v-model="q" placeholder="Search integrations" /></div><UiFilterChips v-model="f" :items="[{ value: 'all', label: 'All' }, { value: 'chat', label: 'Messaging' }, { value: 'payments', label: 'Payments' }]" /></div></TplSlot>
    <TplSlot id="connections"><div class="ti__grid"><UiIntegrationCard v-for="i in list" :key="i.n" :name="i.n" :status="i.s as any" /></div></TplSlot>
    <div class="ti__auto">
      <TplSlot id="keys">
        <UiCard title="API keys">
          <div class="ti__keys">
            <div v-for="k in KEYS" :key="k.id" class="ti__key">
              <span class="ti__kt"><b>{{ k.name }}</b><code>{{ shown.includes(k.id) ? k.key : mask(k.key) }}</code></span>
              <UiIconButton :icon="shown.includes(k.id) ? 'eye-off' : 'eye'" label="Reveal" @click="flip(k.id)" /><UiCopyButton :value="k.key" /><UiIconButton icon="trash-2" label="Revoke" />
            </div>
          </div>
        </UiCard>
      </TplSlot>
      <TplSlot id="webhooks">
        <UiCard title="Webhooks">
          <div class="ti__keys">
            <div v-for="h in hooks" :key="h.id" class="ti__key"><span class="ti__kt"><code>{{ h.url }}</code><UiChip tone="neutral" size="sm">{{ h.ev }}</UiChip></span><UiSwitch v-model="h.on" /></div>
          </div>
        </UiCard>
      </TplSlot>
    </div>
  </div>
</template>

<style scoped>
.ti { display: flex; flex-direction: column; gap: 16px; min-width: 0; }
.ti__bar { display: flex; gap: 12px; align-items: center; flex-wrap: wrap; }
.ti__q { flex: 1 1 220px; max-width: 320px; }
.ti__grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(min(100%, 260px), 1fr)); gap: 16px; }
.ti__auto { display: grid; grid-template-columns: repeat(auto-fit, minmax(min(100%, 420px), 1fr)); gap: 16px; align-items: start; }
.ti__keys { display: flex; flex-direction: column; }
.ti__key { display: flex; align-items: center; gap: 8px; padding: 12px 0; flex-wrap: wrap; }
.ti__key + .ti__key { box-shadow: 0 -1px 0 var(--zg-stroke); }
.ti__kt { flex: 1 1 200px; min-width: 0; display: flex; flex-direction: column; gap: 4px; font-size: 14px; align-items: flex-start; }
.ti__kt code { font-size: 13px; color: var(--zg-text-2); overflow-wrap: anywhere; }
</style>
