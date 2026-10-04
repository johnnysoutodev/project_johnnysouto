// Portao de qualidade de codigo, sem navegador (serve no CI de deploy). Uso:
//   node code-quality.mjs --project <dir> [--skip-tests] [--mode enforce|report] [--out <dir>]
// Politica e criterios: verifier/lib/code-quality.mjs. Sai com codigo 1 se algum check falhar (modo enforce).
import { mkdir, writeFile } from 'node:fs/promises';
import { basename, join, resolve } from 'node:path';
import { runCodeQuality } from './lib/code-quality.mjs';
import { findOwnerSpec, siteFactory } from './lib/site.mjs';

const args = process.argv.slice(2);
const opt = (n, d) => (args.includes(`--${n}`) ? args[args.indexOf(`--${n}`) + 1] : d);
const project = resolve(opt('project', '.'));
const owner = findOwnerSpec(project, opt('spec'));
const mode = opt('mode', owner?.spec.quality?.mode ?? 'enforce');
const name = owner?.spec.client.id ?? basename(project);

const { checks, scope } = runCodeQuality(project, { mode, skipTests: args.includes('--skip-tests') });
const mark = { pass: 'OK  ', fail: 'FAIL', warn: 'WARN', skipped: 'SKIP' };
console.log(`code-quality: ${project}\nmodo ${mode} | logica ${scope.logic} arquivo(s), componentes ${scope.ui}, specs ${scope.specs}\n`);
for (const c of checks) {
  console.log(`[${mark[c.status]}] ${c.id} - ${c.detail}`);
  if (c.status !== 'pass') c.items.slice(0, 12).forEach((i) => console.log(`       - ${i}`));
}
const failed = checks.filter((c) => c.status === 'fail').length;
const out = resolve(opt('out', join(siteFactory, 'reports', 'code-quality', name)));
await mkdir(out, { recursive: true });
await writeFile(join(out, 'report.json'), JSON.stringify({ project, at: new Date().toISOString(), mode, scope, failed, checks }, null, 2));
console.log(`\n${failed ? 'REPROVADO' : 'APROVADO'} (${failed} falha(s)) - ${join(out, 'report.json')}`);
process.exit(failed ? 1 : 0);
