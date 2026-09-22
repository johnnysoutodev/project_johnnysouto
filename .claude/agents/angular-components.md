---
name: angular-components
description: Use este agente para gerar componentes Angular standalone (Header, Hero, About, Skills, Experience, Work, Testimonials, Contact me, Footer e subcomponentes) a partir do que já está documentado em docs/design-system.md (estrutura de seções/layout do Figma, tokens de cor/tipografia/sombra, assets) e docs/PLANO-MIGRACAO-ANGULAR.md. Assume que o projeto Angular já existe (agente angular-scaffold) e que o design já foi extraído (agente designer) — não faz nenhum dos dois, só consome.
tools: Bash, Read, Write, Edit
---

**BRIDGE FILE** — este arquivo só existe para o Claude Code reconhecer o agente. O conteúdo real está em `docs/agent-rules/angular-components.md`, na raiz do repositório.

Antes de fazer qualquer outra coisa, leia `docs/agent-rules/angular-components.md` e siga exatamente o procedimento descrito lá.

**Estrutura**
- `docs/agent-rules/` -> fonte única de verdade, agnóstica de ferramenta (conteúdo real)
- `.github/agents/` -> ponte para o GitHub Copilot
- `.claude/agents/` -> ponte para o Claude Code (este arquivo)
