// Captura para QA visual: serve o build, recorta cada secao, mede estilos computados e compara com o Figma.
//   node qa-capture.mjs --project <dir> [--variant desktop-light] [--sections hero,sobre] [--locale pt-br] [--spec <site-spec>] [--out <dir>]
// Variantes: <dispositivo>-<tema> (desktop 1440, tablet 768, mobile 375; light/dark). Overlays (-menu) ficam para o smoke de interacao.
// Saidas (em site-factory/reports/qa/<cliente>/<variante>/, ignorado pelo git): <secao>.png, measures.json e summary.md.
// A referencia do Figma vem de `figma-map.mjs image` (reports/figma/<fileKey>/ref/<variante>/) e `figma-map.mjs variants`.
import { existsSync, readFileSync } from 'node:fs';
import { mkdir, rm, writeFile } from 'node:fs/promises';
import { join, resolve } from 'node:path';
import { chromium } from 'playwright-core';
import { findDist, findLocales, findOwnerSpec, repoRoot, serve, siteFactory } from './lib/site.mjs';

const args = process.argv.slice(2);
const opt = (n, d) => (args.includes(`--${n}`) ? args[args.indexOf(`--${n}`) + 1] : d);
const project = resolve(opt('project', '.'));
const variant = opt('variant', 'desktop-light');
const [device, theme] = variant.split('-');
const WIDTH = { desktop: 1440, tablet: 768, mobile: 375 }[device];
if (!WIDTH || !['light', 'dark'].includes(theme) || variant.endsWith('-menu')) {
  console.error(`Variante invalida ou nao suportada: "${variant}" (use desktop|tablet|mobile + light|dark).`);
  process.exit(2);
}

const owner = findOwnerSpec(project, opt('spec'));
if (!owner) {
  console.error('Spec do cliente nao encontrado (--spec ou build.projectDir apontando para este projeto).');
  process.exit(2);
}
const { spec } = owner;
const dist = findDist(project);
if (!dist) {
  console.error('dist nao encontrado: faca o build do projeto antes (npx ng build).');
  process.exit(2);
}
const locales = findLocales(dist);
const wantLocale = opt('locale') ?? (spec.locales.targets?.length ? spec.locales.source.toLowerCase() : '.');
const locale = locales.includes(wantLocale) ? wantLocale : locales[0];
const only = opt('sections')?.split(',');
const sections = spec.sections.filter((s) => !only || only.includes(s.id));

// Alturas das secoes no Figma (variants.json) por node id.
const key = spec.design.figma.fileKey;
const variantsFile = join(siteFactory, 'reports', 'figma', key, 'variants.json');
const figmaHeight = {};
if (existsSync(variantsFile)) {
  for (const v of Object.values(JSON.parse(readFileSync(variantsFile, 'utf8')).variants)) for (const s of v.sections) figmaHeight[s.id] = s.height;
}
const nodeOf = (s) => s.figmaVariants?.[variant] ?? (variant === 'desktop-light' ? s.figmaNode : null);
const refDir = join(siteFactory, 'reports', 'figma', key, 'ref', variant);

const out = resolve(opt('out', join(siteFactory, 'reports', 'qa', spec.client.id, variant)));
await rm(out, { recursive: true, force: true });
await mkdir(out, { recursive: true });

// Medicao e achados rodam dentro da pagina (um unico evaluate por secao).
function inspect(root) {
  const px = (v) => Math.round(parseFloat(v) * 100) / 100;
  const css = (el, props) => Object.fromEntries(props.map((p) => [p, getComputedStyle(el)[p]]));
  const describe = (el) => `${el.tagName.toLowerCase()}${el.id ? `#${el.id}` : ''}${[...el.classList].slice(0, 2).map((c) => `.${c}`).join('')}`;
  const bgOf = (el) => {
    for (let e = el; e; e = e.parentElement) {
      const c = getComputedStyle(e).backgroundColor;
      if (c && c !== 'rgba(0, 0, 0, 0)' && c !== 'transparent') return c;
    }
    return 'transparent';
  };
  const text = (el) => (el ? { tag: el.tagName.toLowerCase(), sample: el.textContent.trim().slice(0, 40), ...css(el, ['fontFamily', 'fontSize', 'fontWeight', 'lineHeight', 'letterSpacing', 'color']) } : null);
  const rect = root.getBoundingClientRect();
  const visible = (el) => el.getClientRects().length > 0 && getComputedStyle(el).visibility !== 'hidden';

  // Palavra longa sem espaco que ocupa mais de uma linha = quebrada no meio.
  const brokenWords = [];
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  for (let n = walker.nextNode(); n; n = walker.nextNode()) {
    if (!n.parentElement || !visible(n.parentElement)) continue;
    const re = /\S{9,}/g;
    for (let m = re.exec(n.textContent); m; m = re.exec(n.textContent)) {
      const r = document.createRange();
      r.setStart(n, m.index);
      r.setEnd(n, m.index + m[0].length);
      const lines = new Set([...r.getClientRects()].filter((x) => x.width > 0).map((x) => Math.round(x.top / 3)));
      if (lines.size > 1) brokenWords.push({ word: m[0], lines: lines.size, element: describe(n.parentElement) });
    }
  }
  // Texto cortado: contentor com overflow oculto cujo conteudo e maior que a caixa.
  const clipped = [...root.querySelectorAll('*')].filter((e) => {
    const o = getComputedStyle(e).overflowX;
    return (o === 'hidden' || o === 'clip') && e.scrollWidth > e.clientWidth + 1 && e.textContent.trim();
  }).map((e) => ({ element: describe(e), scrollWidth: e.scrollWidth, clientWidth: e.clientWidth }));
  const stretched = [...root.querySelectorAll('img')].filter((i) => i.naturalWidth && i.clientWidth && Math.abs(i.naturalWidth / i.naturalHeight - i.clientWidth / i.clientHeight) > 0.05)
    .map((i) => ({ element: describe(i), natural: `${i.naturalWidth}x${i.naturalHeight}`, rendered: `${i.clientWidth}x${i.clientHeight}` }));
  const smallTargets = [...root.querySelectorAll('a[href], button, [role="button"]')].filter((e) => visible(e)).map((e) => ({ e, r: e.getBoundingClientRect() }))
    .filter(({ r }) => r.width > 0 && (r.width < 24 || r.height < 24)).map(({ e, r }) => ({ element: describe(e), size: `${Math.round(r.width)}x${Math.round(r.height)}` }));

  return {
    width: Math.round(rect.width), height: Math.round(rect.height),
    padding: css(root, ['paddingTop', 'paddingRight', 'paddingBottom', 'paddingLeft']),
    background: bgOf(root),
    heading: text(root.querySelector('h1, h2, h3')),
    paragraph: text(root.querySelector('p')),
    // Componentes pequenos que o design especifica (tags, botoes, links, icones): tipografia, caixa, cor e raio de cada um.
    components: [...root.querySelectorAll('[class*="tag"], [class*="badge"], app-tag, button, a[href], app-icon-button, [class*="icon-button"]')]
      .filter((e) => visible(e) && !e.closest('button, a[href]') || e.matches('button, a[href]'))
      .slice(0, 10)
      .map((e) => {
        const r = e.getBoundingClientRect();
        return { element: describe(e), text: e.textContent.trim().slice(0, 24), box: `${Math.round(r.width)}x${Math.round(r.height)}`, ...css(e, ['fontSize', 'fontWeight', 'lineHeight', 'color', 'backgroundColor', 'borderRadius', 'padding']) };
      }),
    // Geometria dos blocos (x, y relativos a secao; largura, altura, flex-grow, gap), para comparar com `figma-map.mjs layout`.
    geometry: (() => {
      const lines = [];
      (function visit(el, depth) {
        if (depth > 0 && visible(el)) {
          const r = el.getBoundingClientRect();
          const cs = getComputedStyle(el);
          const bits = [`x=${Math.round(r.left - rect.left)}`, `y=${Math.round(r.top - rect.top)}`, `w=${Math.round(r.width)}`, `h=${Math.round(r.height)}`];
          if (cs.display.includes('flex') || cs.display.includes('grid')) bits.push(`display=${cs.display}`, `dir=${cs.flexDirection}`, cs.rowGap !== 'normal' && cs.rowGap !== '0px' ? `gap=${cs.rowGap}/${cs.columnGap}` : '', cs.alignItems !== 'normal' ? `align-items=${cs.alignItems}` : '');
          if (cs.flexGrow !== '0') bits.push(`flex-grow=${cs.flexGrow}`);
          lines.push(`${'  '.repeat(depth - 1)}${describe(el).slice(0, 34).padEnd(34)} ${bits.filter(Boolean).join(' ')}`);
        }
        if (depth < 4) for (const c of el.children) visit(c, depth + 1);
      })(root, 0);
      return lines;
    })(),
    headingsAll: [...root.querySelectorAll('h1, h2, h3, h4')].slice(0, 4).map(text),
    paragraphsAll: [...root.querySelectorAll('p')].slice(0, 3).map(text),
    counts: { headings: root.querySelectorAll('h1,h2,h3,h4').length, links: root.querySelectorAll('a[href]').length, buttons: root.querySelectorAll('button').length, images: root.querySelectorAll('img').length },
    findings: { brokenWords, clipped, stretched, smallTargets },
    scrollHeightMatches: px(root.scrollHeight) === px(root.clientHeight),
  };
}

const { server, base } = await serve(dist);
const browser = await chromium.launch({ channel: 'chrome' });
const context = await browser.newContext({ viewport: { width: WIDTH, height: 900 }, colorScheme: theme });
const page = await context.newPage();
await context.route(/google-analytics|googletagmanager|gtag|analytics/i, (r) => r.abort());
await page.goto(locale === '.' ? `${base}/` : `${base}/${locale}/`, { waitUntil: 'networkidle' });
await page.evaluate(() => document.fonts.ready);

const measures = {};
for (const s of sections) {
  const handle = (await page.$(`#${s.id}`)) ?? (await page.$(`app-${s.id}`));
  if (!handle) {
    measures[s.id] = { missing: true };
    continue;
  }
  measures[s.id] = await handle.evaluate(inspect);
  await handle.screenshot({ path: join(out, `${s.id}.png`) });
}
await browser.close();
server.close();

// Resumo para o agente de QA e para leitura humana.
const rows = [];
let flagged = 0;
for (const s of sections) {
  const m = measures[s.id];
  const node = nodeOf(s);
  const fh = node ? figmaHeight[node] : undefined;
  if (m.missing) {
    rows.push(`| ${s.id} | (sem elemento #${s.id} no DOM) | ${fh ?? '-'} | - | - |`);
    flagged++;
    continue;
  }
  const f = m.findings;
  const flags = [f.brokenWords.length && `palavra quebrada: ${f.brokenWords.map((b) => `"${b.word}" (${b.element})`).join(', ')}`, f.clipped.length && `texto cortado: ${f.clipped.map((c) => c.element).join(', ')}`, f.stretched.length && `imagem deformada: ${f.stretched.map((c) => c.element).join(', ')}`, f.smallTargets.length && `alvo pequeno: ${f.smallTargets.map((c) => `${c.element} ${c.size}`).join(', ')}`].filter(Boolean);
  if (flags.length) flagged++;
  const delta = fh ? `${m.height - fh >= 0 ? '+' : ''}${m.height - fh}px (${Math.round(((m.height - fh) / fh) * 100)}%)` : '-';
  rows.push(`| ${s.id} | ${m.height}px | ${fh ? `${fh}px` : '-'} | ${delta} | ${flags.join('; ') || 'nenhum'} |`);
}
const md = [
  `# QA visual: ${spec.client.id} (${variant}, ${WIDTH}px, idioma ${locale})`, '',
  '| Secao | Altura renderizada | Altura no Figma | Diferenca | Achados automaticos |', '|---|---|---|---|---|', ...rows, '',
  `- Recortes renderizados: \`${out}/<secao>.png\``,
  `- Referencias do Figma: \`${refDir}/<secao>.png\` ${existsSync(refDir) ? '(existem)' : '(ausentes: rode `figma-map.mjs image --spec <spec> --variant ' + variant + '`)'}`,
  `- Medidas completas por secao: \`${out}/measures.json\`; geometria dos blocos do DOM: \`${out}/geometry.txt\` (compare com \`figma-map.mjs layout --ids <no>\`)`,
  '- Conteudo placeholder muda a altura: diferenca de altura nao e defeito por si so; confira nas imagens.',
].join('\n');
await writeFile(join(out, 'measures.json'), JSON.stringify(measures, null, 2));
await writeFile(join(out, 'geometry.txt'), sections.map((s) => `## ${s.id}\n${(measures[s.id].geometry ?? []).join('\n')}`).join('\n\n'));
await writeFile(join(out, 'summary.md'), md);
console.log(md);
console.log(`\n${flagged} secao(oes) com achado automatico. Saida: ${out}`);
