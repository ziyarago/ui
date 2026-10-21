<script setup lang="ts">
useSeo({ title: 'Accessibility — @ziyarago/ui', description: 'What @ziyarago/ui does today for keyboard, screen readers, reduced motion and RTL, what is not covered yet, and how to report accessibility issues.' })

const keyboard: [string, string][] = [
  ['Escape', 'Closes Modal, Drawer, BottomSheet, StepDialog, FullscreenDialog, CommandPalette, Tour and Screensaver. Closes the open list of Select, Dropdown, Menu, Popover and the other popups; focus returns to the trigger.'],
  ['Tab / Shift+Tab', 'Inside the dialogs above focus is trapped: it wraps from the last control to the first and back. On open, focus moves to the first control (or the element marked autofocus) and returns to the previous element on close.'],
  ['Arrow Up / Down, Enter', 'CommandPalette: moves the active option (the input uses aria-activedescendant) and runs it.'],
  ['Arrow Left / Right', 'Carousel: previous and next slide. Tour: previous and next step, mirrored in RTL.'],
  ['Enter / Space', 'Buttons, switches, checkboxes, tabs and options are real button elements, so the browser handles activation.'],
]
const semantics: [string, string][] = [
  ['Dialogs', 'role="dialog" with aria-modal and aria-label from the title (Modal, FullscreenDialog, ImageViewer, Screensaver); Tour is a dialog labelled "Tour".'],
  ['Form controls', 'Switch, Checkbox, OptionCard, Rating and RadioGroup carry role and aria-checked; Select and similar pickers expose role="listbox" with role="option" and aria-selected; field errors use role="alert".'],
  ['Tabs', 'Tabs and PillTabs use role="tablist", role="tab" and aria-selected.'],
  ['Status', 'Toast and Snackbar use role="status", Alert uses role="alert", Spinner has an aria-label, Chat messages are a polite live log.'],
  ['Carousel', 'Region with aria-roledescription="carousel", slides announced politely when autoplay is off, previous and next buttons labelled.'],
  ['Icon buttons', 'Icon-only buttons inside components get an aria-label ("More", "Previous", "Next"). The label text can be overridden through props where the component exposes one.'],
  ['Focus ring', 'Buttons, icon buttons, chips, links, options and inputs show a :focus-visible ring in the brand color.'],
]
const notYet: [string, string][] = [
  ['Arrow-key navigation in widgets', 'Tabs, PillTabs, SegmentedControl, Select lists, Menu and Dropdown items are reached with Tab, not with arrow keys, and do not follow the WAI-ARIA roving tabindex pattern.'],
  ['Tooltip', 'The text is drawn with CSS from a data attribute, so screen readers do not read it. It appears on hover and keyboard focus only.'],
  ['Contrast', 'Tokens are defined in OKLCH for dark and light and two palettes, but the ratios have not been measured with a tool yet. Some muted text (--zg-text-3) may fall below 4.5:1.'],
  ['Popup focus handling', 'Select, Dropdown and Popover lists close on Escape and outside click but do not move focus into the list or trap it.'],
  ['Map, drag and drop', 'Map pans with the pointer only. Sortable lists are driven by drag; there is no keyboard way to reorder.'],
  ['Screen reader testing', 'No manual testing with NVDA, JAWS or VoiceOver has been recorded. Treat the roles above as intent, not a verified result.'],
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
    <!-- AXE-RESULTS:START — an automated axe run will be added here. -->
    <UiAlert tone="info">Pending: results of an automated axe-core run over the docs pages and component previews will be published in this section.</UiAlert>
    <!-- AXE-RESULTS:END -->

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
