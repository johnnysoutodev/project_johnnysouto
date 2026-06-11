# Scripts do Agente Figma

Este diretório contém scripts auxiliares para o agente `@figma`.

## 📁 Estrutura

```
.agents/scripts/figma/
├── extract-figma-tokens.ps1  # Extrai design tokens (Windows/PowerShell)
├── extract-figma-tokens.sh   # Extrai design tokens (macOS/Linux/Bash)
└── README.md                 # Este arquivo
```

## 🚀 Scripts Disponíveis

### `extract-figma-tokens.ps1` (Windows/PowerShell)

**Propósito:** Extrai design tokens (cores e tipografia) de um arquivo do Figma sem armazenar JSONs grandes no repositório.

**Como usar:**

```powershell
.\.agents\scripts\figma\extract-figma-tokens.ps1
```

### `extract-figma-tokens.sh` (macOS/Linux/Bash)

**Propósito:** Mesma funcionalidade da versão PowerShell, mas para ambientes Unix.

**Como usar:**

```bash
# Dar permissão de execução (primeira vez)
chmod +x .agents/scripts/figma/extract-figma-tokens.sh

# Executar
./.agents/scripts/figma/extract-figma-tokens.sh
```

**Pré-requisitos:**
- Arquivo `.env` na raiz do projeto com `FIGMA_PERSONAL_ACCESS_TOKEN`
- `jq` instalado:
  - **Ubuntu/Debian:** `sudo apt-get install jq`
  - **macOS:** `brew install jq`
- `curl` (geralmente já instalado)

---

### Saída (ambas as versões)
- `data/figma/design-tokens.md` - Tokens formatados (gitignored)
- Cores únicas extraídas com contagem de uso
- Estilos tipográficos com família, tamanho e peso

**Exemplo de output:**

```
=== EXTRAINDO DESIGN TOKENS DO FIGMA ===
File: Alw5zeOfSsHbyCxYScdmq9

Cores extraidas: 36
Estilos tipograficos: 18

Arquivo gerado: data\figma\design-tokens.md
```

## 🔧 Adicionar Novos Scripts

1. Crie o arquivo `.ps1` neste diretório
2. Adicione comentários explicativos no topo
3. Documente no README.md
4. Referencie no `.agents/figma.md` se necessário

## 📝 Convenções

- Scripts em PowerShell (`.ps1`)
- Nomes descritivos em kebab-case
- Sempre ler credenciais do `.env`
- Outputs devem ir para raiz ou serem temporários
- Adicionar arquivos gerados ao `.gitignore`
