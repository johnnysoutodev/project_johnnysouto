# Verifier

Checks executáveis para qualquer projeto Angular gerado pelo site-factory. Agente que usa isto: `.claude/agents/verifier.md`.

```bash
cd site-factory/verifier
npm install            # só na primeira vez (usa o Chrome já instalado, sem baixar navegador)
node verify.mjs --project ../../<projeto>
```

| Check | O que pega |
|---|---|
| `build` | `npm run build`/`ng build` com prerender: erro de SSR, warnings (meta: zero) |
| `unit-tests`, `lint` | `ng test --watch=false`, `ng lint` |
| `platform-guards` | (aviso) globals de navegador sem guarda de plataforma |
| `console-errors`, `network-errors` | erros de console e respostas 4xx/5xx em cada página |
| `horizontal-overflow`, `broken-images` | layout quebrado em 375/768/1440 px; o overflow nomeia o elemento mais externo que passa do viewport |
| `npm-audit`, `npm-audit-dev` (risco conhecido: `braces <= 3.0.3`, GHSA-vfj7-8cjw-p6xm, via Stylelint, sem correção publicada e só em desenvolvimento, aparece como aviso; avaliado em 04/10/2026: nenhuma alternativa cobre as regras BEM/tokens, ver `CHANGELOG.md`; reavaliar quando o `braces` ou o Stylelint publicarem correção) | `npm audit` separado em dependências de **produção** (vão para o site) e **ferramentas de desenvolvimento** (stylelint, eslint, vitest; não vão para o site). Em ambas, **crítica = falha** (ferramenta de build comprometida executa código na máquina e no CI) e alta/moderada = aviso (lista pacotes e correção); sem rede = aviso. `--skip-audit` pula; `--audit-from` e `--audit-dev-from` usam saídas salvas |
| `lint` | ESLint com limites de clean code (função até 50 linhas, arquivo até 150, complexidade 8, sem `any`) e HTML/SCSS sempre separados |
| `stylelint` | SCSS em BEM, sem hex/`rgb()`/px de espaçamento-tipografia fora de token, sem `@media` cru, `!important`, `::ng-deep` nem seletor de tag |
| `unit-tests`, `coverage` | `ng test --coverage`: **100%** de linhas, ramos, funções e instruções **só na lógica** (não conta componente, dado, rota nem config) |
| `component-files` | todo componente com `.html` e `.scss` separados e existentes |
| `bem-block` | toda classe do SCSS de um componente leva o bloco = nome do arquivo (`hero.scss` → `.hero`, `.hero__x`) |
| `tokens-undefined`, `tokens-unused` | `var(--x)` sem definição falha; token definido sem uso avisa |
| `logic-specs`, `ui-specs`, `ui-thin` | arquivo de lógica sem spec falha; teste de componente e componente com lógica demais avisam |
| `a11y-axe` | axe WCAG 2.0/2.1 A e AA, em todos os idiomas, temas e viewports |
| `a11y-contrast-manual` | Aviso: contraste que o axe não conseguiu medir (texto sobre imagem ou fundo variável; lista `incomplete` do axe). O OK do `a11y-axe` não cobre esses trechos: meça à mão com `figma/contrast.mjs` |
| `seo-basics` | (aviso) `lang`, `title`, description, h1 único, canonical. O canonical só é exigido se o spec do cliente (descoberto por `build.projectDir`) tem `project.domain` |
| `placeholder-content` | (aviso) "Lorem ipsum" no texto visível |
| `interaction-toggles` | menus/diálogos/disclosures (`aria-expanded`+`aria-controls`): abrem, diálogo modal move e prende o foco, Escape fecha e devolve o foco, painel fechado não recebe foco; botões `aria-pressed` invertem |
| `interaction-anchors` | todo `#id` tem alvo e o clique leva até ele (espera a rolagem suave estabilizar) |
| `focus-indicator` | (aviso) cada parada do Tab mostra outline ou sombra. `--skip-interactions` pula os três |
| `keyboard-focus` | Tab pousando em elemento oculto/inert |

Idiomas são descobertos pelas pastas de `dist/*/browser/<locale>/index.html`; temas via `prefers-color-scheme`. Relatório e screenshots em `site-factory/reports/latest/` para qualquer projeto, mais uma cópia do relatório por cliente em `site-factory/reports/by-client/<cliente>/report.json` (ignorados pelo git); as telas são limpas a cada execução e, com um idioma só, levam o prefixo `default_`.

Fora do escopo por enquanto: Lighthouse e comparação visual com o Figma.

## `code-quality`: o portão de código, sem navegador

Os checks de código (`lint`, `stylelint`, `unit-tests`, `coverage`, `component-files`, `bem-block`, `tokens-*`, `logic-specs`, `ui-*`) vivem em `lib/code-quality.mjs` e rodam também sozinhos, **sem navegador**, o que os torna a base de um CI de deploy:

```bash
node site-factory/verifier/code-quality.mjs --project <projeto> [--skip-tests] [--mode enforce|report]
```

Sai com código 1 se algum check falhar. O padrão que ele impõe está na skill `clean-code-angular` e os arquivos de configuração em `site-factory/templates/angular/` (`eslint.config.js`, `stylelint.config.cjs`, `styles/_breakpoints.scss`). `quality.mode: "report"` no spec (projetos legados em adoção gradual) rebaixa falha para aviso; `enforce` (padrão) barra. `verify.mjs --skip-quality` pula o portão.
