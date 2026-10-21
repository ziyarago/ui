## UI: @ziyarago/ui

This project builds interfaces with `@ziyarago/ui` (Vue 3, Nuxt, React). Do not write custom components or raw CSS for things the library already has.

Workflow for any new screen or change of design:
1. Call `suggest_ui` (MCP server `ziyarago-ui`) with the task, or `search_components` / `list_templates`.
2. Start from a page template when one fits (`get_template`), wrap app pages in `UiAppShell`.
3. Call `get_component` for EVERY component before using it. Use only documented props and values.
4. Style with tokens (`var(--zg-*)`), never hard-coded colors. Theme is `data-theme`, `data-palette`, `dir`. Sizes are `size="xs|sm|md|lg|xl"`.
5. Brand fill on ONE hero element per view. Check light and dark theme and RTL.

Fallback without MCP: read `node_modules/@ziyarago/ui/dist/llms.txt` (index) and `llms-full.txt` (all props).
