// Turns the docs examples into stress data sets: the same components and variants, hostile data.
// modes: long (long labels, unbroken words, 25 items), intl (emoji, Arabic, CJK), big (200 items, huge/zero/negative numbers),
//        empty (every list empty), nulls (optional text props null), size-<xs..xl> (every size prop forced).
const STRING_KEYS = /^(label|title|text|placeholder|description|subtitle|hint|helper\w*|error|message|name|brand|caption|heading|eyebrow|content|body|detail|meta|city|hotel|location|author|role|company|email|trigger\w*|headline|summary|note|badge|tag|unit|suffix|prefix)$/i;
const NUMBER_KEYS = /^(count|price|amount|total|delta|change|trend|percent|sales|revenue|guests|rooms|nights|score)$/i;
const VALUE_NUMBER_COMPONENTS = /Progress|Stat|Meter|Kpi|Gauge|Counter|Metric|Price|Ring|Rating|Funnel|Occupancy|Donut/;
const KEEP_ARRAYS = new Set(['columns', 'series', 'legend', 'axes', 'points', 'path', 'segments', 'labels', 'categories', 'data', 'values', 'steps', 'stops']);
const LONG = ['Extraordinarily long label text that keeps going and going so that it has to wrap or be truncated gracefully', 'Supercalifragilisticexpialidocious_Pneumonoultramicroscopicsilicovolcanoconiosis_' + 'x'.repeat(60), 'Makkah Hilton Suites Jabal Omar Overlooking the Holy Haram, Deluxe Twin Room With Haram View And Breakfast Included'];
const INTL = ['🕋 زيارة مباركة إلى مكة المكرمة والمدينة المنورة 🌙', '巴黎圣母院酒店豪华双人房含早餐 東京ホテル 한국어 텍스트', '👨‍👩‍👧‍👦🏳️‍🌈 Ünïcödé Ñandú ﷺ مرحبا بالعالم', 'עברית משולבת with English و العربية'];
const BIG = [123456789012, 0, -98765.4321, 1e15, 0.000001];

let seq = 0;
const clone = x => JSON.parse(JSON.stringify(x));

function suffixIds(o, i) {
  if (Array.isArray(o)) return o.map(x => suffixIds(x, i));
  if (!o || typeof o !== 'object') return o;
  const r = {};
  for (const [k, v] of Object.entries(o)) {
    if (/^(id|value|key|to|href|name)$/.test(k) && typeof v === 'string' && !/^(\$spy:)/.test(v)) r[k] = v + '-' + i;
    else if (k === 'id' && typeof v === 'number') r[k] = v + 1000 * i;
    else r[k] = suffixIds(v, i);
  }
  return r;
}

function expand(arr, n) {
  if (!arr.length || typeof arr[0] !== 'object' || arr[0] === null) return arr;
  if (arr.some(a => a && a.separator)) return arr;
  const out = [...arr];
  for (let i = arr.length; i < n; i++) out.push(suffixIds(clone(arr[i % arr.length]), i));
  return out;
}

function walk(node, mode, comp, key) {
  if (Array.isArray(node)) {
    if (KEEP_ARRAYS.has(key)) return node.map(x => walk(x, mode, comp, key));
    if (mode === 'empty') return key === 'children' || key === 'slots' ? node : [];
    const next = mode === 'long' ? expand(node, 25) : mode === 'big' ? expand(node, 200) : node;
    return next.map(x => walk(x, mode, comp, key));
  }
  if (node && typeof node === 'object') {
    const r = {};
    for (const [k, v] of Object.entries(node)) r[k] = walk(v, mode, comp, k);
    return r;
  }
  if (typeof node === 'string' && STRING_KEYS.test(key || '')) {
    const n = seq++;
    if (mode === 'long') return LONG[n % LONG.length];
    if (mode === 'intl') return INTL[n % INTL.length];
    if (mode === 'nulls') return null;
  }
  if (typeof node === 'number' && mode === 'big' && (NUMBER_KEYS.test(key || '') || (key === 'value' && VALUE_NUMBER_COMPONENTS.test(comp)))) return BIG[seq++ % BIG.length];
  return node;
}

function variantProps(v, fn) {
  const o = { ...v };
  if (o.props) o.props = fn(o.props);
  if (o.items) o.items = o.items.map(it => variantProps(it, fn));
  if (o.children) o.children = o.children.map(c => (c && c.props ? { ...c, props: fn(c.props), ...(c.text !== undefined ? { text: c.text } : {}) } : c));
  return o;
}

export function stressExamples(examples, mode) {
  seq = 0;
  const m = /^size-(xs|sm|md|lg|xl)$/.exec(mode);
  const out = [];
  for (const e of examples) {
    const sizable = /\(xs, sm, md, lg, xl\)/.test(e.description || '') || JSON.stringify(e.variants).includes('"size"');
    if (m && !sizable) continue;
    const variants = clone(e.variants).map(v => {
      if (m) return variantProps(v, p => ({ ...p, size: m[1] }));
      let nv = variantProps(v, p => walk(p, mode, e.name, ''));
      const textFix = x => {
        if (typeof x.text === 'string' && mode !== 'empty') {
          const n = seq++;
          if (mode === 'long') x.text = LONG[n % LONG.length];
          if (mode === 'intl') x.text = INTL[n % INTL.length];
          if (mode === 'nulls') delete x.text;
        }
        if (x.items) x.items.forEach(textFix);
      };
      textFix(nv);
      return nv;
    });
    out.push({ ...e, variants });
  }
  return out;
}

export const MODES = ['long', 'intl', 'big', 'empty', 'nulls'];
