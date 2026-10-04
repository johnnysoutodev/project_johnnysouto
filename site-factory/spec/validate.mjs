// Uso: node validate.mjs <site-spec.json>
// Valida contra o schema e checa regras que JSON Schema nao expressa
// (ids unicos, sem lacunas abertas para o builder, fileKey coerente com a URL).
import { readFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import Ajv2020 from 'ajv/dist/2020.js';
import addFormats from 'ajv-formats';

const here = dirname(fileURLToPath(import.meta.url));
const file = process.argv[2] && resolve(process.argv[2]);
if (!file) {
  console.error('Uso: node validate.mjs <site-spec.json>');
  process.exit(2);
}

const schema = JSON.parse(readFileSync(join(here, 'site-spec.schema.json'), 'utf8'));
const spec = JSON.parse(readFileSync(file, 'utf8'));
const ajv = new Ajv2020({ allErrors: true });
addFormats(ajv);

const errors = [];
const validate = ajv.compile(schema);
if (!validate(spec)) {
  for (const e of validate.errors) errors.push(`${e.instancePath || '/'} ${e.message}${e.params?.additionalProperty ? ` (${e.params.additionalProperty})` : ''}`);
}

const ids = spec.sections?.map((s) => s.id) ?? [];
ids.filter((id, i) => ids.indexOf(id) !== i).forEach((id) => errors.push(`/sections: id duplicado "${id}"`));

const urlKey = spec.design?.figma?.url?.match(/figma\.com\/(?:design|file)\/([A-Za-z0-9]+)/)?.[1];
if (urlKey && urlKey !== spec.design.figma.fileKey) errors.push(`/design/figma/fileKey "${spec.design.figma.fileKey}" nao bate com a URL (${urlKey})`);

const targets = spec.locales?.targets ?? [];
if (targets.includes(spec.locales?.source)) errors.push('/locales/targets: contem o idioma-fonte');
const fb = spec.locales?.fallback;
if (fb && fb !== spec.locales.source && !targets.includes(fb)) errors.push(`/locales/fallback "${fb}" nao esta em source/targets`);

// Lorem Ipsum so e aceito quando o cliente escolheu contentMode "placeholder" (o texto e do tamanho de um real,
// para o layout ser validado, e o cliente edita depois). Em contentMode final seria texto de teste vazando.
const hasLorem = /lorem ipsum/i.test(JSON.stringify(spec.sections ?? []));
if (hasLorem && spec.project?.contentMode !== 'placeholder') errors.push('/sections: contem "Lorem ipsum" mas project.contentMode nao e "placeholder"');

const open = spec.openQuestions ?? [];
const blocking = open.filter((q) => typeof q === 'string' || q.blocking !== false);
const strict = process.argv.includes('--ready');
if (strict && blocking.length) errors.push(`--ready: ${blocking.length} pergunta(s) bloqueante(s) em aberto em openQuestions`);
if (strict) spec.sections?.filter((s) => s.status === 'draft').forEach((s) => errors.push(`--ready: secao "${s.id}" ainda e draft (aprove como ready ou adie como deferred)`));
if (strict && !spec.sections?.some((s) => s.status === 'ready')) errors.push('--ready: nenhuma secao ready para o builder gerar');

if (errors.length) {
  console.error(`site-spec INVALIDO (${file}):\n- ${errors.join('\n- ')}`);
  process.exit(1);
}
const deferred = spec.sections.filter((s) => s.status === 'deferred').length;
const mode = spec.project?.contentMode === 'placeholder' ? ' [conteudo placeholder]' : '';
console.log(`site-spec valido: ${spec.sections.length} secao(oes)${open.length ? `, ${open.length} pergunta(s) em aberto (${blocking.length} bloqueante(s))` : ''}${deferred ? `, ${deferred} secao(oes) adiada(s)` : ''}${mode}${strict ? ' [pronto para o builder]' : ''}`);
