// Core (framework-neutral) entry. Most apps import from '@ziyarago/ui/vue' or '@ziyarago/ui/react' instead.
export { rules, setIconBase, fmt } from './shared';
export type * from './shared';
export const components: Record<string, { state?: Record<string, unknown>; slots?: string[]; render: (ctx: any) => unknown }>;
