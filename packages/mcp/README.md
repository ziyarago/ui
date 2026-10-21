# @ziyarago/ui-mcp

MCP server for [`@ziyarago/ui`](https://ziyara.vip). It gives AI coding tools (Claude Code, Cursor, Windsurf, Zed, VS Code) the full component catalog: props with all allowed values, slots, events, page templates and setup, so they find components themselves and build screens with them.

## Use in a project

```bash
npm i @ziyarago/ui
npx @ziyarago/ui-mcp init     # adds .mcp.json, AGENTS.md rules, a Claude skill, a Cursor rule
```

Or add the server by hand:

```bash
claude mcp add ziyarago-ui -- npx -y @ziyarago/ui-mcp
```
```json
{ "mcpServers": { "ziyarago-ui": { "command": "npx", "args": ["-y", "@ziyarago/ui-mcp"] } } }
```

## Tools

| Tool | Use |
|---|---|
| `suggest_ui` | Components and page templates for a task in plain words |
| `search_components` | Keyword search over names, purposes and props |
| `list_components` | Every component, optionally per group |
| `get_component` | Full API of one component |
| `list_templates`, `get_template` | Page templates and the docs of each slot |
| `get_setup` | Install and setup for vue, nuxt, react |

The server reads `node_modules/@ziyarago/ui/dist/manifest.json` of the current project, so it always matches the installed version. Set `ZIYARAGO_UI_MANIFEST` to point to another file.
