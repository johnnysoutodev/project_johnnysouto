# Plano de Migração — Site em Angular + i18n (pt-BR / es-ES / en-US)

> Documento vivo de planejamento. Ainda em fase de planejamento — nenhuma implementação começou. Complementa `docs/ANALISE-PROJETO.md` (estado atual do repositório) e `docs/ai-instructions.md` (regras gerais para IAs).

**Última atualização:** 06/09/2026
**Status:** 📋 Planejamento

---

## 1. Objetivo

Migrar o site pessoal/currículo de Johnny Souto (hoje HTML/CSS/JS estático + Materialize + Grunt) para uma aplicação **Angular**, com:

1. Design vindo de um arquivo **Figma**, incluindo **dark mode** e **menu mobile dedicado** (ambos já contemplados no design, ver `docs/design-system.md`).
2. Internacionalização completa: **pt-BR** (idioma padrão/inicial), **es-ES** e **en-US**.
3. **Zero quebra** do site em produção (`https://www.johnnysouto.com.br`) durante o processo.
4. **Google Analytics** continuando a rastrear normalmente após a migração.

## 2. Decisões arquiteturais já tomadas

Estas decisões foram discutidas e definidas antes de detalhar as fases — qualquer mudança nelas deve atualizar este documento.

| Decisão | Escolha | Por quê |
|---|---|---|
| Renderização | **Prerender estático (SSG)**, via `@angular/ssr`/Angular prerendering, sem servidor Node em produção | Mantém o deploy 100% estático na Vercel (`outputDirectory` de arquivos prontos, como hoje), preservando SEO, meta tags e Open Graph por página — sem precisar de runtime Node a cada request. |
| Internacionalização | **i18n nativo do Angular** (compile-time, um build por idioma) | Melhor performance e SEO por idioma (cada idioma vira HTML totalmente traduzido e prerenderizado), mesmo trade-off que hoje já existe manualmente (`src/pt/`, `src/en/`). Custo: trocar um texto exige rebuild — aceitável para um site de currículo, que muda com pouca frequência. |
| Estratégia de rollout | **Construir em paralelo, trocar no final** | O novo site Angular é desenvolvido isolado (branch e/ou projeto de preview próprio na Vercel), sem tocar no pipeline Grunt/`public/` atual. A produção só passa a apontar para o novo build depois de validado e aprovado. |
| Origem do design | **Figma fornecido pelo Johnny** | O Claude/Copilot extrai especificações (cores, espaçamentos, tipografia, componentes) via o servidor MCP do Figma já configurado em `.vscode/mcp.json`, em vez de desenhar o design do zero. |
| Dark mode | **Entra no escopo** | O Figma já contempla variantes Light/Dark completas (mesmas seções, tokens de cor próprios) — ver `docs/design-system.md`. Implementar como parte natural do design system, com alternância manual e respeito a `prefers-color-scheme` como padrão inicial. |
| Menu mobile | **Entra no escopo** | O Figma já contempla um menu mobile dedicado (overlay), tanto em Light quanto em Dark — ver `docs/design-system.md`. Não é uma funcionalidade nova a inventar, só a implementar a partir do que já está desenhado. |
| Breakpoint tablet | **Entra no escopo, sem referência no Figma** | O Figma só tem Desktop (1440) e Mobile/iPhone 8 (375) — nenhum frame de tablet (confirmado em `docs/design-system.md`, seção 7). Johnny decidiu que o site precisa se comportar bem em tablet mesmo assim. Convenção proposta (não extraída do Figma): tablet ~768–1023px, desktop a partir de 1024px — padrão comum de mercado (ex.: breakpoints `md`/`lg` do Tailwind CSS). O layout intermediário em si (como cada seção se comporta nessa faixa) é decisão de implementação da Fase 2, interpolando entre os paddings/gaps mobile e desktop já documentados, não uma cópia de spec do Figma. |

## 3. Escopo de conteúdo (paridade com o site atual)

Baseado no inventário de `docs/ANALISE-PROJETO.md`, tudo isto precisa ter equivalente no novo site antes do corte de produção:

- [ ] Página principal (CV/currículo) — hoje `src/index.html`.
- [ ] Versão pt-BR — hoje `src/pt/index.html` → passa a ser o idioma padrão (`/` ou `/pt-br/`, a definir na Fase 3).
- [ ] Versão en-US — hoje `src/en/index.html` → rota `/en-us/`.
- [ ] Versão **es-ES — nova**, não existe hoje.
- [ ] **CV para download — novo formato**, substituindo a versão de impressão em HTML (`src/printer/index.html`, que sai do escopo desta migração). Documento de currículo baixável nos três idiomas: o idioma do arquivo baixado acompanha o idioma atual do site (ex.: usuário navegando em `/en-us/` baixa o CV em inglês). Formato exato do arquivo e forma de geração/entrega ainda a decidir (ver Fase 4).
- [ ] Meta tags de SEO/Open Graph (title, description, keywords, `og:title`, `og:description`, `og:image`, `og:url`, `og:site_name`) — por idioma.
- [ ] `robots.txt`.
- [ ] Favicon e imagens (`bg.png`, `perfil_jjns.jpeg`).
- [ ] **Google Analytics** (`gtag.js`, ID atual `UG-YYR4SND80L`) — funcionando em todas as rotas/idiomas.
- [ ] `cleanUrls` / comportamento de URLs equivalente ao `vercel.json` atual.
- [ ] **Dark mode — novo**, não existe hoje. Alternância manual (toggle) com persistência da escolha do usuário, respeitando `prefers-color-scheme` como padrão inicial.
- [ ] **Menu mobile dedicado — novo**, não existe hoje (site atual não tem navegação mobile própria). Overlay conforme design do Figma, funcionando em ambos os temas.
- [ ] **Suporte a tablet — novo**, sem referência de layout no Figma (só Desktop/Mobile). Breakpoint proposto ~768–1023px (ver Decisões arquiteturais); layout intermediário a definir na Fase 2.

## 4. Estrutura de pastas proposta

Para não colidir com o que existe (e não repetir o problema do antigo diretório `app/`, que ficou solto e não rastreado), a app Angular nasce num diretório novo e claramente nomeado, convivendo com o site atual até o corte final:

```
project_johnnysouto/
├── src/            # site atual (legado) — intocado durante a migração
├── public/         # build atual (legado) — intocado durante a migração
├── angular-app/    # NOVO projeto Angular (nome confirmado, scaffold da Fase 1 já criado)
│   ├── src/
│   │   ├── app/
│   │   ├── locale/         # arquivos de tradução (pt-BR, es-ES, en-US)
│   │   └── ...
│   ├── angular.json
│   └── package.json
├── docs/
│   ├── ANALISE-PROJETO.md
│   ├── PLANO-MIGRACAO-ANGULAR.md   # este documento
│   ├── design-system.md           # specs extraídas do Figma via MCP
│   └── ...
```

> Depois do corte de produção (Fase 8), `src/` e `public/` (legado) e o `gruntfile.js` são removidos, e o conteúdo de `angular-app/` pode subir para a raiz, se fizer sentido na época.

## 5. Fases

### Fase 0 — Preparação
- [x] Johnny compartilha o arquivo/link do Figma com o design: <https://www.figma.com/design/9z2dzCKhlXWqVynN5SEeEM/template_portfolio_website?node-id=0-1&m=dev&t=p400RgMm8j8SjqJM-1>
- [x] Extrair specs do Figma via MCP (cores, tipografia, espaçamentos, componentes, breakpoints). Specs de nível página/tema salvas em `docs/design-system.md`; specs de componentes individuais ficam para a Fase 2, extraídas sob demanda.
- [x] Nome final do diretório do novo projeto confirmado: `angular-app/` (Johnny confirmou; scaffold da Fase 1 já criado com esse nome).
- [x] Versão do Angular definida: a mais recente estável no momento da Fase 1 (Angular 21/22), que exige **Node ~24.16.x** — diferente do Node 20 do `.nvmrc` atual (legado, usado pelo Grunt). O novo projeto Angular precisa de um pin de versão de Node próprio (ex.: `.nvmrc`/Volta dentro do diretório do projeto), sem alterar o `.nvmrc` da raiz enquanto o site legado ainda depender de Node 20.
- [ ] Decidir se a Vercel vai ter um **projeto separado** para o preview do novo site ou um **environment/branch** dentro do mesmo projeto.

### Fase 1 — Scaffold do projeto Angular

> Executado pelo agente `angular-scaffold` (`docs/agent-rules/angular-scaffold.md`), não por um `ng new` avulso — ele cuida de rodar o scaffold isolado do repositório existente, sem Git aninhado, com a versão de Node/Angular certa.

- [x] `ng new` do novo projeto dentro de `angular-app/`, com roteamento, SSR/prerender e **SCSS** habilitados desde o início, e `--skip-git` (não pode criar um repositório Git aninhado dentro deste repositório). Rodado via `npx @angular/cli@22.1.7 new angular-app --directory=angular-app --style=scss --routing --ssr --skip-git --ai-config=claude-code --ai-config=vscode --package-manager=npm --interactive=false`.
- [x] Pinado **Node 24.18.0** (a versão ativa no terminal no momento do scaffold, dentro do range exigido pelo Angular 22.1.7: `^22.22.3 || ^24.15.0 || >=26.0.0`) só para o novo projeto, via `angular-app/.nvmrc` e `engines.node` em `angular-app/package.json`, sem alterar o `.nvmrc` da raiz (Node 20, ainda usado pelo Grunt legado).
- [x] Configurada a integração de IA do Angular CLI para **Claude Code** (`--ai-config=claude-code`, gera `CLAUDE.md` + `.mcp.json`) **e VSCode/GitHub Copilot** (`--ai-config=vscode`, gera `AGENTS.md` + `.vscode/mcp.json`) no novo subprojeto. Nota: na versão 22.1.7 do Angular CLI, o schematic `ai-config` usado pelo `ng new` não tem mais uma opção dedicada "copilot" (só existe em uma versão mais antiga do schematic, usada por `ng generate ai-config` isoladamente) — a opção `vscode` (gera `AGENTS.md`, formato que o GitHub Copilot no VS Code também lê, + `.vscode/mcp.json`) é a equivalente mais próxima nesta versão do CLI, confirmada via `--help` antes de usar.
- [x] Configurado lint/format: ESLint via `ng add @angular-eslint/schematics@22.2.0` (`eslint.config.js`, builder `@angular-eslint/builder:lint`, script `npm run lint`) + Prettier (`.prettierrc`/`.editorconfig` já gerados pelo `ng new`, com scripts `npm run format`/`npm run format:check` adicionados). Todo o projeto gerado foi formatado uma vez (`npm run format`) para começar consistente.
- [x] Pipeline de CI mínimo criado em `.github/workflows/Angular-App-CI.yaml`: roda só quando algo dentro de `angular-app/**` muda (`paths` filter), instala com `npm ci`, roda lint e `ng build`. Não altera `Develop.yaml`/`Production.yaml`.

### Fase 2 — Design system a partir do Figma

> Geração dos componentes executada pelo agente `angular-components` (`docs/agent-rules/angular-components.md`), que consome o que já está em `docs/design-system.md` — não se conecta ao Figma nem cria o projeto Angular por conta própria.

- [x] Tokens de design (cores, tipografia, espaçamento) extraídos do Figma — light e dark (ver `docs/design-system.md`) — e migrados para dentro do projeto Angular como CSS custom properties (`angular-app/src/styles/_tokens.scss`), prontos para os dois temas via `[data-theme="dark"]` (toggle ainda não ligado).
- [ ] Componentes reutilizáveis (header, seções do CV, footer), já preparados para os dois temas (ex.: via CSS variables/tokens, não cores fixas).
  - [x] Subcomponentes base: Icon Button (36×36/44×44, design-system.md 8.3) e Tag (8.4) — `angular-app/src/app/shared/components/`.
  - [x] Header (8.1) — `angular-app/src/app/layout/header/` (layout estático, sem sticky/scroll e sem menu mobile ainda).
  - [x] Footer (8.2) — `angular-app/src/app/layout/footer/`.
  - [ ] Hero, About, Skills, Experience, Work, Testimonials, Contact me — próximas fatias.
- [ ] Menu mobile dedicado (overlay), conforme design do Figma, nos dois temas.
- [ ] Toggle de dark mode (componente + lógica de alternância/persistência).
- [ ] Aplicar o design às páginas, sem ainda ligar i18n (conteúdo fixo em pt-BR nesta fase).
- [ ] Definir e implementar o layout do breakpoint tablet (~768–1023px) para cada seção — sem referência no Figma, interpolando entre os paddings/gaps mobile e desktop já documentados em `docs/design-system.md`.

### Fase 3 — Internacionalização
- [ ] Configurar i18n nativo do Angular com os três locales: `pt-BR` (padrão), `es-ES`, `en-US`.
- [ ] Extrair todo o texto para arquivos de tradução.
- [ ] Traduzir para `es-ES` (conteúdo novo) e revisar `en-US` (já existe uma versão manual hoje, usar como base).
- [ ] Definir estrutura de rotas por idioma (ex.: `/`, `/es-es/`, `/en-us/` — ou `/pt-br/` explícito; decidir junto com SEO/`hreflang`).
- [ ] Adicionar tags `hreflang` para SEO multilíngue.

### Fase 4 — Paridade de conteúdo e SEO
- [ ] Migrar todas as meta tags/Open Graph por idioma (ver checklist da seção 3).
- [ ] Recriar `robots.txt` e (se fizer sentido) adicionar `sitemap.xml` com as variantes de idioma.
- [ ] Implementar o download do CV nos três idiomas, entregando o arquivo no idioma atual do site — **decidir e documentar aqui** a forma de geração/padronização do download (ex.: PDF estático por idioma gerado em build, ou outra abordagem) antes de implementar.
- [ ] Validar favicon e imagens.

### Fase 5 — Google Analytics
- [ ] Reimplementar o carregamento do `gtag.js` no Angular (ex.: serviço de analytics carregado no bootstrap, respeitando o prerender/SSG).
- [ ] Validar que pageviews são disparados corretamente em navegação entre rotas Angular (Router events), já que isso não é automático como em HTML estático.
- [ ] Confirmar que o ID de measurement é o mesmo (`UG-YYR4SND80L`) ou decidir se troca.
- [ ] Testar em ambiente de preview antes do corte, validando no próprio Google Analytics que os hits chegam.

### Fase 6 — Build & deploy
- [ ] Configurar build de produção com prerender para os 3 idiomas.
- [ ] Novo `vercel.json` (ou config equivalente) apontando para a saída do build Angular.
- [ ] Deploy de **preview** (não produção) para validação.

### Fase 7 — QA e validação lado a lado
- [ ] Comparação visual página a página com o site atual.
- [ ] Lighthouse / Core Web Vitals no novo site vs. atual.
- [ ] Checklist de SEO (meta tags, `hreflang`, sitemap, robots).
- [ ] Confirmação de que o Google Analytics está recebendo dados do preview (idealmente numa property/stream de teste, para não misturar com dados reais de produção).
- [ ] Revisão de conteúdo com o Johnny (principalmente as traduções em `es-ES`).
- [ ] Validar dark mode em todas as páginas/idiomas (contraste, persistência da escolha, `prefers-color-scheme` inicial).
- [ ] Validar menu mobile dedicado em diferentes tamanhos de tela e nos dois temas.
- [ ] Validar layout em tablet (~768–1023px) em todas as seções e nos dois temas — sem referência do Figma, então a comparação aqui é contra o critério de "bom senso responsivo", não contra um design de origem.
- [ ] Validar que o download do CV entrega o arquivo no idioma correspondente em cada rota/idioma do site.

### Fase 8 — Corte de produção
- [ ] Definir plano de rollback (como voltar ao site atual rapidamente se algo der errado).
- [ ] Apontar o domínio de produção (`www.johnnysouto.com.br`) para o novo deploy.
- [ ] Monitorar Analytics, erros e Search Console nas primeiras 24–48h.

### Fase 9 — Pós-migração
- [ ] Remover `src/`, `public/`, `gruntfile.js` e dependências do Grunt (após confirmação de estabilidade).
- [ ] Atualizar `docs/ANALISE-PROJETO.md` para descrever a nova stack.
- [ ] Atualizar `docs/ai-instructions.md` (a regra atual diz para não introduzir framework reativo sem alinhamento prévio — este plano é esse alinhamento; a regra deve ser atualizada para refletir Angular como stack oficial).
- [ ] Arquivar ou marcar este documento como concluído no log de evolução.

## 6. Riscos e mitigação

| Risco | Mitigação |
|---|---|
| Perder posicionamento de SEO na troca | Prerender estático + `hreflang` + validação de meta tags antes do corte (Fase 7); manter mesma estrutura de URLs quando possível. |
| Google Analytics parar de registrar durante/depois da troca | Testar em property/stream de teste antes; validar pageviews via Router events; monitorar de perto nas primeiras 48h (Fase 8). |
| Traduções de `es-ES` com baixa qualidade | Revisão humana (Johnny ou revisor nativo) antes do corte — não depender só de tradução automática. |
| Regressão visual/funcional no site atual durante o desenvolvimento | Novo projeto isolado em `angular-app/`, sem tocar em `src/`/`public/`/workflows atuais até a Fase 8. |
| Escopo crescer demais (ex.: querer CMS, blog, etc. no meio do caminho) | Este plano cobre só migração de framework + i18n + design (incluindo dark mode e menu mobile, já previstos no Figma); qualquer funcionalidade nova além disso entra como item futuro, não nesta migração. |
| Dark mode gerar flash de tema errado (FOUC) no site prerenderizado (SSG) | Aplicar o tema antes do primeiro paint (inline script mínimo lendo preferência salva/`prefers-color-scheme`), validado na Fase 7. |

## 7. Critérios de sucesso (Definition of Done)

- Site novo em Angular, publicado em produção, com paridade total de conteúdo com o site atual.
- Três idiomas funcionando (`pt-BR`, `es-ES`, `en-US`), com troca de idioma acessível ao usuário.
- Dark mode funcionando em produção, com alternância manual e persistência da escolha.
- Menu mobile dedicado funcionando em produção, nos dois temas.
- Layout funcionando bem em tablet (~768–1023px), mesmo sem referência de origem no Figma.
- Google Analytics confirmado funcionando em produção após o corte.
- SEO (meta tags, Open Graph, `hreflang`, robots/sitemap) validado antes do corte.
- Nenhum período de indisponibilidade do site atual durante o desenvolvimento.
- `docs/ANALISE-PROJETO.md` e `docs/ai-instructions.md` atualizados refletindo a nova stack.

## 8. Log de evolução deste plano

| Data | Mudança |
|---|---|
| 06/09/2026 | Criação do plano, com decisões arquiteturais iniciais definidas (SSG, i18n nativo, rollout em paralelo, design via Figma/MCP). |
| 06/09/2026 | Conectado ao MCP do Figma e extraídas specs de página/tema (cores, tipografia, sombras, seções, breakpoints) em `docs/design-system.md`. Design contempla dark mode e menu mobile dedicado, ainda não previstos neste plano — decisão pendente. |
| 06/09/2026 | Dark mode e menu mobile dedicado adicionados ao escopo da migração (Johnny confirmou), já que ambos estão presentes no design do Figma. Atualizado objetivo, decisões arquiteturais, escopo de conteúdo, Fase 2, Fase 7, riscos e critérios de sucesso. |
| 06/09/2026 | Wrapper do novo projeto renomeado de `web/` para `angular-app/` (nome final ainda a confirmar), mantendo o isolamento do site legado. Versão do Angular definida como Angular 21/22, exigindo Node ~24.16.x — pin de versão próprio do novo projeto, sem alterar o `.nvmrc` (Node 20) da raiz, que o site legado ainda usa. |
| 06/09/2026 | Criado o agente `angular-scaffold` (`docs/agent-rules/angular-scaffold.md`) para executar o scaffold da Fase 1 dentro deste repositório já existente — garante `--skip-git` (sem repositório Git aninhado), SCSS, versão de Node/Angular compatível, e aplica a configuração de IA do Angular CLI para Claude/Copilot. |
| 06/09/2026 | Versão de impressão (`src/printer/index.html`) removida do escopo, substituída por um CV para download nos três idiomas — o idioma do arquivo baixado acompanha o idioma atual do site. Forma de geração/padronização do download ainda não decidida (Fase 4). Atualizado escopo de conteúdo, Fase 2, Fase 4 e Fase 7. |
| 06/09/2026 | Criado o agente `angular-components` (`docs/agent-rules/angular-components.md`) para gerar os componentes Angular da Fase 2 a partir do que já está documentado em `docs/design-system.md` (estrutura/layout do Figma, tokens, assets) — não se conecta ao Figma (isso é do `designer`) nem cria o projeto (isso é do `angular-scaffold`), só consome o que os dois já produziram. |
| 06/09/2026 | Suporte a tablet adicionado ao escopo (Johnny confirmou), mesmo sem nenhum frame de tablet no Figma (só Desktop 1440/Mobile 375). Breakpoint proposto ~768–1023px (convenção comum, não extraída do Figma) — layout intermediário fica para decisão de implementação na Fase 2. Atualizado decisões arquiteturais, escopo de conteúdo, Fase 2, Fase 7 e critérios de sucesso. |
| 06/09/2026 | Fase 1 (scaffold) executada pelo agente `angular-scaffold`. Nome do diretório `angular-app/` confirmado (Fase 0). `ng new` rodado com Angular CLI **22.1.7** / `@angular/core` **22.1.5** / Node **24.18.0** (`npx @angular/cli@22.1.7 new angular-app --directory=angular-app --style=scss --routing --ssr --skip-git --ai-config=claude-code --ai-config=vscode --package-manager=npm --interactive=false`), gerando `angular-app/` com roteamento, SSR/prerender e SCSS. Node pinado só para o subprojeto (`angular-app/.nvmrc` = `24.18.0`, `engines.node` em `angular-app/package.json`), sem tocar no `.nvmrc` da raiz. Config de IA do Angular CLI aplicada para Claude Code (`CLAUDE.md` + `.mcp.json`) e VSCode/Copilot (`AGENTS.md` + `.vscode/mcp.json` — na v22.1.7 do CLI não existe mais uma opção `ai-config` dedicada a "copilot", `vscode` é a mais próxima). Lint configurado via `ng add @angular-eslint/schematics@22.2.0`; Prettier (já gerado pelo `ng new`) com scripts `format`/`format:check` adicionados; projeto formatado uma vez. Build (`ng build`) e lint validados com sucesso. Pipeline de CI mínimo criado em `.github/workflows/Angular-App-CI.yaml` (só roda em mudanças dentro de `angular-app/**`, instala + lint + build, sem deploy), sem alterar `Develop.yaml`/`Production.yaml`. Efeito colateral necessário: o `.gitignore` da raiz ignorava `.vscode` em qualquer profundidade — restringido para `/.vscode` (só a raiz), para não silenciar o `angular-app/.vscode/` (tasks/launch/extensions/mcp.json), que é intencionalmente versionado pelo scaffold do Angular CLI. Nota de ambiente: a instalação de pacotes (`npm install`) nesta máquina esbarrou numa política de scripts do npm do usuário (`~/.npmrc`, config `allow-scripts` restrita a `@anthropic-ai/claude-code`, erro `EALLOWSCRIPTS`) — resolvido adicionando `angular-app/.npmrc` com `ignore-scripts=true` (validado: build/lint funcionam normalmente sem lifecycle scripts; reavaliar se algum pacote futuro exigir postinstall de verdade). Nenhum `git commit`/`push` foi feito — scaffold fica como arquivos não commitados para revisão do Johnny. |
| 06/09/2026 | Fase 2 (design system), primeira fatia, executada pelo agente `angular-components`: fundação de tema + 2 subcomponentes mais reutilizados + 2 seções mais simples. Tokens de `docs/design-tokens.css` migrados para `angular-app/src/styles/` (`_tokens.scss` cores light/dark, tipografia, sombras, espaçamento e uma pequena escala de border-radius nova — 8px/12px, observada na seção 8 do design-system.md; `_typography.scss` com um mixin por estilo tipográfico; `_breakpoints.scss` com o breakpoint de tablet já proposto na seção 7; `_layout.scss` com os mixins de padding de seção/container reaproveitáveis pelas próximas fatias), consumidos por `src/styles.scss` (reset mínimo + `stylePreprocessorOptions.includePaths` em `angular.json` para import curto nos componentes) e pela fonte Inter carregada via Google Fonts em `src/index.html`. Gerados como standalone components: `IconButton` (`shared/components/icon-button/`, 2 variantes de tamanho, hover/active por convenção do projeto — sem spec de estado no Figma) e `Tag` (`shared/components/tag/`); `Header` (`layout/header/`, logo placeholder "SS" do próprio template Figma, nav de 4 links, divider, Icon Button de tema/menu + botão "Download CV") e `Footer` (`layout/footer/`, ícone `icon-footer` + copyright), ambos responsivos (80px/16-24px desktop → 16px horizontal mobile → 48px tablet interpolado, vertical mantido fixo por serem barras compactas — convenção documentada nos comentários do SCSS, não extração do Figma). Ícone de tema/menu do Header segue pendente de exportação (mesma pendência já registrada em design-system.md 6/8.3) — usado um placeholder SVG genérico inline, comentado como tal. `App` (`app.ts`/`app.html`) atualizado para compor Header + Footer + `router-outlet`, substituindo o template de demo do scaffold. `npm run format`, `npm run lint`, `ng build` (com prerender) e `npm run test` (vitest) validados sem erros. Nenhum `git commit` feito. |
