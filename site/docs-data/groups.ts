export type GroupId = 'typography' | 'layout' | 'actions' | 'forms' | 'data' | 'feedback' | 'overlay' | 'navigation' | 'media' | 'domain' | 'pages'

import { GROUPS as G, groupOf as gof } from '../../src/meta/groups.js'

export const GROUPS: { id: GroupId; title: string; blurb: string; names: string[] }[] = G as any
export const groupOf = (name: string) => gof(name) as (typeof GROUPS)[number] | undefined
