<script setup lang="ts">
const props = defineProps<{ vue: string; react: string; nuxt?: string }>()
const tab = ref<'vue' | 'react'>('vue')
const code = computed(() => (tab.value === 'vue' ? props.vue : props.react))
</script>

<template>
  <div class="ct">
    <div class="ct__bar">
      <UiSegmentedControl v-model="tab" size="sm" :items="[{ value: 'vue', label: 'Vue / Nuxt' }, { value: 'react', label: 'React' }]" />
    </div>
    <UiCode :code="code" :title="tab === 'vue' ? 'Vue' : 'React'" />
  </div>
</template>

<style scoped>
.ct { display: flex; flex-direction: column; gap: 10px; }
.ct__bar { display: flex; }
</style>
