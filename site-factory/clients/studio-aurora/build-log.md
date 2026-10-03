# Build log: studio-aurora

## 2026-10-03 — build inicial (teste no sandbox)

**Versões:** Node v24.18.0 (.nvmrc = 24), npm 12 (packageManager do scaffold), Angular CLI 22.2.1 (fixado via `npx @angular/cli@22`; resolveu 22.2.1, o angular-app do repositório declara ^22.1.x), Angular 22.2.x, Vitest 5.0.3, TypeScript ~6.0, angular-eslint 22.2.0.

**Projeto:** `site-factory/sandbox/studio-aurora` (ignorado pelo git). Criado com `ng new studio-aurora --directory=... --style=scss --routing --ssr --skip-git --ai-config=claude-code --defaults --skip-install`. `outputMode: "static"` (prerender de 1 rota), sem `ssr.entry`, `src/server.ts` e `express` removidos. Idioma único pt-BR: `sourceLocale: "pt"` (ver fricções), sem targets. Tokens light/dark em `src/styles/_tokens.scss` (dark via `prefers-color-scheme` ou `data-theme="dark"`).

**Seções geradas (ready):** hero, sobre, contato (`src/app/features/<id>/`, dados em `<id>.data.ts` com `$localize` @@id). Componentes compartilhados em `src/app/shared/`: icon (máscara CSS, funciona em dark), icon-button, tag, photo-frame, social.ts (mapa tipo->ícone/rótulo e `linkTarget`).
**Puladas (migrated):** nenhuma. **Bloqueadas:** nenhuma.

**Deploy (aws / static):** `apply.mjs` com `--root site-factory/sandbox/deploy-root` (workflows ficam só em `deploy-root/.github/workflows/` para inspeção); `infra/` copiado para o projeto. Template marcado `[untested]` pelo próprio script.

**Validação:** lint 0 erros/0 warnings; test 9/9 passam, sem warnings; `ng build` (prerender) sem warnings/erros.

**Lacunas / pendências de design e conteúdo:**
- Cor do bloco "foto" não está no design: usado `color-mix` de tokens (neutro).
- Hover/focus dos Icon Buttons: não definido no Figma; hover = Gray/200, `:focus-visible` com outline (decisão do builder, marcada como pendência do design).
- Ícones de e-mail/WhatsApp: reaproveitados `icon-inbox`/`icon-phone` (não há Instagram/WhatsApp no template). github/twitter/figma não usados.
- Mobile/breakpoints: fora do escopo do design; apenas ajustes mínimos (<768px) para não estourar layout (H1 40/48, padding 64px). Valores do builder, não do Figma.
- `hero.tag` do spec não é exibido: o design do Hero não tem Tag.
- Hrefs `#` (redes, WhatsApp) e telefone `(00) 00000-0000` são placeholders.
- `<html lang>` sai como `pt` (não `pt-BR`) no prerender.

**Fricções do procedimento:**
- `ng new <projectDir>` falha (nome do projeto não aceita `/`): é preciso `ng new <nome> --directory=<projectDir>`.
- `ng new` NÃO recusou a pasta não vazia (ícones do designer); mantiveram-se intactos, não foi preciso movê-los.
- `ng add angular-eslint` falha com npm 12 (EALLOWSCRIPTS); lint configurado à mão (angular-eslint + target `lint` no angular.json). `ng new` não inclui lint.
- `sourceLocale: "pt-BR"` gera warning "Locale data for 'pt-BR' cannot be found" no build; usado `pt`.
- i18n com `$localize` exige `@angular/localize` (polyfill `@angular/localize/init` e types) mesmo sem targets.
- Procedimento manda aplicar deploy "na raiz do repositório"; neste teste usou-se `--root` do sandbox.

## 2026-10-03 — correção do verifier (ciclo 1)

**Overflow horizontal em 375px (33px, light e dark): corrigido.** Medido com playwright-core (Chrome) sobre o dist: `scrollWidth` 408. Culpado: `app-photo-frame` da seção "sobre" (largura fixa 440px = 400 + offset 40) dentro de `.columns`, que era item de flex em coluna com `align-items: center` e portanto media o conteúdo (440px) em vez do container (311px); arrastou `.text`, parágrafos e lista (todos de -32 a 408).
Correção (só no sandbox): `photo-frame.scss` com `max-width: 100%` no host e spans em `width: calc(100% - 40px)` (no desktop o resultado é idêntico: 400px); `sobre.scss` com `.columns { width: 100% }` e `min-width: 0` no `.text` no mobile. Sem `overflow-x: hidden`. Depois: `scrollWidth` 375 e nenhum elemento com `right` > 375, em light e dark. O hero e o contato nunca extravasaram. Valores mobile continuam decisão do builder (Figma só tem desktop).

**Canonical (seo-basics): pendência por design.** O spec não tem `project.domain`, então não há URL para o `<link rel="canonical">` e nenhuma foi inventada. O projeto não tem SeoService; quando o cliente definir o domínio, o canonical deve ser adicionado (domínio configurável) e o aviso some. Até lá o aviso permanece.

**Validação:** lint 0 erros/0 warnings; test 9/9; `ng build` sem warnings/erros.

## 2026-10-03 — ajustes de QA visual (rodada 1)

**QA-1 resolvido.** Causa: `.container` de hero, sobre e contato com `max-width: 1216px` + `padding: 0 32px` (border-box), deixando o conteúdo útil em 1152px em vez de 1216px. Correção: mixin `content-container` em `src/styles/_layout.scss` (width 100%, max-width 1280px, margin-inline auto, padding-inline 32px), usado nas 3 seções. Em telas estreitas ocupa 100% do espaço disponível (host com padding-x 0 no mobile), sem estourar o viewport; sem `overflow-x: hidden`.
**QA-2 resolvido.** `sobre.scss`: `.columns` com `align-items: flex-start` (no mobile as colunas empilham e o texto ocupa 100%, sem efeito visível).
**Divergências intencionais / ignorados** (QA-3, 4, 5, 6, 7, 9): sem mudança de código; registrados em design-system.md seção 10.
**Validação:** lint sem erros/warnings; test 9/9; `ng build` sem warnings/erros. Reanálise visual (hero, sobre, contato, 1440 e 375) pendente com o qa-visual.

## 2026-10-03 — correção automática (QA-10), rodada 2

**QA-10 resolvido (seção "sobre").** Causa: no Figma a Row interna tem duas colunas iguais (w=584, grow=1, gap 48), mas no código só a coluna do texto crescia (`flex: 1 1 444px`) e a moldura da foto (440px) era item direto do flex sem crescer; o texto ocupava 728px a partir de x=600 em vez de 584px a partir de x=744.
Correção (`features/sobre/`): a moldura ganhou uma coluna própria `.pic` (template) e `.pic`/`.text` compartilham `flex: 1 1 584px; min-width: 0`; `.pic` alinha a moldura à esquerda. No mobile ambas com `flex-basis: 100%` (empilhadas, sem rolagem horizontal). QA-1/QA-2 preservados (container e `align-items: flex-start` intactos). Sem divergência intencional nova.
