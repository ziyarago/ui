import { BACKGROUNDS } from '@ziyarago/ui/theme'

export interface DisplayState { theme: string; palette: string; dir: string; motion: string; effects: string; bg: string }

/** Shared reactive view of the display settings (theme, palette, direction, motion, effects, background). Client only. */
export function useDisplay() {
  const s = useState<DisplayState>('display', () => ({ theme: 'dark', palette: 'gold', dir: 'ltr', motion: 'auto', effects: 'auto', bg: 'aurora' }))
  const resolved = useState('display-resolved', () => ({ motion: 'on', effects: 'full' }))
  let ui: ReturnType<typeof useUiTheme> | undefined
  const sync = () => { if (!ui) return; Object.assign(s.value, ui.snapshot()); resolved.value = ui.resolved }
  const start = () => { ui = useUiTheme(); sync(); return ui.subscribe(sync) }
  const set = {
    theme: (v: string) => ui?.setTheme(v), palette: (v: string) => ui?.setPalette(v), dir: (v: string) => ui?.setDir(v),
    motion: (v: string) => ui?.setMotion(v), effects: (v: string) => ui?.setEffects(v), bg: (v: string) => ui?.setBackground(v),
  }
  return { s, resolved, set, start, BACKGROUNDS }
}
