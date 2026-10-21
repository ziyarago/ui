<script setup lang="ts">
const props = defineProps<{ error: { statusCode?: number; statusMessage?: string } }>()
useSeo({ title: 'Page not found — @ziyarago/ui', description: 'This page does not exist.', noindex: true })
const home = () => clearError({ redirect: '/' })
</script>

<template>
  <div class="zg-root e404">
    <UiErrorPage :code="String(props.error.statusCode ?? 404)" title="Page not found" description="The page may have moved. Check the address or open the components list.">
      <UiButton variant="primary" @click="home">Home</UiButton>
      <NuxtLink to="/docs/components"><UiButton>Components</UiButton></NuxtLink>
    </UiErrorPage>
  </div>
</template>

<style scoped>
.e404 { min-height: 100vh; display: grid; place-items: center; padding: 24px; }
a { text-decoration: none; }
</style>
