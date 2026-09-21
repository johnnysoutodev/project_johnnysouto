// Servidor local que reproduz o comportamento de producao (Vercel) dos builds por idioma:
// serve `dist/project_johnnysouto/browser/{pt-br,en-us,es-es}` e aplica os MESMOS
// `redirects` do `vercel.json` (fonte unica de verdade) - cookie `lang`, depois o header
// `Accept-Language`, depois o padrao (en-US). Uso: `npm run serve:i18n` (builda antes) ou
// `npm run serve:i18n:only` (reaproveita o ultimo build). Sem dependencias externas.
import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { extname, join, normalize, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(fileURLToPath(new URL('..', import.meta.url)));
const distDir = join(root, 'dist', 'project_johnnysouto', 'browser');
const port = Number(process.env.PORT ?? 4300);
const { redirects = [] } = JSON.parse(await readFile(join(root, 'vercel.json'), 'utf8'));

const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.ico': 'image/x-icon',
  '.txt': 'text/plain; charset=utf-8',
  '.xml': 'application/xml; charset=utf-8',
};

function cookies(header = '') {
  return Object.fromEntries(
    header
      .split(';')
      .map((part) => part.trim().split('='))
      .filter(([key]) => key),
  );
}

function matchesHas(has = [], req) {
  const jar = cookies(req.headers.cookie);
  return has.every(({ type, key, value }) => {
    const actual = type === 'cookie' ? jar[key] : req.headers[key.toLowerCase()];
    return actual !== undefined && (value === undefined || new RegExp(value).test(actual));
  });
}

function findRedirect(pathname, req) {
  return redirects.find((rule) => rule.source === pathname && matchesHas(rule.has, req));
}

async function fileFor(pathname) {
  const safe = normalize(decodeURIComponent(pathname)).replace(/^(\.\.[/\\])+/, '');
  let target = join(distDir, safe);
  const info = await stat(target).catch(() => null);
  if (info?.isDirectory()) target = join(target, 'index.html');
  return target;
}

const server = createServer(async (req, res) => {
  const { pathname } = new URL(req.url, `http://${req.headers.host}`);
  const rule = findRedirect(pathname, req);
  if (rule) {
    res.writeHead(rule.permanent ? 301 : 307, { location: rule.destination });
    return res.end();
  }
  try {
    const file = await fileFor(pathname);
    const body = await readFile(file);
    res.writeHead(200, { 'content-type': TYPES[extname(file)] ?? 'application/octet-stream' });
    res.end(body);
  } catch {
    res.writeHead(404, { 'content-type': 'text/plain; charset=utf-8' });
    res.end('Not found');
  }
});

server.on('error', (error) => {
  if (error.code === 'EADDRINUSE') {
    console.error(
      `A porta ${port} ja esta em uso (outro serve:i18n ainda rodando?).\n` +
        `Encerre o processo (lsof -ti :${port} | xargs kill) ou use outra porta: PORT=4310 npm run serve:i18n:only`,
    );
    process.exit(1);
  }
  throw error;
});

server.listen(port, () => {
  console.log(
    `i18n local: http://localhost:${port}  (/ redireciona por cookie "lang", Accept-Language ou en-US)`,
  );
});
