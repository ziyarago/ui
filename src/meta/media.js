// API metadata for the media group. Format: see src/meta/README.md
const SZ = ['xs', 'sm', 'md', 'lg', 'xl'];
const SIZE = "'xs' | 'sm' | 'md' | 'lg' | 'xl'";
const size = (d, extra) => ({ type: SIZE, values: SZ, default: d || 'md', description: extra || 'Thumbnail strip size.' });

export default {
  Avatar: {
    description: 'Round user picture that falls back to initials when there is no image.',
    props: {
      name: { type: 'string', description: 'Full name. Shown as the tooltip and used for up to two initials; "?" when empty.' },
      src: { type: 'string', description: 'Image URL. Initials are shown without it.' },
      size: { type: "'xs' | 'sm' | 'md' | 'lg' | 'xl' | number", values: SZ, default: 'md', description: 'Diameter: xs 24, sm 32, md 40, lg 56, xl 72 px. A number is used directly as px.' },
    },
    notes: ['Avatar sizes differ from other components (lg 56, xl 72), and a number gives any custom size.'],
  },

  Icon: {
    description: 'Renders a named icon from the library at a chosen size.',
    props: {
      name: { type: 'string', default: 'circle', description: 'Icon name from the library, for example "check" or "map-pin".' },
      size: { type: "'xs' | 'sm' | 'md' | 'lg' | 'xl' | number", values: SZ, default: 'md', description: 'Pixel size: xs 14, sm 16, md 20, lg 24, xl 32. A number is used directly as px.' },
    },
    notes: ['The icon is aria-hidden; add a label on the surrounding control for accessibility.', 'Icons load lazily, so the glyph may appear a moment after first render.'],
  },

  LazyImage: {
    description: 'Image box with a fixed aspect ratio and rounded corners, rendered as a background image.',
    props: {
      src: { type: 'string', description: 'Image URL. An empty placeholder is shown without it.' },
      alt: { type: 'string', default: '', description: 'Accessible description, exposed as aria-label on role="img".' },
      aspectRatio: { type: 'string', default: '16/9', description: 'CSS aspect-ratio value such as "1/1" or "4/3".' },
      rounded: { type: 'number', default: 20, description: 'Corner radius in px.' },
    },
  },

  Gallery: {
    description: 'Large image with a counter and a thumbnail strip for browsing a set of photos.',
    props: {
      images: { type: 'string[]', required: true, default: [], description: 'Image URLs. The first one is shown initially; clicking a thumbnail switches the main image.' },
      alt: { type: 'string', default: '', description: 'Accessible description of the main image.' },
      index: { type: 'number', description: 'Controlled active image index. When set, the gallery only changes image when you update it from onChange; when omitted it keeps its own state starting at 0.' },
      labels: { type: '{ photo?: string }', default: "{ photo: 'Photo' }", description: 'Override the thumbnail aria-label prefix.' },
      size: size('md'),
    },
    events: { change: 'Called with the new image index when a thumbnail is clicked.' },
    notes: ['An empty or missing images array renders an empty frame (no counter, no thumbnails). Invalid index values are clamped to the available range.'],
  },

  Carousel: {
    description: 'Slideshow of image slides with captions, arrows and dot pagination.',
    props: {
      items: { type: '{ image?: string; title: string; sub?: string }[]', required: true, default: [], description: 'Slides. title and sub form the caption over the image.' },
      index: { type: 'number', description: 'Controlled active slide index. When set, the carousel only changes slide when you update it from onChange; when omitted it keeps its own state starting at 0.' },
      autoplay: { type: 'number | boolean', description: 'Advance automatically every N milliseconds (true = 5000). Starts only in the browser, pauses while the pointer is over or focus is inside the carousel and while the tab is hidden, and is disabled for prefers-reduced-motion and data-motion="off". Needs at least 2 slides.' },
      label: { type: 'string', description: 'Accessible name of the carousel region.' },
      labels: { type: '{ prev?: string; next?: string; slide?: string }', default: "{ prev: 'Previous', next: 'Next', slide: 'Slide' }", description: 'Override the aria-labels of the arrows and dots.' },
      size: size('md', 'Slide aspect ratio and caption size: xs 16/6, sm 16/7, md 16/8, lg 16/9, xl 16/10.'),
    },
    events: { change: 'Called with the new slide index on arrow, dot, keyboard (left and right arrows) and autoplay changes.' },
    notes: ['Arrows wrap around at both ends and are hidden with fewer than 2 slides; an empty items array renders an empty frame.', 'Autoplay has no visible pause button; hover or focus pauses it. Prefer a manual carousel for essential content.'],
  },

  Map: {
    description: 'Interactive raster map with panning, zoom buttons and clickable markers, using OpenStreetMap data via CARTO tiles.',
    props: {
      lat: { type: 'number', default: 21.4225, description: 'Initial center latitude.' },
      lon: { type: 'number', default: 39.8262, description: 'Initial center longitude.' },
      zoom: { type: 'number', default: 14, description: 'Initial zoom level; the zoom buttons clamp it to 3..18.' },
      markers: { type: "{ lat: number; lon: number; label?: string; icon?: string; tone?: 'brand' | 'sky' | 'success' | 'warning' | 'danger' | 'neutral' }[]", default: [], description: 'Pins. label is the tooltip, icon defaults to "map-pin".' },
      width: { type: 'number', default: 640, description: 'Pixel width used to compute which tiles to load; the map element itself fills its container.' },
      height: { type: 'number', default: 360, description: 'Height in px.' },
      theme: { type: "'light' | 'dark'", values: ['light', 'dark'], description: 'Tile theme. If omitted, dark is used when the page is inside a dark data-theme.' },
      style: { type: 'string', description: 'CARTO tile style path, for example "light_all" or "dark_all". Overrides theme.' },
      label: { type: 'string', default: 'Map', description: 'aria-label of the map region.' },
      labels: { type: '{ zoomIn?: string; zoomOut?: string }', default: "{ zoomIn: 'Zoom in', zoomOut: 'Zoom out' }", description: 'Accessible names of the zoom buttons.' },
    },
    events: { select: 'Called with the marker object when a marker is clicked.' },
    notes: ['The center and zoom props are initial values; user panning and zooming is kept in internal state.', 'Tiles come from a third-party CDN, so it needs network access.'],
  },

  ProfileHeader: {
    description: 'Profile card with a cover image, large avatar, name and a row of meta items.',
    props: {
      name: { type: 'string', required: true, description: 'Person or organization name.' },
      src: { type: 'string', description: 'Avatar image URL; initials are shown without it.' },
      cover: { type: 'string', description: 'Cover image URL.' },
      meta: { type: '{ icon: string; label: string }[]', default: [], description: 'Facts under the name such as location or join date. label must be unique.' },
    },
    slots: { default: 'Extra content on the right of the name row, usually action buttons.' },
  },

  ChatAi: {
    description: 'Chat panel with message bubbles, a typing indicator and an input, for AI assistant UIs.',
    props: {
      messages: { type: "{ role: 'user' | 'ai'; text: string }[]", required: true, default: [], description: 'Conversation in order. Any role other than "user" renders as an assistant bubble.' },
      loading: { type: 'boolean', default: false, description: 'Shows the typing dots and disables sending.' },
      title: { type: 'string', default: 'Assistant', description: 'Header title; also the aria-label. The header renders only when set.' },
      subtitle: { type: 'string', description: 'Muted text next to the title.' },
      placeholder: { type: 'string', default: 'Ask anything…', description: 'Input placeholder.' },
    },
    events: { send: 'Called with the trimmed message text when the user presses Enter or the send button. The component does not append it to messages.' },
    notes: ['Append the user message and the reply to messages yourself; set loading while waiting.'],
  },
};
