import type { Example } from '../types'

const cities = [
  { value: 'makkah', label: 'Makkah' },
  { value: 'madinah', label: 'Madinah' },
  { value: 'jeddah', label: 'Jeddah' },
  { value: 'taif', label: 'Taif' },
]

const amenities = [
  { value: 'wifi', label: 'Free Wi-Fi' },
  { value: 'shuttle', label: 'Haram shuttle' },
  { value: 'breakfast', label: 'Breakfast included' },
  { value: 'prayer', label: 'Prayer room' },
]

const examples: Example[] = [
  {
    name: 'TextField',
    description: 'Single-line text input with label, leading icon, suffix and error state. Supports a size prop: xs, sm, md (default), lg, xl.',
    variants: [
      { label: 'Default', width: '360px', props: { label: 'Full name', placeholder: 'As written in passport', modelValue: '' } },
      { label: 'With icon', width: '360px', props: { label: 'Email', icon: 'mail', placeholder: 'name@example.com', modelValue: 'guest@ziyarago.com' } },
      { label: 'States', width: '360px', items: [{ props: { label: 'Invalid', error: true, modelValue: 'not-an-email', icon: 'mail' } }, { props: { label: 'Disabled', disabled: true, modelValue: 'Locked value' } }, { props: { label: 'Read only', readonly: true, modelValue: 'Booking #ZG-4821' } }] },
      { label: 'Sizes', width: '360px', items: [{ props: { size: 'xs', label: 'Email', icon: 'mail', modelValue: 'guest@ziyarago.com' } }, { props: { size: 'sm', label: 'Email', icon: 'mail', modelValue: 'guest@ziyarago.com' } }, { props: { size: 'md', label: 'Email', icon: 'mail', modelValue: 'guest@ziyarago.com' } }, { props: { size: 'lg', label: 'Email', icon: 'mail', modelValue: 'guest@ziyarago.com' } }, { props: { size: 'xl', label: 'Email', icon: 'mail', modelValue: 'guest@ziyarago.com' } }] },
    ],
  },
  {
    name: 'Textarea',
    description: 'Multi-line text input with optional hint and error message. Supports a size prop: xs, sm, md (default), lg, xl.',
    variants: [
      { label: 'Default', width: '420px', props: { label: 'Special requests', placeholder: 'Ground floor, near the elevator...', rows: 4, modelValue: '' } },
      { label: 'Hint and limit', width: '420px', props: { label: 'Notes', hint: 'Up to 200 characters', maxlength: 200, rows: 3, modelValue: 'Late arrival expected after 23:00.' } },
      { label: 'Error', width: '420px', props: { label: 'Review', error: 'Please write at least 20 characters', modelValue: 'Nice', rows: 3 } },
      { label: 'Sizes', width: '420px', items: [{ props: { size: 'xs', label: 'Notes', rows: 3, modelValue: 'Late arrival expected.' } }, { props: { size: 'sm', label: 'Notes', rows: 3, modelValue: 'Late arrival expected.' } }, { props: { size: 'md', label: 'Notes', rows: 3, modelValue: 'Late arrival expected.' } }, { props: { size: 'lg', label: 'Notes', rows: 3, modelValue: 'Late arrival expected.' } }, { props: { size: 'xl', label: 'Notes', rows: 3, modelValue: 'Late arrival expected.' } }] },
    ],
  },
  {
    name: 'NumberInput',
    description: 'Numeric stepper with minus and plus buttons and min/max clamping. Supports a size prop: xs, sm, md (default), lg, xl.',
    variants: [
      { label: 'Guests', width: '220px', props: { label: 'Guests', modelValue: 2, min: 1, max: 9 } },
      { label: 'Step of 10', width: '220px', props: { label: 'Deposit, USD', modelValue: 100, step: 10, min: 0, max: 500, hint: 'Between 0 and 500' } },
      { label: 'Error', width: '220px', props: { label: 'Rooms', modelValue: 0, min: 0, error: 'At least one room is required' } },
      { label: 'Clearable (empty = null)', width: '220px', props: { label: 'Children', modelValue: null, placeholder: 'Optional', min: 0, max: 6, hint: 'Clear the field to emit null; values clamp to 0..6 on blur' } },
      { label: 'Sizes', width: '220px', items: [{ props: { size: 'xs', label: 'Guests', modelValue: 2, min: 1, max: 9 } }, { props: { size: 'sm', label: 'Guests', modelValue: 2, min: 1, max: 9 } }, { props: { size: 'md', label: 'Guests', modelValue: 2, min: 1, max: 9 } }, { props: { size: 'lg', label: 'Guests', modelValue: 2, min: 1, max: 9 } }, { props: { size: 'xl', label: 'Guests', modelValue: 2, min: 1, max: 9 } }] },
    ],
  },
  {
    name: 'PasswordInput',
    description: 'Password field with a show/hide toggle. Supports a size prop: xs, sm, md (default), lg, xl.',
    variants: [
      { label: 'Default', width: '360px', props: { label: 'Password', placeholder: 'Enter password', modelValue: '' } },
      { label: 'Filled with hint', width: '360px', props: { label: 'New password', hint: 'Minimum 8 characters', modelValue: 'secret-umrah-2026' } },
      { label: 'Error', width: '360px', props: { label: 'Password', error: 'Incorrect password', modelValue: 'wrong' } },
      { label: 'Sizes', width: '360px', items: [{ props: { size: 'xs', label: 'Password', modelValue: 'secret' } }, { props: { size: 'sm', label: 'Password', modelValue: 'secret' } }, { props: { size: 'md', label: 'Password', modelValue: 'secret' } }, { props: { size: 'lg', label: 'Password', modelValue: 'secret' } }, { props: { size: 'xl', label: 'Password', modelValue: 'secret' } }] },
    ],
  },
  {
    name: 'SearchInput',
    description: 'Search field with a clear button; fires onSearch on Enter. Supports a size prop: xs, sm, md (default), lg, xl.',
    variants: [
      { label: 'Empty', width: '360px', props: { placeholder: 'Search hotels, tours, guests', modelValue: '' } },
      { label: 'With query', width: '360px', props: { modelValue: 'Makkah Clock Tower' } },
      { label: 'Sizes', width: '360px', items: [{ props: { size: 'xs', modelValue: 'Makkah' } }, { props: { size: 'sm', modelValue: 'Makkah' } }, { props: { size: 'md', modelValue: 'Makkah' } }, { props: { size: 'lg', modelValue: 'Makkah' } }, { props: { size: 'xl', modelValue: 'Makkah' } }] },
    ],
  },
  {
    name: 'PhoneInput',
    description: 'Phone number field with a country-code selector; the value is an object with code and number. Supports a size prop: xs, sm, md (default), lg, xl.',
    variants: [
      { label: 'Default', width: '420px', props: { label: 'Phone', modelValue: { code: '+998', number: '' } } },
      { label: 'Filled', width: '420px', props: { label: 'WhatsApp number', modelValue: { code: '+966', number: '55 123 4567' } } },
      { label: 'Custom countries', width: '420px', props: { label: 'Phone', countries: [{ value: '+62', label: 'ID +62' }, { value: '+60', label: 'MY +60' }, { value: '+92', label: 'PK +92' }], modelValue: { code: '+60', number: '12 345 6789' } } },
      { label: 'Sizes', width: '420px', items: [{ props: { size: 'xs', label: 'Phone', modelValue: { code: '+998', number: '90 123 45 67' } } }, { props: { size: 'sm', label: 'Phone', modelValue: { code: '+998', number: '90 123 45 67' } } }, { props: { size: 'md', label: 'Phone', modelValue: { code: '+998', number: '90 123 45 67' } } }, { props: { size: 'lg', label: 'Phone', modelValue: { code: '+998', number: '90 123 45 67' } } }, { props: { size: 'xl', label: 'Phone', modelValue: { code: '+998', number: '90 123 45 67' } } }] },
    ],
  },
  {
    name: 'CodeInput',
    description: 'One-time code entry shown as separate digit cells. Supports a size prop: xs, sm, md (default), lg, xl.',
    variants: [
      { label: '6 digits', props: { label: 'Verification code', length: 6, modelValue: '482' } },
      { label: '4 digits', props: { label: 'PIN', length: 4, modelValue: '' } },
      { label: 'Sizes', items: [{ props: { size: 'xs', length: 6, modelValue: '482' } }, { props: { size: 'sm', length: 6, modelValue: '482' } }, { props: { size: 'md', length: 6, modelValue: '482' } }, { props: { size: 'lg', length: 6, modelValue: '482' } }, { props: { size: 'xl', length: 6, modelValue: '482' } }] },
    ],
  },
  {
    name: 'ChipInput',
    description: 'Tag input: type and press Enter or comma to add, Backspace to remove the last. Supports a size prop: xs, sm, md (default), lg, xl.',
    variants: [
      { label: 'With values', width: '420px', props: { label: 'Languages', modelValue: ['Arabic', 'English', 'Uzbek'] } },
      { label: 'Empty', width: '420px', props: { label: 'Keywords', placeholder: 'Type and press Enter', modelValue: [] } },
      { label: 'Max items', width: '420px', props: { label: 'Preferred cities', hint: 'Up to 3', maxItems: 3, modelValue: ['Makkah', 'Madinah'] } },
      { label: 'Sizes', width: '420px', items: [{ props: { size: 'xs', label: 'Languages', modelValue: ['Arabic', 'English'] } }, { props: { size: 'sm', label: 'Languages', modelValue: ['Arabic', 'English'] } }, { props: { size: 'md', label: 'Languages', modelValue: ['Arabic', 'English'] } }, { props: { size: 'lg', label: 'Languages', modelValue: ['Arabic', 'English'] } }, { props: { size: 'xl', label: 'Languages', modelValue: ['Arabic', 'English'] } }] },
    ],
  },
  {
    name: 'InlineEdit',
    description: 'Text that turns into an input on click; Enter saves, Escape cancels. Supports a size prop: xs, sm, md (default), lg, xl.',
    variants: [
      { label: 'With value', props: { modelValue: 'Ramadan Umrah 2027' } },
      { label: 'Empty', props: { modelValue: '', emptyText: 'Add a package title' } },
      { label: 'Sizes', items: [{ props: { size: 'xs', modelValue: 'Ramadan Umrah 2027' } }, { props: { size: 'sm', modelValue: 'Ramadan Umrah 2027' } }, { props: { size: 'md', modelValue: 'Ramadan Umrah 2027' } }, { props: { size: 'lg', modelValue: 'Ramadan Umrah 2027' } }, { props: { size: 'xl', modelValue: 'Ramadan Umrah 2027' } }] },
    ],
  },
  {
    name: 'RichEditor',
    description: 'Rich text editor with a formatting toolbar; the value is an HTML string. Supports a size prop: xs, sm, md (default), lg, xl.',
    variants: [
      { label: 'With content', width: '560px', props: { label: 'Package description', modelValue: '<p><b>7 nights</b> in Makkah and <i>4 nights</i> in Madinah.</p><ul><li>Direct flights</li><li>Visa support</li></ul>' } },
      { label: 'Empty', width: '560px', props: { label: 'Notes', placeholder: 'Describe the itinerary...', modelValue: '' } },
      { label: 'Sizes', width: '560px', items: [{ props: { size: 'xs', label: 'Description', modelValue: '<p><b>7 nights</b> in Makkah.</p>' } }, { props: { size: 'sm', label: 'Description', modelValue: '<p><b>7 nights</b> in Makkah.</p>' } }, { props: { size: 'md', label: 'Description', modelValue: '<p><b>7 nights</b> in Makkah.</p>' } }, { props: { size: 'lg', label: 'Description', modelValue: '<p><b>7 nights</b> in Makkah.</p>' } }, { props: { size: 'xl', label: 'Description', modelValue: '<p><b>7 nights</b> in Makkah.</p>' } }] },
    ],
  },
  {
    name: 'Select',
    description: 'Dropdown to pick a single option from a list. Supports a size prop: xs, sm, md (default), lg, xl.',
    variants: [
      { label: 'With value', width: '320px', props: { label: 'City', options: cities, modelValue: 'makkah' } },
      { label: 'Placeholder', width: '320px', props: { label: 'Destination', placeholder: 'Choose a city', options: cities, modelValue: '' } },
      { label: 'Disabled', width: '320px', items: [{ props: { label: 'Whole control', options: cities, modelValue: 'makkah', disabled: true } }, { props: { label: 'Disabled option', placeholder: 'Taif is unavailable', options: [...cities.slice(0, 3), { ...cities[3], disabled: true }], modelValue: '' } }] },
      { label: 'Sizes', width: '320px', items: [{ props: { size: 'xs', label: 'City', options: cities, modelValue: 'makkah' } }, { props: { size: 'sm', label: 'City', options: cities, modelValue: 'makkah' } }, { props: { size: 'md', label: 'City', options: cities, modelValue: 'makkah' } }, { props: { size: 'lg', label: 'City', options: cities, modelValue: 'makkah' } }, { props: { size: 'xl', label: 'City', options: cities, modelValue: 'makkah' } }] },
    ],
  },
  {
    name: 'MultiSelect',
    description: 'Dropdown that allows ticking several options. Supports a size prop: xs, sm, md (default), lg, xl.',
    variants: [
      { label: 'Selected', width: '320px', props: { label: 'Amenities', options: amenities, modelValue: ['wifi', 'shuttle'] } },
      { label: 'Empty', width: '320px', props: { label: 'Amenities', placeholder: 'Select amenities', options: amenities, modelValue: [] } },
      { label: 'Sizes', width: '320px', items: [{ props: { size: 'xs', label: 'Amenities', options: amenities, modelValue: ['wifi'] } }, { props: { size: 'sm', label: 'Amenities', options: amenities, modelValue: ['wifi'] } }, { props: { size: 'md', label: 'Amenities', options: amenities, modelValue: ['wifi'] } }, { props: { size: 'lg', label: 'Amenities', options: amenities, modelValue: ['wifi'] } }, { props: { size: 'xl', label: 'Amenities', options: amenities, modelValue: ['wifi'] } }] },
    ],
  },
  {
    name: 'GroupedSelect',
    description: 'Dropdown whose options are organised under group headings. Supports a size prop: xs, sm, md (default), lg, xl.',
    variants: [
      {
        label: 'Rooms by hotel',
        width: '340px',
        props: {
          label: 'Room',
          placeholder: 'Choose a room',
          modelValue: 'swiss-double',
          groups: [
            { label: 'Swissotel Makkah', options: [{ value: 'swiss-double', label: 'Double, Kaaba view' }, { value: 'swiss-suite', label: 'Junior suite' }] },
            { label: 'Anwar Al Madinah', options: [{ value: 'anwar-twin', label: 'Twin room' }, { value: 'anwar-family', label: 'Family room' }] },
          ],
        },
      },
      { label: 'Sizes', width: '340px', items: [{ props: { size: 'xs', label: 'Room', modelValue: 'swiss-double', groups: [{ label: 'Swissotel Makkah', options: [{ value: 'swiss-double', label: 'Double, Kaaba view' }] }] } }, { props: { size: 'sm', label: 'Room', modelValue: 'swiss-double', groups: [{ label: 'Swissotel Makkah', options: [{ value: 'swiss-double', label: 'Double, Kaaba view' }] }] } }, { props: { size: 'md', label: 'Room', modelValue: 'swiss-double', groups: [{ label: 'Swissotel Makkah', options: [{ value: 'swiss-double', label: 'Double, Kaaba view' }] }] } }, { props: { size: 'lg', label: 'Room', modelValue: 'swiss-double', groups: [{ label: 'Swissotel Makkah', options: [{ value: 'swiss-double', label: 'Double, Kaaba view' }] }] } }, { props: { size: 'xl', label: 'Room', modelValue: 'swiss-double', groups: [{ label: 'Swissotel Makkah', options: [{ value: 'swiss-double', label: 'Double, Kaaba view' }] }] } }] },
    ],
  },
  {
    name: 'Combobox',
    description: 'Searchable select: type to filter the options. Supports a size prop: xs, sm, md (default), lg, xl.',
    variants: [
      { label: 'Default', width: '340px', props: { label: 'Airport', placeholder: 'Search airport', modelValue: 'ruh', options: [{ value: 'jed', label: 'Jeddah (JED)' }, { value: 'med', label: 'Madinah (MED)' }, { value: 'ruh', label: 'Riyadh (RUH)' }, { value: 'tas', label: 'Tashkent (TAS)' }, { value: 'ist', label: 'Istanbul (IST)' }] } },
      { label: 'Empty', width: '340px', props: { label: 'Nationality', placeholder: 'Start typing', emptyText: 'Nothing found', modelValue: '', options: [{ value: 'uz', label: 'Uzbekistan' }, { value: 'kz', label: 'Kazakhstan' }, { value: 'tr', label: 'Turkey' }] } },
      { label: 'Sizes', width: '340px', items: [{ props: { size: 'xs', label: 'City', modelValue: 'makkah', options: cities } }, { props: { size: 'sm', label: 'City', modelValue: 'makkah', options: cities } }, { props: { size: 'md', label: 'City', modelValue: 'makkah', options: cities } }, { props: { size: 'lg', label: 'City', modelValue: 'makkah', options: cities } }, { props: { size: 'xl', label: 'City', modelValue: 'makkah', options: cities } }] },
    ],
  },
  {
    name: 'TreeSelect',
    description: 'Dropdown with a searchable, expandable tree of options. Supports a size prop: xs, sm, md (default), lg, xl.',
    variants: [
      {
        label: 'Regions',
        width: '340px',
        props: {
          label: 'Location',
          placeholder: 'Choose a location',
          modelValue: 'haram',
          nodes: [
            { id: 'makkah', label: 'Makkah', children: [{ id: 'haram', label: 'Near Haram' }, { id: 'aziziyah', label: 'Aziziyah' }] },
            { id: 'madinah', label: 'Madinah', children: [{ id: 'nabawi', label: 'Near Masjid an-Nabawi' }, { id: 'quba', label: 'Quba' }] },
          ],
        },
      },
      { label: 'Sizes', width: '340px', items: [{ props: { size: 'xs', label: 'Location', modelValue: 'haram', nodes: [{ id: 'makkah', label: 'Makkah', children: [{ id: 'haram', label: 'Near Haram' }] }] } }, { props: { size: 'sm', label: 'Location', modelValue: 'haram', nodes: [{ id: 'makkah', label: 'Makkah', children: [{ id: 'haram', label: 'Near Haram' }] }] } }, { props: { size: 'md', label: 'Location', modelValue: 'haram', nodes: [{ id: 'makkah', label: 'Makkah', children: [{ id: 'haram', label: 'Near Haram' }] }] } }, { props: { size: 'lg', label: 'Location', modelValue: 'haram', nodes: [{ id: 'makkah', label: 'Makkah', children: [{ id: 'haram', label: 'Near Haram' }] }] } }, { props: { size: 'xl', label: 'Location', modelValue: 'haram', nodes: [{ id: 'makkah', label: 'Makkah', children: [{ id: 'haram', label: 'Near Haram' }] }] } }] },
    ],
  },
  {
    name: 'PillSelect',
    description: 'Compact pill-shaped dropdown for quick filters. Supports a size prop: xs, sm, md (default), lg, xl.',
    variants: [
      { label: 'Default', props: { placeholder: 'Sort by', value: 'price', options: [{ value: 'price', label: 'Price' }, { value: 'rating', label: 'Rating' }, { value: 'distance', label: 'Distance' }] } },
      { label: 'Placeholder', props: { placeholder: 'Any city', value: '', options: cities } },
      { label: 'Sizes', items: [{ props: { size: 'xs', value: 'price', options: [{ value: 'price', label: 'Price' }, { value: 'rating', label: 'Rating' }] } }, { props: { size: 'sm', value: 'price', options: [{ value: 'price', label: 'Price' }, { value: 'rating', label: 'Rating' }] } }, { props: { size: 'md', value: 'price', options: [{ value: 'price', label: 'Price' }, { value: 'rating', label: 'Rating' }] } }, { props: { size: 'lg', value: 'price', options: [{ value: 'price', label: 'Price' }, { value: 'rating', label: 'Rating' }] } }, { props: { size: 'xl', value: 'price', options: [{ value: 'price', label: 'Price' }, { value: 'rating', label: 'Rating' }] } }] },
    ],
  },
  {
    name: 'Checkbox',
    description: 'Boolean checkbox with an inline label. Supports a size prop: xs, sm, md (default), lg, xl.',
    variants: [
      { label: 'States', items: [{ props: { label: 'Accept terms', modelValue: true } }, { props: { label: 'Subscribe to offers', modelValue: false } }] },
      { label: 'Disabled', items: [{ props: { label: 'Accept terms', modelValue: true, disabled: true } }, { props: { label: 'Subscribe to offers', modelValue: false, disabled: true } }] },
      { label: 'Sizes', items: [{ props: { size: 'xs', label: 'Accept terms', modelValue: true } }, { props: { size: 'sm', label: 'Accept terms', modelValue: true } }, { props: { size: 'md', label: 'Accept terms', modelValue: true } }, { props: { size: 'lg', label: 'Accept terms', modelValue: true } }, { props: { size: 'xl', label: 'Accept terms', modelValue: true } }] },
    ],
  },
  {
    name: 'Switch',
    description: 'On/off toggle for settings that apply immediately. Supports a size prop: xs, sm, md (default), lg, xl.',
    variants: [
      { label: 'States', items: [{ props: { label: 'Prayer reminders', modelValue: true } }, { props: { label: 'Email notifications', modelValue: false } }] },
      { label: 'Disabled', items: [{ props: { label: 'Prayer reminders', modelValue: true, disabled: true } }, { props: { label: 'Email notifications', modelValue: false, disabled: true } }] },
      { label: 'Sizes', items: [{ props: { size: 'xs', label: 'Prayer reminders', modelValue: true } }, { props: { size: 'sm', label: 'Prayer reminders', modelValue: true } }, { props: { size: 'md', label: 'Prayer reminders', modelValue: true } }, { props: { size: 'lg', label: 'Prayer reminders', modelValue: true } }, { props: { size: 'xl', label: 'Prayer reminders', modelValue: true } }] },
    ],
  },
  {
    name: 'RadioGroup',
    description: 'Choose exactly one of several options, with optional hints. Supports a size prop: xs, sm, md (default), lg, xl.',
    variants: [
      { label: 'Room type', width: '360px', props: { label: 'Room type', modelValue: 'double', options: [{ value: 'single', label: 'Single' }, { value: 'double', label: 'Double', hint: 'Best for couples' }, { value: 'family', label: 'Family', hint: 'Up to 5 guests' }] } },
      { label: 'Sizes', width: '360px', items: [{ props: { size: 'xs', label: 'Room type', modelValue: 'double', options: [{ value: 'single', label: 'Single' }, { value: 'double', label: 'Double', hint: 'Best for couples' }] } }, { props: { size: 'sm', label: 'Room type', modelValue: 'double', options: [{ value: 'single', label: 'Single' }, { value: 'double', label: 'Double', hint: 'Best for couples' }] } }, { props: { size: 'md', label: 'Room type', modelValue: 'double', options: [{ value: 'single', label: 'Single' }, { value: 'double', label: 'Double', hint: 'Best for couples' }] } }, { props: { size: 'lg', label: 'Room type', modelValue: 'double', options: [{ value: 'single', label: 'Single' }, { value: 'double', label: 'Double', hint: 'Best for couples' }] } }, { props: { size: 'xl', label: 'Room type', modelValue: 'double', options: [{ value: 'single', label: 'Single' }, { value: 'double', label: 'Double', hint: 'Best for couples' }] } }] },
    ],
  },
  {
    name: 'OptionCard',
    description: 'Selectable card with icon or image, title, description and price; used inside OptionCards. Supports a size prop: xs, sm, md (default), lg, xl.',
    variants: [
      { label: 'Single choice', width: '380px', items: [{ props: { title: 'Economy', desc: '3-star, 800 m from Haram', price: '$890', icon: 'bed-double', checked: true } }, { props: { title: 'Premium', desc: '5-star, Haram view', price: '$1 790', icon: 'crown', checked: false } }] },
      { label: 'Multiple', width: '380px', props: { title: 'Airport transfer', desc: 'Round trip, private car', price: '+$60', icon: 'car', multiple: true, checked: true } },
      { label: 'Sizes', width: '380px', items: [{ props: { size: 'xs', title: 'Premium', desc: '5-star, Haram view', price: '$1 790', icon: 'crown', checked: true } }, { props: { size: 'sm', title: 'Premium', desc: '5-star, Haram view', price: '$1 790', icon: 'crown', checked: true } }, { props: { size: 'md', title: 'Premium', desc: '5-star, Haram view', price: '$1 790', icon: 'crown', checked: true } }, { props: { size: 'lg', title: 'Premium', desc: '5-star, Haram view', price: '$1 790', icon: 'crown', checked: true } }, { props: { size: 'xl', title: 'Premium', desc: '5-star, Haram view', price: '$1 790', icon: 'crown', checked: true } }] },
    ],
  },
  {
    name: 'OptionCards',
    description: 'Grid of OptionCard items bound to a single or multiple value. Supports a size prop: xs, sm, md (default), lg, xl.',
    variants: [
      { label: 'Single', width: '640px', props: { label: 'Package', modelValue: 'standard', options: [{ value: 'economy', title: 'Economy', desc: '10 days, 3-star', price: '$890', icon: 'bed-single' }, { value: 'standard', title: 'Standard', desc: '10 days, 4-star', price: '$1 290', icon: 'bed-double' }, { value: 'premium', title: 'Premium', desc: '10 days, 5-star', price: '$1 890', icon: 'crown' }] } },
      { label: 'Multiple', width: '640px', props: { label: 'Extras', multiple: true, modelValue: ['transfer'], options: [{ value: 'transfer', title: 'Transfer', desc: 'Airport pickup', price: '+$60', icon: 'car' }, { value: 'guide', title: 'Guide', desc: 'Private guide', price: '+$120', icon: 'map' }, { value: 'sim', title: 'SIM card', desc: '20 GB data', price: '+$15', icon: 'smartphone' }] } },
      { label: 'Sizes', width: '640px', items: [{ props: { size: 'xs', label: 'Package', modelValue: 'standard', options: [{ value: 'economy', title: 'Economy', desc: '3-star', price: '$890', icon: 'bed-single' }, { value: 'standard', title: 'Standard', desc: '4-star', price: '$1 290', icon: 'bed-double' }] } }, { props: { size: 'sm', label: 'Package', modelValue: 'standard', options: [{ value: 'economy', title: 'Economy', desc: '3-star', price: '$890', icon: 'bed-single' }, { value: 'standard', title: 'Standard', desc: '4-star', price: '$1 290', icon: 'bed-double' }] } }, { props: { size: 'md', label: 'Package', modelValue: 'standard', options: [{ value: 'economy', title: 'Economy', desc: '3-star', price: '$890', icon: 'bed-single' }, { value: 'standard', title: 'Standard', desc: '4-star', price: '$1 290', icon: 'bed-double' }] } }, { props: { size: 'lg', label: 'Package', modelValue: 'standard', options: [{ value: 'economy', title: 'Economy', desc: '3-star', price: '$890', icon: 'bed-single' }, { value: 'standard', title: 'Standard', desc: '4-star', price: '$1 290', icon: 'bed-double' }] } }, { props: { size: 'xl', label: 'Package', modelValue: 'standard', options: [{ value: 'economy', title: 'Economy', desc: '3-star', price: '$890', icon: 'bed-single' }, { value: 'standard', title: 'Standard', desc: '4-star', price: '$1 290', icon: 'bed-double' }] } }] },
    ],
  },
  {
    name: 'Slider',
    description: 'Single-value range slider with a live value readout. Supports a size prop: xs, sm, md (default), lg, xl.',
    variants: [
      { label: 'Default', width: '360px', props: { label: 'Budget per night, USD', min: 50, max: 500, step: 10, modelValue: 180 } },
      { label: 'Without value', width: '360px', props: { label: 'Volume', showValue: false, modelValue: 60 } },
      { label: 'Sizes', width: '360px', items: [{ props: { size: 'xs', label: 'Budget, USD', min: 50, max: 500, step: 10, modelValue: 180 } }, { props: { size: 'sm', label: 'Budget, USD', min: 50, max: 500, step: 10, modelValue: 180 } }, { props: { size: 'md', label: 'Budget, USD', min: 50, max: 500, step: 10, modelValue: 180 } }, { props: { size: 'lg', label: 'Budget, USD', min: 50, max: 500, step: 10, modelValue: 180 } }, { props: { size: 'xl', label: 'Budget, USD', min: 50, max: 500, step: 10, modelValue: 180 } }] },
    ],
  },
  {
    name: 'RangeSlider',
    description: 'Two-handle slider for choosing a minimum and maximum. Supports a size prop: xs, sm, md (default), lg, xl.',
    variants: [
      { label: 'Price range', width: '400px', props: { label: 'Price per night', min: 0, max: 600, step: 10, modelValue: [120, 360] } },
      { label: 'Distance', width: '400px', props: { label: 'Distance to Haram, m', min: 0, max: 2000, step: 50, modelValue: [0, 800] } },
      { label: 'Sizes', width: '400px', items: [{ props: { size: 'xs', label: 'Price per night', min: 0, max: 600, step: 10, modelValue: [120, 360] } }, { props: { size: 'sm', label: 'Price per night', min: 0, max: 600, step: 10, modelValue: [120, 360] } }, { props: { size: 'md', label: 'Price per night', min: 0, max: 600, step: 10, modelValue: [120, 360] } }, { props: { size: 'lg', label: 'Price per night', min: 0, max: 600, step: 10, modelValue: [120, 360] } }, { props: { size: 'xl', label: 'Price per night', min: 0, max: 600, step: 10, modelValue: [120, 360] } }] },
    ],
  },
  {
    name: 'Rating',
    description: 'Star rating input; can be read-only for display. Supports a size prop: xs, sm, md (default), lg, xl.',
    variants: [
      { label: 'Interactive', props: { modelValue: 4 } },
      { label: 'Read only', props: { modelValue: 3, readonly: true } },
      { label: 'Large, 10 stars', props: { modelValue: 7, max: 10, size: 24 } },
      { label: 'Sizes', items: [{ props: { size: 'xs', modelValue: 4 } }, { props: { size: 'sm', modelValue: 4 } }, { props: { size: 'md', modelValue: 4 } }, { props: { size: 'lg', modelValue: 4 } }, { props: { size: 'xl', modelValue: 4 } }] },
    ],
  },
  {
    name: 'ColorPicker',
    description: 'Swatch picker for choosing a color from presets. Supports a size prop: xs, sm, md (default), lg, xl.',
    variants: [
      { label: 'Default presets', props: { label: 'Tag color', modelValue: '#BC926A' } },
      { label: 'Custom presets', props: { label: 'Brand color', presets: ['#0F766E', '#1D4ED8', '#B91C1C', '#CA8A04', '#4B5563'], modelValue: '#1D4ED8' } },
      { label: 'Sizes', items: [{ props: { size: 'xs', label: 'Tag color', modelValue: '#BC926A' } }, { props: { size: 'sm', label: 'Tag color', modelValue: '#BC926A' } }, { props: { size: 'md', label: 'Tag color', modelValue: '#BC926A' } }, { props: { size: 'lg', label: 'Tag color', modelValue: '#BC926A' } }, { props: { size: 'xl', label: 'Tag color', modelValue: '#BC926A' } }] },
    ],
  },
  {
    name: 'Calendar',
    description: 'Month calendar to pick a single date; days can carry event markers. Supports a size prop: xs, sm, md (default), lg, xl.',
    variants: [
      { label: 'Selected date', width: '340px', props: { modelValue: '2027-03-12' } },
      { label: 'With events', width: '340px', props: { modelValue: '2027-03-12', events: { '2027-03-05': 'Departure', '2027-03-20': 'Return flight', '2027-03-26': 'Eid' } } },
      { label: 'Sizes', width: '460px', items: [{ props: { size: 'xs', modelValue: '2027-03-12' } }, { props: { size: 'sm', modelValue: '2027-03-12' } }, { props: { size: 'md', modelValue: '2027-03-12' } }, { props: { size: 'lg', modelValue: '2027-03-12' } }, { props: { size: 'xl', modelValue: '2027-03-12' } }] },
    ],
  },
  {
    name: 'RangeCalendar',
    description: 'Calendar for selecting a start and end date, for example a stay. Supports a size prop: xs, sm, md (default), lg, xl.',
    variants: [
      { label: 'Default', width: '340px', props: { start: '2027-03-01' } },
      { label: 'Controlled range', width: '340px', props: { modelValue: ['2027-03-10', '2027-03-15'] } },
      { label: 'Week starts on Sunday', width: '340px', props: { start: '2027-03-01', weekStartsOn: 0 } },
      { label: 'Sizes', width: '460px', items: [{ props: { size: 'xs', start: '2027-03-01' } }, { props: { size: 'sm', start: '2027-03-01' } }, { props: { size: 'md', start: '2027-03-01' } }, { props: { size: 'lg', start: '2027-03-01' } }, { props: { size: 'xl', start: '2027-03-01' } }] },
    ],
  },
  {
    name: 'DatePicker',
    description: 'Date field that opens a calendar popover. Supports a size prop: xs, sm, md (default), lg, xl.',
    variants: [
      { label: 'Filled', width: '320px', props: { label: 'Check-in', modelValue: '2027-03-12' } },
      { label: 'Empty', width: '320px', props: { label: 'Check-out', placeholder: 'Select date', modelValue: '' } },
      { label: 'Error', width: '320px', props: { label: 'Departure', error: 'Date must be in the future', modelValue: '' } },
      { label: 'Sizes', width: '320px', items: [{ props: { size: 'xs', label: 'Check-in', modelValue: '2027-03-12' } }, { props: { size: 'sm', label: 'Check-in', modelValue: '2027-03-12' } }, { props: { size: 'md', label: 'Check-in', modelValue: '2027-03-12' } }, { props: { size: 'lg', label: 'Check-in', modelValue: '2027-03-12' } }, { props: { size: 'xl', label: 'Check-in', modelValue: '2027-03-12' } }] },
    ],
  },
  {
    name: 'TimePicker',
    description: 'Hour and minute selects producing an HH:MM string. Supports a size prop: xs, sm, md (default), lg, xl.',
    variants: [
      { label: 'Default', width: '260px', props: { label: 'Pickup time', modelValue: '09:30' } },
      { label: 'Evening', width: '260px', props: { label: 'Flight departure', modelValue: '21:45' } },
      { label: 'Sizes', width: '260px', items: [{ props: { size: 'xs', label: 'Pickup time', modelValue: '09:30' } }, { props: { size: 'sm', label: 'Pickup time', modelValue: '09:30' } }, { props: { size: 'md', label: 'Pickup time', modelValue: '09:30' } }, { props: { size: 'lg', label: 'Pickup time', modelValue: '09:30' } }, { props: { size: 'xl', label: 'Pickup time', modelValue: '09:30' } }] },
    ],
  },
  {
    name: 'FileUpload',
    description: 'Drop zone for choosing one or several files. Supports a size prop: xs, sm, md (default), lg, xl.',
    variants: [
      { label: 'Documents', width: '420px', props: { label: 'Passport copy', title: 'Drop files here or browse', hint: 'PDF, JPG up to 10 MB', accept: '.pdf,.jpg,.png' } },
      { label: 'Images, multiple', width: '420px', props: { label: 'Hotel photos', image: true, multiple: true, title: 'Upload photos', hint: 'JPG or PNG, up to 20 files', accept: 'image/*' } },
      { label: 'Accept and maxSize (2 MB)', width: '420px', props: { label: 'Visa scan', title: 'Drop the scan here or browse', hint: 'PDF or JPG up to 2 MB; others are rejected via onReject', accept: '.pdf,image/jpeg', maxSize: 2097152 } },
      { label: 'Sizes', width: '420px', items: [{ props: { size: 'xs', label: 'Passport copy', hint: 'PDF, JPG up to 10 MB' } }, { props: { size: 'sm', label: 'Passport copy', hint: 'PDF, JPG up to 10 MB' } }, { props: { size: 'md', label: 'Passport copy', hint: 'PDF, JPG up to 10 MB' } }, { props: { size: 'lg', label: 'Passport copy', hint: 'PDF, JPG up to 10 MB' } }, { props: { size: 'xl', label: 'Passport copy', hint: 'PDF, JPG up to 10 MB' } }] },
    ],
  },
  {
    name: 'ImageUpload',
    description: 'Square or round image picker that previews the chosen file. Supports a size prop: xs, sm, md (default), lg, xl.',
    variants: [
      { label: 'Square', props: { label: 'Cover image', hint: 'Upload cover', size: 200, aspect: '4/3' } },
      { label: 'Circle avatar', props: { label: 'Avatar', shape: 'circle', hint: 'Photo', size: 140 } },
      { label: 'Sizes', width: '260px', items: [{ props: { size: 'xs', label: 'Cover', hint: 'Upload' } }, { props: { size: 'sm', label: 'Cover', hint: 'Upload' } }, { props: { size: 'md', label: 'Cover', hint: 'Upload' } }, { props: { size: 'lg', label: 'Cover', hint: 'Upload' } }, { props: { size: 'xl', label: 'Cover', hint: 'Upload' } }] },
    ],
  },
  {
    name: 'FormField',
    description: 'Label, required marker and hint/error wrapper around any control. Supports a size prop: xs, sm, md (default), lg, xl.',
    variants: [
      { label: 'Required with hint', width: '360px', props: { label: 'Passport number', required: true, hint: 'As printed on the data page' }, children: [{ name: 'TextField', props: { placeholder: 'A12345678' } }] },
      { label: 'Error', width: '360px', props: { label: 'Nationality', required: true, error: 'This field is required' }, children: [{ name: 'TextField', props: { placeholder: 'Select nationality' } }] },
      { label: 'Sizes', width: '360px', items: [{ props: { size: 'xs', label: 'Passport number', required: true, hint: 'As printed on the data page' }, children: [{ name: 'TextField', props: { placeholder: 'A12345678' } }] }, { props: { size: 'sm', label: 'Passport number', required: true, hint: 'As printed on the data page' }, children: [{ name: 'TextField', props: { placeholder: 'A12345678' } }] }, { props: { size: 'md', label: 'Passport number', required: true, hint: 'As printed on the data page' }, children: [{ name: 'TextField', props: { placeholder: 'A12345678' } }] }, { props: { size: 'lg', label: 'Passport number', required: true, hint: 'As printed on the data page' }, children: [{ name: 'TextField', props: { placeholder: 'A12345678' } }] }, { props: { size: 'xl', label: 'Passport number', required: true, hint: 'As printed on the data page' }, children: [{ name: 'TextField', props: { placeholder: 'A12345678' } }] }] },
    ],
  },
  {
    name: 'ValidatedField',
    description: 'Text or password field that validates on blur-style input using a rules array of functions returning true or an error message. Supports a size prop: xs, sm, md (default), lg, xl.',
    variants: [
      { label: 'Default', width: '360px', props: { label: 'Email', icon: 'mail', placeholder: 'name@example.com', modelValue: '' } },
      { label: 'Password', width: '360px', props: { label: 'Password', type: 'password', modelValue: 'secret' } },
      { label: 'External error', width: '360px', props: { label: 'Username', error: 'Username is already taken', modelValue: 'ahmad' } },
      { label: 'Sizes', width: '360px', items: [{ props: { size: 'xs', label: 'Email', icon: 'mail', modelValue: 'guest@ziyarago.com' } }, { props: { size: 'sm', label: 'Email', icon: 'mail', modelValue: 'guest@ziyarago.com' } }, { props: { size: 'md', label: 'Email', icon: 'mail', modelValue: 'guest@ziyarago.com' } }, { props: { size: 'lg', label: 'Email', icon: 'mail', modelValue: 'guest@ziyarago.com' } }, { props: { size: 'xl', label: 'Email', icon: 'mail', modelValue: 'guest@ziyarago.com' } }] },
    ],
  },
  {
    name: 'LoginForm',
    description: 'Ready sign-in form with email, password, remember-me and forgot-password link. Supports a size prop: xs, sm, md (default), lg, xl.',
    variants: [
      { label: 'Default', width: '380px', props: {} },
      { label: 'Error', width: '380px', props: { error: 'Invalid email or password' } },
      { label: 'Loading', width: '380px', props: { loading: true, submitLabel: 'Log in', showForgot: false } },
      { label: 'Sizes', width: '380px', items: [{ props: { size: 'xs' } }, { props: { size: 'sm' } }, { props: { size: 'md' } }, { props: { size: 'lg' } }, { props: { size: 'xl' } }] },
    ],
  },
  {
    name: 'StepForm',
    description: 'Multi-step form with a Stepper header and Back/Next buttons; each step provides its own content. Supports a size prop: xs, sm, md (default), lg, xl.',
    variants: [
      {
        label: 'Booking flow',
        width: '520px',
        props: {
          finishLabel: 'Confirm booking',
          steps: [
            { label: 'Guests', content: 'Step 1: enter traveller details.' },
            { label: 'Room', content: 'Step 2: choose a room type.' },
            { label: 'Payment', content: 'Step 3: review the total and pay.' },
          ],
        },
      },
      { label: 'Sizes', width: '520px', items: [{ props: { size: 'xs', finishLabel: 'Confirm booking', steps: [{ label: 'Guests', content: 'Step 1.' }, { label: 'Room', content: 'Step 2.' }] } }, { props: { size: 'sm', finishLabel: 'Confirm booking', steps: [{ label: 'Guests', content: 'Step 1.' }, { label: 'Room', content: 'Step 2.' }] } }, { props: { size: 'md', finishLabel: 'Confirm booking', steps: [{ label: 'Guests', content: 'Step 1.' }, { label: 'Room', content: 'Step 2.' }] } }, { props: { size: 'lg', finishLabel: 'Confirm booking', steps: [{ label: 'Guests', content: 'Step 1.' }, { label: 'Room', content: 'Step 2.' }] } }, { props: { size: 'xl', finishLabel: 'Confirm booking', steps: [{ label: 'Guests', content: 'Step 1.' }, { label: 'Room', content: 'Step 2.' }] } }] },
    ],
  },
  {
    name: 'Stepper',
    description: 'Horizontal progress indicator for a sequence of steps. Supports a size prop: xs, sm, md (default), lg, xl.',
    variants: [
      { label: 'In progress', props: { steps: ['Search', 'Select hotel', 'Guests', 'Payment'], current: 2 } },
      { label: 'Start', props: { steps: ['Details', 'Review', 'Done'], current: 0 } },
      { label: 'Complete', props: { steps: ['Details', 'Review', 'Done'], current: 3 } },
      { label: 'Sizes', items: [{ props: { size: 'xs', steps: ['Search', 'Hotel', 'Pay'], current: 1 } }, { props: { size: 'sm', steps: ['Search', 'Hotel', 'Pay'], current: 1 } }, { props: { size: 'md', steps: ['Search', 'Hotel', 'Pay'], current: 1 } }, { props: { size: 'lg', steps: ['Search', 'Hotel', 'Pay'], current: 1 } }, { props: { size: 'xl', steps: ['Search', 'Hotel', 'Pay'], current: 1 } }] },
    ],
  },
]
export default examples
