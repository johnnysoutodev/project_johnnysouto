#!/bin/bash

# Extract Figma Design Tokens (Bash version)
# Este script extrai apenas dados relevantes do Figma (cores, tipografia, espaçamentos)

set -e

# Ler token do .env
if [ ! -f .env ]; then
    echo "Erro: arquivo .env não encontrado na raiz do projeto"
    exit 1
fi

TOKEN=$(grep FIGMA_PERSONAL_ACCESS_TOKEN .env | cut -d '=' -f2)
FILE_KEY="Alw5zeOfSsHbyCxYScdmq9"

echo ""
echo "=== EXTRAINDO DESIGN TOKENS DO FIGMA ==="
echo "File: $FILE_KEY"
echo ""

# Verificar se jq está instalado
if ! command -v jq &> /dev/null; then
    echo "Erro: jq não está instalado"
    echo "Instale com:"
    echo "  Ubuntu/Debian: sudo apt-get install jq"
    echo "  macOS: brew install jq"
    exit 1
fi

# Buscar dados do arquivo
RESPONSE=$(curl -s -H "X-Figma-Token: $TOKEN" \
    "https://api.figma.com/v1/files/$FILE_KEY")

# Criar diretório de saída
OUTPUT_DIR="data/figma"
mkdir -p "$OUTPUT_DIR"

# Criar arquivo temporário para processar
TEMP_FILE=$(mktemp)
echo "$RESPONSE" > "$TEMP_FILE"

# Extrair cores e tipografia usando jq
declare -A colors
declare -A typography

# Função para processar nó recursivamente
process_node() {
    local node_data="$1"
    
    # Extrair fills (cores)
    echo "$node_data" | jq -r '
        .. | 
        select(type == "object" and has("fills")) | 
        .fills[]? | 
        select(.type == "SOLID" and .color != null and (.visible // true)) | 
        .color | 
        [(.r * 255 | round), (.g * 255 | round), (.b * 255 | round)] | 
        @csv
    ' | while IFS=',' read -r r g b; do
        printf "%02X%02X%02X\n" $r $g $b
    done | sort | uniq -c
    
    # Extrair backgroundColor
    echo "$node_data" | jq -r '
        .. | 
        select(type == "object" and has("backgroundColor")) | 
        .backgroundColor | 
        [(.r * 255 | round), (.g * 255 | round), (.b * 255 | round)] | 
        @csv
    ' | while IFS=',' read -r r g b; do
        printf "%02X%02X%02X\n" $r $g $b
    done | sort | uniq -c
}

# Extrair cores
COLOR_DATA=$(echo "$RESPONSE" | jq -r '
    .. | 
    select(type == "object" and (has("fills") or has("backgroundColor"))) | 
    if has("fills") then
        .fills[]? | 
        select(.type == "SOLID" and .color != null and (.visible // true)) | 
        .color | 
        [(.r * 255 | round), (.g * 255 | round), (.b * 255 | round)] | 
        @csv
    elif has("backgroundColor") then
        .backgroundColor | 
        [(.r * 255 | round), (.g * 255 | round), (.b * 255 | round)] | 
        @csv
    else
        empty
    end
' | awk -F',' '{printf "%02X%02X%02X\n", $1, $2, $3}' | sort | uniq -c | sort -rn)

# Extrair tipografia
TYPO_DATA=$(echo "$RESPONSE" | jq -r '
    .. | 
    select(type == "object" and has("style") and .style.fontSize != null) | 
    .style | 
    [.fontFamily // "Unknown", .fontSize, .fontWeight // 400] | 
    @csv
' | sort | uniq -c | sort -rn)

# Contar totais
COLOR_COUNT=$(echo "$COLOR_DATA" | wc -l | tr -d ' ')
TYPO_COUNT=$(echo "$TYPO_DATA" | wc -l | tr -d ' ')

# Gerar arquivo de tokens
OUTPUT_FILE="$OUTPUT_DIR/design-tokens.md"
cat > "$OUTPUT_FILE" << EOF
# Design Tokens - Figma

> **Fonte:** Personal Portfolio Website Template  
> **Gerado:** $(date '+%d/%m/%Y %H:%M:%S')  
> **File ID:** $FILE_KEY

---

## Cores ($COLOR_COUNT cores unicas)

EOF

# Top 20 cores mais usadas
echo "$COLOR_DATA" | head -20 | while read -r count hex; do
    # Converter hex para RGB
    r=$((16#${hex:0:2}))
    g=$((16#${hex:2:2}))
    b=$((16#${hex:4:2}))
    
    cat >> "$OUTPUT_FILE" << EOF
### #$hex
- **RGB:** rgb($r, $g, $b)
- **Uso:** $count elementos

EOF
done

cat >> "$OUTPUT_FILE" << EOF

---

## Tipografia ($TYPO_COUNT estilos)

EOF

# Tipografia ordenada
echo "$TYPO_DATA" | while IFS=',' read -r count family size weight; do
    # Remover aspas do CSV
    family=$(echo $family | tr -d '"')
    size=$(echo $size | tr -d '"')
    weight=$(echo $weight | tr -d '"')
    
    cat >> "$OUTPUT_FILE" << EOF
### $family - ${size}px
- **Peso:** $weight
- **Uso:** $count elementos

EOF
done

# Limpar arquivo temporário
rm "$TEMP_FILE"

# Resultado
echo "Cores extraidas: $COLOR_COUNT"
echo "Estilos tipograficos: $TYPO_COUNT"
echo ""
echo "Arquivo gerado: $OUTPUT_FILE"
echo ""
echo "Proximos passos:"
echo "  1. Revisar design-tokens.md"
echo "  2. Adicionar ao .gitignore"
echo "  3. Converter em SCSS"
