import type { Child, Item, Variant } from '~/docs-data/types'

const lit = (v: any): string => {
  if (v === null) return 'null'
  if (typeof v === 'string') return `'${v.replace(/\\/g, '\\\\').replace(/'/g, "\\'")}'`
  if (Array.isArray(v)) return `[${v.map(lit).join(', ')}]`
  if (typeof v === 'object') return `{ ${Object.entries(v).map(([k, x]) => `${/^[A-Za-z_$][\w$]*$/.test(k) ? k : lit(k)}: ${lit(x)}`).join(', ')} }`
  return String(v)
}
const kebab = (s: string) => s.replace(/[A-Z]/g, c => '-' + c.toLowerCase())
const tagOf = (n: string) => (/^[a-z]/.test(n) ? n : `Ui${n}`)
const pad = (s: string, n = 2) => s.split('\n').map(l => ' '.repeat(n) + l).join('\n')

type Node = Child & { overlay?: boolean }

function vueNode(n: Node): string {
  const tag = tagOf(n.name)
  const attrs: string[] = []
  for (const [k, val] of Object.entries(n.props ?? {})) {
    if (k === 'modelValue') attrs.push('v-model="value"')
    else if (typeof val === 'string') attrs.push(`${kebab(k)}="${val.replace(/"/g, '&quot;')}"`)
    else if (val === true) attrs.push(kebab(k))
    else attrs.push(`:${kebab(k)}="${lit(val)}"`)
  }
  if (n.overlay) attrs.push(':open="open"', '@close="open = false"')
  const inline = attrs.join(' ').length <= 60
  const head = !attrs.length ? `<${tag}>` : inline ? `<${tag} ${attrs.join(' ')}>` : `<${tag}\n  ${attrs.join('\n  ')}\n>`
  const inner = [n.text ?? '', ...Object.entries(n.slots ?? {}).map(([s, t]) => (typeof t === 'string' ? `<template #${s}>${t}</template>` : `<template #${s}>\n${t.map(vueNode).map(x => pad(x)).join('\n')}\n</template>`)), ...(n.children ?? []).map(vueNode)].filter(Boolean)
  if (!inner.length) return head.replace(/>$/, ' />')
  return `${head}\n${inner.map(i => pad(i)).join('\n')}\n</${tag}>`
}

function reactNode(n: Node): string {
  const tag = tagOf(n.name)
  const attrs: string[] = []
  for (const [k, val] of Object.entries(n.props ?? {})) {
    if (k === 'modelValue') attrs.push('modelValue={value} onChange={setValue}')
    else if (typeof val === 'string' && !val.includes('"')) attrs.push(`${k}="${val}"`)
    else if (val === true) attrs.push(k)
    else attrs.push(`${k}={${lit(val)}}`)
  }
  if (n.overlay) attrs.push('open={open}', 'onClose={() => setOpen(false)}')
  for (const [s, t] of Object.entries(n.slots ?? {})) attrs.push(typeof t === 'string' ? `${s}={<>${t}</>}` : `${s}={\n  <>\n${t.map(reactNode).map(x => pad(x, 4)).join('\n')}\n  </>\n}`)
  const inline = attrs.join(' ').length <= 60
  const head = !attrs.length ? `<${tag}` : inline ? `<${tag} ${attrs.join(' ')}` : `<${tag}\n  ${attrs.join('\n  ')}`
  const inner = [n.text ?? '', ...(n.children ?? []).map(reactNode)].filter(Boolean)
  if (!inner.length) return inline || !attrs.length ? `${head} />` : `${head}\n/>`
  return `${head}${attrs.length && !inline ? '\n' : ''}>\n${inner.map(i => pad(i)).join('\n')}\n</${tag}>`
}

const nodes = (name: string, v: Variant): Node[] => (v.items?.length ? v.items : [v as Item]).map(i => ({ name, props: i.props, text: i.text, slots: i.slots, children: i.children, overlay: v.overlay }))

export const vueCode = (name: string, v: Variant) => nodes(name, v).map(vueNode).join('\n\n')
export const reactCode = (name: string, v: Variant) => nodes(name, v).map(reactNode).join('\n\n')
