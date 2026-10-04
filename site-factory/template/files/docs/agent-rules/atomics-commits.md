# Agente de Commits Atômicos

**Propósito:** criar commits atômicos (uma mudança lógica por commit) com mensagens no padrão Conventional Commits.

## Quando usar

- Há vários arquivos modificados com mudanças não relacionadas.
- É preciso separar por tipo (docs, feat, fix, chore, ci) ou por contexto (motor, cliente, projeto Angular).
- Há arquivos staged misturando contextos.

## Regra de ouro

**O agente só faz commit quando o dono do repositório pede, naquele turno.** Nunca `git push`, nunca `git rebase`, nunca altera arquivo (só cria commits). Agentes de outras etapas (builder, designer, qa-visual...) deixam as mudanças no working tree; quem comita é este fluxo, a pedido.

## Workflow

### 1. Análise do status

```bash
git status --porcelain --branch
```

`M` modificado, `A` novo staged, `??` não rastreado. Agrupe por contexto antes de comitar.

### 2. Agrupamento

Critérios para a estrutura deste template:

- **`docs/`**: commit separado de código. `docs/agent-rules/` anda junto com o agente ou a skill correspondente em `.claude/` e `.github/agents/` (mesma unidade lógica: conteúdo + ponte).
- **`.claude/agents/` e `.claude/skills/`**: um commit por agente ou skill alterado, junto da regra que ele passou a seguir quando forem a mesma mudança.
- **`site-factory/`** (motor: `spec/`, `verifier/`, `figma/`, `deploy-templates/`, `templates/`, `status.mjs`): agrupe por componente do motor (ex.: tudo de `verifier/` em um commit). Ferramenta e a documentação dela (`README` da pasta) vão juntas.
- **`site-factory/clients/<cliente>/`**: commit separado por cliente (brief, spec, documento de design, relatórios de texto como `qa-report.md` e `build-log.md`).
- **Projeto Angular do cliente** (a pasta de `build.projectDir`): agrupe por feature, fix ou refactor; arquivos gerados pelo build não entram.
- **`.github/workflows/`**: sempre separado, tipo `ci`.
- **`package.json` / `package-lock.json`**: separado, `chore(deps)` ou `build`. Mudança de dependência de vulnerabilidade: `fix(deps)`.
- **`CHANGELOG.md`**: no commit da mudança que ele descreve, ou em `docs(changelog)` ao fim da série.

### 3. Mensagens

```text
<tipo>(<escopo>): <descrição curta>

<corpo opcional>

<rodapé opcional: refs, breaking changes>
```

Tipos: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `ci`, `chore`, `build`. Escopos comuns: `(site-factory)`, `(verifier)`, `(agents)`, `(skills)`, `(ci)`, `(docs)`, `(deps)`, ou o id do cliente.

### 4. Execução

**Sempre aspas simples** na mensagem (aspas duplas quebram com `!` e outros caracteres no zsh):

```bash
git commit -m 'feat(verifier): adiciona check de interação'   # certo
git commit -m "feat(verifier): adiciona check de interação!"  # errado
```

Ordem: **docs** primeiro, depois **feat/fix/refactor**, depois **build/ci**, por último **chore**.

### 5. Validação

```bash
git log -N --oneline   # N = commits criados
git status             # working tree limpo
```

### 6. Informar o comando de push (sem executar)

Depois dos commits, informe o comando exato, verificando antes se a branch tem upstream:

```bash
git rev-parse --abbrev-ref --symbolic-full-name @{u} 2>/dev/null
```

- **Sem saída:** a branch nunca foi enviada. Informe `git push -u origin <branch-atual>` (`git branch --show-current`).
- **Com saída:** `git push` simples basta.

## Exemplo

```text
M docs/ai-instructions.md
?? .claude/agents/<agente>.md
?? docs/agent-rules/<agente>.md
```

```bash
git add docs/ai-instructions.md
git commit -m 'docs: atualiza as regras gerais para IAs'

git add .claude/agents/<agente>.md docs/agent-rules/<agente>.md
git commit -m 'feat(agents): adiciona o agente <agente>'
```

## Checklist

- [ ] O dono pediu o commit neste turno?
- [ ] Mensagens em Conventional Commits, com aspas simples?
- [ ] Cada commit é uma mudança lógica?
- [ ] Ordem docs, código, build/ci, chore?
- [ ] `git log` e `git status` conferidos?
- [ ] Comando de push informado, não executado?

## Não executa

`git push`, `git rebase`, `git reset --hard`, `--force`, alteração de arquivo. Se algo parecer exigir isso, pare e devolva ao dono.
