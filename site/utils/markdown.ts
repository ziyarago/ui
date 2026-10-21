export type MdBlock =
  | { t: 'h'; level: number; html: string; text: string; id: string }
  | { t: 'p'; html: string }
  | { t: 'list'; ordered: boolean; items: string[] }
  | { t: 'code'; lang: string; code: string }
  | { t: 'table'; head: string[]; rows: string[][] }
  | { t: 'quote'; html: string }
  | { t: 'hr' }

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

const safeUrl = (u: string) => (/^(https?:\/\/|mailto:|\/|#|\.{0,2}\/)/i.test(u.trim()) ? u.trim() : '#')

/** Inline markdown to safe HTML: input is escaped first, then code, bold, italic and links are re-applied. */
export function inline(src: string): string {
  const codes: string[] = []
  let s = esc(src).replace(/`([^`]+)`/g, (_, c) => { codes.push(`<code>${c}</code>`); return `\u0000${codes.length - 1}\u0000` })
  s = s.replace(/\[([^\]]+)\]\(([^)\s]+)(?:\s+&quot;[^&]*&quot;)?\)/g, (_, text, url) => {
    const u = safeUrl(url.replace(/&amp;/g, '&'))
    const ext = /^https?:/i.test(u)
    return `<a href="${esc(u)}"${ext ? ' target="_blank" rel="noopener noreferrer"' : ''}>${text}</a>`
  })
  s = s.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>').replace(/(^|[\s(])\*([^*\s][^*]*)\*(?=$|[\s).,;:])/g, '$1<em>$2</em>')
  return s.replace(/\u0000(\d+)\u0000/g, (_, i) => codes[+i])
}

export const slug = (t: string) => t.toLowerCase().replace(/<[^>]+>/g, '').replace(/[^\p{L}\p{N}\s-]/gu, '').trim().replace(/\s+/g, '-') || 'section'

/** Heading id: release headings (`## [0.1.1](...) (date)` or `## 0.1.0 — first release`) become `v0.1.1`. */
export function headingId(text: string): string {
  const v = text.match(/\b(\d+\.\d+\.\d+(?:-[\w.]+)?)\b/)
  return v && /^\[?\d/.test(text) ? 'v' + v[1] : slug(text)
}

const cells = (line: string) => line.trim().replace(/^\||\|$/g, '').split('|').map(c => c.trim())
const isSep = (line: string) => /^\s*\|?\s*:?-{2,}:?\s*(\|\s*:?-{2,}:?\s*)*\|?\s*$/.test(line) && line.includes('-')

export function parseMarkdown(md: string): MdBlock[] {
  const lines = md.replace(/\r\n?/g, '\n').split('\n')
  const out: MdBlock[] = []
  const used = new Map<string, number>()
  let i = 0
  while (i < lines.length) {
    const line = lines[i]
    if (!line.trim()) { i++; continue }
    const fence = line.match(/^\s*(`{3,}|~{3,})\s*([\w+-]*)/)
    if (fence) {
      const buf: string[] = []
      i++
      while (i < lines.length && !lines[i].trim().startsWith(fence[1])) buf.push(lines[i++])
      i++
      out.push({ t: 'code', lang: fence[2], code: buf.join('\n') })
      continue
    }
    const h = line.match(/^(#{1,6})\s+(.*?)\s*#*\s*$/)
    if (h) {
      const id0 = headingId(h[2])
      const n = (used.get(id0) ?? 0) + 1
      used.set(id0, n)
      out.push({ t: 'h', level: h[1].length, html: inline(h[2]), text: h[2], id: n > 1 ? `${id0}-${n}` : id0 })
      i++
      continue
    }
    if (/^\s*([-*_])(\s*\1){2,}\s*$/.test(line)) { out.push({ t: 'hr' }); i++; continue }
    if (line.includes('|') && i + 1 < lines.length && isSep(lines[i + 1])) {
      const head = cells(line)
      const rows: string[][] = []
      i += 2
      while (i < lines.length && lines[i].includes('|') && lines[i].trim()) rows.push(cells(lines[i++]))
      out.push({ t: 'table', head: head.map(inline), rows: rows.map(r => r.map(inline)) })
      continue
    }
    if (/^\s*>/.test(line)) {
      const buf: string[] = []
      while (i < lines.length && /^\s*>/.test(lines[i])) buf.push(lines[i++].replace(/^\s*>\s?/, ''))
      out.push({ t: 'quote', html: inline(buf.join(' ')) })
      continue
    }
    const li = line.match(/^\s*([-*+]|\d+[.)])\s+(.*)$/)
    if (li) {
      const ordered = /\d/.test(li[1])
      const items: string[] = []
      while (i < lines.length) {
        const m = lines[i].match(/^\s*([-*+]|\d+[.)])\s+(.*)$/)
        if (m) { items.push(m[2]); i++ }
        else if (/^\s{2,}\S/.test(lines[i]) && items.length) items[items.length - 1] += ' ' + lines[i++].trim()
        else break
      }
      out.push({ t: 'list', ordered, items: items.map(inline) })
      continue
    }
    const buf: string[] = []
    while (i < lines.length && lines[i].trim() && !/^(#{1,6}\s|\s*(`{3,}|~{3,})|\s*>|\s*([-*+]|\d+[.)])\s)/.test(lines[i]) && !(lines[i].includes('|') && i + 1 < lines.length && isSep(lines[i + 1]))) buf.push(lines[i++].trim())
    out.push({ t: 'p', html: inline(buf.join(' ')) })
  }
  return out
}
