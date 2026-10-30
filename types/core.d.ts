// Core (framework-neutral) entry. Most apps import from '@ziyarago/ui/vue' or '@ziyarago/ui/react' instead.
export { rules, setIconBase, registerIcons, fmt } from './shared.js';
export type * from './shared.js';
export interface ComponentDefinition {
  state?: Record<string, unknown>; slots?: string[]; render: (ctx: any) => unknown;
  /** The components render reads as C.Name, as `() => ({ Name: NameDefinition })`. Optional: without it C falls back to the full built-in registry (which loads every built-in component). */
  deps?: () => Record<string, ComponentDefinition>;
  /** Strings of the component's own namespaces (`{ Name: { en: {...}, ar: {...} } }`); registered when an adapter first wraps the definition. */
  i18n?: Record<string, Record<string, Record<string, string>>>;
}
/** Extension API for add-on packages: adds definitions to the shared registry. Throws on a name clash with a different definition unless { override: true }. */
export function registerComponents(defs: Record<string, ComponentDefinition>, options?: { override?: boolean }): Record<string, ComponentDefinition>;
export const components: Record<string, { state?: Record<string, unknown>; slots?: string[]; render: (ctx: any) => unknown }>;
