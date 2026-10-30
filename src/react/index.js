'use client';
// React 18+ adapter. Usage: import { UiButton, UiAppShell } from '@ziyarago/ui/react'
import React, { useState, useRef, useEffect, useLayoutEffect, useSyncExternalStore, createElement, cloneElement, isValidElement } from 'react';
import { createPortal } from 'react-dom';
import { subscribeUiLocale, getUiVersion } from '../i18n/index.js';
import { registerComponents, registerI18n } from '../core/registry.js';
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
const useIsoLayoutEffect = typeof document === 'undefined' ? useEffect : useLayoutEffect;
const EV = { keydown: 'KeyDown', keyup: 'KeyUp', dragenter: 'DragEnter', dragover: 'DragOver', dragleave: 'DragLeave', pointerdown: 'PointerDown', pointerup: 'PointerUp', pointermove: 'PointerMove', mousedown: 'MouseDown', mouseup: 'MouseUp', mouseenter: 'MouseEnter', mouseleave: 'MouseLeave', mousemove: 'MouseMove', mouseover: 'MouseOver', mouseout: 'MouseOut', dragstart: 'DragStart', dragend: 'DragEnd', dblclick: 'DoubleClick', contextmenu: 'ContextMenu', pointerenter: 'PointerEnter', pointerleave: 'PointerLeave', pointercancel: 'PointerCancel', touchstart: 'TouchStart', touchend: 'TouchEnd', touchmove: 'TouchMove', focusin: 'Focus', focusout: 'Blur' };
const hh = (t, p, ...k) => {
  if (p && typeof t === 'string') { const q = {}; for (const key in p) { const m = /^on([A-Za-z]+)$/.exec(key), n = m && EV[m[1].toLowerCase()]; q[n ? 'on' + n : key] = p[key]; } p = q; }
  if (p && 'class' in p) { const { class: cls, ...rest } = p; p = { ...rest, className: cls }; }
  if (p) { const q = {}; for (const key in p) q[/^(aria|data)-/.test(key) || !key.includes('-') ? key : key.replace(/-(\w)/g, (_, c) => c.toUpperCase())] = p[key]; p = q; }
  if (p && typeof p.innerHTML === 'string') { const { innerHTML, ...rest } = p; p = { ...rest, dangerouslySetInnerHTML: { __html: innerHTML }, suppressContentEditableWarning: true }; }
  return createElement(t, p, ...k.flat());
};
const wrap = (name, def) => {
  registerI18n(def);
  const C = cOf(def);
  const Comp = ({ children, ...props }) => {
    useSyncExternalStore(subscribeUiLocale, getUiVersion, () => 0);
    const [state, setState] = useState({ ...(def.state || {}) });
    const set = o => setState(s => ({ ...s, ...o }));
    // Portals must not render on the server pass or during hydration (React throws a hydration mismatch): the first render returns null
    // and, only if portal() was asked for, a layout effect re-renders once mounted.
    const uidRef = useRef(null); if (!uidRef.current) uidRef.current = 'zg' + (++uidN).toString(36);
    const mounted = useRef(false), wantPortal = useRef(false), [, bump] = useState(0);
    useIsoLayoutEffect(() => { mounted.current = true; if (wantPortal.current) bump(n => n + 1); }, []);
    for (const k in props) if (props[k] === null && k !== 'modelValue') delete props[k];
    const slots = {}; for (const k of [...(def.slots || []), 'actions', 'footer']) if (props[k] !== undefined) slots[k] = props[k];
    if (props.onChange === undefined && props.onValueChange) props.onChange = props.onValueChange;
    const out = def.render({ C, h: hh, props, children: React.Children.toArray(children), slots, state, set, uid: uidRef.current, portal: (kids, to) => { if (!mounted.current) { wantPortal.current = true; return null; } return createPortal(kids, (typeof to === 'string' ? document.querySelector(to) : to) || document.body); } });
    if (!isValidElement(out) || typeof out.type !== 'string') return out;
    const root = {}; for (const k in props) if (/^(aria|data)-|^id$/.test(k)) root[k] = props[k];
    if (props.size) root['data-size'] = props.size;
    if (props.className) root.className = [out.props.className, props.className].filter(Boolean).join(' ');
    if (props.style && typeof props.style === 'object') root.style = { ...out.props.style, ...props.style };
    return Object.keys(root).length ? cloneElement(out, root) : out;
  };
  Comp.displayName = 'Ui' + name;
  return Comp;
};
/** Wraps definitions like the built-in ones, registers them for C (cross references work both ways) and returns { UiName: Component }. */
export function defineUiComponents(defs, { override = false } = {}) {
  registerComponents(defs, { override });
  legacy = legacy || (k => { const d = components[k]; return d && comp(k, d); });
  const out = {};
  for (const [name, def] of Object.entries(defs)) out['Ui' + name] = byName[name] = comp(name, def);
  return out;
}

// Explicit named exports (not destructuring): Next.js reads the export names of a 'use client' module statically.
// <core-index:exports>
// </core-index:exports>
export { fmt, setIconBase, registerIcons } from '../core/components.js';
export { rules } from '../core/rules.js';
export { LOCALES, setUiLocale, getUiLocale, setUiMessages, isRtlLocale } from '../i18n/index.js';
export { useUiTheme } from '../theme.js';
