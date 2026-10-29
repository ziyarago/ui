// @ziyarago/ui · components, part 4 — gaps closed after the Vuexy audit.
import { t } from '../i18n/index.js';
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
export const rules = {
  required: () => v => (v == null || String(v).trim() === '') ? t('Validation', 'required') : true,
  email: () => v => !v || /^\S+@\S+\.\S+$/.test(v) || t('Validation', 'email'),
  url: () => v => !v || /^https?:\/\/\S+\.\S+/.test(v) || t('Validation', 'url'),
  digits: n => v => !v || new RegExp(`^\\d{${n}}$`).test(v) || t('Validation', 'digits', { n }),
  alpha: () => v => !v || /^[\p{L}\s]+$/u.test(v) || t('Validation', 'alpha'),
  alphaDash: () => v => !v || /^[\p{L}\d_-]+$/u.test(v) || t('Validation', 'alphaDash'),
  minLength: n => v => !v || String(v).length >= n || t('Validation', 'minLength', { n }),
  maxLength: n => v => !v || String(v).length <= n || t('Validation', 'maxLength', { n }),
  range: (a, b) => v => v == null || v === '' || (Number(v) >= a && Number(v) <= b) || t('Validation', 'range', { a, b }),
  regex: (re, msg) => v => !v || re.test(v) || msg || t('Validation', 'invalid'),
  confirmed: get => v => v === get() || t('Validation', 'confirmed'),
  password: () => v => !v || (/\d/.test(v) && /[A-ZА-Я]/.test(v) && String(v).length >= 8) || t('Validation', 'password')
};

export const more4 = {
  Footer: { render: ({ h, props: p, children }) => h('footer', { class: 'zg-foot' }, h('span', { class: 'zg-u-fcopy' }, p.copyright || '© 2026 ZiyaraGo'), h('nav', { class: 'zg-u-fnav' }, ...(p.links || []).map((l, i) => h('a', { key: i + ':' + l.label, href: l.href || '#', class: 'zg-u-flink' }, l.label))), ...children) },
};
