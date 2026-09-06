# Copilot Instructions

## Agentes Personalizados

Este projeto possui agentes personalizados para auxiliar em tarefas específicas. O conteúdo de cada agente é agnóstico de ferramenta e vive em `docs/agent-rules/` — veja `docs/agent-rules/README.md` para o padrão completo (conteúdo único + arquivos-ponte por ferramenta).

### Resolved Vulnerability Agent
- **Conteúdo:** `docs/agent-rules/resolved-vulnerability.md`
- **Ponte Copilot:** `.github/agents/resolved-vulnerability.md`
- **Propósito:** Resolver vulnerabilidades de segurança em dependências npm usando overrides
- **Uso:** Quando houver vulnerabilidades reportadas pelo `npm audit` ou antes de grandes atualizações
- **Invocação:** `@resolved-vulnerability` ou mencione "vulnerabilidades npm", "npm audit", "segurança de dependências"

### Atomics Commits Agent
- **Conteúdo:** `docs/agent-rules/atomics-commits.md`
- **Ponte Copilot:** `.github/agents/atomics-commits.md`
- **Propósito:** Agrupar mudanças e gerar commits atômicos seguindo Conventional Commits
- **Uso:** Quando houver múltiplos arquivos modificados com mudanças não relacionadas
- **Invocação:** `@atomics-commits` ou mencione "commits atômicos", "conventional commits"
