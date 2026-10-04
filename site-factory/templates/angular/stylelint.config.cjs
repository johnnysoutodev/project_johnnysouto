// Regras de SCSS do site-factory: BEM, tudo amarrado a tokens e a breakpoints centralizados, sem atalhos.
// Valores de cor, espacamento, tipografia, raio e sombra vem de `src/styles/_tokens.scss`;
// larguras de tela vem dos mixins de `src/styles/_breakpoints.scss`. Nada disso e escrito cru em componente.
const BEM = '^[a-z][a-z0-9]*(-[a-z0-9]+)*(__[a-z0-9]+(-[a-z0-9]+)*)?(--[a-z0-9]+(-[a-z0-9]+)*)?$';
const RAW_PX = '/(^|[^\\w.-])\\d*\\.?\\d+px\\b/';

module.exports = {
  // Base `recommended` (so previne erro). A `standard` traz regras de FORMATACAO (linha em branco, notacao de cor) que o Prettier
  // ja cobre e que gerariam retrabalho sem ganho de qualidade.
  extends: ['stylelint-config-recommended-scss'],
  rules: {
    'selector-class-pattern': [BEM, { resolveNestedSelectors: true, message: 'Use BEM: .bloco, .bloco__elemento, .bloco--modificador.' }],
    'selector-max-id': 0,
    'selector-max-universal': 0,
    'selector-max-type': [0, { ignore: ['custom-elements'], message: 'Use uma classe BEM, nao seletor de tag (h1, p, ul...).' }],
    'selector-no-qualifying-type': [true, { ignore: ['attribute'] }],
    'selector-pseudo-class-no-unknown': [true, { ignorePseudoClasses: ['host', 'host-context'] }],
    'selector-type-no-unknown': [true, { ignore: ['custom-elements'] }],
    'selector-pseudo-element-disallowed-list': ['ng-deep'],
    'selector-pseudo-class-disallowed-list': ['ng-deep'],
    'declaration-no-important': true,
    'color-no-hex': [true, { message: 'Cor so por token (var(--color-*)); hex fica em _tokens.scss.' }],
    'function-disallowed-list': ['rgb', 'rgba', 'hsl', 'hsla'],
    'max-nesting-depth': [3, { ignoreAtRules: ['include', 'media'] }],
    'at-rule-disallowed-list': [['media'], { message: 'Largura de tela so pelos mixins de styles/_breakpoints.scss (@include breakpoints.tablet-up etc.).' }],
    'declaration-property-value-disallowed-list': {
      '/^(padding|margin|gap|row-gap|column-gap|inset|top|right|bottom|left)(-.+)?$/': [RAW_PX],
      '/^(font|font-size|line-height|letter-spacing|border-radius|box-shadow)$/': [RAW_PX],
    },
    // Formatacao e do Prettier; aqui so regra de qualidade.
    'scss/dollar-variable-pattern': '^[a-z][a-z0-9]*(-[a-z0-9]+)*$',
    'scss/at-mixin-pattern': '^[a-z][a-z0-9]*(-[a-z0-9]+)*$',
  },
  overrides: [
    { files: ['src/styles/_tokens.scss'], rules: { 'color-no-hex': null, 'function-disallowed-list': null, 'declaration-property-value-disallowed-list': null, 'selector-class-pattern': null } },
    { files: ['src/styles/_breakpoints.scss'], rules: { 'at-rule-disallowed-list': null } },
    // Reset e elementos globais (`*, *::before, *::after`, `html`, `body`) sao exatamente o papel do _base.scss (ou do styles.scss global).
    { files: ['src/styles/_base.scss', 'src/styles.scss'], rules: { 'selector-max-universal': null, 'selector-max-type': null } },
  ],
};
