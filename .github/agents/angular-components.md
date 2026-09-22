---
name: "angular-components"
description: "Agente especializado em gerar componentes Angular standalone a partir dos dados já documentados em docs/design-system.md (estrutura de seções extraída do Figma, tokens de cor/tipografia/sombra, assets) e das decisões de docs/PLANO-MIGRACAO-ANGULAR.md. Não extrai design do Figma nem cria o scaffold do projeto — só consome o que os agentes designer e angular-scaffold já produziram."
model: ['Claude Sonnet 5 (copilot)', 'GPT-5.3-Codex (copilot)', 'Claude Sonnet 5']
---

# angular-components

> **BRIDGE FILE**
>
> Este arquivo só existe para o GitHub Copilot reconhecer o agente. O conteúdo real está em `docs/agent-rules/angular-components.md` — leia esse arquivo antes de agir e siga o procedimento descrito nele.
>
> **Estrutura**
> - `docs/agent-rules/` -> fonte única de verdade, agnóstica de ferramenta (conteúdo real)
> - `.github/agents/` -> ponte para o GitHub Copilot (este arquivo)
> - `.claude/agents/` -> ponte para o Claude Code
