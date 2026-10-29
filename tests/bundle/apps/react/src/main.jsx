import './style.css';
import React, { Component, createElement } from 'react';
import { createRoot } from 'react-dom/client';
import { flushSync } from 'react-dom';
import { Preview, setProNames } from '../auditkit/preview-react.js';
import { UI } from '../auditkit/ui-entry.js';
import { useUiTheme } from '@ziyarago/ui/react';
import { t } from '@ziyarago/ui/internal';
import { params, report, load, finish, state, fingerprint } from '../auditkit/page.js';

const theme = useUiTheme();
theme.setEffects('full');
theme.setTheme(params.theme || 'dark');
if (params.locale) theme.setLocale(params.locale);
if (params.dir) theme.setDir(params.dir);
window.__zgT = t;
window.__zgNames = Object.keys(UI);

class Boundary extends Component {
  constructor(p) { super(p); this.state = { err: null }; }
  static getDerivedStateFromError(err) { return { err }; }
  componentDidCatch(err) { report(this.props.it.name, this.props.it.idx, err); }
  render() { return this.state.err ? createElement('pre', { 'data-error': '' }, String(this.state.err.message)) : this.props.children; }
}

const items = await load();
if (items[0]) setProNames(items[0].proNames);
for (const it of items) {
  state.current = it.name + '#' + it.idx;
  const el = createElement(Preview, { name: it.name, variant: it.variant, open: it.open });
  try { flushSync(() => createRoot(it.container, { onRecoverableError: e => console.error('React recoverable error: ' + e.message) }).render(createElement(Boundary, { it }, el))); }
  catch (err) { report(it.name, it.idx, err); }
  state.mounted++;
}
await new Promise(r => setTimeout(r, 1000));
for (const it of items) state.fingerprints[it.name + '#' + it.idx] = fingerprint(it.container);
finish();
