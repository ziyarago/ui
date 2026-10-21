import { UiCard } from '@ziyarago/ui/react';
// @expect: 'a' does not exist
export const a = <UiCard title="x" actions={{ a: 1 }}>x</UiCard>;
