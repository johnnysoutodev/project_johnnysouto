// Portao de qualidade de codigo (sem navegador, entao serve tambem no CI de deploy).
// Politica (decisoes do dono do projeto):
//  - Teste unitario SO na logica; cobertura de 100% (linhas, ramos, funcoes, instrucoes) no escopo "logica".
//  - Logica = todo .ts de src/app exceto: spec, componentes/diretivas (UI), dados, rotas, configuracao e main.
//    Componente e fino: a logica dele mora em funcao/servico, que entra na cobertura.
//  - HTML e SCSS sempre em arquivos separados; SCSS em BEM, tudo amarrado a tokens e a breakpoints centralizados.
//  - Nada solto: token usado e nao definido, componente sem arquivo, logica sem spec.
import { spawnSync } from 'node:child_process';
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { createRequire } from 'node:module';
import { join, relative } from 'node:path';

const MAX_UI_BRANCHES = 3;

function run(cmd, args, cwd) {
  const r = spawnSync(cmd, args, { cwd, encoding: 'utf8', env: { ...process.env, FORCE_COLOR: '0', CI: '1' }, maxBuffer: 64 * 1024 * 1024 });
  return { code: r.status ?? 1, output: `${r.stdout ?? ''}${r.stderr ?? ''}` };
}

function walk(dir, ok, acc = []) {
  if (!existsSync(dir)) return acc;
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (name === 'node_modules') continue;
    if (statSync(p).isDirectory()) walk(p, ok, acc);
    else if (ok(p)) acc.push(p);
  }
  return acc;
}

const strip = (text) => text.replace(/\/\*[\s\S]*?\*\//g, '').replace(/(^|[^:])\/\/.*$/gm, '$1');
const NON_LOGIC = /(^|\/)(main(\.server)?|server|app\.config(\.server)?|app\.routes(\.server)?)\.ts$|\.(data|routes|config|d|model|types)\.ts$/;

// Classifica os .ts de src/app.
export function classify(project) {
  const src = join(project, 'src', 'app');
  const files = walk(src, (p) => p.endsWith('.ts'));
  const ui = [];
  const logic = [];
  const specs = [];
  for (const f of files) {
    const text = strip(readFileSync(f, 'utf8'));
    if (f.endsWith('.spec.ts')) specs.push(f);
    else if (/@(Component|Directive)\s*\(/.test(text)) ui.push(f);
    else if (!NON_LOGIC.test(f) && /export\s+(default\s+)?(async\s+)?(function|class|const|let|enum)\b/.test(text)) logic.push(f);
  }
  return { ui, logic, specs, all: files };
}

const items = (list, n = 25) => (list.length > n ? [...list.slice(0, n), `... e mais ${list.length - n}`] : list);

function lintCheck(project) {
  const pkg = JSON.parse(readFileSync(join(project, 'package.json'), 'utf8'));
  if (!pkg.scripts?.lint) return { id: 'lint', status: 'fail', detail: 'sem script `lint` (aplique templates/angular/eslint.config.js)', items: [] };
  const r = run('npm', ['run', 'lint'], project);
  const problems = r.output.split('\n').filter((l) => /\berror\b|\bwarning\b|✖/.test(l) && !/^npm /.test(l));
  return r.code === 0 ? { id: 'lint', status: 'pass', detail: 'ESLint (regras de clean code e arquivos separados) sem erros', items: [] } : { id: 'lint', status: 'fail', detail: `ESLint reprovou (${problems.length} linha(s) de erro)`, items: items(problems.length ? problems : [r.output.slice(-1500)]) };
}

function stylelintCheck(project) {
  if (!existsSync(join(project, 'node_modules', '.bin', 'stylelint')) || !['stylelint.config.cjs', 'stylelint.config.js', '.stylelintrc.json'].some((f) => existsSync(join(project, f)))) {
    return { id: 'stylelint', status: 'fail', detail: 'Stylelint nao configurado (aplique templates/angular/stylelint.config.cjs e instale stylelint + stylelint-config-recommended-scss)', items: [] };
  }
  const r = run('npx', ['stylelint', 'src/**/*.scss', '--formatter', 'json'], project);
  let results = [];
  try {
    results = JSON.parse((r.output.match(/\[\s*\{[\s\S]*\}\s*\]/) ?? ['[]'])[0]);
  } catch {
    return { id: 'stylelint', status: 'fail', detail: 'saida invalida do Stylelint', items: [r.output.slice(-800)] };
  }
  const warnings = results.flatMap((f) => f.warnings.map((w) => ({ file: relative(project, f.source), ...w })));
  const byRule = warnings.reduce((m, w) => ({ ...m, [w.rule]: (m[w.rule] ?? 0) + 1 }), {});
  const summary = Object.entries(byRule).map(([k, v]) => `${k} x${v}`).join(', ');
  return warnings.length
    ? { id: 'stylelint', status: 'fail', detail: `${warnings.length} violacao(oes): ${summary}`, items: items(warnings.map((w) => `${w.file}:${w.line} [${w.rule}] ${w.text.replace(/\s*\(.*\)$/, '')}`), 40) }
    : { id: 'stylelint', status: 'pass', detail: 'SCSS em BEM, sem cor/espacamento/breakpoint cru, sem !important nem ::ng-deep', items: [] };
}

function testsAndCoverage(project, { logic, ui, specs }) {
  const out = [];
  const exclude = ['**/*.spec.ts', ...ui.map((f) => relative(project, f)), ...walk(join(project, 'src', 'app'), (p) => NON_LOGIC.test(p) && p.endsWith('.ts')).map((f) => relative(project, f))];
  const args = ['ng', 'test', '--watch=false', '--coverage', '--coverage-reporters', 'json-summary', '--coverage-include', 'src/app/**/*.ts', ...exclude.flatMap((e) => ['--coverage-exclude', e])];
  const r = run('npx', args, project);
  const text = r.output.replace(/\x1b\[[0-9;]*m/g, '');
  const missingProvider = /coverage-v8|coverage provider|Cannot find (package|module).*coverage/i.test(text) && r.code !== 0;
  const failedTests = /\b(\d+) failed\b|Tests?\s+.*failed/i.test(text);
  out.push(r.code === 0 || (!missingProvider && !failedTests && /Tests\s+\d+ passed/.test(text))
    ? { id: 'unit-tests', status: 'pass', detail: (text.match(/Tests\s+(\d+ passed[^\n]*)/) ?? ['', 'ok'])[1].trim(), items: [] }
    : { id: 'unit-tests', status: 'fail', detail: missingProvider ? 'cobertura indisponivel: instale @vitest/coverage-v8 (mesma versao do vitest)' : 'testes falharam', items: items(text.split('\n').filter((l) => /FAIL|Error|✗|×/.test(l)).slice(0, 15)) });
  if (missingProvider) {
    // Sem o pacote de cobertura, ainda roda os testes de verdade: o resultado dos testes nao depende da cobertura.
    const plain = run('npx', ['ng', 'test', '--watch=false'], project);
    const plainText = plain.output.replace(/\x1b\[[0-9;]*m/g, '');
    out[0] = plain.code === 0
      ? { id: 'unit-tests', status: 'pass', detail: `${(plainText.match(/Tests\s+(\d+ passed[^\n]*)/) ?? ['', 'ok'])[1].trim()} (sem cobertura: instale @vitest/coverage-v8)`, items: [] }
      : { id: 'unit-tests', status: 'fail', detail: 'testes falharam', items: items(plainText.split('\n').filter((l) => /FAIL|Error|✗|×/.test(l)).slice(0, 15)) };
    out.push({ id: 'coverage', status: 'fail', detail: 'sem @vitest/coverage-v8: nao foi possivel medir a cobertura (instale a mesma versao do vitest)', items: [] });
    return out;
  }
  const summaryFile = walk(join(project, 'coverage'), (p) => p.endsWith('coverage-summary.json')).sort((a, b) => statSync(b).mtimeMs - statSync(a).mtimeMs)[0];
  if (!summaryFile) {
    out.push({ id: 'coverage', status: 'fail', detail: 'relatorio de cobertura (coverage-summary.json) nao foi gerado', items: [text.slice(-500)] });
    return out;
  }
  const summary = JSON.parse(readFileSync(summaryFile, 'utf8'));
  const below = [];
  for (const [file, m] of Object.entries(summary)) {
    if (file === 'total') continue;
    const bad = ['lines', 'statements', 'functions', 'branches'].filter((k) => m[k].total > 0 && m[k].pct < 100).map((k) => `${k} ${m[k].pct}%`);
    if (bad.length) below.push(`${relative(project, file)}: ${bad.join(', ')}`);
  }
  const covered = Object.keys(summary).filter((k) => k !== 'total').map((f) => relative(project, f));
  const untracked = logic.map((f) => relative(project, f)).filter((f) => !covered.includes(f) && !below.some((b) => b.startsWith(f)));
  const all = [...below, ...untracked.map((f) => `${f}: fora do relatorio de cobertura (sem teste?)`)];
  out.push(all.length ? { id: 'coverage', status: 'fail', detail: `${all.length} arquivo(s) de logica abaixo de 100%`, items: items(all) } : { id: 'coverage', status: 'pass', detail: `100% de cobertura na logica (${logic.length} arquivo(s))`, items: [] });
  return out;
}

function componentFiles(project, ui) {
  const bad = [];
  for (const f of ui) {
    const text = strip(readFileSync(f, 'utf8'));
    const rel = relative(project, f);
    if (/\btemplate\s*:/.test(text)) bad.push(`${rel}: template inline (use templateUrl com .html separado)`);
    if (/\bstyles\s*:/.test(text)) bad.push(`${rel}: styles inline (use styleUrl com .scss separado)`);
    const tpl = text.match(/templateUrl\s*:\s*['"]([^'"]+)['"]/);
    const sty = text.match(/styleUrls?\s*:\s*\[?\s*['"]([^'"]+)['"]/);
    if (!tpl && !/\btemplate\s*:/.test(text)) bad.push(`${rel}: sem templateUrl`);
    else if (tpl && !existsSync(join(f, '..', tpl[1]))) bad.push(`${rel}: templateUrl ${tpl[1]} nao existe`);
    if (!sty) bad.push(`${rel}: sem styleUrl (todo componente tem o seu .scss)`);
    else if (!existsSync(join(f, '..', sty[1]))) bad.push(`${rel}: styleUrl ${sty[1]} nao existe`);
  }
  return bad.length ? { id: 'component-files', status: 'fail', detail: `${bad.length} problema(s) de arquivos do componente`, items: items(bad) } : { id: 'component-files', status: 'pass', detail: `${ui.length} componente(s), todos com .html e .scss separados`, items: [] };
}


// BEM de verdade: toda classe do SCSS de um componente leva o nome do bloco (o nome do arquivo): .hero, .hero__texto, .hero--destaque.
// Resolve o aninhamento (`&__texto`, `&--destaque`) com o parser de SCSS do proprio Stylelint: sem isso, BEM errado escrito
// com `&` ficaria invisivel (a regra do Stylelint e uma regex por texto nao resolvem o `&`). Sem o parser, cai na regex.
function resolvedSelectors(project, file) {
  let postcssScss;
  try {
    postcssScss = createRequire(join(project, 'package.json'))('postcss-scss');
  } catch {
    return null;
  }
  const root = postcssScss.parse(readFileSync(file, 'utf8'));
  const out = [];
  const visit = (node, parents, ctx) => {
    for (const child of node.nodes ?? []) {
      if (child.type === 'rule') {
        const own = child.selectors.map((s) => s.trim());
        const full = parents.length
          ? own.flatMap((s) => parents.map((p) => (s.includes('&') ? s.replaceAll('&', p) : `${p} ${s}`)))
          : own;
        const list = [...full].sort().join(', ');
        out.push(...full.map((selector) => ({ selector, list, line: child.source?.start?.line, ctx })));
        visit(child, full, ctx);
      } else if (child.type === 'atrule') visit(child, parents, `${ctx}@${child.name} ${child.params};`);
    }
  };
  visit(root, [], '');
  return out;
}

export function bemBlocks(project) {
  const bad = [];
  const files = walk(join(project, 'src', 'app'), (p) => p.endsWith('.scss'));
  let resolved = true;
  for (const f of files) {
    const block = f.split('/').pop().replace(/\.scss$/, '');
    const ok = new RegExp(`^${block}(__[a-z0-9]+(-[a-z0-9]+)*)?(--[a-z0-9]+(-[a-z0-9]+)*)?$`);
    const rel = relative(project, f);
    const sels = resolvedSelectors(project, f);
    let found;
    if (sels) {
      found = sels.flatMap(({ selector, line }) => [...selector.matchAll(/\.([A-Za-z][\w-]*)/g)].map((m) => ({ cls: m[1], line, selector })));
      const seen = new Map();
      for (const { list, line, ctx } of sels) {
        // Duplicata = a LISTA inteira de seletores de duas regras igual, no MESMO contexto (como o no-duplicate-selectors do Stylelint):
        // `.a, .b { ... }` seguido de `.a { ... }` e idioma legitimo, e o mesmo seletor dentro de @include mobile-only e a versao mobile.
        const key = `${ctx}|${list}`;
        if (seen.has(key) && seen.get(key) !== line) bad.push(`${rel}:${line}: regra duplicada ${list}${ctx ? ` (em ${ctx.replace(/;$/, '')})` : ''} (agrupe as declaracoes)`);
        if (!seen.has(key)) seen.set(key, line);
      }
    } else {
      resolved = false;
      const text = strip(readFileSync(f, 'utf8')).replace(/@(use|forward|import)[^;]*;/g, '').replace(/url\([^)]*\)/g, '').replace(/['"][^'"]*['"]/g, '');
      found = [...new Set([...text.matchAll(/(?<![\w\d.-])\.([a-z][a-z0-9_-]*)/gi)].map((m) => m[1]))].map((cls) => ({ cls }));
    }
    const reported = new Set();
    for (const { cls, line } of found) {
      if (ok.test(cls) || reported.has(cls)) continue;
      reported.add(cls);
      bad.push(`${rel}${line ? `:${line}` : ''}: .${cls} (esperado .${block}, .${block}__elemento ou .${block}--modificador, minusculas)`);
    }
  }
  const how = resolved ? 'aninhamento resolvido' : 'sem o parser de SCSS: so classes escritas por inteiro (instale o stylelint)';
  return bad.length ? { id: 'bem-block', status: 'fail', detail: `${bad.length} problema(s) de BEM ou duplicacao (${how})`, items: items(bad, 40) } : { id: 'bem-block', status: 'pass', detail: `todas as classes de ${files.length} SCSS de componente seguem o bloco BEM do arquivo, sem seletor duplicado (${how})`, items: [] };
}

function tokenChecks(project) {
  const files = walk(join(project, 'src'), (p) => /\.(scss|html|ts)$/.test(p) && !p.endsWith('.spec.ts'));
  const defined = new Set();
  const used = new Map();
  for (const f of files) {
    const text = readFileSync(f, 'utf8');
    if (f.endsWith('.scss')) for (const m of text.matchAll(/(--[a-z][\w-]*)\s*:/gi)) defined.add(m[1]);
    for (const m of text.matchAll(/style\.(--[a-z][\w-]*)/gi)) defined.add(m[1]);
    for (const m of text.matchAll(/setProperty\(\s*['"`](--[a-z][\w-]*)/gi)) defined.add(m[1]);
    for (const m of text.matchAll(/['"`](--[a-z][\w-]*)['"`]\s*:/gi)) defined.add(m[1]);
    for (const m of text.matchAll(/var\(\s*(--[a-z][\w-]*)/gi)) used.set(m[1], [...(used.get(m[1]) ?? []), relative(project, f)]);
  }
  const undefinedTokens = [...used.keys()].filter((t) => !defined.has(t));
  const unused = [...defined].filter((t) => !used.has(t));
  return [
    undefinedTokens.length ? { id: 'tokens-undefined', status: 'fail', detail: `${undefinedTokens.length} token(s) usados em var() e nunca definidos`, items: items(undefinedTokens.map((t) => `${t} (usado em ${[...new Set(used.get(t))].join(', ')})`)) } : { id: 'tokens-undefined', status: 'pass', detail: 'todo var(--x) tem definicao (SCSS, binding de estilo ou setProperty)', items: [] },
    unused.length ? { id: 'tokens-unused', status: 'warn', detail: `${unused.length} token(s) definidos e nunca usados`, items: items(unused) } : { id: 'tokens-unused', status: 'pass', detail: 'nenhum token definido sem uso', items: [] },
  ];
}

function logicSpecs(project, { logic }) {
  const missing = logic.filter((f) => !existsSync(f.replace(/\.ts$/, '.spec.ts'))).map((f) => `${relative(project, f)}: sem ${relative(project, f).replace(/\.ts$/, '.spec.ts').split('/').pop()}`);
  return missing.length ? { id: 'logic-specs', status: 'fail', detail: `${missing.length} arquivo(s) de logica sem spec`, items: items(missing) } : { id: 'logic-specs', status: 'pass', detail: `todo arquivo de logica tem o seu .spec.ts (${logic.length})`, items: [] };
}

function uiChecks(project, { ui, specs }) {
  const uiSpecs = specs.filter((f) => /TestBed\.createComponent|ComponentFixture/.test(readFileSync(f, 'utf8'))).map((f) => `${relative(project, f)}: teste de componente (a politica e testar so a logica)`);
  const thick = ui.map((f) => {
    const t = strip(readFileSync(f, 'utf8'));
    const n = (t.match(/\bif\s*\(|\bswitch\s*\(|\bfor\s*\(|\bwhile\s*\(|\?\s*[^:?\n]+:/g) ?? []).length;
    return { f, n };
  }).filter((x) => x.n > MAX_UI_BRANCHES).map((x) => `${relative(project, x.f)}: ${x.n} ramificacoes na classe do componente (extraia a logica para funcao/servico, que entra na cobertura de 100%)`);
  return [
    uiSpecs.length ? { id: 'ui-specs', status: 'warn', detail: `${uiSpecs.length} spec(s) de componente (a politica e testar so a logica)`, items: items(uiSpecs) } : { id: 'ui-specs', status: 'pass', detail: 'nenhum teste de componente: testes so na logica', items: [] },
    thick.length ? { id: 'ui-thin', status: 'warn', detail: `${thick.length} componente(s) com logica demais na classe`, items: items(thick) } : { id: 'ui-thin', status: 'pass', detail: `componentes finos (ate ${MAX_UI_BRANCHES} ramificacoes por classe)`, items: [] },
  ];
}

// Executa todos os checks; `mode: 'report'` rebaixa falha para aviso (projeto legado em adocao gradual).
export function runCodeQuality(project, { mode = 'enforce', skipTests = false } = {}) {
  const cls = classify(project);
  const checks = [lintCheck(project), stylelintCheck(project)];
  if (skipTests) checks.push({ id: 'unit-tests', status: 'skipped', detail: '--skip-tests', items: [] }, { id: 'coverage', status: 'skipped', detail: '--skip-tests', items: [] });
  else checks.push(...testsAndCoverage(project, cls));
  checks.push(componentFiles(project, cls.ui), bemBlocks(project), ...tokenChecks(project), logicSpecs(project, cls), ...uiChecks(project, cls));
  if (mode === 'report') for (const c of checks) if (c.status === 'fail') Object.assign(c, { status: 'warn', detail: `${c.detail} [modo report: nao bloqueia]` });
  return { checks, scope: { logic: cls.logic.length, ui: cls.ui.length, specs: cls.specs.length } };
}
