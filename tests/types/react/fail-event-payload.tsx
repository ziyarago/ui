import { UiPagination } from '@ziyarago/ui/react';
// @expect: string
export const a = <UiPagination page={1} pages={3} onChange={(p: string) => p.length} />;
