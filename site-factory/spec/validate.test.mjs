// Testes do contrato: perguntas opcionais, secao deferred e a regra do --ready (build parcial).
// Rodar: node --test site-factory/spec/validate.test.mjs
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, readFileSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, dirname } from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const base = JSON.parse(readFileSync(join(here, '..', 'clients', 'example', 'site-spec.json'), 'utf8'));
base.openQuestions = [];
base.sections.forEach((s) => { s.status = 'ready'; s.contentRef = 'brief.md'; });

function run(mutate, ...args) {
  const spec = structuredClone(base);
  mutate(spec);
  const file = join(mkdtempSync(join(tmpdir(), 'spec-')), 'site-spec.json');
  writeFileSync(file, JSON.stringify(spec));
  const r = spawnSync('node', [join(here, 'validate.mjs'), file, ...args], { encoding: 'utf8' });
  return { code: r.status, out: `${r.stdout}${r.stderr}` };
}

test('spec de exemplo valida e fica pronto com --ready', () => {
  assert.equal(run(() => {}, '--ready').code, 0);
});

test('pergunta em texto simples e bloqueante no --ready', () => {
  const r = run((s) => { s.openQuestions = ['Qual o provedor?']; }, '--ready');
  assert.equal(r.code, 1);
  assert.match(r.out, /1 pergunta\(s\) bloqueante\(s\)/);
});

test('pergunta opcional nao bloqueia o --ready', () => {
  const r = run((s) => { s.openQuestions = [{ text: 'Qual o publico?', blocking: false }]; }, '--ready');
  assert.equal(r.code, 0);
  assert.match(r.out, /1 pergunta\(s\) em aberto \(0 bloqueante\(s\)\)/);
});

test('objeto sem blocking e bloqueante', () => {
  assert.equal(run((s) => { s.openQuestions = [{ text: 'Dominio?' }]; }, '--ready').code, 1);
});

test('secao draft reprova o --ready e a mensagem aponta o caminho', () => {
  const r = run((s) => { s.sections[0].status = 'draft'; }, '--ready');
  assert.equal(r.code, 1);
  assert.match(r.out, /aprove como ready ou adie como deferred/);
});

test('secao deferred nao reprova o --ready quando ha outra ready', () => {
  const r = run((s) => { s.sections[1].status = 'deferred'; }, '--ready');
  assert.equal(r.code, 0);
  assert.match(r.out, /1 secao\(oes\) adiada\(s\)/);
});

test('--ready sem nenhuma secao ready reprova', () => {
  const r = run((s) => { s.sections.forEach((x) => { x.status = 'deferred'; }); }, '--ready');
  assert.equal(r.code, 1);
  assert.match(r.out, /nenhuma secao ready/);
});
