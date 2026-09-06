# Regras para IAs neste repositório

> Conteúdo agnóstico de ferramenta, sem frontmatter. É a fonte única de verdade das instruções gerais deste projeto para qualquer assistente de IA (GitHub Copilot, Claude Code, ou outro). `CLAUDE.md` (raiz) e `.github/copilot-instructions.md` são apenas pontes que apontam para este arquivo — edite as regras aqui.

## Sobre o projeto

Site pessoal/currículo estático (HTML/CSS/JS + Materialize CSS, build via Grunt, deploy na Vercel). Para o retrato completo e atualizado do repositório (estrutura, stack, CI/CD, pendências), veja **`docs/ANALISE-PROJETO.md`** antes de propor mudanças estruturais — mantenha esse documento atualizado quando o projeto evoluir.

## Fluxo de branches e deploy

- Fluxo esperado: `feature/* → develop → main`.
- Push em `develop` dispara deploy de preview; push/merge em `main` dispara deploy de produção (ver `.github/workflows/`).
- `public/` é o artefato publicado (gerado a partir de `src/` via `grunt compile`/`grunt publish`) — o CI atualmente **não** roda o Grunt, então garanta que `public/` esteja sincronizado com `src/` antes de commitar mudanças no site.

## Commits

Siga Conventional Commits, com commits atômicos (uma mudança lógica por commit). O procedimento detalhado de agrupamento está em `docs/agent-rules/atomics-commits.md`.

## Segurança de dependências

Vulnerabilidades reportadas por `npm audit` devem ser resolvidas preferencialmente via `overrides` no `package.json`, sem quebrar o projeto. Procedimento completo em `docs/agent-rules/resolved-vulnerability.md`.

## Design e Figma

Specs de design (cores, tipografia, espaçamento, sombras, estrutura de seções) vêm de um arquivo Figma fornecido pelo Johnny e são documentadas em `docs/design-system.md`, atualizado por merge incremental (nunca regerado do zero, para não perder notas e pendências já registradas). Procedimento completo de extração via MCP do Figma em `docs/agent-rules/designer.md`.

## Lições da migração Angular (aplicar a todo componente/serviço novo)

Um terceiro bug real, da mesma família, ocorreu na criação do menu mobile (`angular-app/src/app/layout/mobile-menu/mobile-menu.ts`): um `effect()` chamava `.focus()` no primeiro elemento do painel ao abrir, mas o binding `[attr.inert]` do template reage ao mesmo signal sem ordem garantida entre "effect roda" e "change detection aplica o binding" — o `.focus()` rodava antes do `inert` ser removido do DOM, e o navegador recusa focar elemento `inert` (silenciosamente, sem erro). Passava despercebido nos testes porque o helper de teste chamava `detectChanges()` antes de `flushEffects()`, o que coincidentemente já aplicava o binding a tempo dentro do teste — só apareceu em teste manual real no navegador. Regra adicional: quando um `effect()` precisa interagir com um elemento cujo estado (visibilidade, `inert`, `disabled`) é controlado por um binding de template reagindo ao mesmo signal, empurre a interação (`.focus()` etc.) pra um `queueMicrotask()`/próximo tick, nunca assuma que o binding já foi aplicado só porque o `effect()` já rodou.

Dois bugs reais já ocorreram na criação do `ThemeService` (`angular-app/src/app/core/theme/theme.ts`, detalhe completo em `docs/agent-rules/angular-components.md`, seção "Validar"): um `effect()` sem guarda de plataforma quebrou o build de SSR/prerender com `document is not defined`, e a ordem de leitura de estado persistido (localStorage) fez o `effect()` sobrescrever um tema salvo a cada reload. Regra para qualquer componente/serviço Angular novo deste projeto: (1) todo acesso a `document`/`window`/`localStorage`/`matchMedia` dentro de `effect()`/construtor precisa estar atrás de `isPlatformBrowser(inject(PLATFORM_ID))`; (2) leia o valor inicial real de estado persistido de forma síncrona **antes** de declarar o `effect()`, nunca deixe o `effect()` gravar um default transitório por cima; (3) valide sempre com `ng build` com prerender ligado (não só o dev server) — é o único jeito de pegar erro de SSR; (4) escreva teste unitário (Vitest) para qualquer lógica não-trivial, não só o `should create` padrão.

## Migração Angular

O plano de migração para Angular (`docs/PLANO-MIGRACAO-ANGULAR.md`) já está em andamento — decisões de arquitetura, versão e nome de diretório ficam registradas lá, não devem ser repetidas de memória. O scaffold inicial do projeto Angular **dentro deste repositório já existente** (Fase 1 do plano) é feito pelo procedimento em `docs/agent-rules/angular-scaffold.md`, não por um `ng new` avulso — ele garante versão de Node/Angular compatível, isolamento do site legado (sem repositório Git aninhado) e SCSS desde o início. A geração dos componentes Angular de cada seção do site (Fase 2), a partir do que já está documentado em `docs/design-system.md`, é feita pelo procedimento em `docs/agent-rules/angular-components.md` — ele só consome o design já extraído (pelo `designer`) e o projeto já criado (pelo `angular-scaffold`), não faz nenhum dos dois.

## Agentes personalizados

Procedimentos reutilizáveis e mais específicos (não regras gerais) vivem em `docs/agent-rules/`, com pontes por ferramenta em `.github/agents/` (Copilot) e `.claude/agents/` (Claude Code). Lista completa e como adicionar novos agentes: `docs/agent-rules/README.md`.

## Uso eficiente de tokens

Minimize o consumo de tokens em todas as interações, sem sacrificar corretude:

- Respostas curtas e diretas — sem repetir informação que já foi dada na conversa, sem seções/resumos redundantes.
- Ao ler arquivos, prefira ler só o trecho relevante (offset/limit, busca direcionada) em vez do arquivo inteiro, quando o arquivo for grande e a dúvida for pontual.
- Ao consultar ferramentas com saída potencialmente grande (ex.: `get_metadata` do Figma, logs extensos), salve em arquivo e consulte com `grep`/`jq` em vez de carregar tudo no contexto de uma vez — mesmo princípio já usado em `docs/agent-rules/designer.md`.
- Não cole de volta pro usuário trechos grandes de arquivo/diff que ele já pode ver — referencie por caminho e número de linha.
- Não gere documentação, comentários de código ou explicações não pedidas explicitamente.

## Convenções gerais

- Conteúdo do site é em português (com versões em `src/pt/` e `src/en/`) — mantenha esse idioma ao editar textos visíveis no site.
- O projeto é intencionalmente HTML/CSS/JS vanilla + Materialize, sem framework de front-end reativo. Não introduza um novo framework (React, Vue, Angular etc.) sem alinhar com o Johnny antes — já houve um experimento não finalizado (`app/`, removido) que confundiu esse ponto.
