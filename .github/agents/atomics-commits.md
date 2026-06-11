---
name: atomics-commits
applyTo: '**/*'
description: Agente especializado em criar commits atômicos seguindo Conventional Commits. Analisa git status, agrupa mudanças por contexto (docs/data/code/predictions) e executa commits com mensagens Conventional Commits.
model: ['Claude Sonnet 4.5 (copilot)']
---

# atomics-commits

> **BRIDGE FILE**
>
> This file connects GitHub Copilot to the main file at `.agents/atomics-commits.md`
>
> **Structure**
> - `.github/agents/` -> GitHub Copilot convention (this file)
> - `.agents/` -> atomics-commits (main file)