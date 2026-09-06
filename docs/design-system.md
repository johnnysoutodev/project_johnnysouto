# Design System — extraído do Figma

> Specs extraídas via MCP do Figma para a migração Angular (`docs/PLANO-MIGRACAO-ANGULAR.md`, Fase 0/2). Não é fonte de verdade visual — o Figma continua sendo a referência; este documento existe para consulta rápida durante a implementação, sem precisar reconectar ao MCP a cada dúvida.

**Arquivo Figma:** `template_portfolio_website`
**Link:** <https://www.figma.com/design/9z2dzCKhlXWqVynN5SEeEM/template_portfolio_website?node-id=0-1&m=dev&t=p400RgMm8j8SjqJM-1>
**File key:** `9z2dzCKhlXWqVynN5SEeEM`
**Extraído em:** 06/09/2026

> Nota: o conteúdo textual/imagens do arquivo é um template genérico (placeholder "Sagar", projetos fictícios "Fixkit" etc.) — servirá apenas de base visual/estrutural. O conteúdo real (currículo do Johnny) deve substituir os placeholders na Fase 2/4.

## 1. Estrutura de página (única página "Home")

O arquivo tem uma única página, com frames organizados por tema (Light/Dark) e breakpoint (Desktop/Mobile), todos com a mesma estrutura de seções:

| Seção | Node ID (Desktop/Light) | Altura (desktop) | Observação |
| --- | --- | --- | --- |
| Header | `316:588` (instance) | 68px | Fixo/sticky, largura total |
| Hero | `316:194` | 552px | Nome, título, localização, disponibilidade, links sociais, foto |
| About | `316:229` | 962px | Texto "sobre mim" |
| Skills | `316:256` | 560px | Grid de ícones de tecnologias |
| Experience | `316:357` | 1140px | Timeline de experiências profissionais |
| Work | `316:415` | 1848px | Cards de projetos |
| Testimonials | `316:510` | 740px | Depoimentos |
| Contact me | `316:537` | 560px | Email/telefone/redes sociais |
| Footer | `316:579` | 68px | Copyright |

Sections ficam empilhadas sem gap entre si (cada uma já inclui seu próprio padding vertical).

### Frames/variantes disponíveis

- `328:4104` — **Light Mode** (grupo com todas as variantes light)
  - `316:177` — Home / Desktop / Light (1440×6498)
  - `327:417` — Home / Mobile (iPhone 8) / Light (375×9382)
  - `327:1337` — Home / Mobile (iPhone 8) / Light / Mobile Menu (overlay do menu mobile)
- `328:4105` — **Dark Mode** (mesma estrutura, sufixo Dark)
  - `327:1805` — Home / Desktop / Dark
  - `327:2147` — Home / Mobile (iPhone 8) / Dark
  - `327:3601` — Home / Mobile (iPhone 8) / Dark / Mobile Menu

Ou seja: o design já prevê **dark mode** e **menu mobile** dedicado — vale decidir se isso entra no escopo da migração (o plano atual não menciona dark mode explicitamente).

## 2. Layout / grid

- **Desktop:** frame de 1440px de largura; container de conteúdo com `x=80` e `width=1280` → padding lateral de **80px**, conteúdo com largura máxima de **1280px**.
- **Mobile:** frame de referência 375px (iPhone 8).
- Dentro do container, colunas usam `gap`/posições múltiplas de 8px (ex.: 32px, 96px) — consistente com uma escala de espaçamento em base 8/4.

## 3. Cores (variáveis do Figma)

### Light mode

| Token | Valor |
| --- | --- |
| Gray/Default | `#ffffff` |
| Gray/50 | `#f9fafb` |
| Gray/100 | `#f3f4f6` |
| Gray/200 | `#e5e7eb` |
| Gray/600 | `#4b5563` |
| Gray/700 | `#374151` |
| Gray/900 | `#111827` |

### Dark mode

| Token | Valor |
| --- | --- |
| Gray/Dark/Default | `#030712` |
| Gray/Dark/50 | `#111827` |
| Gray/Dark/100 | `#1f2937` |
| Gray/Dark/200 | `#374151` |
| Gray/Dark/600 | `#d1d5db` |
| Gray/Dark/700 | `#e5e7eb` |
| Gray/Dark/900 | `#f9fafb` |

> Padrão claro de dark mode: a escala é essencialmente invertida (900↔Default, 700↔600 trocam de papel), típico de paleta Tailwind Gray com tema dark por inversão de escala.

## 4. Tipografia

Família única: **Inter**.

| Token | Peso | Tamanho | Line-height | Letter-spacing |
| --- | --- | --- | --- | --- |
| Heading/H1/Bold | 700 (Bold) | 60px | 72px | -2 |
| Heading/H2/Semi Bold | 600 (Semi Bold) | 36px | 40px | -2 |
| Heading/H3/Semi Bold | 600 (Semi Bold) | 30px | 36px | -2 |
| Subtitle/Semi Bold | 600 (Semi Bold) | 20px | 28px | 0 |
| Subtitle/Normal | 400 (Regular) | 20px | 28px | 0 |
| Body1/Normal | 400 (Regular) | 18px | 28px | 0 |
| Body2/Medium | 500 (Medium) | 16px | 24px | 0 |
| Body2/Normal | 400 (Regular) | 16px | 24px | 0 |
| Body3/Medium | 500 (Medium) | 14px | 20px | 0 |
| Body3/Normal | 400 (Regular) | 14px | 20px | 0 |

Todos os valores acima são idênticos entre Light e Dark (só a cor de texto muda, via tokens de cinza da seção 3).

## 5. Elevação / sombras

| Token | Definição |
| --- | --- |
| Drop Shadow/md | `0 2px 2px #0000000F` + `0 4px 3px #00000012` |
| Drop Shadow/lg | `0 10px 8px #0000000A` + `0 4px 3px #0000001A` |
| Drop Shadow/2xl (dark) | `0 25px 25px #00000026` |

## 6. Pendências para a Fase 2 (não cobertas neste extract)

- [ ] Especificações de componentes individuais (Header, Icon Button, Tag, cards de projeto, timeline) — extrair via `get_design_context` nó a nó quando a implementação dos componentes começar.
- [ ] Ícones/assets (logos de tecnologias, ícones sociais) — exportar via `download_assets`/`upload_assets` quando formos montar os componentes.
- [ ] Decidir com o Johnny se **dark mode** e o **menu mobile dedicado** entram no escopo desta migração (o design já os contempla, mas `PLANO-MIGRACAO-ANGULAR.md` não menciona).
- [ ] Confirmar breakpoints intermediários (tablet) — o Figma só tem Desktop (1440) e Mobile (iPhone 8 / 375) como referência.
