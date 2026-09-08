---
name: "designer"
description: "Agente especializado em extrair specs de design (cores, tipografia, espaçamento, sombras, estrutura de seções, breakpoints) de um arquivo Figma via MCP e manter docs/design-system.md atualizado, com merge incremental preservando notas e pendências."
model: ['Claude Sonnet 5 (copilot)', 'GPT-5.3-Codex (copilot)', 'Claude Sonnet 5']
---

# designer

> **BRIDGE FILE**
>
> Este arquivo só existe para o GitHub Copilot reconhecer o agente. O conteúdo real está em `docs/agent-rules/designer.md` — leia esse arquivo antes de agir e siga o procedimento descrito nele.
>
> **Estrutura**
> - `docs/agent-rules/` -> fonte única de verdade, agnóstica de ferramenta (conteúdo real)
> - `.github/agents/` -> ponte para o GitHub Copilot (este arquivo)
> - `.claude/agents/` -> ponte para o Claude Code
