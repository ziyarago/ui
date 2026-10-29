// Shared by scripts/types.mjs (free components) and by the Pro repo's scripts/types.mjs (Pro components, same meta, same rules): one generator, no copy to keep in sync.
// createTypeGen(meta).component(name, 'vue' | 'react') returns the declarations of one component.

export function createTypeGen(meta) {
const SIZES = "'xs' | 'sm' | 'md' | 'lg' | 'xl'";
const TONES = "'brand' | 'sky' | 'success' | 'warning' | 'danger' | 'neutral'";
const alias = { [SIZES]: 'Size', [TONES]: 'Tone' };

// Event payloads. The meta only describes events in prose, so the argument lists live here.
// Rules: click => native MouseEvent; change on a model component => the model value; anything else not listed => no arguments.
// `PropItem<'x'>` expands to the element type of that component's prop.
const EVENT_ARGS = {
  'AppShell.change': 'value: string | number', 'AppShell.collapse': 'collapsed: boolean',
  'Sortable.change': 'items: any[]',
  'CopyButton.copy': 'value: string', 'CopyButton.error': 'error: unknown',
  'ToggleGroup.change': 'value: string | number | (string | number)[] | null',
  'ActionRail.change': 'value: string', 'ActionCard.collapse': 'collapsed: boolean',
  'NotificationBell.read': 'id: string | number', "NotificationBell.select": "item: PropItem<'items'>",
  'SearchInput.search': 'query: string', 'SearchInput.change': 'value: string', 'CodeInput.change': 'value: string', 'PasswordInput.change': 'value: string', 'CodeInput.complete': 'code: string',
  'Calendar.change': 'date: Date', 'RangeCalendar.change': 'range: [Date | null, Date | null]', 'DatePicker.change': 'date: Date | null', 'CalendarView.change': 'date: Date',
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
  'TopNav.change': 'value: string | number', 'SideNav.change': 'value: string | number', 'SubNav.change': 'value: string | number', 'PillTabs.change': 'value: string | number',
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

// Optional props accept null (API data, `x ?? null`) and an explicit undefined (exactOptionalPropertyTypes). The adapters drop null props, so null means "not set". Required props stay strict.
const topLevel = t => { let p; do { p = t; t = t.replace(/\([^()]*\)|\{[^{}]*\}|\[[^\[\]]*\]|<[^<>]*>|'[^']*'|"[^"]*"/g, '_'); } while (t !== p); return t; };
const nullable = t => (/\bnull\b/.test(topLevel(t)) ? t : /=>/.test(t) ? `(${t}) | null` : `${t} | null`) + ' | undefined';
// Event handlers are declared as methods (bivariant parameters): a handler `(v: string) => void` is accepted for a payload `string | number | null`.
const asMethod = (name, t) => { const m = /^\((.*)\)\s*=>\s*(.*)$/s.exec(t.trim()); return m ? `${key(name)}?(${m[1]}): ${m[2]};` : null; };

const defaultTag = d => d === undefined ? '' : `@default ${typeof d === 'string' ? (/^['"{[(]/.test(d) || /\s/.test(d) ? d : `'${d}'`) : JSON.stringify(d)}`;

function model(m) {
  const e = Object.entries(m.props || {}).find(([, d]) => d.model);
  return e ? { name: e[0], type: e[1].type } : null;
}

// native input events forwarded to the real <input>/<textarea>: the listener receives the DOM event
const NATIVE_EVENT = { blur: 'FocusEvent', focus: 'FocusEvent', keydown: 'KeyboardEvent', keyup: 'KeyboardEvent', paste: 'ClipboardEvent', input: 'Event' };
function eventArgs(n, m, e, fw) {
  const k = `${n}.${e}`;
  let a;
  if (k in EVENT_ARGS && EVENT_ARGS[k] !== '') a = EVENT_ARGS[k];
  else if ((n === 'TextField' || n === 'Textarea') && e in NATIVE_EVENT) a = 'event: ' + (fw === 'react' ? (e === 'input' ? 'SyntheticEvent' : NATIVE_EVENT[e]) + '<HTMLElement>' : NATIVE_EVENT[e]);
  else if (e === 'change' && (n === 'TextField' || n === 'Textarea')) a = 'value: string';
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
    const ft = fixType(d.type, fw);
    const method = !d.required && /^on[A-Z]/.test(p) ? asMethod(p, ft) : null;
    lines.push(jsdoc([d.description, defaultTag(d.default), d.forwarded ? '@remarks Forwarded to the inner element.' : ''].filter(Boolean)) + '  ' + (method || `${key(p)}${d.required ? '' : '?'}: ${d.required ? ft : nullable(ft)};`));
  }
  const evs = [];
  for (const [e, desc] of Object.entries(m.events || {})) {
    const a = eventArgs(n, m, e, fw);
    evs.push([e, a]);
    if (m.props?.[evProp(e)]) continue; // already documented as a prop
    lines.push(jsdoc([desc, '@event ' + e]) + `  ${evProp(e)}?(${a}): void;`);
    used.add(evProp(e));
  }
  if (fw === 'vue' && mv) {
    const ch = evs.find(([e]) => e === 'change');
    const t = ch && ch[1] ? ch[1].replace(/^\w+: /, '') : fixType(mv.type, fw);
    // The emitted value depends on the consumer data (string or number option values, v-model.number turns a string into a number) and the type checker cannot see that:
    // the update handler stays open, the direction that matters is checked through the modelValue prop. Typed payload: the `change` event.
    lines.push(jsdoc(['v-model update. Emitted together with `change` (typed payload: ' + t.replace(/\*\//g, '') + ').']) + `  'onUpdate:${mv.name}'?(value: any): void;`);
  }
  if (fw === 'vue') lines.push(jsdoc(['Any aria-* and data-* attribute (aria-label, data-testid, ...) lands on the root element.']) + "  [attr: `aria-${string}` | `data-${string}`]: string | number | boolean | undefined;");
  if (fw === 'vue' && mv) lines.push(jsdoc(['Set by `v-model.number`, `v-model.trim` and `v-model.lazy`; Vue applies number and trim to the emitted value.']) + `  modelModifiers?: Record<string, true>;`);
  if (fw === 'react') {
    for (const [s, d] of Object.entries(m.slots || {})) {
      if (s === 'default' || used.has(s)) continue;
      lines.push(jsdoc([d, '@slot ' + s + ' (React: pass as a prop)']) + `  ${key(s)}?: ReactNode;`);
    }
    for (const [k, t] of [['className', 'string'], ['style', 'CSSProperties'], ['id', 'string']]) if (!used.has(k)) lines.push(jsdoc(k === 'style' ? ['Merged into the root element style.'] : [k === 'id' ? 'Set on the root element.' : 'Added to the root element classes.']) + `  ${k}?: ${t};`);
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

  return { component };
}
