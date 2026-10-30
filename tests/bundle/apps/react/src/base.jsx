// Size baseline of the isolated bundle audit: the same React app without the kit.
import { createElement as h } from 'react';
import { createRoot } from 'react-dom/client';
createRoot(document.getElementById('app')).render(h('div', null, 'base'));
