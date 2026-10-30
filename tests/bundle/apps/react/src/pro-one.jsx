// Isolated bundle audit (Pro): one Pro component. No other Pro component and no free component it does not depend on may end up in this bundle.
import { createElement as h } from 'react';
import { createRoot } from 'react-dom/client';
import { UiLineChart } from '@ziyarago/ui-pro/react';
createRoot(document.getElementById('app')).render(h(UiLineChart, { label: 'Revenue', series: [{ key: 'a', label: 'A', data: [{ x: '2025-01-01', y: 3 }, { x: '2025-01-02', y: 5 }] }] }));
