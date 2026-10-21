<script setup lang="ts">
const S = [{ id: 'l1', t: '1. Who we are' }, { id: 'l2', t: '2. Data we collect' }, { id: 'l3', t: '3. How we use data' }, { id: 'l4', t: '4. Sharing and transfers' }, { id: 'l5', t: '5. Your rights' }, { id: 'l6', t: '6. Retention' }]
const active = ref('l1')
const P = 'We process personal data only where we have a lawful reason to do so. This section explains what that means in practice, who can see your information and how long we keep it. If a sentence here is unclear, write to us and we will explain it in plain language.'
</script>

<template>
  <div class="tlg">
    <UiPageHeader title="Privacy policy" subtitle="How ZiyaraGo handles your data">
      <template #actions><UiButton icon="printer">Print</UiButton><UiButton variant="primary" icon="download">Download PDF</UiButton></template>
    </UiPageHeader>
    <TplSlot id="meta"><div class="tlg__meta"><UiChip tone="neutral" icon="calendar" size="sm">Last updated 12 Mar 2026</UiChip><UiChip tone="neutral" icon="file-text" size="sm">Version 4.2</UiChip><UiChip tone="success" icon="check" size="sm">In force</UiChip></div></TplSlot>
    <div class="tlg__two">
      <div class="tlg__aside">
        <div class="tlg__stick">
          <TplSlot id="toc">
            <UiCard title="Contents"><nav class="tlg__toc"><a v-for="s in S" :key="s.id" :href="`#${s.id}`" :class="{ on: active === s.id }" @click.prevent="active = s.id">{{ s.t }}</a></nav></UiCard>
          </TplSlot>
        </div>
      </div>
      <div class="tlg__main">
        <TplSlot id="document">
          <UiCard>
            <article class="tlg__doc"><template v-for="s in S" :key="s.id"><h3 :id="s.id">{{ s.t }}</h3><p>{{ P }}</p></template></article>
          </UiCard>
        </TplSlot>
        <TplSlot id="contact"><UiCard><div class="tlg__c"><span class="tlg__i"><UiIconTile icon="mail" tone="brand" /></span><span><b>Questions about this policy?</b><small>privacy@ziyarago.com</small></span><UiButton>Contact us</UiButton></div></UiCard></TplSlot>
      </div>
    </div>
  </div>
</template>

<style scoped>
.tlg { display: flex; flex-direction: column; gap: 16px; min-width: 0; }
.tlg__meta { display: flex; flex-wrap: wrap; gap: 8px; }
.tlg__two { display: flex; flex-wrap: wrap; gap: 16px; align-items: stretch; }
.tlg__aside { flex: 1 1 260px; max-width: 100%; min-width: 0; }
.tlg__main { flex: 999 1 460px; min-width: 0; display: flex; flex-direction: column; gap: 16px; }
.tlg__stick { position: sticky; top: 16px; }
.tlg__toc { display: flex; flex-direction: column; gap: 2px; }
.tlg__toc a { padding: 8px 12px; border-radius: 12px; color: var(--zg-text-2); text-decoration: none; font-size: 14px; }
.tlg__toc a.on { background: color-mix(in oklch, var(--zg-brand) 14%, transparent); color: var(--zg-brand-text); }
.tlg__doc h3 { margin: 20px 0 8px; font: 600 18px/1.3 var(--zg-font); color: var(--zg-text-1); }
.tlg__doc h3:first-child { margin-top: 0; }
.tlg__doc p { margin: 0; color: var(--zg-text-2); font-size: 15px; line-height: 1.7; }
.tlg__c { display: flex; align-items: center; gap: 14px; flex-wrap: wrap; }
.tlg__c span { flex: 1 1 200px; display: flex; flex-direction: column; font-size: 14px; }
.tlg__i { flex: none; display: inline-flex; }
.tlg__c small { color: var(--zg-text-3); }
@media (max-width: 860px) { .tlg__stick { position: static; } }
</style>
