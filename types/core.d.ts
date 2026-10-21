// Core (framework-neutral) entry. Most apps import from '@ziyarago/ui/vue' or '@ziyarago/ui/react' instead.
export { rules, setIconBase, fmt } from './shared';
export type * from './shared';
export interface ComponentDefinition { state?: Record<string, unknown>; slots?: string[]; render: (ctx: any) => unknown }
/** Extension API for add-on packages: adds definitions to the shared registry. Throws on a name clash with a different definition unless { override: true }. */
export function registerComponents(defs: Record<string, ComponentDefinition>, options?: { override?: boolean }): Record<string, ComponentDefinition>;
export const components: Record<string, { state?: Record<string, unknown>; slots?: string[]; render: (ctx: any) => unknown }>;
