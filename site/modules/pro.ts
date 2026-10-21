// Pro components on the docs site.
// With @ziyarago/ui-pro available (nuxt.config.ts decides, see ZIYARAGO_PRO) the alias #ziyarago-pro points at its Vue entry and the Nuxt module
// of @ziyarago/ui registers the components. Without it every Pro name gets a placeholder card, so contributors without access still build the free docs.
import { defineNuxtModule, addTemplate, addComponent } from '@nuxt/kit'
import { PRO_NAMES } from '@ziyarago/ui/meta'

export default defineNuxtModule({
  meta: { name: 'ziyarago-site-pro' },
  setup(_opts, nuxt) {
    const pro = (nuxt.options as any).ziyarago?.plugins?.includes('@ziyarago/ui-pro')
    nuxt.options.runtimeConfig.public.pro = !!pro
    if (pro) {
      nuxt.options.alias['#ziyarago-pro'] = '@ziyarago/ui-pro/vue'
      return
    }
    const names = [...PRO_NAMES].sort()
    const file = addTemplate({
      filename: 'ziyarago-pro-placeholders.mjs',
      write: true,
      getContents: () => `import { defineComponent, h } from 'vue'
import { UiCard, UiBadge } from '@ziyarago/ui/vue'
const make = name => defineComponent({
  name: 'Ui' + name, inheritAttrs: false,
  setup: () => () => h('div', { 'data-pro-placeholder': name, style: { minWidth: 0 } }, h(UiCard, { title: 'Ui' + name, subtitle: 'Pro component' }, () => [
    h('div', { style: { display: 'flex' } }, h(UiBadge, { tone: 'brand' }, () => 'Pro')),
    h('p', { style: { margin: '10px 0 0', color: 'var(--zg-text-2)' } }, ['Ui' + name + ' is part of @ziyarago/ui-pro. ', h('a', { href: '/pricing', style: { color: 'var(--zg-brand)' } }, 'See pricing')]),
  ])),
})
${names.map(n => `export const Ui${n} = make('${n}')`).join('\n')}
`,
    })
    nuxt.options.alias['#ziyarago-pro'] = file.dst
    for (const n of names) addComponent({ name: 'Ui' + n, export: 'Ui' + n, filePath: file.dst })
  },
})
