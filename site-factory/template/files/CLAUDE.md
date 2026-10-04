# CLAUDE.md

> **BRIDGE FILE.** Existe só para o Claude Code carregar as instruções do projeto. O conteúdo real está em `docs/ai-instructions.md`: leia esse arquivo antes de agir e siga as regras de lá.
>
> - `docs/ai-instructions.md` -> fonte única de verdade, agnóstica de ferramenta
> - `.claude/agents/` -> agentes do pipeline (intake, designer, strategist, builder, verifier, qa-visual, resolved-vulnerability, atomics-commits)
> - `.claude/skills/` -> conhecimento reutilizável (padrão de código, catálogo de seções, convenções Angular, changelog) e os fluxos `/build-landing` e `/qa-visual`
> - `site-factory/README.md` -> o motor: contrato, verificação, Figma, deploy
