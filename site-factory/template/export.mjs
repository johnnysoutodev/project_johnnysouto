// Gera o repositorio-template limpo a partir deste repositorio. Para ATUALIZAR um template que ja existe use sync.mjs (que chama este
// script, compara e sincroniza); este aqui gera numa pasta vazia e verifica:
//   node site-factory/template/export.mjs --out <diretorio-vazio>
//   node site-factory/template/export.mjs --verify <diretorio>      (so verifica um template ja gerado, ex.: o repositorio novo)
// Copia o motor (manifest.json), instala os arquivos proprios do template (template/files) e VERIFICA o resultado:
// nenhum residuo do projeto de origem (nomes, ids de Figma, caminhos absolutos) e nenhuma referencia a arquivo inexistente.
// Sai com codigo 1 se encontrar residuo, referencia quebrada ou arquivo obrigatorio ausente.
import { cpSync, existsSync, mkdirSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { basename, dirname, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const repo = resolve(here, '..', '..');
const manifest = JSON.parse(readFileSync(join(here, 'manifest.json'), 'utf8'));
const arg = (n) => (process.argv.includes(n) ? process.argv[process.argv.indexOf(n) + 1] : null);
const verifyOnly = arg('--verify');
const outArg = arg('--out');
if (!verifyOnly && !outArg) {
  console.error('Uso: node site-factory/template/export.mjs --out <diretorio-vazio>  |  --verify <diretorio>');
  process.exit(2);
}
const out = resolve(verifyOnly ?? outArg);
const missing = [];
if (!verifyOnly) {
  if (existsSync(out) && readdirSync(out).length) {
    console.error(`O destino ${out} nao esta vazio: escolha um diretorio novo ou vazio.`);
    process.exit(2);
  }
  mkdirSync(out, { recursive: true });
  const skip = new Set(manifest.exclude);
  const filter = (src) => !skip.has(basename(src));
  // 1) Copia o motor
  for (const item of manifest.copy) {
    const from = join(repo, item);
    if (!existsSync(from)) {
      missing.push(item);
      continue;
    }
    mkdirSync(dirname(join(out, item)), { recursive: true });
    cpSync(from, join(out, item), { recursive: true, filter });
  }
  // 2) Arquivos proprios do template (sobrescrevem os de mesmo caminho)
  cpSync(join(repo, manifest.generatedFrom), out, { recursive: true, filter });
}

// 3) Verificacao
const walk = (dir, acc = []) => {
  for (const name of readdirSync(dir)) {
    if (manifest.exclude.includes(name)) continue;
    const p = join(dir, name);
    if (statSync(p).isDirectory()) walk(p, acc);
    else acc.push(p);
  }
  return acc;
};
const files = walk(out);
const TEXT = /\.(md|json|mjs|js|cjs|scss|ya?ml|tmpl|txt|html|ts)$|(^|\/)\.(gitignore|mcp\.json)$/;
const leaks = [];
const broken = [];
const leakRe = new RegExp(manifest.leaks.map((l) => l.replace(/[.*+?^${}()|[\]\\/]/g, '\\$&')).join('|'), 'i');
const pathRe = /(?<![\w~./-])(?:\.claude|site-factory|docs|\.github)\/[A-Za-z0-9_.\-/]*[A-Za-z0-9_/]/g;

for (const f of files) {
  const rel = relative(out, f);
  if (!TEXT.test(f) || rel.endsWith('package-lock.json')) continue;
  const text = readFileSync(f, 'utf8');
  text.split('\n').forEach((line, i) => {
    const m = line.match(leakRe);
    if (m) leaks.push(`${rel}:${i + 1}: "${m[0]}"`);
  });
  if (!rel.endsWith('.md')) continue;
  for (const m of text.matchAll(pathRe)) {
    const p = m[0];
    if (manifest.runtimePaths.some((r) => p.startsWith(r))) continue;
    if (!existsSync(join(out, p))) broken.push(`${rel}: ${p}`);
  }
}
const required = ['CLAUDE.md', 'README.md', 'docs/ai-instructions.md', 'docs/template-setup.md', '.gitignore', '.mcp.json', '.claude/agents/builder.md', '.claude/skills/build-landing/SKILL.md', 'site-factory/status.mjs', 'site-factory/bootstrap.mjs', 'site-factory/spec/site-spec.schema.json', 'site-factory/clients/example/site-spec.json'];
const absent = required.filter((r) => !existsSync(join(out, r)));

const bytes = files.reduce((n, f) => n + statSync(f).size, 0);
console.log(`${verifyOnly ? 'Template verificado' : 'Template gerado'} em ${out}\n  ${files.length} arquivos, ${(bytes / 1024).toFixed(0)} KB`);
const report = (label, list) => {
  console.log(`${list.length ? 'FALHA' : 'OK   '} ${label}${list.length ? ` (${list.length})` : ''}`);
  list.slice(0, 40).forEach((l) => console.log(`       - ${l}`));
};
report('fontes do manifesto existem', missing);
report('sem residuo do projeto de origem (nomes, ids do Figma, caminhos absolutos)', leaks);
report('toda referencia a arquivo do template existe', broken);
report('arquivos obrigatorios presentes', absent);
process.exit(missing.length || leaks.length || broken.length || absent.length ? 1 : 0);
