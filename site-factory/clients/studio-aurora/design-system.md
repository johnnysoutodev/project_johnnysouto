# Design System — Studio Aurora (Figma)

Fonte de verdade visual: Figma. Este documento existe para o builder não reabrir o arquivo. Escopo desta execução: hero, sobre, contato.

**Arquivo:** `template_portfolio_website_duplicate` | file key `1F1ZjUONCn5jMuTdZVUHN6`
**Extraído em:** 2026-10-03 (via figma-map.mjs + MCP get_design_context/get_variable_defs)

Conteúdo do template (nome "Sagar", textos, fotos, e-mail, telefone) é placeholder: não usar. O conteúdo vem do strategist; fotos viram bloco neutro.

## 1. Estrutura (frame Desktop 1440px)

| Seção spec | Frame Figma | Light (Home / Desktop / Light `316:177`) | Dark (Home / Desktop / Dark `327:1805`) | Altura |
| --- | --- | --- | --- | --- |
| hero | Hero | `316:194` | `327:1807` | 552px |
| sobre | About | `316:229` | `327:1830` | 962px |
| contato | Contact me | `316:537` | `327:2116` | 560px |

`figmaNode` no spec = node Light. Seções empilhadas sem gap. Variantes mobile/dark mapeadas em `figmaVariants` (ver tabela abaixo e seção 6.1).

| Seção | desktop-light | desktop-dark | mobile-light (375px) | mobile-dark (375px) | Altura mobile |
| --- | --- | --- | --- | --- | --- |
| hero | `316:194` | `327:1807` | `327:419` | `327:2149` | 880px |
| sobre | `316:229` | `327:1830` | `327:442` | `327:2172` | 1690px |
| contato | `316:537` | `327:2116` | `327:728` | `327:2463` | 472px |

Frames: mobile-light `327:417`, mobile-dark `327:2147` ("Home / Mobile (iPhone 8)"). Overlays `-menu` não se aplicam (site sem header/menu).

## 2. Layout

- Cada seção: padding **80px lateral / 96px vertical**; dentro, `Container` com `padding: 0 32px` (conteúdo útil 1216px). Largura do frame 1440.
- Escala de espaçamento usada: 4, 6, 8, 10, 16, 20, 24, 32, 48.

## 3. Cores (variáveis)

| Papel | Light | Dark |
| --- | --- | --- |
| Fundo base (hero, contato) | Gray/Default `#ffffff` | Gray/Dark/Default `#030712` |
| Fundo alternado (sobre) | Gray/50 `#f9fafb` | Gray/Dark/50 `#111827` |
| Fundo tag, bloco "Background" da foto | Gray/200 `#e5e7eb` | Gray/Dark/200 `#374151` |
| Texto secundário / ícones | Gray/600 `#4b5563` | Gray/Dark/600 `#d1d5db` |
| Texto forte (títulos) | Gray/900 `#111827` | Gray/Dark/900 `#f9fafb` |
| Borda da foto (8px) | igual ao fundo da seção | igual ao fundo da seção |
| Ponto "disponível" | `#10b981` (fixo) | idem (assumido: não há variável) |

Dark verificado por `get_variable_defs` em Hero, About e Contact (desktop e mobile): Contact dark (`327:2116`/`327:2463`) usa Gray/Dark/Default, 200, 600 e 900, igual ao mapeamento acima.

## 4. Tipografia (Inter; Google Font, sem arquivo local)

Letter-spacing em % do font-size (`-2` = -0.02em); tema não muda tipografia.

| Token | Peso | Tam/Line | Letter-sp | Uso nestas seções |
| --- | --- | --- | --- | --- |
| Heading/H1/Bold | 700 | 60/72 | -0.02em | título do hero |
| Heading/H2/Semi Bold | 600 | 36/40 | -0.02em | e-mail e telefone (contato) |
| Heading/H3/Semi Bold | 600 | 30/36 | -0.02em | título da seção sobre |
| Subtitle/Normal | 400 | 20/28 | 0 | parágrafo do contato |
| Body2/Normal | 400 | 16/24 | 0 | parágrafos, localização, disponibilidade, listas |
| Body3/Medium | 500 | 14/20 | 0 | texto da Tag |

## 5. Sombras

Nenhuma sombra nestas 3 seções.

## 6. Componentes (medidas)

**Tag (badge):** padding 4px 20px, radius 12px, fundo Gray/200, texto Body3/Medium Gray/600; altura 28px; centralizada em linha própria.

**Icon Button:** 36x36 (padding 6px, ícone 24px), radius 8px. Variante grande no contato: 44x44 (padding 6px, ícone 32px). Estados hover/focus: não extraídos (componente tem variável `State=Default` apenas); builder define hover discreto (fundo Gray/100-200) e `:focus-visible`. Pendência de design.

**Foto com moldura ("Pic Container"):** dois retângulos sobrepostos, ambos com borda 8px da cor do fundo da seção. "Pic" (foto) e "Background" (Gray/200) deslocado 40px para baixo e 40px lateral. Foto = bloco neutro (não exportar).

### Hero (`316:194`)
- Container flex-wrap, gap 48px, altura 360px, duas colunas.
- Coluna esquerda (max-width 768px, gap 48px, vertical):
  - Content (gap 8): H1 (Gray/900) + parágrafo Body2 (Gray/600, largura 768px).
  - Grupo (gap 8, vertical): linha Localização (ícone 24 + texto, gap 8) e linha Disponibilidade (caixa 24x24 com ponto `#10b981` 8x8 radius full + texto, gap 8); texto Body2 Gray/600.
  - Actions > Links: Icon Buttons 36x36, gap 4: github, twitter, figma (substituir pelas redes reais do cliente).
- Coluna direita (min-width 384, alinhada à direita, centralizada vertical): foto 280x320 (borda 8), Background 280x320 com offset (40,40). Ocupa 320x360.

### Sobre (`316:229`)
- Fundo Gray/50. Container coluna, gap 48, centralizado.
- Linha 1: Tag centralizada.
- Linha 2 (flex-wrap, gap 48, altura 694):
  - Coluna esquerda (min-width 444): foto 400x480 (borda 8 na cor Gray/50), Background 400x480 Gray/200 em offset (esquerda 0, topo 40); a foto em offset esquerda 40, topo 0 (espelhado em relação ao hero).
  - Coluna direita (min-width 444, gap 24): H3 Gray/900; Content (gap 16) com parágrafos Body2 Gray/600; links sublinhados no corpo (cor do texto); checklist 2 colunas (gap 10, bullets `list-disc` com recuo 24px).

### Contato (`316:537`)
- Fundo base. Container coluna centralizada, gap 48.
- Cabeçalho (gap 16): Tag + parágrafo Subtitle/Normal Gray/600, centralizado, max-width 576px.
- Coluna de contatos (gap 16, centralizada): linhas Email e Telefone, cada uma: ícone 32 + texto H2 Gray/900 + Icon Button 44 (ícone externo/copiar 32), gap 20. Alturas 44. Para o cliente: e-mail `contato@studioaurora.example` e WhatsApp (ícone phone, link `wa.me`) em vez de telefone.
- Social: texto Body2 Gray/600 ("Você também me encontra...") + Links (3 Icon Buttons 36, gap 4), gap 8.

## 6.1 Mobile (375px) e Dark: o que muda

Medidas extraídas de `figma-map.mjs layout` nos frames mobile (`327:419`, `327:442`, `327:728`); fontes via MCP. Tema dark do mobile usa exatamente os mesmos tokens do dark desktop (confirmado por `get_variable_defs` em `327:2149`, `327:2172`, `327:2463`); o mobile-dark só troca as cores.

**Global mobile:** padding de seção **64px vertical / 16px lateral** (desktop: 96/80); Container sem os 32px extras, largura útil 343px. Tag, Icon Button 36x36 e demais componentes iguais ao desktop. Foto com moldura menor (veja por seção). Tudo empilha em uma coluna.

### Hero mobile (`327:419`, 375x880)
- Container coluna, gap 48, largura 343. **A foto vem ANTES do texto** (desktop: texto à esquerda, foto à direita).
- Pic Container centralizado, 280x300: Background 280x280 em offset (esq 0, topo 20); Pic 240x280 em offset (esq 20, topo 0). Borda 8px na cor do fundo. (Desktop: ambos 280x320, offset 40/40.)
- Coluna de texto (gap 48, 343 de largura): Content (gap 8) com H1 + parágrafo; Group (gap 8): Location e Hire (linha 24px, gap 8); Actions: Links (Icon Buttons 36, gap 4), alinhados à esquerda.
- **Tipografia:** H1 = Heading/H1/Semi Bold Mobile **600, 36/40, letter-spacing 0**, não quebra linha no template (desktop: 700, 60/72, -0.02em). Parágrafo Body2 16/24 (igual). Alturas: Content 216 (placeholder), Group 56, Actions 36.
- Dark: fundo `#030712`; H1 `#f9fafb`; parágrafo/localização/disponibilidade/ícones `#d1d5db`; borda da foto `#030712`; Background da foto `#374151`; ponto `#10b981` fixo.

### Sobre mobile (`327:442`, 375x1690)
- Container coluna centralizada, gap **24** (desktop: 48). Linha 1: Tag centralizada (28px). Linha 2: coluna, gap 48.
- **Foto vem ANTES do texto.** Pic Container centralizado 320x380: Background 320x360 (esq 0, topo 20), Pic 280x360 (esq 20, topo 0). Borda 8px na cor do fundo (Gray/50). (Desktop: 400x480.)
- Texto (gap 24): H3 = Heading/H3 Semi Bold Tablet & Mobile **600, 24/32, letter-spacing -0.02em** (desktop: 30/36). Content (gap 16): parágrafos Body2 16/24, links sublinhados; **checklist continua em 2 colunas** (gap 10, `list-disc` recuo 24).
- Dark: fundo `#111827` (Gray/Dark/50); H3 `#f9fafb`; texto `#d1d5db`; Tag fundo `#374151` texto `#d1d5db`; Background da foto `#374151`; borda da foto `#111827`.

### Contato mobile (`327:728`, 375x472)
- Container coluna centralizada, gap **24** (desktop: 48). Cabeçalho (gap 16): Tag (28) + parágrafo centralizado.
- Parágrafo: Subtitle/Normal 400, **20/28** (igual ao desktop), largura 343, placeholder quebra em 4 linhas (h112).
- Linhas de contato (Email 36px, Phone 36px, **sem gap entre elas**): ícone **24** (desktop: 32) + texto + Icon Button **36** (desktop: 44), gap **16** (desktop: 20). Texto = Heading/H2 Tablet & Mobile **600, 18/28, letter-spacing -0.02em** (desktop: 36/40). Colunas centralizadas (x 22 / 67).
- Social (gap 8): texto Body2 Gray/600 + Links (3 Icon Buttons 36, gap 4), centralizados, largura 312.
- Dark: fundo `#030712`; e-mail/telefone `#f9fafb`; parágrafo, Body2 e ícones `#d1d5db`; Tag fundo `#374151`.

### Resumo de diferenças desktop -> mobile
| Item | Desktop | Mobile |
| --- | --- | --- |
| Padding de seção | 80 lat / 96 vert | 16 lat / 64 vert |
| Altura hero / sobre / contato | 552 / 962 / 560 | 880 / 1690 / 472 |
| Hero e Sobre: ordem | texto + foto lado a lado | foto acima, texto abaixo, gap 48 |
| Foto hero | 280x320, offset 40/40 | 240x280 + bg 280x280, offset 20/20 |
| Foto sobre | 400x480 | 280x360 + bg 320x360 |
| H1 hero | 700 60/72 | 600 36/40, sem letter-spacing |
| H3 sobre | 600 30/36 | 600 24/32 |
| Texto e-mail/telefone | H2 600 36/40 | 600 18/28 |
| Ícone / Icon Button contato | 32 / 44 | 24 / 36 |
| Gap do container (sobre, contato) | 48 | 24 |

## 7. Assets exportados

Salvos em `site-factory/sandbox/studio-aurora/public/assets/icons/`. SVGs vêm com `stroke="#4B5563"` (tema light). Para dark (`#D1D5DB`), usar CSS `mask-image` com `background-color: currentColor` ou inline SVG; não usar `<img>` direto.

| Asset | Node ID origem | Tam | Arquivo |
| --- | --- | --- | --- |
| icon-location | `317:709` | 24 | icon-location.svg |
| icon-github | `I317:734;309:256` | 24 | icon-github.svg |
| icon-twitter | `I317:738;309:256` | 24 | icon-twitter.svg |
| icon-figma | `I317:742;309:256` | 24 | icon-figma.svg |
| icon-inbox | `327:352` | 32 | icon-inbox.svg |
| icon-phone | `327:366` | 32 | icon-phone.svg |
| icon-external-link | `I327:373;309:280` | 32 | icon-external-link.svg |

Origem dos arquivos: URLs de assets do get_design_context (SVG limpo do ícone, sem padding do botão). Não exportados: fotos e logos placeholder. Observação: github/twitter/figma refletem as redes do template; o builder pode trocar por ícones de Instagram/WhatsApp se o strategist definir (não existem no template).

## 8. Pendências

- [ ] Estados hover/focus dos Icon Buttons não definidos no Figma.
- [x] Variantes mobile e dark mapeadas e documentadas (2026-10-03). [ ] Breakpoints intermediários (tablet) não existem no Figma (só 375 e 1440); definir ponto de troca no builder.
- [ ] Ícones de Instagram/WhatsApp não existem no template.
- [x] Contact dark inspecionado (2026-10-03).

## 9. Log

- 2026-10-03: criação do documento (hero, sobre, contato; tokens light/dark; 7 ícones).

- 2026-10-03: variantes mobile (375px) e dark mapeadas em `figmaVariants`; medidas mobile e tokens dark das 3 seções documentados (seção 6.1); pendências de mobile e Contact dark resolvidas.

## 10. Decisões e divergências intencionais

- 2026-10-03 — QA-7: hover (fundo Gray/200) e `:focus-visible` (outline) dos Icon Buttons não existem no Figma; definidos pelo builder e aprovados como intencionais.
- 2026-10-03 — QA-3, QA-4, QA-5: alturas e quebras de linha de hero, contato e sobre diferem do Figma por causa do conteúdo placeholder (Lorem Ipsum); ignorado de propósito, reavaliar com conteúdo real.
- 2026-10-03 — QA-9: ícone de copiar ao lado do e-mail e do telefone do contato mantido como está (decisão: não alterar).
- 2026-10-03 — QA-21: valores de contato podem quebrar de linha somente antes do `@` no mobile (ex.: "contato" / "@studioaurora.example"); último recurso, só se um trecho não couber sozinho, quebra em qualquer ponto; telefone não quebra; decisão do usuário (opção A), fonte 18/28 mantida.
- 2026-10-03 — QA-6: refutado pela medição; a Tag está na especificação e confere com o Figma.
- 2026-10-03: seção 10 (decisões e divergências intencionais, QA rodada 1).
