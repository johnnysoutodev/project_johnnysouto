# Extract Figma Design Tokens
# Este script extrai apenas dados relevantes do Figma (cores, tipografia, espaçamentos)

$ErrorActionPreference = "Stop"

# Ler token do .env
$token = (Get-Content .env | Select-String 'FIGMA_PERSONAL_ACCESS_TOKEN').ToString().Split('=')[1]
$fileKey = 'Alw5zeOfSsHbyCxYScdmq9'

Write-Host "`n=== EXTRAINDO DESIGN TOKENS DO FIGMA ===" -ForegroundColor Cyan
Write-Host "File: $fileKey`n" -ForegroundColor Gray

# Buscar dados do arquivo
$response = Invoke-RestMethod -Uri "https://api.figma.com/v1/files/$fileKey" -Headers @{'X-Figma-Token'=$token}

# Estrutura para armazenar tokens
$colors = @{}
$typography = @{}

# Função recursiva para extrair dados
function Extract-Data {
    param($node)
    
    # Extrair cores de fills
    if ($node.fills) {
        foreach ($fill in $node.fills) {
            if ($fill.type -eq 'SOLID' -and $fill.color -and $fill.visible -ne $false) {
                $r = [math]::Round($fill.color.r * 255)
                $g = [math]::Round($fill.color.g * 255)
                $b = [math]::Round($fill.color.b * 255)
                
                # Validar valores
                if ($null -ne $r -and $null -ne $g -and $null -ne $b) {
                    $r = [int]$r
                    $g = [int]$g
                    $b = [int]$b
                    $hex = ([string]::Format("{0:X2}{1:X2}{2:X2}", $r, $g, $b))
                    
                    if (-not $colors.ContainsKey($hex)) {
                        $colors[$hex] = @{
                            count = 0
                            rgb = @($r, $g, $b)
                            elements = @()
                        }
                    }
                    $colors[$hex].count++
                    if ($colors[$hex].elements.Count -lt 3) {
                        $colors[$hex].elements += $node.name
                    }
                }
            }
        }
    }
    
    # Extrair cores de background
    if ($node.backgroundColor) {
        $r = [math]::Round($node.backgroundColor.r * 255)
        $g = [math]::Round($node.backgroundColor.g * 255)
        $b = [math]::Round($node.backgroundColor.b * 255)
        
        # Validar valores
        if ($null -ne $r -and $null -ne $g -and $null -ne $b) {
            $r = [int]$r
            $g = [int]$g
            $b = [int]$b
            $hex = ([string]::Format("{0:X2}{1:X2}{2:X2}", $r, $g, $b))
            
            if (-not $colors.ContainsKey($hex)) {
                $colors[$hex] = @{
                    count = 0
                    rgb = @($r, $g, $b)
                    elements = @()
                }
            }
            $colors[$hex].count++
            if ($colors[$hex].elements.Count -lt 3) {
                $colors[$hex].elements += "$($node.name) (bg)"
            }
        }
    }
    
    # Extrair tipografia
    if ($node.style -and $node.style.fontSize) {
        $size = $node.style.fontSize
        $family = $node.style.fontFamily
        $weight = $node.style.fontWeight
        $key = "$family-$size-$weight"
        
        if (-not $typography.ContainsKey($key)) {
            $typography[$key] = @{
                fontSize = $size
                fontFamily = $family
                fontWeight = $weight
                count = 0
            }
        }
        $typography[$key].count++
    }
    
    # Recursão nos filhos
    if ($node.children) {
        foreach ($child in $node.children) {
            Extract-Data -node $child
        }
    }
}

# Extrair dados
Extract-Data -node $response.document

# Gerar arquivo de tokens
$output = @"
# Design Tokens - Figma

> **Fonte:** Personal Portfolio Website Template  
> **Gerado:** $(Get-Date -Format 'dd/MM/yyyy HH:mm:ss')  
> **File ID:** $fileKey

---

## Cores ($($colors.Count) cores unicas)

"@

# Top 20 cores mais usadas
$sortedColors = $colors.GetEnumerator() | Sort-Object { $_.Value.count } -Descending | Select-Object -First 20

foreach ($color in $sortedColors) {
    $hex = $color.Key
    $rgb = $color.Value.rgb
    $count = $color.Value.count
    $examples = $color.Value.elements -join ', '
    
    $output += @"

### #$hex
- **RGB:** rgb($($rgb[0]), $($rgb[1]), $($rgb[2]))
- **Uso:** $count elementos
- **Exemplos:** $examples

"@
}

$output += @"

---

## Tipografia ($($typography.Count) estilos)

"@

# Tipografia ordenada por tamanho
$sortedTypo = $typography.GetEnumerator() | Sort-Object { $_.Value.fontSize } -Descending

foreach ($typo in $sortedTypo) {
    $data = $typo.Value
    $output += @"

### $($data.fontFamily) - $($data.fontSize)px
- **Peso:** $($data.fontWeight)
- **Uso:** $($data.count) elementos

"@
}

# Garantir que o diretório existe
$outputDir = "data\figma"
if (-not (Test-Path $outputDir)) {
    New-Item -ItemType Directory -Path $outputDir -Force | Out-Null
}

# Salvar arquivo com UTF-8 sem BOM (corrige problemas de encoding)
$outputPath = "$outputDir\design-tokens.md"
$utf8NoBom = New-Object System.Text.UTF8Encoding $false
[System.IO.File]::WriteAllText($outputPath, $output, $utf8NoBom)

Write-Host "Cores extraidas: $($colors.Count)" -ForegroundColor Green
Write-Host "Estilos tipograficos: $($typography.Count)" -ForegroundColor Green
Write-Host "`nArquivo gerado: $outputPath" -ForegroundColor Yellow
Write-Host "`nProximos passos:" -ForegroundColor Cyan
Write-Host "  1. Revisar design-tokens.md" -ForegroundColor Gray
Write-Host "  2. Adicionar ao .gitignore" -ForegroundColor Gray
Write-Host "  3. Converter em SCSS" -ForegroundColor Gray
