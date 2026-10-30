// Isolated bundle audit: the whole namespace is used, so every component stays in.
import { createElement as h } from 'react';
import { createRoot } from 'react-dom/client';
import * as UI from '@ziyarago/ui/react';
window.__all = UI;
createRoot(document.getElementById('app')).render(h('div', null, 'all'));
