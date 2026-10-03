// Descobre em que etapa do pipeline um cliente esta, olhando SO os artefatos (nada de memoria de conversa).
//   node status.mjs <client-id> [--json]
// Etapas: brief > intake > designer > strategist > builder > verifier > pronto.
// Sai com 0 sempre que conseguiu calcular; o proximo passo vem em "next".
import { spawnSync } from 'node:child_process';
import { existsSync, readFileSync, statSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const repo = resolve(here, '..');
const id = process.argv[2];
const asJson = process.argv.includes('--json');
if (!id || id.startsWith('--')) {
  console.error('Uso: node status.mjs <client-id> [--json]');
  process.exit(2);
}

const dir = join(here, 'clients', id);
const specFile = join(dir, 'site-spec.json');
const stages = ['brief', 'intake', 'designer', 'strategist', 'builder', 'verifier'];
const result = { client: id, stage: null, next: null, blockers: [], done: [], notes: [] };
const state = Object.fromEntries(stages.map((s) => [s, 'pending']));

function finish(stage, next, blockers = []) {
  result.stage = stage;
  result.next = next;
  result.blockers = blockers;
  for (const s of stages) {
    const i = stages.indexOf(s);
    const cur = stages.indexOf(stage);
    state[s] = stage === 'pronto' || i < cur ? 'done' : i === cur ? 'current' : 'pending';
  }
  result.stages = state;
  if (asJson) console.log(JSON.stringify(result, null, 2));
  else {
    const mark = { done: '[x]', current: '[>]', pending: '[ ]' };
    console.log(`Cliente: ${id}\n${stages.map((s) => `${mark[state[s]]} ${s}`).join('\n')}\n`);
    console.log(stage === 'pronto' ? 'Pronto: todas as etapas concluidas.' : `Etapa atual: ${stage}\nProximo passo: ${next}`);
    blockers.forEach((b) => console.log(`  - ${b}`));
    result.notes.forEach((n) => console.log(`Nota: ${n}`));
  }
  process.exit(0);
}

// 1. brief
if (!existsSync(join(dir, 'brief.md'))) {
  finish('brief', `copiar site-factory/templates/brief.template.md para site-factory/clients/${id}/brief.md e preencher`, ['brief.md nao existe']);
}

// 2. intake: spec existe, valida contra o schema e nao tem perguntas em aberto
if (!existsSync(specFile)) finish('intake', `rodar o agente intake (client-id: ${id})`, ['site-spec.json nao existe']);
const validate = spawnSync('node', [join(here, 'spec', 'validate.mjs'), specFile], { encoding: 'utf8' });
if (validate.status !== 0) {
  finish('intake', `rodar o agente intake para corrigir o spec (client-id: ${id})`, (validate.stderr || validate.stdout).split('\n').filter((l) => l.startsWith('- ')).map((l) => l.slice(2)));
}
const spec = JSON.parse(readFileSync(specFile, 'utf8'));
if (spec.openQuestions?.length) {
  finish('intake', 'GATE 1: levar as perguntas ao cliente e rodar o intake de novo com as respostas', spec.openQuestions);
}

const todo = spec.sections.filter((s) => s.status !== 'migrated');
const projectDir = spec.build?.projectDir;
if (spec.project.contentMode === 'placeholder') result.notes.push('conteudo em Lorem Ipsum (contentMode placeholder): nao publicar em producao');

// 3. designer: figmaNode de cada secao a construir + documento de design
const noNode = todo.filter((s) => !s.figmaNode).map((s) => s.id);
const docRef = spec.design.docRef;
if (noNode.length) finish('designer', `rodar o agente designer (client-id: ${id}); precisa do token do Figma`, [`secoes sem figmaNode: ${noNode.join(', ')}`]);
if (todo.length && (!docRef || !existsSync(join(repo, docRef)))) finish('designer', `rodar o agente designer (client-id: ${id}) para gerar o documento de design`, [docRef ? `${docRef} nao existe` : 'design.docRef ausente no spec']);

// 4. strategist: secoes ainda draft (conteudo ou estrutura por definir)
const drafts = todo.filter((s) => s.status === 'draft').map((s) => s.id);
if (drafts.length) {
  const placeholder = spec.project.contentMode === 'placeholder';
  finish('strategist', placeholder ? `rodar o agente strategist (client-id: ${id}); ele gera Lorem Ipsum de tamanho realista e marca as secoes como ready` : `GATE 2: rodar o strategist para propor os textos e levar ao cliente para aprovar`, [`secoes em draft: ${drafts.join(', ')}`]);
}

// 5. builder: projeto existe e cada secao ready tem componente
const folderOf = (s) => join(repo, projectDir ?? '', 'src', 'app', ['header', 'footer'].includes(s.type) ? 'layout' : 'features', s.id);
const missing = [];
if (todo.length && (!projectDir || !existsSync(join(repo, projectDir, 'angular.json')))) missing.push('projeto Angular ainda nao criado');
for (const s of todo) if (!existsSync(folderOf(s))) missing.push(`componente da secao ${s.id}`);
if (missing.length) finish('builder', `rodar o agente builder (client-id: ${id})`, missing);

// 6. verifier: relatorio do mesmo projeto, sem falhas, sem checks pulados, mais novo que o codigo
const reportFile = join(here, 'reports', 'latest', 'report.json');
const reportBlockers = [];
if (!existsSync(reportFile)) reportBlockers.push('nenhum relatorio do verifier');
else {
  const rep = JSON.parse(readFileSync(reportFile, 'utf8'));
  if (projectDir && resolve(rep.project) !== resolve(repo, projectDir)) reportBlockers.push(`ultimo relatorio e de outro projeto (${rep.project})`);
  else {
    const failed = rep.checks.filter((c) => c.status === 'fail').map((c) => c.id);
    const skipped = rep.checks.filter((c) => c.status === 'skipped').map((c) => c.id);
    if (failed.length) reportBlockers.push(`checks reprovados: ${failed.join(', ')}`);
    if (skipped.length) reportBlockers.push(`checks pulados (verificacao incompleta): ${skipped.join(', ')}`);
    const newest = Math.max(0, ...todo.filter((s) => existsSync(folderOf(s))).map((s) => statSync(folderOf(s)).mtimeMs));
    if (newest > new Date(rep.at).getTime()) reportBlockers.push('codigo alterado depois do ultimo relatorio');
  }
}
if (reportBlockers.length) finish('verifier', `rodar o agente verifier sem flags (client-id: ${id})`, reportBlockers);

finish('pronto', null);
