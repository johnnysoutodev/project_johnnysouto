// @ts-check
// Configuracao de lint do site-factory: boas praticas do Angular + regras de clean code com limite numerico.
// Limites (decisao do dono do projeto): funcao ate 50 linhas, arquivo ate 150, complexidade 8, aninhamento 3, 4 parametros.
const eslint = require('@eslint/js');
const { defineConfig } = require('eslint/config');
const tseslint = require('typescript-eslint');
const angular = require('angular-eslint');

module.exports = defineConfig([
  {
    files: ['**/*.ts'],
    extends: [
      eslint.configs.recommended,
      tseslint.configs.recommended,
      tseslint.configs.stylistic,
      angular.configs.tsRecommended,
    ],
    processor: angular.processInlineTemplates,
    rules: {
      '@angular-eslint/directive-selector': ['error', { type: 'attribute', prefix: 'app', style: 'camelCase' }],
      '@angular-eslint/component-selector': ['error', { type: 'element', prefix: 'app', style: 'kebab-case' }],

      // HTML e SCSS sempre em arquivos separados, mesmo em componente minusculo (o projeto vai escalar).
      '@angular-eslint/component-max-inline-declarations': ['error', { template: 0, styles: 0, animations: 0 }],

      // Clean code com numero: complexidade e tamanho pegam o mesmo cheiro que "funcao curta" sem exigir 25 linhas.
      '@typescript-eslint/no-explicit-any': 'error',
      complexity: ['error', 8],
      'max-depth': ['error', 3],
      'max-params': ['error', 4],
      'max-lines-per-function': ['error', { max: 50, skipBlankLines: true, skipComments: true }],
      'max-lines': ['error', { max: 150, skipBlankLines: true, skipComments: true }],
      'no-console': ['error', { allow: ['warn', 'error'] }],
      'no-nested-ternary': 'error',
      eqeqeq: ['error', 'always'],
    },
  },
  {
    // Teste pode ser mais longo (varios casos num describe) sem virar defeito de clean code.
    files: ['**/*.spec.ts'],
    rules: { 'max-lines-per-function': 'off', 'max-lines': 'off' },
  },
  {
    files: ['**/*.html'],
    extends: [angular.configs.templateRecommended, angular.configs.templateAccessibility],
    rules: {},
  },
]);
