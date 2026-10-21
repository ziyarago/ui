<script setup lang="ts">
const props = defineProps<{ id: string }>()
const { sel, pick } = useTpl()
function onClick(e: MouseEvent) {
  if ((e.target as HTMLElement).closest('button,a,input,select,textarea,label')) return
  e.stopPropagation()
  pick(props.id)
}
</script>

<template>
  <div class="zgs" :data-slot="id" :data-name="id" :data-sel="sel === id ? '1' : '0'" @click="onClick"><slot /></div>
</template>
