<script setup lang="ts">
import { UiCard } from '@ziyarago/ui/vue';
</script>
<template>
  <UiCard title="x">
    <!-- @expect: nope -->
    <template #nope>x</template>
  </UiCard>
</template>
