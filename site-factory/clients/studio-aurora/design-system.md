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

`figmaNode` no spec = node Light. Seções empilhadas sem gap. Mobile existe no Figma (`327:417` light) mas não foi extraído (fora do escopo).

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

Dark verificado nas variáveis dos frames Hero, About (`327:1807`, `327:1830`); Contact dark (`327:2116`) não foi lido separadamente, assume a mesma troca de tokens do hero (fundo Default).

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
- [ ] Variantes mobile (`327:417`) e breakpoints: fora do escopo desta execução.
- [ ] Ícones de Instagram/WhatsApp não existem no template.
- [ ] Contact dark (`327:2116`) não inspecionado individualmente.

## 9. Log

- 2026-10-03: criação do documento (hero, sobre, contato; tokens light/dark; 7 ícones).
