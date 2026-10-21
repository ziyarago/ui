# Component API metadata

One file per group (`typography`, `layout`, `actions`, `forms`, `data`, `feedback`, `overlay`, `navigation`, `media`, `domain`, `pages`). They are the single source of truth for the docs props tables, `dist/manifest.json`, `llms.txt` and the MCP server.

```js
export default {
  Button: {
    description: 'One sentence: what it is and when to use it.',
    props: {
      variant: { type: "'primary' | 'secondary' | 'ghost' | 'danger' | 'inverse' | 'tonal' | 'outlined' | 'text' | 'elevated'", values: ['primary', 'secondary', ...], default: 'secondary', description: 'Visual emphasis.' },
      disabled: { type: 'boolean', default: false, description: 'Blocks interaction and dims the button.' },
      modelValue: { type: 'string', model: true, description: 'Controlled value. Vue v-model, React modelValue + onChange.' },
    },
    slots: { default: 'Button label.', actions: 'Right side of the header.' },   // Vue slot name = React prop / children
    events: { change: 'Called with the new value.', click: 'Native click.' },       // React: onChange / onClick
    notes: ['Optional: gotchas, accessibility, composition tips, 1 sentence each.'],
  },
};
```

Rules
- Document every prop the render code reads (`node scripts/props-extract.mjs Name` lists them; `onXxx` are events, put them in `events`). Do not invent props the code does not read.
- Enums MUST list every allowed value in `values` and show them in `type`; give the real `default` (look at the `||`/`??` fallback in the code).
- `type` is TypeScript style: `string`, `number`, `boolean`, `string[]`, `{ value: string; label: string }[]`, `'a' | 'b'`, `VNode`.
- Props shared by many components (`size`) are documented on each component that supports it: `size: { type: "'xs' | 'sm' | 'md' | 'lg' | 'xl'", values: [...], default: 'md' }`.
- Page templates: document each slot with what it expects (see `site/docs-data/templates.ts`).
- English, short, no filler.

Check with `node scripts/check-meta.mjs`.
