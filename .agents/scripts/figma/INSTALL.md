# Guia de Instalação - Extração de Design Tokens Figma

Este guia explica como configurar o ambiente para extrair design tokens do Figma em diferentes sistemas operacionais.

---

## 🪟 Windows (PowerShell)

### Pré-requisitos
- ✅ PowerShell 5.1+ (já vem com Windows 10/11)
- ✅ Arquivo `.env` na raiz do projeto

### Configuração

1. **Criar arquivo `.env`** (se não existir):
   ```powershell
   Copy-Item .env.template .env
   ```

2. **Adicionar token do Figma** no arquivo `.env`:
   ```
   FIGMA_PERSONAL_ACCESS_TOKEN=seu_token_aqui
   ```

3. **Executar script**:
   ```powershell
   .\.agents\scripts\figma\extract-figma-tokens.ps1
   ```

---

## 🍎 macOS

### Pré-requisitos
- ✅ Bash (já vem instalado)
- ❌ `jq` (precisa instalar)

### Instalação do jq

**Usando Homebrew (recomendado):**
```bash
brew install jq
```

**Verificar instalação:**
```bash
jq --version
# Deve retornar: jq-1.6 (ou superior)
```

### Configuração

1. **Criar arquivo `.env`** (se não existir):
   ```bash
   cp .env.template .env
   ```

2. **Adicionar token do Figma** no arquivo `.env`:
   ```
   FIGMA_PERSONAL_ACCESS_TOKEN=seu_token_aqui
   ```

3. **Dar permissão de execução** (primeira vez):
   ```bash
   chmod +x .agents/scripts/figma/extract-figma-tokens.sh
   ```

4. **Executar script**:
   ```bash
   ./.agents/scripts/figma/extract-figma-tokens.sh
   ```

---

## 🐧 Ubuntu/Debian Linux

### Pré-requisitos
- ✅ Bash (já vem instalado)
- ❌ `jq` (precisa instalar)

### Instalação do jq

```bash
sudo apt-get update
sudo apt-get install jq
```

**Verificar instalação:**
```bash
jq --version
# Deve retornar: jq-1.6 (ou superior)
```

### Configuração

1. **Criar arquivo `.env`** (se não existir):
   ```bash
   cp .env.template .env
   ```

2. **Adicionar token do Figma** no arquivo `.env`:
   ```
   FIGMA_PERSONAL_ACCESS_TOKEN=seu_token_aqui
   ```

3. **Dar permissão de execução** (primeira vez):
   ```bash
   chmod +x .agents/scripts/figma/extract-figma-tokens.sh
   ```

4. **Executar script**:
   ```bash
   ./.agents/scripts/figma/extract-figma-tokens.sh
   ```

---

## 🔑 Como Obter o Token do Figma

1. Acesse: https://www.figma.com/settings
2. Role até **Personal access tokens**
3. Clique em **Generate new token**
4. Dê um nome (ex: "johnnysouto-dev")
5. Copie o token gerado
6. Cole no arquivo `.env`

⚠️ **IMPORTANTE:** Nunca commit o arquivo `.env` no git!

---

## ✅ Verificar se Funcionou

Após executar o script, você deve ver:

```
=== EXTRAINDO DESIGN TOKENS DO FIGMA ===
File: Alw5zeOfSsHbyCxYScdmq9

Cores extraidas: 36
Estilos tipograficos: 18

Arquivo gerado: data/figma/design-tokens.md

Proximos passos:
  1. Revisar design-tokens.md
  2. Adicionar ao .gitignore
  3. Converter em SCSS
```

O arquivo `data/figma/design-tokens.md` deve ter sido criado com ~3.6 KB.

---

## 🆘 Problemas Comuns

### ❌ "jq: command not found" (macOS/Linux)

**Solução:** Instale o `jq`:
- macOS: `brew install jq`
- Ubuntu: `sudo apt-get install jq`

### ❌ "Permission denied" (macOS/Linux)

**Solução:** Dê permissão de execução:
```bash
chmod +x .agents/scripts/figma/extract-figma-tokens.sh
```

### ❌ "Erro: arquivo .env não encontrado"

**Solução:** Crie o arquivo `.env` na raiz do projeto:
```bash
# macOS/Linux
cp .env.template .env

# Windows
Copy-Item .env.template .env
```

### ❌ "401 Unauthorized" ou erro de autenticação

**Solução:** Verifique se o token no `.env` está correto e válido.

---

## 📚 Próximos Passos

Após extrair os tokens:

1. **Revisar** → `data/figma/design-tokens.md`
2. **Converter** → Criar variáveis SCSS em `src/styles/_variables.scss`
3. **Implementar** → Usar tokens nos componentes Angular
