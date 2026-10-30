// @ziyarago/ui · form validation rules. Its strings register on first use (no top-level side effect, so the module tree-shakes away when unused).
import { t as tr, defineMessages } from '../i18n/index.js';
import Validation from '../i18n/components/Validation.js';
let ready = false;
const t = (ns, key, p) => { if (!ready) { ready = true; defineMessages('Validation', Validation); } return tr(ns, key, p); };
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
