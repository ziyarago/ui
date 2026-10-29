<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue';
import data from '../data/examples.json';
import { Preview, setProNames } from '../auditkit/preview-vue.js';
import { useUiTheme } from '@ziyarago/ui/theme';
import { t } from '@ziyarago/ui/internal';

setProNames(data.proNames);
const sections = data.examples as any[];
const ready = ref(false);
onMounted(async () => {
  const w = window as any;
  w.__zgT = t;
  w.__zgTheme = useUiTheme();
  w.__zgTheme.setEffects('full');
  await nextTick();
  await new Promise(r => setTimeout(r, 1200));
  w.__zg.mounted = document.querySelectorAll('[data-variant] .doc-preview').length;
  w.__zg.expected = sections.reduce((a, e) => a + e.variants.length, 0);
  w.__zg.done = true;
  ready.value = true;
});
</script>

<template>
  <div id="root" :data-ready="ready">
    <section v-for="ex in sections" :key="ex.name" :data-component="ex.name">
      <h2>{{ ex.name }}</h2>
      <div v-for="(v, i) in ex.variants" :key="i" :data-variant="i" :data-label="v.label">
        <div class="zg-test-mount"><Preview :name="ex.name" :variant="v" /></div>
      </div>
    </section>
  </div>
</template>
