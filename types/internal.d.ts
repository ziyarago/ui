// Semi-internal helpers for add-on packages such as @ziyarago/ui-pro. Not a public API: may change in any minor release.
export const cx: (...a: unknown[]) => string;
export const pick: (props: Record<string, any>, keys: string[]) => Record<string, any>;
export const INPUT_ATTRS: string[];
export const DZ: Record<string, number>;
export const dzp: (props: any, base: number) => number;
export const dzf: (n: number) => string;
export const dzb: (props: any) => string;
export const ddRef: (close: () => void, options?: Record<string, any>) => (el: any) => void;
export const icon: (h: any, name: string, size?: number) => any;
export const fmt: Record<string, (...args: any[]) => string>;
export const trap: (options?: Record<string, any>) => (el: any) => void;
export const life: (options?: Record<string, any>) => (el: any) => void;
export const rove: (selector: string, options?: Record<string, any>) => (e: any) => void;
export const tabIdx: (items: any[], isOn: (item: any) => boolean) => (i: number) => 0 | -1;
export const listKeys: (selector: string, options?: Record<string, any>) => (e: any) => void;
export const openKeys: (isOpen: boolean, open: () => void) => (e: any) => void;
export const focusIn: (el: any) => void;
export const toTrigger: (e: any) => void;
export const trigger: (list: any) => any;
export const rules: typeof import('./shared').rules;
/** Page template helper: page(name, slotIds, layoutTree) returns [name, definition]. */
export function page(name: string, slots: string[], tree: unknown): [string, import('./core').ComponentDefinition];
export function t(component: string, key: string, params?: Record<string, string | number>): string;
export function getUiLocale(): string;
export function intlLocale(): string;
export function defineMessages(component: string, messages: Record<string, Record<string, string>>): void;
export function registerComponents(defs: Record<string, import('./core').ComponentDefinition>, options?: { override?: boolean }): Record<string, import('./core').ComponentDefinition>;
export const components: Record<string, import('./core').ComponentDefinition>;
export const BOOL_PROPS: Set<string>;
/** Quoted CSS url() for background-image values. */
export function cssUrl(url: string): string;
