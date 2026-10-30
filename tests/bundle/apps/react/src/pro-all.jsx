// Isolated bundle audit (Pro): the whole namespace is used, so every Pro component stays in.
import { createElement as h } from 'react';
import { createRoot } from 'react-dom/client';
import * as PRO from '@ziyarago/ui-pro/react';
window.__all = PRO;
createRoot(document.getElementById('app')).render(h('div', null, 'all'));
