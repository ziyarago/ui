// Vue 3 adapter. Usage: import { UiButton, UiAppShell } from '@ziyarago/ui/vue'
import { h, ref, reactive, defineComponent, onMounted, onBeforeUnmount, Teleport, cloneVNode, isVNode } from 'vue';
import { subscribeUiLocale } from '../i18n/index.js';
import { registerComponents, registerI18n } from '../core/registry.js';
import { BOOL_PROPS } from '../core/bools.js';
import { components } from '../core/all.js';
// <core-index:imports>
import { ButtonDef, IconButtonDef, BadgeDef, AvatarDef, SwitchDef, CheckboxDef, SegmentedControlDef, TabsDef, FilterChipsDef, TextFieldDef, SelectDef, CodeInputDef, CardDef, ModalDef, DrawerDef, ToastDef, BreadcrumbsDef, PaginationDef, ProgressDef, RingDef, KpiTileDef, DataTableDef, TimelineDef, TopNavDef, SideNavDef, AppShellDef, PageHeaderDef, AuthLayoutDef, AlertDef, BannerDef, AccordionDef, SkeletonDef, SpinnerDef, DividerDef, EmptyStateDef, ErrorPageDef, DataStateDef, LoadingOverlayDef, ConfirmDialogDef, PopconfirmDef, CodeDef, DropdownDef, MenuDef, TooltipDef, PopoverDef, CopyButtonDef, CommandPaletteDef, ToggleGroupDef, TextareaDef, NumberInputDef, PasswordInputDef, SearchInputDef, RadioGroupDef, SliderDef, RatingDef, FileUploadDef, ComboboxDef, MultiSelectDef, PhoneInputDef, CalendarDef, DatePickerDef, TimePickerDef, FormFieldDef, LoginFormDef, TagDef, KbdDef, StatsCardDef, MiniChartDef, DescriptionsDef, LazyImageDef, SubNavDef, SplitLayoutDef, SettingsSectionDef, ScrollAreaDef, ChipDef, IconTileDef, StatusIconDef, PillTabsDef, SnackbarDef, SocialAuthDef, AuthSplitDef, StatusPageDef, FooterDef, ContextMenuDef, HeadingDef, TextDef, BoxDef, CenterDef, HStackDef, VStackDef, GridDef, LinkDef, PressableDef, IconDef, PortalDef, BottomSheetDef, PageDashboardDef, PageSettingsDef, PageUserListDef, PagePricingDef, PageAuthDef, PageStatusDef } from '../core/defs.js';
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
const vh = (t, p, ...k) => { const kids = k.flat(); if (p && 'style' in p && p.style === undefined) delete p.style; if (p && typeof t === 'string') for (const key of Object.keys(p)) if (/^on[A-Z]/.test(key) && !key.startsWith('onVnode')) { const nk = 'on' + key[2] + key.slice(3).toLowerCase(); if (nk !== key) { p[nk] = p[key]; delete p[key]; } } return typeof t === 'string' || !kids.length ? h(t, p, kids.length ? kids : undefined) : h(t, p, { default: () => kids }); };
const wrap = (name, def) => { registerI18n(def); const C = cOf(def); return defineComponent({
  name: 'Ui' + name, inheritAttrs: false, emits: ['update:modelValue', 'change'],
  setup(_, { attrs, slots, emit }) {
    const state = reactive({ ...(def.state || {}) });
    const set = o => Object.assign(state, o), uid = 'zg' + (++uidN).toString(36);
    // Teleports are client-only: during SSR and hydration portal() renders nothing (a teleport to <body> cannot hydrate), then appears once mounted.
    const mounted = ref(false), localeTick = ref(0); let offLocale; onMounted(() => { mounted.value = true; offLocale = subscribeUiLocale(() => { localeTick.value++; }); }); onBeforeUnmount(() => offLocale && offLocale());
    return () => {
      void localeTick.value;
      const props = {}, root = {};
      // null means "not set" for every prop except the model (types accept `T | null` for optional props)
      for (const k in attrs) { if (/^(aria|data)-|^(class|style|id)$/.test(k) && !(k === 'style' && attrs[k] == null)) root[k] = attrs[k]; const pk = k.includes('-') && !/^(aria|data)-/.test(k) ? k.replace(/-([a-z])/g, (_, c) => c.toUpperCase()) : k; if (attrs[k] === null && pk !== 'modelValue') continue; props[pk] = attrs[k] === '' && BOOL_PROPS.has(pk) ? true : attrs[k]; }
      // an explicit :on-change handler (kebab-case attribute) is still called after the v-model and @change emitters
      const userChange = typeof props.onChange === 'function' ? props.onChange : null;
      props.onChange = v => { emit('update:modelValue', v); emit('change', v); if (userChange) userChange(v); };
      if (props.modelValue === undefined) delete props.modelValue;
      const named = {}; for (const k of Object.keys(slots)) if (k !== 'default') named[k] = slots[k]();
      const children = slots.default ? slots.default() : [];
      const out = def.render({ C, h: vh, props, children, slots: named, state, set, uid, portal: (kids, to) => mounted.value ? h(Teleport, { to: to || 'body' }, kids) : null });
      const sz = attrs.size;
      if (sz) root['data-size'] = sz;
      return isVNode(out) && typeof out.type === 'string' && Object.keys(root).length ? cloneVNode(out, root) : out;
    };
  },
}); };
/** Wraps definitions like the built-in ones, registers them for C (cross references work both ways) and returns { UiName: Component }. */
export function defineUiComponents(defs, { override = false } = {}) {
  registerComponents(defs, { override });
  legacy = legacy || (k => { const d = components[k]; return d && comp(k, d); });
  const out = {};
  for (const [name, def] of Object.entries(defs)) out['Ui' + name] = byName[name] = comp(name, def);
  return out;
}

/** Wraps ONE definition (its `deps` supply C), registers it like defineUiComponents does (C.Name of other definitions, install() and `components` see it) and returns the component. Add-on packages export one `defineUiComponent('Name', NameDef)` (annotated as pure) per component: the registration only happens for the components an app imports, so a bundler drops the rest. */
export function defineUiComponent(name, def) { registerComponents({ [name]: def }); return byName[name] = comp(name, def); }

// <core-index:exports>
export const UiButton = /*#__PURE__*/ comp('Button', ButtonDef);
export const UiIconButton = /*#__PURE__*/ comp('IconButton', IconButtonDef);
export const UiBadge = /*#__PURE__*/ comp('Badge', BadgeDef);
export const UiAvatar = /*#__PURE__*/ comp('Avatar', AvatarDef);
export const UiSwitch = /*#__PURE__*/ comp('Switch', SwitchDef);
export const UiCheckbox = /*#__PURE__*/ comp('Checkbox', CheckboxDef);
export const UiSegmentedControl = /*#__PURE__*/ comp('SegmentedControl', SegmentedControlDef);
export const UiTabs = /*#__PURE__*/ comp('Tabs', TabsDef);
export const UiFilterChips = /*#__PURE__*/ comp('FilterChips', FilterChipsDef);
export const UiTextField = /*#__PURE__*/ comp('TextField', TextFieldDef);
export const UiSelect = /*#__PURE__*/ comp('Select', SelectDef);
export const UiCodeInput = /*#__PURE__*/ comp('CodeInput', CodeInputDef);
export const UiCard = /*#__PURE__*/ comp('Card', CardDef);
export const UiModal = /*#__PURE__*/ comp('Modal', ModalDef);
export const UiDrawer = /*#__PURE__*/ comp('Drawer', DrawerDef);
export const UiToast = /*#__PURE__*/ comp('Toast', ToastDef);
export const UiBreadcrumbs = /*#__PURE__*/ comp('Breadcrumbs', BreadcrumbsDef);
export const UiPagination = /*#__PURE__*/ comp('Pagination', PaginationDef);
export const UiProgress = /*#__PURE__*/ comp('Progress', ProgressDef);
export const UiRing = /*#__PURE__*/ comp('Ring', RingDef);
export const UiKpiTile = /*#__PURE__*/ comp('KpiTile', KpiTileDef);
export const UiDataTable = /*#__PURE__*/ comp('DataTable', DataTableDef);
export const UiTimeline = /*#__PURE__*/ comp('Timeline', TimelineDef);
export const UiTopNav = /*#__PURE__*/ comp('TopNav', TopNavDef);
export const UiSideNav = /*#__PURE__*/ comp('SideNav', SideNavDef);
export const UiAppShell = /*#__PURE__*/ comp('AppShell', AppShellDef);
export const UiPageHeader = /*#__PURE__*/ comp('PageHeader', PageHeaderDef);
export const UiAuthLayout = /*#__PURE__*/ comp('AuthLayout', AuthLayoutDef);
export const UiAlert = /*#__PURE__*/ comp('Alert', AlertDef);
export const UiBanner = /*#__PURE__*/ comp('Banner', BannerDef);
export const UiAccordion = /*#__PURE__*/ comp('Accordion', AccordionDef);
export const UiSkeleton = /*#__PURE__*/ comp('Skeleton', SkeletonDef);
export const UiSpinner = /*#__PURE__*/ comp('Spinner', SpinnerDef);
export const UiDivider = /*#__PURE__*/ comp('Divider', DividerDef);
export const UiEmptyState = /*#__PURE__*/ comp('EmptyState', EmptyStateDef);
export const UiErrorPage = /*#__PURE__*/ comp('ErrorPage', ErrorPageDef);
export const UiDataState = /*#__PURE__*/ comp('DataState', DataStateDef);
export const UiLoadingOverlay = /*#__PURE__*/ comp('LoadingOverlay', LoadingOverlayDef);
export const UiConfirmDialog = /*#__PURE__*/ comp('ConfirmDialog', ConfirmDialogDef);
export const UiPopconfirm = /*#__PURE__*/ comp('Popconfirm', PopconfirmDef);
export const UiCode = /*#__PURE__*/ comp('Code', CodeDef);
export const UiDropdown = /*#__PURE__*/ comp('Dropdown', DropdownDef);
export const UiMenu = /*#__PURE__*/ comp('Menu', MenuDef);
export const UiTooltip = /*#__PURE__*/ comp('Tooltip', TooltipDef);
export const UiPopover = /*#__PURE__*/ comp('Popover', PopoverDef);
export const UiCopyButton = /*#__PURE__*/ comp('CopyButton', CopyButtonDef);
export const UiCommandPalette = /*#__PURE__*/ comp('CommandPalette', CommandPaletteDef);
export const UiToggleGroup = /*#__PURE__*/ comp('ToggleGroup', ToggleGroupDef);
export const UiTextarea = /*#__PURE__*/ comp('Textarea', TextareaDef);
export const UiNumberInput = /*#__PURE__*/ comp('NumberInput', NumberInputDef);
export const UiPasswordInput = /*#__PURE__*/ comp('PasswordInput', PasswordInputDef);
export const UiSearchInput = /*#__PURE__*/ comp('SearchInput', SearchInputDef);
export const UiRadioGroup = /*#__PURE__*/ comp('RadioGroup', RadioGroupDef);
export const UiSlider = /*#__PURE__*/ comp('Slider', SliderDef);
export const UiRating = /*#__PURE__*/ comp('Rating', RatingDef);
export const UiFileUpload = /*#__PURE__*/ comp('FileUpload', FileUploadDef);
export const UiCombobox = /*#__PURE__*/ comp('Combobox', ComboboxDef);
export const UiMultiSelect = /*#__PURE__*/ comp('MultiSelect', MultiSelectDef);
export const UiPhoneInput = /*#__PURE__*/ comp('PhoneInput', PhoneInputDef);
export const UiCalendar = /*#__PURE__*/ comp('Calendar', CalendarDef);
export const UiDatePicker = /*#__PURE__*/ comp('DatePicker', DatePickerDef);
export const UiTimePicker = /*#__PURE__*/ comp('TimePicker', TimePickerDef);
export const UiFormField = /*#__PURE__*/ comp('FormField', FormFieldDef);
export const UiLoginForm = /*#__PURE__*/ comp('LoginForm', LoginFormDef);
export const UiTag = /*#__PURE__*/ comp('Tag', TagDef);
export const UiKbd = /*#__PURE__*/ comp('Kbd', KbdDef);
export const UiStatsCard = /*#__PURE__*/ comp('StatsCard', StatsCardDef);
export const UiMiniChart = /*#__PURE__*/ comp('MiniChart', MiniChartDef);
export const UiDescriptions = /*#__PURE__*/ comp('Descriptions', DescriptionsDef);
export const UiLazyImage = /*#__PURE__*/ comp('LazyImage', LazyImageDef);
export const UiSubNav = /*#__PURE__*/ comp('SubNav', SubNavDef);
export const UiSplitLayout = /*#__PURE__*/ comp('SplitLayout', SplitLayoutDef);
export const UiSettingsSection = /*#__PURE__*/ comp('SettingsSection', SettingsSectionDef);
export const UiScrollArea = /*#__PURE__*/ comp('ScrollArea', ScrollAreaDef);
export const UiChip = /*#__PURE__*/ comp('Chip', ChipDef);
export const UiIconTile = /*#__PURE__*/ comp('IconTile', IconTileDef);
export const UiStatusIcon = /*#__PURE__*/ comp('StatusIcon', StatusIconDef);
export const UiPillTabs = /*#__PURE__*/ comp('PillTabs', PillTabsDef);
export const UiSnackbar = /*#__PURE__*/ comp('Snackbar', SnackbarDef);
export const UiSocialAuth = /*#__PURE__*/ comp('SocialAuth', SocialAuthDef);
export const UiAuthSplit = /*#__PURE__*/ comp('AuthSplit', AuthSplitDef);
export const UiStatusPage = /*#__PURE__*/ comp('StatusPage', StatusPageDef);
export const UiFooter = /*#__PURE__*/ comp('Footer', FooterDef);
export const UiContextMenu = /*#__PURE__*/ comp('ContextMenu', ContextMenuDef);
export const UiHeading = /*#__PURE__*/ comp('Heading', HeadingDef);
export const UiText = /*#__PURE__*/ comp('Text', TextDef);
export const UiBox = /*#__PURE__*/ comp('Box', BoxDef);
export const UiCenter = /*#__PURE__*/ comp('Center', CenterDef);
export const UiHStack = /*#__PURE__*/ comp('HStack', HStackDef);
export const UiVStack = /*#__PURE__*/ comp('VStack', VStackDef);
export const UiGrid = /*#__PURE__*/ comp('Grid', GridDef);
export const UiLink = /*#__PURE__*/ comp('Link', LinkDef);
export const UiPressable = /*#__PURE__*/ comp('Pressable', PressableDef);
export const UiIcon = /*#__PURE__*/ comp('Icon', IconDef);
export const UiPortal = /*#__PURE__*/ comp('Portal', PortalDef);
export const UiBottomSheet = /*#__PURE__*/ comp('BottomSheet', BottomSheetDef);
export const UiPageDashboard = /*#__PURE__*/ comp('PageDashboard', PageDashboardDef);
export const UiPageSettings = /*#__PURE__*/ comp('PageSettings', PageSettingsDef);
export const UiPageUserList = /*#__PURE__*/ comp('PageUserList', PageUserListDef);
export const UiPagePricing = /*#__PURE__*/ comp('PagePricing', PagePricingDef);
export const UiPageAuth = /*#__PURE__*/ comp('PageAuth', PageAuthDef);
export const UiPageStatus = /*#__PURE__*/ comp('PageStatus', PageStatusDef);
// </core-index:exports>
export const install = app => { for (const [n, d] of Object.entries(components)) app.component('Ui' + n, comp(n, d)); };

export { fmt, setIconBase, registerIcons } from '../core/components.js';
export { rules } from '../core/rules.js';
export { useUiTheme } from '../theme.js';
export default { install };
export { LOCALES, setUiLocale, getUiLocale, setUiMessages, isRtlLocale } from '../i18n/index.js';
