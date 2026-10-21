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
