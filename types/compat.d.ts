// Types for @ziyarago/ui/compat (hand-written; scripts/types.mjs only generates the vue and react entries).
// Prop interfaces use the OLD glass-ui-kit names so existing templates keep type-checking.
import type { Component, DefineComponent, Ref, ComputedRef, App } from 'vue';

type Any = Record<string, any>;
type OldSize3 = 'md' | 'lg' | 'xl';
type OldTone = 'success' | 'warning' | 'danger' | 'info' | 'neutral';

export interface SelectOption { label: string; value: string | number | null; disabled?: boolean }
export interface TableColumn<TRow = Record<string, unknown>> {
  key: string;
  label: string;
  accessor?: (row: TRow) => unknown;
  sortable?: boolean;
  align?: 'left' | 'center' | 'right';
  /** Tailwind width class such as "w-32" or "w-[120px]"; converted to a CSS width. */
  width?: string;
}
export type TableVariant = 'default' | 'striped' | 'bordered';
export type TableDensity = 'comfortable' | 'compact';
export interface SubNavItem { path: string; label: string; icon?: Component; badge?: number | string }
export interface SegmentedOption<V extends string | number = string | number> { label: string; value: V; icon?: Component; disabled?: boolean }
export interface BreadcrumbItem { label: string; href?: string }
export interface DateRange { start: Date | null; end: Date | null }
export type MultilangLang = 'ru' | 'uz' | 'en';
export interface MultilangValue { ru?: string; uz?: string; en?: string }

export type ToastTone = 'success' | 'info' | 'warning' | 'danger' | 'default';
export interface ToastInput { tone?: ToastTone; title?: string; message: string; duration?: number; action?: { label: string; onClick: () => void } }
export interface Toast { id: string; tone: ToastTone; title?: string; message: string; duration: number; action?: { label: string; onClick: () => void } }
export function useToast(): {
  toasts: Ref<Toast[]>;
  push(input: ToastInput): string;
  dismiss(id: string): void;
  clear(): void;
  success(message: string, options?: Partial<Omit<ToastInput, 'message' | 'tone'>>): string;
  info(message: string, options?: Partial<Omit<ToastInput, 'message' | 'tone'>>): string;
  warning(message: string, options?: Partial<Omit<ToastInput, 'message' | 'tone'>>): string;
  danger(message: string, options?: Partial<Omit<ToastInput, 'message' | 'tone'>>): string;
};

export interface Command {
  id: string;
  label: string;
  description?: string;
  icon?: Component | string;
  shortcut?: string;
  group?: string;
  keywords?: string[];
  action: () => void | Promise<void>;
}
export function useCommandPalette(): {
  commands: Ref<Command[]>;
  isOpen: Ref<boolean>;
  register(command: Command): void;
  unregister(id: string): void;
  clear(): void;
  open(): void;
  close(): void;
  toggle(): void;
};

export type Theme = 'light' | 'dark';
/** Old useTheme(): also toggles the .dark class next to the new data-theme attribute. */
export function useTheme(): { theme: Readonly<Ref<Theme>>; setTheme(value: Theme): void; toggleTheme(): void };

export interface CompatConfig {
  /** 'height' (default) keeps old pixel heights (old md 48px -> new lg); 'name' maps sm/md/lg/xl to the same names. */
  sizes: 'height' | 'name';
  /** Dev warnings for props the new kit cannot honour. */
  warn: boolean;
  /** i18n bridge: (key, fallback) => string. Default: the host vue-i18n ($t) when the key exists, else the fallback. */
  t: ((key: string, fallback: string) => string) | null;
  /** Rename the 9 lucide icons that lucide-static@0.460 knows under an older name. Set false after setIconBase to a newer lucide-static. */
  legacyIcons: boolean;
  /** 'inverse' renders the old primary button (the black pill in qrbon) with the new inverse variant instead of the brand-colored primary. */
  primary: 'primary' | 'inverse';
}
export function configureCompat(options: Partial<CompatConfig>): CompatConfig;
/** Lucide component (lucide-vue-next) or string -> kebab-case icon name of the new kit. */
export function iconName(icon: unknown): string | undefined;
export function translate(name: string, attrs?: Any, cfg?: CompatConfig): { component: string; props: Any; dropped: string[]; src: Any } | null;
export const SPECS: Record<string, Any>;
export const COMPAT_NAMES: string[];
export const COMPAT_COMPONENTS: string[];
export function mapSize(profile: 'control' | 'shift' | 'same', size: string | undefined, cfg?: CompatConfig): string | undefined;
export const compatComponents: Record<string, Component>;

export interface UiButtonProps { variant?: 'primary' | 'glass' | 'ghost' | 'danger' | 'gradient' | 'ink'; size?: OldSize3; iconOnly?: boolean; block?: boolean; loading?: boolean; disabled?: boolean; type?: 'button' | 'submit' | 'reset'; title?: string; onClick?: (e: MouseEvent) => void }
export interface UiInputProps { modelValue?: string | number | null; label?: string; hint?: string; help?: string; error?: string | boolean; size?: 'sm' | OldSize3; type?: string; placeholder?: string; disabled?: boolean; required?: boolean; readonly?: boolean; autocomplete?: string; name?: string; id?: string; min?: number | string; max?: number | string; step?: number | string; maxlength?: number | string; minlength?: number | string; inputmode?: string; pattern?: string; spellcheck?: boolean; autofocus?: boolean }
export interface UiTextareaProps { modelValue?: string | null; label?: string; hint?: string; error?: string | boolean; size?: OldSize3; rows?: number; placeholder?: string; disabled?: boolean; required?: boolean; readonly?: boolean; autoResize?: boolean; resize?: boolean; maxlength?: number; showCount?: boolean; name?: string; id?: string }
export interface UiSelectProps { modelValue?: string | number | null; options: SelectOption[]; label?: string; hint?: string; error?: string | boolean; placeholder?: string; size?: OldSize3; disabled?: boolean; required?: boolean; name?: string; id?: string }
export interface UiComboboxProps { modelValue?: string | number | null; options: SelectOption[]; label?: string; placeholder?: string; hint?: string; error?: string; disabled?: boolean; required?: boolean; size?: OldSize3; clearable?: boolean; filter?: (option: SelectOption, query: string) => boolean; emptyText?: string }
export interface UiCheckboxProps { modelValue?: boolean; indeterminate?: boolean; label?: string; hint?: string; error?: string | boolean; disabled?: boolean; size?: 'sm' | 'md' | 'lg'; name?: string; value?: string | number; id?: string }
export interface UiSwitchProps { modelValue?: boolean; label?: string; hint?: string; error?: string | boolean; disabled?: boolean; size?: 'sm' | 'md' | 'lg'; labelLeft?: boolean; name?: string; id?: string }
export interface UiBadgeProps { tone?: 'sunshine' | 'cobalt' | 'petrol' | 'ink' | 'glass' | OldTone; size?: 'sm' | 'md' | 'lg'; shape?: 'pill' | 'square'; dot?: boolean }
export interface UiAlertProps { tone?: OldTone | 'glass'; title?: string; closable?: boolean; hideIcon?: boolean }
export interface UiCardProps { variant?: 'glass' | 'gradient' | 'solid' | 'outline' | 'block'; tone?: 'cobalt' | 'sunshine' | 'petrol' | 'ink' | 'none'; padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl'; interactive?: boolean; as?: string; onClick?: (e: MouseEvent) => void }
export interface UiModalProps { open: boolean; size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl'; title?: string; closable?: boolean; closeOnBackdrop?: boolean; closeOnEsc?: boolean }
export interface UiConfirmModalProps { open: boolean; title?: string; message?: string; confirmLabel?: string; confirmVariant?: 'danger' | 'primary' | 'glass'; loading?: boolean }
export interface UiTableProps<T = any> { rows: T[]; columns: TableColumn<T>[]; rowKey?: (row: T, index: number) => string | number; density?: TableDensity; variant?: TableVariant; loading?: boolean; skeletonRows?: number; hoverable?: boolean }
export interface UiPaginationProps { current: number; total: number; siblings?: number; hideArrows?: boolean }
export interface UiProgressProps { value?: number; max?: number; size?: 'sm' | 'md' | 'lg'; tone?: 'ink' | 'cobalt' | 'sunshine' | 'petrol' | OldTone; showValue?: boolean; label?: string }
export interface UiAvatarProps { src?: string; alt?: string; initials?: string; size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'; shape?: 'circle' | 'squircle'; tone?: 'cobalt' | 'sunshine' | 'petrol' | 'pink' | 'ink'; ring?: boolean; status?: 'online' | 'offline' | 'away' | 'busy' }
export interface UiTooltipProps { text?: string; placement?: 'top' | 'bottom' | 'left' | 'right'; tone?: 'ink' | 'glass'; delay?: number; disabled?: boolean }
export interface UiBreadcrumbsProps { items: BreadcrumbItem[]; separator?: 'chevron' | 'slash' | 'dot' }
export interface UiStatsCardProps { label: string; value: string | number; delta?: { value: string | number; trend?: 'up' | 'down' | 'flat'; sublabel?: string }; icon?: Component; variant?: 'glass' | 'block'; tone?: 'cobalt' | 'sunshine' | 'petrol' | 'ink' }
export interface UiSegmentedControlProps<V extends string | number = string | number> { modelValue: V; options: SegmentedOption<V>[]; size?: 'sm' | 'md' | 'lg'; block?: boolean; iconOnly?: boolean; ariaLabel?: string }
export interface UiDatePickerProps { modelValue?: Date | DateRange | null; range?: boolean; label?: string; placeholder?: string; hint?: string; error?: string; disabled?: boolean; required?: boolean; size?: OldSize3; clearable?: boolean; locale?: string; weekStartsOn?: 0 | 1 }
export interface UiDateTimePickerProps { modelValue?: string | null; label?: string; hint?: string; error?: string; disabled?: boolean; defaultTime?: string }
export interface UiDropdownProps { open?: boolean; placement?: string; offset?: number; closeOnOutsideClick?: boolean; closeOnEsc?: boolean }
export interface UiSidebarProps { collapsed?: boolean; defaultCollapsed?: boolean; open?: boolean; storageKey?: string }
export interface UiSubNavProps { items: SubNavItem[]; title?: string; titleIcon?: Component; matchExact?: boolean }
export interface UiFileUploadProps { modelValue?: File[] | null; label?: string; hint?: string; error?: string | boolean; multiple?: boolean; accept?: string; maxSize?: number; disabled?: boolean }
export interface UiMultilangInputProps { modelValue: MultilangValue; label?: string; placeholder?: string; required?: boolean; error?: string | boolean; disabled?: boolean }

export const UiButton: DefineComponent<UiButtonProps>;
export const UiInput: DefineComponent<UiInputProps>;
export const UiTextarea: DefineComponent<UiTextareaProps>;
export const UiSelect: DefineComponent<UiSelectProps>;
export const UiCombobox: DefineComponent<UiComboboxProps>;
export const UiCheckbox: DefineComponent<UiCheckboxProps>;
export const UiSwitch: DefineComponent<UiSwitchProps>;
export const UiBadge: DefineComponent<UiBadgeProps>;
export const UiAlert: DefineComponent<UiAlertProps>;
export const UiCard: DefineComponent<UiCardProps>;
export const UiModal: DefineComponent<UiModalProps>;
export const UiConfirmModal: DefineComponent<UiConfirmModalProps>;
export const UiTable: DefineComponent<UiTableProps>;
export const UiPagination: DefineComponent<UiPaginationProps>;
export const UiProgress: DefineComponent<UiProgressProps>;
export const UiAvatar: DefineComponent<UiAvatarProps>;
export const UiTooltip: DefineComponent<UiTooltipProps>;
export const UiBreadcrumbs: DefineComponent<UiBreadcrumbsProps>;
export const UiStatsCard: DefineComponent<UiStatsCardProps>;
export const UiSegmentedControl: DefineComponent<UiSegmentedControlProps>;
export const UiDatePicker: DefineComponent<UiDatePickerProps>;
export const UiDateTimePicker: DefineComponent<UiDateTimePickerProps>;
export const UiDropdown: DefineComponent<UiDropdownProps>;
export const UiSidebar: DefineComponent<UiSidebarProps>;
export const UiSubNav: DefineComponent<UiSubNavProps>;
export const UiFileUpload: DefineComponent<UiFileUploadProps>;
export const UiMultilangInput: DefineComponent<UiMultilangInputProps>;
export const MultilangInput: DefineComponent<UiMultilangInputProps>;
export const UiSkeleton: DefineComponent<{ variant?: 'text' | 'rect' | 'circle' | 'line'; size?: 'sm' | 'md' | 'lg'; lines?: number; lastLineWidth?: string }>;
export const UiAvatarGroup: DefineComponent<{ spacing?: 'tight' | 'normal' | 'loose'; reverse?: boolean }>;
export const UiTabs: DefineComponent<{ modelValue?: string | number | null; variant?: 'pill' | 'underline' }>;
export const UiTabsList: DefineComponent<Any>;
export const UiTab: DefineComponent<{ value: string | number; disabled?: boolean }>;
export const UiTabPanel: DefineComponent<{ value: string | number }>;
export const UiRadioGroup: DefineComponent<{ modelValue?: string | number | boolean | null; label?: string; hint?: string; error?: string | boolean; name?: string; size?: 'sm' | 'md' | 'lg'; disabled?: boolean; orientation?: 'vertical' | 'horizontal' }>;
export const UiRadio: DefineComponent<{ modelValue?: string | number | boolean | null; value: string | number | boolean; label?: string; hint?: string; disabled?: boolean; size?: 'sm' | 'md' | 'lg' }>;
export const UiMenu: DefineComponent<{ minWidth?: string; autofocus?: boolean }>;
export const UiMenuItem: DefineComponent<{ disabled?: boolean; tone?: 'default' | 'danger'; closeOnClick?: boolean }>;
export const UiMenuSeparator: DefineComponent<{ label?: string }>;
export const UiSidebarSection: DefineComponent<{ label?: string }>;
export const UiSidebarItem: DefineComponent<{ label: string; icon?: Component; active?: boolean; badge?: number | string; href?: string; disabled?: boolean }>;
export const UiNavbar: DefineComponent<{ variant?: 'glass' | 'solid' | 'minimal'; size?: 'md' | 'lg'; sticky?: boolean }>;
export const UiToastContainer: DefineComponent<{ position?: 'top-right' | 'top-center' | 'top-left' | 'bottom-right' | 'bottom-center' | 'bottom-left' }>;
export const UiCommandPalette: DefineComponent<{ shortcutKey?: string; disableShortcut?: boolean; emptyText?: string; placeholder?: string }>;
export const UiCalendar: DefineComponent<{ modelValue?: Date | null; locale?: string; weekStartsOn?: 0 | 1 }>;
export const UiForm: DefineComponent<{ novalidate?: boolean }>;
// Names from the published glass-ui-kit that are not part of the local component copies.
export const UiSpinner: DefineComponent<Any>;
export const UiDivider: DefineComponent<Any>;
export const UiBanner: DefineComponent<Any>;
export const UiEmptyState: DefineComponent<Any>;
export const UiDrawer: DefineComponent<Any>;
export const UiTag: DefineComponent<Any>;
export const UiOtpInput: DefineComponent<Any>;
export const UiKpiCard: DefineComponent<Any>;
export const UiFormField: DefineComponent<Any>;

export function install(app: App): void;
declare const _default: { install: typeof install };
export default _default;
