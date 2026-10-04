// Rodar: node --test site-factory/template/lib/sync-plan.test.mjs
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { checkTarget, planSync } from './sync-plan.mjs';

const m = (obj) => new Map(Object.entries(obj));

test('classifica arquivo novo, alterado, igual e removido', () => {
  const plan = planSync(m({ 'a.md': '1', 'b.md': '2', 'c.md': '3' }), m({ 'a.md': '1', 'b.md': 'x', 'velho.md': '9' }));
  assert.deepEqual(plan, { added: ['c.md'], changed: ['b.md'], unchanged: ['a.md'], removed: ['velho.md'] });
});

test('nunca remove .git nem node_modules do destino', () => {
  const plan = planSync(m({ 'a.md': '1' }), m({ 'a.md': '1', '.git/HEAD': 'x', 'site-factory/spec/node_modules/ajv/index.js': 'x', 'node_modules/x.js': 'x', 'sobra.md': 'x' }));
  assert.deepEqual(plan.removed, ['sobra.md']);
});

test('arquivo fora da exportacao (cliente, sandbox, relatorio) e removido: o template e identico a exportacao', () => {
  const plan = planSync(m({ 'a.md': '1' }), m({ 'a.md': '1', 'site-factory/clients/orangebank/brief.md': 'x', 'site-factory/sandbox/p/x.ts': 'x' }));
  assert.deepEqual(plan.removed, ['site-factory/clients/orangebank/brief.md', 'site-factory/sandbox/p/x.ts']);
});

test('destino invalido: inexistente, a propria fonte, dentro da fonte, pasta comum nao vazia', () => {
  const base = { target: '/t', source: '/s', exists: true, isGit: true, isEmpty: false };
  assert.equal(checkTarget(base), null);
  assert.match(checkTarget({ ...base, exists: false }), /nao existe/);
  assert.match(checkTarget({ ...base, target: '/s' }), /proprio repositorio-fonte/);
  assert.match(checkTarget({ ...base, target: '/s/sub' }), /dentro do repositorio-fonte/);
  assert.match(checkTarget({ ...base, isGit: false }), /nao e um repositorio git/);
  assert.equal(checkTarget({ ...base, isGit: false, isEmpty: true }), null);
});
