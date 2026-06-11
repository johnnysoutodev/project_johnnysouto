---
name: atomics-commits
applyTo: '**/*'
description: Agente especializado em criar commits atômicos seguindo Conventional Commits. Analisa git status, agrupa mudanças por contexto (docs/data/code/predictions) e executa commits com mensagens Conventional Commits.
model: ['Claude Sonnet 4.5 (copilot)']
---

# 🔄 Agente de Commits Atômicos

**Propósito:** Automatizar a criação de commits atômicos seguindo as convenções do projeto.

## Quando Usar

Use este agente quando:

- ✅ Houver múltiplos arquivos modificados com mudanças não relacionadas
- ✅ Precisar separar commits por tipo (docs/feat/fix/test/chore)
- ✅ Quiser garantir mensagens de commit padronizadas
- ✅ Houver arquivos staged misturando contextos diferentes

## Workflow Automático

### 1. Análise do Status

```bash
git status --porcelain --branch
```

**⚠️ VERIFICAÇÃO PRIORITÁRIA:**

**Antes de qualquer agrupamento, verificar se `.gitignore` está na lista:**

```bash
git status --short | grep -E '^\s*[MA]\s+\.gitignore'
```

Se `.gitignore` estiver modificado/adicionado:
1. ✅ Fazer commit do `.gitignore` IMEDIATAMENTE
2. ✅ Só depois processar outros arquivos
3. ✅ Motivo: Proteger repositório remoto de arquivos indesejados

**Interpreta output:**

- `M` = Modified (modificado)
- `A` = Added (novo arquivo staged)
- `??` = Untracked (não rastreado)
- Agrupa por tipo de mudança e contexto

### 2. Agrupamento Inteligente

**Critérios de agrupamento:**

- **docs/**: Sempre commit separado de código
- **tests/**: Pode agrupar com código relacionado OU separar
- **data/**: Sempre commit separado (dados históricos)
- **src/**: Agrupar por feature/fix/refactor
- **config**: Commit separado se mudança significativa
- **runtime/predictions/**: Separar por lottery_type e contest_id

**Exemplo de agrupamento:**

```bash
Arquivos modificados:
  M docs/analysis.md
  M src/engines/frequency.py
  M tests/test_frequency.py
  M data/lottery/lotofacil.csv
  ?? runtime/predictions/lotofacil/3674.json

Agrupamento proposto:
  Grupo 1 (docs): docs/analysis.md
  Grupo 2 (feat): src/engines/frequency.py + tests/test_frequency.py
  Grupo 3 (data): data/lottery/lotofacil.csv
  Grupo 4 (feat): runtime/predictions/lotofacil/3674.json
```

### 3. Geração de Mensagens

**Formato Conventional Commits:**

```bash
<tipo>(<escopo>): <descrição curta>

<corpo opcional com detalhes>

<rodapé opcional: refs, breaking changes>
```

**Tipos mais comuns:**

- `feat`: Nova funcionalidade ou prediction
- `fix`: Correção de bug
- `docs`: Documentação
- `test`: Testes
- `data`: Atualização de dados históricos
- `refactor`: Refatoração
- `chore`: Manutenção (deps, config, .gitignore)
- `perf`: Performance

**Escopos comuns:**

- `(engines)`: Mudanças em engines de análise
- `(strategies)`: Mudanças em estratégias de geração
- `(predictions)`: Adição de predictions
- `(lotofacil)`, `(mega-sena)`, `(quina)`: Por loteria
- `(tests)`: Testes específicos
- `(docs)`: Documentação específica

### 4. Regras de Execução

**CRÍTICO - Sempre usar single quotes:**

```bash
# ✅ CORRETO
git commit -m 'feat(predictions): adiciona prediction concurso 3674'

# ❌ ERRADO (pode falhar com ! ou outros caracteres especiais)
git commit -m "feat(predictions): adiciona prediction concurso 3674"
```

**Ordem de commits:**

⚠️ **REGRA PRIORITÁRIA - .gitignore SEMPRE PRIMEIRO:**

**Se `.gitignore` estiver modificado ou adicionado, SEMPRE fazer commit dele ANTES de qualquer outro arquivo.**

Motivo: Evita que arquivos indesejados sejam enviados ao repositório remoto antes do .gitignore estar atualizado.

```bash
# Exemplo de priorização
git status --short
# Output:
#  M .gitignore
#  M src/app.js
#  ?? data/figma/temp.json

# ✅ CORRETO - .gitignore primeiro
git add .gitignore
git commit -m 'chore: atualiza gitignore para ignorar dados temporarios'

# Depois os outros arquivos
git add src/app.js
git commit -m 'feat: implementa nova funcionalidade'
```

**Ordem padrão para demais arquivos:**

1. **🛡️ .gitignore** (SEMPRE PRIMEIRO se presente)
2. **docs** (contexto para próximos commits)
3. **data** (histórico atualizado)
4. **feat/fix/refactor** (código)
5. **test** (validação)
6. **chore** (outras configs)

### 5. Validação Pós-Commit

**Sempre executar após commits:**

```bash
# Verificar commits criados
git log -N --oneline  # N = número de commits criados

# Confirmar working tree limpo
git status
```

## Exemplos de Uso

### Exemplo 1: Predictions + Analysis

**Arquivos:**

```bash
M docs/archive/analise_contest_3674.md
?? runtime/predictions/lotofacil/3674.json
```

**Commits criados:**

```bash
# Commit 1: Docs
git add docs/archive/analise_contest_3674.md
git commit -m 'docs: adiciona análise pré-3674 (RF baseline)'

# Commit 2: Prediction
git add runtime/predictions/lotofacil/3674.json
git commit -m 'feat(predictions): adiciona prediction lotofacil 3674

Gerado com strategy RF baseline, min_score 48.5'
```

### Exemplo 2: Engine Refactor + Tests

**Arquivos:**

```bash
M src/domain/engines/frequency_engine.py
M tests/domain/engines/test_frequency_engine.py
M docs/ENGINE_VALIDATION.md
```

**Commits criados:**

```bash
# Commit 1: Docs
git add docs/ENGINE_VALIDATION.md
git commit -m 'docs: atualiza validação FrequencyEngine'

# Commit 2: Code + Tests (relacionados, mesmo commit)
git add src/domain/engines/frequency_engine.py tests/domain/engines/test_frequency_engine.py
git commit -m 'refactor(frequency): implementa quartile categorization

Substitui absolute frequency por tier-based scoring.
Std melhorou de 0.89% para 10.95% (+1230%).

Tests: 15/15 passing, 100% coverage'
```

### Exemplo 3: Data Update + Multiple Predictions

**Arquivos:**

```bash
M data/lottery/lotofacil.csv
M data/lottery/mega_sena.csv
?? runtime/predictions/lotofacil/3674.json
?? runtime/predictions/mega_sena/3002.json
```

**Commits criados:**

```bash
# Commit 1: Data
git add data/lottery/lotofacil.csv data/lottery/mega_sena.csv
git commit -m 'data: atualiza CSVs concursos 3674 (lotofacil) e 3002 (mega-sena)

- lotofacil: concurso 3674, data 30/04/2026
- mega_sena: concurso 3002, data 30/04/2026'

# Commit 2: Predictions (mesmo contexto)
git add runtime/predictions/
git commit -m 'feat(predictions): adiciona predictions concursos 3674 e 3002

- lotofacil/3674.json: RF baseline strategy
- mega_sena/3002.json: hybrid strategy (RF+MC+GA)'
```

## Casos Especiais

### 🛡️ .gitignore Updates (PRIORITÁRIO)

**⚠️ REGRA CRÍTICA: `.gitignore` SEMPRE PRIMEIRO**

Se `.gitignore` estiver modificado/adicionado, **PARE** e commite-o ANTES de processar outros arquivos.

**Motivo:** Evitar que arquivos sensíveis ou temporários sejam enviados ao repositório remoto antes do `.gitignore` estar atualizado.

**Exemplo de workflow correto:**

```bash
# Situação: .gitignore modificado + outros arquivos
git status --short
#  M .gitignore
#  M src/app.js
#  ?? data/figma/design-tokens.md
#  ?? .env

# ✅ PASSO 1: .gitignore PRIMEIRO
git add .gitignore
git commit -m 'chore: atualiza gitignore para ignorar data/figma/ e .env'

# ✅ PASSO 2: Verificar se arquivos indesejados sumiram
git status --short
#  M src/app.js
# (data/figma/ e .env não aparecem mais - protegidos!)

# ✅ PASSO 3: Continuar com commits normais
git add src/app.js
git commit -m 'feat: implementa nova funcionalidade'
```

**Mensagem padrão:**

```bash
git commit -m 'chore: atualiza gitignore para [contexto específico]'

# Exemplos:
# 'chore: atualiza gitignore para ignorar dados temporarios do figma'
# 'chore: atualiza gitignore para proteger tokens MCP'
# 'chore: adiciona node_modules ao gitignore'
```

### Config.yaml Changes

**Se mudança pequena (weights):**

```bash
git add config.yaml
git commit -m 'chore(config): ajusta peso FrequencyEngine 0.17→0.19'
```

**Se mudança grande (deprecation):**

```bash
git add config.yaml docs/DEPRECATION.md .github/copilot-instructions.md
git commit -m 'refactor: depreca RangeEngine e transfere peso para PrimeEngine

RangeEngine redundante com StatisticalEngine.Spread.
Peso transferido: lotofacil 0.028, mega-sena 0.0087.

Files:
- config.yaml: remove range, aumenta prime
- docs: documenta deprecação
- copilot-instructions: atualiza catálogo engines'
```

### Runtime Artifacts

**Regra:** `runtime/predictions/` DEVE ser commitado (exceção no .gitignore).

**Outros runtime/** NÃO commitar:**

- `runtime/analysis/` (correlations, validations)
- `runtime/feedback/` (feedback.json)
- `runtime/weights/` (optimized weights)
- `runtime/logs/` (execution logs)

## Checklist de Validação

Antes de confirmar commits:

- [ ] Mensagens seguem Conventional Commits?
- [ ] Usou single quotes nas mensagens?
- [ ] Commits são atômicos (uma mudança lógica cada)?
- [ ] Ordem de commits é lógica (.gitignore → docs → data → code → config)?
- [ ] Working tree ficou limpo após commits?
- [ ] `git log` confirma commits criados?

---

## Exemplo Completo: Priorização do .gitignore

**Cenário real:** Integração com Figma gerando arquivos temporários

```bash
# Situação inicial
git status --short
 M .agents/figma.md
 M .gitignore
 A  data/figma/README.md
 A  .agents/scripts/figma/extract-figma-tokens.ps1
 A  .agents/scripts/figma/extract-figma-tokens.sh
?? data/figma/design-tokens.md
?? data/figma/figma-data.json
```

**⚠️ PROBLEMA DETECTADO:** `.gitignore` modificado + arquivos não rastreados que deveriam ser ignorados!

**✅ SOLUÇÃO - Workflow Correto:**

```bash
# PASSO 1: .gitignore PRIMEIRO (PRIORITÁRIO)
git add .gitignore
git commit -m 'chore(figma): configura gitignore para dados extraidos

- Ignora diretorio data/figma/ (arquivos gerados automaticamente)
- Permite versionar data/figma/README.md (documentacao)
- Protege JSONs temporarios e design-tokens.md gerados'

# PASSO 2: Verificar proteção
git status --short
#  M .agents/figma.md
#  A  data/figma/README.md
#  A  .agents/scripts/figma/extract-figma-tokens.ps1
#  A  .agents/scripts/figma/extract-figma-tokens.sh
# ✅ data/figma/design-tokens.md e figma-data.json NÃO aparecem mais!

# PASSO 3: Continuar com commits normais
git add .agents/scripts/
git commit -m 'feat(figma): adiciona scripts cross-platform de extracao de tokens

- Script PowerShell para Windows
- Script Bash para macOS/Linux
- Documentacao tecnica completa'

git add data/figma/README.md
git commit -m 'docs(figma): adiciona README para diretorio de dados

Explica estrutura e como regenerar tokens'

git add .agents/figma.md
git commit -m 'docs(figma): atualiza documentacao do agente

- Documenta scripts cross-platform
- Adiciona secao de extracao otimizada'

# RESULTADO: 4 commits atômicos, nenhum arquivo indesejado no repo!
```

**❌ ERRO COMUM - Não fazer isso:**

```bash
# ERRADO: Commitar scripts antes do .gitignore
git add .agents/scripts/
git commit -m 'feat: scripts'

# ❌ Se der push agora, data/figma/*.json pode vazar antes do .gitignore!
```

---

## Troubleshooting

**Erro "event not found":**

```bash
# ❌ PROBLEMA: usou double quotes
git commit -m "test: expand 15→33"
# zsh: event not found: 33

# ✅ SOLUÇÃO: usar single quotes
git commit -m 'test: expand 15→33'
```

**Erro "nothing to commit":**

```bash
# ❌ PROBLEMA: esqueceu git add
git commit -m 'feat: something'
# nothing added to commit

# ✅ SOLUÇÃO: stage files primeiro
git add <file>
git commit -m 'feat: something'
```

**Commits muito grandes:**

```bash
# ❌ PROBLEMA: 10+ arquivos em 1 commit
git add .
git commit -m 'mudanças'

# ✅ SOLUÇÃO: separar por contexto
# Use este agente para agrupar corretamente!
```

## Configuração do Agente

**Este agente utiliza:**

- Git commands (status, add, commit, log)
- Análise de file paths para agrupamento
- Padrões de Conventional Commits
- Regras específicas do projeto (copilot-instructions.md)

**Não executa:**

- `git push` (sempre manual)
- `git rebase` (sempre manual)
- Mudanças em arquivos (apenas commits)

---

**Última atualização:** 01/05/2026  
**Versão:** 1.0  
**Mantido por:** @JohnnySouto
