// Prepara um repositorio criado a partir do template do site-factory:
//   node site-factory/bootstrap.mjs [--check]
// Confere os pre-requisitos (Node, Git, Chrome, token do Figma), instala as dependencias do motor (verifier e spec)
// e valida o cliente-exemplo. `--check` so confere, sem instalar nada. Sai com codigo 1 se faltar um pre-requisito obrigatorio.
import { spawnSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { homedir, platform } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const repo = resolve(here, '..');
const checkOnly = process.argv.includes('--check');
const results = [];
const note = (level, label, detail = '') => {
  results.push({ level, label, detail });
  console.log(`[${{ ok: 'OK  ', warn: 'AVISO', fail: 'FALTA' }[level]}] ${label}${detail ? ` - ${detail}` : ''}`);
};
const run = (cmd, args, cwd = repo) => spawnSync(cmd, args, { cwd, encoding: 'utf8' });

// Node: segue o `engines` do verifier (mesmo criterio do Angular usado nos projetos).
const engines = JSON.parse(readFileSync(join(here, 'verifier', 'package.json'), 'utf8')).engines?.node ?? '>=22';
const [major, minor, patch] = process.versions.node.split('.').map(Number);
const okNode = (major === 22 && (minor > 22 || (minor === 22 && patch >= 3))) || (major === 24 && minor >= 15) || major >= 26;
okNode ? note('ok', `Node ${process.versions.node}`, `atende ${engines}`) : note('fail', `Node ${process.versions.node}`, `precisa de ${engines} (use nvm ou volta)`);

// Git
run('git', ['--version']).status === 0 ? note('ok', 'Git instalado') : note('fail', 'Git nao encontrado');

// Chrome: o verifier e o QA visual usam o Chrome do sistema (Playwright channel "chrome"), sem baixar navegador.
const chromePaths = { darwin: ['/Applications/Google Chrome.app'], win32: ['C:/Program Files/Google/Chrome/Application/chrome.exe'] }[platform()] ?? [];
const chromeOnPath = ['google-chrome', 'google-chrome-stable', 'chromium', 'chromium-browser'].some((c) => run('which', [c]).status === 0);
chromePaths.some((p) => existsSync(p)) || chromeOnPath ? note('ok', 'Google Chrome encontrado') : note('fail', 'Google Chrome nao encontrado', 'o verifier e o qa-visual precisam dele (instale o Chrome)');

// Token do Figma: so confere a existencia, nunca le o conteudo.
const tokenFile = join(homedir(), '.config', 'site-factory', '.env');
process.env.FIGMA_TOKEN || existsSync(tokenFile)
  ? note('ok', 'Token do Figma configurado', process.env.FIGMA_TOKEN ? 'variavel FIGMA_TOKEN' : tokenFile)
  : note('warn', 'Token do Figma ausente', 'so o agente designer precisa dele; veja docs/template-setup.md (passo 3)');

// Dependencias do motor.
for (const dir of ['verifier', 'spec']) {
  const path = join(here, dir);
  if (existsSync(join(path, 'node_modules'))) {
    note('ok', `site-factory/${dir}: dependencias instaladas`);
  } else if (checkOnly) {
    note('warn', `site-factory/${dir}: dependencias nao instaladas`, 'rode sem --check para instalar');
  } else {
    const r = run('npm', [existsSync(join(path, 'package-lock.json')) ? 'ci' : 'install'], path);
    r.status === 0 ? note('ok', `site-factory/${dir}: dependencias instaladas`) : note('fail', `site-factory/${dir}: npm falhou`, r.stderr.split('\n').find((l) => /ERR|error/i.test(l)) ?? '');
  }
}

// Cliente-exemplo: prova que contrato e validador funcionam.
const example = join(here, 'clients', 'example', 'site-spec.json');
if (existsSync(example) && existsSync(join(here, 'spec', 'node_modules'))) {
  const r = run('node', [join(here, 'spec', 'validate.mjs'), example]);
  r.status === 0 ? note('ok', 'cliente-exemplo valida contra o schema', r.stdout.trim()) : note('fail', 'cliente-exemplo invalido', (r.stderr || r.stdout).split('\n')[0]);
}

const fails = results.filter((r) => r.level === 'fail').length;
console.log(`\n${fails ? `${fails} pre-requisito(s) faltando.` : 'Pronto.'} Proximos passos: docs/template-setup.md (brief do cliente e /build-landing <cliente>).`);
process.exit(fails ? 1 : 0);
