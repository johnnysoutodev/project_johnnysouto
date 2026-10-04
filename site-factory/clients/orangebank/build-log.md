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

## Ajustes do QA visual, rodada 1 (2026-10-04, aprovados pelo dono)

Medido com `qa-capture` (desktop-light) depois das mudanças; code-quality APROVADO (11/11, 100% de cobertura na lógica), `ng build` sem warnings. Só tokens e mixins existentes; tokens novos em `_tokens.scss`: `--space-2`, `--space-30`, `--size-text-column-narrow` (423), `--size-menu-item-width` (139), `--size-footer-about-width` (350), `--size-footer-column-width` (150), `--size-footer-column-last-width` (208), `--offset-float-card-top` (82), `--offset-float-card-left` (-153).

- QA-2 hero: novo `hero__main` (selo, título, botões, gap 16); `hero__inner` gap 64. Medido: botões terminam em 556, ícones em 620.
- QA-3 header: nav `flex: 1` + `space-between`, `header__item` com 139 de largura (desktop). Medido: menu em x=360, botão em x=1060.
- QA-4 sobre-nos: `sobre-nos__intro` (ícone + rótulo, gap 0) e `sobre-nos__headline` (título + subtítulo, gap 8). Gap entre os dois grupos continua 24 (o relatório não dá o valor do Figma para rótulo/título).
- QA-6 vantagens: people-card `top: 50%` + `translate` (desktop); centro do card 349,5 contra centro da foto 349.
- QA-8 investimentos: card flutuante `top 82` / `left -153` relativo à foto (desktop); abaixo do desktop continua na base, para não gerar rolagem horizontal. Medido: y=146 (64 + 82), x = foto - 153.
- QA-9 investimentos: `investimentos__text` com 423 (título e parágrafos 423).
- QA-10 FAQ: padding 33 nos itens; `perguntas-frequentes__faq` (título + lista) com gap 30; o gap 56 até "Carregar mais" fica no `__inner`. Medido: item fechado 92 (Figma 96): ver "Não resolvido".
- QA-11 footer: colunas 350/150/150/150/208 (gap 48), seletores em `footer__locales` à direita (desktop), gaps 24 e padding 56. Altura 524 (Figma 520); colunas em x=120/518/716/914/1112.
- QA-13 CTA: padding movido para `baixar-o-app__card`; título com 470 de largura e 168 de altura (3 linhas).
- D-1 destaque de título: componente `shared/title-highlight` (`app-title-highlight`, entradas `text` e `highlight`) + função `split-title.ts` (teste primeiro: falhou com "Could not resolve './split-title'", depois 11/11 passaram, 100%). Classe BEM `title-highlight__mark` com `--color-orange-600`. Cada dado de seção ganhou `titleHighlight` (`sobre-nos`, `vantagens-da-conta`, `investimentos`, `cartao-de-credito`, `perguntas-frequentes`) com os trechos da tabela do design-system. Diferença registrada: o FAQ usa orange-600 (#E95E2D, 3,44:1) e não #F15A24 do Figma (3,37:1), para unificar o componente. Texto grande 40px, contraste aceito pelo dono.
- D-2 cartão de crédito: `layout.container` (1170). Medido: foto x=135, texto x=835.
- D-3 alvo clicável: link do header com `padding-block` 2 (25px), link do footer com `padding-block` 4 e gap da lista 8 para 0 (24px, mesmo passo vertical). O `summary.md` do qa-capture não lista mais alvo pequeno.
- D-4 e D-5: sem mudança (decisões do dono).

Não resolvido: item fechado do FAQ mede 92 (66 de padding + 24 de linha + 2 de borda), o Figma 96; os 4px restantes não têm origem no documento (provável altura de conteúdo de 30 com borda interna); não inventado. Hero glow e `npm audit` intocados.

## Ajustes do QA visual, rodada 3 (2026-10-04, D-6 a D-9 aprovadas pelo dono)

Medidas do documento (secao "Medidas da rodada 3"). Medido com `qa-capture` (desktop, tablet e mobile sem achado automatico); code-quality APROVADO, `ng build` sem warnings. Tokens novos em `_tokens.scss`: `--space-3`, `--space-5`, `--space-6`, `--space-13`, `--space-15`, `--size-footer-height` (520), `--size-footer-top-height` (260), `--size-footer-brand-box-height` (60), `--size-footer-logo-height` (32), `--size-footer-locales-width` (280), `--size-faq-title-height` (30), `--size-hero-highlight-text-width` (94); `--size-social` 46 para 45,6.

- QA-18 / D-6: a quebra vive nos dados (`\n` no `title` de vantagens, investimentos e cartao; destaque inalterado, nas posicoes da tabela). `title-highlight.scss` aplica `white-space: pre-line` so a partir do desktop; abaixo de 1200 a quebra e natural. Medido: titulos com 96 de altura (2 linhas).
- QA-19 / D-7: item do FAQ 96 fechado (padding 32 + borda 1 = 33 do Figma, caixa do titulo `min-height` 30), raio 13, borda #D9D9D9, sombra do documento ja existiam. "+" ja usava `--color-accent` (#F15A24, 18x18, 3,37:1 como icone de UI); espessura do traco (1px) nao foi medida no documento, mantida.
- QA-20 / D-8: footer reestruturado (`footer__top` 260 com logotipo 200x32 alinhado embaixo de uma caixa de 60; colunas 350/150/150/150/208 em x=120/518/716/914/1112; links com passo de 32; `footer__offer` com "Abra sua conta" 20/24 600 acima dos selos 140x45, gap 5 + filete; `footer__locales` x=1040, 280, a direita; copyright em y=433; altura 520). Medido: footer 1440x520, bottom y=324 h=79, locales x=1040 w=280, copyright texto em y=433. Cruzamento das linhas com os seletores: NAO reproduzido; o filete (1px `--color-footer-line`, de x=135, abaixo do rotulo) vive so na coluna esquerda e termina antes dos seletores. A segunda linha (#E95E2D, 0,5) nao foi reproduzida (decorativa, 1,35:1). Icones de globo e pin dos seletores nao existem (assets nao exportados): so texto.
- QA-21 / D-9: hero com `padding-block: 0` no desktop (bloco centrado: y=154, h=492); selo com gap 6 (272x37); titulo em 640 com `\n` depois de "tarifas" (3 linhas, 231 de altura, `pre-line` so no desktop); botoes 455 (gap 15), 24 entre titulo e botoes (margin-top 8 sobre o gap 16), 64 ate os icones (y=586); rotulos dos icones em 2 linhas (caixa de 94): bloco de icones mede 364 contra 355 do Figma (diferenca de largura de texto na fonte).

## Ajustes D-10 a D-12 (2026-10-04, aprovados pelo dono)

Tokens novos em `_tokens.scss`: `--size-footer-address-max-width` (308), `--size-target-min` (24).

- D-10 FAQ: braços do "+" com `--space-2` (2px, antes 1px), centrados (`top: calc(50% - space-1)`), cor `--color-accent` (#F15A24) e posição mantidas. Fonte do valor: a API do Figma só dá o vetor 18x18; os 2px são leitura da imagem de referência, não medida do documento.
- D-11 footer: `footer__address` com `max-width` 308 para quebrar antes de "São", como o Figma.
- D-12 footer: idioma e cidade viraram `<button type="button">` (`footer__locale`), com altura mínima 24, foco visível (outline 2px branco, offset 2) e hover sublinhado. SEM handler: o spec não define ação (troca de idioma/região). Falta o dono definir o comportamento (menu, lista de idiomas/cidades, destino) e os rótulos acessíveis completos (ex.: "Idioma: Português"), pois hoje o nome acessível é só o texto visível.

## 2026-10-04 - ciclo de assets reais (marcadores substituídos)

- Versões: Node 24.18.0, Angular 22.2.x. Nenhuma dependência nova. `ng build` sem warnings (main 313,05 kB raw / 80,97 kB transferido; estilos 8,36 kB), `code-quality` APROVADO, sem rolagem horizontal em 375/768/1024/1200/1440 (medido com Chrome via playwright do verifier).
- Marcadores: **zero** `app-asset-placeholder` restantes. Componente `shared/asset-placeholder` removido, junto com os tokens `--opacity-hero-placeholder`, `--color-orange-50`, `--shadow-float`, `--size-store-width/height` (sem uso). Criados `shared/image-asset.ts` (tipos `ImageAsset` e `StoreBadge`) e `shared/store-link` (selo de loja como link). Todas as imagens estáticas usam `NgOptimizedImage` com width/height (hero e logo do header com `priority`, fundos com `fill`).

### Onde cada asset entrou
- header: logo-branco-header (alt "Orange Bank"). footer: logo-branco-footer (alt "Orange Bank"), icon-instagram/facebook/youtube em círculo CSS (45,6 px, fundo `neutral-05` #F3F3F3, ícone #15191C do próprio SVG; link com nome acessível Instagram/Facebook/YouTube, `href="#"`), selo-app-store-footer e selo-google-play-footer (links "Baixar na App Store" / "Disponível no Google Play", `href="#"`), icon-globo e icon-pin nos seletores de idioma/cidade (D-12).
- hero: hero-fundo.webp (decorativa, `aria-hidden`), icon-hand (pílula), icon-anuidade e icon-anuidade-2 (destaques). sobre-nos: icon-hand-two, logotipo-marca-dagua (atrás do conteúdo, a partir de tablet), mockup-iphone.
- tecnologias-utilizadas: os 10 `tech-*.svg`, com alt = nome da tecnologia, em tamanho natural (70 a 92 px, os maiores sangram no vão de 48).
- vantagens-da-conta: foto-moca (base) + foto-moca-recorte (por cima), people-card, icon-device (item 1) e icon-automatizado (item 2). investimentos: foto-investimentos (janela 570 com `object-position`), card-invest.svg (decorativo, o SVG já traz card e sombra; removidos bg/sombra CSS do contêiner). cartao-de-credito: foto-cartao, icon-cartao-device, icon-cartao-shield, icon-servers, icon-mastercard.
- baixar-o-app: fundo-cta.webp + overlay, cta-image-1 (avatares), icon-assine (coluna decorativa, só desktop), selo-app-store.png e selo-google-play.svg (links, `href="#"`).
- index.html/public: `favicon.ico` (16/32/48, gerado de favicon-512.png) substitui o padrão do Angular; `<link rel="icon" png 512>` e `apple-touch-icon` (180, fundo branco, gerado do 512).
- Alt de imagens com significado (texto do builder, descrição visual, vem dos `.data.ts` com `$localize`; revisar): mockup, foto do recorte (vantagens), foto de investimentos, foto do cartão. Decorativas (`alt=""`): fundos, ícones, people-card, card-invest, avatares, selos (o nome acessível está no link).

### Otimização (ferramenta do sistema: Python/Pillow já instalado, sem dependência no projeto)
| Arquivo | Antes | Depois |
|---|---|---|
| hero-fundo | jpg 3840x2160, 6.613 KB | webp 2880x1620 q78, 208 KB |
| foto-moca | jpg 2.658 KB | webp 1000x785 q70, 45 KB (só uma faixa de 19 px aparece sob o recorte) |
| foto-moca-recorte | png 1.878 KB | webp 1449x1449 q80, 51 KB |
| foto-investimentos | jpg 1.536 KB | webp 2311x1142 q80, 88 KB |
| foto-cartao | jpg 1.940 KB | webp 2060x1205 q80, 72 KB |
| fundo-cta | jpg 1.206 KB (1.170x400 em 2x) | webp 2340x740 q80, 128 KB: cortadas 60 linhas do topo (faixa branca; o Figma recorta com o Rectangle 606, 1170x370) |
| mockup-iphone | png 1870x1519, 848 KB | webp 1216x1158 q85 (recorte do bbox alfa, sem margem transparente), 263 KB |
Total de imagens raster: ~15,1 MB para ~0,86 MB. Os originais foram trocados em `public/assets/images/` (cópia dos originais no scratchpad); um novo `figma-map.mjs assets` sobrescreve os arquivos otimizados com os originais: refazer a otimização depois.

### Contraste do texto sobre a imagem real (`contrast.mjs`, branco sobre a cor mais clara sob o texto, suavizada)
- Hero, título (64 px, large): sobre #FF4802 = 3,40:1, passa (3:1).
- Hero, botão "Saiba mais" (18 px/500, sem fundo): sobre #FF3D01 = 3,55:1, **reprova** (4,5:1). Destaques "Cartão sem anuidade"/"Conta digital 100% grátis" (16 px/500): sobre #FF3700 = 3,62:1, **reprova**; sobre o centro do brilho laranja (#E95E2D) cai para ~3,44:1. Pílula e botão primário têm fundo próprio.
- CTA, título (48 px bold, large): sobre #D7DCB6 (parede clara) = 1,42:1; mesmo com o overlay do Figma (linear-burn #D9D9D9, aproximado por preto 15%, token `--color-overlay-cta`) a pior cor é #B1B690 = 2,11:1 e ~6% dos pixels da área do título ficam abaixo de 3:1: **reprova**. Nenhuma cor foi inventada para corrigir; decisão do designer/dono (overlay mais forte, gradiente, ou reposicionar o texto).

### Sem asset / não usado, e por quê
- icon-shield (item 02 FDIC de vantagens): o item não existe no spec; arquivo fica em `public/assets/icons/`, sem uso.
- icon-faq-toggle: o "+"/"-" do FAQ continua desenhado em CSS (decisão anterior; o SVG só desenha "+", o "-" exigiria esconder uma barra).
- 'Union' do CTA (639:812, forma decorativa #FFA370) e os ícones do mockup: não exportados; sem marcador.
- Selos e redes sociais com `href="#"`: o spec não tem URLs (lojas, Instagram, Facebook, YouTube).
- Mockup menor que o Figma: o PNG cabe na coluna central (~590 px), fones ~470 px de largura contra ~570 no Figma. Marca d'água fixa no topo do bloco (Figma a posiciona 27 px acima do grupo). Conferir no QA visual.
- Hero/CTA em mobile e tablet ancoram o fundo à esquerda (`object-position: left center`) para o texto cair sobre a área lisa; no CTA o texto ainda cruza a mulher no desktop.
- Composição de vantagens segue o Figma (foto da moça por baixo, recorte opaco por cima, deslocados em % do grupo 570): aparece uma faixa de ~19 px da foto da moça no topo. O doc dizia que o recorte tinha transparência, mas o PNG é totalmente opaco (alpha 255). Confirmar com o designer se a faixa é desejada.
- Glow laranja do hero mantido (decisão anterior); no Figma é LINEAR_DODGE 69% com blur 200, aqui continua o gradiente radial normal. QA visual deve olhar.

### LICENÇA PENDENTE (não publicar sem o dono confirmar)
Fotos que parecem banco de imagem ou saída de ferramenta externa: **foto-moca, foto-investimentos, foto-cartao, foto-moca-recorte** (esta com nome "magnific_...", gerada por ferramenta). Também conferir: **fundo-cta** (foto de banco de imagem, com cartão "VISA/iti" de terceiro) e foto-investimentos (app de terceiro "magnifi" na tela do celular). Estão no build; o deploy não deve sair antes da confirmação de licença e de uso de marca de terceiros.

## Rodada 5 (D-13 a D-19), 2026-10-04

Projeto `site-factory/sandbox/orangebank`; Node/Angular/CLI sem mudança; sem dependência nova, sem `npm audit`, sem `figma-map.mjs assets`. Seções alteradas: hero, sobre-nos, tecnologias-utilizadas, vantagens-da-conta, investimentos, cartao-de-credito, baixar-o-app, header, footer, button.

- QA-25 vantagens: offsets verticais relativos ao grupo (base `--offset-photo-woman-top` -28,07% = -160; recorte `--offset-photo-cutout-top` -13,51% = -77). Medido: base y=-96 e recorte y=-13 com o bloco em y=64 (= -160 e -77); sem faixa no topo.
- QA-26 sobre-nos (desktop): `padding-top` do corpo 124,9 (`--size-about-mockup-gap`) e marca d'água em `top` = 124,9 - 128,4 (`--offset-watermark-above-mockup`); medido: marca em y=285, mockup em y=413 (128 acima), subtítulo termina em 288 (mockup a 125). Seção 1027 contra 1080 do Figma (-53): o título quebra em 2 linhas aqui contra o bloco de 212 do Figma (decisão anterior de quebra natural) e o respiro inferior é 64 contra 35. Tablet e mobile mantêm o espaçamento anterior (o vão de 125 em tablet deixaria um vazio, o mockup é menor).
- D-14 mockup: imagem em `--size-mockup-image-width` 600 (desktop), colunas de texto de 311 com gap 10; aparelhos medidos ~543 px (de x=449 a 992), topo a 17 do topo da caixa (margin-top 14 na imagem).
- QA-28 cartão: sem altura fixa de ícone (largura 33 mantida para alinhar o texto), `padding-block` 15 + borda 1, gap título-lista 40. Alturas medidas 56/57/59/65 contra 56/56/58/65 do Figma: os SVG exportados (25x25 e 25x27) são 1 a 2 px maiores que os nós do Figma (23x23, 25x26); redimensionar deformaria o ícone, então ficou a diferença de 1 px nos itens 2 e 3 (lista 309 contra 307).
- D-19 negrito parcial: dados com `parts: {text, strong}[]` e `$localize` por trecho (ids `cartao.item-N.base/.strong`); base `--text-list-item` 500 18/21,6, trecho `--text-h3` 600 20/24. Sem lógica nova, sem spec novo (o `@for`/`class` só liga dados).
- QA-29: primeiro parágrafo `--text-h3` (600 20/24) via modificador `--lead`; medido 4 linhas (96 de altura).
- QA-30: avatares e título num bloco `__heading` com gap 8; cartão do CTA 476 de altura (era 492).
- QA-32: redes e link com `--radius-8` (quadrados); design-system.md corrigido (linhas das redes).
- QA-33: logos com `mix-blend-mode: luminosity` e `opacity: var(--opacity-tech-logo)` 0,56 sobre #F3F3F3 (blend idêntico ao do Figma, sem aproximar por grayscale).
- D-15: foto do CTA com `--object-position-cta: 18% 0` (só object-position). A foto (2340x740) já aparece inteira na vertical em qualquer altura do cartão (cover escala pela altura), então o corte da cabeça no topo é do arquivo e não dá para reduzi-lo por object-position; ajustei o eixo x para o título não cruzar o braço da mulher e o ícone redondo não cobrir a testa (0% cobria a testa, 30% deixava o título no braço).
- D-16: glow `--size-hero-glow` 344,5, centrado em 50% + 58 (x=778) e top 38,5 (centro y=210,8), `#E95E2D`, plus-lighter, opacidade 0,69, `blur(100px)`, entre a imagem e o conteúdo (hero com `isolation: isolate`); imagem de fundo com `filter: saturate(0.94)` (`--filter-hero-image`).
- D-18: botão com seta `seta-botao.svg` como máscara CSS (`currentcolor`, 23x10, tokens `--size-arrow-*`), gap 10. Cor segue o texto (escuro no botão primário, branco no outline); o Figma desenha a seta branca, mas branco sobre #FF823D daria ~2,5:1.
- D-17 conflito D-16/D-17: o contraste venceu. Gradientes escuros suaves por cima do glow e sob o texto (hero desktop: 20% até 40% da largura e some em 75%; hero compacto: 28% uniforme; header desktop: 15%; CTA: 15% até 50% e some em 85%, somados ao overlay de 15% que já existia). Alfas escolhidos por medição: a primeira tentativa (45/40/45%) passava com folga enorme (6 a 12:1) mas escurecia o hero demais; 20/28/15/15 é o menor conjunto testado que mantém folga.

### Contraste medido (`contrast.mjs`, branco sobre a cor MAIS CLARA sob o texto, texto transparente na captura, pixel a pixel, com glow e gradiente)
| Largura | Elemento | Pior fundo | Razão | Mínimo |
|---|---|---|---|---|
| 1440 | hero título (large) | #D65814 | 3,99:1 | 3:1 |
| 1440 | hero "Saiba mais" 18/500 | #C73307 | 5,38:1 | 4,5:1 |
| 1440 | hero destaques 16/500 | #C42B05 | 5,68:1 | 4,5:1 |
| 1440 | header menu 18/500 | #CD4011 | 4,84:1 | 4,5:1 |
| 1440 | CTA título (large) | #992F0A | 7,59:1 | 3:1 |
| 768 | hero título / Saiba mais / destaques | #B84E16 / #B72706 / #B11F07 | 5,07 / 6,35 / 6,84 | 3 / 4,5 / 4,5 |
| 768 | CTA título | #A5330B | 6,82:1 | 3:1 |
| 375 | hero título / Saiba mais / destaques | #B84617 / #B82406 / #B21D07 | 5,35 / 6,38 / 6,84 | 3 / 4,5 / 4,5 |
| 375 | CTA título | #AE360B | 6,30:1 | 3:1 |
| 768 e 375 | menu aberto (fundo sólido #D3410D, sem gradiente) | #D3410D | 4,63:1 | 4,5:1 |

### Validação
- `code-quality`: APROVADO (0 falhas: lint, stylelint, 11 testes, 100% cobertura, componentes, BEM, tokens). `ng build`: 0 warnings, 0 erros. Sem rolagem horizontal em 320, 375, 768, 1024, 1199, 1200 e 1440. `qa-capture` desktop, tablet e mobile: 0 achados automáticos.

## 2026-10-04 - Rodada 6 (D-20 a D-22), sandbox/orangebank

- **D-20 (QA-42/43):** `--gradient-scrim-hero` 12% de preto de x=0 a 35% e some em 60% (era 20%/75%); `-compact` 15% (era 28%); glow agora ACIMA do scrim (`hero.html`: scrim antes do glow), blur 100px (inalterado) e opacidade 0,5 (era 0,69). Header: `--gradient-scrim-header` virou degrade vertical 18% (0 a 55%) para 0% (100%), sem borda reta em y=100. Medido por captura sem texto + `contrast.mjs` contra o pixel mais claro sob cada texto (branco): titulo (large) 255,94,21 = 3,06:1 (mobile 255,76,23; tablet 255,87,22, ambos > 3:1); destaques 216,48,5 = 4,9:1; "Saiba mais" 220,57,7 = 4,5+:1; menu 214,64,18 (#d64012) = 4,56:1 no pior item ("Cartao de credito"). Sem scrim no header o menu ficava a 254,82,24 (~3,2:1), por isso o degrade minimo. Glow: com opacidade 0,69 o titulo (que se sobrepoe ao disco do glow) caia para 2,87:1; centro do glow 255,105,23 contra 255,137,67 do Figma: mais fraco que o Figma, limite imposto pelo contraste (a 0,69 o centro passa de 255,119,30). Degrau em y=99/105 no header (300px): 224,41,13 contra 216,40,6 (era 178 contra 196).
- **D-21 (QA-46):** PNG em pe extraido do SVG (base64 embutido, sem dependencia) para `public/assets/icons/icon-hand-two-pe.png` (160x160) e arco 551:470 extraido do mesmo SVG para `icon-hand-two-arco.svg` (52x52, opacidade 0,2). `sobre-nos`: PNG a 37,2px no contêiner 52x52 com `rotate(-36.23deg)` e origem no centro (tokens `--size-icon-about-hand`, `--rotation-icon-about-hand`); arco sem rotação por cima. Conferido por captura. Hero nao gira. Nao foi preciso reexportar nem `assets-extra2.json`. `icon-hand-two.svg` ficou sem uso.
- **D-22 (QA-44):** `investimentos`: parágrafos agrupados em `.investimentos__body` (gap 24); gap 40 entre título, bloco e botão. Medido: título 2846-2942, bloco 2982-3168, botão 3208-3268.
- Sem overflow horizontal em 375 e 1440. code-quality APROVADO, `ng build` sem warnings.
