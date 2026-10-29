import React, { Component, createElement } from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import { flushSync } from 'react-dom';
import '../shared/style.css';
import { Preview } from '../../lib/preview-react.js';
import { useUiTheme } from '../../../src/react/index.js';
import { params, report, load, finish, state } from '../shared/page.js';

const theme = useUiTheme();
if (params.theme) theme.setTheme(params.theme);
if (params.dir) theme.setDir(params.dir);
if (params.palette) theme.setPalette(params.palette);
if (params.motion) theme.setMotion(params.motion);

class Boundary extends Component {
  constructor(p) { super(p); this.state = { err: null }; }
  static getDerivedStateFromError(err) { return { err }; }
  componentDidCatch(err) { report(this.props.it.name, this.props.it.idx, err); }
  render() { return this.state.err ? <pre data-error="">{String(this.state.err.message)}</pre> : this.props.children; }
}

const items = await load();
for (const it of items) {
  state.current = it.name + '#' + it.idx;
  const el = <Preview name={it.name} variant={it.variant} open={it.open} />;
  try {
    if (params.hydrate) flushSync(() => hydrateRoot(it.container, el, { onRecoverableError: err => { console.error('Hydration/recoverable error: ' + err.message); report(it.name, it.idx, err); } }));
    else flushSync(() => createRoot(it.container).render(<Boundary it={it}>{el}</Boundary>));
  } catch (err) { report(it.name, it.idx, err); }
  state.mounted++;
}
await new Promise(r => setTimeout(r, 1000));
finish();

// Mount API for scripted flows (tests/behaviour/flows.mjs): mount a docs-format variant, swap it, unmount it.
let flowId = 0;
const flows = new Map();
window.__zgMount = (name, variant, open) => {
  const id = ++flowId, el = document.createElement('div');
  el.setAttribute('data-flow', String(id));
  document.getElementById('root').append(el);
  const root = createRoot(el);
  const view = v => <Boundary it={{ name, idx: id }}><Preview name={name} variant={v} open={!!open} /></Boundary>;
  flushSync(() => root.render(view(variant)));
  flows.set(id, { root, el, view });
  return id;
};
window.__zgSet = (id, variant) => { const f = flows.get(id); flushSync(() => f.root.render(f.view(variant))); };
window.__zgUnmount = id => { const f = flows.get(id); flushSync(() => f.root.unmount()); f.el.remove(); flows.delete(id); };
