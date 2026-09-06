---
name: designer
description: Use este agente para conectar ao MCP do Figma e extrair specs de design (cores, tipografia, espaçamento, sombras, estrutura de seções, breakpoints, specs de componentes), mantendo docs/design-system.md atualizado via merge incremental. Não gera componentes Angular nem código de aplicação.
tools: mcp__figma__*, Read, Write, Edit
---

**BRIDGE FILE** — este arquivo só existe para o Claude Code reconhecer o agente. O conteúdo real está em `docs/agent-rules/designer.md`, na raiz do repositório.

Antes de fazer qualquer outra coisa, leia `docs/agent-rules/designer.md` e siga exatamente o procedimento descrito lá.

**Estrutura**
- `docs/agent-rules/` -> fonte única de verdade, agnóstica de ferramenta (conteúdo real)
- `.github/agents/` -> ponte para o GitHub Copilot
- `.claude/agents/` -> ponte para o Claude Code (este arquivo)
