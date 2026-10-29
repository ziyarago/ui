<script setup lang="ts">
onMounted(() => { const w = window as any; setTimeout(() => { w.__zg.mounted = 1; w.__zg.expected = 1; w.__zg.done = true; }, 800); });
</script>

<template>
  <div data-minimal class="p-4 flex flex-col gap-4">
    <UiButton variant="primary" icon="rocket">Primary</UiButton>
    <UiCopyButton value="hello" />
    <UiPagination :pages="12" :page="3" />
    <UiAlert tone="info" title="Heads up">Plain alert</UiAlert>
    <UiEmptyState title="Nothing here" description="Add something" icon="inbox" />
  </div>
</template>
