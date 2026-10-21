import { useState } from 'react';
import { UiButton, UiCard, UiSelect, UiDataTable, UiCheckbox, UiPagination, UiAppShell, UiModal, UiTextField, type UiButtonProps } from '@ziyarago/ui/react';

const props: UiButtonProps = { variant: 'primary', size: 'lg' };

export function Page() {
  const [sel, setSel] = useState<string | number>('x');
  const [on, setOn] = useState(false);
  const [name, setName] = useState('');
  return (
    <>
      <UiButton {...props} tone="success" onClick={(e: React.MouseEvent<HTMLElement>) => e.preventDefault()}>Save</UiButton>
      <UiCard title="Hi" actions={<UiButton size="sm">Act</UiButton>}>body</UiCard>
      <UiSelect options={[{ value: 'x', label: 'X' }]} modelValue={sel} onChange={(v) => setSel(v)} />
      <UiCheckbox modelValue={on} onChange={setOn} />
      <UiTextField modelValue={name} onChange={setName} label="Name" />
      <UiPagination page={1} pages={4} onChange={(p) => p.toFixed()} />
      <UiDataTable columns={[{ key: 'a', label: 'A' }]} rows={[{ id: 1 }]} onSort={(k, d) => `${k}${d}`} onSelect={(ids) => ids.length} />
      <UiAppShell nav="side" items={[{ value: 'h', label: 'Home' }]} brand={<b>Z</b>} />
      <UiModal open={on} title="T" onClose={() => setOn(false)}>content</UiModal>
    </>
  );
}
