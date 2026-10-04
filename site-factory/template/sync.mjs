// Sincroniza o repositorio do template com ESTA fonte: gera a exportacao, verifica, deixa o destino identico a ela e roda os testes do motor.
//   node site-factory/template/sync.mjs --to <pasta do repositorio do template> [--dry-run] [--no-tests]
// Fluxo (para na primeira falha, sem tocar no destino se a exportacao nao passar na verificacao):
//   1. exporta para uma pasta temporaria com export.mjs (que ja verifica vazamento do projeto de origem, referencia quebrada e arquivos obrigatorios);
//   2. compara com o destino e mostra o que sera adicionado, alterado e removido (--dry-run para aqui);
//   3. copia e remove para o destino ficar IDENTICO a exportacao (nunca toca em .git nem em node_modules);
//   4. roda `export.mjs --verify` no destino e os testes do motor la dentro (se as dependencias estiverem instaladas).
// Nunca faz commit nem push: o dono revisa o `git status` do destino e commita. O template e produto desta fonte: nao se edita a mao.
import { spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { cpSync, existsSync, mkdirSync, mkdtempSync, readdirSync, readFileSync, rmSync, statSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { checkTarget, KEEP, planSync } from './lib/sync-plan.mjs';

const here = dirname(fileURLToPath(import.meta.url));
const source = resolve(here, '..', '..');
const args = process.argv.slice(2);
const flag = (name) => args.includes(name);
const toArg = args.includes('--to') ? args[args.indexOf('--to') + 1] : null;
if (!toArg) {
  console.error('Uso: node site-factory/template/sync.mjs --to <pasta do repositorio do template> [--dry-run] [--no-tests]');
  process.exit(2);
}
const target = resolve(toArg);
const dry = flag('--dry-run');

const problem = checkTarget({
  target,
  source,
  exists: existsSync(target),
  isGit: existsSync(join(target, '.git')),
  isEmpty: existsSync(target) && statSync(target).isDirectory() && readdirSync(target).length === 0,
});
if (problem) {
  console.error(`Destino invalido: ${problem}.`);
  process.exit(2);
}

const run = (cmd, cmdArgs, cwd = source) => spawnSync(cmd, cmdArgs, { cwd, encoding: 'utf8' });
const list = (root) => {
  const files = new Map();
  const walk = (dir) => {
    for (const name of readdirSync(dir)) {
      const full = join(dir, name);
      const rel = relative(root, full).split('\\').join('/');
      if (KEEP.some((k) => `${rel}/`.startsWith(k))) continue;
      if (statSync(full).isDirectory()) walk(full);
      else files.set(rel, createHash('sha1').update(readFileSync(full)).digest('hex'));
    }
  };
  walk(root);
  return files;
};

const tmp = mkdtempSync(join(tmpdir(), 'template-export-'));
const exported = join(tmp, 'export');
try {
  console.log('1/4 Exportando e verificando a fonte...');
  const exp = run('node', [join(here, 'export.mjs'), '--out', exported]);
  if (exp.status !== 0) {
    console.error(`${exp.stdout}${exp.stderr}\nA exportacao nao passou na verificacao: o destino NAO foi tocado.`);
    process.exit(1);
  }

  console.log('2/4 Comparando com o destino...');
  const plan = planSync(list(exported), list(target));
  const show = (label, files) => files.length && console.log(`  ${label} (${files.length}):\n${files.slice(0, 12).map((f) => `    ${f}`).join('\n')}${files.length > 12 ? `\n    ... +${files.length - 12}` : ''}`);
  show('adicionar', plan.added);
  show('alterar', plan.changed);
  show('remover', plan.removed);
  console.log(`  iguais: ${plan.unchanged.length}`);
  if (dry) {
    console.log('\n--dry-run: nada foi copiado.');
    process.exit(0);
  }

  console.log('3/4 Sincronizando o destino...');
  for (const file of [...plan.added, ...plan.changed]) {
    mkdirSync(dirname(join(target, file)), { recursive: true });
    cpSync(join(exported, file), join(target, file));
  }
  for (const file of plan.removed) {
    rmSync(join(target, file), { force: true });
    // Pastas que ficaram vazias saem junto (a exportacao nao tem pasta sem arquivo).
    for (let dir = dirname(join(target, file)); dir !== target && readdirSync(dir).length === 0; dir = dirname(dir)) rmSync(dir, { recursive: true });
  }

  console.log('4/4 Verificando o destino...');
  const ver = run('node', [join(here, 'export.mjs'), '--verify', target]);
  process.stdout.write(ver.stdout);
  if (ver.status !== 0) {
    console.error(ver.stderr || 'A verificacao do destino falhou.');
    process.exit(1);
  }
  if (!flag('--no-tests')) {
    const ready = existsSync(join(target, 'site-factory', 'spec', 'node_modules'));
    if (!ready) console.log('  testes do motor nao rodaram: dependencias nao instaladas no destino (rode node site-factory/bootstrap.mjs la).');
    else {
      const test = run('node', ['--test', 'site-factory/spec/validate.test.mjs', ...readdirSync(join(target, 'site-factory', 'figma', 'lib')).filter((f) => f.endsWith('.test.mjs')).map((f) => `site-factory/figma/lib/${f}`)], target);
      const summary = test.stdout.split('\n').filter((l) => /^ℹ (tests|pass|fail)/.test(l)).join(' | ');
      console.log(`  testes do motor: ${summary || 'sem resumo'}`);
      if (test.status !== 0) {
        console.error(test.stdout);
        process.exit(1);
      }
    }
  }

  const head = run('git', ['rev-parse', '--short', 'HEAD']).stdout.trim();
  const dirty = run('git', ['status', '--porcelain']).stdout.trim() ? ' (com alteracoes nao commitadas na fonte)' : '';
  console.log(`\nPronto. Revise com: git -C ${target} status\nMensagem sugerida para o commit do template: chore: sync motor from source ${head}${dirty}\nNada foi commitado nem enviado.`);
} finally {
  rmSync(tmp, { recursive: true, force: true });
}
