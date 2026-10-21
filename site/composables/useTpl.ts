export function useTpl() {
  const sel = useState<string>('tpl-sel', () => '')
  const show = useState<boolean>('tpl-show', () => true)
  const nav = useState<'top' | 'side'>('tpl-nav', () => 'top')
  const scrollTick = useState<number>('tpl-scroll', () => 0)
  const pick = (id: string, scroll = false) => { sel.value = id; if (scroll) scrollTick.value++ }
  return { sel, show, nav, scrollTick, pick }
}
