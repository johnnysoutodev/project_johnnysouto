# Copilot Instructions

## Agentes Personalizados

Este projeto possui agentes personalizados para auxiliar em tarefas específicas:

### Resolved Vulnerability Agent
- **Arquivo:** `.agents/resolved-vulnerability.md`
- **Propósito:** Resolver vulnerabilidades de segurança em dependências npm usando overrides
- **Uso:** Quando houver vulnerabilidades reportadas pelo `npm audit` ou antes de grandes atualizações
- **Invocação:** `@resolved-vulnerability` ou mencione "vulnerabilidades npm", "npm audit", "segurança de dependências"
