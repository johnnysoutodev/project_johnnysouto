# Build log: Orange Bank

## 2026-10-04 - criação do projeto e das 10 seções

- Versões: Node 24.18.0, npm 12.0.2, Angular CLI/Angular 22.2.x, TypeScript 6.0, Vitest 5.0.3. Projeto: `site-factory/sandbox/orangebank` (sandbox).
- Spec validado com `--ready` (10 seções `ready`). Escopo de design: desktop + tema claro; mobile e tablet derivados pelo builder (breakpoints 768/1200 de `_breakpoints.scss`; tipografia só com degraus já existentes da escala do design-system).
- Receita da Etapa A aplicada (`ng new` com as flags da instrução, `CLAUDE.md` substituído pelo template, eslint/stylelint, `_breakpoints.scss`, `includePaths`, `ng lint`, `@angular/localize` com `sourceLocale: "pt"`, `<html lang="pt-BR">` via `provideAppInitializer`). Fonte Roboto self-hosted via `@fontsource-variable/roboto` (sem dependência de rede no build).
- Deploy: `apply.mjs` aplicou `vercel-static` (`vercel.json` + 2 workflows dentro do projeto sandbox). Criado `.nvmrc` (`24`) porque os workflows usam `node-version-file`.

### Seções geradas (10)
header, hero, sobre-nos, tecnologias-utilizadas, vantagens-da-conta, investimentos, cartao-de-credito, perguntas-frequentes, baixar-o-app, footer. Puladas: nenhuma. Bloqueadas: nenhuma.

### Decisões de conteúdo (respeitando exatamente o `content`)
- sobre-nos: `body` do spec repete o `subtitle` palavra por palavra; renderizado uma vez. Só a coluna 1 existe; o layout em 3 colunas deixa a coluna da direita vazia (sem coluna 2 no content).
- vantagens-da-conta e investimentos: os `title` dos itens são rótulos do strategist e não aparecem no Figma; ficam no `.data.ts` e só a `description` é renderizada. Vantagens tem 2 itens (o 02 FDIC fora, como no spec).
- cartao-de-credito: título e descrição dos itens são iguais; texto renderizado uma vez.
- perguntas-frequentes: só 2 itens. O botão "Carregar mais perguntas" só aparece quando há mais itens que a página (6, do Figma); com 2 itens ele não é exibido (botão morto seria pior). Quando o dono enviar as respostas 3 a 6, o botão aparece sozinho com mais de 6 itens.
- tecnologias-utilizadas: o spec não tem `content`. Renderizado com o título (nav.label / contentRef) e os 10 nomes de logo do `contentRef` do design-system, cada um como marcador. O dono ainda decide se a seção deve existir.
- footer: "Investimo" mantido como está (decisão do dono). Links sem href no spec: `href="#"` provisório. `links: []` do spec ignorado. Selos de loja do rodapé são marcadores.
- header: item "Conta Digital PJ" e "Fale Conosco" com `href="#"` (como no spec).
- baixar-o-app: botão "Baixar o app" com `href="#"` (spec) e os dois selos de loja como marcadores.
- Rótulos dos marcadores de asset e `aria-label` do menu/logo são texto de engenharia, em português; os marcadores saem junto quando os assets existirem.

### Assets sem arquivo (marcador visível `app-asset-placeholder`, tracejado laranja)
Nenhum asset existe em `public/assets/` (apenas `favicon.ico` padrão do Angular, que NÃO é o favicon do cliente). Marcadores no código para: imagem de fundo do hero (img-hero-section 1, aparece a 20% de opacidade sobre fundo escuro `neutral-90`, que é suposição do builder para garantir contraste do texto branco); logo Orange Bank (header e footer); ícones hand (pílula do hero), icon-card x2 (hero), hand-two (sobre nós), ícone de cada vantagem e de cada benefício do cartão; mockup de dois iPhones; 10 logos de tecnologia; foto com recorte + people-card (vantagens); foto + card flutuante invest (investimentos); foto close woman (cartão); fundo pagcartao 1 (CTA, sobre fundo `orange-700` suposto); selos App Store e Google Play (CTA e footer); 3 ícones de redes sociais; favicon do cliente. Sem marcador (decorativos, omitidos): logotipo marca d'água de "Sobre nós", forma decorativa e logo pequeno do CTA, seta nos botões (usado o glifo `→`).

### Lacunas e valores que o design-system não fornece (nada inventado em cor/tipografia; itens abaixo são decisão de engenharia a confirmar)
- Sem medidas mobile/tablet: seções empilham em coluna até 1200px; títulos usam 28/33 (mobile) e 40/48 (tablet+), hero título 40/48 no mobile e 64/77 a partir de tablet.
- Fundos de seção não especificados no design-system (sobre-nos, vantagens, investimentos, cartão, FAQ): branco.
- Desfoque do header/elipse do hero: o doc diz BACKGROUND_BLUR/LAYER_BLUR sem raio. Header usa `blur(16px)` (suposição); a elipse do hero é um gradiente radial `orange-600` (sem blur).
- Alturas de seção do Figma usadas só como `min-height` (hero 800); demais seguem o conteúdo.
- Largura de contêiner: 1170 (conteúdo) e 1200 (header, hero, cartão, footer), como recomendado no design-system.
- Tokens de design-system removidos por ficarem sem uso (check `tokens-unused`): orange/100, neutro/20, neutro/100, #6A7680, H4 pequeno 14/21. Voltam à base quando um componente precisar.
- Sem `i18n` nos rótulos de marcador de asset (provisórios). Conteúdo das seções usa `$localize` com ID `@@...` nos `.data.ts`; só o idioma-fonte (`pt`) existe, sem extração/traduções.

### Lacunas do motor (para o `ROADMAP` do site-factory)
1. `ng new --ssr` com `deploy.outputMode: static` deixa `src/server.ts`, `express`, `@types/express`, `ssr.entry` e o script `serve:ssr:*` sem uso, e o build ainda emite `dist/<name>/server`. A receita da Etapa A não diz para removê-los; removidos aqui (entry, `server.ts`, deps, script, referência no tsconfig). Falta passo na instrução do builder.
2. `ng new` gera `outputMode: server` por padrão; para `static` é preciso `ng config ... outputMode static` (não está na receita).
3. `figma-map.mjs` não exporta assets (já registrado pelo designer): nenhuma imagem/SVG disponível; o projeto sai com ~35 marcadores. Falta um caminho de export (REST `images` API) no motor.
4. `apply.mjs`: o aviso pede `.nvmrc` e o script não o cria; também o Root Directory orientado é `.` (raiz do sandbox como repo), ok só para sandbox.
5. A receita não cobre fonte (Google Fonts vs self-host): usei `@fontsource-variable/roboto` (angular.json `styles`) para evitar fetch de rede no build. Vale decidir como padrão.
6. `tokens-unused` obriga remover tokens do design que ainda não têm uso; a base de tokens do design-system acaba mais curta que o documento.
7. `npm audit` (ver abaixo) aponta achados altos por ferramenta de lint recomendada pelo próprio motor.

### Qualidade e testes
- TDD em `faq-state.ts` (única lógica; 3 funções puras). Vermelho registrado: `ERROR Could not resolve "./faq-state"` / `TS2307: Cannot find module './faq-state'`; depois verde: 7 testes passando, 100% de cobertura.
- `app.spec.ts` gerado removido (só testava criação/título do componente raiz, que não existe mais).
- `code-quality`: APROVADO (0 falhas, 0 avisos): lint, stylelint, 7 testes, 100% cobertura, 13 componentes com arquivos separados, BEM, tokens definidos e usados.
- `ng build` (prerender estático): sem warnings e sem erros; `<html lang="pt-BR">` presente no HTML prerenderizado; saída em `dist/orangebank/browser`.
- `npm install` imprime `npm warn install-scripts ... fsevents/esbuild/lmdb/...` (ruído do npm 12; não tratado).

### npm audit (para o orquestrador acionar o `resolved-vulnerability`; não corrigido)
8 altas, 0 críticas, todas em dependência de desenvolvimento (`npm audit --omit=dev`: 0): `braces` (GHSA-vfj7-8cjw-p6xm, "No fix available") -> `micromatch` -> `fast-glob` -> `globby` -> `stylelint` -> `stylelint-config-recommended`, `stylelint-config-recommended-scss`, `stylelint-scss`. Origem: o stylelint exigido pelo `code-quality`.

### Fora do escopo desta rodada
Sem verifier/QA visual rodado (cabe ao verifier/qa-visual); layout não conferido contra o Figma por captura, só pelas medidas do design-system.

## Correção do ciclo 1 do verifier (2026-10-04)

- **console-errors (NG0500)**: causa em `shared/asset-placeholder`: o template usava `<div>`; no `hero` ele fica dentro de `<p class="hero__badge">`, e o parser HTML fecha o `<p>` ao ver o `<div>`, então o DOM prerenderizado diferia do esperado e o texto do badge saiu do `<p>`. Achado com build de desenvolvimento (mensagem nomeou `_Hero`, `p.hero__badge`). Correção: raiz do placeholder virou `<span>` (já é `display: flex` no SCSS). Build de desenvolvimento depois: "hydrated 54 component(s) ... 0 skipped", sem erro. Verifier: console-errors OK nas 6 combinações.
- **interaction-toggles**: era consequência da hidratação quebrada (handlers não ligados); o botão do header já tinha `aria-label`. Sem mudança de código; verifier: OK.
- **a11y-axe `.asset-placeholder__label`**: `--color-accent` (#f15a24) sobre `--color-orange-50` dava 3,05:1. Novo token `--color-accent-text` (#ab3308, 5,92:1) usado só no texto do placeholder; borda continua `--color-accent`. Contraste do placeholder resolvido.
- **Pendência revelada (não corrigida, decisão de design)**: com o placeholder resolvido o axe passa a acusar `.button--primary` (branco #fff sobre `--color-orange-500` #ff823d, 2,47:1) em 31 a 33 nós. É cor do Figma; trocar exige decisão do designer (ex.: texto `--color-neutral-90` no botão primário, 6,42:1, ou fundo `--color-orange-700` com texto branco, 4,63:1).
- code-quality APROVADO; `ng build` sem warnings.

## Correção do ciclo 2 do verifier (2026-10-04)

- **a11y-axe `.button--primary`**: o texto branco sobre `--color-orange-500` (#ff823d) dava 2,47:1 (cor do Figma reprova WCAG AA). Decisão do dono: texto `--color-neutral-90` (#1d232a, 6,42:1), mantendo o fundo laranja do Figma. Aplicado em `shared/button/button.scss` só pelo token. O projeto não define tema escuro (só `:root`, sem `prefers-dark`), então o mesmo par vale nos dois temas do verifier (6,42:1 >= 4,5:1).

## Correção final do contraste (2026-10-04, além dos 2 ciclos, com OK do dono)

- **a11y-axe `.sobre-nos__label`**: `--color-orange-600` sobre branco dava ~3,6:1 (cor do Figma reprova WCAG AA). Decisão do dono: usar o token existente `--color-accent-text` (#ab3308). Contraste calculado: 6,54:1 sobre `--color-white` (fundo real da seção, herdado do body) e 6,01:1 sobre `--color-surface-photo`; ambos >= 4,5:1. Aplicado em `sobre-nos.scss` só pelo token. Sem tema escuro no projeto.

## Correção única dos contrastes (2026-10-04, aprovada pelo dono; base: `contrast-audit.md`)

As cores do Figma reprovam WCAG AA nos pares abaixo; o dono aprovou trocar cada um por token existente (sem valor cru).
1. **Footer** (`layout/footer/footer.scss`): `.footer` `color` de `--color-neutral-05` para `--color-white`. Motivo: #f3f3f3 sobre `--color-orange-700` dava 4,18:1 (<4,5); #fff dá 4,63:1. Cobre endereço, links, headings, cta, locale e copyright; nenhum elemento do footer define cor própria (links usam `inherit`).
2. **Foco do botão** (`shared/button/button.scss`): `.button:focus-visible` com anel de dois tons: outline `--color-neutral-90` + halo branco por `box-shadow` (offset + espessura + 1px, só tokens). Motivo: anel branco sobre fundo branco dava 1,00:1 (<3); funciona em branco, neutral-90 e orange-700.
3. **Botão "carregar mais" do FAQ e `.button--outline-muted`**: texto e borda de `--color-neutral-50` para `--color-neutral-80`. Motivo: 2,87:1 (<4,5 e <3); neutral-80 sobre branco dá 12,66:1. Token `--color-neutral-50` ficou sem uso e foi removido de `_tokens.scss` (para o code-quality ficar sem aviso; restaurável).
4. **Placeholders de fundo** (hero e baixar-o-app): `[compact]="true"` nos `app-asset-placeholder` dentro de `__background`. Motivo: rótulo a opacity 0,2 dava 1,65:1 e 1,40:1; nenhum token resolve, e o texto é decorativo (`aria-hidden`).
- Não alterado: `.hero__glow` (aguarda QA visual do mobile); `npm audit`.
