---
name: atomics-commits
description: Use este agente quando houver múltiplos arquivos modificados com mudanças não relacionadas e for necessário separar em commits atômicos por contexto, com mensagens no padrão Conventional Commits.
tools: Bash, Read
---

**BRIDGE FILE** — este arquivo só existe para o Claude Code reconhecer o agente. O conteúdo real está em `docs/agent-rules/atomics-commits.md`, na raiz do repositório.

Antes de fazer qualquer outra coisa, leia `docs/agent-rules/atomics-commits.md` e siga exatamente o procedimento descrito lá.

**Estrutura**
- `docs/agent-rules/` -> fonte única de verdade, agnóstica de ferramenta (conteúdo real)
- `.github/agents/` -> ponte para o GitHub Copilot
- `.claude/agents/` -> ponte para o Claude Code (este arquivo)
