// Isolated bundle audit: one component. Nothing else of the kit may end up in this bundle.
import { createElement as h } from 'react';
import { createRoot } from 'react-dom/client';
import { UiButton } from '@ziyarago/ui/react';
createRoot(document.getElementById('app')).render(h(UiButton, { variant: 'primary' }, 'Button'));
