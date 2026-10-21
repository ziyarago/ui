<script setup lang="ts">
const COLS = [{ key: 'id', label: 'Invoice' }, { key: 'date', label: 'Date' }, { key: 'amount', label: 'Amount', num: true }, { key: 'status', label: 'Status' }, { key: 'dl', label: '' }]
const ROWS = [{ id: 'INV-883', date: 'Apr 1, 2026', amount: '$249.00', status: 'Paid', dl: 'PDF' }, { id: 'INV-842', date: 'Mar 1, 2026', amount: '$249.00', status: 'Paid', dl: 'PDF' }, { id: 'INV-801', date: 'Feb 1, 2026', amount: '$249.00', status: 'Paid', dl: 'PDF' }]
const card = ref('visa')
</script>

<template>
  <div class="tbl">
    <UiPageHeader title="Billing" subtitle="Plan, usage and invoices"><template #actions><UiButton icon="download">Download all</UiButton></template></UiPageHeader>
    <div class="tbl__two">
      <div class="tbl__main">
        <TplSlot id="plan">
          <UiCard title="Current plan">
            <div class="tbl__plan"><UiIconTile icon="crown" tone="brand" /><span class="tbl__t"><b>Pro <UiBadge tone="success" dot>Active</UiBadge></b><span class="zg-hint">$249 / month · renews June 1, 2026</span></span><UiButton>Change plan</UiButton><UiButton variant="ghost">Cancel</UiButton></div>
          </UiCard>
        </TplSlot>
        <TplSlot id="usage">
          <UiCard title="Usage this month">
            <div class="tbl__use"><UiProgress :value="72" label="Seats" meta="18 / 25" /><UiProgress :value="45" label="Storage" meta="45 / 100 GB" /><UiProgress :value="91" tone="warning" label="API requests" meta="91k / 100k" /></div>
          </UiCard>
        </TplSlot>
        <TplSlot id="invoices"><UiCard title="Invoices"><UiDataTable :columns="COLS" :rows="ROWS" /></UiCard></TplSlot>
      </div>
      <div class="tbl__side">
        <TplSlot id="methods">
          <UiCard title="Payment methods">
            <div class="tbl__pm">
              <UiOptionCards v-model="card" :min="160" :options="[{ value: 'visa', title: 'Visa 4242', desc: 'Expires 08/28', icon: 'credit-card' }, { value: 'mc', title: 'Mastercard 0099', desc: 'Expires 01/27', icon: 'credit-card' }]" />
              <UiButton icon="plus">Add card</UiButton>
            </div>
          </UiCard>
        </TplSlot>
        <TplSlot id="upgrade">
          <UiCard variant="inverse" title="Need more room?">
            <div class="tbl__up"><span>Business gives 100 seats, 1 TB and priority support.</span><UiButton variant="primary" icon="rocket" block>Upgrade to Business</UiButton></div>
          </UiCard>
        </TplSlot>
      </div>
    </div>
  </div>
</template>

<style scoped>
.tbl { display: flex; flex-direction: column; gap: 16px; min-width: 0; }
.tbl__two { display: flex; gap: 16px; align-items: flex-start; }
.tbl__main { flex: 1 1 0; min-width: 0; display: flex; flex-direction: column; gap: 16px; }
.tbl__side { flex: 0 0 340px; min-width: 0; display: flex; flex-direction: column; gap: 16px; }
.tbl__plan { display: flex; align-items: center; gap: 14px; flex-wrap: wrap; }
.tbl__t { flex: 1 1 200px; display: flex; flex-direction: column; gap: 2px; }
.tbl__use, .tbl__pm, .tbl__up { display: flex; flex-direction: column; gap: 14px; }
@media (max-width: 860px) { .tbl__two { flex-direction: column; align-items: stretch; } .tbl__side { flex-basis: auto; } }
</style>
