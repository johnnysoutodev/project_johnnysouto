---
name: clean-code-angular
description: Padrão de código obrigatório para todo componente, serviço e estilo Angular dos projetos do site-factory: TypeScript limpo, HTML e SCSS sempre em arquivos separados, SCSS em BEM amarrado a tokens e breakpoints, testes só na lógica com 100% de cobertura. Traz exemplos reais de como NÃO fazer. Use antes de escrever ou alterar qualquer arquivo de um projeto Angular gerado.
---

# Clean code Angular (padrão do site-factory)

Este padrão **vence** qualquer orientação do `CLAUDE.md`/`AGENTS.md` que o Angular CLI gera no projeto (ex.: "prefira templates inline em componentes pequenos"). O projeto vai escalar para muito além de landing page; arquivo separado e estrutura previsível valem mais que economizar um arquivo.

O que está aqui é **verificado por ferramenta** (`node site-factory/verifier/code-quality.mjs --project <dir>`): ESLint, Stylelint, testes com cobertura e checks de estrutura. O que a ferramenta reprova, você não entrega.

## 1. Regras (todas com limite verificável)

- **TypeScript estrito:** sem `any` (use `unknown`), tipos explícitos nas fronteiras, sem `console.log`, `===` sempre.
- **Tamanho:** função até **50 linhas**, arquivo `.ts` e `.scss` até **150**, complexidade ciclomática até **8**, aninhamento até **3**, até **4 parâmetros**. Estourou: divida, não compacte.
- **Um componente, uma responsabilidade.** Nome de arquivo = nome do componente. Nada de componente que sabe de duas seções.
- **Sem duplicação:** valor que aparece em dois lugares vira token, mixin ou função. Duplicou o breakpoint, a largura do container ou a lógica? Centralize antes de seguir.
- **Sem código morto:** nada de import, token, classe ou função sem uso; nada de comentário de código velho.
- **Nomes que dizem o que é.** Sem `data`, `tmp`, `handle`, `util2`.

## 2. Arquivos: sempre separados

Todo componente tem **`nome.ts`, `nome.html` e `nome.scss`**, mesmo o menor (um `Tag` de 3 linhas também). `templateUrl` e `styleUrl` apontando para arquivos que existem. Nada de `template:` ou `styles:` inline. Componente sem marcação própria (ex.: um ícone desenhado só por CSS) mantém o `.html`, vazio ou só com `<ng-content />`: a estrutura é igual em todos.

## 3. SCSS: BEM, tokens e breakpoints (nada solto)

- **Base única** (`src/styles/`): `_tokens.scss` (todas as cores, espaçamentos, tipografia, raios, sombras como CSS custom properties, claro e escuro), `_breakpoints.scss` (os únicos valores de largura de tela, em mixins), `_layout.scss` (mixins de layout, ex. container), `_base.scss` (reset e elementos globais), e o `styles.scss` do Angular que só faz `@use` disso. Configure `stylePreprocessorOptions.includePaths: ["src/styles"]` para os componentes fazerem `@use 'breakpoints';` sem caminho relativo.
- **Componente só consome a base.** Cor, espaçamento, fonte, raio e sombra vêm de `var(--token)`; largura de tela vem de `@include breakpoints.tablet-up { ... }`. Valor novo no design = novo token, na base, uma vez.
- **BEM com o bloco = nome do arquivo.** Em `hero.scss`: `.hero`, `.hero__texto`, `.hero__foto--destaque`. Nunca `.container`, `.text`, nem seletor de tag (`h1`, `p`, `ul`). Dentro do SCSS aninhe com `&__elemento`, no máximo 3 níveis.
- **O reset global mora só em `_base.scss`:** `*, *::before, *::after { box-sizing: border-box }`, `html`/`body` (ou `:root`) e os elementos globais são o papel dele, e é o único arquivo liberado para seletor universal e de tag. `@media` que não é largura de tela (`prefers-color-scheme`, `prefers-reduced-motion`) também entra pelos mixins de `_breakpoints.scss` (`prefers-dark`, `prefers-reduced-motion`).
- **Proibido:** `!important`, `::ng-deep`, cor em hex ou `rgb()` fora de `_tokens.scss`, `@media` cru, `px` de espaçamento/tipografia/raio/sombra fora de token, seletor de id.
- **Quem estiliza o quê:** o componente estiliza só a si mesmo (`:host` e as suas classes). Estilo que depende de tema no `<html>` usa `:host-context([data-theme='dark'])` (ver `angular-conventions`).

## 4. Testes: só na lógica, 100% de cobertura

- **O que é lógica:** função pura, serviço, pipe, utilitário, qualquer `.ts` que não seja componente/diretiva, dado (`*.data.ts`), rota, configuração ou `main`. Cada arquivo de lógica tem o seu `nome.spec.ts` e **100%** de linhas, ramos, funções e instruções.
- **Teste primeiro (TDD) na lógica:** escreva o spec, rode e veja **falhar** (registre a linha do vermelho no relatório), implemente, veja passar. Spec que nunca falhou não prova nada.
- **Não escreva teste de componente.** Comportamento de tela (menu abre, foco, âncora) é do smoke de interação do `verifier`; aparência é do QA visual.
- **Componente é fino:** a classe só liga inputs, signals e eventos. Se tem `if`/`switch`/laço/ternário demais, extraia para função ou serviço (que então entra na cobertura).
- **Nada de teste decorativo:** `should create` sem asserção não conta; o spec precisa afirmar comportamento (entrada → saída, borda, erro).
- Estrutura: `describe` por unidade, um caso por comportamento, nome em português dizendo a regra ("quebra o e-mail só antes do @").

## 5. Exemplos reais de como NÃO fazer

Tirados do que já saiu do nosso próprio pipeline.

**a) Template e estilo inline (errado)**

```ts
@Component({ selector: 'app-tag', template: '<ng-content />', styles: `:host { height: 28px; padding: var(--space-1) var(--space-5); }` })
export class Tag {}
```

**Certo:** `tag.ts` com `templateUrl: './tag.html'` e `styleUrl: './tag.scss'`, e os três arquivos lado a lado.

**b) Breakpoint cru repetido em 5 arquivos (errado)**

```scss
@media (max-width: 767px) { :host { --section-padding-y: 64px; } }
```

**Certo:** `@use 'breakpoints'; @include breakpoints.mobile-only { ... }`. A largura existe em um lugar só (`_breakpoints.scss`).

**c) Valor de design cru dentro do componente (errado)**

```scss
h1 { font: 600 36px/40px var(--font-family); }
.container { max-width: 1216px; padding: 0 32px; }   // foi o QA-1: o número certo era 1280px
```

**Certo:** tipografia e container vêm de token e mixin (`font: var(--text-h1-mobile)`, `@include layout.content-container`). O valor errado de um lugar só vira um bug em todo lugar quando é copiado.

**d) Classe sem bloco, seletor de tag (errado)**

```scss
.container { ... }  .text { ... }  h1 { ... }
```

**Certo (em `hero.scss`):** `.hero__container`, `.hero__text`, `.hero__title`, e `<h1 class="hero__title">`.

**e) Lógica dentro do componente (errado)**

```ts
// 22 ramificações na classe do menu mobile: foco, teclado, scroll lock, tudo junto no componente
export class MobileMenu { onKeydown(e: KeyboardEvent) { if (...) { ... } else if (...) { ... } } }
```

**Certo:** a decisão ("para onde vai o foco com Tab neste conjunto de elementos?") vira função pura `nextFocusIndex(current, total, shift)` em arquivo próprio, com spec e 100% de cobertura; o componente só chama.

**f) Teste decorativo (errado)**

```ts
it('should create', () => { expect(component).toBeTruthy(); });
```

**Certo:** sem teste de componente. Para lógica: `expect(contactBreakParts('a@b.com')).toEqual(['a', '@b.com'])`.

**g) Atalho que esconde o problema (errado)**

```scss
body { overflow-x: hidden; }   // some a barra, o conteúdo continua estourando
```

**Certo:** achar o elemento que passa do viewport (largura fixa, `min-width: 0` faltando) e corrigir a causa.

**h) Token mentiroso (errado):** usar `var(--space-9)` sem definir `--space-9` (o navegador ignora em silêncio). **Certo:** definir em `_tokens.scss`; o check `tokens-undefined` pega.

**i) Espaçamento fora da escala (errado):** `padding: 4px 20px`. **Certo:** `padding: var(--space-1) var(--space-5)`. Se a escala não tem o valor que o design pede, acrescente o token à escala.

**j) Controle que não faz nada (errado):** `<button type="button">Português</button>` sem ação definida: passa em todos os checks e é um botão morto para quem usa leitor de tela. **Certo:** sem ação no spec, elemento estático; com ação, o spec diz qual (e o `verifier` a exercita).

**k) Imagem pesada ou fora do enquadramento (errado):** `<img src="foto.jpg">` com 6,6 MB e sem dimensões. **Certo:** WebP no tamanho de uso, `NgOptimizedImage` com `width`/`height` e `priority` só na imagem da primeira dobra; `loading="lazy"` (o padrão) nas demais, e o `verifier` rola a página para conferir que carregam.

**l) Gradiente que resolve contraste destruindo o design (errado):** escurecer 20% a área inteira do hero e criar uma faixa de borda reta no header. **Certo:** o mínimo de gradiente, só sob o texto, que alcance 4,5:1 (3:1 para texto grande), medido com `figma/contrast.mjs` contra a cor mais clara sob o texto.
