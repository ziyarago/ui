<script setup lang="ts">
useSeo({ title: 'Migration 0.20 to 0.22 — @ziyarago/ui', description: 'Upgrade guide from @ziyarago/ui 0.20 to 0.22 (English and Russian): tree-shaking, registration of imported components only, Pro package versions, CSP classes, fonts, a checklist and common errors.' })

type Lang = 'en' | 'ru'
const lang = ref<Lang>('en')

type Change = { v: string; title: string; body: string }
type Err = { symptom: string; cause: string; fix: string }
type Copy = { h1: string; lead: string; hChanges: string; changes: Change[]; hCheck: string; check: string[]; hErr: string; errs: Err[]; symptom: string; cause: string; fix: string; see: string }

const COPY: Record<Lang, Copy> = {
  en: {
    h1: 'Migration 0.20 to 0.22',
    lead: 'What changes for an application when it moves from @ziyarago/ui 0.20.x to 0.22.1 (and @ziyarago/ui-pro to the same version). The public API of the components did not change: no prop was renamed. The changes are in how modules are bundled and registered, what the server HTML contains and a few behaviours. Exact wording of every release is in the Changelog.',
    hChanges: 'What changed',
    changes: [
      { v: '0.21.0', title: 'Tree-shaking', body: 'Every component is a separate definition with its own dependencies and strings; the Vue and React adapters wrap a component only when it is imported. A Vue app with only UiButton dropped from 32 KB to 4.7 KB gzip. Named imports (import { UiButton } from "@ziyarago/ui/vue") get the full benefit. app.use(ui) still registers every core component and so keeps all of them in the bundle.' },
      { v: '0.21.0', title: 'sideEffects', body: 'package.json now lists as side-effectful only the CSS files, src/i18n/index.js and src/i18n/components/index.js. Everything else can be dropped by the bundler when unused. Do not override sideEffects for @ziyarago/ui in your bundler config, and do not deep-import files from src/ for their side effects.' },
      { v: '0.22.0', title: 'Add-on packages are tree-shakeable', body: 'New defineUiComponent(name, def) in the Vue and React adapters wraps ONE definition and registers it; defineUiComponents(defs) still works. @ziyarago/ui/internal exports every built-in <Name>Def (and pageDefinition), so a package declares deps: () => ({ Button: ButtonDef }). @ziyarago/ui/internal is semi-internal and can change in a minor release.' },
      { v: '0.22.0', title: 'Pro registers only what you import', body: 'In @ziyarago/ui-pro 0.22 each export is /*#__PURE__*/ defineUiComponent(...). Importing the package registers nothing by itself. app.use(ui) sees the core components plus only the Pro components that are imported in the bundle. A Pro tag that was never imported is not registered. The Nuxt module and the Vite resolver generate the import per tag, so they are not affected.' },
      { v: '0.22.0', title: 'Pro tarball and peer range', body: 'The Pro tarball has the same version as the core and its peer range for @ziyarago/ui starts at the exact core version it was built against and ends before the next minor (for 0.22.1: >=0.22.1 <0.23.0). Update both packages together. Pro sideEffects shrank to the CSS files and languages/index.js.' },
      { v: '0.20.9, 0.20.12, 0.20.13', title: 'CSP: classes instead of inline style', body: 'Server HTML of core and Pro components carries classes and data-zg-p attributes instead of style="...". The rules live in csp.css and csp-pro.css, which are part of @ziyarago/ui/style.css, so the stylesheet must be loaded. Percentages are rounded in data-zg-p for the server HTML and set exactly after mount. Values outside the finite sets (for example gap="1.5rem") and a style prop you pass yourself are still inline. See the CSP checklist in Integration.' },
      { v: '0.20.8', title: 'Thmanyah is no longer shipped', body: 'The font files were removed from the package for licence reasons. In RTL the Arabic stack falls back to a system font until you self-host Thmanyah; @ziyarago/ui/thmanyah.css gives ready @font-face rules for /fonts/thmanyah/. See Fonts.' },
      { v: '0.20.7', title: 'No-argument callbacks', body: 'Documented callbacks without arguments (Modal, Drawer, Alert, Snackbar, Chip, Tag, ConfirmDialog and more) are called without the DOM event. If your handler read the first argument, it is undefined now.' },
      { v: '0.20.4', title: 'Icons and fonts under strict CSP', body: 'About 100 icons the components use are built in and need no request. Other icon names are still fetched from unpkg: self-host with setIconBase or register with registerIcons. Small font subsets are emitted as files, not data: URIs.' },
      { v: '0.20.0', title: 'Popups in document.body', body: 'Select, Combobox, MultiSelect, DatePicker, Dropdown, Menu, ContextMenu, Popover, Popconfirm and Pro GroupedSelect, TreeSelect, NotificationBell render in document.body with position: fixed. In tests query the list by role=listbox or aria-controls, not inside the component root.' },
      { v: '0.22.1', title: 'Style fixes', body: 'Visual fixes for chat height, ImageUpload text, Kanban badges and AuthShowcase contrast. Pro 0.22.1 also fixes the visible name of TreeSelect and GroupedSelect when the selected label is null.' },
    ],
    hCheck: 'Checklist',
    check: [
      'Update @ziyarago/ui to 0.22.1 and, if you use Pro, install the Pro tarball of the same version. Do not mix minors.',
      'Replace import ui from "@ziyarago/ui/vue" + app.use(ui) with named imports where bundle size matters, or keep it and accept the full core.',
      'Make sure every Pro component you use in a template is imported (named import, Nuxt module plugins: ["@ziyarago/ui-pro"], or ZiyaragoUiResolver({ plugins: ["@ziyarago/ui-pro"] })).',
      'Keep import "@ziyarago/ui/style.css" in the entry file; the CSP classes of core and Pro components come from it. Import @ziyarago/ui-pro/style.css after it if you did before.',
      'If you have a bundler rule or package.json that overrides sideEffects for @ziyarago/ui or @ziyarago/ui-pro, remove it.',
      'Search your code for handlers of Modal, Drawer, Alert, Snackbar, Chip, Tag and ConfirmDialog that read an event argument.',
      'RTL apps: self-host Thmanyah and import @ziyarago/ui/thmanyah.css, or accept the system Arabic font.',
      'Strict CSP: re-run the app under your policy, check the server HTML for style attributes, and self-host icons (setIconBase) or register them.',
      'Tests that look for popup content inside the component root must query the document (role=listbox, aria-controls).',
      'Pro languages: import "@ziyarago/ui-pro/languages" once before mount if you use uz, tg, tr, fr, fa, hi, ur, bn, id, kk, ky, ms or ha.',
      'Build the production bundle and compare its size with the previous one.',
    ],
    hErr: 'Common errors',
    symptom: 'Symptom', cause: 'Cause', fix: 'Fix',
    errs: [
      { symptom: 'Vue warns "Failed to resolve component: UiLineChart" (any Pro tag) with app.use(ui)', cause: 'The Pro component is not imported anywhere, so it is not registered.', fix: 'Import it (import { UiLineChart } from "@ziyarago/ui-pro/vue"), or use the Nuxt module / Vite resolver with plugins: ["@ziyarago/ui-pro"].' },
      { symptom: 'Error: @ziyarago/ui: component "X" is already registered (pass { override: true } to replace it)', cause: 'A definition with this name is already in the registry: a built-in one, or a different definition registered earlier.', fix: 'Rename your component, or pass { override: true } to defineUiComponents when replacing it on purpose. Registering the very same definition twice is fine.' },
      { symptom: 'Import error about defineUiComponent (or @ziyarago/ui/internal) when Pro loads', cause: 'Pro 0.22 runs against a core older than 0.22.0.', fix: 'Update @ziyarago/ui to the same version as the Pro tarball.' },
      { symptom: 'npm reports a peer dependency conflict for @ziyarago/ui when installing the Pro tarball', cause: 'The peer range covers one minor: from the version the tarball was built against up to the next minor.', fix: 'Install the core and Pro of the same 0.x line, for example 0.22.1 and 0.22.1.' },
      { symptom: 'The bundle is still large', cause: 'app.use(ui) or a default import pulls the whole core; the 13-language pack is a side-effect import.', fix: 'Import components by name; import @ziyarago/ui-pro/languages only if you need those languages.' },
      { symptom: 'Nuxt warns "plugin @ziyarago/ui-pro: cannot load @ziyarago/ui-pro/names"', cause: 'Pro is not installed in the project that runs Nuxt (for example in CI without access to the package).', fix: 'Install the tarball in that environment, or remove the plugin from ziyarago.plugins there.' },
      { symptom: 'CSP violation or an unstyled block in server HTML', cause: 'The stylesheet is not loaded, or the value is outside the finite sets and rendered as a style attribute.', fix: 'Load @ziyarago/ui/style.css; use values from the sets (sizes xs..xl, gap 0..48, columns 1..12) or add style-src-attr \'unsafe-inline\'.' },
      { symptom: 'Arabic text looks different from before', cause: 'The Thmanyah files are not shipped any more.', fix: 'Self-host the font and import @ziyarago/ui/thmanyah.css, see Fonts.' },
      { symptom: 'A handler gets undefined instead of an event', cause: 'Callbacks documented without arguments are called without the DOM event since 0.20.7.', fix: 'Do not read the argument; use your own @click on a wrapper if you need the event.' },
      { symptom: 'A test cannot find the options of a Select or the items of a Menu', cause: 'Popups render in document.body.', fix: 'Query the document by role=listbox or aria-controls.' },
    ],
    see: 'See also',
  },
  ru: {
    h1: 'Миграция 0.20 → 0.22',
    lead: 'Что меняется для приложения при переходе с @ziyarago/ui 0.20.x на 0.22.1 (и @ziyarago/ui-pro на ту же версию). Публичный API компонентов не менялся: ни одно свойство не переименовано. Изменились сборка и регистрация модулей, содержимое серверного HTML и несколько поведений. Точные формулировки каждого релиза есть в Changelog.',
    hChanges: 'Что изменилось',
    changes: [
      { v: '0.21.0', title: 'Tree-shaking', body: 'Каждый компонент теперь отдельное определение со своими зависимостями и строками; адаптеры Vue и React оборачивают компонент только когда его импортируют. Vue-приложение с одним UiButton уменьшилось с 32 КБ до 4,7 КБ gzip. Полный эффект даёт именованный импорт (import { UiButton } from "@ziyarago/ui/vue"). app.use(ui) по-прежнему регистрирует все компоненты ядра, поэтому они остаются в бандле.' },
      { v: '0.21.0', title: 'sideEffects', body: 'В package.json побочными эффектами названы только CSS-файлы, src/i18n/index.js и src/i18n/components/index.js. Остальное сборщик вправе выбросить, если оно не используется. Не переопределяйте sideEffects для @ziyarago/ui в конфиге сборщика и не импортируйте файлы из src/ ради побочных эффектов.' },
      { v: '0.22.0', title: 'Дополнительные пакеты поддерживают tree-shaking', body: 'В адаптерах Vue и React появился defineUiComponent(name, def): оборачивает ОДНО определение и регистрирует его; defineUiComponents(defs) продолжает работать. @ziyarago/ui/internal экспортирует все встроенные <Name>Def (и pageDefinition), поэтому пакет указывает deps: () => ({ Button: ButtonDef }). @ziyarago/ui/internal полуприватный и может меняться в минорных релизах.' },
      { v: '0.22.0', title: 'Pro регистрирует только импортированное', body: 'В @ziyarago/ui-pro 0.22 каждый экспорт имеет вид /*#__PURE__*/ defineUiComponent(...). Сам по себе импорт пакета ничего не регистрирует. app.use(ui) видит компоненты ядра и только те компоненты Pro, которые импортированы в бандле. Тег Pro, который нигде не импортирован, не зарегистрирован. Модуль Nuxt и резолвер Vite генерируют импорт для каждого тега, их это не затрагивает.' },
      { v: '0.22.0', title: 'Тарбол Pro и диапазон peer', body: 'У тарбола Pro та же версия, что у ядра, а его peer-диапазон для @ziyarago/ui начинается с точной версии ядра, с которой он собран, и заканчивается перед следующим минорным (для 0.22.1: >=0.22.1 <0.23.0). Обновляйте оба пакета вместе. sideEffects у Pro сузился до CSS-файлов и languages/index.js.' },
      { v: '0.20.9, 0.20.12, 0.20.13', title: 'CSP: классы вместо inline style', body: 'Серверный HTML компонентов ядра и Pro содержит классы и атрибуты data-zg-p вместо style="...". Правила лежат в csp.css и csp-pro.css, они входят в @ziyarago/ui/style.css, поэтому стили должны быть подключены. Проценты в серверном HTML округляются в data-zg-p, точное значение выставляется после монтирования. Значения вне конечных наборов (например gap="1.5rem") и переданный вами style по-прежнему inline. См. чек-лист CSP в Integration.' },
      { v: '0.20.8', title: 'Thmanyah больше не поставляется', body: 'Файлы шрифта убраны из пакета по лицензионным причинам. В RTL арабский стек использует системный шрифт, пока вы не подключите Thmanyah у себя; @ziyarago/ui/thmanyah.css даёт готовые @font-face для /fonts/thmanyah/. См. Fonts.' },
      { v: '0.20.7', title: 'Колбэки без аргументов', body: 'Документированные колбэки без аргументов (Modal, Drawer, Alert, Snackbar, Chip, Tag, ConfirmDialog и другие) вызываются без DOM-события. Если ваш обработчик читал первый аргумент, теперь он undefined.' },
      { v: '0.20.4', title: 'Иконки и шрифты при строгом CSP', body: 'Около 100 иконок, которые используют сами компоненты, встроены и не требуют запросов. Остальные имена по-прежнему загружаются с unpkg: разместите их у себя через setIconBase или зарегистрируйте через registerIcons. Мелкие подмножества шрифтов выдаются файлами, а не data: URI.' },
      { v: '0.20.0', title: 'Всплывающие окна в document.body', body: 'Select, Combobox, MultiSelect, DatePicker, Dropdown, Menu, ContextMenu, Popover, Popconfirm и Pro GroupedSelect, TreeSelect, NotificationBell рисуются в document.body с position: fixed. В тестах ищите список по role=listbox или aria-controls, а не внутри корня компонента.' },
      { v: '0.22.1', title: 'Правки стилей', body: 'Визуальные исправления: высота чата, текст ImageUpload, бейджи Kanban, контраст AuthShowcase. Pro 0.22.1 также исправляет видимое имя TreeSelect и GroupedSelect, когда подпись выбранного значения равна null.' },
    ],
    hCheck: 'Чек-лист для приложения',
    check: [
      'Обновите @ziyarago/ui до 0.22.1 и, если используете Pro, установите тарбол Pro той же версии. Не смешивайте минорные версии.',
      'Если важен размер бандла, замените import ui from "@ziyarago/ui/vue" + app.use(ui) на именованные импорты; иначе оставьте как есть и примите всё ядро в бандле.',
      'Убедитесь, что каждый используемый в шаблоне компонент Pro импортирован (именованный импорт, plugins: ["@ziyarago/ui-pro"] в модуле Nuxt или ZiyaragoUiResolver({ plugins: ["@ziyarago/ui-pro"] })).',
      'Оставьте import "@ziyarago/ui/style.css" во входном файле: CSP-классы компонентов ядра и Pro приходят оттуда. Если раньше подключали @ziyarago/ui-pro/style.css, подключайте его после основного.',
      'Если в сборщике или package.json переопределён sideEffects для @ziyarago/ui или @ziyarago/ui-pro, уберите это.',
      'Найдите в коде обработчики Modal, Drawer, Alert, Snackbar, Chip, Tag и ConfirmDialog, которые читают аргумент-событие.',
      'RTL-приложения: подключите Thmanyah у себя и импортируйте @ziyarago/ui/thmanyah.css либо примите системный арабский шрифт.',
      'Строгий CSP: прогоните приложение с вашей политикой, проверьте серверный HTML на атрибуты style, разместите иконки у себя (setIconBase) или зарегистрируйте их.',
      'Тесты, которые ищут содержимое всплывающих окон внутри корня компонента, должны искать по документу (role=listbox, aria-controls).',
      'Языки Pro: если нужны uz, tg, tr, fr, fa, hi, ur, bn, id, kk, ky, ms или ha, один раз импортируйте "@ziyarago/ui-pro/languages" до монтирования.',
      'Соберите production-бандл и сравните размер с предыдущим.',
    ],
    hErr: 'Типичные ошибки',
    symptom: 'Симптом', cause: 'Причина', fix: 'Решение',
    errs: [
      { symptom: 'Vue пишет "Failed to resolve component: UiLineChart" (любой тег Pro) при app.use(ui)', cause: 'Компонент Pro нигде не импортирован, поэтому не зарегистрирован.', fix: 'Импортируйте его (import { UiLineChart } from "@ziyarago/ui-pro/vue") или используйте модуль Nuxt / резолвер Vite с plugins: ["@ziyarago/ui-pro"].' },
      { symptom: 'Error: @ziyarago/ui: component "X" is already registered (pass { override: true } to replace it)', cause: 'Определение с таким именем уже есть в реестре: встроенное или другое, зарегистрированное раньше.', fix: 'Переименуйте компонент или передайте { override: true } в defineUiComponents, если замена намеренная. Повторная регистрация того же самого определения допустима.' },
      { symptom: 'Ошибка импорта defineUiComponent (или @ziyarago/ui/internal) при загрузке Pro', cause: 'Pro 0.22 запущен с ядром старше 0.22.0.', fix: 'Обновите @ziyarago/ui до версии тарбола Pro.' },
      { symptom: 'npm сообщает о конфликте peer-зависимости @ziyarago/ui при установке тарбола Pro', cause: 'Peer-диапазон покрывает один минор: от версии, с которой собран тарбол, до следующего минорного.', fix: 'Ставьте ядро и Pro из одной линии 0.x, например 0.22.1 и 0.22.1.' },
      { symptom: 'Бандл всё равно большой', cause: 'app.use(ui) или импорт по умолчанию тянет всё ядро; пакет из 13 языков подключается побочным импортом.', fix: 'Импортируйте компоненты по имени; @ziyarago/ui-pro/languages подключайте только если нужны эти языки.' },
      { symptom: 'Nuxt предупреждает "plugin @ziyarago/ui-pro: cannot load @ziyarago/ui-pro/names"', cause: 'Pro не установлен в проекте, где запускается Nuxt (например, в CI без доступа к пакету).', fix: 'Установите тарбол в этом окружении или уберите плагин из ziyarago.plugins там.' },
      { symptom: 'Нарушение CSP или блок без стилей в серверном HTML', cause: 'Не подключён стиль, либо значение вне конечных наборов и выводится атрибутом style.', fix: 'Подключите @ziyarago/ui/style.css; используйте значения из наборов (размеры xs..xl, gap 0..48, columns 1..12) или добавьте style-src-attr \'unsafe-inline\'.' },
      { symptom: 'Арабский текст выглядит иначе, чем раньше', cause: 'Файлы Thmanyah больше не поставляются.', fix: 'Подключите шрифт у себя и импортируйте @ziyarago/ui/thmanyah.css, см. Fonts.' },
      { symptom: 'Обработчик получает undefined вместо события', cause: 'С 0.20.7 колбэки, документированные без аргументов, вызываются без DOM-события.', fix: 'Не читайте аргумент; если нужно событие, используйте собственный @click на обёртке.' },
      { symptom: 'Тест не находит опции Select или пункты Menu', cause: 'Всплывающие окна рисуются в document.body.', fix: 'Ищите по документу: role=listbox или aria-controls.' },
    ],
    see: 'Смотрите также',
  },
}
const c = computed(() => COPY[lang.value])
</script>

<template>
  <article class="g" :lang="lang">
    <div class="bar"><UiSegmentedControl v-model="lang" size="sm" :items="[{ value: 'en', label: 'English' }, { value: 'ru', label: 'Русский' }]" /></div>
    <h1>{{ c.h1 }}</h1>
    <p class="lead">{{ c.lead }}</p>

    <h2>{{ c.hChanges }}</h2>
    <div class="tbl">
      <div v-for="ch in c.changes" :key="ch.v + ch.title" class="row">
        <div class="row__h"><UiBadge>{{ ch.v }}</UiBadge><b>{{ ch.title }}</b></div>
        <p>{{ ch.body }}</p>
      </div>
    </div>

    <h2>{{ c.hCheck }}</h2>
    <ol class="list">
      <li v-for="(item, i) in c.check" :key="i">{{ item }}</li>
    </ol>

    <h2>{{ c.hErr }}</h2>
    <div class="tbl">
      <div v-for="(er, i) in c.errs" :key="i" class="err">
        <p><b>{{ c.symptom }}:</b> {{ er.symptom }}</p>
        <p><b>{{ c.cause }}:</b> {{ er.cause }}</p>
        <p><b>{{ c.fix }}:</b> {{ er.fix }}</p>
      </div>
    </div>

    <p class="muted">{{ c.see }}: <NuxtLink to="/docs/pro">Pro</NuxtLink>, <NuxtLink to="/docs/integration">Integration</NuxtLink>, <NuxtLink to="/docs/fonts">Fonts</NuxtLink>, <NuxtLink to="/docs/localization">Localization</NuxtLink>, <NuxtLink to="/docs/changelog">Changelog</NuxtLink>.</p>
  </article>
</template>

<style scoped>
.g { display: flex; flex-direction: column; gap: 16px; min-width: 0; }
.bar { display: flex; }
.g h1 { margin: 0; font: 300 clamp(34px, 5vw, 52px) var(--zg-font); letter-spacing: -.03em; }
.g h2 { margin: 20px 0 0; font: 500 22px var(--zg-font); }
.lead { margin: 0; color: var(--zg-text-2); font-size: 17px; max-width: 70ch; line-height: 1.55; }
.muted { margin: 0; color: var(--zg-text-3); font-size: 14px; line-height: 1.6; }
.muted a { color: var(--zg-brand-text); }
p { margin: 0; color: var(--zg-text-2); max-width: 80ch; line-height: 1.6; overflow-wrap: anywhere; }
.list { margin: 0; padding-inline-start: 22px; display: flex; flex-direction: column; gap: 8px; color: var(--zg-text-2); max-width: 80ch; line-height: 1.6; }
.tbl { display: flex; flex-direction: column; border-radius: 14px; box-shadow: inset 0 0 0 1px var(--zg-stroke); overflow: hidden; }
.row, .err { display: flex; flex-direction: column; gap: 8px; padding: 14px 16px; font-size: 14px; }
.row + .row, .err + .err { box-shadow: inset 0 1px 0 var(--zg-stroke); }
.row__h { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }
.row__h b, .err b { color: var(--zg-text-1); font-weight: 600; }
</style>
