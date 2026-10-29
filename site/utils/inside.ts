import type { Child } from '~/docs-data/types'

/** Replaces the child named '$' in the tree with the given node (used by Variant.inside). */
export const substitute = (tree: Child, node: Child): Child => ({
  ...tree,
  children: tree.children?.map(c => (c.name === '$' ? node : substitute(c, node))),
})
