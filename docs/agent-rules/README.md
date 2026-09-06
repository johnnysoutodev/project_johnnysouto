# Padrão de organização das regras de agentes

Este projeto usa mais de uma ferramenta de IA (GitHub Copilot e Claude Code), e cada uma tem seu próprio formato de arquivo para reconhecer um "agente" — com frontmatter e localização de pasta diferentes. Para não manter o mesmo texto duplicado em dois lugares e desatualizado, este projeto separa **conteúdo** de **acionamento**.

## Como funciona

1. **Fonte única de verdade — esta pasta (`docs/agent-rules/`).**
   Cada agente tem um arquivo `.md` aqui com o procedimento completo, escrito em texto puro, **sem frontmatter** e sem nada específico de uma ferramenta. Isso é o que deve ser lido e mantido atualizado.

2. **Arquivos-ponte ("bridge files") — um por ferramenta.**
   Cada ferramenta tem um arquivo pequeno, no local que ela espera, contendo só o frontmatter que aquela ferramenta exige para reconhecer o agente, e um corpo curto instruindo a ferramenta a ler o arquivo real antes de agir:
   - **GitHub Copilot:** `.github/agents/<nome-do-agente>.md`
   - **Claude Code:** `.claude/agents/<nome-do-agente>.md`

```
docs/agent-rules/<nome>.md   ← conteúdo real, agnóstico, sem frontmatter (editar aqui)
.github/agents/<nome>.md     ← ponte para o Copilot (frontmatter Copilot + aponta pro conteúdo real)
.claude/agents/<nome>.md     ← ponte para o Claude Code (frontmatter Claude + aponta pro conteúdo real)
```

## Como adicionar um novo agente

1. Escreva o procedimento completo em `docs/agent-rules/<nome-do-agente>.md` (sem frontmatter).
2. Crie `.github/agents/<nome-do-agente>.md` com o frontmatter que o Copilot espera (`name`, `description`, opcionalmente `applyTo` e `model`) e um corpo curto apontando para o arquivo do passo 1.
3. Crie `.claude/agents/<nome-do-agente>.md` com o frontmatter que o Claude Code espera (`name`, `description`, opcionalmente `tools`) e um corpo curto apontando para o arquivo do passo 1.
4. Liste o novo agente em `.github/copilot-instructions.md`.

## Como atualizar um agente existente

Edite **apenas** o arquivo em `docs/agent-rules/`. Os arquivos-ponte não devem mudar, a menos que o gatilho de invocação (nome, descrição, ferramentas permitidas) precise mudar.

## Agentes existentes

| Agente | Conteúdo | Ponte Copilot | Ponte Claude |
|---|---|---|---|
| `resolved-vulnerability` | [`resolved-vulnerability.md`](./resolved-vulnerability.md) | `.github/agents/resolved-vulnerability.md` | `.claude/agents/resolved-vulnerability.md` |
| `atomics-commits` | [`atomics-commits.md`](./atomics-commits.md) | `.github/agents/atomics-commits.md` | `.claude/agents/atomics-commits.md` |
| `designer` | [`designer.md`](./designer.md) | `.github/agents/designer.md` | `.claude/agents/designer.md` |
| `angular-scaffold` | [`angular-scaffold.md`](./angular-scaffold.md) | `.github/agents/angular-scaffold.md` | `.claude/agents/angular-scaffold.md` |
