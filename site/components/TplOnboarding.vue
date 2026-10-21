<script setup lang="ts">
const goal = ref('umrah')
const name = ref('')
const TASKS = ref([
  { id: 1, label: 'Create your account', done: true },
  { id: 2, label: 'Add your company details', done: true },
  { id: 3, label: 'Add the first hotel', done: false },
  { id: 4, label: 'Invite a teammate', done: false },
  { id: 5, label: 'Connect Telegram notifications', done: false },
])
const pct = computed(() => Math.round(TASKS.value.filter(t => t.done).length / TASKS.value.length * 100))
const GOALS = [{ value: 'umrah', title: 'Umrah groups', desc: 'Packages and rooms', icon: 'moon' }, { value: 'hajj', title: 'Hajj', desc: 'Long trips with documents', icon: 'landmark' }, { value: 'hotel', title: 'Hotel partner', desc: 'List rooms and rates', icon: 'building-2' }]
</script>

<template>
  <div class="to">
    <UiPageHeader title="Welcome to ZiyaraGo" subtitle="Five short steps to your first booking" />
    <TplSlot id="progress">
      <UiCard><div class="to__prog"><UiStepper :steps="['Account', 'Company', 'Hotel', 'Team', 'Launch']" :current="1" /><UiProgress :value="pct" :label="`${pct}% complete`" /></div></UiCard>
    </TplSlot>
    <div class="to__two">
      <div class="to__main">
        <TplSlot id="steps">
          <UiCard title="Tell us about your company" subtitle="Step 2 of 5">
            <div class="to__form">
              <UiTextField v-model="name" label="Company name" icon="building" placeholder="Al Safa Travel" />
              <UiOptionCards v-model="goal" label="What will you do first?" :options="GOALS" :min="180" />
              <div class="to__row"><UiButton>Back</UiButton><UiButton variant="primary" iconRight="arrow-right">Continue</UiButton></div>
            </div>
          </UiCard>
        </TplSlot>
        <TplSlot id="checklist">
          <UiCard title="Setup checklist"><div class="to__list"><UiCheckbox v-for="t in TASKS" :key="t.id" v-model="t.done" :label="t.label" /></div></UiCard>
        </TplSlot>
      </div>
      <div class="to__side">
        <TplSlot id="tips">
          <UiCard title="Need a hand?"><div class="to__tip"><UiIconTile icon="life-buoy" tone="sky" /><span>Our team replies in Telegram within minutes.</span></div><UiButton icon="send" block>Open chat</UiButton></UiCard>
          <UiCard title="Tip"><div class="to__tip"><UiIconTile icon="lightbulb" tone="warning" /><span>Add photos to a hotel first: listings with photos get twice the inquiries.</span></div></UiCard>
        </TplSlot>
      </div>
    </div>
  </div>
</template>

<style scoped>
.to { display: flex; flex-direction: column; gap: 16px; min-width: 0; }
.to__two { display: flex; flex-wrap: wrap; gap: 16px; align-items: flex-start; }
.to__main { flex: 999 1 460px; min-width: 0; display: flex; flex-direction: column; gap: 16px; }
.to__side { flex: 1 1 300px; min-width: 0; display: flex; flex-direction: column; gap: 16px; }
.to__prog, .to__form, .to__list { display: flex; flex-direction: column; gap: 16px; }
.to__list { gap: 12px; }
.to__row { display: flex; gap: 10px; justify-content: flex-end; flex-wrap: wrap; }
.to__tip { display: flex; gap: 12px; align-items: center; margin-bottom: 12px; color: var(--zg-text-2); font-size: 14px; }
</style>
