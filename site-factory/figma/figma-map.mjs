// Mapa recursivo de um arquivo Figma via API REST (todas as paginas, nao so a aberta no Desktop).
// Uso:
//   node figma-map.mjs map  --url <url|fileKey> [--depth 3] [--out <dir>]    lista paginas e frames
//   node figma-map.mjs find --file <file.json> --name <regex> [--type FRAME,COMPONENT]
//                                                                            busca nos nos ja baixados
//   node figma-map.mjs node --url <url|fileKey> --ids 316:588,316:194 [--depth 4] [--out <dir>]
//   node figma-map.mjs layout --url <url|fileKey> --ids 316:229 [--depth 4]   geometria e auto-layout de cada bloco, relativos ao no (x, y, largura, altura, layoutGrow, espaco, padding)
//   node figma-map.mjs variants --url <url|fileKey> [--out <dir>]            variantes do design (desktop/mobile x light/dark) e as secoes de cada uma
//   node figma-map.mjs image --spec <site-spec.json> --variant desktop-light [--scale 1] [--out <dir>]
//                                                                            renderiza em PNG o frame de cada secao (referencia para QA visual)
//   node figma-map.mjs check --spec <site-spec.json>                         confere se cada figmaNode (e figmaVariants) do spec existe no Figma
//   (map/node aceitam --from-file <json> para trabalhar offline com uma resposta ja salva)
// Token: variavel de ambiente FIGMA_TOKEN ou, se ela nao existir, o arquivo
// ~/.config/site-factory/.env (fora do repositorio, chmod 600), com a linha FIGMA_TOKEN=...
// (Figma > Settings > Security > Personal access tokens, escopo file_content:read).
// Nunca grave o token em arquivo do repositorio.
import { existsSync, statSync } from 'node:fs';
import { mkdir, readFile, rm, writeFile } from 'node:fs/promises';
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

// ---------- geometria e auto-layout (fonte da verdade escrita para comparar com o DOM) ----------
async function cmdLayout() {
  const id = normalizeId(opt('ids', ''));
  const depth = Number(opt('depth', 4));
  const src = await load('layout');
  if (!id) {
    console.error('layout: informe --ids <node> (uma secao)');
    process.exit(2);
  }
  const data = src.fetch ? await api(`/files/${src.key}/nodes?ids=${encodeURIComponent(id)}&depth=${depth}`) : { nodes: { [id]: { document: [...walk(src.document ?? src)].find((w) => w.node.id === id)?.node } } };
  const root = data.nodes?.[id]?.document;
  if (!root) {
    console.error(`layout: no ${id} nao encontrado`);
    process.exit(1);
  }
  const ox = root.absoluteBoundingBox.x;
  const oy = root.absoluteBoundingBox.y;
  console.log(`${root.name} [${root.id}] ${Math.round(root.absoluteBoundingBox.width)}x${Math.round(root.absoluteBoundingBox.height)}  (x,y relativos ao no)`);
  const lines = [];
  (function visit(n, d) {
    const b = n.absoluteBoundingBox;
    if (b && d > 0 && ['FRAME', 'TEXT', 'GROUP', 'INSTANCE', 'COMPONENT', 'RECTANGLE'].includes(n.type)) {
      const bits = [`x=${Math.round(b.x - ox)}`, `y=${Math.round(b.y - oy)}`, `w=${Math.round(b.width)}`, `h=${Math.round(b.height)}`];
      if (n.layoutMode && n.layoutMode !== 'NONE') bits.push(`layout=${n.layoutMode.toLowerCase()}`);
      if (n.layoutGrow) bits.push(`grow=${n.layoutGrow}`);
      if (n.layoutMode && n.layoutMode !== 'NONE' && n.itemSpacing) bits.push(`gap=${n.itemSpacing}`);
      const pad = [n.paddingTop, n.paddingRight, n.paddingBottom, n.paddingLeft].map((v) => v ?? 0);
      if (pad.some(Boolean)) bits.push(`padding=${pad.join('/')}`);
      if (n.layoutAlign && n.layoutAlign !== 'INHERIT') bits.push(`align=${n.layoutAlign.toLowerCase()}`);
      if (n.counterAxisAlignItems && n.layoutMode && n.layoutMode !== 'NONE') bits.push(`cross=${n.counterAxisAlignItems.toLowerCase()}`);
      lines.push(`${'  '.repeat(d - 1)}${n.name.slice(0, 26).padEnd(26)} ${bits.join(' ')}`);
    }
    if (d < depth) for (const c of n.children ?? []) visit(c, d + 1);
  })(root, 0);
  console.log(lines.join('\n'));
}

// ---------- variantes do design ----------
// Um arquivo de design costuma ter a mesma pagina em varias variantes (desktop/mobile x light/dark), lado a lado
// na pagina de conteudo. Infere o dispositivo e o tema pelo nome do frame (e pela largura) e lista as secoes de cada um.
function variantOf(frame) {
  const n = frame.name.toLowerCase();
  const w = frame.absoluteBoundingBox?.width ?? 0;
  const device = /mobile|iphone|android|phone|celular/.test(n) ? 'mobile' : /tablet|ipad/.test(n) ? 'tablet' : /desktop|laptop|web|notebook/.test(n) ? 'desktop' : w <= 480 ? 'mobile' : w <= 1024 ? 'tablet' : 'desktop';
  const theme = /dark|escuro/.test(n) ? 'dark' : 'light';
  const overlay = /\b(menu|modal|overlay|drawer)\b/.test(n) ? '-menu' : '';
  return `${device}-${theme}${overlay}`;
}

async function cmdVariants() {
  const src = await load('variants');
  const file = src.fetch ? await api(`/files/${src.key}?depth=3`) : src;
  const key = src.key ?? fileKeyOf(opt('url')) ?? 'offline';
  const out = resolve(opt('out', join('site-factory', 'reports', 'figma', key)));
  await mkdir(out, { recursive: true });
  const frames = file.document.children.flatMap((p) => pageLikeFrames(p).map((f) => ({ page: p.name, frame: f })));
  const ids = frames.map((x) => x.frame.id);
  // Um so pedido com profundidade 2 para ter os filhos diretos (as secoes) de todos os frames.
  const detail = src.fetch && ids.length ? await api(`/files/${src.key}/nodes?ids=${encodeURIComponent(ids.join(','))}&depth=2`) : null;
  const result = { fileKey: key, name: file.name, variants: {} };
  // Frames com dispositivo E tema escritos no nome tem prioridade na chave (um "Group" de capa nao pode tomar `desktop-light`).
  const explicit = (f) => Number(/mobile|iphone|android|phone|celular|tablet|ipad|desktop|laptop|web|notebook/i.test(f.name)) + Number(/dark|escuro|light|claro/i.test(f.name));
  const ordered = frames.map((x) => ({ ...x, full: detail?.nodes?.[x.frame.id]?.document ?? x.frame })).sort((a, b) => explicit(b.full) - explicit(a.full));
  for (const { page, frame, full } of ordered) {
    let v = variantOf(full);
    while (result.variants[v]) v += '+';
    result.variants[v] = {
      inferred: explicit(full) < 2, frameId: frame.id, frameName: full.name, page, width: Math.round(full.absoluteBoundingBox?.width ?? 0), height: Math.round(full.absoluteBoundingBox?.height ?? 0),
      sections: (full.children ?? []).map((c) => ({ name: c.name, id: c.id, type: c.type, width: Math.round(c.absoluteBoundingBox?.width ?? 0), height: Math.round(c.absoluteBoundingBox?.height ?? 0) })),
    };
  }
  await writeFile(join(out, 'variants.json'), JSON.stringify(result, null, 2));
  console.log(`${file.name}: ${Object.keys(result.variants).length} variante(s)\n`);
  for (const [k, v] of Object.entries(result.variants)) {
    console.log(`${k.padEnd(18)} ${v.frameId.padEnd(9)} ${v.width}x${v.height}  "${v.frameName}"  (pagina "${v.page}")${v.inferred ? '  [inferido: nome sem dispositivo/tema explicitos]' : ''}`);
    console.log(`  secoes: ${v.sections.map((s) => `${s.name} [${s.id} ${s.height}px]`).join(', ') || '(nenhuma no nivel direto)'}`);
  }
  console.log(`\nJSON: ${join(out, 'variants.json')}`);
}

// ---------- imagem de referencia (render do Figma) ----------
async function cmdImage() {
  const specPath = opt('spec');
  const variant = opt('variant', 'desktop-light');
  if (!specPath) {
    console.error('image: informe --spec <site-spec.json> [--variant desktop-light] [--scale 1]');
    process.exit(2);
  }
  const spec = JSON.parse(await readFile(resolve(specPath), 'utf8'));
  const key = spec.design.figma.fileKey;
  const pick = (s) => (s.figmaVariants ?? {})[variant] ?? (variant === 'desktop-light' ? s.figmaNode : null);
  const wanted = spec.sections.map((s) => ({ id: s.id, node: pick(s) })).filter((w) => w.node);
  if (!wanted.length) {
    console.error(`image: nenhuma secao do spec tem node para a variante "${variant}" (figmaVariants).`);
    process.exit(1);
  }
  const out = resolve(opt('out', join('site-factory', 'reports', 'figma', key, 'ref', variant)));
  await rm(out, { recursive: true, force: true });
  await mkdir(out, { recursive: true });
  const scale = opt('scale', '1');
  const data = await api(`/images/${key}?ids=${encodeURIComponent(wanted.map((w) => w.node).join(','))}&format=png&scale=${scale}`);
  let missing = 0;
  for (const w of wanted) {
    const url = data.images?.[w.node];
    if (!url) {
      missing++;
      console.log(`FALTA  ${w.id.padEnd(14)} ${w.node} (o Figma nao renderizou)`);
      continue;
    }
    const res = await fetch(url); // URL pre-assinada de curta duracao: sem o token
    await writeFile(join(out, `${w.id}.png`), Buffer.from(await res.arrayBuffer()));
    console.log(`OK     ${w.id.padEnd(14)} ${w.node}  -> ${join(out, `${w.id}.png`)}`);
  }
  if (missing) process.exit(1);
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
  const wanted = spec.sections.flatMap((x) => [...(x.figmaNode ? [{ section: x.id, id: x.figmaNode }] : []), ...Object.entries(x.figmaVariants ?? {}).filter(([, id]) => id !== x.figmaNode).map(([v, id]) => ({ section: `${x.id}:${v}`, id }))]);
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

const commands = { map: cmdMap, find: cmdFind, node: cmdNode, layout: cmdLayout, variants: cmdVariants, image: cmdImage, check: cmdCheck };
if (!commands[command]) {
  console.error('Uso: node figma-map.mjs <map|find|node|layout|variants|image|check> [opcoes]  (ver cabecalho do arquivo)');
  process.exit(2);
}
await commands[command]();
