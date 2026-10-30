// One-off: turns the object literals of src/core/components*.js into one `export const <Name>Def = ...` per component, adds
// `deps: () => ({ X: XDef })` (what render reads as C.X) and `i18n: { Ns: NsMsg }` (the t('Ns', ...) namespaces the component reaches).
// Edits the working tree in place; run scripts/core-index.mjs afterwards. Deleted again once the output is committed.
import { parse } from 'acorn';
import { readFileSync, writeFileSync, readdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const root = process.cwd(), core = join(root, 'src/core');
const AGG = { 'components.js': 'components', 'components2.js': 'more', 'components3.js': 'more3', 'components4.js': 'more4', 'components6.js': 'more6', 'components7.js': 'more7' };
const files = readdirSync(core).filter(f => f.endsWith('.js'));
const text = {}, ast = {};
for (const f of files) { text[f] = readFileSync(join(core, f), 'utf8'); ast[f] = parse(text[f], { ecmaVersion: 'latest', sourceType: 'module' }); }

const kids = n => { const o = []; for (const k in n) { const v = n[k]; if (v && typeof v.type === 'string') o.push(v); else if (Array.isArray(v)) for (const x of v) if (x && typeof x.type === 'string') o.push(x); } return o; };
const walk = (n, fn, parent = null) => { fn(n, parent); for (const c of kids(n)) walk(c, fn, n); };

// top-level declarations and local imports per file
const decls = {}, imports = {};
for (const f of files) {
  decls[f] = new Map(); imports[f] = new Map();
  for (const st of ast[f].body) {
    const d = st.type === 'ExportNamedDeclaration' && st.declaration ? st.declaration : st;
    if (d.type === 'VariableDeclaration') for (const x of d.declarations) { if (x.id.type === 'Identifier') decls[f].set(x.id.name, x.init || x); }
    else if (d.type === 'FunctionDeclaration' || d.type === 'ClassDeclaration') decls[f].set(d.id.name, d);
    if (st.type === 'ImportDeclaration' && st.source.value.startsWith('./')) for (const s of st.specifiers) if (s.type === 'ImportSpecifier') imports[f].set(s.local.name, { file: st.source.value.slice(2), imported: s.imported.name });
  }
}

// definitions
const defs = {}; // name -> { file, node, prop? }
const order = [];
for (const [f, agg] of Object.entries(AGG)) {
  const st = ast[f].body.find(s => { const d = s.type === 'ExportNamedDeclaration' ? s.declaration : s; return d && d.type === 'VariableDeclaration' && d.declarations[0].id.name === agg; });
  if (!st) throw new Error(`${f}: ${agg} not found`);
  const decl = st.type === 'ExportNamedDeclaration' ? st.declaration : st, obj = decl.declarations[0].init;
  if (obj.type !== 'ObjectExpression') throw new Error(`${f}: ${agg} is not an object literal`);
  const props = obj.properties.map(p => { if (p.type !== 'Property' || p.computed || p.key.type !== 'Identifier') throw new Error(`${f}: unsupported member in ${agg}`); return p; });
  defs[f] = { st, obj, props, agg };
  for (const p of props) { const name = p.key.name; if (name in defs) throw new Error('duplicate ' + name); defs[name] = { file: f, node: p.value }; order.push(name); }
}
for (const f of files) {
  if (AGG[f]) continue;
  for (const st of ast[f].body) {
    if (st.type !== 'ExportNamedDeclaration' || !st.declaration || st.declaration.type !== 'VariableDeclaration') continue;
    const x = st.declaration.declarations[0];
    const m = x.id.type === 'Identifier' && /^(\w+)Def$/.exec(x.id.name);
    if (m) { defs[m[1]] = { file: f, node: x.init, stmt: true }; }
  }
}
const names = new Set(Object.keys(defs).filter(k => defs[k].node));
const defNodes = new Set(Object.values(defs).map(d => d.node).filter(Boolean));

const dynamic = [];
const isName = (n, parent) => parent && ((parent.type === 'MemberExpression' && parent.property === n && !parent.computed) || (parent.type === 'Property' && parent.key === n && !parent.computed && !parent.shorthand));
const nsScan = (file, node, seen, out) => walk(node, (n, parent) => {
  if (n.type === 'CallExpression' && n.callee.type === 'Identifier' && n.callee.name === 't') {
    const a = n.arguments[0];
    if (a && a.type === 'Literal' && typeof a.value === 'string') out.add(a.value); else dynamic.push(`${file}@${n.start}`);
  }
  if (n.type === 'Identifier' && !isName(n, parent)) {
    let f = file, name = n.name;
    const imp = imports[file].get(name);
    if (!decls[file].has(name) && imp) { f = imp.file + '.js'; name = imp.imported; }
    const d = decls[f] && decls[f].get(name);
    if (!d || defNodes.has(d)) return;
    const key = f + ':' + name;
    if (seen.has(key)) return;
    seen.add(key);
    nsScan(f, d, seen, out);
  }
});

const problems = [];
const info = {};
for (const name of names) {
  const d = defs[name];
  const deps = new Set(), ns = new Set();
  walk(d.node, (n, parent) => {
    if (n.type !== 'Identifier') return;
    if (n.name === 'C') {
      if (parent && parent.type === 'MemberExpression' && parent.object === n && !parent.computed && parent.property.type === 'Identifier') deps.add(parent.property.name);
      else if (parent && parent.type === 'Property') { /* destructured param */ }
      else if (!(parent && parent.type === 'MemberExpression' && parent.property === n)) problems.push(`${name}: bare C usage`);
    }
    if (Object.values(AGG).includes(n.name)) problems.push(`${name}: references aggregate ${n.name}`);
  });
  nsScan(d.file, d.node, new Set(), ns);
  const known = [...deps].filter(x => names.has(x)).sort(), unknown = [...deps].filter(x => !names.has(x));
  for (const x of ns) if (!existsSync(join(root, 'src/i18n/components', x + '.js'))) problems.push(`${name}: no i18n file for ${x}`);
  info[name] = { deps: known, unknown, ns: [...ns].sort() };
}
if (dynamic.length) problems.push('dynamic t() namespace: ' + dynamic.join(', '));
if (problems.length) { console.error(problems.join('\n')); process.exit(1); }

const valueText = name => {
  const d = defs[name], v = d.node, src = text[d.file].slice(v.start, v.end), i = info[name];
  if (v.type === 'ObjectExpression') {
    const ex = [];
    if (i.deps.length) ex.push(`deps: () => ({ ${i.deps.map(x => `${x}: ${x}Def`).join(', ')} })`);
    if (i.ns.length) ex.push(`i18n: { ${i.ns.map(x => `${x}: ${x}Msg`).join(', ')} }`);
    if (!ex.length) return src;
    return `${src.slice(0, -1).replace(/[\s,]*$/, '')},\n  ${ex.join(',\n  ')}\n}`;
  }
  if (v.type === 'CallExpression') { if (i.deps.length || i.ns.length) problems.push(name + ': call value with deps/i18n'); return /^\/\*#__PURE__\*\//.test(src) ? src : `/*#__PURE__*/ ${src}`; }
  throw new Error(name + ': unsupported value ' + v.type);
};

const edits = {}, need = {}; // need[file] = { defs: Map(file -> Set), msgs: Set }
const addEdit = (f, e) => (edits[f] ||= []).push(e);
const addNeed = (f, name) => {
  const n = (need[f] ||= { defs: new Map(), msgs: new Set() }), i = info[name];
  for (const x of i.deps) if (defs[x].file !== f) { if (!n.defs.has(defs[x].file)) n.defs.set(defs[x].file, new Set()); n.defs.get(defs[x].file).add(x + 'Def'); }
  for (const x of i.ns) n.msgs.add(x);
};

for (const [f, agg] of Object.entries(AGG)) {
  const { st, obj, props } = defs[f];
  const parts = [];
  props.forEach((p, i) => {
    const before = text[f].slice(i ? props[i - 1].end : obj.start + 1, p.start).replace(/^[\s,]+/, '').trim();
    if (before) parts.push(before);
    parts.push(`export const ${p.key.name}Def = ${valueText(p.key.name)};`);
    addNeed(f, p.key.name);
  });
  const tail = text[f].slice(props.at(-1).end, obj.end - 1).replace(/^[\s,]+/, '').trim();
  if (tail) parts.push(tail);
  addEdit(f, { start: st.start, end: st.end, text: parts.join('\n') });
}
for (const name of names) {
  const d = defs[name];
  if (!d.stmt) continue;
  if (d.node.type === 'ObjectExpression') { addEdit(d.file, { start: d.node.start, end: d.node.end, text: valueText(name) }); addNeed(d.file, name); }
}
if (problems.length) { console.error(problems.join('\n')); process.exit(1); }

for (const f of new Set([...Object.keys(edits), ...Object.keys(need)])) {
  const lastImport = ast[f].body.filter(s => s.type === 'ImportDeclaration').at(-1);
  const n = need[f];
  if (n && (n.defs.size || n.msgs.size)) {
    const lines = [...n.defs].map(([file, set]) => `import { ${[...set].sort().join(', ')} } from './${file}';`);
    for (const m of [...n.msgs].sort()) lines.push(`import ${m}Msg from '../i18n/components/${m}.js';`);
    addEdit(f, { start: lastImport.end, end: lastImport.end, text: '\n' + lines.join('\n') });
  }
  let out = text[f];
  for (const e of edits[f].sort((a, b) => b.start - a.start || b.end - a.end)) out = out.slice(0, e.start) + e.text + out.slice(e.end);
  writeFileSync(join(core, f), out);
}

const graph = {};
for (const name of names) for (const x of info[name].deps) if (defs[x].file !== defs[name].file) (graph[defs[name].file] ||= new Set()).add(defs[x].file);
console.log('components:', names.size, 'with deps:', names.size && [...names].filter(x => info[x].deps.length).length, 'with i18n:', [...names].filter(x => info[x].ns.length).length);
console.log('file graph', Object.fromEntries(Object.entries(graph).map(([k, v]) => [k, [...v]])));
console.log('deps on names that are not free components:', JSON.stringify(Object.fromEntries([...names].filter(x => info[x].unknown.length).map(x => [x, info[x].unknown]))));
console.log('info', JSON.stringify(Object.fromEntries([...names].map(x => [x, [info[x].deps.join('+'), info[x].ns.join('+')]]))));
