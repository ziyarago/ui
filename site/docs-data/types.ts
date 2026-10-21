export interface Child {
  /** component name without the Ui prefix, e.g. 'Button'; or an HTML tag in lower case, e.g. 'div' */
  name: string
  props?: Record<string, any>
  text?: string
  slots?: Record<string, string | Child[]>
  children?: Child[]
}

export interface Item {
  /** nested components rendered as children of this one (use for stacks, grids, cards, lists) */
  children?: Child[]
  props?: Record<string, any>
  text?: string
  slots?: Record<string, string | Child[]>
}

export interface Variant {
  label: string
  /** props passed to the component; keep them JSON-like (no functions) so code can be generated */
  props?: Record<string, any>
  /** default slot / children as plain text */
  text?: string
  /** named slots (Vue) / props (React) as plain text */
  slots?: Record<string, string | Child[]>
  /** component renders a fixed overlay: the preview shows a button that toggles `open` */
  overlay?: boolean
  /** render several instances side by side (e.g. all button variants); code shows each in turn. When set, props/text/slots on the variant are ignored */
  items?: Item[]
  /** wrap the preview in a box of this width, e.g. '360px' */
  width?: string
}

export interface Example {
  name: string
  description: string
  variants: Variant[]
}
