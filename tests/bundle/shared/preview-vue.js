// Vue port of the docs preview (same mapping as tests/lib/preview-vue.js) against the PACKED package, not src/.
import { defineComponent, h, ref } from 'vue';
import { UI } from './ui-entry.js';
import { revive, record } from './spy.js';
import { params } from './params.js';

let PRO = new Set();
export const setProNames = names => { PRO = new Set(names); };
const kebab = p => { if (!params.kebab) return p; const o = {}; for (const k of Object.keys(p)) o[/^on[A-Z]/.test(k) || k === 'modelValue' || k.startsWith('onUpdate:') ? k : k.replace(/[A-Z]/g, m => '-' + m.toLowerCase())] = p[k]; return o; };

const build = (c, key) => {
  if (!/^[a-z]/.test(c.name) && !UI['Ui' + c.name] && PRO.has(c.name)) return h('div', { key, class: 'doc-pro-stub', 'data-pro': c.name }, c.name + ' (Pro)');
  const comp = /^[a-z]/.test(c.name) ? c.name : UI['Ui' + c.name];
  if (!comp) throw new Error('Unknown component in example tree: ' + c.name);
  const slots = {};
  const kids = [...(c.text ? [c.text] : []), ...(c.children ?? []).map((x, i) => build(x, i))];
  if (kids.length) slots.default = () => kids;
  for (const [k, t] of Object.entries(c.slots ?? {})) slots[k] = () => (typeof t === 'string' ? t : t.map((x, i) => build(x, i)));
  return typeof comp === 'string' ? h(comp, { key, ...(c.props ?? {}) }, kids) : h(comp, { key, ...kebab(c.props ?? {}) }, slots);
};

const substitute = (tree, node) => ({ ...tree, children: tree.children?.map(c => (c.name === '$' ? node : substitute(c, node))) });

export const Preview = defineComponent({
  name: 'Preview',
  props: { name: String, variant: Object, open: Boolean },
  setup(props) {
    const models = ref({});
    const open = ref(props.open);
    const items = () => (props.variant.items?.length ? props.variant.items : [props.variant]);
    return () => {
      const comp = UI['Ui' + props.name];
      if (!comp) throw new Error('No Vue component Ui' + props.name);
      const v = props.variant;
      const els = items().map((it, i) => {
        const p = revive({ ...(it.props ?? {}) });
        if ('modelValue' in p) {
          if (!(i in models.value)) models.value[i] = p.modelValue;
          p.modelValue = models.value[i];
          p['onUpdate:modelValue'] = x => { models.value[i] = x; };
        }
        for (const [prop, pre] of [['value', 'v'], ['index', 'i'], ['page', 'p']]) {
          if (prop in p) {
            const k = pre + i;
            if (!(k in models.value)) models.value[k] = p[prop];
            p[prop] = models.value[k];
            p.onChange = x => { models.value[k] = x; };
          }
        }
        if (props.name === 'PipelineBoard' && Array.isArray(p.stages)) {
          const k = 's' + i;
          if (!(k in models.value)) models.value[k] = p.stages;
          p.stages = models.value[k];
          p.onMove = ({ id, from, to }) => {
            const next = models.value[k].map(s => ({ ...s, cards: [...(s.cards ?? [])] }));
            const src = next.find(s => s.id === from), dst = next.find(s => s.id === to);
            const at = src ? src.cards.findIndex((c, n) => (c.id ?? n) === id) : -1;
            if (src && dst && at >= 0) dst.cards.push(src.cards.splice(at, 1)[0]);
            models.value[k] = next;
          };
        }
        if (v.overlay) { p.open = open.value; p.onClose = () => (open.value = false); if (props.name === 'ConfirmDialog') p.onCancel = p.onClose; }
        const slots = {};
        const kids = [...(it.text ? [it.text] : []), ...(it.children ?? []).map((x, k) => build(x, k))];
        if (kids.length) slots.default = () => kids;
        for (const [k, t] of Object.entries(it.slots ?? {})) slots[k] = () => (typeof t === 'string' ? t : t.map((x, k2) => build(x, k2)));
        if (v.inside) return build(substitute(v.inside, { name: props.name, props: p, text: it.text, slots: it.slots, children: it.children }), i);
        return h(comp, { key: i, ...kebab(p) }, slots);
      });
      const body = v.overlay ? [h(UI.UiButton, { variant: 'primary', onClick: () => (open.value = true) }, () => 'Open'), ...els] : els;
      return h('div', { class: v.width ? 'doc-preview doc-preview--col' : 'doc-preview', style: v.width ? { width: '100%', maxWidth: v.width, flexDirection: 'column', alignItems: 'stretch' } : undefined }, body);
    };
  },
});
export { UI };
