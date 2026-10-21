<script setup lang="ts">
type K = '404' | '401' | 'maintenance' | 'soon'
const kind = ref<K>('404')
const ITEMS = (['404', '401', 'maintenance', 'soon'] as K[]).map(value => ({ value, label: value }))
const DATA: Record<K, [string, string, string, string]> = {
  '404': ['404', 'Page not found', 'The page may have moved. Check the address or go back.', 'Back to home'],
  '401': ['401', 'Not authorized', 'You need permission to open this page.', 'Back to home'],
  maintenance: ['', 'Under maintenance', 'We are updating the service. It will be back shortly.', 'Back to home'],
  soon: ['', 'Coming soon', 'We are working on it. Leave your email and we will tell you first.', 'Notify me'],
}
const d = computed(() => DATA[kind.value])
const email = ref('')
</script>

<template>
  <div class="ts">
    <div class="ts__bar"><UiSegmentedControl v-model="kind" size="sm" :items="ITEMS" /></div>
    <div class="zg-es zg-es--page">
      <TplSlot id="code">
        <span v-if="d[0]" class="zg-num ts__num">{{ d[0] }}</span>
        <span v-else class="zg-es__ico"><UiIcon :name="kind === 'soon' ? 'rocket' : 'wrench'" :size="28" /></span>
      </TplSlot>
      <TplSlot id="message">
        <div class="ts__msg"><b>{{ d[1] }}</b><span>{{ d[2] }}</span></div>
      </TplSlot>
      <TplSlot id="action">
        <div v-if="kind === 'soon'" class="ts__form">
          <div class="ts__in"><UiTextField v-model="email" placeholder="name@email.com" icon="mail" /></div>
          <UiButton variant="primary">{{ d[3] }}</UiButton>
        </div>
        <UiButton v-else variant="primary">{{ d[3] }}</UiButton>
      </TplSlot>
    </div>
  </div>
</template>

<style scoped>
.ts { min-height: 100%; }
.ts .zg-es { gap: 18px; }
.ts__bar { position: sticky; top: 0; z-index: 20; display: flex; justify-content: center; padding: 10px; }
.ts__num { font-size: clamp(80px, 14vw, 150px); line-height: 1; color: var(--zg-brand-text); }
.ts__msg { display: flex; flex-direction: column; gap: 8px; align-items: center; }
.ts__msg b { font-size: 24px; color: var(--zg-text-1); }
.ts__form { display: flex; gap: 8px; flex-wrap: wrap; justify-content: center; width: 420px; max-width: 100%; }
.ts__in { flex: 1 1 200px; }
</style>
