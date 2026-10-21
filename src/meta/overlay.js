// API metadata for the overlay group. Format: see src/meta/README.md
const SIZE = "'xs' | 'sm' | 'md' | 'lg' | 'xl'";
const SIZES = ['xs', 'sm', 'md', 'lg', 'xl'];
const size = (what, def = 'md') => ({ type: SIZE, values: SIZES, default: def, description: `Scale of ${what}.` });
const open = (what) => ({ type: 'boolean', default: false, description: `Shows the ${what} when true; renders nothing when false.` });
const title = (d) => ({ type: 'string', description: d });
const menuItems = {
  type: '{ label: string; value?: string; icon?: string; shortcut?: string; tone?: \'danger\'; disabled?: boolean; onClick?: (item) => void; separator?: boolean }[]',
  default: '[]',
  description: 'Menu entries. Item fields: label, value (passed to select), icon (icon name), shortcut (kbd hint on the right), tone "danger" (red), disabled true (dimmed, not clickable), onClick (called with the item when clicked, before the select event), separator true (renders a divider; other fields ignored).',
};
const select = 'Called with the item value when an entry is clicked.';

export default {
  Modal: {
    description: 'Centered dialog with a title, close button, body and optional footer; use for forms and focused tasks that block the page.',
    props: {
      open: open('dialog'),
      title: { type: 'string', description: 'Header text and aria-label of the dialog.' },
      subtitle: { type: 'string', description: 'Muted line under the title in the header.' },
      closable: { type: 'boolean', default: true, description: 'false hides the close (x) button in the header.' },
      closeOnBackdrop: { type: 'boolean', default: true, description: 'false ignores clicks on the scrim.' },
      closeOnEsc: { type: 'boolean', default: true, description: 'false ignores the Escape key (focus trap stays active).' },
      width: { type: 'string', description: 'CSS max-width of the dialog, for example "960px". Overrides the width of size.' },
      size: size('width (320 to 720 px max), padding and text'),
    },
    slots: { default: 'Dialog body.', footer: 'Footer area, usually action buttons. Rendered only when provided.', title: 'Replaces the title prop with custom header content.', subtitle: 'Replaces the subtitle prop.' },
    events: { close: 'Called on the close button, a click on the scrim or the Escape key. Set open to false in the handler.' },
    notes: ['Has role="dialog" and aria-modal. Escape calls close; on open focus moves into the dialog, Tab is trapped inside it and focus returns to the previously focused element on close.', 'Put data-autofocus on an element to choose which one receives initial focus (default: first focusable).', 'Closed state renders nothing, so inner state is lost on close.'],
  },

  Drawer: {
    description: 'Side panel that slides over the page; use for filters, details and secondary forms.',
    props: {
      open: open('drawer'),
      title: { type: 'string', description: 'Header text and aria-label.' },
      side: { type: "'start' | 'end'", values: ['start', 'end'], default: 'end', description: 'Edge the drawer attaches to; start and end follow text direction.' },
      size: size('width (280 to 640 px)'),
    },
    slots: { default: 'Drawer body.', footer: 'Footer area, usually action buttons. Rendered only when provided.' },
    events: { close: 'Called on the close button, a click on the scrim or the Escape key.' },
    notes: ['Has role="dialog" and aria-modal. Escape calls close; on open focus moves into the dialog, Tab is trapped inside it and focus returns to the previously focused element on close.'],
  },

  ConfirmDialog: {
    description: 'Small Modal with a message and Cancel/Confirm buttons; use to confirm destructive or irreversible actions.',
    props: {
      open: open('dialog'),
      title: { type: 'string', description: 'Dialog heading.' },
      description: { type: 'string', description: 'Explanation shown in the body.' },
      tone: { type: "'default' | 'danger'", values: ['default', 'danger'], default: 'default', description: 'Danger turns the confirm button red; any other value gives the primary button.' },
      confirmLabel: { type: 'string', default: 'Confirm', description: 'Confirm button text.' },
      cancelLabel: { type: 'string', default: 'Cancel', description: 'Cancel button text.' },
      loading: { type: 'boolean', default: false, description: 'Shows a spinner on the confirm button.' },
      size: size('dialog width and padding'),
    },
    events: { confirm: 'Called when the confirm button is clicked.', cancel: 'Called on Cancel, the close icon, the Escape key or a click on the scrim.' },
    notes: ['Close handling goes through cancel, there is no separate close event.', 'The dialog does not close itself: set open to false in both handlers.'],
  },

  Popconfirm: {
    description: 'Button that opens a small confirmation popover with cancel/confirm buttons (No/Yes by default); use for quick inline confirmation of a single action.',
    props: {
      label: { type: 'string', description: 'Text of the trigger button.' },
      title: { type: 'string', description: 'Question shown in the popover.' },
      variant: { type: "'primary' | 'secondary' | 'ghost' | 'danger' | 'inverse' | 'tonal' | 'outlined' | 'text' | 'elevated'", values: ['primary', 'secondary', 'ghost', 'danger', 'inverse', 'tonal', 'outlined', 'text', 'elevated'], default: 'danger', description: 'Button variant of the trigger.' },
      confirmLabel: { type: 'string', default: 'Yes', description: 'Text of the confirm button.' },
      cancelLabel: { type: 'string', default: 'No', description: 'Text of the cancel button.' },
      size: size('trigger button and popover', 'sm'),
    },
    events: { confirm: 'Called when the confirm button is clicked; the popover closes first.' },
    notes: ['Open state is internal. The popover closes on outside click and on Escape.'],
  },

  StepDialog: {
    description: 'Wide Modal with a vertical step list on the left and Previous/Next buttons; use for multi-step wizards.',
    props: {
      open: open('dialog'),
      title: { type: 'string', description: 'Header text and aria-label.' },
      steps: { type: '{ title: string; sub?: string }[]', default: '[]', description: 'Steps in the left rail; sub is a hint under the title.' },
      current: { type: 'number', description: 'Zero-based index of the active step. Earlier steps are shown as done.' },
      size: size('dialog width (640 to 1100 px) and padding'),
    },
    slots: { default: 'Content of the current step.' },
    events: { back: 'Previous button; disabled on the first step.', next: 'Next button; labelled "Submit" on the last step, so also handle submit here.', close: 'Close icon, scrim click or the Escape key.' },
    notes: ['You own the current index: update it in the back and next handlers.', 'Has aria-modal. Escape calls close; on open focus moves into the dialog, Tab is trapped inside it and focus returns to the previously focused element on close.'],
  },

  FullscreenDialog: {
    description: 'Full-screen dialog with a close button, title and Save action in the header; use for long editing flows on mobile.',
    props: {
      open: open('dialog'),
      title: { type: 'string', description: 'Header text and aria-label.' },
      saveLabel: { type: 'string', default: 'Save', description: 'Text of the save button in the header.' },
    },
    slots: { default: 'Dialog content.' },
    events: { close: 'Called on the close icon button or the Escape key.', save: 'Called on the header save button.' },
    notes: ['Has aria-modal. Escape calls close; on open focus moves into the dialog, Tab is trapped inside it and focus returns to the previously focused element on close.'],
  },

  BottomSheet: {
    description: 'Panel anchored to the bottom of the screen with a grab handle; use for mobile pickers and short forms.',
    props: {
      open: open('sheet'),
      title: { type: 'string', description: 'Optional heading; also the aria-label.' },
      maxHeight: { type: 'string | number', default: '85vh', description: 'Maximum height: a CSS length or a number of pixels.' },
      size: size('sheet width (360 to 800 px) and padding'),
    },
    slots: { default: 'Sheet content.', footer: 'Sticky footer, e.g. buttons. Rendered only when provided.' },
    events: { close: 'Called on a click on the scrim or the Escape key.' },
    notes: ['The handle is decorative: it does not support dragging.', 'There is no close button; always handle close (scrim click and Escape). Escape calls close; on open focus moves into the dialog, Tab is trapped inside it and focus returns to the previously focused element on close.'],
  },

  Actionsheet: {
    description: 'Bottom sheet with a list of actions and a Cancel button; use for mobile "more actions" menus.',
    props: {
      open: open('sheet'),
      title: { type: 'string', description: 'Optional heading.' },
      items: {
        type: "{ label: string; icon?: string; tone?: 'danger'; disabled?: boolean; onClick?: () => void }[]",
        default: '[]',
        description: 'Actions. Each item runs its own onClick, then select, then the sheet closes. Tone "danger" colors it red.',
      },
      cancelLabel: { type: 'string', default: 'Cancel', description: 'Text of the cancel row.' },
      size: size('sheet width and padding'),
    },
    events: { select: 'Called with the whole clicked item after its onClick.', close: 'Called after any item is chosen, on Cancel, on the Escape key and on a scrim click.' },
  },

  Popover: {
    description: 'Button that toggles a floating panel with arbitrary content; use for small forms and extra info next to a control.',
    props: {
      label: { type: 'string', description: 'Text of the trigger button.' },
      size: size('trigger button and panel padding'),
    },
    slots: { default: 'Panel content.' },
    notes: ['Open state is internal and toggled by the trigger. The panel closes on outside click and on Escape (focus returns to the trigger).'],
  },

  HoverCard: {
    description: 'Rich card shown on hover or keyboard focus of a trigger; use for previews of users, links or entities.',
    props: {
      trigger: { type: 'string | VNode', description: 'Content that triggers the card.' },
      size: size('card width (200 to 400 px) and padding'),
    },
    slots: { default: 'Card content.' },
    notes: ['The wrapper is focusable (tabIndex 0), so the card also opens on focus.'],
  },

  Tooltip: {
    description: 'Short text bubble shown on hover or focus of the wrapped element; use for icon-only controls and hints.',
    props: {
      text: { type: 'string', required: true, description: 'Tooltip text.' },
      placement: { type: "'top' | 'bottom' | 'left' | 'right'", values: ['top', 'bottom', 'left', 'right'], default: 'top', description: 'Side of the wrapped element where the bubble appears.' },
      size: size('bubble padding and font'),
    },
    slots: { default: 'The element the tooltip is attached to.' },
    notes: ['Pure CSS bubble; it cannot contain markup. For rich content use HoverCard.'],
  },

  Dropdown: {
    description: 'Button that opens a menu of actions; use for "more" menus and action lists.',
    props: {
      label: { type: 'string', description: 'Text of the trigger button.' },
      icon: { type: 'string', description: 'Icon name before the label.' },
      items: menuItems,
      disabled: { type: 'boolean', default: false, description: 'Disables the trigger button so the menu cannot open.' },
      size: size('trigger button and menu'),
    },
    events: { select: select + ' The menu closes first.' },
    notes: ['Each item may also have its own onClick and disabled. Open state is internal; the menu closes on outside click and on Escape.'],
  },

  Menu: {
    description: 'Static vertical list of actions rendered inline; use in sidebars and custom popovers.',
    props: {
      items: menuItems,
      open: { type: 'boolean', description: 'Optional. false renders nothing, true shows the menu; leave unset for an always visible menu.' },
      size: size('row height and text'),
    },
    events: { select, close: 'Called on outside click or Escape while open is true. Pass it as onClose.' },
    notes: ['Always visible unless open is set. For a self-toggling menu use Dropdown, for a right-click menu use ContextMenu.'],
  },

  ContextMenu: {
    description: 'Wraps an area and shows a menu at the cursor on right click; use for row and canvas actions.',
    props: {
      items: menuItems,
      size: size('row height and text'),
    },
    slots: { default: 'The area that reacts to right click.' },
    events: { select: select + ' The menu closes first.' },
    notes: ['The native context menu is prevented inside the area. Clicking outside, right-clicking again or pressing Escape closes it.', 'The menu is clamped to the viewport using a rough 42 px per row.'],
  },

  CommandBar: {
    description: 'Floating glass toolbar of icon buttons; use for selection actions or editor tools.',
    props: {
      items: {
        type: '{ id: string; icon?: string; label: string; disabled?: boolean; separator?: boolean }[]',
        default: '[]',
        description: 'Buttons. label is the tooltip and aria-label, icon defaults to "circle", separator true draws a divider.',
      },
      size: size('button size and padding'),
    },
    events: { action: 'Called with the item id when a button is clicked.' },
  },

  CommandPalette: {
    description: 'Searchable list of commands in a top-aligned dialog; use for a Cmd+K launcher.',
    props: {
      open: open('palette'),
      commands: {
        type: '{ id: string; label: string; icon?: string; shortcut?: string; keywords?: string }[]',
        default: '[]',
        description: 'Commands. Filtering is a case-insensitive substring match on label plus keywords.',
      },
      placeholder: { type: 'string', default: 'Type a command…', description: 'Search input placeholder.' },
      size: size('dialog max width (400 to 720 px)'),
    },
    events: { run: 'Called with the command id on click or Enter; the palette then requests close.', close: 'Called on a scrim click, the Escape key and after a command runs.' },
    notes: ['Keyboard: ArrowDown/ArrowUp move the active command (wraps around, aria-selected), Enter runs it, Escape closes. The active item resets to the first one when the query changes.', 'The input receives focus on open and Tab stays inside the dialog. There is no global hotkey; bind Cmd+K yourself.'],
  },

  ImageViewer: {
    description: 'Full-screen lightbox for one or several images with previous/next buttons and a counter.',
    props: {
      open: open('viewer'),
      images: { type: 'string[]', default: '[]', description: 'Image URLs.' },
      index: { type: 'number', default: 0, description: 'Index of the image to start on.' },
      alt: { type: 'string', description: 'Alt text of the image and aria-label of the dialog (default "Image viewer").' },
    },
    events: { close: 'Called on the close button or a click on the backdrop.' },
    notes: ['Navigation buttons appear only when there is more than one image.'],
  },

  Tour: {
    description: 'Guided product tour that dims the page, highlights a target element and shows a step popover.',
    props: {
      open: open('tour'),
      steps: { type: '{ target?: string; title: string; text: string }[]', default: '[]', description: 'Steps. target is a CSS selector of the element to highlight; without it the step is shown centered over a full dim.' },
      step: { type: 'number', description: 'Controlled zero-based step index. When omitted the tour keeps it internally (reset to 0 on close). Update it from the step event.' },
    },
    events: { close: 'Called on the close icon, the Escape key and after Finish on the last step.', step: 'Called with the new zero-based step index on Next, Back and the arrow keys.' },
    notes: ['Keyboard: ArrowRight/ArrowLeft go to the next/previous step (reversed in RTL), Escape closes. Focus is not moved, so the page stays usable.', 'Targets are looked up with document.querySelector and scrolled into view.', 'The internal step resets to 0 whenever the tour closes.'],
  },

  TourPopover: {
    description: 'Step card of a tour with title, text, step counter and Back/Next buttons; used by Tour and usable standalone.',
    props: {
      title: { type: 'string', description: 'Step heading.' },
      text: { type: 'string', description: 'Step body text.' },
      step: { type: 'string', description: 'Counter text such as "2 / 5".' },
      last: { type: 'boolean', default: false, description: 'Changes the Next button label to "Finish".' },
    },
    events: { back: 'Back button; the button is rendered only when this handler is set.', next: 'Next or Finish button.', close: 'Close icon.' },
  },

  Screensaver: {
    description: 'Full-screen idle screen with a large clock, date and the brand mark; show it after inactivity.',
    props: {
      open: open('screensaver'),
      locale: { type: 'string', default: 'en-GB', description: 'BCP 47 locale for the date line.' },
      hint: { type: 'string', description: 'Small hint under the date, e.g. "Tap to continue".' },
      idleMs: { type: 'number', default: 0, description: 'When greater than 0 and the screensaver is closed, a hidden sentinel listens for pointer, key, wheel and touch activity and calls idle after this many milliseconds without any. 0 disables it.' },
    },
    events: { close: 'Called on click or any key (including Escape) while open.', idle: 'Called once the idleMs period passes without activity while closed; set open to true in the handler.' },
    notes: ['The clock re-renders from one interval created when the screensaver opens and cleared when it closes; the idle timer is re-armed on each interaction. Nothing runs during server rendering.'],
  },
};
