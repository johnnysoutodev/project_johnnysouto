// Utilidades compartilhadas entre o verifier e o QA visual: servir o dist do build e achar o spec do cliente dono de um projeto.
import { createServer } from 'node:http';
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { readFile } from 'node:fs/promises';
import { dirname, extname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
export const siteFactory = resolve(here, '..', '..');
export const repoRoot = resolve(siteFactory, '..');

// Spec do cliente dono do projeto: --spec explicito, ou site-factory/clients/*/site-spec.json cujo build.projectDir aponta para ele.
export function findOwnerSpec(project, explicit) {
  if (explicit) return { file: resolve(explicit), spec: JSON.parse(readFileSync(resolve(explicit), 'utf8')) };
  const clients = join(siteFactory, 'clients');
  if (!existsSync(clients)) return null;
  for (const id of readdirSync(clients)) {
    const file = join(clients, id, 'site-spec.json');
    if (!existsSync(file)) continue;
    const spec = JSON.parse(readFileSync(file, 'utf8'));
    if (spec.build?.projectDir && resolve(repoRoot, spec.build.projectDir) === project) return { file, spec };
  }
  return null;
}

const TYPES = {
  '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8', '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png',
  '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp', '.avif': 'image/avif', '.ico': 'image/x-icon',
  '.woff2': 'font/woff2', '.woff': 'font/woff', '.txt': 'text/plain', '.xml': 'application/xml', '.pdf': 'application/pdf',
};

// dist/<nome>/browser do build do projeto (null se nao existir).
export function findDist(project) {
  const dist = join(project, 'dist');
  if (!existsSync(dist)) return null;
  for (const name of readdirSync(dist)) {
    const browser = join(dist, name, 'browser');
    if (existsSync(browser)) return browser;
  }
  return null;
}

// Servidor estatico numa porta efemera (nao usa o dev server do usuario). URLs limpas: /x, /x.html, /x/index.html.
export async function serve(root) {
  const server = createServer(async (req, res) => {
    const path = decodeURIComponent(new URL(req.url, 'http://x').pathname);
    for (const c of [path, `${path}.html`, join(path, 'index.html')]) {
      const file = join(root, c);
      if (!file.startsWith(root)) break;
      try {
        if (statSync(file).isFile()) {
          res.writeHead(200, { 'content-type': TYPES[extname(file)] ?? 'application/octet-stream' });
          return res.end(await readFile(file));
        }
      } catch { /* tenta o proximo */ }
    }
    res.writeHead(404, { 'content-type': 'text/plain' });
    res.end('not found');
  });
  await new Promise((ok) => server.listen(0, '127.0.0.1', ok));
  return { server, base: `http://127.0.0.1:${server.address().port}` };
}

// Locais (pastas com index.html) do dist; '.' quando o site tem um idioma so.
export function findLocales(dist) {
  const dirs = readdirSync(dist).filter((n) => statSync(join(dist, n)).isDirectory() && existsSync(join(dist, n, 'index.html')));
  return dirs.length ? dirs : existsSync(join(dist, 'index.html')) ? ['.'] : [];
}
