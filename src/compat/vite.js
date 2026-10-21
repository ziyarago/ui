// Vite plugin: redirects imports of the project's local old-kit files (".../components/ui/Toast", ".../components/ui/Select/UiSelect.vue", "@/components/ui/Table", ...)
// to '@ziyarago/ui/compat', so useToast, TableColumn, SelectOption, UiInput ... keep working without editing hundreds of import lines.
//   import { ziyaragoCompat } from '@ziyarago/ui/compat/vite'   plugins: [ziyaragoCompat(), vue(), ...]
const PREFIX = '\0ziyarago-compat:';

/** @param {{ from?: string, ui?: RegExp, exclude?: RegExp[] }} [options] ui: matches the local ui directory in an import path. exclude: import paths to keep local (default: MultilangInput). */
export function ziyaragoCompat(options = {}) {
  const { from = '@ziyarago/ui/compat', ui = /(?:^|\/)components\/ui\/([A-Za-z]+)(?:\/([A-Za-z]+)(\.vue|\.ts)?)?$/, exclude = [/MultilangInput/] } = options;
  return {
    name: 'ziyarago-ui-compat',
    enforce: 'pre',
    resolveId(source, importer) {
      const norm = source.replace(/\\/g, '/');
      if (!importer || importer.includes('node_modules') || norm.startsWith('\0') || norm.startsWith(from) || !norm.includes('components/ui')) return null;
      if (importer.replace(/\\/g, '/').includes('/components/ui/')) return null;
      if (exclude.some(r => r.test(norm))) return null;
      const m = ui.exec(norm);
      if (!m) return null;
      return PREFIX + (m[2] && m[3] === '.vue' ? m[2] : m[1]);
    },
    load(id) {
      if (!id.startsWith(PREFIX)) return null;
      const name = id.slice(PREFIX.length), comp = name.startsWith('Ui') ? name : name === 'Toast' ? 'UiToastContainer' : 'Ui' + name;
      return `export * from '${from}';\nimport * as C from '${from}';\nexport default C['${comp}'];\n`;
    },
  };
}

export default ziyaragoCompat;
