# Dados do Figma

Este diretório contém dados extraídos da API do Figma usando o script `.agents/scripts/figma/extract-figma-tokens.ps1`.

## 🚫 Este diretório está no .gitignore

Todos os arquivos aqui são **gerados automaticamente** e **não devem ser versionados** no GitHub.

## 📁 Arquivos Gerados

### `design-tokens.md`

Contém os design tokens extraídos do Figma:
- **Cores únicas** com RGB, HEX e contagem de uso
- **Estilos tipográficos** com família, tamanho e peso
- **Top 20 cores** mais utilizadas no design

**Como regenerar:**

```powershell
.\.agents\scripts\figma\extract-figma-tokens.ps1
```

### `figma-*.json`

Arquivos JSON temporários da API do Figma para debug:
- `figma-data.json` - Estrutura completa do arquivo
- `figma-node-dev.json` - Dados de nodes específicos

## 📊 Uso dos Tokens

Os tokens extraídos devem ser convertidos manualmente para:

1. **SCSS Variables** → `src/styles/_variables.scss`
2. **Typography Tokens** → `src/styles/_typography.scss`
3. **Component Styles** → Arquivos `.scss` dos componentes

## ⚠️ Importante

- **Não commitar** arquivos deste diretório
- **Regenerar tokens** sempre que o design do Figma for atualizado
- **Revisar manualmente** antes de converter para SCSS
- **Validar cores** com o time de design antes de aplicar
