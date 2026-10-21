// Shared prop types. Hand-written; the rest of the components are typed as Record<string, any> until their props settle.
export type Tone = 'brand' | 'sky' | 'success' | 'warning' | 'danger' | 'neutral';
export type Size = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
export interface ButtonProps { variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'inverse' | 'tonal' | 'outlined' | 'text' | 'elevated'; tone?: Tone; size?: Size; icon?: string; iconRight?: string; block?: boolean; loading?: boolean; disabled?: boolean; onClick?: (e: MouseEvent) => void }
export interface ChipProps { tone?: Tone; variant?: 'tonal' | 'outlined' | 'solid'; size?: Size; pill?: boolean; icon?: string; onClose?: () => void }
export interface BadgeProps { tone?: 'brand' | 'success' | 'warning' | 'danger' | 'info'; dot?: boolean; size?: Size }
export interface IconTileProps { icon: string; tone?: Tone; size?: number; shape?: 'square' | 'circle' }
export interface CardProps { size?: Size; title?: string; subtitle?: string; variant?: 'default' | 'inverse'; actions?: unknown }
export interface NavItem { value?: string; label?: string; icon?: string; count?: number | string; badge?: number | string; group?: string }
export interface AppShellProps { nav?: 'top' | 'side'; items: NavItem[]; modelValue?: string; collapsible?: boolean; collapsed?: boolean; frame?: boolean; brand?: unknown; actions?: unknown; footer?: unknown; onCollapse?: (v: boolean) => void }
export interface Column<R = any> { key: string; label: string; sortable?: boolean; num?: boolean; render?: (value: any, row: R) => unknown }
export interface DataTableProps<R = any> { columns: Column<R>[]; rows: (R & { id: string | number })[]; selected?: (string | number)[]; sortKey?: string; sortDir?: 'asc' | 'desc'; onSelect?: (ids: (string | number)[]) => void; onSort?: (key: string, dir: 'asc' | 'desc') => void }
export interface TextFieldProps { label?: string; icon?: string; modelValue?: string; placeholder?: string; hint?: string; error?: string; type?: string; variant?: 'filled' | 'underlined' | 'solo'; density?: 'compact'; disabled?: boolean; readonly?: boolean; onChange?: (v: string) => void }
export interface SelectProps { label?: string; options: { value: string | number; label: string }[]; modelValue?: string | number; placeholder?: string; onChange?: (v: any) => void }
export type Rule = (value: any) => true | string;
export const rules: { required(): Rule; email(): Rule; url(): Rule; digits(n: number): Rule; alpha(): Rule; alphaDash(): Rule; minLength(n: number): Rule; maxLength(n: number): Rule; range(a: number, b: number): Rule; regex(re: RegExp, msg?: string): Rule; confirmed(get: () => unknown): Rule; password(): Rule };
export function setIconBase(base: string): void;
export const fmt: { sar(n: number): string; num(n: number): string; dur(seconds: number): string };
