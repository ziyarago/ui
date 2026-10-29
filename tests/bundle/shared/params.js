export const params = typeof location === 'undefined' ? {} : Object.fromEntries(new URLSearchParams(location.search));
