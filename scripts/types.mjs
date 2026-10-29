#!/usr/bin/env node
// Generates (free components only) types/vue.d.ts, types/react.d.ts and types/vue-global.d.ts from src/meta (the API source of truth). Run: npm run types
// Per component: Ui<Name>Props (props + events, JSDoc from the meta), Vue also Ui<Name>Slots. Hand-written helpers stay in types/shared.d.ts.
import { writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const { meta } = await import(join(root, 'src/meta/index.js'));
const { isPro } = await import(join(root, 'src/meta/tiers.js'));
// Pro names are documented in the meta but have no implementation here: their types are generated in @ziyarago/ui-pro.
const names = Object.keys(meta).filter(n => !isPro(n)).sort();

const SIZES = "'xs' | 'sm' | 'md' | 'lg' | 'xl'";
const TONES = "'brand' | 'sky' | 'success' | 'warning' | 'danger' | 'neutral'";
const alias = { [SIZES]: 'Size', [TONES]: 'Tone' };

// Event payloads. The meta only describes events in prose, so the argument lists live here.
// Rules: click => native MouseEvent; change on a model component => the model value; anything else not listed => no arguments.
// `PropItem<'x'>` expands to the element type of that component's prop.
const EVENT_ARGS = {
  'AppShell.change': 'value: string', 'AppShell.collapse': 'collapsed: boolean',
  'Sortable.change': 'items: any[]',
  'CopyButton.copy': 'value: string', 'CopyButton.error': 'error: unknown',
  'ToggleGroup.change': 'value: string | string[] | null',
  'ActionRail.change': 'value: string', 'ActionCard.collapse': 'collapsed: boolean',
  'NotificationBell.read': 'id: string | number', "NotificationBell.select": "item: PropItem<'items'>",
  'SearchInput.search': 'query: string', 'CodeInput.complete': 'code: string',
  'Calendar.change': 'date: Date', 'RangeCalendar.change': 'range: [Date | null, Date | null]', 'DatePicker.change': 'date: Date', 'CalendarView.change': 'date: Date',
  'FileUpload.change': 'files: File[]', 'FileUpload.reject': "file: File, reason: 'type' | 'size' | 'count'",
  'ImageUpload.change': 'dataUrl: string, file: File',
  'LoginForm.submit': 'values: { email: string; password: string; remember: boolean }',
  'DataTable.rowClick': 'row: any, index: number', 'DataTable.select': 'ids: (string | number)[]', 'DataTable.sort': "key: string, dir: 'asc' | 'desc'",
  'TreeView.select': 'id: string | number',
  'ChartCard.menu': 'label: string',
  'LineChart.pointClick': 'point: { seriesKey: string; series: string; index: number; x: string | number | Date; label: string; y: number | null }', 'AreaChart.pointClick': 'point: { seriesKey: string; series: string; index: number; x: string | number | Date; label: string; y: number | null }', 'BarChart.pointClick': 'point: { seriesKey: string; series: string; index: number; x: string | number | Date; label: string; y: number | null }',
  'DonutChart.pointClick': 'slice: { key: string; label: string; value: number; share: number; index: number }',
  'LineChart.legendToggle': 'item: { key: string; label: string; hidden: boolean }', 'AreaChart.legendToggle': 'item: { key: string; label: string; hidden: boolean }', 'BarChart.legendToggle': 'item: { key: string; label: string; hidden: boolean }', 'DonutChart.legendToggle': 'item: { key: string; label: string; hidden: boolean }',
  'TabTiles.change': 'value: string',
  'StatusPage.notify': 'email: string', 'PageStatus.notify': 'email: string',
  'Actionsheet.select': "item: PropItem<'items'>",
  'Dropdown.select': 'value: string', 'Menu.select': 'value: string', 'ContextMenu.select': 'value: string',
  'CommandBar.action': 'id: string', 'CommandPalette.run': 'id: string',
  'Tour.step': 'index: number',
  'TopNav.change': 'value: string', 'SideNav.change': 'value: string', 'SubNav.change': 'value: string', 'PillTabs.change': 'value: string',
  'Pagination.change': 'page: number', 'Gallery.change': 'index: number', 'Carousel.change': 'index: number',
  'Map.select': "marker: PropItem<'markers'>",
  'ChatAi.send': 'text: string',
  'RoomGrid.select': 'no: string',
  'PipelineBoard.move': 'move: { id: string | number; from: string | number; to: string | number }',
};

const esc = s => String(s).replace(/\*\//g, '*\\/');
const jsdoc = (lines, ind = '  ') => {
  const l = lines.filter(Boolean).flatMap(x => esc(x).split('\n'));
  if (!l.length) return '';
  if (l.length === 1) return `${ind}/** ${l[0]} */\n`;
  return `${ind}/**\n${l.map(x => `${ind} * ${x}`.trimEnd()).join('\n')}\n${ind} */\n`;
};
const key = k => /^[A-Za-z_$][\w$]*$/.test(k) ? k : JSON.stringify(k);
const cap = s => s[0].toUpperCase() + s.slice(1);
const evProp = e => 'on' + cap(e);

// Meta types are TS-ish prose: untyped callback params and a recursive Node[] that would resolve to the DOM Node.
const fixType = (t, fw) => {
  let s = t.replace(/\bchildren\?: Node\[\]/g, 'children?: any[]').replace(/\bDealCardProps\b/g, 'UiDealCardProps');
  s = s.replace(/\(([^()]*)\)\s*=>/g, (m, params) => '(' + params.split(',').map(p => { p = p.trim(); return !p || p.includes(':') || p.startsWith('...') ? p : p + ': any'; }).filter(Boolean).join(', ') + ') =>');
  if (fw === 'react') s = s.replace(/\bVNode\b/g, 'ReactNode');
  return alias[s] || s;
};

const defaultTag = d => d === undefined ? '' : `@default ${typeof d === 'string' ? (/^['"{[(]/.test(d) || /\s/.test(d) ? d : `'${d}'`) : JSON.stringify(d)}`;

function model(m) {
  const e = Object.entries(m.props || {}).find(([, d]) => d.model);
  return e ? { name: e[0], type: e[1].type } : null;
}

function eventArgs(n, m, e, fw) {
  const k = `${n}.${e}`;
  let a;
  if (k in EVENT_ARGS && EVENT_ARGS[k] !== '') a = EVENT_ARGS[k];
  else if (e === 'click') a = fw === 'react' ? 'event: MouseEvent<HTMLElement>' : 'event: MouseEvent';
  else if (e === 'change' && model(m)) a = 'value: ' + fixType(model(m).type, fw);
  else a = '';
  return a.replace(/PropItem<'(\w+)'>/g, (_, p) => `NonNullable<Ui${n}Props['${p}']>[number]`);
}

function component(n, fw) {
  const m = meta[n], mv = model(m);
  const out = [];
  const used = new Set();
  const lines = [];
  for (const [p, d] of Object.entries(m.props || {})) {
    used.add(p);
    lines.push(jsdoc([d.description, defaultTag(d.default), d.forwarded ? '@remarks Forwarded to the inner element.' : ''].filter(Boolean)) + `  ${key(p)}${d.required ? '' : '?'}: ${fixType(d.type, fw)};`);
  }
  const evs = [];
  for (const [e, desc] of Object.entries(m.events || {})) {
    const a = eventArgs(n, m, e, fw);
    evs.push([e, a]);
    if (m.props?.[evProp(e)]) continue; // already documented as a prop
    lines.push(jsdoc([desc, '@event ' + e]) + `  ${evProp(e)}?: (${a}) => void;`);
    used.add(evProp(e));
  }
  if (fw === 'vue' && mv) {
    const ch = evs.find(([e]) => e === 'change');
    const t = ch && ch[1] ? ch[1].replace(/^\w+: /, '') : fixType(mv.type, fw);
    lines.push(jsdoc(['v-model update. Emitted together with `change`.']) + `  'onUpdate:${mv.name}'?: (value: ${t}) => void;`);
  }
  if (fw === 'react') {
    for (const [s, d] of Object.entries(m.slots || {})) {
      if (s === 'default' || used.has(s)) continue;
      lines.push(jsdoc([d, '@slot ' + s + ' (React: pass as a prop)']) + `  ${key(s)}?: ReactNode;`);
    }
    lines.push(`  children?: ReactNode;`);
  }
  out.push(jsdoc([m.description, ...(m.notes || []).map(x => 'Note: ' + x)], '') + `export interface Ui${n}Props {\n${lines.join('\n')}\n}`);
  if (fw === 'vue') {
    const sl = Object.entries(m.slots || {}).map(([s, d]) => jsdoc([d], '  ') + `  ${key(s)}?: () => any;`);
    out.push(sl.length ? `export interface Ui${n}Slots {\n${sl.join('\n')}\n}` : `export interface Ui${n}Slots {}`);
    out.push(`export const Ui${n}: UiVueComponent<Ui${n}Props, Ui${n}Slots>;`);
  } else {
    out.push(`export const Ui${n}: ComponentType<Ui${n}Props>;`);
  }
  return out.join('\n');
}

mkdirSync(join(root, 'types'), { recursive: true });
const banner = '// generated by scripts/types.mjs from src/meta — do not edit\n';

const vue = banner + `import type { DefineComponent, PublicProps, SlotsType, VNode } from 'vue';
import type { Size, Tone } from './shared';
export type { Size, Tone, Rule, NavItem, Column } from './shared';

/** Vue component type: props and events are checked by Volar / vue-tsc, named slots by \`$slots\`. */
export type UiVueComponent<P extends object, S extends Record<string, any> = {}> = DefineComponent<P, {}, {}, {}, {}, {}, {}, {}, string, PublicProps, P, {}, SlotsType<S>>;

` + names.map(n => component(n, 'vue')).join('\n\n') + `

export const rules: typeof import('./shared').rules;
export function install(app: import('vue').App): void;
/** Extension API: wraps plugin component definitions like the built-in ones, registers them (C.Name cross references work) and returns { UiName: Component }. */
export function defineUiComponents(defs: Record<string, import('./core').ComponentDefinition>, options?: { override?: boolean }): Record<string, import('vue').Component>;
declare const _default: { install: typeof install };
export default _default;
export { useUiTheme } from './theme';
export { fmt, setIconBase, registerIcons } from './shared';
`;

const react = banner + `import type { ComponentType, MouseEvent, ReactNode } from 'react';
import type { Size, Tone } from './shared';
export type { Size, Tone, Rule, NavItem, Column } from './shared';

` + names.map(n => component(n, 'react')).join('\n\n') + `

export const rules: typeof import('./shared').rules;
export { useUiTheme } from './theme';
export { fmt, setIconBase, registerIcons } from './shared';
/** Extension API: wraps plugin component definitions like the built-in ones, registers them (C.Name cross references work) and returns { UiName: Component }. */
export function defineUiComponents(defs: Record<string, import('./core').ComponentDefinition>, options?: { override?: boolean }): Record<string, ComponentType<any>>;
`;

const global = banner + `// Opt in to template typing for globally registered components (app.use(ui)): add
//   import '@ziyarago/ui/vue/global'   (in env.d.ts)   or   /// <reference types="@ziyarago/ui/vue/global" />
// Not needed with unplugin-vue-components (it writes its own components.d.ts) or Nuxt (generated).
import type * as Ui from './vue';

declare module 'vue' {
  export interface GlobalComponents {
` + names.map(n => `    Ui${n}: typeof Ui.Ui${n};`).join('\n') + `
  }
}
export {};
`;

writeFileSync(join(root, 'types/vue.d.ts'), vue);
writeFileSync(join(root, 'types/react.d.ts'), react);
writeFileSync(join(root, 'types/vue-global.d.ts'), global);
console.log(names.length + ' components typed');
