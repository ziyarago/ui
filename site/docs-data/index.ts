import { GROUPS } from './groups'
import type { Example } from './types'

const modules = import.meta.glob<{ default: Example[] }>('./examples/*.ts', { eager: true })

export const EXAMPLES: Record<string, Example> = {}
for (const m of Object.values(modules)) for (const e of m.default) EXAMPLES[e.name] = e

export const allNames = GROUPS.flatMap(g => g.names)
export { GROUPS }
