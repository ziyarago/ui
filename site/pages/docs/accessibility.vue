<script setup lang="ts">
useSeo({ title: 'Accessibility — @ziyarago/ui', description: 'What @ziyarago/ui does today for keyboard, screen readers, reduced motion and RTL, what is not covered yet, and how to report accessibility issues.' })

const keyboard: [string, string][] = [
  ['Escape', 'Closes Modal, Drawer, BottomSheet, StepDialog, FullscreenDialog, CommandPalette, Tour and Screensaver. Closes the open list of Select, Dropdown, Menu, Popover and the other popups; focus returns to the trigger.'],
  ['Tab / Shift+Tab', 'Inside the dialogs above focus is trapped: it wraps from the last control to the first and back. On open, focus moves to the first control (or the element marked autofocus) and returns to the previous element on close.'],
  ['Arrow Up / Down, Enter', 'CommandPalette: moves the active option (the input uses aria-activedescendant) and runs it.'],
  ['Arrow Left / Right, Home, End', 'Tabs, PillTabs and SegmentedControl: one tab stop (roving tabindex on the selected item); the arrows move focus between items and wrap, Home and End jump to the ends, Enter or Space activates. Mirrored in RTL; vertical PillTabs use Arrow Up / Down. Carousel: previous and next slide. Tour: previous and next step, mirrored in RTL.'],
  ['Arrow Up / Down, Home, End, Enter', 'Select, PillSelect, Dropdown, Menu and ContextMenu: Arrow Down or Up on the trigger opens the list; focus moves into it (the selected option, or the first item) and the arrows move real focus. Menus wrap, listboxes stop at the ends, typing a letter jumps to a matching item, disabled items and separators are skipped. Enter or Space chooses and focus returns to the trigger; Tab closes the list and continues from the trigger.'],
  ['Enter / Space', 'Buttons, switches, checkboxes, tabs and options are real button elements, so the browser handles activation.'],
]
const semantics: [string, string][] = [
  ['Dialogs', 'role="dialog" with aria-modal and aria-label from the title (Modal, FullscreenDialog, ImageViewer, Screensaver); Tour is a dialog labelled "Tour".'],
  ['Form controls', 'Switch, Checkbox, OptionCard, Rating and RadioGroup carry role and aria-checked; Select and similar pickers expose role="listbox" with role="option" and aria-selected; field errors use role="alert".'],
  ['Tabs', 'Tabs and PillTabs use role="tablist", role="tab" and aria-selected (tabs are activated manually, with Enter or Space). SegmentedControl is a group of aria-pressed buttons.'],
  ['Tooltip', 'The wrapper points to a visually hidden element with role="tooltip" and the same text through aria-describedby, so the text is read when the trigger gets focus. The bubble itself is still drawn by CSS on hover and focus.'],
  ['Names', 'Every listbox opened by a picker is named from its label or placeholder, Progress has an accessible name (its label, or a translated "Progress"), scrollable code blocks and table wrappers are focusable so keyboard users can scroll them.'],
  ['Status', 'Toast and Snackbar use role="status", Alert uses role="alert", Spinner has an aria-label, Chat messages are a polite live log.'],
  ['Carousel', 'Region with aria-roledescription="carousel", slides announced politely when autoplay is off, previous and next buttons labelled.'],
  ['Icon buttons', 'Icon-only buttons inside components get an aria-label ("More", "Previous", "Next"). The label text can be overridden through props where the component exposes one.'],
  ['Focus ring', 'Buttons, icon buttons, chips, links, options and inputs show a :focus-visible ring in the brand color.'],
]
const axe: [string, string][] = [
  ['Before the fixes', '563 violating nodes in 6 rules on 32 pages x 2 themes: aria-required-children 410 (docs props table), label-content-name-mismatch 64 (docs search button), scrollable-region-focusable 48 (code blocks), aria-progressbar-name 28 (Progress), color-contrast 11 (text-3 on table headers, brand KPI, danger button), aria-hidden-focus 2 (home hero).'],
  ['After the fixes', '0 violations on all 33 pages x 2 themes x 2 palettes, with popups closed and open (39 rules passed).'],
  ['Fixed in the library', 'Progress name, focusable code blocks and table wrappers, listbox names, DatePicker aria-pressed="null", text-3 in dark (0.66 to 0.74 lightness), brand KPI label and delta opacity, danger button text (new --zg-red-text token). Fixed in the docs site: props table cell roles, search button name, inert hero preview.'],
  ['Still failing', 'Outside the default page set: TreeSelect (aria-required-children, 12 nodes, search input inside role=tree) and the picker gaps in the list above. Not measurable by axe: tooltip dismissal, placeholder contrast, screen reader output.'],
]
const notYet: [string, string][] = [
  ['Tooltip dismissal', 'The tooltip bubble cannot be dismissed with Escape without moving focus (WCAG 1.4.13), and it is not shown on touch.'],
  ['Select-like pickers', 'Combobox, MultiSelect, GroupedSelect, TreeSelect and DatePicker open real lists but are not on the roving pattern yet: arrows do not move focus into their lists. TreeSelect also puts a search input inside role="tree" (axe aria-required-children, 12 nodes in the open state).'],
  ['Contrast', 'Measured with axe on 33 pages in both themes and both palettes (see below), but only on what is rendered: placeholder text, disabled controls (exempt from WCAG), text on the animated backgrounds and states that need a hover are not covered.'],
  ['Map, drag and drop', 'Map pans with the pointer only. Sortable lists are driven by drag; there is no keyboard way to reorder.'],
  ['Screen reader testing', 'No manual testing with NVDA, JAWS or VoiceOver has been recorded. axe finds about a third of WCAG issues at most, so treat the roles above as intent, not a verified result.'],
  ['Component strings', 'Built-in labels are translated for en, ar and ru (free) and 13 more languages in the Pro pack; some components still show English only, see the Localization page.'],
]
</script>

<template>
  <article class="g">
    <h1>Accessibility</h1>
    <p class="lead">What the library does today, read from the component code and the CSS, and what it does not do yet. It is a work in progress, not a claim of WCAG conformance.</p>

    <h2>Keyboard</h2>
    <div class="tbl" role="table" aria-label="Keyboard behaviour"><div v-for="[k, d] in keyboard" :key="k" class="row" role="row"><b role="cell">{{ k }}</b><span role="cell">{{ d }}</span></div></div>

    <h2>Roles, labels and focus</h2>
    <div class="tbl" role="table" aria-label="Roles and labels"><div v-for="[k, d] in semantics" :key="k" class="row" role="row"><b role="cell">{{ k }}</b><span role="cell">{{ d }}</span></div></div>

    <h2>Motion</h2>
    <ul>
      <li>With <code>prefers-reduced-motion: reduce</code>, transitions and animations inside <code>.zg-root</code> are cut to near zero, and popup, modal and sheet entrance animations are turned off.</li>
      <li>The <code>data-motion</code> attribute on <code>&lt;html&gt;</code> (<code>on</code> or <code>off</code>) lets users override the system setting. <code>useUiTheme().setMotion('auto|on|off')</code> sets it; <code>auto</code> follows the system and the init script applies it before first paint.</li>
      <li>Heavy effects (<code>data-fx</code>) can be set to <code>lite</code>; the animated page-background drift runs only at the full level.</li>
    </ul>

    <h2>Themes and direction</h2>
    <ul>
      <li>Dark and light themes and two palettes are switched with <code>data-theme</code> and <code>data-palette</code>; the <a href="/docs/colors">Colors</a> page shows every token in both themes.</li>
      <li>RTL is set with <code>dir="rtl"</code> on <code>&lt;html&gt;</code> (<code>setLocale('ar')</code>). Component styles use logical properties (<code>inset-inline</code>, <code>padding-inline</code>) plus <code>[dir="rtl"]</code> overrides, and keyboard shortcuts that depend on direction, like Tour arrows, are mirrored.</li>
    </ul>

    <h2>Not covered yet</h2>
    <div class="tbl" role="table" aria-label="Known gaps"><div v-for="[k, d] in notYet" :key="k" class="row" role="row"><b role="cell">{{ k }}</b><span role="cell">{{ d }}</span></div></div>
    <p class="muted">The full plan is on the <NuxtLink to="/docs/roadmap">roadmap</NuxtLink>.</p>

    <h2>Automated audit (axe)</h2>
    <p>Run with <code>npm run a11y</code> (<code>scripts/a11y.mjs</code>, axe-core with the WCAG 2.0 and 2.1 A and AA tags, headless Chrome) against the docs site. It covers the home page, 25 component pages, the dashboard, auth, settings and inbox templates, this page, Localization and Colors, each in dark and light, in the gold and tamam palettes, and with every popup trigger opened (<code>--open</code>).</p>
    <div class="tbl" role="table" aria-label="axe results"><div v-for="[k, d] in axe" :key="k" class="row" role="row"><b role="cell">{{ k }}</b><span role="cell">{{ d }}</span></div></div>
    <p class="muted">axe checks rules it can decide automatically. A clean run is not a conformance claim.</p>

    <h2>Report an issue</h2>
    <p>Found a barrier? Open an issue with the component name, what you tried (keyboard, screen reader and browser), and what happened. Reproductions on the docs site are the fastest to fix.</p>
    <a href="https://github.com/ziyarago/ui/issues" target="_blank" rel="noopener noreferrer"><UiButton variant="primary">Open an issue on GitHub</UiButton></a>
  </article>
</template>

<style scoped>
.g { display: flex; flex-direction: column; gap: 16px; min-width: 0; }
.g h1 { margin: 0; font: 300 clamp(34px, 5vw, 52px) var(--zg-font); letter-spacing: -.03em; }
.g h2 { margin: 20px 0 0; font: 500 22px var(--zg-font); }
.lead { margin: 0; color: var(--zg-text-2); font-size: 17px; max-width: 70ch; }
.muted { margin: 0; color: var(--zg-text-3); font-size: 14px; }
p { margin: 0; color: var(--zg-text-2); max-width: 70ch; line-height: 1.6; }
code { font-family: var(--zg-font-mono); font-size: .92em; background: var(--zg-s2); padding: 1px 6px; border-radius: 6px; overflow-wrap: anywhere; }
ul { color: var(--zg-text-2); line-height: 1.7; padding-inline-start: 20px; margin: 0; max-width: 78ch; }
a { color: var(--zg-brand-text); text-decoration: none; align-self: flex-start; }
.tbl { display: flex; flex-direction: column; border-radius: 14px; box-shadow: inset 0 0 0 1px var(--zg-stroke); overflow: hidden; }
.row { display: grid; grid-template-columns: minmax(150px, 220px) minmax(0, 1fr); gap: 16px; padding: 12px 16px; color: var(--zg-text-2); line-height: 1.6; font-size: 15px; }
.row + .row { box-shadow: inset 0 1px 0 var(--zg-stroke); }
.row b { color: var(--zg-text-1); font-weight: 600; }
@media (max-width: 700px) { .row { grid-template-columns: minmax(0, 1fr); gap: 4px; } }
</style>
