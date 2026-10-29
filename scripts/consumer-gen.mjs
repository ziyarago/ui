// Generates a consumer project that type-checks the published d.ts the way a product team uses them (Vue 3.5 + vue-tsc strictTemplates, React + tsc strict).
// One Vue SFC and one TSX file per component, derived from src/meta. Used by scripts/consumer-types.mjs (CI job `consumer-types`) and unit-tested.
//
// What each file exercises:
//   required props only, every optional prop set to null and to undefined, boolean shorthand attributes, kebab-case props,
//   every event as @event / @kebab-event / :on-event with zero-arg and rest-arg handlers, native DOM event handlers,
//   every named slot, v-model with ref<T>, ref<T | null>, ref<T | undefined>, v-model.trim / .number / .lazy, template refs (Vue);
//   controlled value + onChange with useState<T | null> (React).

const isId = k => /^[A-Za-z_$][\w$]*$/.test(k);
const kebab = k => k.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
const cap = s => s[0].toUpperCase() + s.slice(1);
// Text inputs a consumer binds with v-model.number / v-model.trim (Vue converts the emitted string)
const TEXT_MODEL = new Set(['TextField', 'Textarea', 'SearchInput', 'CodeInput', 'PasswordInput']);
const NATIVE = { click: 'MouseEvent', blur: 'FocusEvent', focus: 'FocusEvent', keydown: 'KeyboardEvent', keyup: 'KeyboardEvent', paste: 'ClipboardEvent', input: 'Event' };

export function modelOf(m) {
  const e = Object.entries(m.props || {}).find(([, d]) => d.model);
  return e ? { name: e[0], type: e[1].type } : null;
}

const propsOf = m => Object.entries(m.props || {}).filter(([k]) => isId(k));
const isHandler = (k, d) => /^on[A-Z]/.test(k) && /=>/.test(d.type);

/** Names of the events of a component: meta events plus on* function props. */
export function eventsOf(m) {
  const out = new Set(Object.keys(m.events || {}));
  for (const [k, d] of propsOf(m)) if (isHandler(k, d)) out.add(k[2].toLowerCase() + k.slice(3));
  return [...out];
}

export function genVue(name, m, pkg = '@ziyarago/ui') {
  const C = 'Ui' + name, P = `Ui${name}Props`;
  const props = propsOf(m).filter(([k, d]) => !isHandler(k, d));
  const req = props.filter(([, d]) => d.required).map(([k]) => k);
  const opt = props.filter(([, d]) => !d.required).map(([k]) => k);
  const bools = props.filter(([, d]) => !d.required && d.type.trim() === 'boolean').map(([k]) => k);
  const camel = props.filter(([k]) => /[A-Z]/.test(k) && !/^on[A-Z]/.test(k)).map(([k]) => k);
  const events = eventsOf(m);
  const slots = Object.keys(m.slots || {}).filter(s => s !== 'default');
  const mv = modelOf(m);
  const o = [];
  const w = s => o.push(s);

  w('<script setup lang="ts">');
  w(`import { ref } from 'vue';`);
  w(`import { ${C} } from '${pkg}/vue';`);
  w(`import type { ${P} } from '${pkg}/vue';`);
  w(`void ${C};`);
  w(`const all = {} as Required<${P}>;`);
  w(`const nul = null as null;`);
  w(`const und = undefined as undefined;`);
  w(`void all; void nul; void und;`);
  w(`const req = { ${req.map(k => `${k}: all.${k}`).join(', ')} };`);
  w(`void req;`);
  w(`const el = ref<InstanceType<typeof ${C}> | null>(null);`);
  w(`const last = ref<unknown>(null);`);
  w(`void el; void last;`);
  if (mv) {
    const M = `NonNullable<${P}['${mv.name}']>`;
    w(`const m1 = ref({} as ${M});`);
    w(`const m2 = ref<${M} | null>(null);`);
    w(`const m3 = ref<${M} | undefined>(undefined);`);
    w(`const m4 = ref<${M} | null | undefined>(null);`);
    w(`void m1; void m2; void m3; void m4;`);
    if (TEXT_MODEL.has(name)) {
      w(`const s1 = ref('');`);
      w(`const s2 = ref<string | null>(null);`);
      w(`const n1 = ref(0);`);
      w(`const n2 = ref<number | null>(null);`);
      w(`const n3 = ref<number | undefined>(undefined);`);
      w(`void s1; void s2; void n1; void n2; void n3;`);
    }
  }
  w('</script>');
  w('<template>');
  const bind = req.length ? ' v-bind="req"' : '';
  const allProps = props.map(([k]) => `:${k}="all.${k}"`).join(' ');
  w(`  <${C} ${allProps} />`);
  w(`  <${C}${bind}${props.some(([k]) => k === 'id') ? '' : ' id="x"'} class="c" aria-label="a" data-testid="t" />`);
  w(`  <${C}${bind} />`);
  if (opt.length) {
    w(`  <${C}${bind} ${opt.map(k => `:${k}="nul"`).join(' ')} />`);
    w(`  <${C}${bind} ${opt.map(k => `:${k}="und"`).join(' ')} />`);
  }
  if (bools.length) w(`  <${C}${bind} ${bools.join(' ')} />`);
  if (camel.length) w(`  <${C}${bind} ${camel.map(k => `:${kebab(k)}="all.${k}"`).join(' ')} />`);
  if (events.length) {
    w(`  <${C}${bind} ${events.map(e => `@${e}="() => {}"`).join(' ')} />`);
    w(`  <${C}${bind} ${events.map(e => `@${e}="(...a: unknown[]) => { last = a; }"`).join(' ')} />`);
    w(`  <${C}${bind} ${events.map(e => `@${e}="last = $event"`).join(' ')} />`);
    const kebabEv = events.filter(e => /[A-Z]/.test(e));
    if (kebabEv.length) w(`  <${C}${bind} ${kebabEv.map(e => `@${kebab(e)}="() => {}"`).join(' ')} />`);
    w(`  <${C}${bind} ${events.map(e => `:on-${kebab(e)}="() => {}"`).join(' ')} />`);
    const nat = events.filter(e => NATIVE[e]);
    if (nat.length) w(`  <${C}${bind} ${nat.map(e => `@${e}="(e: ${NATIVE[e]}) => e.type"`).join(' ')} />`);
  }
  if (slots.length || m.slots?.default) {
    w(`  <${C}${bind}>`);
    if (m.slots?.default) w('    text <b>node</b>');
    for (const s of slots) w(isId(s) ? `    <template #${s}>slot</template>` : `    <template #[${JSON.stringify(s)}]>slot</template>`);
    w(`  </${C}>`);
  }
  w(`  <${C}${bind} ref="el" />`);
  if (mv) {
    const v = mv.name === 'modelValue' ? 'v-model' : `v-model:${mv.name}`;
    for (const r of ['m1', 'm2', 'm3', 'm4']) w(`  <${C}${bind} ${v}="${r}" />`);
    if (TEXT_MODEL.has(name)) {
      w(`  <${C}${bind} ${v}.trim="s1" />`);
      w(`  <${C}${bind} ${v}.trim="s2" />`);
      w(`  <${C}${bind} ${v}.number="n1" />`);
      w(`  <${C}${bind} ${v}.number="n2" />`);
      w(`  <${C}${bind} ${v}.number="n3" />`);
      w(`  <${C}${bind} ${v}.lazy="s1" />`);
    }
    w(`  <${C}${bind} :${mv.name}="nul" />`);
    w(`  <${C}${bind} :${mv.name}="und" />`);
    if (events.includes('change')) w(`  <${C}${bind} ${v}="m2" @change="() => {}" />`);
  }
  w('</template>');
  return o.join('\n') + '\n';
}

export function genReact(name, m, pkg = '@ziyarago/ui') {
  const C = 'Ui' + name, P = `Ui${name}Props`;
  const props = propsOf(m).filter(([k, d]) => !isHandler(k, d));
  const req = props.filter(([, d]) => d.required).map(([k]) => k);
  const opt = props.filter(([, d]) => !d.required).map(([k]) => k);
  const events = eventsOf(m);
  const mv = modelOf(m);
  const hasChildren = !!m.slots?.default;
  const o = [];
  const w = s => o.push(s);
  w(`import { useState } from 'react';`);
  w(`import type { MouseEvent, FocusEvent, KeyboardEvent, ClipboardEvent, SyntheticEvent } from 'react';`);
  w(`import { ${C} } from '${pkg}/react';`);
  w(`import type { ${P} } from '${pkg}/react';`);
  w(`const all = {} as Required<${P}>;`);
  w(`const req = { ${req.map(k => `${k}: all.${k}`).join(', ')} } as ${P};`);
  w(`const nulls: ${P} = { ...req, ${opt.map(k => `${k}: null`).join(', ')} };`);
  w(`const undefs: ${P} = { ...req, ${opt.map(k => `${k}: undefined`).join(', ')} };`);
  w(`void [nulls, undefs];`);
  w(`export function Gen${name}() {`);
  if (mv) {
    const M = `NonNullable<${P}['${mv.name}']>`;
    w(`  const [v2, setV2] = useState<${M} | null>(null);`);
    if (TEXT_MODEL.has(name)) w(`  const [s1, setS1] = useState('');`);
  }
  w('  return (');
  w('    <>');
  w(`      <${C} {...all} />`);
  w(`      <${C} {...req} />`);
  const own = new Set(props.map(([k]) => k));
  w(`      <${C} {...req}${own.has('id') ? '' : ' id="x"'}${own.has('className') ? '' : ' className="c"'}${own.has('style') ? '' : " style={{ color: 'red' }}"} aria-label="a" data-testid="t" />`);
  w(`      <${C} {...nulls} />`);
  w(`      <${C} {...undefs} />`);
  if (hasChildren) w(`      <${C} {...req}>text <b>node</b></${C}>`);
  if (events.length) {
    w(`      <${C} {...req} ${events.map(e => `on${cap(e)}={() => {}}`).join(' ')} />`);
    w(`      <${C} {...req} ${events.map(e => `on${cap(e)}={(...a: unknown[]) => void a}`).join(' ')} />`);
    const nat = events.filter(e => NATIVE[e]);
    const RT = { MouseEvent: 'MouseEvent<HTMLElement>', FocusEvent: 'FocusEvent<HTMLElement>', KeyboardEvent: 'KeyboardEvent<HTMLElement>', ClipboardEvent: 'ClipboardEvent<HTMLElement>', Event: 'SyntheticEvent<HTMLElement>' };
    if (nat.length) w(`      <${C} {...req} ${nat.map(e => `on${cap(e)}={(e: ${RT[NATIVE[e]]}) => e.type}`).join(' ')} />`);
  }
  if (mv) {
    w(`      <${C} {...req} ${mv.name}={v2} onChange={setV2} />`);
    w(`      <${C} {...req} ${mv.name}={v2} onChange={(v) => setV2(v)} />`);
    w(`      <${C} {...req} ${mv.name}={null} />`);
    w(`      <${C} {...req} ${mv.name}={undefined} />`);
    if (TEXT_MODEL.has(name)) w(`      <${C} {...req} ${mv.name}={s1} onChange={setS1} />`);
  }
  w('    </>');
  w('  );');
  w('}');
  return o.join('\n') + '\n';
}

export function genGlobal(names, pkg = '@ziyarago/ui') {
  const o = ['<script setup lang="ts">'];
  o.push(`import type { ${names.map(n => `Ui${n}Props`).join(', ')} } from '${pkg}/vue';`);
  for (const n of names) o.push(`const p${n} = {} as Required<Ui${n}Props>; void p${n};`);
  o.push('</script>', '<template>');
  for (const n of names) o.push(`  <Ui${n} v-bind="p${n}" />`);
  o.push('</template>');
  return o.join('\n') + '\n';
}
