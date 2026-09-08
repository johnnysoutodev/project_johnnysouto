---
name: "atomics-commits"
description: "Agente especializado em criar commits atômicos seguindo Conventional Commits. Analisa git status, agrupa mudanças por contexto (docs/site/build/ci/chore) e executa commits com mensagens Conventional Commits."
model: ['Claude Sonnet 5 (copilot)', 'GPT-5.3-Codex (copilot)', 'Claude Sonnet 5']
---

# atomics-commits

> **BRIDGE FILE**
>
> Este arquivo só existe para o GitHub Copilot reconhecer o agente. O conteúdo real está em `docs/agent-rules/atomics-commits.md` — leia esse arquivo antes de agir e siga o procedimento descrito nele.
>
> **Estrutura**
> - `docs/agent-rules/` -> fonte única de verdade, agnóstica de ferramenta (conteúdo real)
> - `.github/agents/` -> ponte para o GitHub Copilot (este arquivo)
> - `.claude/agents/` -> ponte para o Claude Code
