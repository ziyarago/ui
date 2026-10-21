import type { Example } from '../types'

const examples: Example[] = [
  {
    name: 'Alert',
    description: 'Inline message that communicates status, with an optional title and close button. The size prop (xs, sm, md, lg, xl) scales padding, icon and text.',
    variants: [
      { label: 'Tones', width: '520px', items: [
        { props: { tone: 'info', title: 'Visa update' }, text: 'Umrah visas now take 3 working days.' },
        { props: { tone: 'success', title: 'Booking confirmed' }, text: 'Your hotel in Makkah is reserved.' },
        { props: { tone: 'warning', title: 'Limited rooms' }, text: 'Only 2 rooms left for these dates.' },
        { props: { tone: 'danger', title: 'Payment failed' }, text: 'Please check your card and try again.' },
      ] },
      { label: 'No title', width: '520px', props: { tone: 'info' }, text: 'Check-in opens at 14:00 local time.' },
      { label: 'Sizes', width: '520px', items: [
        { props: { size: 'xs', tone: 'info', title: 'Visa update' }, text: 'Umrah visas now take 3 working days.' },
        { props: { size: 'sm', tone: 'info', title: 'Visa update' }, text: 'Umrah visas now take 3 working days.' },
        { props: { size: 'md', tone: 'info', title: 'Visa update' }, text: 'Umrah visas now take 3 working days.' },
        { props: { size: 'lg', tone: 'info', title: 'Visa update' }, text: 'Umrah visas now take 3 working days.' },
        { props: { size: 'xl', tone: 'info', title: 'Visa update' }, text: 'Umrah visas now take 3 working days.' },
      ] },
    ],
  },
  {
    name: 'Banner',
    description: 'Full-width Alert styled as a page-level announcement. The size prop (xs, sm, md, lg, xl) scales padding, icon and text.',
    variants: [
      { label: 'Info', props: { tone: 'info', title: 'Ramadan packages' }, text: 'Early-bird prices end on Friday.' },
      { label: 'Warning', props: { tone: 'warning', title: 'Scheduled maintenance' }, text: 'Booking will be unavailable tonight from 01:00 to 02:00.' },
      { label: 'Sizes', width: '640px', items: [
        { props: { size: 'xs', tone: 'info', title: 'Ramadan packages' }, text: 'Early-bird prices end on Friday.' },
        { props: { size: 'sm', tone: 'info', title: 'Ramadan packages' }, text: 'Early-bird prices end on Friday.' },
        { props: { size: 'md', tone: 'info', title: 'Ramadan packages' }, text: 'Early-bird prices end on Friday.' },
        { props: { size: 'lg', tone: 'info', title: 'Ramadan packages' }, text: 'Early-bird prices end on Friday.' },
        { props: { size: 'xl', tone: 'info', title: 'Ramadan packages' }, text: 'Early-bird prices end on Friday.' },
      ] },
    ],
  },
  {
    name: 'Toast',
    description: 'Compact notification card for transient results, with a tone-based icon. The size prop (xs, sm, md, lg, xl) scales padding, icon, text and max width.',
    variants: [
      { label: 'Tones', width: '380px', items: [
        { props: { tone: 'success', title: 'Saved' }, text: 'Guest details were updated.' },
        { props: { tone: 'danger', title: 'Upload failed' }, text: 'The passport scan is too large.' },
        { props: { tone: 'warning', title: 'Session expiring' }, text: 'You will be signed out in 2 minutes.' },
        { props: { tone: 'info', title: 'New message' }, text: 'Your guide sent you the meeting point.' },
      ] },
      { label: 'Sizes', items: [
        { props: { size: 'xs', tone: 'success', title: 'Saved' }, text: 'Guest details were updated.' },
        { props: { size: 'sm', tone: 'success', title: 'Saved' }, text: 'Guest details were updated.' },
        { props: { size: 'md', tone: 'success', title: 'Saved' }, text: 'Guest details were updated.' },
        { props: { size: 'lg', tone: 'success', title: 'Saved' }, text: 'Guest details were updated.' },
        { props: { size: 'xl', tone: 'success', title: 'Saved' }, text: 'Guest details were updated.' },
      ] },
    ],
  },
  {
    name: 'Snackbar',
    description: 'Short bottom message with an optional action and close button. The size prop (xs, sm, md, lg, xl) scales height, padding and text.',
    variants: [
      { label: 'With action', width: '420px', props: { tone: 'danger', action: 'Undo' }, text: 'Booking cancelled' },
      { label: 'Tonal', width: '420px', props: { variant: 'tonal', tone: 'success', action: 'View' }, text: 'Room added to your trip' },
      { label: 'Sizes', width: '420px', items: [
        { props: { size: 'xs', action: 'Undo' }, text: 'Booking cancelled' },
        { props: { size: 'sm', action: 'Undo' }, text: 'Booking cancelled' },
        { props: { size: 'md', action: 'Undo' }, text: 'Booking cancelled' },
        { props: { size: 'lg', action: 'Undo' }, text: 'Booking cancelled' },
        { props: { size: 'xl', action: 'Undo' }, text: 'Booking cancelled' },
      ] },
    ],
  },
  {
    name: 'Progress',
    description: 'Horizontal progress bar with optional label and value text. The size prop (xs, sm, md, lg, xl) sets bar thickness and label size.',
    variants: [
      { label: 'Default', width: '360px', props: { value: 64, label: 'Documents', meta: '64%' } },
      { label: 'Tones', width: '360px', items: [
        { props: { value: 90, tone: 'success', label: 'Payment', meta: '90%' } },
        { props: { value: 45, tone: 'warning', label: 'Seats filled', meta: '45%' } },
        { props: { value: 20, tone: 'danger', label: 'Budget left', meta: '20%' } },
      ] },
      { label: 'Sizes', width: '360px', items: [
        { props: { size: 'xs', value: 64, label: 'Documents', meta: '64%' } },
        { props: { size: 'sm', value: 64, label: 'Documents', meta: '64%' } },
        { props: { size: 'md', value: 64, label: 'Documents', meta: '64%' } },
        { props: { size: 'lg', value: 64, label: 'Documents', meta: '64%' } },
        { props: { size: 'xl', value: 64, label: 'Documents', meta: '64%' } },
      ] },
    ],
  },
  {
    name: 'Spinner',
    description: 'Indeterminate loading indicator that scales with its size prop. The size prop accepts xs, sm, md, lg, xl or a pixel number.',
    variants: [
      { label: 'Pixels', items: [{ props: { size: 16 } }, { props: { size: 24 } }, { props: { size: 40 } }] },
      { label: 'Sizes', items: [ { props: { size: 'xs' } }, { props: { size: 'sm' } }, { props: { size: 'md' } }, { props: { size: 'lg' } }, { props: { size: 'xl' } } ] },
    ],
  },
  {
    name: 'Skeleton',
    description: 'Placeholder shapes shown while content loads. The size prop (xs, sm, md, lg, xl) sets line height and circle diameter (or pass a pixel number for circles).',
    variants: [
      { label: 'Text lines', width: '360px', props: { lines: 3, width: '320px' } },
      { label: 'Shapes', width: '360px', items: [
        { props: { variant: 'circle', size: 48 } },
        { props: { height: '120px', width: '320px' } },
        { props: { lines: 2, width: '320px' } },
      ] },
      { label: 'Sizes', width: '360px', items: [
        { props: { size: 'xs', lines: 2, width: '320px' } },
        { props: { size: 'sm', lines: 2, width: '320px' } },
        { props: { size: 'md', lines: 2, width: '320px' } },
        { props: { size: 'lg', lines: 2, width: '320px' } },
        { props: { size: 'xl', lines: 2, width: '320px' } },
      ] },
    ],
  },
  {
    name: 'EmptyState',
    description: 'Friendly placeholder for lists and views that have no content yet. The size prop (xs, sm, md, lg, xl) scales icon, padding and text.',
    variants: [
      { label: 'Default', props: { title: 'No bookings yet', description: 'Your upcoming Umrah trips will appear here.' } },
      { label: 'Custom icon', props: { icon: 'search', title: 'No hotels found', description: 'Try changing the dates or filters.' } },
      { label: 'Sizes', items: [
        { props: { size: 'xs', title: 'No bookings yet', description: 'Your upcoming Umrah trips will appear here.' } },
        { props: { size: 'sm', title: 'No bookings yet', description: 'Your upcoming Umrah trips will appear here.' } },
        { props: { size: 'md', title: 'No bookings yet', description: 'Your upcoming Umrah trips will appear here.' } },
        { props: { size: 'lg', title: 'No bookings yet', description: 'Your upcoming Umrah trips will appear here.' } },
        { props: { size: 'xl', title: 'No bookings yet', description: 'Your upcoming Umrah trips will appear here.' } },
      ] },
    ],
  },
  {
    name: 'ErrorPage',
    description: 'Large error code with title, description and recovery actions.',
    variants: [
      { label: '404', props: { code: '404', title: 'Page not found', description: 'The page may have moved. Check the address or go back.' } },
      { label: '500', props: { code: '500', title: 'Server error', description: 'Something broke on our side. Please try again shortly.' } },
    ],
  },
  {
    name: 'StatusPage',
    description: 'Preset full-page states for 404, 401, maintenance and coming soon.',
    variants: [
      { label: '404', props: { kind: '404' } },
      { label: 'Maintenance', props: { kind: 'maintenance' } },
      { label: 'Coming soon', props: { kind: 'soon' } },
    ],
  },
  {
    name: 'DataState',
    description: 'Switches between loading, empty, error, offline and ready content by the state prop.',
    variants: [
      { label: 'Loading', props: { state: 'loading', title: 'Loading hotels' } },
      { label: 'Empty', props: { state: 'empty', title: 'No trips yet', description: 'Plan your first journey.' } },
      { label: 'Error', props: { state: 'error', title: 'Could not load', description: 'Check your connection.' } },
      { label: 'Offline', props: { state: 'offline' } },
    ],
  },
  {
    name: 'LoadingOverlay',
    description: 'Wraps content and covers it with a spinner while loading.',
    variants: [
      { label: 'Loading', width: '360px', props: { loading: true, label: 'Checking availability' }, text: 'Madinah Grand Hotel, 5 nights, 2 guests. Free cancellation until 7 days before arrival.' },
      { label: 'Idle', width: '360px', props: { loading: false }, text: 'Madinah Grand Hotel, 5 nights, 2 guests. Free cancellation until 7 days before arrival.' },
    ],
  },
]
export default examples
