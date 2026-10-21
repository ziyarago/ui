// Fake add-on package used to prove the extension API: two components, one built on C.Button.
export const defs = {
  FakeBadge: { render: ({ h, props }) => h('span', { class: 'fake-badge' }, props.label ?? 'badge') },
  FakeAction: { render: ({ C, h, props }) => h('div', { class: 'fake-action' }, h(C.Button, { variant: 'primary' }, props.label ?? 'go'), h(C.FakeBadge, { label: 'inner' })) },
};
export const meta = {
  FakeBadge: { description: 'Fake badge', props: { label: { type: 'string', description: 'Text' } } },
  FakeAction: { description: 'Fake action built on Button', props: { label: { type: 'string', description: 'Text' } } },
};
export const names = Object.keys(defs);
