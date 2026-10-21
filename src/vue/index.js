// Vue 3 adapter. Usage: import { UiButton, UiAppShell } from '@ziyarago/ui/vue'
import { h, ref, reactive, defineComponent, onMounted, onBeforeUnmount, Teleport, cloneVNode, isVNode } from 'vue';
import { components, registerComponents, subscribeUiLocale } from '../core/index.js';
import { BOOL_PROPS } from '../core/bools.js';

const C = {};
const vh = (t, p, ...k) => { const kids = k.flat(); if (p && typeof t === 'string') for (const key of Object.keys(p)) if (/^on[A-Z]/.test(key) && !key.startsWith('onVnode')) { const nk = 'on' + key[2] + key.slice(3).toLowerCase(); if (nk !== key) { p[nk] = p[key]; delete p[key]; } } return typeof t === 'string' || !kids.length ? h(t, p, kids.length ? kids : undefined) : h(t, p, { default: () => kids }); };
const wrap = (name, def) => defineComponent({
  name: 'Ui' + name, inheritAttrs: false, emits: ['update:modelValue', 'change'],
  setup(_, { attrs, slots, emit }) {
    const state = reactive({ ...(def.state || {}) });
    const set = o => Object.assign(state, o);
    // Teleports are client-only: during SSR and hydration portal() renders nothing (a teleport to <body> cannot hydrate), then appears once mounted.
    const mounted = ref(false), localeTick = ref(0); let offLocale; onMounted(() => { mounted.value = true; offLocale = subscribeUiLocale(() => { localeTick.value++; }); }); onBeforeUnmount(() => offLocale && offLocale());
    return () => {
      void localeTick.value;
      const props = {}, root = {};
      for (const k in attrs) { if (/^(aria|data)-|^(class|style|id)$/.test(k)) root[k] = attrs[k]; const pk = k.includes('-') && !/^(aria|data)-/.test(k) ? k.replace(/-([a-z])/g, (_, c) => c.toUpperCase()) : k; props[pk] = attrs[k] === '' && BOOL_PROPS.has(pk) ? true : attrs[k]; }
      props.onChange = v => { emit('update:modelValue', v); emit('change', v); };
      if (attrs.modelValue === undefined) delete props.modelValue;
      const named = {}; for (const k of Object.keys(slots)) if (k !== 'default') named[k] = slots[k]();
      const children = slots.default ? slots.default() : [];
      const out = def.render({ C, h: vh, props, children, slots: named, state, set, portal: (kids, to) => mounted.value ? h(Teleport, { to: to || 'body' }, kids) : null });
      const sz = attrs.size;
      if (sz) root['data-size'] = sz;
      return isVNode(out) && typeof out.type === 'string' && Object.keys(root).length ? cloneVNode(out, root) : out;
    };
  },
});
for (const [name, def] of Object.entries(components)) C[name] = wrap(name, def);
/** Wraps definitions like the built-in ones, registers them in C (cross references work both ways) and returns { UiName: Component }. */
export function defineUiComponents(defs, { override = false } = {}) {
  registerComponents(defs, { override });
  const out = {};
  for (const [name, def] of Object.entries(defs)) out['Ui' + name] = C[name] = wrap(name, def);
  return out;
}

export const { Button: UiButton, IconButton: UiIconButton, Badge: UiBadge, Avatar: UiAvatar, Switch: UiSwitch, Checkbox: UiCheckbox, SegmentedControl: UiSegmentedControl, Tabs: UiTabs, FilterChips: UiFilterChips, TextField: UiTextField, Select: UiSelect, CodeInput: UiCodeInput, Card: UiCard, Modal: UiModal, Drawer: UiDrawer, Toast: UiToast, Breadcrumbs: UiBreadcrumbs, Pagination: UiPagination, Progress: UiProgress, Ring: UiRing, KpiTile: UiKpiTile, DataTable: UiDataTable, Timeline: UiTimeline, TopNav: UiTopNav, SideNav: UiSideNav, AppShell: UiAppShell, PageHeader: UiPageHeader, AuthLayout: UiAuthLayout, Alert: UiAlert, Banner: UiBanner, Accordion: UiAccordion, Skeleton: UiSkeleton, Spinner: UiSpinner, Divider: UiDivider, EmptyState: UiEmptyState, ErrorPage: UiErrorPage, DataState: UiDataState, LoadingOverlay: UiLoadingOverlay, ConfirmDialog: UiConfirmDialog, Popconfirm: UiPopconfirm, Code: UiCode, Dropdown: UiDropdown, Menu: UiMenu, Tooltip: UiTooltip, Popover: UiPopover, CopyButton: UiCopyButton, CommandPalette: UiCommandPalette, ToggleGroup: UiToggleGroup, Textarea: UiTextarea, NumberInput: UiNumberInput, PasswordInput: UiPasswordInput, SearchInput: UiSearchInput, RadioGroup: UiRadioGroup, Slider: UiSlider, Rating: UiRating, FileUpload: UiFileUpload, Combobox: UiCombobox, MultiSelect: UiMultiSelect, PhoneInput: UiPhoneInput, Calendar: UiCalendar, DatePicker: UiDatePicker, TimePicker: UiTimePicker, FormField: UiFormField, LoginForm: UiLoginForm, Tag: UiTag, Kbd: UiKbd, StatsCard: UiStatsCard, MiniChart: UiMiniChart, Descriptions: UiDescriptions, LazyImage: UiLazyImage, SubNav: UiSubNav, SplitLayout: UiSplitLayout, SettingsSection: UiSettingsSection, ScrollArea: UiScrollArea, Chip: UiChip, IconTile: UiIconTile, StatusIcon: UiStatusIcon, PillTabs: UiPillTabs, Snackbar: UiSnackbar, AuthSplit: UiAuthSplit, SocialAuth: UiSocialAuth, StatusPage: UiStatusPage, Footer: UiFooter, PageDashboard: UiPageDashboard, PageSettings: UiPageSettings, PageUserList: UiPageUserList, PagePricing: UiPagePricing, PageAuth: UiPageAuth, PageStatus: UiPageStatus, ContextMenu: UiContextMenu, Heading: UiHeading, Text: UiText, Box: UiBox, Center: UiCenter, HStack: UiHStack, VStack: UiVStack, Grid: UiGrid, Link: UiLink, Pressable: UiPressable, Icon: UiIcon, Portal: UiPortal, BottomSheet: UiBottomSheet } = C;
export const install = app => { for (const [n, c] of Object.entries(C)) app.component('Ui' + n, c); };
export { fmt, setIconBase, rules } from '../core/index.js';
export { useUiTheme } from '../theme.js';
export default { install };
export { LOCALES, setUiLocale, getUiLocale, setUiMessages, isRtlLocale } from '../core/index.js';
