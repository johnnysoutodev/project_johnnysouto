// Aplica o template de deploy do provedor escolhido no site-spec (so ele; nunca os outros).
//   node apply.mjs --spec <site-spec.json> [--root <raiz-do-repo>] [--dry-run] [--force]
// Le deploy.provider + deploy.outputMode -> pasta <provider>-<outputMode>/ (manifesto template.json).
// Placeholders {{nome}} (sem espacos; expressoes do GitHub `${{ ... }}` nao sao tocadas).
// Nao sobrescreve arquivo existente sem --force. Nunca apaga nada; so lista arquivos de outro provedor.
// Codigos de saida: 0 ok, 1 erro, 2 uso, 3 sem template para esse provedor/formato.
import { existsSync, readdirSync } from 'node:fs';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const args = process.argv.slice(2);
const flag = (n) => args.includes(`--${n}`);
const opt = (n, d) => (args.includes(`--${n}`) ? args[args.indexOf(`--${n}`) + 1] : d);

const specPath = opt('spec');
if (!specPath) {
  console.error('Uso: node apply.mjs --spec <site-spec.json> [--root <raiz>] [--dry-run] [--force]');
  process.exit(2);
}
const root = resolve(opt('root', join(here, '..', '..')));
const spec = JSON.parse(await readFile(resolve(specPath), 'utf8'));
const { provider, outputMode } = spec.deploy ?? {};
const available = readdirSync(here, { withFileTypes: true }).filter((d) => d.isDirectory() && existsSync(join(here, d.name, 'template.json'))).map((d) => d.name);
const id = `${provider}-${outputMode}`;
if (!available.includes(id)) {
  console.log(`Sem template de deploy para "${id}". Disponiveis: ${available.join(', ')}. Nenhum arquivo de deploy foi gerado; o build segue normal.`);
  process.exit(3);
}

// ---------- contexto derivado do spec e do projeto Angular ----------
const projectDir = spec.build?.projectDir;
if (!projectDir) fail('build.projectDir ausente no spec');
const angularJson = join(root, projectDir, 'angular.json');
if (!existsSync(angularJson)) fail(`${join(projectDir, 'angular.json')} nao existe: o projeto Angular precisa ser criado antes (etapa A do builder)`);
const ng = JSON.parse(await readFile(angularJson, 'utf8'));
const ngName = Object.keys(ng.projects)[0];
const out = ng.projects[ngName].architect?.build?.options?.outputPath;
const base = (typeof out === 'string' ? out : out?.base) ?? `dist/${ngName}`;
const outputDir = outputMode === 'static' ? `${base}/browser` : base;

const folder = (l) => l.toLowerCase();
const locales = [spec.locales.source, ...(spec.locales.targets ?? [])];
const multi = locales.length > 1;
const folders = locales.map(folder);
const sourceFolder = folder(spec.locales.source);
const fallbackFolder = folder(spec.locales.fallback ?? spec.locales.source);
const langMap = {};
for (const l of locales) langMap[l.split('-')[0].toLowerCase()] ??= folder(l);
const fallbackLang = fallbackFolder.split('-')[0];

const envs = spec.deploy.environments ?? [];
const prodEnv = envs.find((e) => /prod/i.test(e.name)) ?? envs[envs.length - 1];
const previewEnv = envs.find((e) => e !== prodEnv);
const url = (u) => (u ? u.replace(/\/$/, '') : '');

const vercelRedirects = !multi ? [] : [
  ...folders.map((f) => ({ source: '/', has: [{ type: 'cookie', key: 'lang', value: f }], destination: `/${f}/`, permanent: false })),
  ...Object.entries(langMap).filter(([lang]) => lang !== fallbackLang).map(([lang, f]) => ({ source: '/', has: [{ type: 'header', key: 'accept-language', value: `^${lang}.*` }], destination: `/${f}/`, permanent: false })),
  { source: '/', destination: `/${fallbackFolder}/`, permanent: false },
];
const vercelRewrites = !multi ? [] : ['robots.txt', 'sitemap.xml', 'favicon.ico'].map((f) => ({ source: `/${f}`, destination: `/${sourceFolder}/${f}` }));

const baseCtx = {
  projectDir, clientId: spec.client.id, clientName: spec.client.name,
  clientNameSafe: spec.client.name.replace(/[:#'"{}\[\]&*!|>%@`$]/g, '').trim(), // seguro em escalar YAML sem aspas
  outputDir, multiLocale: String(multi), sourceFolder, fallbackFolder,
  localeFoldersJson: JSON.stringify(folders), localeLangMapJson: JSON.stringify(langMap),
  notFoundPath: multi ? `/${sourceFolder}/index.html` : '/index.html',
  previewBranch: previewEnv?.branch ?? 'develop', previewEnv: previewEnv?.name ?? 'Develop',
  previewEnvSlug: (previewEnv?.name ?? 'develop').toLowerCase(),
  productionBranch: prodEnv?.branch ?? 'main', productionEnv: prodEnv?.name ?? 'Production',
  productionEnvSlug: (prodEnv?.name ?? 'production').toLowerCase(),
  productionUrl: url(prodEnv?.url ?? spec.project?.domain),
  productionEnvUrlLine: prodEnv?.url ?? spec.project?.domain ? `url: ${url(prodEnv?.url ?? spec.project?.domain)}` : '',
  vercelRedirects: JSON.stringify(vercelRedirects, null, 2), vercelRewrites: JSON.stringify(vercelRewrites, null, 2),
};

function fail(msg) {
  console.error(`ERRO: ${msg}`);
  process.exit(1);
}

// {{nome}}: se estiver sozinho na linha, o valor multilinha herda a indentacao e valor vazio remove a linha;
// se estiver no meio da linha, as linhas seguintes do valor herdam a indentacao da linha.
function render(text, ctx, file) {
  const get = (k) => {
    if (!(k in ctx)) fail(`placeholder desconhecido {{${k}}} em ${file}`);
    return String(ctx[k]);
  };
  return text.split('\n').map((line) => {
    if (!/\{\{\w+\}\}/.test(line)) return line;
    const indent = line.match(/^[ \t]*/)[0];
    const alone = line.match(/^([ \t]*)\{\{(\w+)\}\}[ \t]*$/);
    if (alone) {
      const v = get(alone[2]);
      return v === '' ? null : v.split('\n').map((l) => (l ? alone[1] + l : l)).join('\n');
    }
    return line.replace(/\{\{(\w+)\}\}/g, (_, k) => get(k).split('\n').join(`\n${indent}`));
  }).filter((l) => l !== null).join('\n');
}

async function manifestOf(name) {
  return JSON.parse(await readFile(join(here, name, 'template.json'), 'utf8'));
}

// ---------- o template escolhido ----------
const manifest = await manifestOf(id);
let ctx = { ...baseCtx };
if (id.startsWith('aws-')) {
  const fn = render(await readFile(join(here, id, 'infra', 'viewer-request.js.tmpl'), 'utf8'), ctx, 'viewer-request.js.tmpl');
  ctx = { ...ctx, cloudfrontFunctionCode: fn.trimEnd() };
}

const dry = flag('dry-run');
const written = [];
const skipped = [];
for (const f of manifest.files) {
  const to = render(f.to, ctx, 'template.json');
  const dest = join(root, to);
  if (existsSync(dest) && !flag('force')) {
    skipped.push(to);
    continue;
  }
  const body = render(await readFile(join(here, id, f.from), 'utf8'), ctx, f.from);
  if (!dry) {
    await mkdir(dirname(dest), { recursive: true });
    await writeFile(dest, body.endsWith('\n') ? body : `${body}\n`);
  }
  written.push(to);
}

// ---------- arquivos de outro provedor ja presentes (so lista) ----------
const stale = [];
for (const other of available.filter((a) => a !== id)) {
  for (const f of (await manifestOf(other)).files) {
    const to = render(f.to, baseCtx, 'template.json');
    if (existsSync(join(root, to)) && !manifest.files.some((m) => render(m.to, ctx, 'template.json') === to)) stale.push(`${to} (template ${other})`);
  }
}

console.log(`Template ${id} [${manifest.status}]${dry ? ' (dry-run)' : ''}`);
written.forEach((f) => console.log(`  ${dry ? 'criaria ' : 'criado  '} ${f}`));
skipped.forEach((f) => console.log(`  pulado   ${f} (ja existe; use --force para sobrescrever)`));
if (stale.length) console.log(`\nArquivos de OUTRO provedor presentes (nada foi apagado; remova se nao forem mais usados):\n${stale.map((s) => `  - ${s}`).join('\n')}`);
if (manifest.notes) console.log(`\nNota: ${manifest.notes}`);
if (manifest.afterApply?.length) console.log(`\nDepois de aplicar (configuracao fora do codigo):\n${manifest.afterApply.map((s, i) => `  ${i + 1}. ${render(s, ctx, 'template.json')}`).join('\n')}`);
if (!existsSync(join(root, projectDir, '.nvmrc'))) console.log(`\nAviso: ${projectDir}/.nvmrc nao existe e os workflows usam node-version-file; crie-o com a versao de Node do projeto.`);
