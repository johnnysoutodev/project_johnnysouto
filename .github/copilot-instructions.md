# Copilot Instructions

## Agentes Personalizados

Este projeto possui agentes personalizados para auxiliar em tarefas específicas:

### Figma Agent
- **Arquivo:** `.agents/figma.md`
- **Propósito:** Analisar designs do Figma (imagens PNG ou via MCP) e converter em componentes Angular + tokens SCSS
- **Uso:** Quando houver imagens PNG do Figma anexadas, links do Figma, ou tarefas de design-to-code
- **Invocação:** `@figma` ou mencione "design", "figma", "layout", "componente angular", "ui"

### Resolved Vulnerability Agent
- **Arquivo:** `.agents/resolved-vulnerability.md`
- **Propósito:** Resolver vulnerabilidades de segurança em dependências npm usando overrides
- **Uso:** Quando houver vulnerabilidades reportadas pelo `npm audit` ou antes de grandes atualizações
- **Invocação:** `@resolved-vulnerability` ou mencione "vulnerabilidades npm", "npm audit", "segurança de dependências"
