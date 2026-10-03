// Mapa recursivo de um arquivo Figma via API REST (todas as paginas, nao so a aberta no Desktop).
// Uso:
//   node figma-map.mjs map  --url <url|fileKey> [--depth 3] [--out <dir>]    lista paginas e frames
//   node figma-map.mjs find --file <file.json> --name <regex> [--type FRAME,COMPONENT]
//                                                                            busca nos nos ja baixados
//   node figma-map.mjs node --url <url|fileKey> --ids 316:588,316:194 [--depth 4] [--out <dir>]
//   node figma-map.mjs check --spec <site-spec.json>                         confere se cada figmaNode do spec existe no Figma
//   (map/node aceitam --from-file <json> para trabalhar offline com uma resposta ja salva)
// Token: variavel de ambiente FIGMA_TOKEN ou, se ela nao existir, o arquivo
// ~/.config/site-factory/.env (fora do repositorio, chmod 600), com a linha FIGMA_TOKEN=...
// (Figma > Settings > Security > Personal access tokens, escopo file_content:read).
// Nunca grave o token em arquivo do repositorio.
import { existsSync, statSync } from 'node:fs';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { homedir } from 'node:os';
import { join, resolve } from 'node:path';

const [command, ...rest] = process.argv.slice(2);
const opt = (name, fallback) => {
  const i = rest.indexOf(`--${name}`);
  return i >= 0 ? rest[i + 1] : fallback;
};

const API = 'https://api.figma.com/v1';
const COVER = /\b(cover|capa|thumbnail|index|intro|welcome)\b/i;
const LIBRARY = /(component|style|icon|design system|library|tokens|biblioteca|componente)/i;

function fileKeyOf(input) {
  if (!input) return null;
  return input.match(/figma\.com\/(?:design|file|proto)\/([A-Za-z0-9]+)/)?.[1] ?? (/^[A-Za-z0-9]+$/.test(input) ? input : null);
}

const normalizeId = (id) => id.replace('-', ':');

// A variavel de ambiente tem prioridade; o arquivo so e lido se ela nao existir.
function loadTokenFile() {
  const file = join(homedir(), '.config', 'site-factory', '.env');
  if (process.env.FIGMA_TOKEN || !existsSync(file)) return;
  if (statSync(file).mode & 0o077) console.error(`Aviso: ${file} e legivel por outros usuarios; rode chmod 600 nele.`);
  process.loadEnvFile(file);
}

async function api(path) {
  loadTokenFile();
  const token = process.env.FIGMA_TOKEN;
  if (!token) {
    console.error('FIGMA_TOKEN nao definido. Crie um Personal access token (Figma > Settings > Security, escopo file_content:read) e guarde em ~/.config/site-factory/.env (linha FIGMA_TOKEN=..., chmod 600) ou rode `export FIGMA_TOKEN=...` no terminal antes de abrir o Claude Code. Nao salve o token em arquivos do repositorio.');
    process.exit(2);
  }
  for (let attempt = 0; attempt < 3; attempt++) {
    const res = await fetch(`${API}${path}`, { headers: { 'X-Figma-Token': token } });
    if (res.status === 429) {
      await new Promise((r) => setTimeout(r, (Number(res.headers.get('retry-after')) || 5) * 1000));
      continue;
    }
    if (!res.ok) {
      const hint = { 403: 'token invalido/sem acesso ao arquivo', 404: 'arquivo ou node nao encontrado' }[res.status] ?? '';
      console.error(`Figma API ${res.status} ${hint}: ${(await res.text()).slice(0, 200)}`);
      process.exit(1);
    }
    return res.json();
  }
  console.error('Figma API: limite de requisicoes (429) persistente; tente de novo em alguns minutos.');
  process.exit(1);
}

const size = (n) => (n.absoluteBoundingBox ? `${Math.round(n.absoluteBoundingBox.width)}x${Math.round(n.absoluteBoundingBox.height)}` : '');

const countNodes = (node) => (node.children ?? []).reduce((sum, c) => sum + 1 + countNodes(c), 0);

// O tipo da pagina e so uma DICA para o humano/agente; nenhuma pagina e ignorada por causa dele.
// Regras (conteudo vence o nome, para nao rotular como capa uma pagina que tem o site inteiro):
//  - arquivo com uma unica pagina: sempre `content` (ela e o conteudo, seja qual for o nome);
//  - pagina com mais que SMALL nos: `content`, mesmo que o nome sugira capa/biblioteca;
//  - pagina pequena: nome de biblioteca -> `library`; nome de capa ou <= 1 no -> `cover?`.
const SMALL = 8;
function pageKind(page, totalPages) {
  const nodes = countNodes(page);
  const nameHint = LIBRARY.test(page.name) ? 'library' : COVER.test(page.name) ? 'cover?' : null;
  if (totalPages === 1) return nameHint ? `content (nome sugere ${nameHint === 'library' ? 'biblioteca' : 'capa'}, mas e a unica pagina)` : 'content';
  if (nodes > SMALL) return nameHint ? `content (nome sugere ${nameHint === 'library' ? 'biblioteca' : 'capa'}, mas tem ${nodes} nos)` : 'content';
  if (nameHint) return nameHint;
  return nodes <= 1 ? 'cover?' : 'content';
}

// Frames com "cara de pagina do site" (largura de viewport, altura de pagina), no nivel mais alto em que
// aparecem. Mostra onde o site mora mesmo quando tudo esta numa pagina so, dentro de grupos e secoes.
function pageLikeFrames(node, acc = []) {
  for (const c of node.children ?? []) {
    const b = c.absoluteBoundingBox;
    if (['FRAME', 'COMPONENT', 'COMPONENT_SET'].includes(c.type) && b && b.width >= 320 && b.width <= 1920 && b.height >= 400) acc.push(c);
    else pageLikeFrames(c, acc);
  }
  return acc;
}

function tree(node, maxDepth, depth = 0, lines = []) {
  const pad = '  '.repeat(depth);
  lines.push(`${pad}- ${node.name} [${node.type} ${node.id}${size(node) ? ` ${size(node)}` : ''}]`);
  if (depth < maxDepth) for (const c of node.children ?? []) tree(c, maxDepth, depth + 1, lines);
  else if (node.children?.length) lines.push(`${pad}  ... ${node.children.length} filho(s) alem da profundidade`);
  return lines;
}

function* walk(node, path = []) {
  const here = [...path, node.name];
  yield { node, path: here };
  for (const c of node.children ?? []) yield* walk(c, here);
}

async function load(label) {
  const fromFile = opt('from-file');
  if (fromFile) return JSON.parse(await readFile(resolve(fromFile), 'utf8'));
  const key = fileKeyOf(opt('url'));
  if (!key) {
    console.error(`${label}: informe --url <url do Figma|fileKey> ou --from-file <json>`);
    process.exit(2);
  }
  return { key, fetch: true };
}

async function cmdMap() {
  const depth = Number(opt('depth', 3));
  const src = await load('map');
  const file = src.fetch ? await api(`/files/${src.key}?depth=${depth}`) : src;
  const key = src.key ?? fileKeyOf(opt('url')) ?? 'offline';
  const out = resolve(opt('out', join('site-factory', 'reports', 'figma', key)));
  await mkdir(out, { recursive: true });
  await writeFile(join(out, 'file.json'), JSON.stringify(file));

  const pages = file.document.children;
  const md = [`# ${file.name}`, '', `- Arquivo: \`${key}\``, `- Ultima modificacao: ${file.lastModified ?? '?'}`, `- Paginas: ${pages.length} (profundidade ${depth})`, ''];
  for (const page of pages) {
    const likely = pageLikeFrames(page).map((f) => `  - ${f.name} [${f.id} ${size(f)}]`);
    md.push(`## ${page.name} [${page.id}] - ${pageKind(page, pages.length)}`, '', ...tree(page, depth - 1).slice(1), '');
    if (likely.length) md.push(`Frames com cara de pagina do site (use \`node --ids <id>\` para ver as secoes):`, ...likely, '');
  }
  await writeFile(join(out, 'map.md'), md.join('\n'));

  console.log(`${file.name}: ${pages.length} pagina(s)`);
  for (const page of pages) {
    const frames = (page.children ?? []).filter((c) => ['FRAME', 'SECTION', 'COMPONENT_SET'].includes(c.type)).length;
    const likely = pageLikeFrames(page);
    console.log(`  ${page.id.padEnd(8)} ${pageKind(page, pages.length).padEnd(8)} ${page.name} (${(page.children ?? []).length} no(s) de topo, ${frames} frame/secao, ${likely.length} frame(s) com cara de pagina)`);
  }
  console.log('\nNenhuma pagina e ignorada pelo tipo: ele e so uma dica. Procure secoes em TODAS com `find`; se nao achar, aumente --depth antes de concluir que nao existe.');
  console.log(`\nMapa completo: ${join(out, 'map.md')}\nJSON bruto (para o comando find): ${join(out, 'file.json')}`);
}

async function cmdFind() {
  const file = opt('file');
  const name = opt('name');
  if (!file || !name) {
    console.error('find: informe --file <file.json> e --name <regex>');
    process.exit(2);
  }
  const data = JSON.parse(await readFile(resolve(file), 'utf8'));
  const re = new RegExp(name, 'i');
  const types = opt('type')?.split(',').map((t) => t.trim().toUpperCase());
  let hits = 0;
  for (const { node, path } of walk(data.document ?? data)) {
    if (!re.test(node.name) || (types && !types.includes(node.type))) continue;
    hits++;
    console.log(`${node.id.padEnd(10)} ${node.type.padEnd(14)} ${path.slice(1).join(' > ')}${size(node) ? `  (${size(node)})` : ''}`);
  }
  console.log(hits ? `\n${hits} resultado(s)` : 'nenhum resultado (o JSON foi baixado com profundidade suficiente? use map --depth maior ou o comando node)');
}

async function cmdNode() {
  const ids = opt('ids')?.split(',').map(normalizeId);
  const depth = Number(opt('depth', 4));
  const src = await load('node');
  if (!ids?.length) {
    console.error('node: informe --ids 316:588,316:194');
    process.exit(2);
  }
  const data = src.fetch ? await api(`/files/${src.key}/nodes?ids=${encodeURIComponent(ids.join(','))}&depth=${depth}`) : { nodes: Object.fromEntries(ids.map((id) => [id, { document: [...walk(src.document ?? src)].find((w) => w.node.id === id)?.node }])) };
  const out = resolve(opt('out', join('site-factory', 'reports', 'figma', src.key ?? 'offline')));
  await mkdir(out, { recursive: true });
  for (const id of ids) {
    const doc = data.nodes?.[id]?.document;
    if (!doc) {
      console.log(`${id}: nao encontrado`);
      continue;
    }
    const file = join(out, `node-${id.replace(':', '-')}.json`);
    await writeFile(file, JSON.stringify(doc));
    console.log(tree(doc, depth).join('\n'), `\n-> ${file}\n`);
  }
}

// Teste de obtencao de dados: cada `figmaNode` do spec precisa existir no arquivo do cliente.
// Sai com codigo 1 se algum faltar; nos que existem mostra nome e tamanho para conferencia humana.
async function cmdCheck() {
  const specPath = opt('spec');
  if (!specPath) {
    console.error('check: informe --spec <site-spec.json>');
    process.exit(2);
  }
  const spec = JSON.parse(await readFile(resolve(specPath), 'utf8'));
  const key = spec.design?.figma?.fileKey;
  const wanted = spec.sections.filter((x) => x.figmaNode).map((x) => ({ section: x.id, id: x.figmaNode }));
  const meta = await api(`/files/${key}?depth=1`);
  console.log(`Arquivo ${key}: "${meta.name}" (${meta.document.children.length} pagina(s)), ultima modificacao ${meta.lastModified}`);
  if (!wanted.length) {
    console.log('Nenhuma secao com figmaNode no spec (o designer ainda nao mapeou).');
    return;
  }
  const data = await api(`/files/${key}/nodes?ids=${encodeURIComponent(wanted.map((w) => w.id).join(','))}&depth=1`);
  let missing = 0;
  for (const { section, id } of wanted) {
    const doc = data.nodes?.[id]?.document;
    if (!doc) {
      missing++;
      console.log(`FALTA  ${section.padEnd(14)} ${id}  (nao existe no arquivo)`);
    } else {
      console.log(`OK     ${section.padEnd(14)} ${id.padEnd(9)} ${doc.type.padEnd(10)} "${doc.name}" ${size(doc)}`);
    }
  }
  console.log(missing ? `\n${missing} de ${wanted.length} figmaNode(s) nao encontrado(s)` : `\nTodos os ${wanted.length} figmaNode(s) existem no Figma`);
  if (missing) process.exit(1);
}

const commands = { map: cmdMap, find: cmdFind, node: cmdNode, check: cmdCheck };
if (!commands[command]) {
  console.error('Uso: node figma-map.mjs <map|find|node|check> [opcoes]  (ver cabecalho do arquivo)');
  process.exit(2);
}
await commands[command]();
