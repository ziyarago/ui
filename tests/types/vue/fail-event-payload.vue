<script setup lang="ts">
import { UiPagination } from '@ziyarago/ui/vue';
</script>
<template>
  <!-- @expect: string -->
  <UiPagination :page="1" :pages="3" @change="(p: string) => p.length" />
</template>
