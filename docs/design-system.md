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

### Padding de seção — Mobile (medido via `get_design_context`)

Amostra de 4 seções no frame `327:417` (Home / Mobile (iPhone 8) / Light, ver seção 1) — a mesma amostra original usada no desktop (Hero, About, Skills, Work), para manter a comparação consistente. Node IDs são específicos do frame mobile (diferentes dos IDs do desktop, mesmo sendo a "mesma" seção):

| Seção | Node ID (Mobile) | Padding horizontal | Padding vertical |
| --- | --- | --- | --- |
| Hero | `327:419` | 16px | 64px |
| About | `327:442` | 16px | 64px |
| Skills | `327:468` | 16px | 64px |
| Work | `327:638` | 16px | 64px |

**Resultado:** as 4 seções amostradas usam exatamente o mesmo padding no mobile — **16px horizontal / 64px vertical** — mesma estrutura do desktop (padding lateral + padding vertical simétrico no próprio Auto Layout da seção, sem token nomeado), só com valores menores: o horizontal cai de 80px para 16px (5x menor), o vertical cai de 96px para 64px (1,5x menor). Confirmado via `get_design_context` em Hero (`327:419`, classe gerada `px-[16px] py-[64px]`) e Skills (`327:468`, mesma classe); About (`327:442`) e Work (`327:638`) confirmados por geometria equivalente via `get_metadata` (Container interno a `x=16`/`y=64` dentro do frame de seção, com a mesma folga simétrica do lado oposto).

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

### Artefato de tokens CSS

Os valores de cor (seção 3), tipografia (seção 4), sombra (seção 5) e a escala de espaçamento observada (acima) foram traduzidos mecanicamente para CSS custom properties em **[`docs/design-tokens.css`](./design-tokens.css)** — artefato agnóstico de framework, sem valor novo (só formato). Fica em `docs/` (fora de `src/`/`public/`) porque o projeto Angular ainda não existe; quando `angular-scaffold`/`angular-components` rodarem, esse conteúdo migra para dentro do projeto Angular. Convenções adotadas (tema via `[data-theme="dark"]`, espaçamento nomeado pelo próprio valor em px) estão documentadas no cabeçalho do próprio arquivo.

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

> **Correção de unidade do letter-spacing (06/09/2026):** a coluna "Letter-spacing" acima ("-2"/"0") está em **porcentagem do tamanho da fonte**, não em pixels — confirmado via `get_design_context` no nó do headline do Hero (`316:203`), cujo estilo nomeado é literalmente "Heading/H1/Bold - Desktop" com `letterSpacing: -2` na metadata do Figma, e que renderiza como `-1.2px` num texto de `60px` (1.2 ÷ 60 = 2%). Ou seja, `-2` = `-2%` do `font-size` de cada linha da tabela (H1 60px → -1.2px; H2 36px → -0.72px; H3 30px → -0.6px — este último também observado num segundo nó, o logo do Header, com peso Bold no mesmo tamanho). Os valores "0" (Subtitle/Body) não são afetados pela unidade. Ver `docs/design-tokens.css` para a tradução em `em` (`-2% = -0.02em`).

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

- [x] Especificações de componentes individuais (Header, Icon Button, Tag, cards de projeto, timeline) — extraídas em 06/09/2026 via `get_design_context`, ver seção 8. Cobertura: Header, Footer, Icon Button (variantes 36×36 e 44×44), Tag, card de projeto (Work, 3 cards), item de timeline (Experience, 3 itens) e card de depoimento (Testimonials). **Ressalva não bloqueante:** o Icon Button expõe uma prop `state` no componente (valor visto: `Default`), mas não foi possível confirmar variantes `Hover`/`Active` como frames estáticos no arquivo — ver seção 8 para detalhe. Isso não impede a implementação (a variante visível/`Default` está totalmente documentada); só significa que hover/active precisarão ser definidos por convenção do projeto, não copiados do Figma.
- [x] Ícones de tecnologia (Skills), sociais (Hero/Contact me) e estruturais (pin, mail, phone, copy, footer) — extraídos em 06/09/2026, ver tabela da seção 6. Falta só o ícone de tema/menu do Header (bloqueado por ID de instância).
- [x] Imagens raster estruturais (avatar do Hero, foto do About, thumbnail de projeto do Work) — extraídas em 06/09/2026, ver tabela da seção 6. São placeholders do template, só pra referência de proporção.
- [x] Decidir com o Johnny se **dark mode** e o **menu mobile dedicado** entram no escopo desta migração — **resolvido:** ambos entram no escopo. Decisão já estava registrada em `docs/PLANO-MIGRACAO-ANGULAR.md` (seção "2. Decisões arquiteturais já tomadas" e "8. Log de evolução deste plano", entrada de 06/09/2026: "Dark mode e menu mobile dedicado adicionados ao escopo da migração (Johnny confirmou)") — este item aqui só estava desatualizado em relação a esse registro; Johnny reconfirmou agora (06/09/2026).
- [x] Escopo de **tablet** decidido — **resolvido:** tablet também entra no escopo da migração (Johnny confirmou em 06/09/2026), mesmo o Figma não tendo nenhuma referência visual para essa faixa. Reconfirmado agora, via `get_screenshot` nos grupos `328:4104` (Light) e `328:4105` (Dark) da seção 1, que o arquivo continua tendo **apenas duas larguras de frame**: Desktop (1440px) e Mobile/iPhone 8 (375px, repetida no frame de "Mobile Menu") — nenhuma largura intermediária de tablet existe no Figma, em nenhum dos dois temas. Como não há dado extraível, o breakpoint e o layout intermediário abaixo são **convenção de engenharia proposta**, não extração:
  - [ ] **Breakpoint sugerido (não é valor visto no Figma):** tablet como faixa intermediária entre os dois extremos confirmados (Mobile 375 / Desktop 1440) — proposta: **~768px a ~1023px**, com desktop assumido a partir de **1024px**. É a convenção de mercado amplamente usada (ex.: breakpoints `md`/`lg` do Tailwind CSS), não um dado do arquivo Figma. A validar com o Johnny/na implementação.
  - [ ] **Layout intermediário (768–1023px) não pode ser copiado do Figma** — precisa ser interpolado/desenhado na Fase 2 de implementação (`docs/PLANO-MIGRACAO-ANGULAR.md`), usando como base os paddings/gaps já documentados na seção 2 (ex.: reduzir progressivamente o padding horizontal de seção de 80px, no desktop, até o valor usado no mobile). **Atualização (06/09/2026):** as duas pontas da interpolação agora estão confirmadas — desktop em **80px horizontal / 96px vertical** (seção 2, "Padding de seção") e mobile em **16px horizontal / 64px vertical** (seção 2, "Padding de seção — Mobile", amostra Hero/About/Skills/Work no frame `327:417`). Isso resolve a lacuna anterior (mobile não tinha padding lateral medido). A ressalva permanece: o breakpoint (~768–1023px) e o layout de tablet em si continuam sendo **convenção de engenharia proposta**, não uma extração do Figma — o arquivo não tem nenhum frame nessa largura (ver início deste item); só as duas pontas do intervalo (mobile/desktop) que servem de base para a interpolação é que agora estão medidas.

## 8. Especificações de componentes

> Extraído via `get_design_context` (Desktop/Light) em 06/09/2026. Cores, tipografia e espaçamento abaixo referenciam os tokens já documentados nas seções 3/4/2 — não há valor solto novo introduzido aqui. Screenshots de conferência gerados via `get_screenshot` durante a extração (URLs de curta duração, não reproduzidas aqui).

### 8.1 Header (`316:588`)

- **Dimensões:** 1440×68 (largura total, altura fixa). Nomeado/assumido como sticky na seção 1 (altura fixa de barra), mas **não foi possível confirmar comportamento sticky/scroll**: o container tem uma borda inferior (`border-bottom`) na cor `rgba(255,255,255,0)` (transparente) — compatível com um padrão comum de "borda que aparece ao rolar a página", mas o arquivo não tem um frame/estado separado de "Header rolado" nem uma interação de prototype inspecionável pelas tools disponíveis. Tratar como suposição de implementação, não como spec confirmada.
- **Cor de fundo:** `--color-gray-default` (branco).
- **Padding:** 80px horizontal / 16px vertical (seção 2), mais 32px horizontal do `Container` interno.
- **Estrutura (esquerda → direita):**
  - Logo/nome `<SS />`: texto Bold 30px/36px, cor `--color-gray-900`, tracking -0.6px (ver nota de unidade na seção 4) — **não corresponde a nenhum token nomeado da tabela da seção 4** (mistura peso Bold com tamanho de H3); tratar como estilo ad-hoc do template, a substituir pelo nome/logo real do Johnny.
  - Navegação (`gap: 24px`): 4 links de texto (About, Work, Testimonials, Contact) — estilo **Body2/Medium**, cor `--color-gray-600`.
  - Divider vertical entre navegação e ações (linha simples, sem token de cor específico além do stroke padrão).
  - Bloco "Actions" (`gap: 16px`): Icon Button (tema/menu, ver 8.3) + Botão "Download CV" (fundo `--color-gray-900`, texto `--color-gray-50`, estilo Body2/Medium, `padding: 6px 16px`, `border-radius: 12px`).
- **Estados:** nenhum estado de hover/active foi encontrado como frame estático para os links de navegação ou para o botão "Download CV" — não confirmável via Figma; convenção de hover deve ser decidida na implementação.

### 8.2 Footer (`316:579`)

- **Dimensões:** 1440×68 (largura total, altura fixa).
- **Cor de fundo:** `--color-gray-50` (diferente do Header, que é `--color-gray-default`).
- **Padding:** 80px horizontal / 24px vertical (seção 2), mais 32px horizontal do `Container` interno.
- **Estrutura:** um único bloco centralizado "Footer Note" com `gap: 8px` — ícone de copyright (16×16, asset `icon-footer`, já exportado na seção 6) + texto de copyright em **Body3/Normal** (14px/20px), cor `--color-gray-600`, com dois trechos em link sublinhado ("Designed" e "coded", placeholders do template a substituir pelos créditos reais).
- **Estados:** não aplicável (sem elementos interativos além dos 2 links de texto, sem hover confirmável).

### 8.3 Icon Button

Componente reusado no Header (tema/menu), Hero e Contact me (redes sociais), e Work/Contact me (ações). Duas variantes de tamanho observadas — **não há uma prop `size` com nomes tipo "sm/md/lg" confirmada por múltiplos valores; o único valor de `size` visto explicitamente foi `"md"`** (no Header), mas o mesmo componente aparece com dimensão total diferente em Contact me:

| Variante | Dimensão total | Padding | Ícone interno | Onde aparece | Node de referência |
| --- | --- | --- | --- | --- | --- |
| Padrão (36×36) | 36×36 | 6px (`--space-icon-button-padding`) | 24×24 | Header (tema/menu), Hero (social ×3), Work (ação do card), Contact me (social ×3) | `I316:588;316:604` (Header), `317:734` (Hero) |
| Grande (44×44) | 44×44 | 6px | 32×32 | Contact me (botão "copiar" ao lado de e-mail/telefone) | `327:373`, `327:377` |

- **Border-radius:** 8px em ambas as variantes.
- **Cor de fundo:** transparente (sem `background` aplicado) em todas as instâncias inspecionadas — o botão é só o ícone com padding, sem fundo/borda visível no estado default.
- **Ícone:** SVG interno, cor herdada do ícone exportado (ver seção 6 para os ícones sociais/estruturais já baixados); o ícone de tema/menu do Header (formato de "sol", conforme screenshot) **segue pendente de exportação como asset isolado** (mesmo bloqueio já registrado na seção 6 — node de override `I316:588;316:604;309:256` não aceito por `download_assets`), mas sua estrutura de layout (padding/tamanho) **foi** confirmada aqui via `get_design_context`, que não tem essa mesma restrição de formato de node ID.
- **Variantes/props do componente:** a instância do Header expõe explicitamente as props `size="md"`, `state="Default"`, `themeMode="Light"` na assinatura gerada pelo `get_design_context` — ou seja, o componente principal tem variantes de `state` e `themeMode` no Figma, mas **não foi possível enumerar quais outros valores essas props aceitam** (ex.: `state="Hover"`/`"Active"`) porque o arquivo não expõe Code Connect nem uma página de biblioteca de componentes separada (`list_file_components_for_code_connect` retornou erro de permissão — recurso exige seat Dev/Full em plano Organization/Enterprise) e nenhum outro frame estático com `state` diferente de `Default` foi localizado. **Não adivinhado:** hover/active do Icon Button não são especificados aqui — devem ser definidos por convenção do projeto na implementação.

### 8.4 Tag

Badge usado em About, Skills, Work, Experience, Testimonials e Contact me (título de seção) — mesmo componente em todos os usos, sem variante de cor observada.

- **Dimensão:** auto (largura ajustada ao texto), altura efetiva 28px (`padding-y` 4px × 2 + linha de 20px do texto).
- **Padding:** `20px` horizontal / `4px` vertical (`--space-tag-padding-x` / `--space-tag-padding-y`).
- **Cor de fundo:** `--color-gray-200`.
- **Cor de texto:** `--color-gray-600`.
- **Tipografia:** `Body3/Medium` (14px/20px, peso 500).
- **Border-radius:** 12px.
- **Estados:** não há Tag interativo no arquivo (é só rótulo/badge) — sem hover/active a documentar.

### 8.5 Card de projeto (Work, `316:415`)

3 cards confirmados (Row `316:423`, `327:277`, `327:310`), todos com a mesma estrutura, alternando o lado da imagem (card 1: imagem à esquerda / texto à direita; card 2: texto à esquerda / imagem à direita; card 3: imagem à esquerda / texto à direita de novo — não é uma alternância estrita a cada card, é o padrão observado nos 3 existentes).

- **Dimensão:** 1152px de largura (dentro do container de 1280px com `padding-x: 64px` — nota: esse é um inset diferente do "32px" padrão de outras seções, específico do Work, já registrado na seção 2 como a exceção sem o padding extra de Container), altura 480px por card.
- **Border-radius:** 12px (card inteiro e a imagem interna).
- **Sombra:** `--shadow-md` no card inteiro; a imagem interna (`Picture`) tem sua própria sombra, mais pronunciada — `--shadow-lg`.
- **Cor de fundo:** lado da imagem usa `--color-gray-50` com borda `--color-gray-100`; lado do texto usa `--color-gray-default` (branco).
- **Padding interno:** 48px em ambas as colunas (`--space-card-padding`), confirmando o valor já registrado na seção 2.
- **Estrutura (lado de texto):** título do projeto (`Body1`/Subtitle Semi Bold 20px/28px, cor `--color-gray-900`) → descrição (`Body2/Normal`, 16px/24px, `--color-gray-600`) → grid de Tags de tecnologia (`gap: 8px`, wrap) → bloco "Actions" com 1 Icon Button (variante 36×36, link externo do projeto) — `gap: 24px` entre esses 4 blocos.
- **Estados:** sem hover/active confirmável nos cards nem no Icon Button de ação (mesma ressalva da seção 8.3).

### 8.6 Item de timeline (Experience, `316:357`)

3 itens confirmados (Row `316:365`, `316:378`, `316:405`), mesma estrutura, alturas diferentes por causa da quantidade de linhas de descrição (bullet list).

- **Dimensão:** largura 896px (dentro do container de 1280px, mais estreito que as outras seções — inset de `192px` de cada lado, não os 32px padrão do Container), altura auto (varia com o conteúdo: 288px, 264px, 180px nos 3 itens observados).
- **Border-radius:** 12px.
- **Sombra:** `--shadow-md` (mesma sombra do card do Work).
- **Cor de fundo:** `--color-gray-default` (branco).
- **Padding interno:** 32px nas 4 bordas (`--space-timeline-item-padding`), confirmando o valor já registrado na seção 2.
- **Estrutura interna (`gap: 48px` entre colunas):** logo da empresa (imagem/SVG, ex. "logo-upwork" 102×28) → coluna de conteúdo (cargo em `Subtitle/Semi Bold` 20px/28px cor `--color-gray-900`, lista de bullets em `Body2/Normal` 16px/24px cor `--color-gray-600`, `gap: 16px` entre cargo e lista) → período (`Body2/Normal` 16px/24px, cor `--color-gray-700` — mais escuro que a descrição, mesmo estilo de tamanho).
- **Conector visual da timeline:** **não encontrado.** Inspecionado via `get_screenshot` na seção inteira (`316:357`) — os 3 itens são simplesmente cards empilhados com `gap: 48px` entre si (mesmo valor "gap macro" já documentado na seção 2), sem linha vertical, marcador/dot ou qualquer elemento gráfico de timeline conectando os cards. Se uma timeline visual (linha + marcadores) for desejada na implementação Angular, é uma decisão de UI nova, não uma reprodução do Figma.
- **Estados:** não aplicável (itens não são interativos no Figma).

### 8.7 Card de depoimento (Testimonials, `316:510`)

3 cards confirmados (Column `316:519`, `316:525`, `316:531`), mesma estrutura, dispostos lado a lado (não empilhados).

- **Dimensão:** ~373px de largura cada (3 colunas dividindo 1216px com `gap` implícito da distribuição), altura auto (varia com o tamanho do depoimento: 428px nos dois primeiros, mais alto no terceiro por ter texto mais longo).
- **Border-radius:** 12px.
- **Sombra:** `--shadow-md`.
- **Cor de fundo:** `--color-gray-default` (branco).
- **Padding interno:** 48px nas 4 bordas (`--space-card-padding`), confirmando o valor já registrado na seção 2.
- **Estrutura (`gap: 24px` entre blocos):** avatar circular 64×64 (fundo sólido cinza `#9ca3af` — cor de preenchimento direta, **não corresponde a nenhum token cinza da seção 3**, provável placeholder do template — com um ícone de usuário genérico 40×40 dentro, `padding: 20px`) → texto do depoimento em `Body2/Normal` (16px/24px, `--color-gray-600`) → bloco "Customer Details" (`gap: 4px`): nome em `Subtitle/Semi Bold` (20px/28px, `--color-gray-900`) + cargo/empresa em `Body3/Normal` (14px/20px, `--color-gray-600`).
- **Nota:** confirma o que já constava na seção 6 — Testimonials não usa foto raster, o avatar é um círculo de cor sólida com ícone SVG genérico dentro.
- **Estados:** não aplicável (cards não são interativos no Figma).

## 9. Regras de sizing e resize de componentes

> Verificação pontual (06/09/2026), motivada por checagem preventiva antes da Fase 2 — não é extração de componente novo, é uma checagem de um tipo de dado específico sobre os componentes já documentados na seção 8 (Icon Button, Tag, card de projeto).

### 9.1 Variáveis de tamanho nomeadas

**Não existem.** Confirmado via `get_variable_defs` em 2 amostras adicionais (Header `316:588`, card de projeto do Work `316:423`) — mesmo padrão já registrado na seção 2 para espaçamento: os únicos tipos de variável do arquivo são cor (`Gray/*`), tipografia (`Heading/Body/Subtitle*`) e efeito (`Drop Shadow/*`). Nenhuma variável do tipo `Size/*`, `Width/*`, `Icon Size/*` ou equivalente apareceu em nenhuma amostra (nem nas 4 originais da seção 2, nem nestas 2 novas). Confirma que, assim como o espaçamento, os **tamanhos de componente são valores fixos "soltos"** (px hardcoded no próprio frame/Auto Layout), sem token de sizing reutilizável por trás.

### 9.2 Comportamento de resize do Auto Layout (hug / fill / fixed)

Ao contrário do sizing nomeado (ausente), o **modo de resize do Auto Layout está presente e é consistente** — aparece implicitamente no código gerado pelo `get_design_context` (ausência de classe de largura/altura fixa = hug contents; `flex-[1_0_0]`/`self-stretch` = fill container; classe `size-[Npx]`/`h-[Npx]` explícita = fixo):

| Componente | Eixo | Comportamento | Evidência |
| --- | --- | --- | --- |
| Icon Button (ambas variantes, 36×36 e 44×44) | Horizontal e vertical | **Hug contents** — a caixa não tem `width`/`height` fixos; o tamanho final é resultado de `padding: 6px` (fixo) + tamanho do ícone interno (24px ou 32px) | `317:734` (instância Hero): classe gerada é só `p-[6px] ... rounded-[8px]`, sem `size-[Npx]` |
| Tag | Horizontal e vertical | **Hug contents** — largura ajustada ao texto, altura = `padding-y 4px`×2 + `line-height 20px` (28px). Já descrito como "auto" na seção 8.4; aqui confirmado formalmente como modo hug | `325:214` |
| Card de projeto — colunas internas (imagem / texto) | Horizontal | **Fill container** (`flex-[1_0_0]`) — cada coluna ocupa metade do card, dividindo o espaço disponível igualmente | `316:423`, colunas `316:424`/`316:426` |
| Card de projeto — colunas internas | Vertical | **Fill container** (`self-stretch`) — a altura da coluna acompanha a altura do card (fixa em 480px, seção 8.5) | idem |
| Card de projeto — imagem (`Picture`) | Horizontal | **Fill container** (`flex-[1_0_0]`) dentro da coluna da imagem | `316:425` |
| Card de projeto — imagem (`Picture`) | Vertical | **Fixo** — `h-[384px]` explícito, não acompanha a altura da coluna | `316:425` |
| Card de projeto — card inteiro (`Row`) | Horizontal e vertical | **Fixo** no nível mais externo — 1152×480 (seção 8.5); é o "topo" da árvore de Auto Layout dessa amostra, dimensionado pelo layout da seção Work, não hug nem fill | `316:423` |

**Leitura para a Fase 2:** padrão esperado de Auto Layout bem construído — elementos "atômicos" (botão de ícone, tag) usam **hug** nos dois eixos (equivalente a `width/height: fit-content` em CSS), enquanto elementos de layout (colunas de um card) usam **fill** (equivalente a `flex: 1 1 0%`). É reaproveitável na implementação Angular como comportamento de resize, mas **não é uma constraint de redimensionamento com limites**: não há `min-width`/`max-width`/`min-height`/`max-height` configurados em nenhum nó inspecionado (nem aqui, nem nos já cobertos na seção 8) — o Figma define só o modo (hug/fill/fixed) no tamanho atual, não até onde o componente pode crescer/encolher.

### 9.3 Prop de tamanho enumerável (Icon Button)

**Não é possível enumerar formalmente os valores aceitos pela prop `size` do Icon Button** (nem `state`/`themeMode`) além do que já estava registrado na seção 8.3. Confirmado nesta rodada de duas formas adicionais:

1. `get_design_context` numa segunda instância (`317:734`, Hero) devolve exatamente a mesma assinatura já vista no Header — `size?: "md"; state?: "Default"; themeMode?: "Light"` — porque essa tool reflete os valores da **instância específica**, não a lista completa de variantes do componente principal.
2. As tools que enumerariam a definição do componente principal (`get_context_for_code_connect`, `list_file_components_for_code_connect`) continuam bloqueadas pela mesma restrição de plano já registrada na seção 8.3 (exige seat Dev/Full em plano Organization/Enterprise). Confirmado também, via `get_metadata` no nível do arquivo, que o arquivo tem **uma única página** (`327:868`, nomeada "Thumbnail" — contém todos os frames Home/Light/Dark da seção 1): não existe página separada de "Components"/biblioteca onde variantes do Icon Button (`size="sm"`? `state="Hover"`?) apareçam como frames estáticos navegáveis manualmente. Não é limitação de esforço de busca; é estrutural, dado o plano e a organização do arquivo.

**Conclusão:** a prop `size` do Icon Button existe e é nomeada (não é freeform), mas o único valor confirmado continua sendo `"md"` — outros valores possíveis (se existirem) não são descobríveis com as ferramentas/permissões disponíveis. Mantém-se a orientação já registrada na seção 8.3: tratar `sm`/`lg` (se a Fase 2 quiser variantes de tamanho do botão de ícone) como decisão de implementação, não como extração do Figma.

### 9.4 Síntese — por que isso importa para a Fase 2

**Não existe regra formal de sizing** do tipo "escala nomeada" no Figma (nem variável, nem prop enumerável) — mesmo resultado já visto para espaçamento (seção 2). O único dado formal e reaproveitável encontrado foi o **modo de resize do Auto Layout** (9.2: hug vs. fill), consistente entre os componentes amostrados e diretamente mapeável para `width/height: fit-content` vs. `flex: 1` em CSS. Fora isso, os tamanhos de componente da seção 8 (36×36/44×44 do Icon Button, 1152×480 do card, 896px do item de timeline etc.) continuam sendo **valores fixos hardcoded no Figma**, sem sistema de sizing por trás. Para a Fase 2, isso significa que os componentes Angular precisarão definir sua própria lógica de resize responsivo entre os breakpoints já documentados (seção 2: mobile 375px / tablet ~768–1023px convencionado / desktop 1440px) — por exemplo, via `clamp()`, `min-width`/`max-width` ou breakpoints de mídia — já que o Figma não fornece constraints de redimensionamento reaproveitáveis nem uma escala de tamanho nomeada para servir de base.

## Log de evolução

- **06/09/2026** — Espaçamento (seção 2): verificado via `get_variable_defs` em 4 frames de seção (Hero `316:194`, About `316:229`, Skills `316:256`, Work `316:415`) que o Figma **não tem variáveis de espaçamento nomeadas** — só cor/tipografia/efeito são tokens formais. Extraído via `get_design_context` o padding/gap real das mesmas 4 seções: padding de seção consistente em **80px horizontal / 96px vertical** nas 4 amostradas, e uma tabela de gaps/paddings internos observados (4 a 96px). Substitui a nota genérica anterior ("múltiplos de 8px") por dados medidos — a hipótese de base 8 estrita não se confirmou (6px e 10px aparecem no arquivo).
- **06/09/2026** — Extração de assets (ícones): 24 ícones exportados do Figma via `download_assets` em lotes manuais (Skills, depois Hero/Contact me/Footer), salvos em `src/assets/icons/`. Ver seção 6 para a lista completa e a seção 7 para a pendência restante (ícone do Header).
- **06/09/2026** — Verificação de tipografia: conferido via `get_design_context` em Hero (`316:194`), About (`316:229`) e Experience (`316:357`) que a tipografia usa exclusivamente a família **Inter** (Google Font padrão), sem fonte customizada embutida. Nenhum arquivo de fonte precisa ser exportado — ver nota na seção 4.
- **06/09/2026** — Extração de assets (imagens): 3 imagens raster mapeadas em lotes por seção (Hero, About, Work, Testimonials) e baixadas via `download_assets` — avatar do Hero, foto do About e thumbnail de projeto do Work (reusado nos 3 cards). Salvas em `src/assets/images/`. Testimonials não tinha foto raster (avatar ali é ícone SVG genérico). Ver seção 6.
- **06/09/2026** — Espaçamento (seção 2), cobertura completa das 9 seções: extraído via `get_design_context` o padding/gap real das 5 seções que faltavam (Header `316:588`, Experience `316:357`, Testimonials `316:510`, Contact me `316:537`, Footer `316:579`), completando a amostra anterior (Hero, About, Skills, Work). Confirmado que o padrão **80px horizontal / 96px vertical** se mantém em Experience, Testimonials e Contact me (7 das 9 seções agora no mesmo padrão). Header e Footer confirmam a exceção esperada por terem altura fixa de 68px: padding vertical medido em **16px (Header)** e **24px (Footer)** — valores distintos entre si, ambos mantendo os 80px horizontais. Confirmado também, via `get_metadata` no frame `316:177`, que a margem entre as 9 seções é **0** (posições `y` batem exatamente, sem gap). Nenhum valor de pixel novo apareceu além dos já catalogados na amostra original — só novos usos dos mesmos valores (ver tabela "Espaçamento observado"). Seção 2 agora cobre as 9 seções do template; nenhuma pendência de padding de seção restante.
- **06/09/2026** — Artefato de tokens CSS: gerado `docs/design-tokens.css` (novo arquivo) traduzindo mecanicamente cor (seção 3, light/dark via `[data-theme="dark"]`), tipografia (seção 4, um grupo de variáveis `--font-<token>-*` por estilo) e sombra (seção 5) para CSS custom properties, mais uma escala de espaçamento derivada (`--space-4` … `--space-96`, nomeada pelo próprio valor em px) a partir da tabela "Espaçamento observado" da seção 2 — nenhum token formal de espaçamento existe no Figma, então essa escala é uma convenção documentada no cabeçalho do próprio arquivo, não um dado extraído. Durante a montagem dos tokens de tipografia, verificado via `get_design_context` (Hero `316:203`, estilo nomeado "Heading/H1/Bold - Desktop") que a unidade do letter-spacing da seção 4 é **porcentagem do tamanho da fonte**, não pixels (`-2` = `-2%`) — nota adicionada na seção 4 e valores convertidos para `em` no CSS. Referência ao artefato adicionada como nova subseção "Artefato de tokens CSS" logo após a seção 2.
- **06/09/2026** — Especificações de componentes individuais (nova seção 8): extraído via `get_design_context` (e `get_metadata` prévio para localizar node IDs) o Header (`316:588`), Footer (`316:579`), Icon Button (2 variantes de tamanho — 36×36 e 44×44 —, instâncias no Header/Hero/Work/Contact me), Tag (`325:214`, mesmo componente em 6 seções), os 3 cards de projeto do Work (`316:423`, `327:277`, `327:310`), os 3 itens de timeline da Experience (`316:365`, `316:378`, `316:405`) e os 3 cards de depoimento da Testimonials (`316:519`, `316:525`, `316:531`). Cada um documentado com dimensão, border-radius, cor (referenciando seção 3), tipografia (referenciando seção 4) e padding (referenciando seção 2). Duas limitações registradas explicitamente (não adivinhadas): (1) o comportamento sticky/scroll do Header não pôde ser confirmado — só uma borda transparente sugestiva, sem frame de estado "rolado"; (2) as variantes `Hover`/`Active` do componente Icon Button não puderam ser enumeradas (Code Connect indisponível no plano do arquivo; nenhum frame estático com esse `state` foi encontrado) — só a variante `Default` está documentada. Confirmado também que a timeline da Experience **não tem** conector visual (linha/marcador) — são cards empilhados com gap de 48px, verificado via `get_screenshot`. Pendência da seção 7 sobre especificações de componentes marcada como concluída, com a ressalva do Icon Button registrada no próprio item.
- **06/09/2026** — Sync de pendências (seção 7), sem extração nova de conteúdo visual: (1) a pendência "decidir dark mode/menu mobile" estava desatualizada — a decisão ("ambos entram no escopo") já constava em `docs/PLANO-MIGRACAO-ANGULAR.md` desde uma atualização anterior (seção "2. Decisões arquiteturais já tomadas" e "8. Log de evolução deste plano", 06/09/2026, "Johnny confirmou"); Johnny reconfirmou agora, e o item foi marcado como resolvido aqui, só referenciando o plano (nenhuma decisão nova tomada neste documento). (2) Reconfirmada, via `get_screenshot` nos grupos `328:4104` (Light) e `328:4105` (Dark) já documentados na seção 1, a ausência de qualquer frame/breakpoint de tablet no Figma — só as duas larguras já conhecidas (Desktop 1440 / Mobile iPhone 8 375) existem, em ambos os temas. Johnny decidiu que **tablet entra no escopo** mesmo assim; como não há dado extraível do Figma para essa faixa, documentada na seção 7 uma **convenção de engenharia proposta** (não uma extração): breakpoint ~768–1023px / desktop a partir de 1024px (padrão de mercado, ex. Tailwind `md`/`lg`), com o layout intermediário explicitamente marcado como algo a desenhar na Fase 2 (não copiável do Figma), a partir dos paddings/gaps da seção 2 — identificada de passagem uma lacuna: a seção 2 não tem um padding lateral de mobile medido para servir de segunda ponta dessa interpolação; não extraído nesta rodada para não estender o escopo desta atualização.
- **06/09/2026** — Padding de seção mobile (seção 2), resolvendo a lacuna registrada na entrada anterior: localizados via `get_metadata` no frame `327:417` (Home / Mobile (iPhone 8) / Light, seção 1) os node IDs mobile da mesma amostra usada no desktop — Hero (`327:419`), About (`327:442`), Skills (`327:468`) e Work (`327:638`). Extraído via `get_design_context` (Hero e Skills confirmados diretamente pela classe gerada `px-[16px] py-[64px]`; About e Work cross-validados por geometria via `get_metadata`, mesmo padrão `x=16`/`y=64` simétrico) o padding de seção no mobile: **16px horizontal / 64px vertical** nas 4 seções amostradas — nova tabela "Padding de seção — Mobile" adicionada logo após a tabela do desktop na seção 2. Com isso, as duas pontas da interpolação de tablet mencionadas na pendência da seção 7 (desktop 80px/96px, mobile 16px/64px) estão confirmadas; a nota da seção 7 foi atualizada para refletir isso, mantendo a ressalva de que o breakpoint e o layout de tablet em si continuam sendo convenção proposta, não extração (o Figma não tem frame nessa largura).
- **06/09/2026** — Checagem de regras de sizing/resize de componentes (nova seção 9), por "desencargo" antes da Fase 2: (1) confirmado via `get_variable_defs` em 2 amostras novas (Header `316:588`, card do Work `316:423`) que o arquivo **não tem variáveis de tamanho nomeadas** (nada tipo `Size/*`/`Width/*`) — mesmo padrão já visto para espaçamento na seção 2. (2) Extraído via `get_design_context` o **modo de resize do Auto Layout** (hug contents / fill container / fixo) do Icon Button (`317:734`), Tag (`325:214`) e do card de projeto do Work (`316:423`): Icon Button e Tag usam hug contents nos dois eixos; as colunas internas do card usam fill container; a imagem do card (`Picture`) usa fill horizontal + altura fixa (384px); o card inteiro é fixo (1152×480). Nenhum `min-width`/`max-width`/`min-height`/`max-height` encontrado em nenhum nó. (3) Confirmado que **não é possível enumerar os valores da prop `size` do Icon Button** além de `"md"` (já registrado na seção 8.3) — `get_context_for_code_connect` e `list_file_components_for_code_connect` continuam bloqueados por permissão de plano (mesmo erro já visto), e `get_metadata` no nível do arquivo confirmou que há **uma única página** (`327:868`, "Thumbnail"), sem página de biblioteca/componentes separada para inspecionar variantes manualmente — limitação estrutural, não de esforço de busca. **Resultado geral:** nenhuma regra formal de sizing existe (mesmo veredito já dado ao espaçamento); o único dado reaproveitável é o modo hug/fill do Auto Layout (mapeável para `fit-content`/`flex: 1` em CSS) — os tamanhos em si continuam sendo valores fixos hardcoded, então a Fase 2 precisará definir a própria lógica de resize responsivo (`clamp()`, `min-width`/`max-width`) para os breakpoints da seção 2.
