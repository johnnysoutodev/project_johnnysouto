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

Sections ficam empilhadas sem gap entre si (cada uma já inclui seu próprio padding vertical — valores medidos na seção 2, "Padding de seção").

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

### Tokens formais de espaçamento no Figma

**Verificado (06/09/2026):** o arquivo **não tem variáveis de espaçamento nomeadas** (nada equivalente a `Spacing/2`, `Gap/sm` etc.). Confirmado via `get_variable_defs` em 4 frames de seção distintos (Hero `316:194`, About `316:229`, Skills `316:256`, Work `316:415`) — em todos os casos o retorno só trouxe variáveis de **cor** (`Gray/*`), **tipografia** (`Heading/*`, `Body*/*`, `Subtitle/*`) e **efeito** (`Drop Shadow/*`), nunca uma variável de espaçamento. Ou seja, ao contrário de cor/tipografia (que são tokens reutilizáveis definidos como variáveis do Figma), o espaçamento no arquivo é definido **diretamente nos valores de padding/gap do Auto Layout** de cada frame — valores "soltos", sem nome/token por trás. A tabela abaixo é, portanto, espaçamento **observado por amostragem**, não uma lista de tokens formais.

### Padding de seção (medido via `get_design_context`)

**Cobertura completa: as 9 seções do template foram medidas.** Primeira amostra (Hero, About, Skills, Work) confirmada em extração anterior; completada nesta rodada (06/09/2026) com Header, Experience, Testimonials, Contact me e Footer — todas com a mesma estrutura raiz `padding lateral / padding vertical`:

| Seção | Node ID | Padding horizontal | Padding vertical |
| --- | --- | --- | --- |
| Header | `316:588` | 80px | 16px |
| Hero | `316:194` | 80px | 96px |
| About | `316:229` | 80px | 96px |
| Skills | `316:256` | 80px | 96px |
| Experience | `316:357` | 80px | 96px |
| Work | `316:415` | 80px | 96px |
| Testimonials | `316:510` | 80px | 96px |
| Contact me | `316:537` | 80px | 96px |
| Footer | `316:579` | 80px | 24px |

**Resultado:** 7 das 9 seções (Hero, About, Skills, Experience, Work, Testimonials, Contact me) usam exatamente o mesmo padding de seção — **80px horizontal / 96px vertical** — confirmando que esse é o padrão do template para seções de conteúdo. **Header e Footer são exceção esperada**, e a exceção se confirmou: como têm altura fixa de 68px (barras finas, sticky/fixo no caso do Header), não cabe padding vertical de 96px — o valor real medido é **16px vertical no Header** e **24px vertical no Footer** (ambos mantêm os mesmos **80px horizontal**). O padding lateral de 80px é, portanto, universal nas 9 seções; o padding vertical de 96px é o padrão das 7 seções de conteúdo, com Header/Footer usando valores reduzidos e distintos entre si (16px vs. 24px — não há um segundo padrão comum entre eles).

Dentro de cada seção, o elemento `Container` direto costuma ter ainda um `padding: 0 32px` próprio (inset adicional além dos 80px da seção) — confirmado em Hero, About, Skills, e agora também em Header, Experience, Testimonials, Contact me e Footer (ou seja, 8 das 9 seções); em Work o container não tem esse padding extra (única exceção).

Margem entre seções: **0** — confirmado agora para as 9 seções via `get_metadata` no frame `316:177` (Home / Desktop / Light): a posição `y` de cada seção bate exatamente com o fim da anterior (Header 0–68 → Hero 68–620 → About 620–1582 → Skills 1582–2142 → Experience 2142–3282 → Work 3282–5130 → Testimonials 5130–5870 → Contact me 5870–6430 → Footer 6430–6498, igual à altura total do frame). Não há gap entre nenhuma das 9 — o espaçamento visual entre seções vem inteiramente do padding vertical de cada uma (96px nas 7 de conteúdo, 16px/24px em Header/Footer).

### Espaçamento observado (gaps e paddings internos)

Valores de `gap`/`padding` do Auto Layout encontrados nas 9 seções (amostra original de 4 — Hero, About, Skills, Work — completada em 06/09/2026 com Header, Experience, Testimonials, Contact me e Footer), do menor ao maior. **Não são tokens nomeados** — são os valores em pixels tal como aparecem no Figma:

| Valor | Uso típico observado | Onde aparece |
| --- | --- | --- |
| 4px | `gap` entre ícones sociais (Links) | Hero, Contact me |
| 6px | `padding` do Icon Button (botão de ícone circular) | Hero, Work, Header, Contact me |
| 8px | `gap` ícone+texto (localização, disponibilidade, tech icon+label, tags de tecnologia; ícone+nota de copyright) | Hero, Skills, Work, Footer |
| 10px | `gap` entre colunas da checklist "quick bits" | About |
| 16px | `gap` entre título e subtítulo de uma seção (Row com Tag + heading); também `gap` do bloco `Actions` do Header (Icon Button + Botão) | Skills, Work, Header, Experience, Testimonials, Contact me |
| 16px | `padding` vertical da seção (versão compacta, altura fixa de 68px — não cabe o padrão de 96px) | Header |
| 20px/4px | `padding` horizontal/vertical do componente Tag (badge) | About, Skills, Work |
| 20px | `gap` entre ícone, texto e botão de ação numa linha de contato (Email/Phone) — mesmo valor do Tag acima, mas uso de `gap`, não `padding` | Contact me |
| 24px | `gap` entre blocos de conteúdo (texto+parágrafos; título+descrição+tags+ações de um card; avatar+depoimento+dados do cliente); `gap` da navegação do Header | About, Work, Header, Testimonials |
| 24px | `padding` vertical da seção (versão compacta, altura fixa de 68px — não cabe o padrão de 96px; valor diferente do Header) | Footer |
| 32px | `padding` horizontal do `Container` interno de uma seção (inset adicional além dos 80px) | Hero, About, Skills, Header, Experience, Testimonials, Contact me, Footer |
| 32px | `padding` interno (nas 4 bordas) do card de item da Experience — mesmo valor do inset acima, mas aplicado como padding completo do card, não só horizontal | Experience |
| 48px | `gap` macro entre as colunas/linhas principais de uma seção (o espaçamento mais recorrente do arquivo) | Hero, About, Skills, Work, Experience, Testimonials, Contact me |
| 48px | `padding` interno dos cards (projeto no Work; depoimento na Testimonials) | Work, Testimonials |
| 80px | `padding` horizontal da seção — único valor universal nas 9 seções, inclusive Header e Footer | Hero, About, Skills, Work, Experience, Testimonials, Contact me, Header, Footer |
| 96px | `padding` vertical da seção (padrão das seções de conteúdo; Header/Footer usam 16px/24px, ver linhas acima) | Hero, About, Skills, Work, Experience, Testimonials, Contact me |

> Nota: os valores 6px e 10px quebram a hipótese anterior de "múltiplos de 8px" — a escala real é mais próxima da escala padrão do Tailwind (4, 6, 8, 10, 16, 20, 24, 32, 48...) do que de uma progressão estrita em base 8. A extração anterior (amostragem pontual) tinha generalizado isso incorretamente; esta tabela substitui aquela observação. Com a cobertura das 9 seções (06/09/2026), nenhum valor de pixel novo apareceu além dos já listados na amostra original — a escala se confirmou estável; a única novidade é o **padding vertical reduzido e distinto** de Header (16px) e Footer (24px), que já era esperado por serem barras de altura fixa (68px) em vez de seções de conteúdo.

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
| Hero | image-hero-avatar (foto de perfil, placeholder "Sagar") | images | `316:228` | `src/assets/images/image-hero-avatar.png` |
| About | image-about-photo (foto de perfil da seção "Sobre mim") | images | `316:239` | `src/assets/images/image-about-photo.png` |
| Work | image-project-thumbnail (thumbnail de projeto, reusado nos 3 cards) | images | `316:425` | `src/assets/images/image-project-thumbnail.png` |

> As 3 imagens acima são conteúdo de placeholder do template ("Sagar", projeto fictício) — exportadas só como referência estrutural de proporção (280×320, 400×480, 496×402), não para uso final no site. O thumbnail de projeto (`316:425`) é o mesmo arquivo reaproveitado também nos cards `327:279` e `327:312` — baixado uma única vez. Testimonials não tem foto raster: os avatares dos depoimentos são círculos de cor sólida com um ícone SVG genérico dentro (categoria `icons`, não `images`), não incluídos aqui.
>
> Os 3 `Icon Button` de redes sociais no Hero e no Contact me referenciam a mesma instância genérica de componente (`Icon`) — o ícone real (GitHub/Twitter/Figma) só aparece resolvido no *screenshot*, não no `get_metadata`. Confirmado visualmente via `get_screenshot`; exportado uma única vez por rede (o par idêntico no Hero/Contact não foi duplicado).
>
> **Pendente:** o ícone do `Icon Button` de tema/menu no Header (node `I316:588;316:604`) não foi exportado — o ID é de um *override* de instância e não é aceito pelas tools de export (`nodeId` precisa do formato `123:456`); precisa resolver o node ID "achatado" correspondente antes de exportar.

## 7. Pendências para a Fase 2 (não cobertas neste extract)

- [ ] Especificações de componentes individuais (Header, Icon Button, Tag, cards de projeto, timeline) — extrair via `get_design_context` nó a nó quando a implementação dos componentes começar.
- [x] Ícones de tecnologia (Skills), sociais (Hero/Contact me) e estruturais (pin, mail, phone, copy, footer) — extraídos em 06/09/2026, ver tabela da seção 6. Falta só o ícone de tema/menu do Header (bloqueado por ID de instância).
- [x] Imagens raster estruturais (avatar do Hero, foto do About, thumbnail de projeto do Work) — extraídas em 06/09/2026, ver tabela da seção 6. São placeholders do template, só pra referência de proporção.
- [ ] Decidir com o Johnny se **dark mode** e o **menu mobile dedicado** entram no escopo desta migração (o design já os contempla, mas `PLANO-MIGRACAO-ANGULAR.md` não menciona).
- [ ] Confirmar breakpoints intermediários (tablet) — o Figma só tem Desktop (1440) e Mobile (iPhone 8 / 375) como referência.

## Log de evolução

- **06/09/2026** — Espaçamento (seção 2): verificado via `get_variable_defs` em 4 frames de seção (Hero `316:194`, About `316:229`, Skills `316:256`, Work `316:415`) que o Figma **não tem variáveis de espaçamento nomeadas** — só cor/tipografia/efeito são tokens formais. Extraído via `get_design_context` o padding/gap real das mesmas 4 seções: padding de seção consistente em **80px horizontal / 96px vertical** nas 4 amostradas, e uma tabela de gaps/paddings internos observados (4 a 96px). Substitui a nota genérica anterior ("múltiplos de 8px") por dados medidos — a hipótese de base 8 estrita não se confirmou (6px e 10px aparecem no arquivo).
- **06/09/2026** — Extração de assets (ícones): 24 ícones exportados do Figma via `download_assets` em lotes manuais (Skills, depois Hero/Contact me/Footer), salvos em `src/assets/icons/`. Ver seção 6 para a lista completa e a seção 7 para a pendência restante (ícone do Header).
- **06/09/2026** — Verificação de tipografia: conferido via `get_design_context` em Hero (`316:194`), About (`316:229`) e Experience (`316:357`) que a tipografia usa exclusivamente a família **Inter** (Google Font padrão), sem fonte customizada embutida. Nenhum arquivo de fonte precisa ser exportado — ver nota na seção 4.
- **06/09/2026** — Extração de assets (imagens): 3 imagens raster mapeadas em lotes por seção (Hero, About, Work, Testimonials) e baixadas via `download_assets` — avatar do Hero, foto do About e thumbnail de projeto do Work (reusado nos 3 cards). Salvas em `src/assets/images/`. Testimonials não tinha foto raster (avatar ali é ícone SVG genérico). Ver seção 6.
- **06/09/2026** — Espaçamento (seção 2), cobertura completa das 9 seções: extraído via `get_design_context` o padding/gap real das 5 seções que faltavam (Header `316:588`, Experience `316:357`, Testimonials `316:510`, Contact me `316:537`, Footer `316:579`), completando a amostra anterior (Hero, About, Skills, Work). Confirmado que o padrão **80px horizontal / 96px vertical** se mantém em Experience, Testimonials e Contact me (7 das 9 seções agora no mesmo padrão). Header e Footer confirmam a exceção esperada por terem altura fixa de 68px: padding vertical medido em **16px (Header)** e **24px (Footer)** — valores distintos entre si, ambos mantendo os 80px horizontais. Confirmado também, via `get_metadata` no frame `316:177`, que a margem entre as 9 seções é **0** (posições `y` batem exatamente, sem gap). Nenhum valor de pixel novo apareceu além dos já catalogados na amostra original — só novos usos dos mesmos valores (ver tabela "Espaçamento observado"). Seção 2 agora cobre as 9 seções do template; nenhuma pendência de padding de seção restante.
