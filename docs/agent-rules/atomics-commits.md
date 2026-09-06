# Agente de Commits Atômicos

**Propósito:** Automatizar a criação de commits atômicos seguindo as convenções do projeto.

## Quando Usar

Use este agente quando:

- Houver múltiplos arquivos modificados com mudanças não relacionadas
- Precisar separar commits por tipo (docs/feat/fix/chore/ci)
- Quiser garantir mensagens de commit padronizadas
- Houver arquivos staged misturando contextos diferentes

## Workflow Automático

### 1. Análise do Status

```bash
git status --porcelain --branch
```

**Interpreta output:**

- `M` = Modified (modificado)
- `A` = Added (novo arquivo staged)
- `??` = Untracked (não rastreado)
- Agrupa por tipo de mudança e contexto

### 2. Agrupamento Inteligente

**Critérios de agrupamento (adaptados a este repositório):**

- **`docs/`**: Sempre commit separado de código (documentação do projeto, incluindo `docs/agent-rules/`).
- **`src/`**: Agrupar por feature/fix/refactor do site (HTML/CSS/JS).
- **`public/`**: Se for apenas resultado de rodar o build do Grunt a partir de mudanças em `src/`, agrupar no mesmo commit da mudança em `src/` que o gerou.
- **`.github/workflows/`**: Sempre commit separado, tipo `ci`.
- **`.github/agents/` e `.claude/agents/`**: Junto com a mudança correspondente em `docs/agent-rules/`, pois são a mesma unidade lógica (conteúdo + ponte).
- **`package.json` / `package-lock.json` / `gruntfile.js`**: Commit separado, tipo `chore` ou `build`, conforme a natureza da mudança.
- **`vercel.json` / `.vercel/`**: Commit separado, tipo `chore(deploy)`.

**Exemplo de agrupamento:**

```text
Arquivos modificados:
  M docs/ANALISE-PROJETO.md
  M src/css/style.css
  M public/css/styles.min.css
  M .github/workflows/Production.yaml
  ?? docs/agent-rules/novo-agente.md

Agrupamento proposto:
  Grupo 1 (docs): docs/ANALISE-PROJETO.md
  Grupo 2 (fix/feat): src/css/style.css + public/css/styles.min.css
  Grupo 3 (ci): .github/workflows/Production.yaml
  Grupo 4 (docs): docs/agent-rules/novo-agente.md
```

### 3. Geração de Mensagens

**Formato Conventional Commits:**

```text
<tipo>(<escopo>): <descrição curta>

<corpo opcional com detalhes>

<rodapé opcional: refs, breaking changes>
```

**Tipos mais comuns neste projeto:**

- `feat`: Nova funcionalidade ou seção do site
- `fix`: Correção de bug
- `docs`: Documentação (`docs/`, `README.md`)
- `style`: Mudanças puramente visuais/CSS sem alterar comportamento
- `refactor`: Refatoração sem mudança de comportamento
- `ci`: Mudanças em `.github/workflows/`
- `chore`: Manutenção (deps, config, `.gitignore`, `vercel.json`)
- `build`: Mudanças no pipeline de build (`gruntfile.js`, scripts do `package.json`)

**Escopos comuns:**

- `(site)`: Mudanças em `src/` que afetam o site publicado
- `(build)`: Mudanças no pipeline Grunt
- `(ci)`: Mudanças nos workflows do GitHub Actions
- `(docs)`: Documentação específica
- `(agents)`: Mudanças nas regras/pontes de agentes

### 4. Regras de Execução

**CRÍTICO - Sempre usar single quotes:**

```bash
# CORRETO
git commit -m 'feat(site): adiciona nova seção de projetos ao CV'

# ERRADO (pode falhar com ! ou outros caracteres especiais)
git commit -m "feat(site): adiciona nova seção de projetos ao CV"
```

**Ordem de commits:**

1. **docs** primeiro (contexto para próximos commits)
2. **feat/fix/refactor/style** segundo (código do site)
3. **build/ci** terceiro (pipeline e automação)
4. **chore** último (config, `.gitignore`, dependências)

### 5. Validação Pós-Commit

**Sempre executar após commits:**

```bash
# Verificar commits criados
git log -N --oneline  # N = número de commits criados

# Confirmar working tree limpo
git status
```

## Exemplos de Uso

### Exemplo 1: Documentação + Regra de Agente

**Arquivos:**

```text
M docs/ANALISE-PROJETO.md
?? docs/agent-rules/novo-agente.md
?? .github/agents/novo-agente.md
?? .claude/agents/novo-agente.md
```

**Commits criados:**

```bash
# Commit 1: Atualização da análise do projeto
git add docs/ANALISE-PROJETO.md
git commit -m 'docs: atualiza log de evolução do projeto'

# Commit 2: Novo agente (conteúdo + pontes, mesma unidade lógica)
git add docs/agent-rules/novo-agente.md .github/agents/novo-agente.md .claude/agents/novo-agente.md
git commit -m 'docs(agents): adiciona regra de agente novo-agente

Conteúdo agnóstico em docs/agent-rules/, com pontes para
Copilot (.github/agents/) e Claude Code (.claude/agents/).'
```

### Exemplo 2: Mudança de CSS + Rebuild

**Arquivos:**

```text
M src/css/style.css
M public/css/styles.min.css
```

**Commits criados:**

```bash
git add src/css/style.css public/css/styles.min.css
git commit -m 'style(site): ajusta espaçamento da seção de contato'
```

### Exemplo 3: Ajuste de Workflow de CI

**Arquivos:**

```text
M .github/workflows/Production.yaml
```

**Commits criados:**

```bash
git add .github/workflows/Production.yaml
git commit -m 'ci: adiciona timeout ao job de deploy de produção'
```

## Casos Especiais

### `.gitignore` Updates

**Se modificar `.gitignore`:**

```bash
# Commit separado, sempre tipo 'chore'
git add .gitignore
git commit -m 'chore: atualiza .gitignore para ignorar [contexto]'
```

### `package.json` — Overrides de Segurança

**Ver também:** `docs/agent-rules/resolved-vulnerability.md`

```bash
git add package.json package-lock.json
git commit -m 'chore(deps): adiciona overrides para corrigir vulnerabilidades npm'
```

## Checklist de Validação

Antes de confirmar commits:

- [ ] Mensagens seguem Conventional Commits?
- [ ] Usou single quotes nas mensagens?
- [ ] Commits são atômicos (uma mudança lógica cada)?
- [ ] Ordem de commits é lógica (docs → código → build/ci → chore)?
- [ ] Working tree ficou limpo após commits?
- [ ] `git log` confirma commits criados?

## Troubleshooting

**Erro: "event not found"**

```bash
# PROBLEMA: usou double quotes com caracteres especiais (ex: !)
git commit -m "fix: corrige bug crítico!"
# zsh: event not found: corrige bug crítico!

# SOLUÇÃO: usar single quotes
git commit -m 'fix: corrige bug crítico!'
```

**Erro: "nothing to commit"**

```bash
# PROBLEMA: esqueceu git add
git commit -m 'feat: something'
# nothing added to commit

# SOLUÇÃO: stage files primeiro
git add <file>
git commit -m 'feat: something'
```

**Commits muito grandes**

```bash
# PROBLEMA: muitos arquivos não relacionados em 1 commit
git add .
git commit -m 'mudanças'

# SOLUÇÃO: separar por contexto
# Use este agente para agrupar corretamente!
```

## Configuração do Agente

**Este agente utiliza:**

- Git commands (status, add, commit, log)
- Análise de file paths para agrupamento
- Padrões de Conventional Commits
- Regras específicas do projeto (`.github/copilot-instructions.md`, `docs/agent-rules/`)

**Não executa:**

- `git push` (sempre manual)
- `git rebase` (sempre manual)
- Mudanças em arquivos (apenas commits)

---

**Última atualização:** 06/09/2026
**Versão:** 1.1
**Mantido por:** @JohnnySouto
