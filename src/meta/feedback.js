// API metadata for the feedback group. Format: see src/meta/README.md
const SIZE = "'xs' | 'sm' | 'md' | 'lg' | 'xl'";
const SIZES = ['xs', 'sm', 'md', 'lg', 'xl'];
const size = (what) => ({ type: SIZE, values: SIZES, default: 'md', description: `Scale of ${what}.` });
const TONE4 = "'info' | 'success' | 'warning' | 'danger'";

const alertProps = {
  tone: { type: TONE4, values: ['info', 'success', 'warning', 'danger'], default: 'info', description: 'Color and icon: info, check, triangle-alert or circle-alert.' },
  title: { type: 'string', description: 'Bold first line above the message.' },
  size: size('padding, icon and text'),
};

export default {
  Alert: {
    description: 'Inline message block with a tone icon, optional title and close button; use for form errors, notices and results inside a page.',
    props: {
      ...alertProps,
      banner: { type: 'boolean', default: false, description: 'Removes the border radius so the alert spans the full width like a Banner.' },
      hideIcon: { type: 'boolean', default: false, description: 'Hides the leading tone icon (the icon slot is hidden too).' },
    },
    slots: { default: 'Message text.', title: 'Replaces the title prop with custom content.', icon: 'Replaces the tone icon inside the icon tile.', actions: 'Row under the message for buttons or links.' },
    events: { close: 'Called when the close button is clicked. The button is rendered only when this handler is set.' },
    notes: ['Has role="alert", so screen readers announce it when it appears.', 'Not self-dismissing: hide it yourself in the close handler.'],
  },

  Banner: {
    description: 'Full-width Alert without rounded corners; use at the top of a page or section for system-wide notices.',
    props: {
      tone: { ...alertProps.tone, forwarded: true },
      title: { ...alertProps.title, forwarded: true },
      size: size('padding, icon and text'),
    },
    slots: { default: 'Message text.' },
    events: { close: 'Called when the close button is clicked. The button is rendered only when this handler is set.' },
    notes: ['Same as Alert with banner enabled; all Alert props are forwarded.'],
  },

  Toast: {
    description: 'Static toast card with a tone icon, title and text; use for transient confirmations rendered in your own toast stack.',
    props: {
      tone: { type: TONE4, values: ['info', 'success', 'warning', 'danger'], default: 'info', description: 'Color and icon.' },
      title: { type: 'string', description: 'Bold first line.' },
      size: size('padding, icon, text and max width'),
    },
    slots: { default: 'Message text.' },
    notes: ['Presentational only: it has no timer, close button or positioning. Mount and unmount it yourself.', 'Has role="status".'],
  },

  Snackbar: {
    description: 'Compact dark bar with a message and one optional action; use for undo and short confirmations at the bottom of the screen.',
    props: {
      tone: { type: "'brand' | 'sky' | 'success' | 'warning' | 'danger' | 'neutral'", values: ['brand', 'sky', 'success', 'warning', 'danger', 'neutral'], default: 'brand', description: 'Accent color; affects the tonal background (and the action color: green for success, red otherwise).' },
      variant: { type: "'solid' | 'tonal'", values: ['solid', 'tonal'], default: 'solid', description: 'Solid inverse background or a tone-tinted one.' },
      action: { type: 'string', description: 'Label of the action button. The button is rendered only when set.' },
      size: size('height, padding and text'),
    },
    slots: { default: 'Message text.' },
    events: { action: 'Called when the action button is clicked.', close: 'Called when the close icon is clicked. The icon is rendered only when this handler is set.' },
    notes: ['Presentational only: no timer or positioning.'],
  },

  Progress: {
    description: 'Horizontal progress bar with optional label and meta text; use for uploads, quotas and completion.',
    props: {
      value: { type: 'number', default: 0, description: 'Progress from 0 to 100; clamped to this range.' },
      tone: { type: "'success' | 'warning' | 'danger'", values: ['success', 'warning', 'danger'], description: 'Bar color. Omit for the brand color.' },
      label: { type: 'string', description: 'Text above the bar on the left.' },
      meta: { type: 'string', description: 'Monospace text above the bar on the right, e.g. "64%" or "3 / 5".' },
      size: size('bar height and label text'),
    },
    notes: ['Exposes role="progressbar" with aria-valuenow; the label is not linked via aria-labelledby.'],
  },

  Spinner: {
    description: 'Inline loading indicator; use inside buttons, cards or next to a loading label.',
    props: {
      size: { type: "'xs' | 'sm' | 'md' | 'lg' | 'xl' | number", values: SIZES, default: 'md', description: 'Preset (14, 16, 20, 28, 36 px) or a number of pixels.' },
    },
    notes: ['Has role="status" and aria-label="Loading".'],
  },

  Skeleton: {
    description: 'Shimmering placeholder for content that is loading; use text lines, circles or rectangles that match the final layout.',
    props: {
      variant: { type: "'text' | 'circle' | 'rect'", values: ['text', 'circle', 'rect'], default: 'text', description: 'Shape of the placeholder.' },
      lines: { type: 'number', default: 1, description: 'Number of stacked lines. The last of several lines is 60% wide.' },
      width: { type: 'string | number', default: '100%', description: 'CSS width of each line or rect. A number is pixels.' },
      height: { type: 'string | number', description: 'CSS height. A number is pixels. Text lines take the height from size.' },
      size: { type: "'xs' | 'sm' | 'md' | 'lg' | 'xl' | number", values: SIZES, default: 'md', description: 'Text line height and gap; for variant "circle" the diameter (24, 32, 40, 56, 72 px) or a number of pixels.' },
    },
    notes: ['Purely visual and not announced to assistive tech; pair it with aria-busy on the container.'],
  },

  EmptyState: {
    description: 'Centered icon (or image), title and description with optional actions; use when a list, search or section has no content.',
    props: {
      title: { type: 'string', required: true, description: 'Bold heading.' },
      description: { type: 'string', description: 'Supporting text under the title.' },
      icon: { type: 'string', default: 'inbox', description: 'Icon name shown in the tile. Ignored when image is set.' },
      image: { type: 'string', description: 'Image URL shown instead of the icon.' },
      size: size('padding, icon tile and text'),
    },
    slots: { default: 'Actions (buttons) shown under the text.' },
  },

  ErrorPage: {
    description: 'Full-page error with a large code, title and description; use for 404, 500 and similar screens.',
    props: {
      code: { type: 'string', default: '404', description: 'Large number shown on top.' },
      title: { type: 'string', default: 'Page not found', description: 'Heading.' },
      description: { type: 'string', default: 'The page may have moved. Check the address or go back.', description: 'Supporting text.' },
    },
    slots: { default: 'Actions (buttons) shown under the text.' },
  },

  StatusPage: {
    description: 'Ready-made full-page status screen (404, 401, maintenance, coming soon) with one action button.',
    props: {
      kind: { type: "'404' | '401' | 'maintenance' | 'soon'", values: ['404', '401', 'maintenance', 'soon'], default: '404', description: 'Preset that sets the code or icon, default title, description and button label.' },
      title: { type: 'string', description: 'Overrides the preset heading.' },
      description: { type: 'string', description: 'Overrides the preset text.' },
      actionLabel: { type: 'string', description: 'Overrides the button text of the 404, 401 and maintenance presets (default "Back to home").' },
      notifyLabel: { type: 'string', default: 'Notify me', description: 'Button text for kind "soon".' },
      emailLabel: { type: 'string', default: 'name@email.com', description: 'Placeholder of the email field for kind "soon".' },
      codeNode: { type: 'VNode', description: 'Replaces the big code or icon. Used by PageStatus for its code slot.' },
      messageNode: { type: 'VNode', description: 'Replaces heading and description. Used by PageStatus for its message slot.' },
      actionNode: { type: 'VNode', description: 'Replaces the button or email form. Used by PageStatus for its action slot.' },
    },
    slots: { default: 'Extra content rendered after the button.' },
    events: { action: 'Called when the main button is clicked (not used for kind "soon").', notify: 'Called with the typed email string when the Notify button of kind "soon" is clicked.' },
    notes: ['The email is not validated: check it in your onNotify handler.'],
  },

  DataState: {
    description: 'Switches between loading, empty, error, offline and the real content based on one state value; wrap any data-driven block with it.',
    props: {
      state: { type: "'ready' | 'loading' | 'empty' | 'error' | 'offline'", values: ['ready', 'loading', 'empty', 'error', 'offline'], default: 'ready', description: 'Which view to show. "ready" renders the children.' },
      title: { type: 'string', description: 'Overrides the default heading of the non-ready views ("Loading…", "Nothing here yet", "Something went wrong", "No internet").' },
      description: { type: 'string', description: 'Supporting text for empty, error and offline views (offline defaults to "Saved guides still work.").' },
      retryLabel: { type: 'string', description: 'Retry button label for error ("Retry") and offline ("Try again").' },
    },
    slots: { default: 'Content shown when state is "ready".' },
    events: { retry: 'Called when the retry button of the error or offline view is clicked.' },
  },

  LoadingOverlay: {
    description: 'Wrapper that dims its content and shows a spinner on top while loading; use over cards, tables or forms during a refresh.',
    props: {
      loading: { type: 'boolean', default: false, description: 'Shows the overlay with the spinner.' },
      label: { type: 'string', description: 'Text shown under the spinner.' },
    },
    slots: { default: 'Content covered by the overlay.' },
  },
};
