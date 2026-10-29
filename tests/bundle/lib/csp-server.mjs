// Static file server (or reverse proxy) that sends a STRICT Content-Security-Policy and records every request.
// Inline <script> blocks of HTML responses are allowed by SHA-256 hash (what a nonce/hash based production CSP does) and reported, so
// "an inline script exists" is visible in the report but does not break the app: the point is that nothing else needs unsafe-inline/eval.
import http from 'node:http';
import { createReadStream, existsSync, statSync } from 'node:fs';
import { join, extname, normalize, sep } from 'node:path';
import { createHash } from 'node:crypto';

const MIME = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.mjs': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.json': 'application/json', '.woff2': 'font/woff2', '.woff': 'font/woff', '.ttf': 'font/ttf', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.ico': 'image/x-icon', '.txt': 'text/plain', '.map': 'application/json', '.webp': 'image/webp' };

export const buildCsp = (hashes = []) => [
  "default-src 'self'",
  `script-src 'self'${hashes.map(h => ` 'sha256-${h}'`).join('')}`,
  "style-src 'self'",
  "font-src 'self'",
  "connect-src 'self'",
  "img-src 'self' data:",
  "object-src 'none'",
  "base-uri 'self'",
  "frame-ancestors 'none'",
].join('; ');

const INLINE = /<script\b([^>]*)>([\s\S]*?)<\/script>/gi;
export function inlineScripts(html) {
  const out = [];
  for (const m of html.matchAll(INLINE)) {
    if (/\bsrc\s*=/.test(m[1])) continue;
    if (/type\s*=\s*["']?application\/(json|ld\+json)/i.test(m[1])) continue;
    out.push({ body: m[2], hash: createHash('sha256').update(m[2]).digest('base64') });
  }
  return out;
}

/** opts: { root } for static files (SPA fallback is NOT applied: a missing file is a 404) or { proxy: 'http://127.0.0.1:3000' } */
export async function startServer({ root, proxy } = {}) {
  const log = { requests: [], inline: [], notFound: [] };
  const server = http.createServer((req, res) => {
    const url = new URL(req.url, 'http://x');
    const done = status => log.requests.push({ path: url.pathname + url.search, status });
    const send = (status, headers) => { res.writeHead(status, { 'x-content-type-options': 'nosniff', ...headers }); };
    if (proxy) {
      const target = new URL(proxy);
      const pr = http.request({ host: target.hostname, port: target.port, path: req.url, method: req.method, headers: { ...req.headers, 'accept-encoding': 'identity' } }, up => {
        const type = String(up.headers['content-type'] || '');
        if (type.includes('text/html')) {
          const chunks = [];
          up.on('data', c => chunks.push(c));
          up.on('end', () => {
            const html = Buffer.concat(chunks).toString('utf8');
            const scripts = inlineScripts(html);
            for (const s of scripts) log.inline.push({ path: url.pathname, hash: s.hash, head: s.body.slice(0, 90).replace(/\s+/g, ' ') });
            const headers = { ...up.headers, 'content-security-policy': buildCsp(scripts.map(s => s.hash)) };
            delete headers['content-length']; delete headers['content-encoding']; delete headers.etag;
            res.writeHead(up.statusCode, headers); res.end(html); done(up.statusCode);
          });
        } else {
          res.writeHead(up.statusCode, { ...up.headers, 'content-security-policy': buildCsp() });
          up.pipe(res); up.on('end', () => done(up.statusCode));
        }
      });
      pr.on('error', e => { send(502, { 'content-type': 'text/plain' }); res.end(String(e)); done(502); });
      req.pipe(pr);
      return;
    }
    let p = normalize(decodeURIComponent(url.pathname)).replace(/^(\.\.[/\\])+/, '');
    if (p.endsWith(sep) || p === '.') p = join(p, 'index.html');
    let file = join(root, p);
    if (!file.startsWith(root)) { send(403, {}); res.end(); return done(403); }
    if (existsSync(file) && statSync(file).isDirectory()) file = join(file, 'index.html');
    if (!existsSync(file)) { log.notFound.push(url.pathname); send(404, { 'content-type': 'text/plain', 'content-security-policy': buildCsp() }); res.end('not found'); return done(404); }
    const type = MIME[extname(file)] || 'application/octet-stream';
    let hashes = [];
    if (type.startsWith('text/html')) {
      const html = createReadStream(file);
      const chunks = [];
      html.on('data', c => chunks.push(c));
      html.on('end', () => {
        const body = Buffer.concat(chunks).toString('utf8');
        const scripts = inlineScripts(body);
        for (const s of scripts) log.inline.push({ path: url.pathname, hash: s.hash, head: s.body.slice(0, 90).replace(/\s+/g, ' ') });
        send(200, { 'content-type': type, 'content-security-policy': buildCsp(scripts.map(s => s.hash)), 'cache-control': 'no-store' });
        res.end(body); done(200);
      });
      return;
    }
    send(200, { 'content-type': type, 'content-security-policy': buildCsp(hashes), 'cache-control': 'no-store', 'access-control-allow-origin': '*' });
    createReadStream(file).pipe(res);
    done(200);
  });
  await new Promise(r => server.listen(0, '127.0.0.1', r));
  const port = server.address().port;
  return { url: `http://127.0.0.1:${port}`, log, close: () => new Promise(r => { server.close(r); server.closeAllConnections?.(); }) };
}
