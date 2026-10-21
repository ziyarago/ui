<script setup lang="ts">
import { ref } from 'vue';
import { UiCheckbox } from '@ziyarago/ui/vue';
const v = ref('text');
</script>
<template>
  <!-- @expect: boolean -->
  <UiCheckbox v-model="v" />
</template>
