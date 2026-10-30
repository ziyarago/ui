// Vue 3 adapter. Usage: import { UiButton, UiAppShell } from '@ziyarago/ui/vue'
import { h, ref, reactive, defineComponent, onMounted, onBeforeUnmount, Teleport, cloneVNode, isVNode } from 'vue';
import { subscribeUiLocale } from '../i18n/index.js';
import { registerComponents, registerI18n } from '../core/registry.js';
import { BOOL_PROPS } from '../core/bools.js';
import { components } from '../core/all.js';
// <core-index:imports>
// </core-index:imports>

// One wrapped component per definition. Nothing here walks the full list of components: a definition resolves C.Name from its own `deps`,
// so a bundler only keeps the components (and strings) an app actually imports.
const comps = new Map(), byName = {}, cOf_ = new WeakMap();
let legacy = null, uidN = 0;
const comp = (name, def) => { let c = comps.get(def); if (!c) { c = wrap(name, def); comps.set(def, c); } return c; };
// C for a definition: components registered through defineUiComponents first, then its own deps. A definition without `deps` (a plugin built
// against the old global registry) falls back to every built-in component, which is only loaded once defineUiComponents is used.
const cOf = def => {
  let c = cOf_.get(def);
  if (!c) { const d = def.deps ? def.deps() : null; c = new Proxy({}, { get: (_, k) => typeof k !== 'string' ? undefined : byName[k] || (d ? (k in d ? comp(k, d[k]) : undefined) : legacy && legacy(k)) }); cOf_.set(def, c); }
  return c;
};
const vh = (t, p, ...k) => { const kids = k.flat(); if (p && 'style' in p && p.style === undefined) delete p.style; if (p && typeof t === 'string') for (const key of Object.keys(p)) if (/^on[A-Z]/.test(key) && !key.startsWith('onVnode')) { const nk = 'on' + key[2] + key.slice(3).toLowerCase(); if (nk !== key) { p[nk] = p[key]; delete p[key]; } } return typeof t === 'string' || !kids.length ? h(t, p, kids.length ? kids : undefined) : h(t, p, { default: () => kids }); };
const wrap = (name, def) => { registerI18n(def); const C = cOf(def); return defineComponent({
  name: 'Ui' + name, inheritAttrs: false, emits: ['update:modelValue', 'change'],
  setup(_, { attrs, slots, emit }) {
    const state = reactive({ ...(def.state || {}) });
    const set = o => Object.assign(state, o), uid = 'zg' + (++uidN).toString(36);
    // Teleports are client-only: during SSR and hydration portal() renders nothing (a teleport to <body> cannot hydrate), then appears once mounted.
    const mounted = ref(false), localeTick = ref(0); let offLocale; onMounted(() => { mounted.value = true; offLocale = subscribeUiLocale(() => { localeTick.value++; }); }); onBeforeUnmount(() => offLocale && offLocale());
    return () => {
      void localeTick.value;
      const props = {}, root = {};
      // null means "not set" for every prop except the model (types accept `T | null` for optional props)
      for (const k in attrs) { if (/^(aria|data)-|^(class|style|id)$/.test(k) && !(k === 'style' && attrs[k] == null)) root[k] = attrs[k]; const pk = k.includes('-') && !/^(aria|data)-/.test(k) ? k.replace(/-([a-z])/g, (_, c) => c.toUpperCase()) : k; if (attrs[k] === null && pk !== 'modelValue') continue; props[pk] = attrs[k] === '' && BOOL_PROPS.has(pk) ? true : attrs[k]; }
      // an explicit :on-change handler (kebab-case attribute) is still called after the v-model and @change emitters
      const userChange = typeof props.onChange === 'function' ? props.onChange : null;
      props.onChange = v => { emit('update:modelValue', v); emit('change', v); if (userChange) userChange(v); };
      if (props.modelValue === undefined) delete props.modelValue;
      const named = {}; for (const k of Object.keys(slots)) if (k !== 'default') named[k] = slots[k]();
      const children = slots.default ? slots.default() : [];
      const out = def.render({ C, h: vh, props, children, slots: named, state, set, uid, portal: (kids, to) => mounted.value ? h(Teleport, { to: to || 'body' }, kids) : null });
      const sz = attrs.size;
      if (sz) root['data-size'] = sz;
      return isVNode(out) && typeof out.type === 'string' && Object.keys(root).length ? cloneVNode(out, root) : out;
    };
  },
}); };
/** Wraps definitions like the built-in ones, registers them for C (cross references work both ways) and returns { UiName: Component }. */
export function defineUiComponents(defs, { override = false } = {}) {
  registerComponents(defs, { override });
  legacy = legacy || (k => { const d = components[k]; return d && comp(k, d); });
  const out = {};
  for (const [name, def] of Object.entries(defs)) out['Ui' + name] = byName[name] = comp(name, def);
  return out;
}

// <core-index:exports>
// </core-index:exports>
export const install = app => { for (const [n, d] of Object.entries(components)) app.component('Ui' + n, comp(n, d)); };

export { fmt, setIconBase, registerIcons } from '../core/components.js';
export { rules } from '../core/rules.js';
export { useUiTheme } from '../theme.js';
export default { install };
export { LOCALES, setUiLocale, getUiLocale, setUiMessages, isRtlLocale } from '../i18n/index.js';
