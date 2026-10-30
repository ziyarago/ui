// The plugin registry. It never imports the component definitions, so an adapter that only uses a few of them bundles only those.
// The merged object of every definition lives in ./all.js (the `components` export of the core entry).
import { defineMessages } from '../i18n/index.js';
import { NAMES } from './names.js';

const core = new Set(NAMES);
/** Definitions added by add-on packages (registerComponents / defineUiComponents). */
export const extras = {};
const hooks = [];
/** all.js keeps its merged `components` object in sync with later registrations. */
export const onRegister = fn => { hooks.push(fn); };

/** Extension API: adds definitions to the shared registry (used by add-on packages such as @ziyarago/ui-pro). Registering the very same definition twice is a no-op (Vue and React adapters can both load one plugin). */
export function registerComponents(defs, { override = false } = {}) {
  if (!override) for (const name of Object.keys(defs)) if (name in extras ? extras[name] !== defs[name] : core.has(name)) throw new Error(`@ziyarago/ui: component "${name}" is already registered (pass { override: true } to replace it)`);
  Object.assign(extras, defs);
  for (const fn of hooks) fn(defs);
  return extras;
}

const done = new WeakSet();
/** A definition carries the strings of its own namespaces as `i18n: { Name: messages }`; they register when an adapter wraps it (once). */
export function registerI18n(def) {
  if (!def.i18n || done.has(def)) return;
  done.add(def);
  for (const ns of Object.keys(def.i18n)) defineMessages(ns, def.i18n[ns]);
}
