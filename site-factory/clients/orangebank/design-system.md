# Design system: Orange Bank

Fonte de verdade visual: Figma `7Faf4YNyYpe5fh0d3uWGD4` (OrangeBank). Este documento evita reconectar ao Figma a cada dúvida. Extraído via API REST (`figma-map.mjs`); nenhum valor aqui foi inventado.

## Escopo e variantes

- Variante no escopo: **`desktop-light`** (página `・ Desktop` 551:428, frame `landing page` 844:957, 1440 x 6247).
- **Não existe versão mobile, tablet nem dark no Figma.** O único frame de celular (`iphone`, 513:2088, página `・ Components`) é um mockup de aparelho usado como imagem na seção "Sobre nós", não uma variante do site. O favicon (`favicon-512`) também não é variante.
- **O responsivo (mobile e tablet) fica por conta do `builder`**, derivado das medidas desktop abaixo; não há medidas mobile/tablet/dark para extrair. Tema escuro fora do escopo.
- `design.variants = ["desktop-light"]`.

## Estrutura de página (frame `landing page` 844:957, 1440 de largura)

Ordem visual (y de cima para baixo). A ordem das camadas no Figma é outra; o que vale é o y.

| # | Seção do spec | Layer no Figma | Node | Largura x altura | y |
|---|---|---|---|---|---|
| 1 | header | `header` (instância, sobreposta ao hero) | 551:430 | 1440 x 100 | 0 |
| 2 | hero | `primeira dobra` | 551:431 | 1440 x 800 (fundo 1440 x 810) | 0 |
| 3 | sobre-nos | `segunda dobra` | 551:466 | **1364** x 1080 | 800 |
| 4 | tecnologias-utilizadas | `terceira dobra` | 551:490 | **1364** x 240 | 1890 |
| 5 | vantagens-da-conta | `quarta dobra` | 551:557 | **1181** x 762 | 2104 |
| 6 | investimentos | `quinta dobra` | 551:606 | **1170** x 698 | 2839 |
| 7 | cartao-de-credito | `sexta dobra` | 551:634 | 1440 x 698 | 3537 |
| 8 | perguntas-frequentes | `setima dobra` | 551:683 | **1170** x 970 | 4235 |
| 9 | baixar-o-app | `oitava dobra` | 684:606 | **1170** x 528 | 5205 |
| 10 | footer | `footer` | 631:654 | 1440 x 520 | 5733 |

Soma: 100 sobreposto + 800 + 1080 + 240 + 762 + 698 + 698 + 970 + 528 + 520 (há folgas entre blocos; a altura total do frame é 6247).

### Larguras diferentes entre dobras (decisão para o builder)

As larguras 1364, 1181 e 1170 são **imprecisões de alinhamento do Figma** (frames soltos dentro de um canvas de 1440, não grid intencional). O conteúdo real tem só dois contêineres:

- **Contêiner largo 1200** (padding lateral 120 em 1440): header, hero, footer. Seção `sexta dobra` usa padding 120 também (conteúdo 1200).
- **Contêiner 1170** (alinhado ao conteúdo de `quinta`, `setima`, `oitava`, e FAQ): sobre-nos (grupo de conteúdo 1172), vantagens (conteúdo 1181 com texto em 470), investimentos, FAQ, CTA.
- Fundos de seção (terceira dobra #f3f3f3 em 1364; footer #d3410d em 1440; sexta dobra) devem ser **full-bleed (100% da viewport)**; só o conteúdo fica contido. Recomendação: contêiner centralizado de 1170 (conteúdo) e 1200 (header/hero/footer) com `max-width`, sem reproduzir 1364/1181 literalmente.
- Os x absolutos do Figma (ex.: conteúdo começando em x=98 e terminando em 1268) não são centralizados em 1440; ignorar e centralizar.

## Grid e espaçamento

- Sem grid de colunas definido. Espaçamento vertical padrão de seção: **padding 64 topo/base** (segunda, quarta, quinta, sexta, sétima e oitava dobras).
- Gaps recorrentes: 8, 16, 24, 40, 56 (lista de FAQ), 120/130 (colunas).
- Raios: 8 (botões, cards de vantagem), 13 (itens de FAQ), 18 (imagem CTA), 24 (fotos/blocos 570 x 570), 50 (pílula do hero).

## Cores (tema claro)

Guia de estilos `Cores` (614:352). **Atenção:** a paleta "Orange" do guia reaproveita rótulos "Neutro/100…" nas linhas (erro de rotulagem do template); as cores reais são as dos swatches. Nomes `orange/*` abaixo são sugestão do designer, não do Figma.

| Token sugerido | Hex | Origem |
|---|---|---|
| orange/700 | #D3410D | swatch 1 do guia; fundo do footer |
| orange/600 | #E95E2D | swatch 2; rótulo "Sobre Nós", elipse do hero |
| orange/500 | #FF823D | swatch 3; botão primário e cards de ícone |
| orange/400 | #FFA370 | swatch 4; borda do botão primário |
| orange/100 | #FFE5D6 | swatch 5 |
| neutro/branco | #FFFFFF | |
| neutro/05 | #F3F3F3 | fundo da faixa de tecnologias, texto do footer |
| neutro/10 | #E7E7E7 | borda de cards de vantagem |
| neutro/20 | #D4D4D4 | divisórias |
| neutro/50 | #95999C | botão "Carregar mais perguntas" |
| neutro/80 | #2C343A | pílula do hero (fundo) |
| neutro/90 | #1D232A | títulos |
| neutro/100 | #15191C | |

Cores usadas na landing e **fora do guia** (documentar como tokens extras ou usar direto): #445059 (corpo e descrições), #6A7680 (texto de FAQ fechado/oculto), #F5F5F7 (fundo dos blocos de foto e logotipo marca d'água), #FEF1EC e #F15A22 / #F15A24 (acentos de ícones/seta do FAQ), #AB3308 (linha divisória do footer), #E95E2D (linha secundária do footer), #D9D9D9 (borda FAQ), #1E1E1E (título do FAQ), header: fundo **#FA3524 a 24% de opacidade com BACKGROUND_BLUR** sobre o hero.
Sombras: ver abaixo.

## Tipografia

Família única: **Roboto** (Google Fonts). O guia usa Open Sans só nos rótulos da própria página de guia, não no site. Entrelinha "56 pt" nas fichas do guia é inconsistente; usar a entrelinha dos textos reais (coluna abaixo).

| Estilo (guia) | Peso | Tamanho / entrelinha real | Uso |
|---|---|---|---|
| Display do hero (fora do guia) | 800 | 64 / 77 | título do hero |
| H1 | 700 (ou 600) | 48 / 56 (guia) ; 48/56 no CTA | título do CTA "baixe o app" |
| H2 Título 1 | 700 (ou 600) | 40 / 48 | títulos de seção (vantagens, investimentos, cartão, FAQ, sobre nós) |
| H2 Título 2 | 700 (ou 600) | 28 / 33 | subtítulos "O que é conta digital?" |
| H3 Subtítulo | 600 | 20 / 24 | títulos de FAQ, "Tecnologias utilizadas", cabeçalhos do footer |
| H4 Descrição | 500 | 18 / 22 | descrições, botões, itens de vantagens, menu |
| H4 pequeno | 500 | 14 / 21 | |
| H5 Texto | 400 | 14 / 21 | corpo, links do footer, pílula do hero |
| H5 pequeno | 400 | 12 / 18 | copyright |
| Rótulos de ícone do hero | 500 | 16.43 / 18 | "Cartão sem anuidade" |

Letter-spacing 0 em tudo.

## Sombras

- Fotos e mockups (blocos 570 x 570): `0 24px 33px rgba(0,0,0,0.13)`.
- Card de vantagem: `0 4px 4px rgba(0,0,0,0.04)`.
- Item de FAQ: `0 3px 33px rgba(0,0,0,0.13)`.
- Card flutuante "invest": `0 8px 18px rgba(0,0,0,0.08)`.
- Cartão branco da seção de vantagens (card): `0 10.7px 24.2px rgba(203,204,196,0.40)`.
- Elipse do hero: blur de camada (LAYER_BLUR), #E95E2D, 344 x 344.

## Especificações por seção (desktop-light)

### header (551:430)
1440 x 100, padding 0/120, fundo #FA3524 @24% com blur de fundo, sobreposto ao topo do hero. Linha interna 1200 x 60 (y=20), gap 40: logo `logo_orangebank` 200 x 49 (vetor branco), menu (gap 32) e botão. Itens do menu: ver textos. Botão primário 260 x 60, fundo #FF823D, borda 1 #FFA370, raio 8, texto branco Roboto 500 18 + seta (linha 21 px).

### hero (551:431)
1440 x 800. Fundo: imagem `img-hero-section 1` 1440 x 810 (também em 1920 x 1080 na página Components, 1071:488) + elipse laranja desfocada. Conteúdo no contêiner 1200, centrado vertical (topo da pílula em y=154), gap 16. Pílula: 272 x 37, fundo #2C343A, raio 50, padding 8/18, ícone `hand` 20 + texto 14. Título 640 de largura, 64/77 peso 800 branco. Botões: primário 260 x 60 e secundário "Saiba mais" 180 x 60 (borda 1.5 #F3F3F3, raio 8, texto branco), gap 15. Linha de ícones 355 x 60 (gap 40): dois `icon-card` (ícone 60 x 60 + texto 16.43/18).
Texto escondido no hero (`hidden`, 1021:682): **não usar** (ver abaixo).

### sobre-nos (551:466)
Largura 1364, padding 64 topo/base, gap 24. Cabeçalho centralizado: ícone `hand-two` 52 x 52, rótulo "Sobre Nós" (500 18, #E95E2D); título 40/48 centralizado, 2 linhas; subtítulo 18/22 #445059 centralizado. Abaixo, bloco de 1172 x ~550 com logotipo marca d'água (#F5F5F7, 1146 x 183) atrás e três colunas: texto esquerdo (311 de largura), **mockup de dois iPhones** (`iphone` 531 x 550; frames 570 x 565 e 518 x 645, sombra 0 24 33) e texto direito (311). Título 28/33 peso 600, descrição 14/21.

### tecnologias-utilizadas (551:490)
Largura 1364 x 240, fundo #F3F3F3, full-bleed. Título 20/24 peso 600 #445059 centralizado, gap 24 até a fileira de logos. Fileira `empresa` (gap 51, padding 10 vertical): 9 logos de ~71 px (html5, css3, javascript, typescript, react, java, spring, sql, mongodb, aws), em ordem. Logos são vetores multicolorido (exportar como SVG).

### vantagens-da-conta (551:557)
Conteúdo 1181 x 762, padding 64, duas colunas. Esquerda: foto 570 x 570 (raio 24, fundo #F5F5F7, sombra) com recorte de pessoa + `card` branco 215 x 107 sobreposto (raio 8, `people-card`) a x=563 (gap -100 entre foto e card). Direita (470 de largura): título 40/48 2 linhas; lista de 3 itens (gap 33), cada item 470 x 113: fundo branco, borda 1 #E7E7E7, raio 8, padding 16, gap 14, ícone 57 x 57 em quadrado #FF823D (raio 6, padding 14) + texto 18/22 #445059; botão primário 260 x 60 "Vem ser Orange".

### investimentos (551:606)
Conteúdo 1170 x 698, padding 64. Esquerda 529: título 40/48, parágrafo 18/22 (2 parágrafos), botão primário. Direita 723: foto 570 x 570 (raio 24, sombra) com imagem 1155 x 571 vazando para a esquerda, e card flutuante "invest" 248 x 70 sobreposto. Gap -84 entre colunas (sobreposição).

### cartao-de-credito (551:634)
1440 x 698, padding 64/120, gap 130. Esquerda: foto 570 x 570 (raio 24) com imagem `close woman` 1030 x 602. Direita 470: título 40/48 (2 linhas), lista de 4 itens (gap 24; altura 56 a 65): fundo branco, borda 1 #E7E7E7, raio 8, padding 16, ícone 24 a 33 + texto 18/22.

### perguntas-frequentes (551:683)
Conteúdo 1170 x 970, padding 64. Título 40/48 centralizado (#1E1E1E). Lista de 6 itens (gap 16), componente accordion: 1170 x 96 fechado / 223 aberto (551:1385 / 551:1387, página Components), padding 33, gap 22, raio 13, borda 1 #D9D9D9, sombra 0 3 33 .13; título 20/24 peso 600 #1D232A; ícone + (fechado) / - (aberto) na cor #F15A24 à direita (18 x 18); resposta 14/21 #445059 (aberta). No desenho todos os 6 estão fechados. Gap 56 até o botão "Carregar mais perguntas" 250 x 60, borda 1 #95999C, raio 8, texto #95999C.

### baixar-o-app (684:606)
Conteúdo 1170 x 528, padding 64. Bloco com imagem de fundo `pagcartao 1` 1170 x 400 (raio 18) + overlay #D9D9D9 (`Rectangle 606`, provável máscara) e conteúdo com padding 0/80: coluna esquerda 470: logo 52 x 24, título 48/56 branco 700 (3 linhas), botões de loja 132 x 39 (App Store) e 134 x 40 (Google Play), gap 10; coluna direita 84 x 251 com ícone e forma decorativa (#FFA370). Gap 120 entre colunas.

### footer (631:654)
1440 x 520, fundo #D3410D, padding 64/120. Logotipo 1200 x 60. Linha de 5 colunas (gap 48): endereço/redes (350), Institucional, Soluções, Conduta (150 cada), Atendimento (208). Cabeçalhos 20/24 peso 600 #F3F3F3; links 14/21 400 #F3F3F3 (gap 11). Redes: 3 círculos 46 x 46 (instagram, facebook, youtube; gap 16). Linhas divisórias 1170 x 0.5 (#AB3308 e #E95E2D). Faixa inferior: "Abra sua conta" + 2 botões de loja 140 x 45 (fundo branco, raio 8), seletores "Português (Brasil)" e "São Paulo" (14/21), copyright 12/18 centralizado.

## Textos reais por seção (para o strategist)

Texto exato do Figma. Quebras de linha do Figma indicadas por `/` (são quebras visuais, não semânticas).

### header
- Menu: "Quem Somos", "Conta Digital PJ", "Cartão de crédito", "Fale Conosco" (a camada da segunda opção se chama "Con Digital"; o texto visível é "Conta Digital PJ").
- Botão: "Vem ser Orange".

### hero
- Pílula: "Abra sua conta, é só baixar o app!"
- Título: "Seu dinheiro, suas regras. Zero tarifas / e sem enrolação."
- Botões: "Vem ser Orange" e "Saiba mais".
- Ícones: "Cartão sem anuidade" e "Conta digital 100% grátis".
- **Texto escondido (hidden) no hero NÃO copiado**, conforme decisão do dono (existe no Figma como `hidden`, 1021:682, em fonte Inter, fora do padrão).

### sobre-nos
- Rótulo: "Sobre Nós"
- Título: "A conta digital Orange Bank é pelo app / e tem cartão de débito Mastercard"
- Subtítulo: "Somos um banco digital que oferece uma experiência sem / complicações para suas necessidades financeiras."
- Coluna 1, título: "O que é conta digital?"
- Coluna 1, descrição (literal do Figma, **tem repetição**): "As contas digitais também são alternativas / menos burocráticas. É possível abrir uma conta de onde estiver, pelo smartphone. / As contas digitais também são alternativas menos burocráticas. / É possível abrir uma conta de onde / estiver,  pelo smartphone."
- Coluna 2, título: "Como funciona uma Conta Digital?"
- Coluna 2, descrição (literal, **termina truncada em "operações"**): "No dia a dia, as contas digitais são bem parecidas com as contas tradicionais. Porém, nem todas possuem os mesmos recursos. Na conta digital, por exemplo, é possível realizar operações"

### tecnologias-utilizadas
- Título: "Tecnologias utilizadas"
- Logos (sem texto): html5, css3, javascript, typescript, react, java, spring, sql, mongodb, aws.

### vantagens-da-conta
- Título: "Conheça as vantagens / da nossa conta"
- 01: "Tudo o que você precisa para ter uma vida financeira global em um único app"
- 02: "Sua conta é assegurada por instituições financeiras, membros do FDIC, e seu saldo / está protegido em até $250,000."
- 03: "Até 10% de economia comparado a um / cartão de crédito tradicional."
- Botão: "Vem ser Orange".

### investimentos
- Título: "Na OrangeBank, / seu dinheiro vale mais!"
- Parágrafo 1: "Investimentos a partir de R$1, com uma experiência fácil e que fala a sua língua. Você e seu dinheiro merecem a tranquilidade de uma experiência segura."
- Parágrafo 2: "E o jeito Orange de investir conta não só com uma, mas com duas experiências diferentes para você investir sem se preocupar, do seu jeito."
- Botão: "Vem ser Orange". O card flutuante `invest` não tem texto (só vetores).

### cartao-de-credito
- Título: "O Banco com cartão / de crédito do seu time"
- Itens: "Cartão sem anuidade " (espaço final no Figma), "Aceito em compras internacionais", "Saque em toda rede Banco 24 Horas", "Acumule pontos no programa Mastercard".

### perguntas-frequentes
- Título: "Ficou com alguma dúvida?"
- Botão: "Carregar mais perguntas"
- Item 1, P: "O que é a Conta Digital?" R: "Uma conta digital é um serviço bancário que as instituições financeiras oferecem aos clientes e que permite que eles façam transações com seu dinheiro, como pagamentos, depósitos ou saques. Ao abrir uma conta digital, os clientes recebem acesso a vários recursos bancários, como cartão de débito e crédito. Ela pode ser acessada por meio de um site ou aplicativo da instituição financeira. Esse tipo de conta é muito popular, por ter tarifas mais baixas, ou até tarifa zero, além de ser muito prática para o dia a dia, permitindo ao cliente fazer transações bancárias em qualquer dia da semana e em qualquer horário, do dia ou da noite."
- Item 2, P: "Como abrir uma conta Orange Bank?" R: "A palavra-chave é comodidade. O processo de abertura de uma conta digital varia entre as instituições financeiras, mas a premissa de todas é a simplicidade. / Afinal, alguém quer perder tempo indo até uma agência de banco? / Para abrir uma, geralmente é preciso fazer um cadastro inicial –  pelo site ou pelo aplicativo, dependendo do banco ou instituição. Neste momento, costumam pedir o nome completo, o CPF e o email do titular da conta. Caso você tenha o nome negativado não se preocupe, pois mesmo quem tem o nome sujo pode abrir uma conta digital."
- Item 3, P: "Preciso pagar algo para abrir uma conta?" R: **lorem ipsum (placeholder do template)**
- Item 4, P: "Como colocar saldo na minha conta Orange Bank?" R: **lorem ipsum**
- Item 5, P: "Posso receber transferências na minha conta Orange Bank?" R: **lorem ipsum**
- Item 6, P: "Qual descrição aparecerá na fatura do cartão de crédito?" R: **lorem ipsum**
- Os itens 3 a 6 têm resposta em lorem ipsum no Figma: sem resposta real, o strategist deve decidir (pedir ao dono ou sinalizar como pendência); não publicar lorem ipsum.

### baixar-o-app
- Título: "Pra ter tudo isso, baixe o app e peça seu cartão!"
- Botões de loja: imagens (App Store e Google Play), sem texto.

### footer
- Endereço: "Orange Bank Tecnologia Ltda / Avenida Brigadeiro Faria Lima, n.º 949, Pinheiros, São Paulo/SP - CEP 05.426-200 / CNPJ: 17.895.646/0001-87" (texto literal; verificar se é dado real do cliente ou de template)
- Redes: Instagram, Facebook, YouTube (ícones).
- Institucional: "Quem somos", "O que oferecemos", "Ética e Compliance", "Carreiras".
- Soluções: "Conta Digital", "Cartão de Crédito", "**Investimo**" (**mantido como está por decisão do dono; provável erro de digitação de "Investimentos"**).
- Conduta: "Segurança", "Diversidade e inclusão", "Sustentabilidade", "Acessibilidade", "Termos".
- Atendimento: "Central de ajuda", "Canais de atendimento", "Ouvidoria".
- Faixa inferior: "Abra sua conta" (botões de loja), "Português (Brasil)", "São Paulo".
- Copyright: "© 2024 Orange Bank Tecnologia Ltda. Todos os direitos reservados."

## Avisos sobre os textos (para strategist e dono)

1. "Investimo" no footer: mantido, provável erro de "Investimentos".
2. FAQ itens 3 a 6 com resposta em lorem ipsum.
3. "Sobre nós": descrição da coluna 1 repete frases; a da coluna 2 termina em "realizar operações" (truncada).
4. Vantagens 02: menciona FDIC e "$250,000" (referência a banco dos EUA, em dólar; incoerente com banco brasileiro com CNPJ). Manter como está, mas sinalizar.
5. Menu: "Conta Digital PJ" (a camada do Figma se chama "Con Digital"), sem equivalente claro nas seções.
6. "Tecnologias utilizadas" é uma lista de logos de linguagens/serviços (HTML5, CSS3, etc.): conteúdo provavelmente de template; sinalizar ao dono se deve ir ao site de um banco.
7. Nome da marca grafado "Orange Bank" e "OrangeBank" (investimentos); manter como está.
8. Texto escondido do hero não usado.

## Assets (a exportar)

Nenhum asset foi exportado: o fluxo desta etapa usa só a API REST (`figma-map.mjs`), que não exporta imagens/SVG de nós; o `projectDir` (`site-factory/sandbox/orangebank`) também ainda não existe. Lista para exportar depois em `<projectDir>/public/assets/<categoria>/`:

| Asset | Node | Categoria | Formato |
|---|---|---|---|
| Fundo do hero `img-hero-section 1` | 1071:484 (Components 1071:488) | images | PNG/JPG |
| Segunda variação do hero `img-hero-section-2 1` | 1071:486 (não usada no frame da landing) | images | referência |
| Logo `logo_orangebank` (branco) | I551:430;970:661 | logos | SVG |
| Logotipo marca d'água (sobre nós) | 551:477 | images | SVG |
| Mockup iPhone (sobre nós) | 551:484 | images | PNG/SVG |
| Foto moça + recorte | 551:561, 1081:471 | images | PNG |
| `people-card 1` | 551:567 | images | PNG |
| Foto investimentos | 551:614 | images | PNG |
| Card flutuante invest | 551:619 | images | SVG |
| Foto cartão `close woman` | 551:637 | images | PNG |
| Fundo CTA `pagcartao 1` | 684:604 | images | PNG |
| `image 1` (CTA) | 640:816 | images | PNG |
| Selo App Store | 631:535 | images | PNG |
| Selo Google Play | 631:536 | images | SVG |
| Ícones: hand, hand-two, icon-anuidade, device, shield, automatizado, redes sociais | vários (ver árvore) | icons | SVG |
| Logos de tecnologias (10) | 551:495 a 551:554 | logos/tech | SVG |
| Favicon | 293:422 (`favicon-512`) | favicon | PNG/SVG |

Regra: ícones isolados, nunca a instância do botão que os contém.

## Pendências

- [ ] Exportar assets acima (precisa de export por MCP/API de imagens, fora do escopo desta passada).
- [ ] Dono decidir respostas reais dos FAQs 3 a 6.
- [ ] Decidir o contêiner único (1170 vs 1200) no builder; responsivo mobile/tablet por conta do builder.
- [ ] Confirmar com o dono: "Investimo", FDIC/US$, endereço/CNPJ, logos de tecnologia.

## Log

- 2026-10-04: extração inicial (desktop-light apenas): estrutura, tokens, medidas, textos reais e avisos; spec atualizado com `figmaNode`, `figmaVariants`, `design.variants` e `contentRef`.
