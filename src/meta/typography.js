// API metadata for the typography group. Format: see src/meta/README.md
const SIZES = ['xs', 'sm', 'md', 'lg', 'xl'];
const sizeProp = (def = 'md', desc = 'Component size.') => ({ type: "'xs' | 'sm' | 'md' | 'lg' | 'xl'", values: SIZES, default: def, description: desc });

export default {
  Heading: {
    description: 'Semantic heading h1-h6 with a responsive type scale; use for page and section titles.',
    props: {
      level: { type: '1 | 2 | 3 | 4 | 5 | 6', values: [1, 2, 3, 4, 5, 6], default: 2, description: 'HTML heading level (h1-h6). Clamped to 1-6.' },
      size: { type: "'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'", values: ['xs', 'sm', 'md', 'lg', 'xl', '2xl'], default: 'lg', description: 'Visual size, independent of the semantic level.' },
      brand: { type: 'boolean', default: false, description: 'Colors the heading with the brand text color.' },
    },
    slots: { default: 'Heading content.' },
    notes: ['Pick level for document structure and size for looks; they are independent.'],
  },
  Text: {
    description: 'Body text paragraph (or any inline/block tag via as) with size, tone and truncation.',
    props: {
      as: { type: 'string', default: 'p', description: 'HTML tag to render, for example span, div, label.' },
      size: { type: "'xs' | 'sm' | 'md' | 'lg' | 'xl'", values: SIZES, default: 'md', description: 'Font size: xs 12px, sm 14px, md 16px, lg 18px, xl 20px.' },
      tone: { type: "'muted' | 'subtle' | 'brand'", values: ['muted', 'subtle', 'brand'], description: 'Text color. Omit for the primary text color.' },
      bold: { type: 'boolean', default: false, description: 'Semi-bold weight.' },
      truncate: { type: 'boolean', default: false, description: 'Single line with ellipsis overflow.' },
    },
    slots: { default: 'Text content.' },
    notes: ['truncate needs a parent with a constrained width (for example min-width: 0 in a flex row).'],
  },
  Code: {
    description: 'Code block with a header (title or language) and a copy button; use for snippets and commands.',
    props: {
      code: { type: 'string', required: true, description: 'Source text shown in the block and copied by the button.' },
      title: { type: 'string', description: 'Header label. Takes priority over language.' },
      language: { type: 'string', description: 'Header label when no title is given. Display only, no syntax highlighting.' },
      size: sizeProp('md', 'Block padding and font size.'),
    },
    notes: ['The header falls back to the text "code" when neither title nor language is set.', 'No syntax highlighting: the code is rendered as plain monospace text.'],
  },
  Kbd: {
    description: 'Keyboard key cap for shortcuts such as Ctrl or K.',
    props: {
      size: sizeProp('md', 'Key cap size.'),
    },
    slots: { default: 'Key label.' },
    notes: ['Render one Kbd per key and combine them in a row for chords.'],
  },
  Link: {
    description: 'Styled anchor for in-text and standalone links, with optional external-link behavior.',
    props: {
      href: { type: 'string', default: '#', description: 'Link target.' },
      external: { type: 'boolean', default: false, description: 'Opens in a new tab with rel="noopener noreferrer" and shows an external-link icon.' },
      plain: { type: 'boolean', default: false, description: 'Removes the underline styling.' },
      size: sizeProp('md', 'Font size relative to the surrounding text (0.8em to 1.25em).'),
    },
    events: { click: 'Native click event.' },
    slots: { default: 'Link content.' },
    notes: ['Without href the link points to "#"; for SPA routing use onClick and prevent default.'],
  },
};
