---
name: "angular-scaffold"
description: "Agente especializado em criar o scaffold inicial do projeto Angular dentro de um repositório já existente — verifica compatibilidade de versão Node/Angular, roda `ng new` isolado sem Git aninhado, usa SCSS, e aplica a configuração de IA do Angular CLI (Claude/Copilot), atualizando docs/PLANO-MIGRACAO-ANGULAR.md."
model: ['Claude Sonnet 5 (copilot)', 'GPT-5.3-Codex (copilot)', 'Claude Sonnet 5']
---

# angular-scaffold

> **BRIDGE FILE**
>
> Este arquivo só existe para o GitHub Copilot reconhecer o agente. O conteúdo real está em `docs/agent-rules/angular-scaffold.md` — leia esse arquivo antes de agir e siga o procedimento descrito nele.
>
> **Estrutura**
> - `docs/agent-rules/` -> fonte única de verdade, agnóstica de ferramenta (conteúdo real)
> - `.github/agents/` -> ponte para o GitHub Copilot (este arquivo)
> - `.claude/agents/` -> ponte para o Claude Code
