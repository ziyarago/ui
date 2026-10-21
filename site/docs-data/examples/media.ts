import type { Example } from '../types'

const SZ = ['xs', 'sm', 'md', 'lg', 'xl']
const sizes = (props: Record<string, any>, extra: Record<string, any> = {}) => SZ.map(size => ({ props: { ...props, size }, ...extra }))

const photos = ['/3d/kaaba.png', '/3d/hotel.png', '/3d/mosque.png', '/3d/tour360.png']

const examples: Example[] = [
  {
    name: 'Avatar',
    description: 'Circular user picture that falls back to initials. The size prop (xs, sm, md, lg, xl) sets the diameter (24 / 32 / 40 / 56 / 72 px; a number in px still works).',
    variants: [
      { label: 'Initials', items: [{ props: { name: 'Ahmed Khan' } }, { props: { name: 'Fatima Noor', size: 56 } }, { props: { name: 'Yusuf', size: 72 } }] },
      { label: 'Image', items: [{ props: { name: 'Guide', src: '/3d/guide.png', size: 64 } }] },
      { label: 'Sizes', items: sizes({ name: 'Ahmed Khan' }) },
    ],
  },
  {
    name: 'Icon',
    description: 'Renders a named icon from the built-in set at any size. The size prop (xs, sm, md, lg, xl, or a number in px) sets the icon size.',
    variants: [
      { label: 'Set', items: ['plane', 'hotel', 'map-pin', 'calendar', 'users', 'star', 'bell', 'heart'].map(name => ({ props: { name, size: 28 } })) },
      { label: 'Sizes', items: sizes({ name: 'landmark' }) },
      { label: 'Pixel sizes', items: [16, 24, 32, 48].map(size => ({ props: { name: 'landmark', size } })) },
    ],
  },
  {
    name: 'LazyImage',
    description: 'Image placeholder with a fixed aspect ratio and rounded corners.',
    variants: [
      { label: '16:9', width: '420px', props: { src: '/3d/kaaba.png', alt: 'Kaaba', aspectRatio: '16/9' } },
      { label: 'Square, small radius', width: '240px', props: { src: '/3d/hotel.png', alt: 'Hotel', aspectRatio: '1/1', rounded: 8 } },
    ],
  },
  {
    name: 'Gallery',
    description: 'Large preview with a thumbnail strip and a photo counter. The size prop (xs, sm, md, lg, xl) sets the thumbnail size.',
    variants: [
      { label: 'Controlled index', width: '520px', props: { images: photos, index: 2, alt: 'Hotel photos' } },
      { label: 'Empty', width: '520px', props: { images: [], alt: 'No photos' } },
      { label: 'Hotel photos', width: '520px', props: { images: photos, alt: 'Hotel photos' } },
      { label: 'Sizes', width: '420px', items: sizes({ images: photos, alt: 'Hotel photos' }) },
    ],
  },
  {
    name: 'Carousel',
    description: 'Slideshow with arrows, dots and a caption over each slide. The size prop (xs, sm, md, lg, xl) sets the slide height and caption size.',
    variants: [
      {
        label: 'Autoplay (3.5 s, pauses on hover and focus)',
        width: '520px',
        props: {
          autoplay: 3500,
          items: [
            { image: '/3d/kaaba.png', title: 'Umrah Classic', sub: '10 nights, Makkah and Madinah' },
            { image: '/3d/mosque.png', title: 'Madinah Ziyarat', sub: 'Guided city tour' },
            { image: '/3d/plane.png', title: 'Direct flights', sub: 'Tashkent to Jeddah' },
          ],
        },
      },
      { label: 'Controlled index', width: '520px', props: { index: 1, items: [{ image: '/3d/kaaba.png', title: 'Umrah Classic' }, { image: '/3d/mosque.png', title: 'Madinah Ziyarat' }, { image: '/3d/plane.png', title: 'Direct flights' }] } },
      { label: 'Empty', width: '520px', props: { items: [] } },
      {
        label: 'Featured tours',
        width: '520px',
        props: {
          items: [
            { image: '/3d/kaaba.png', title: 'Umrah Classic', sub: '10 nights, Makkah and Madinah' },
            { image: '/3d/mosque.png', title: 'Madinah Ziyarat', sub: 'Guided city tour' },
            { image: '/3d/plane.png', title: 'Direct flights', sub: 'Tashkent to Jeddah' },
          ],
        },
      },
      { label: 'Sizes', width: '420px', items: sizes({ items: [{ image: '/3d/kaaba.png', title: 'Umrah Classic', sub: '10 nights' }, { image: '/3d/mosque.png', title: 'Madinah Ziyarat', sub: 'Guided tour' }] }) },
    ],
  },
  {
    name: 'Map',
    description: 'Pannable tile map with zoom buttons and clickable markers.',
    variants: [
      { label: 'Makkah markers', width: '620px', props: { lat: 21.4225, lon: 39.8262, zoom: 14, height: 340, markers: [{ lat: 21.4225, lon: 39.8262, label: 'Masjid al-Haram', icon: 'landmark', tone: 'brand' }, { lat: 21.4189, lon: 39.8265, label: 'Hilton Makkah', icon: 'hotel', tone: 'sky' }] } },
    ],
  },
  {
    name: 'ProfileHeader',
    description: 'Profile card with a cover image, a large avatar, a name and meta chips.',
    variants: [
      { label: 'Guide profile', props: { name: 'Fatima Noor', src: '/3d/guide.png', cover: '/3d/kaaba.png', meta: [{ icon: 'map-pin', label: 'Makkah' }, { icon: 'languages', label: 'English, Uzbek' }, { icon: 'star', label: '4.9 rating' }] } },
    ],
  },
  {
    name: 'ChatAi',
    description: 'Assistant chat with a message log, a typing indicator and an input.',
    variants: [
      {
        label: 'Conversation',
        width: '420px',
        props: {
          title: 'ZiyaraGo Assistant',
          subtitle: 'Ask about packages',
          placeholder: 'Ask about your trip...',
          messages: [
            { role: 'user', text: 'Which package includes a hotel near the Haram?' },
            { role: 'ai', text: 'The Premium Umrah package includes a 5-star hotel 100 m from the Haram.' },
          ],
        },
      },
      { label: 'Typing', width: '420px', props: { title: 'Assistant', loading: true, messages: [{ role: 'user', text: 'What is the visa deadline?' }] } },
    ],
  },
]
export default examples
