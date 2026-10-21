<script setup lang="ts">
const step = ref(1)
const STEPS = ['Search', 'Pick', 'Guests', 'Confirm']
const date = ref('2026-05-12')
const adults = ref(2)
const kids = ref(0)
const room = ref('double')
const ROOMS = [{ value: 'double', title: 'Double room', desc: 'City view, breakfast', price: '$182', icon: 'bed-double' }, { value: 'family', title: 'Family suite', desc: 'Haram view, 2 bedrooms', price: '$320', icon: 'building-2' }, { value: 'eco', title: 'Economy', desc: 'Shared bathroom', price: '$96', icon: 'bed-single' }]
const price = computed(() => ({ double: 182, family: 320, eco: 96 } as Record<string, number>)[room.value] * 5)
</script>

<template>
  <div class="tb">
    <UiPageHeader title="Book your stay" subtitle="Four short steps to confirm" />
    <TplSlot id="steps"><UiStepper :steps="STEPS" :current="step" /></TplSlot>
    <div class="tb__two">
      <div class="tb__main">
        <TplSlot id="content">
          <UiCard v-if="step === 0" title="Search"><div class="tb__g"><UiTextField label="Destination" icon="map-pin" placeholder="Makkah" /><UiDatePicker v-model="date" label="Check-in" /></div></UiCard>
          <UiCard v-else-if="step === 1" title="Pick a room"><UiOptionCards v-model="room" :options="ROOMS" :min="230" /></UiCard>
          <UiCard v-else-if="step === 2" title="Guests"><div class="tb__g"><UiNumberInput v-model="adults" label="Adults" :min="1" :max="8" /><UiNumberInput v-model="kids" label="Children" :min="0" :max="6" /></div></UiCard>
          <UiCard v-else title="Confirm"><UiAlert tone="success" title="Everything looks good">Review the summary and confirm. You can cancel free of charge up to 7 days before check-in.</UiAlert></UiCard>
        </TplSlot>
        <TplSlot id="nav">
          <div class="tb__nav"><UiButton :disabled="step === 0" icon="arrow-left" @click="step--">Back</UiButton><UiButton v-if="step < 3" variant="primary" @click="step++">Continue</UiButton><UiButton v-else variant="primary" icon="check">Confirm booking</UiButton></div>
        </TplSlot>
      </div>
      <div class="tb__side">
        <div class="tb__stick">
          <TplSlot id="summary">
            <UiCard title="Your booking">
              <div class="tb__sum">
                <UiDescriptions :items="[{ label: 'Hotel', value: 'Hilton Suites Makkah' }, { label: 'Dates', value: '12 to 17 May' }, { label: 'Room', value: ROOMS.find(r => r.value === room)?.title }, { label: 'Guests', value: `${adults} adults, ${kids} children` }]" />
                <div class="tb__tot"><span>Total (5 nights)</span><b>${{ price.toLocaleString('en-US') }}</b></div>
              </div>
            </UiCard>
          </TplSlot>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.tb { display: flex; flex-direction: column; gap: 16px; min-width: 0; }
.tb__two { display: flex; flex-wrap: wrap; gap: 16px; align-items: stretch; }
.tb__main { flex: 999 1 460px; min-width: 0; display: flex; flex-direction: column; gap: 16px; }
.tb__side { flex: 1 1 300px; min-width: 0; }
.tb__stick { position: sticky; top: 16px; }
.tb__g { display: grid; grid-template-columns: repeat(auto-fit, minmax(min(100%, 200px), 1fr)); gap: 14px; }
.tb__nav { display: flex; justify-content: space-between; gap: 12px; }
.tb__sum { display: flex; flex-direction: column; gap: 14px; }
.tb__tot { display: flex; justify-content: space-between; align-items: baseline; font-size: 15px; }
.tb__tot b { font-size: 22px; }
@media (max-width: 860px) { .tb__stick { position: static; } }
</style>
