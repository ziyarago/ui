import typography from './typography.js';
import layout from './layout.js';
import actions from './actions.js';
import forms from './forms.js';
import data from './data.js';
import feedback from './feedback.js';
import overlay from './overlay.js';
import navigation from './navigation.js';
import media from './media.js';
import domain from './domain.js';
import pages from './pages.js';

export const meta = { ...typography, ...layout, ...actions, ...forms, ...data, ...feedback, ...overlay, ...navigation, ...media, ...domain, ...pages };
import { PRO_NAMES } from './tiers.js';
import { GROUPS } from './groups.js';
/** Extension API: adds API metadata for plugin components. `tiers` marks names as Pro, `groups` ({ id, title, blurb, names }) lists them in the manifest. */
export function registerMeta(extra, { tiers, groups } = {}) {
  Object.assign(meta, extra);
  for (const n of tiers || []) PRO_NAMES.add(n);
  for (const g of groups || []) {
    const ex = GROUPS.find(x => x.id === g.id);
    if (ex) ex.names.push(...g.names.filter(n => !ex.names.includes(n)));
    else GROUPS.push({ blurb: '', title: g.id, ...g, names: [...g.names] });
  }
  return meta;
}
export default meta;
