import { defineComponent, h, ref, type PropType } from 'vue'
import { useRoute } from 'vue-router'
import * as Free from '@ziyarago/ui/vue'
import * as ProUI from '#ziyarago-pro'
import type { Variant, Item, Child } from '~/docs-data/types'
import { substitute } from '~/utils/inside'

const UI = { ...Free, ...ProUI }

const build = (c: Child, key?: number): any => {
  const comp = /^[a-z]/.test(c.name) ? c.name : (UI as any)['Ui' + c.name]
  const slots: Record<string, () => any> = {}
  const kids = [...(c.text ? [c.text] : []), ...(c.children ?? []).map((x, i) => build(x, i))]
  if (kids.length) slots.default = () => kids
  for (const [k, t] of Object.entries(c.slots ?? {})) slots[k] = () => (typeof t === 'string' ? t : t.map((x, i) => build(x, i)))
  return typeof comp === 'string' ? h(comp, { key, ...(c.props ?? {}) }, kids) : h(comp, { key, ...(c.props ?? {}) }, slots)
}

export default defineComponent({
  name: 'DocPreview',
  props: { name: { type: String, required: true }, variant: { type: Object as PropType<Variant>, required: true } },
  setup(props) {
    const models = ref<Record<number, any>>({})
    const open = ref(useRoute().query.open === '1')
    const items = (): Item[] => (props.variant.items?.length ? props.variant.items : [props.variant])
    return () => {
      const comp = (UI as any)['Ui' + props.name]
      const v = props.variant
      const els = items().map((it, i) => {
        const p: Record<string, any> = { ...(it.props ?? {}) }
        if ('modelValue' in p) {
          if (!(i in models.value)) models.value[i] = p.modelValue
          p.modelValue = models.value[i]
          p['onUpdate:modelValue'] = (x: any) => (models.value[i] = x)
        }
        if ('value' in p) {
          const k = 'v' + i
          if (!(k in models.value)) models.value[k] = p.value
          p.value = models.value[k]
          p.onChange = (x: any) => (models.value[k] = x)
        }
        if ('index' in p) {
          const k = 'i' + i
          if (!(k in models.value)) models.value[k] = p.index
          p.index = models.value[k]
          p.onChange = (x: number) => (models.value[k] = x)
        }
        if (props.name === 'PipelineBoard' && Array.isArray(p.stages)) {
          const k = 's' + i
          if (!(k in models.value)) models.value[k] = p.stages
          p.stages = models.value[k]
          p.onMove = ({ id, from, to }: any) => {
            const next = (models.value[k] as any[]).map(s => ({ ...s, cards: [...(s.cards ?? [])] }))
            const src = next.find(s => s.id === from), dst = next.find(s => s.id === to)
            const at = src ? src.cards.findIndex((c: any, n: number) => (c.id ?? n) === id) : -1
            if (src && dst && at >= 0) dst.cards.push(src.cards.splice(at, 1)[0])
            models.value[k] = next
          }
        }
        if (v.overlay) { p.open = open.value; p.onClose = () => (open.value = false); if (props.name === 'ConfirmDialog') p.onCancel = p.onClose }
        const slots: Record<string, () => any> = {}
        const kids = [...(it.text ? [it.text] : []), ...(it.children ?? []).map((x, k) => build(x, k))]
        if (kids.length) slots.default = () => kids
        for (const [k, t] of Object.entries(it.slots ?? {})) slots[k] = () => (typeof t === 'string' ? t : t.map((x, k2) => build(x, k2)))
        if (v.inside) return build(substitute(v.inside, { name: props.name, props: p, text: it.text, slots: it.slots, children: it.children }), i)
        return h(comp, { key: i, ...p }, slots)
      })
      const body = v.overlay ? [h(UI.UiButton as any, { variant: 'primary', onClick: () => (open.value = true) }, () => 'Open'), ...els] : els
      return h('div', { class: 'doc-preview', style: v.width ? { width: '100%', maxWidth: v.width, flexDirection: 'column', alignItems: 'stretch' } : undefined }, body)
    }
  },
})
