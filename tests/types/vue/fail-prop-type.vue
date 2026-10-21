<script setup lang="ts">
import { UiDataTable } from '@ziyarago/ui/vue';
</script>
<template>
  <!-- @expect: number -->
  <UiDataTable :columns="[{ key: 'a', label: 'A' }]" :rows="5" />
</template>
