---
name: ziyarago-ui
description: Build or change UI with the @ziyarago/ui component library (Vue, Nuxt, React). Use when creating screens, pages, forms, tables, dashboards or restyling an interface in a project that depends on @ziyarago/ui.
---

# Using @ziyarago/ui

1. Find what to use: MCP tools `suggest_ui`, `search_components`, `list_templates`. Without MCP read `node_modules/@ziyarago/ui/dist/llms.txt`.
2. Prefer a page template (`get_template`) for whole screens; wrap pages in `UiAppShell` (top or side menu).
3. Before using any component call `get_component` and use only the documented props, values, slots and events.
4. Vue/Nuxt: `v-model` for controlled inputs, named slots. React: `modelValue` + `onChange`, slots as props, `children` = default slot.
5. Style with `var(--zg-*)` tokens only. Sizes: `size="xs|sm|md|lg|xl"`. Cards: `variant="default|inverse|gradient"` with `tone`.
6. One brand-filled element per view. Verify light and dark theme and `dir="rtl"`.
