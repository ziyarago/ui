import { test, describe, before, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import { components } from '../../src/core/index.js';
import { meta } from '../../src/meta/index.js';
import {
  SPECS, CUSTOM, COMPAT_NAMES, COMPAT_COMPONENTS, config, configureCompat, translate, emitsOf, buildHandlers, translateSlots, twWidth, sortRows, mapSize, iconName, camelizeKeys, ICON_RENAMES,
} from '../../src/compat/map.js';
import { ZiyaragoCompatResolver } from '../../src/compat/resolver.js';
import { ziyaragoCompat } from '../../src/compat/vite.js';

beforeEach(() => { config.sizes = 'height'; config.t = null; config.warn = false; config.legacyIcons = true; });

describe('compat spec table', () => {
  test('every spec targets a real new component', () => {
    for (const [name, spec] of Object.entries(SPECS)) {
      const targets = typeof spec.to === 'function' ? ['StatsCard', 'KpiTile'] : [spec.to];
      for (const t of targets) assert.ok(components[t], `${name} -> ${t} does not exist in the new kit`);
    }
  });
  test('string renames and fixed defaults point at documented props of the target', () => {
    for (const [name, spec] of Object.entries(SPECS)) {
      if (typeof spec.to !== 'string') continue;
      const known = new Set([...Object.keys(meta[spec.to].props || {}), 'size', 'modelValue']);
      for (const [from, rule] of Object.entries(spec.props || {})) if (typeof rule === 'string') assert.ok(known.has(rule), `${name}.${from} -> ${spec.to}.${rule} is not a documented prop`);
    }
  });
  test('names are unique, prefixed and sorted', () => {
    assert.equal(new Set(COMPAT_NAMES).size, COMPAT_NAMES.length);
    assert.deepEqual(COMPAT_COMPONENTS, COMPAT_NAMES.map(n => 'Ui' + n));
    assert.deepEqual([...COMPAT_NAMES], [...COMPAT_NAMES].sort());
    for (const n of Object.keys(SPECS)) assert.ok(COMPAT_NAMES.includes(n));
    for (const n of CUSTOM) assert.ok(COMPAT_NAMES.includes(n));
  });
});

describe('translate', () => {
  test('unknown component gives null', () => assert.equal(translate('Nope', {}), null));
  test('kebab-case attrs are camelized, aria and data stay', () => {
    assert.deepEqual(camelizeKeys({ 'icon-only': true, 'aria-label': 'x', 'data-id': 1, onClick: 1, a: undefined }), { iconOnly: true, 'aria-label': 'x', 'data-id': 1, onClick: 1 });
  });
  test('Button: variants, defaults, sizes by height', () => {
    assert.deepEqual(translate('Button', {}).props, { variant: 'primary', size: 'xl' });
    assert.deepEqual(translate('Button', { variant: 'glass', size: 'md' }).props, { variant: 'secondary', size: 'lg' });
    assert.deepEqual(translate('Button', { variant: 'gradient' }).props, { variant: 'tonal', tone: 'brand', size: 'xl' });
    assert.equal(translate('Button', { variant: 'ink' }).props.variant, 'inverse');
    assert.equal(translate('Button', { variant: 'danger', size: 'xl' }).props.size, 'xl');
    assert.equal(translate('Button', { 'icon-only': '' }).props.iconOnly, true);
  });
  test('primary can be rendered as the inverse variant (black CTA)', () => {
    configureCompat({ primary: 'inverse' });
    assert.equal(translate('Button', {}).props.variant, 'inverse');
    assert.equal(translate('Button', { variant: 'ghost' }).props.variant, 'ghost');
    configureCompat({ primary: 'primary' });
    assert.equal(translate('Button', {}).props.variant, 'primary');
  });
  test('sizes by name when configured', () => {
    configureCompat({ sizes: 'name' });
    assert.equal(translate('Button', { size: 'md' }).props.size, 'md');
    assert.equal(translate('Button', {}).props.size, 'lg');
    assert.equal(translate('Badge', { size: 'sm' }).props.size, 'sm');
    assert.equal(mapSize('control', 'sm'), 'sm');
  });
  test('Input -> TextField: error variants, help alias, native attrs pass through', () => {
    const r = translate('Input', { modelValue: 'a', label: 'L', error: true, help: 'h', maxlength: 5, autocomplete: 'email', min: 0 });
    assert.equal(r.component, 'TextField');
    assert.equal(r.props.error, ' ');
    assert.equal(r.props.hint, 'h');
    assert.deepEqual([r.props.maxlength, r.props.autocomplete, r.props.min, r.props.size], [5, 'email', 0, 'xl']);
    assert.equal(translate('Input', { error: 'bad' }).props.error, 'bad');
    assert.equal('error' in translate('Input', { error: false }).props, false);
    assert.deepEqual(translate('Input', { clearable: true }).dropped, ['clearable']);
  });
  test('Select/Combobox: i18n fallbacks come from cfg.t', () => {
    assert.equal(translate('Select', {}).props.placeholder, 'Select an option');
    const cfg = { ...config, t: (k, fb) => `${k}|${fb}` };
    assert.equal(translate('Select', {}, cfg).props.placeholder, 'common.select|Select an option');
    assert.equal(translate('Select', { placeholder: 'P' }, cfg).props.placeholder, 'P');
    assert.equal(translate('Combobox', {}, cfg).props.emptyText, 'common.noMatches|No matches');
  });
  test('Badge: brand and status tones', () => {
    assert.equal(translate('Badge', {}).props.tone, 'brand');
    assert.equal(translate('Badge', { tone: 'cobalt' }).props.tone, 'brand');
    assert.equal(translate('Badge', { tone: 'ink' }).props.tone, 'inverse');
    assert.equal('tone' in translate('Badge', { tone: 'neutral' }).props, false);
    assert.equal(translate('Badge', { tone: 'success', size: 'sm' }).props.size, 'md');
    assert.equal(translate('Badge', { shape: 'square', dot: '' }).props.dot, true);
  });
  test('Alert: tones and close handler only with closable', () => {
    assert.equal(translate('Alert', { tone: 'glass' }).props.tone, 'info');
    const calls = [];
    const emit = (...a) => calls.push(a);
    assert.deepEqual(buildHandlers('Alert', translate('Alert', {}).src, emit), {});
    const h = buildHandlers('Alert', translate('Alert', { closable: '' }).src, emit);
    h.onClose();
    assert.deepEqual(calls, [['close']]);
    assert.equal(translate('Alert', { dismissible: true, closable: true }).dropped.length, 0);
  });
  test('Modal: sizes, extra widths, v-model:open handler', () => {
    assert.deepEqual(translate('Modal', { size: '3xl' }).props, { size: 'xl', width: '768px' });
    assert.deepEqual(translate('Modal', { size: 'sm' }).props, { size: 'sm' });
    assert.deepEqual(translate('Modal', {}).props, { size: 'md' });
    assert.deepEqual(emitsOf('Modal'), ['update:open', 'close']);
    const calls = [], h = buildHandlers('Modal', {}, (...a) => calls.push(a));
    h.onClose({ type: 'click' });
    assert.deepEqual(calls, [['update:open', false], ['close']]);
  });
  test('ConfirmModal -> ConfirmDialog', () => {
    const cfg = { ...config, t: (k, fb) => fb };
    const r = translate('ConfirmModal', { open: true, message: 'M', 'confirm-variant': 'primary', loading: true }, cfg);
    assert.equal(r.component, 'ConfirmDialog');
    assert.deepEqual([r.props.description, r.props.tone, r.props.title, r.props.confirmLabel, r.props.cancelLabel, r.props.size], ['M', 'default', 'Are you sure?', 'Delete', 'Cancel', 'sm']);
    assert.equal(translate('ConfirmModal', {}, cfg).props.tone, 'danger');
  });
  test('Card: variants, padding to size, block tone', () => {
    assert.deepEqual(translate('Card', {}).props, { size: 'lg' });
    assert.deepEqual(translate('Card', { padding: 'xl' }).props, { size: 'xl' });
    assert.deepEqual(translate('Card', { padding: 'none' }).props, { size: 'md', padding: 'none' });
    assert.deepEqual(translate('Card', { variant: 'block', tone: 'sunshine', padding: 'md' }).props, { variant: 'gradient', intensity: 'vivid', tone: 'warning', size: 'lg' });
    assert.equal(translate('Card', { variant: 'outline' }).props.variant, 'outline');
    configureCompat({ sizes: 'name' });
    assert.equal(translate('Card', { padding: 'sm' }).props.size, 'sm');
  });
  test('Progress: max and showValue become value and meta', () => {
    const r = translate('Progress', { value: 30, max: 60, 'show-value': true, tone: 'cobalt' });
    assert.deepEqual(r.props, { value: 50, meta: '50%' });
    assert.equal(translate('Progress', { value: 5, tone: 'danger' }).props.tone, 'danger');
    assert.equal(translate('Progress', { value: 150 }).props.value, 100);
    assert.equal(translate('Progress', { tone: 'sunshine' }).props.tone, 'warning');
  });
  test('Pagination: current/total, event rename, i18n labels', () => {
    const r = translate('Pagination', { current: 2, total: 9, 'hide-arrows': '' }, { ...config, t: (k, fb) => k });
    assert.deepEqual([r.props.page, r.props.pages, r.props.hideArrows, r.props.labels.prev], [2, 9, true, 'common.prevPage']);
    const calls = [];
    buildHandlers('Pagination', {}, (...a) => calls.push(a)).onChange(4);
    assert.deepEqual(calls, [['update:current', 4]]);
  });
  test('StatsCard: glass -> StatsCard, block -> KpiTile, delta object', () => {
    const a = translate('StatsCard', { label: 'L', value: 1, delta: { value: '12%', trend: 'down', sublabel: 'vs' } });
    assert.equal(a.component, 'StatsCard');
    assert.deepEqual([a.props.delta, a.props.trend], ['12%', 'down']);
    const b = translate('StatsCard', { variant: 'block', tone: 'ink', delta: { value: '5%', trend: 'down' } });
    assert.equal(b.component, 'KpiTile');
    assert.deepEqual([b.props.variant, b.props.delta], ['inverse', '-5%']);
  });
  test('SegmentedControl: options -> items', () => {
    const r = translate('SegmentedControl', { options: [{ value: 'a', label: 'A', icon: 'plus' }, { value: 'b', label: 'B' }], size: 'md' });
    assert.deepEqual(r.props.items, [{ value: 'a', label: 'A', icon: 'plus' }, { value: 'b', label: 'B' }]);
    assert.equal(r.props.size, 'lg');
  });
  test('Avatar: tone, shape, initials, alt', () => {
    const r = translate('Avatar', { initials: 'AB', tone: 'petrol', shape: 'squircle', alt: 'Ann', ring: '', status: 'online' });
    assert.deepEqual(r.props, { initials: 'AB', tone: 'sky', shape: 'rounded', name: 'Ann', ring: true, status: 'online', size: 'md' });
    assert.equal(translate('Avatar', { tone: 'pink' }).props.tone, 'danger');
  });
  test('DatePicker keeps the old pixel heights, is clearable by default and forwards min/max/disabledDate', () => {
    const min = new Date(), fn = () => false;
    const r = translate('DatePicker', { min, 'disabled-date': fn, size: 'lg' });
    assert.deepEqual([r.props.size, r.props.clearable, r.props.min, r.props.disabledDate, r.dropped.length], ['xl', true, min, fn, 0]);
    assert.equal(translate('DatePicker', { clearable: false }).props.clearable, false);
  });
  test('empty string stays an empty string for text props (only documented boolean props are coerced)', () => {
    assert.equal(translate('Input', { modelValue: '', placeholder: '' }).props.modelValue, '');
    assert.equal(translate('Input', { required: '' }).props.required, true);
  });
  test('Drawer: placement to side', () => {
    assert.equal(translate('Drawer', { placement: 'left' }).props.side, 'start');
    assert.equal(translate('Drawer', {}).props.side, 'end');
  });
});

describe('slots', () => {
  test('icon slots merge into the default slot, in order', () => {
    const s = translateSlots('Button', { 'icon-left': () => 'L', default: () => ['label'], 'icon-right': () => 'R' }, {});
    assert.deepEqual(s.default(), ['L', 'label', 'R']);
    assert.equal(Object.keys(s).length, 1);
  });
  test('icon slots are skipped while loading', () => {
    const s = translateSlots('Button', { 'icon-left': () => 'L', default: () => ['label'] }, { loading: true });
    assert.deepEqual(s.default(), ['label']);
  });
  test('icon-only buttons with no default slot still render the icon', () => {
    const s = translateSlots('Button', { 'icon-left': () => 'I' }, {});
    assert.deepEqual(s.default(), ['I']);
  });
  test('other slots pass through; EmptyState actions append to default', () => {
    const fn = () => 'x';
    assert.equal(translateSlots('Modal', { subtitle: fn, footer: fn }, {}).subtitle, fn);
    assert.deepEqual(translateSlots('EmptyState', { actions: () => 'A', default: () => ['d'] }, {}).default(), ['d', 'A']);
  });
});

describe('helpers', () => {
  test('twWidth', () => {
    assert.equal(twWidth('w-32'), '8rem');
    assert.equal(twWidth('w-[120px]'), '120px');
    assert.equal(twWidth('w-1/2'), '50%');
    assert.equal(twWidth('w-full'), '100%');
    assert.equal(twWidth('min-w-0 w-44 text-right'), '11rem');
    assert.equal(twWidth('flex-1'), undefined);
    assert.equal(twWidth(undefined), undefined);
  });
  test('sortRows: numbers, strings, nulls first when ascending, desc reverses', () => {
    const rows = [{ v: 3 }, { v: null }, { v: 1 }, { v: 2 }];
    const get = (r, c) => r[c.key];
    assert.deepEqual(sortRows(rows, { key: 'v' }, 'asc', get).map(r => r.v), [null, 1, 2, 3]);
    assert.deepEqual(sortRows(rows, { key: 'v' }, 'desc', get).map(r => r.v), [3, 2, 1, null]);
    assert.deepEqual(sortRows([{ v: 'b' }, { v: 'a' }], { key: 'v' }, 'asc', get).map(r => r.v), ['a', 'b']);
    assert.deepEqual(rows.map(r => r.v), [3, null, 1, 2], 'input is not mutated');
  });
  test('iconName: strings, lucide-vue-next style functions, renames', () => {
    assert.equal(iconName('check'), 'check');
    const fake = name => (props, ctx) => ({ props: { name } });
    assert.equal(iconName(fake('trending-up')), 'trending-up');
    assert.equal(iconName(fake('funnel')), 'filter');
    configureCompat({ legacyIcons: false });
    assert.equal(iconName(fake('funnel')), 'funnel');
    assert.equal(iconName({ name: 'LucideChevronsUpDown' }), 'chevrons-up-down');
    assert.equal(iconName(null), undefined);
    assert.ok(Object.keys(ICON_RENAMES).length >= 9);
  });
  test('emitsOf lists the old events a wrapper must declare', () => {
    assert.deepEqual(emitsOf('Pagination'), ['update:current']);
    assert.deepEqual(emitsOf('Button'), []);
  });
});

describe('resolver and vite plugin', () => {
  test('resolver maps old names to the compat module', () => {
    const r = ZiyaragoCompatResolver();
    assert.deepEqual(r.resolve('UiInput'), { name: 'UiInput', from: '@ziyarago/ui/compat' });
    assert.deepEqual(r.resolve('UiTable'), { name: 'UiTable', from: '@ziyarago/ui/compat' });
    assert.equal(r.resolve('UiDataTable'), undefined);
    assert.equal(r.resolve('Foo'), undefined);
    assert.equal(ZiyaragoCompatResolver({ exclude: ['UiTable'] }).resolve('UiTable'), undefined);
    assert.equal(ZiyaragoCompatResolver({ css: true }).resolve('UiCard').sideEffects, '@ziyarago/ui/style.css');
  });
  test('vite plugin redirects local ui imports, keeps everything else', () => {
    const p = ziyaragoCompat(), imp = '/app/src/pages/X.vue';
    const id = s => p.resolveId(s, imp);
    assert.equal(id('../../../components/ui/Toast'), '\0ziyarago-compat:Toast');
    assert.equal(id('@/components/ui/Table'), '\0ziyarago-compat:Table');
    assert.equal(id('./components/ui/CommandPalette'), '\0ziyarago-compat:CommandPalette');
    assert.equal(id('../components/ui/Select/UiSelect.vue'), '\0ziyarago-compat:UiSelect');
    assert.equal(id('../../../components/ui/SegmentedControl/types'), '\0ziyarago-compat:SegmentedControl');
    assert.equal(id('../../../components/ui/MultilangInput'), null);
    assert.equal(id('../components/PageHeader.vue'), null);
    assert.equal(id('vue'), null);
    assert.equal(p.resolveId('../Select', '/app/src/components/ui/Combobox/UiCombobox.vue'), null);
    const code = p.load('\0ziyarago-compat:Toast');
    assert.match(code, /export \* from '@ziyarago\/ui\/compat'/);
    assert.match(code, /C\['UiToastContainer'\]/);
    assert.match(p.load('\0ziyarago-compat:Input'), /C\['UiInput'\]/);
    assert.equal(p.load('other'), null);
  });
});

describe('compat Vue components (server render)', () => {
  let vue, ssr, C;
  before(async () => {
    vue = await import('vue'); ssr = await import('vue/server-renderer'); C = await import('../../src/compat/index.js');
  });
  const render = async (comp, props, slots) => ssr.renderToString(vue.createSSRApp({ render: () => vue.h(comp, props, slots) }));

  test('every compat name is exported as a component', () => {
    for (const n of COMPAT_COMPONENTS) assert.ok(C[n] && (C[n].setup || C[n].render), `${n} is not exported`);
    for (const n of ['useToast', 'useCommandPalette', 'useTheme', 'install', 'configureCompat', 'MultilangInput']) assert.ok(C[n], n);
    assert.equal(typeof C.default.install, 'function');
  });
  test('UiButton: old props and slots render the new button', async () => {
    const html = await render(C.UiButton, { variant: 'glass', size: 'md', 'icon-only': '', loading: false, 'aria-label': 'x', class: 'extra', type: 'submit' }, { 'icon-left': () => vue.h('i', { class: 'ic' }) });
    assert.match(html, /class="[^"]*zg-btn[^"]*zg-btn--secondary[^"]*zg-btn--sq/);
    assert.match(html, /data-size="lg"/);
    assert.match(html, /type="submit"/);
    assert.match(html, /aria-label="x"/);
    assert.match(html, /\bextra\b/);
    assert.match(html, /<i class="ic">/);
  });
  test('UiInput: label, hint, error, native attrs, prefix slot', async () => {
    const html = await render(C.UiInput, { modelValue: 'v', label: 'Name', required: '', hint: 'h', maxlength: 9, autocomplete: 'name', 'model-value': undefined }, { prefix: () => vue.h('b', 'P') });
    assert.match(html, /zg-label[^>]*>Name<span class="zg-req"/);
    assert.match(html, /maxlength="9"/);
    assert.match(html, /autocomplete="name"/);
    assert.match(html, /required/);
    assert.match(html, /<b>P<\/b>/);
    assert.match(html, /zg-hint[^>]*>h</);
    assert.match(await render(C.UiInput, { error: 'bad' }), /zg-hint--error[^>]*>bad</);
  });
  test('UiBadge/UiAlert/UiCard/UiProgress/UiPagination render with translated props', async () => {
    assert.match(await render(C.UiBadge, { tone: 'ink', size: 'sm', dot: '' }, { default: () => 'x' }), /zg-badge--inverse[\s\S]*zg-badge__dot/);
    assert.match(await render(C.UiAlert, { tone: 'danger', title: 'T' }, { default: () => 'msg' }), /zg-alert--danger[\s\S]*<b>T<\/b>/);
    const card = await render(C.UiCard, { variant: 'block', tone: 'cobalt', padding: 'none' }, { default: () => 'body', footer: () => 'foot' });
    assert.match(card, /zg-card--grad[\s\S]*zg-card--vivid[\s\S]*zg-card--flush/);
    assert.match(card, /zg-card__foot[^>]*>foot/);
    const pr = await render(C.UiProgress, { value: 5, max: 10, 'show-value': '' });
    assert.match(pr, /width:50%/);
    assert.match(pr, /zg-mono">50%</);
    const pg = await render(C.UiPagination, { current: 3, total: 9 });
    assert.match(pg, /aria-current="page"[^>]*>3</);
  });
  test('UiTable: columns, cell slots with row/value/index, empty slot', async () => {
    const cols = [{ key: 'name', label: 'Name', sortable: true }, { key: 'n', label: 'N', align: 'right', width: 'w-32' }];
    const rows = [{ id: 1, name: 'A', n: 1 }, { id: 2, name: 'B', n: 2 }];
    const html = await render(C.UiTable, { rows, columns: cols, 'row-key': r => r.id }, { 'cell-name': ({ row, value, index }) => vue.h('b', `${row.id}:${value}:${index}`) });
    assert.match(html, /<b>1:A:0<\/b>/);
    assert.match(html, /<b>2:B:1<\/b>/);
    assert.match(html, /text-align:right;width:8rem/);
    const empty = await render(C.UiTable, { rows: [], columns: cols }, { empty: () => 'nothing here' });
    assert.match(empty, /nothing here/);
    const loading = await render(C.UiTable, { rows, columns: cols, loading: '', 'skeleton-rows': 2 });
    assert.equal((loading.match(/zg-skelw/g) || []).length, 4);
  });
  test('UiTabs: compound tabs render tab buttons and the active panel only', async () => {
    const html = await render(C.UiTabs, { modelValue: 'b' }, { default: () => [
      vue.h(C.UiTabsList, null, { default: () => [vue.h(C.UiTab, { value: 'a' }, { default: () => 'A' }), vue.h(C.UiTab, { value: 'b' }, { default: () => 'B' })] }),
      vue.h(C.UiTabPanel, { value: 'a' }, { default: () => 'panel-a' }), vue.h(C.UiTabPanel, { value: 'b' }, { default: () => 'panel-b' })] });
    assert.match(html, /aria-selected="true"[^>]*>B</);
    assert.match(html, /panel-b/);
    assert.doesNotMatch(html, /panel-a/);
  });
  test('UiRadioGroup collects UiRadio children into options', async () => {
    const html = await render(C.UiRadioGroup, { modelValue: 2, label: 'Plan', orientation: 'horizontal' }, { default: () => [
      vue.h(C.UiRadio, { value: 1, label: 'One' }), vue.h(C.UiRadio, { value: 2, label: 'Two', hint: 'hh' })] });
    assert.match(html, /role="radiogroup"/);
    assert.match(html, /zg-rg--row/);
    assert.match(html, /aria-checked="true"[\s\S]*Two/);
    assert.match(html, /hh/);
  });
  test('UiMenu items and toast composable', async () => {
    const html = await render(C.UiMenu, null, { default: () => [vue.h(C.UiMenuItem, { tone: 'danger' }, { default: () => 'Del', 'icon-left': () => 'ic' }), vue.h(C.UiMenuSeparator)] });
    assert.match(html, /zg-menu__i--danger/);
    assert.match(html, /zg-menu__sep/);
    const t = C.useToast();
    t.clear();
    const id = t.success('ok', { duration: 0, title: 'T' });
    assert.equal(t.toasts.value.length, 1);
    assert.deepEqual([t.toasts.value[0].tone, t.toasts.value[0].title], ['success', 'T']);
    t.dismiss(id);
    assert.equal(t.toasts.value.length, 0);
  });
  test('useCommandPalette keeps a singleton registry', () => {
    const p = C.useCommandPalette();
    p.clear();
    p.register({ id: 'a', label: 'A', action() {} }); p.register({ id: 'a', label: 'A2', action() {} }); p.register({ id: 'b', label: 'B', action() {} });
    assert.deepEqual(p.commands.value.map(c => c.label), ['A2', 'B']);
    p.unregister('a');
    assert.equal(C.useCommandPalette().commands.value.length, 1);
    p.open(); assert.equal(p.isOpen.value, true); p.toggle(); assert.equal(p.isOpen.value, false);
  });
});

describe('Vue adapter: attribute handling the compat layer relies on', () => {
  let vue, ssr, K;
  before(async () => { vue = await import('vue'); ssr = await import('vue/server-renderer'); K = await import('../../src/vue/index.js'); });
  const render = (comp, props, slots) => ssr.renderToString(vue.createSSRApp({ render: () => vue.h(comp, props, slots) }));

  test('bare boolean attributes (delivered as "") become true for boolean props only', async () => {
    assert.match(await render(K.UiButton, { block: '' }, { default: () => 'x' }), /zg-btn--block/);
    assert.match(await render(K.UiButton, { loading: '' }, { default: () => 'x' }), /zg-spin/);
    const field = await render(K.UiTextField, { modelValue: '', placeholder: '' });
    assert.match(field, /<input[^>]* value(="")?[ >]/);
    assert.doesNotMatch(field, /value="true"/);
  });
  test('kebab-case attributes reach the component as camelCase props', async () => {
    assert.match(await render(K.UiButton, { 'icon-right': 'check' }, { default: () => 'x' }), /data-zg-icon="check"/);
    assert.match(await render(K.UiPagination, { page: 2, pages: 5, 'hide-arrows': '' }), /^(?!.*zg-pager__nav)/);
  });
  test('class, style, id, aria-* and data-* land on the root element', async () => {
    const html = await render(K.UiCard, { class: 'mt-4 w-full', style: 'opacity:.5', id: 'c1', 'aria-label': 'card', 'data-x': '1', title: 'T' }, { default: () => 'x' });
    assert.match(html, /<section[^>]*class="[^"]*zg-card[^"]*mt-4 w-full/);
    assert.match(html, /opacity:\s*\.5/);
    assert.match(html, /id="c1"/);
    assert.match(html, /aria-label="card"/);
    assert.match(html, /data-x="1"/);
  });
  test('new gaps: Button type, TextField native attrs and slots, Textarea, Card slots, Modal subtitle', async () => {
    assert.match(await render(K.UiButton, { type: 'submit', iconOnly: true }, { default: () => 'x' }), /type="submit"[^>]*>|zg-btn--sq/);
    const tf = await render(K.UiTextField, { maxlength: 5, name: 'n', required: true, label: 'L' }, { prefix: () => 'PRE', suffix: () => 'SUF' });
    assert.match(tf, /maxlength="5"/); assert.match(tf, /name="n"/); assert.match(tf, /zg-req/); assert.match(tf, /PRE/); assert.match(tf, /SUF/);
    const ta = await render(K.UiTextarea, { showCount: true, maxlength: 10, modelValue: 'abc', resize: false, readonly: true });
    assert.match(ta, /zg-ta--fixed/); assert.match(ta, />3 \/ 10</); assert.match(ta, /readonly/);
    const card = await render(K.UiCard, { padding: 'none', interactive: true, variant: 'outline' }, { header: () => 'HEAD', footer: () => 'FOOT', default: () => 'x' });
    assert.match(card, /zg-card--outline/); assert.match(card, /zg-card--flush/); assert.match(card, /zg-card--click/); assert.match(card, /HEAD/); assert.match(card, /zg-card__foot[^>]*>FOOT/);
    const modal = await render(K.UiModal, { open: true, title: 'T', subtitle: 'S', closable: false, width: '960px' }, { default: () => 'x' });
    assert.match(modal, /zg-modal__sub[^>]*>S</); assert.match(modal, /max-width:\s*960px/); assert.doesNotMatch(modal, /aria-label="Close"/);
    assert.match(await render(K.UiDataTable, { columns: [{ key: 'a', label: 'A', align: 'right' }], rows: [], onRowClick: () => {} }, { empty: () => 'EMPTY' }), /EMPTY/);
    assert.match(await render(K.UiAvatar, { initials: 'ab', status: 'online', tone: 'sky', shape: 'rounded' }), /AB[\s\S]*zg-avatar__st--online/);
  });
});
