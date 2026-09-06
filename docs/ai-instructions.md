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

## Migração Angular

O plano de migração para Angular (`docs/PLANO-MIGRACAO-ANGULAR.md`) já está em andamento — decisões de arquitetura, versão e nome de diretório ficam registradas lá, não devem ser repetidas de memória. O scaffold inicial do projeto Angular **dentro deste repositório já existente** (Fase 1 do plano) é feito pelo procedimento em `docs/agent-rules/angular-scaffold.md`, não por um `ng new` avulso — ele garante versão de Node/Angular compatível, isolamento do site legado (sem repositório Git aninhado) e SCSS desde o início.

## Agentes personalizados

Procedimentos reutilizáveis e mais específicos (não regras gerais) vivem em `docs/agent-rules/`, com pontes por ferramenta em `.github/agents/` (Copilot) e `.claude/agents/` (Claude Code). Lista completa e como adicionar novos agentes: `docs/agent-rules/README.md`.

## Convenções gerais

- Conteúdo do site é em português (com versões em `src/pt/` e `src/en/`) — mantenha esse idioma ao editar textos visíveis no site.
- O projeto é intencionalmente HTML/CSS/JS vanilla + Materialize, sem framework de front-end reativo. Não introduza um novo framework (React, Vue, Angular etc.) sem alinhar com o Johnny antes — já houve um experimento não finalizado (`app/`, removido) que confundiu esse ponto.
