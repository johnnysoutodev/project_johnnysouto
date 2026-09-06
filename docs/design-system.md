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

> **Verificação (06/09/2026):** confirmado via `get_design_context` em nós de texto de 3 seções distintas (Hero `316:194`, About `316:229`, Experience `316:357`) que a família de fonte é **exclusivamente "Inter"** (variantes Regular/Medium/Semi Bold/Bold), sem mistura com nenhuma outra fonte. Por ser uma Google Font padrão, conforme critério de `docs/agent-rules/designer.md` (seção "3.1 Extrair assets"), **não é necessário exportar arquivo físico de fonte** — o nome da família documentado acima já é suficiente.

## 5. Elevação / sombras

| Token | Definição |
| --- | --- |
| Drop Shadow/md | `0 2px 2px #0000000F` + `0 4px 3px #00000012` |
| Drop Shadow/lg | `0 10px 8px #0000000A` + `0 4px 3px #0000001A` |
| Drop Shadow/2xl (dark) | `0 25px 25px #00000026` |

## 6. Assets exportados

> Ícones, imagens, logos e fontes baixados do Figma (`download_assets`) em lotes manuais por seção/frame, seguindo o critério e a convenção de `docs/agent-rules/designer.md` (seção "3.1 Extrair assets"). Salvos em `src/assets/<categoria>/` (ex.: `src/assets/icons/`, `src/assets/images/`, `src/assets/fonts/`).

| Lote/Seção | Asset | Categoria | Node ID (Figma) | Caminho no repo |
| --- | --- | --- | --- | --- |
| Skills | icon-javascript | icons | `316:267` | `src/assets/icons/icon-javascript.svg` |
| Skills | icon-typescript | icons | `316:272` | `src/assets/icons/icon-typescript.svg` |
| Skills | icon-react | icons | `316:277` | `src/assets/icons/icon-react.svg` |
| Skills | icon-nextjs | icons | `316:285` | `src/assets/icons/icon-nextjs.svg` |
| Skills | icon-nodejs | icons | `316:295` | `src/assets/icons/icon-nodejs.svg` |
| Skills | icon-express | icons | `316:300` | `src/assets/icons/icon-express.svg` |
| Skills | icon-nest | icons | `316:304` | `src/assets/icons/icon-nest.svg` |
| Skills | icon-socket | icons | `316:308` | `src/assets/icons/icon-socket.svg` |
| Skills | icon-postgresql | icons | `316:313` | `src/assets/icons/icon-postgresql.svg` |
| Skills | icon-mongodb | icons | `316:316` | `src/assets/icons/icon-mongodb.svg` |
| Skills | icon-sass | icons | `316:320` | `src/assets/icons/icon-sass.svg` |
| Skills | icon-tailwindcss | icons | `316:324` | `src/assets/icons/icon-tailwindcss.svg` |
| Skills | icon-figma | icons | `316:332` | `src/assets/icons/icon-figma.svg` |
| Skills | icon-cypress | icons | `316:340` | `src/assets/icons/icon-cypress.svg` |
| Skills | icon-storybook | icons | `316:349` | `src/assets/icons/icon-storybook.svg` |
| Skills | icon-git | icons | `316:354` | `src/assets/icons/icon-git.svg` |
| Hero | icon-pin (localização) | icons | `317:709` | `src/assets/icons/icon-pin.svg` |
| Hero / Contact me | icon-social-github | icons | `317:734` | `src/assets/icons/icon-social-github.svg` |
| Hero / Contact me | icon-social-twitter | icons | `317:738` | `src/assets/icons/icon-social-twitter.svg` |
| Hero / Contact me | icon-social-figma | icons | `317:742` | `src/assets/icons/icon-social-figma.svg` |
| Contact me | icon-mail | icons | `327:352` | `src/assets/icons/icon-mail.svg` |
| Contact me | icon-phone | icons | `327:366` | `src/assets/icons/icon-phone.svg` |
| Contact me | icon-copy (botão "copiar", reusado 2x) | icons | `327:373` | `src/assets/icons/icon-copy.svg` |
| Footer | icon-footer (junto ao copyright) | icons | `327:412` | `src/assets/icons/icon-footer.svg` |

> Os 3 `Icon Button` de redes sociais no Hero e no Contact me referenciam a mesma instância genérica de componente (`Icon`) — o ícone real (GitHub/Twitter/Figma) só aparece resolvido no *screenshot*, não no `get_metadata`. Confirmado visualmente via `get_screenshot`; exportado uma única vez por rede (o par idêntico no Hero/Contact não foi duplicado).
>
> **Pendente:** o ícone do `Icon Button` de tema/menu no Header (node `I316:588;316:604`) não foi exportado — o ID é de um *override* de instância e não é aceito pelas tools de export (`nodeId` precisa do formato `123:456`); precisa resolver o node ID "achatado" correspondente antes de exportar.

## 7. Pendências para a Fase 2 (não cobertas neste extract)

- [ ] Especificações de componentes individuais (Header, Icon Button, Tag, cards de projeto, timeline) — extrair via `get_design_context` nó a nó quando a implementação dos componentes começar.
- [x] Ícones de tecnologia (Skills), sociais (Hero/Contact me) e estruturais (pin, mail, phone, copy, footer) — extraídos em 06/09/2026, ver tabela da seção 6. Falta só o ícone de tema/menu do Header (bloqueado por ID de instância).
- [ ] Decidir com o Johnny se **dark mode** e o **menu mobile dedicado** entram no escopo desta migração (o design já os contempla, mas `PLANO-MIGRACAO-ANGULAR.md` não menciona).
- [ ] Confirmar breakpoints intermediários (tablet) — o Figma só tem Desktop (1440) e Mobile (iPhone 8 / 375) como referência.

## Log de evolução

- **06/09/2026** — Extração de assets (ícones): 24 ícones exportados do Figma via `download_assets` em lotes manuais (Skills, depois Hero/Contact me/Footer), salvos em `src/assets/icons/`. Ver seção 6 para a lista completa e a seção 7 para a pendência restante (ícone do Header).
- **06/09/2026** — Verificação de tipografia: conferido via `get_design_context` em Hero (`316:194`), About (`316:229`) e Experience (`316:357`) que a tipografia usa exclusivamente a família **Inter** (Google Font padrão), sem fonte customizada embutida. Nenhum arquivo de fonte precisa ser exportado — ver nota na seção 4.
