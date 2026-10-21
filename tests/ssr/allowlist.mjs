// Everything here is intentional; every entry needs a reason.

// Text that looks like a leak. { component: name or '*', re: tested against the surrounding snippet, reason }
export const ALLOW = [
  { component: 'NumberInput', re: /emit null/, reason: 'hint text of the "Clearable" example says "Clear the field to emit null"' },
];

// Components that legitimately render nothing on the server.
export const EMPTY_OK = {
  Portal: 'moves its children into document.body; there is no document during SSR',
};
