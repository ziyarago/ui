import type { Example } from '../types'

const examples: Example[] = [
  {
    name: 'Heading',
    description: 'Semantic heading with independent level (h1-h6) and visual size.',
    variants: [
      { label: 'Sizes', items: [{ props: { size: 'xs' }, text: 'Extra small' }, { props: { size: 'sm' }, text: 'Small' }, { props: { size: 'md' }, text: 'Medium' }, { props: { size: 'lg' }, text: 'Large' }, { props: { size: 'xl' }, text: 'Extra large' }] },
      { label: 'Brand color', props: { level: 1, size: 'lg', brand: true }, text: 'Umrah packages 2026' },
      { label: 'Level vs size', items: [{ props: { level: 3, size: 'lg' }, text: 'An h3 styled large' }, { props: { level: 1, size: 'sm' }, text: 'An h1 styled small' }] },
    ],
  },
  {
    name: 'Text',
    description: 'Body text with size, tone and weight options. Size prop: xs, sm, md, lg, xl.',
    variants: [
      { label: 'Sizes', width: '420px', items: [{ props: { size: 'xs' }, text: 'Text in this size' }, { props: { size: 'sm' }, text: 'Text in this size' }, { props: { size: 'md' }, text: 'Text in this size' }, { props: { size: 'lg' }, text: 'Text in this size' }, { props: { size: 'xl' }, text: 'Text in this size' }] },
      { label: 'Sizes', width: '420px', items: [{ props: { size: 'xs' }, text: 'Extra small text' }, { props: { size: 'sm' }, text: 'Small text' }, { props: { size: 'md' }, text: 'Medium text' }, { props: { size: 'lg' }, text: 'Large text' }] },
      { label: 'Tones', width: '420px', items: [{ props: {}, text: 'Default tone' }, { props: { tone: 'muted' }, text: 'Muted tone' }, { props: { tone: 'subtle' }, text: 'Subtle tone' }, { props: { tone: 'brand' }, text: 'Brand tone' }, { props: { bold: true }, text: 'Bold text' }] },
      { label: 'Truncate', width: '260px', props: { truncate: true }, text: 'Makkah Clock Royal Tower, 5 star hotel with direct Haram view and breakfast included' },
    ],
  },
  {
    name: 'Code',
    description: 'Code block with a title bar and a copy button. Size prop: xs, sm, md, lg, xl.',
    variants: [
      { label: 'Sizes', width: '460px', items: [{ props: { size: 'xs', code: 'npm install @ziyarago/ui', title: 'install.sh' } }, { props: { size: 'sm', code: 'npm install @ziyarago/ui', title: 'install.sh' } }, { props: { size: 'md', code: 'npm install @ziyarago/ui', title: 'install.sh' } }, { props: { size: 'lg', code: 'npm install @ziyarago/ui', title: 'install.sh' } }, { props: { size: 'xl', code: 'npm install @ziyarago/ui', title: 'install.sh' } }] },
      { label: 'Snippet', width: '460px', props: { title: 'install.sh', code: 'npm install @ziyarago/ui\nnpm run dev' } },
      { label: 'Language label', width: '460px', props: { language: 'json', code: '{\n  "hotel": "Swissotel Makkah",\n  "nights": 7\n}' } },
    ],
  },
  {
    name: 'Kbd',
    description: 'Keyboard key cap for showing shortcuts. Size prop: xs, sm, md, lg, xl.',
    variants: [
      { label: 'Sizes', items: [{ props: { size: 'xs' }, text: 'Ctrl' }, { props: { size: 'sm' }, text: 'Ctrl' }, { props: { size: 'md' }, text: 'Ctrl' }, { props: { size: 'lg' }, text: 'Ctrl' }, { props: { size: 'xl' }, text: 'Ctrl' }] },
      { label: 'Keys', items: [{ text: 'Ctrl' }, { text: 'K' }, { text: 'Esc' }, { text: 'Enter' }] },
      { label: 'Single', text: '⌘' },
    ],
  },
  {
    name: 'Link',
    description: 'Inline anchor with an optional plain style and external icon. Size prop: xs, sm, md, lg, xl.',
    variants: [
      { label: 'Sizes', items: [{ props: { size: 'xs', href: '#' }, text: 'View itinerary' }, { props: { size: 'sm', href: '#' }, text: 'View itinerary' }, { props: { size: 'md', href: '#' }, text: 'View itinerary' }, { props: { size: 'lg', href: '#' }, text: 'View itinerary' }, { props: { size: 'xl', href: '#' }, text: 'View itinerary' }] },
      { label: 'Default', props: { href: '#' }, text: 'View itinerary' },
      { label: 'Plain', props: { href: '#', plain: true }, text: 'Plain link without underline' },
      { label: 'External', props: { href: 'https://example.com', external: true }, text: 'Visa requirements' },
    ],
  },
]
export default examples
