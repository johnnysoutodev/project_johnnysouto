// Verificador generico de sites Angular. Uso:
//   node verify.mjs --project ../../angular-app [--out <dir>] [--skip-build] [--skip-tests]
//                   [--skip-browser] [--skip-audit] [--audit-from <npm-audit.json>]
//                   [--spec <site-spec.json>] [--locales pt-br,en-us] [--viewports 375,768,1440]
// Nao usa o dev server do usuario: serve o `dist` do build numa porta efemera.
// Exit code 1 se qualquer check falhar; `warn` nao falha mas aparece no relatorio.
import { spawn } from 'node:child_process';
import { createServer } from 'node:http';
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, extname, join, relative, resolve } from 'node:path';
import { chromium } from 'playwright-core';
import AxeBuilder from '@axe-core/playwright';

const args = process.argv.slice(2);
const flag = (name) => args.includes(`--${name}`);
const opt = (name, fallback) => {
  const i = args.indexOf(`--${name}`);
  return i >= 0 ? args[i + 1] : fallback;
};

const project = resolve(opt('project', '.'));
const here = dirname(fileURLToPath(import.meta.url));
const repo = resolve(here, '..', '..');
// Relatorio sempre em site-factory/reports/latest do repositorio, onde o status.mjs procura (nao depende de onde o projeto mora).
const out = resolve(opt('out', join(here, '..', 'reports', 'latest')));

// Spec do cliente dono deste projeto (--spec ou descoberto em site-factory/clients/*/site-spec.json pelo build.projectDir).
function findSpec() {
  const explicit = opt('spec');
  if (explicit) return { file: resolve(explicit), spec: JSON.parse(readFileSync(resolve(explicit), 'utf8')) };
  const clients = join(here, '..', 'clients');
  if (!existsSync(clients)) return null;
  for (const id of readdirSync(clients)) {
    const file = join(clients, id, 'site-spec.json');
    if (!existsSync(file)) continue;
    const spec = JSON.parse(readFileSync(file, 'utf8'));
    if (spec.build?.projectDir && resolve(repo, spec.build.projectDir) === project) return { file, spec };
  }
  return null;
}
const owner = findSpec();
const viewports = opt('viewports', '375,768,1440').split(',').map(Number);
const localeFilter = opt('locales', '')?.split(',').filter(Boolean);
const themes = ['light', 'dark'];
const checks = [];

const add = (id, status, detail = '', items = []) => {
  checks.push({ id, status, detail, items });
  const mark = { pass: 'OK  ', fail: 'FAIL', warn: 'WARN', skipped: 'SKIP' }[status];
  console.log(`[${mark}] ${id}${detail ? ` - ${detail}` : ''}`);
};

function run(cmd, cmdArgs, cwd) {
  return new Promise((done) => {
    const child = spawn(cmd, cmdArgs, { cwd, env: { ...process.env, FORCE_COLOR: '0', CI: '1' } });
    let output = '';
    child.stdout.on('data', (d) => (output += d));
    child.stderr.on('data', (d) => (output += d));
    child.on('close', (code) => done({ code, output }));
  });
}

const countMatches = (text, re) => (text.match(re) ?? []).length;

// ---------- 1. build (SSR/prerender) ----------
async function checkBuild() {
  if (flag('skip-build')) return add('build', 'skipped', '--skip-build');
  const pkg = JSON.parse(readFileSync(join(project, 'package.json'), 'utf8'));
  const [cmd, cmdArgs] = pkg.scripts?.build ? ['npm', ['run', 'build']] : ['npx', ['ng', 'build']];
  const { code, output } = await run(cmd, cmdArgs, project);
  const warnings = countMatches(output, /\[WARNING\]|^\s*warning[: ]/gim);
  const errors = countMatches(output, /\[ERROR\]|^\s*error[: ]/gim);
  if (code !== 0 || errors) return add('build', 'fail', `exit ${code}, ${errors} erro(s)`, [output.slice(-3000)]);
  if (warnings) return add('build', 'fail', `${warnings} warning(s) - meta e zero`, [output.slice(-3000)]);
  add('build', 'pass', 'build de producao (com prerender) sem warnings/erros');
}

// ---------- 2. testes unitarios e lint ----------
async function checkTests() {
  if (flag('skip-tests')) return add('unit-tests', 'skipped', '--skip-tests');
  const { code, output } = await run('npx', ['ng', 'test', '--watch=false'], project);
  const warnings = countMatches(output, /\[WARNING\]|^\s*warning[: ]/gim);
  if (code !== 0) return add('unit-tests', 'fail', `exit ${code}`, [output.slice(-3000)]);
  add('unit-tests', warnings ? 'warn' : 'pass', warnings ? `${warnings} warning(s)` : 'ok');
  const lint = await run('npx', ['ng', 'lint'], project);
  add('lint', lint.code === 0 ? 'pass' : 'fail', lint.code === 0 ? 'ok' : `exit ${lint.code}`, lint.code === 0 ? [] : [lint.output.slice(-3000)]);
}

// ---------- 2b. vulnerabilidades de dependencias ----------
// Critica = falha; alta/moderada = aviso (o agente resolved-vulnerability corrige via overrides).
async function checkAudit() {
  if (flag('skip-audit')) return add('npm-audit', 'skipped', '--skip-audit');
  let raw;
  const from = opt('audit-from');
  if (from) raw = await readFile(resolve(from), 'utf8');
  else {
    if (!existsSync(join(project, 'package-lock.json'))) return add('npm-audit', 'warn', 'sem package-lock.json: nada a auditar (versione o lockfile)');
    raw = (await run('npm', ['audit', '--json'], project)).output;
  }
  let data;
  try {
    data = JSON.parse(raw.slice(raw.indexOf('{')));
  } catch {
    return add('npm-audit', 'warn', 'nao consegui auditar (registro indisponivel ou saida invalida do npm audit)', [raw.slice(0, 300)]);
  }
  if (data.error) return add('npm-audit', 'warn', `auditoria indisponivel: ${data.error.summary ?? data.error.code ?? 'erro do npm'}`);
  const v = data.metadata?.vulnerabilities ?? {};
  const items = Object.entries(data.vulnerabilities ?? {})
    .filter(([, i]) => ['critical', 'high', 'moderate'].includes(i.severity))
    .sort((a, b) => ['critical', 'high', 'moderate'].indexOf(a[1].severity) - ['critical', 'high', 'moderate'].indexOf(b[1].severity))
    .slice(0, 15)
    .map(([name, i]) => `${i.severity}: ${name}${i.isDirect ? ' (direta)' : ' (transitiva)'}${i.fixAvailable ? (i.fixAvailable === true ? ' - correcao disponivel' : ` - correcao em ${i.fixAvailable.name}@${i.fixAvailable.version}${i.fixAvailable.isSemVerMajor ? ' (MAJOR)' : ''}`) : ' - sem correcao'}`);
  const summary = `critica ${v.critical ?? 0}, alta ${v.high ?? 0}, moderada ${v.moderate ?? 0}, baixa ${v.low ?? 0}`;
  if (v.critical) return add('npm-audit', 'fail', `${summary}. Acione o agente resolved-vulnerability (overrides, sem --force)`, items);
  if (v.high || v.moderate) return add('npm-audit', 'warn', `${summary}`, items);
  add('npm-audit', 'pass', `sem vulnerabilidades altas ou criticas (${summary})`);
}

// ---------- 3. guarda de plataforma (heuristica; o build com prerender e a prova real) ----------
function walk(dir, acc = []) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) walk(p, acc);
    else if (p.endsWith('.ts') && !p.endsWith('.spec.ts')) acc.push(p);
  }
  return acc;
}

function checkPlatformGuards() {
  const src = join(project, 'src', 'app');
  if (!existsSync(src)) return add('platform-guards', 'skipped', 'src/app nao encontrado');
  const globals = /\b(document|window|localStorage|sessionStorage|matchMedia|navigator)\b\./;
  const guard = /isPlatformBrowser|afterNextRender|afterRender|inject\(DOCUMENT\)|inject\(WINDOW|typeof (window|document)/;
  const suspects = [];
  for (const file of walk(src)) {
    const text = readFileSync(file, 'utf8').replace(/\/\/.*$/gm, '').replace(/\/\*[\s\S]*?\*\//g, '');
    const lines = text.split('\n');
    const hit = lines.findIndex((l) => globals.test(l));
    if (hit >= 0 && !guard.test(text)) suspects.push(`${relative(project, file)}:${hit + 1}`);
  }
  if (suspects.length) return add('platform-guards', 'warn', `${suspects.length} arquivo(s) usam globals de navegador sem nenhuma guarda de plataforma`, suspects);
  add('platform-guards', 'pass', 'nenhum acesso a globals de navegador sem guarda');
}

// ---------- 4. servidor estatico do dist ----------
const TYPES = {
  '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8', '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png',
  '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp', '.avif': 'image/avif', '.ico': 'image/x-icon',
  '.woff2': 'font/woff2', '.woff': 'font/woff', '.txt': 'text/plain', '.xml': 'application/xml', '.pdf': 'application/pdf',
};

function findDist() {
  const dist = join(project, 'dist');
  if (!existsSync(dist)) return null;
  for (const name of readdirSync(dist)) {
    const browser = join(dist, name, 'browser');
    if (existsSync(browser)) return browser;
  }
  return null;
}

async function serve(root) {
  const server = createServer(async (req, res) => {
    const path = decodeURIComponent(new URL(req.url, 'http://x').pathname);
    const candidates = [path, `${path}.html`, join(path, 'index.html')];
    for (const c of candidates) {
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

// ---------- 5. checks no navegador ----------
const IGNORED_REQUESTS = /google-analytics|googletagmanager|gtag|analytics/i; // sem rede de terceiros no verificador

async function checkBrowser() {
  if (flag('skip-browser')) return add('browser', 'skipped', '--skip-browser');
  const dist = findDist();
  if (!dist) return add('browser', 'fail', 'dist nao encontrado - rode sem --skip-build');
  let locales = readdirSync(dist).filter((n) => statSync(join(dist, n)).isDirectory() && existsSync(join(dist, n, 'index.html')));
  if (!locales.length && existsSync(join(dist, 'index.html'))) locales = ['.'];
  if (localeFilter?.length) locales = locales.filter((l) => localeFilter.includes(l));
  if (!locales.length) return add('browser', 'fail', 'nenhuma pagina (index.html) encontrada no dist');

  const { server, base } = await serve(dist);
  let browser;
  try {
    browser = await chromium.launch({ channel: 'chrome' });
  } catch (error) {
    server.close();
    return add('browser', 'fail', `nao consegui abrir o Chrome: ${error.message.split('\n')[0]}`);
  }

  const seoNotes = new Set();
  const problems = { console: [], network: [], overflow: [], images: [], axe: [], seo: [], keyboard: [], placeholder: [] };
  const shots = join(out, 'screenshots');
  await rm(shots, { recursive: true, force: true }); // so as desta execucao (a pasta e gerada e ignorada pelo git)
  await mkdir(shots, { recursive: true });

  for (const locale of locales) {
    const url = locale === '.' ? `${base}/` : `${base}/${locale}/`;
    for (const theme of themes) {
      for (const width of viewports) {
        const tag = `${locale === '.' ? 'default' : locale}/${theme}/${width}`;
        const context = await browser.newContext({ viewport: { width, height: 900 }, colorScheme: theme });
        const page = await context.newPage();
        page.on('console', (m) => m.type() === 'error' && problems.console.push(`${tag}: ${m.text().slice(0, 200)}`));
        page.on('pageerror', (e) => problems.console.push(`${tag}: ${String(e).slice(0, 200)}`));
        page.on('response', (r) => r.status() >= 400 && !IGNORED_REQUESTS.test(r.url()) && problems.network.push(`${tag}: ${r.status()} ${r.url()}`));
        await context.route(IGNORED_REQUESTS, (route) => route.abort());
        await page.goto(url, { waitUntil: 'networkidle' });
        await page.evaluate(() => document.fonts.ready);

        const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
        if (overflow > 1) {
          // Elementos mais externos que passam do viewport (os filhos deles so herdam o problema).
          const culprits = await page.evaluate(() => {
            const vw = document.documentElement.clientWidth;
            const over = new Set([...document.body.querySelectorAll('*')].filter((e) => { const r = e.getBoundingClientRect(); return r.width > 0 && (r.right > vw + 1 || r.left < -1); }));
            const name = (e) => `${e.tagName.toLowerCase()}${e.id ? `#${e.id}` : ''}${[...e.classList].slice(0, 2).map((c) => `.${c}`).join('')}`;
            return [...over].filter((e) => !over.has(e.parentElement)).slice(0, 3).map((e) => { const r = e.getBoundingClientRect(); return `${name(e)} (esquerda ${Math.round(r.left)}, direita ${Math.round(r.right)}, largura ${Math.round(r.width)})`; });
          });
          problems.overflow.push(`${tag}: ${overflow}px de rolagem horizontal${culprits.length ? `; elemento(s) mais externo(s) que passa(m) do viewport: ${culprits.join(' | ')}` : ''}`);
        }

        const broken = await page.evaluate(() => [...document.images].filter((i) => i.complete && i.naturalWidth === 0).map((i) => i.currentSrc || i.src));
        broken.forEach((src) => problems.images.push(`${tag}: ${src}`));

        if (theme === 'light' && width === viewports[viewports.length - 1]) {
          const lorem = await page.evaluate(() => (document.body.innerText.match(/lorem ipsum/gi) ?? []).length);
          if (lorem) problems.placeholder.push(`${locale}: ${lorem} ocorrencia(s) de "Lorem ipsum" no texto visivel`);
        }

        const axe = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']).analyze();
        axe.violations.forEach((v) => problems.axe.push(`${tag}: [${v.impact}] ${v.id} (${v.nodes.length}x) ${v.nodes[0]?.target?.join(' ')}`));

        if (theme === 'light' && width === viewports[viewports.length - 1]) {
          const seo = await page.evaluate(() => ({
            lang: document.documentElement.lang,
            title: document.title.trim(),
            description: document.querySelector('meta[name="description"]')?.content?.trim() ?? '',
            h1: document.querySelectorAll('h1').length,
            canonical: !!document.querySelector('link[rel="canonical"]'),
          }));
          if (!seo.lang) problems.seo.push(`${locale}: <html lang> ausente`);
          if (!seo.title) problems.seo.push(`${locale}: <title> vazio`);
          if (!seo.description) problems.seo.push(`${locale}: meta description ausente`);
          if (seo.h1 !== 1) problems.seo.push(`${locale}: ${seo.h1} <h1> (esperado 1)`);
          if (!seo.canonical && (!owner || owner.spec.project?.domain)) problems.seo.push(`${locale}: link canonical ausente`);
          else if (!seo.canonical) seoNotes.add('canonical ausente: pendencia por design, o spec do cliente ainda nao tem project.domain');
        }

        if (theme === 'light') await keyboardCheck(page, tag, problems.keyboard);
        await page.screenshot({ path: join(shots, `${tag.replaceAll('/', '_')}.png`), fullPage: true });
        await context.close();
      }
    }
  }
  await browser.close();
  server.close();

  const report = (id, list, level = 'fail', ok = 'ok') => {
    const unique = [...new Set(list)];
    unique.length ? add(id, level, `${unique.length} ocorrencia(s)`, unique.slice(0, 40)) : add(id, 'pass', ok);
  };
  const scope = `${locales.length} idioma(s) x ${themes.length} tema(s) x ${viewports.length} viewport(s)`;
  report('console-errors', problems.console, 'fail', `sem erros de console (${scope})`);
  report('network-errors', problems.network, 'fail', 'sem respostas 4xx/5xx');
  report('horizontal-overflow', problems.overflow, 'fail', 'sem rolagem horizontal');
  report('broken-images', problems.images, 'fail', 'todas as imagens carregaram');
  report('a11y-axe', problems.axe, 'fail', `axe WCAG A/AA sem violacoes (${scope})`);
  report('seo-basics', problems.seo, 'warn', `lang, title, description e h1 unico presentes${seoNotes.size ? ` (${[...seoNotes].join('; ')})` : ' e canonical presente'}`);
  report('placeholder-content', problems.placeholder, 'warn', 'sem Lorem Ipsum no texto visivel');
  report('keyboard-focus', problems.keyboard, 'fail', 'Tab so pousa em elementos visiveis e nao-inert');
  add('screenshots', 'pass', shots);
}

async function keyboardCheck(page, tag, sink) {
  const seen = new Set();
  for (let i = 0; i < 60; i++) {
    await page.keyboard.press('Tab');
    const info = await page.evaluate(() => {
      const el = document.activeElement;
      if (!el || el === document.body) return { body: true };
      const r = el.getBoundingClientRect();
      const style = getComputedStyle(el);
      return {
        key: `${el.tagName}#${el.id}.${String(el.className).slice(0, 40)}|${(el.textContent ?? '').trim().slice(0, 30)}`,
        inert: !!el.closest('[inert]'),
        hidden: (r.width === 0 && r.height === 0) || style.visibility === 'hidden' || style.display === 'none',
      };
    });
    if (info.body) continue;
    if (info.inert) sink.push(`${tag}: foco em elemento inert (${info.key})`);
    if (info.hidden) sink.push(`${tag}: foco em elemento invisivel (${info.key})`);
    if (seen.has(info.key) && seen.size > 1) break;
    seen.add(info.key);
  }
  if (!seen.size) sink.push(`${tag}: nenhum elemento focavel por teclado`);
}

// ---------- execucao e relatorio ----------
console.log(`Verificando ${project}\n`);
await checkBuild();
checkPlatformGuards();
await checkTests();
await checkAudit();
await checkBrowser();

await mkdir(out, { recursive: true });
const summary = { project, spec: owner?.file ?? null, at: new Date().toISOString(), failed: checks.filter((c) => c.status === 'fail').length, checks };
await writeFile(join(out, 'report.json'), JSON.stringify(summary, null, 2));
const icon = { pass: 'OK', fail: 'FALHA', warn: 'AVISO', skipped: 'PULADO' };
const md = [
  `# Relatorio do verifier`, '', `- Projeto: \`${project}\``, `- Data: ${summary.at}`, `- Falhas: **${summary.failed}**`, '',
  '| Check | Status | Detalhe |', '|---|---|---|',
  ...checks.map((c) => `| ${c.id} | ${icon[c.status]} | ${c.detail} |`), '',
  ...checks.filter((c) => c.items.length).flatMap((c) => [`## ${c.id}`, '', ...c.items.map((i) => (i.includes('\n') ? `\`\`\`\n${i}\n\`\`\`` : `- ${i}`)), '']),
].join('\n');
await writeFile(join(out, 'report.md'), md);
console.log(`\n${summary.failed ? 'REPROVADO' : 'APROVADO'} - relatorio em ${join(out, 'report.md')}`);
process.exit(summary.failed ? 1 : 0);
