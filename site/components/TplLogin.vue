<script setup lang="ts">
import { h } from 'vue'
import { UiAuthLayout } from '@ziyarago/ui/vue'
import TplSlot from './TplSlot.vue'
const logoV = () => h(TplSlot, { id: 'logo' }, () => h('span', { class: 'tl__brand' }, [h('img', { src: '/3d/logo.png', alt: '' }), 'ZiyaraGo']))
</script>

<template>
  <div class="tl">
    <TplSlot id="background" class="tl__bg">
      <div aria-hidden="true" class="tl__bgi"><span class="tl__g1" /><span class="tl__g2" /></div>
    </TplSlot>
    <div class="tl__c">
      <UiAuthLayout title="Sign in" subtitle="Use the work email or phone from your manager." :logo="logoV()">
        <TplSlot id="form"><UiLoginForm /></TplSlot>
        <TplSlot id="footer">
          <div class="tl__foot"><a href="#">Help</a><a href="#">Privacy</a><span>EN · العربية · RU</span></div>
        </TplSlot>
      </UiAuthLayout>
    </div>
  </div>
</template>

<style scoped>
.tl { position: relative; min-height: 100%; display: grid; place-items: center; padding: 24px; box-sizing: border-box; }
.tl__bg { position: absolute !important; inset: 0; border-radius: 0 !important; }
.tl__bgi { position: absolute; inset: 0; overflow: hidden; }
.tl__g1 { position: absolute; width: 60%; aspect-ratio: 1; right: -15%; top: -30%; border-radius: 50%; background: color-mix(in oklch, var(--zg-brand) 28%, transparent); filter: blur(110px); }
.tl__g2 { position: absolute; width: 50%; aspect-ratio: 1; left: -15%; bottom: -25%; border-radius: 50%; background: color-mix(in oklch, var(--zg-sky) 22%, transparent); filter: blur(110px); }
.tl__c :deep(.zg-auth) { min-height: 0; padding: 0; }
.tl__c { position: relative; width: 100%; max-width: 440px; }
:deep(.tl__brand) { display: inline-flex; align-items: center; gap: 10px; font-weight: 700; font-size: 20px; }
:deep(.tl__brand img) { width: 52px; height: 52px; object-fit: contain; }
.tl__foot { display: flex; gap: 10px; flex-wrap: wrap; align-items: center; }
.tl__foot a, .tl__foot span { color: var(--zg-text-3); font-size: 13px; }
.tl__foot span { margin-inline-start: auto; }
</style>
