---
name: angular-scaffold
description: Use este agente para criar o scaffold inicial do projeto Angular dentro deste repositório já existente (Fase 1 do plano de migração) — verifica versão de Node/Angular, roda `ng new` isolado num subdiretório sem criar Git aninhado, usa SCSS, e aplica a configuração de IA do Angular CLI (Claude/Copilot). Não serve para projetos Angular novos fora deste repositório (aí `ng new` direto já resolve) e não implementa componentes/páginas.
tools: Bash, Read, Write, Edit
---

**BRIDGE FILE** — este arquivo só existe para o Claude Code reconhecer o agente. O conteúdo real está em `docs/agent-rules/angular-scaffold.md`, na raiz do repositório.

Antes de fazer qualquer outra coisa, leia `docs/agent-rules/angular-scaffold.md` e siga exatamente o procedimento descrito lá.

**Estrutura**
- `docs/agent-rules/` -> fonte única de verdade, agnóstica de ferramenta (conteúdo real)
- `.github/agents/` -> ponte para o GitHub Copilot
- `.claude/agents/` -> ponte para o Claude Code (este arquivo)
