<script setup lang="ts">
const lines = ref([{ id: 1, title: 'Hilton Suites Makkah', sub: '5 nights, double room', qty: 1, price: 1840 }, { id: 2, title: 'Airport transfer', sub: 'Jeddah to Makkah', qty: 2, price: 65 }, { id: 3, title: 'Umrah guide (PDF)', sub: 'Digital', qty: 1, price: 12 }])
const sub = computed(() => lines.value.reduce((s, l) => s + l.qty * l.price, 0))
const method = ref('card')
const country = ref('uz')
const METHODS = [{ value: 'card', title: 'Card', desc: 'Visa, Mastercard', icon: 'credit-card' }, { value: 'transfer', title: 'Bank transfer', desc: 'Invoice by email', icon: 'landmark' }, { value: 'cash', title: 'Pay on arrival', desc: 'At the hotel', icon: 'wallet' }]
const money = (n: number) => `$${n.toLocaleString('en-US')}`
</script>

<template>
  <div class="tc">
    <UiPageHeader title="Checkout" subtitle="Review your trip and pay securely" />
    <TplSlot id="steps"><UiStepper :steps="['Cart', 'Details', 'Payment', 'Done']" :current="1" /></TplSlot>
    <div class="tc__two">
      <div class="tc__main">
        <TplSlot id="items">
          <UiCard title="Your cart">
            <div class="tc__list">
              <div v-for="l in lines" :key="l.id" class="tc__line">
                <UiIconTile icon="package" tone="brand" />
                <span class="tc__t"><b>{{ l.title }}</b><span class="zg-hint">{{ l.sub }}</span></span>
                <div class="tc__q"><UiNumberInput v-model="l.qty" :min="1" :max="9" /></div>
                <b class="tc__p">{{ money(l.qty * l.price) }}</b>
                <UiIconButton icon="trash-2" label="Remove" />
              </div>
            </div>
          </UiCard>
        </TplSlot>
        <TplSlot id="address">
          <UiCard title="Contact and address">
            <div class="tc__grid">
              <UiTextField label="Full name" placeholder="Aziz Karimov" /><UiTextField label="Email" icon="mail" placeholder="aziz@mail.com" />
              <UiSelect v-model="country" label="Country" :options="[{ value: 'uz', label: 'Uzbekistan' }, { value: 'tr', label: 'Turkey' }, { value: 'sa', label: 'Saudi Arabia' }]" /><UiTextField label="City" placeholder="Tashkent" />
            </div>
          </UiCard>
        </TplSlot>
        <TplSlot id="payment">
          <UiCard title="Payment">
            <div class="tc__pay">
              <UiOptionCards v-model="method" :options="METHODS" :min="170" />
              <div v-if="method === 'card'" class="tc__grid"><UiTextField label="Card number" icon="credit-card" placeholder="0000 0000 0000 0000" /><div class="tc__grid"><UiTextField label="Expiry" placeholder="MM / YY" /><UiTextField label="CVC" placeholder="123" /></div></div>
            </div>
          </UiCard>
        </TplSlot>
      </div>
      <div class="tc__side">
        <TplSlot id="summary">
          <UiCard title="Order summary">
            <div class="tc__sum">
              <UiTextField label="Promo code" placeholder="UMRAH10" />
              <UiDescriptions :items="[{ label: 'Subtotal', value: money(sub) }, { label: 'Service fee', value: '$24' }, { label: 'Discount', value: '-$0' }]" />
              <div class="tc__tot"><span>Total</span><b>{{ money(sub + 24) }}</b></div>
              <UiButton variant="primary" size="lg" icon="lock" block>Pay {{ money(sub + 24) }}</UiButton>
              <span class="zg-hint">Free cancellation up to 7 days before check-in.</span>
            </div>
          </UiCard>
        </TplSlot>
      </div>
    </div>
  </div>
</template>

<style scoped>
.tc { display: flex; flex-direction: column; gap: 16px; min-width: 0; }
.tc__two { display: flex; flex-wrap: wrap; gap: 16px; align-items: flex-start; }
.tc__main { flex: 999 1 460px; min-width: 0; display: flex; flex-direction: column; gap: 16px; }
.tc__side { flex: 1 1 320px; min-width: 0; }
.tc__list { display: flex; flex-direction: column; gap: 14px; }
.tc__line { display: flex; align-items: center; gap: 12px; flex-wrap: wrap; }
.tc__t { flex: 1 1 160px; min-width: 0; display: flex; flex-direction: column; }
.tc__q { width: 140px; }
.tc__p { min-width: 72px; text-align: end; }
.tc__grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(min(100%, 220px), 1fr)); gap: 12px; }
.tc__pay, .tc__sum { display: flex; flex-direction: column; gap: 14px; }
.tc__tot { display: flex; justify-content: space-between; align-items: baseline; font-size: 18px; }
.tc__tot b { font: 400 28px var(--zg-font); letter-spacing: -.02em; }
</style>
