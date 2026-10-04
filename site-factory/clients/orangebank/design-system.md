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
1440 x 520, fundo #D3410D, padding 64/120. Logotipo 1200 x 60. Linha de 5 colunas (gap 48): endereço/redes (350), Institucional, Soluções, Conduta (150 cada), Atendimento (208). Cabeçalhos 20/24 peso 600 #F3F3F3; links 14/21 400 #F3F3F3 (gap 11). Redes: 3 quadrados de raio 8, 45,6 x 45,6 (instagram, facebook, youtube; gap 16; `Rectangle 58/59/60` com `cornerRadius: 8`, não círculos). Linhas divisórias 1170 x 0.5 (#AB3308 e #E95E2D). Faixa inferior: "Abra sua conta" + 2 botões de loja 140 x 45 (fundo branco, raio 8), seletores "Português (Brasil)" e "São Paulo" (14/21), copyright 12/18 centralizado.

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

## Assets exportados

Exportados em 2026-10-04 com `figma-map.mjs assets` (API REST) a partir de `site-factory/clients/orangebank/assets.json`: 46 de 46, sem falhas. Destino: `site-factory/sandbox/orangebank/public/assets/<caminho>`. A coluna "Onde entra" é a tabela de troca dos marcadores tracejados.

| Asset | Caminho (em `public/assets/`) | Node | Onde entra | Notas |
|---|---|---|---|---|
| hero-fundo | images/hero-fundo.jpg | 1071:484 | Hero (primeira dobra) | Fundo da seção, 1440x810 (arquivo 3840x2160, 6,7 MB: otimizar no build) |
| logo-branco-header | logos/logo-branco-header.svg | I551:430;970:661 | Header | Logo `logo_orangebank` branco 200x49 |
| logo-branco-footer | logos/logo-branco-footer.svg | 631:769 | Footer (631:657) | Logo branco 200x32 |
| logotipo-marca-dagua | images/logotipo-marca-dagua.svg | 551:477 | Sobre nós | Marca d'água 1146x183 atrás do mockup |
| mockup-iphone | images/mockup-iphone.png | 551:484 | Sobre nós | Mockup do iPhone 531x550 entre os dois textos |
| foto-moca | images/foto-moca.jpg | 551:561 | Vantagens da conta | Foto 'medium-shot-woman-with-device' (1000x785), recortada no grupo 570x570. VERIFICAR LICENÇA (parece banco de imagem) |
| foto-moca-recorte | images/foto-moca-recorte.png | 1081:471 | Vantagens da conta | Recorte 'magnific...' 724x724 com transparência, sobre a foto. Gerada por IA/ferramenta: confirmar licença |
| people-card | images/people-card.png | 551:567 | Vantagens da conta | Imagem 177x75 dentro do card flutuante 215x107 |
| foto-investimentos | images/foto-investimentos.jpg | 551:614 | Investimentos | Foto 1155x571 no grupo 570x570. Confirmar licença |
| card-invest | images/card-invest.svg | 551:619 | Investimentos | Card flutuante 'invest' 248x70 (SVG inclui sombra, 284x106) |
| foto-cartao | images/foto-cartao.jpg | 551:637 | Cartão de crédito | Foto 'close woman' 1030x602 no grupo 570x570. Confirmar licença |
| fundo-cta | images/fundo-cta.jpg | 684:604 | Baixar o app (CTA) | Fundo 1170x400 (`pagcartao 1`) |
| cta-image-1 | images/cta-image-1.png | 640:816 | Baixar o app (CTA) | `image 1` 52x24 acima do título |
| selo-app-store | images/selo-app-store.png | 631:535 | Baixar o app (CTA) | Selo App Store 132x39 |
| selo-google-play | images/selo-google-play.svg | 631:536 | Baixar o app (CTA) | Selo Google Play 134x40 |
| selo-app-store-footer | images/selo-app-store-footer.svg | 648:1135 | Footer | Botão de loja 140x45 (instância 'social media', fundo branco, rx 8) |
| selo-google-play-footer | images/selo-google-play-footer.svg | 648:1138 | Footer | Botão de loja 140x45 (idem) |
| icon-hand | icons/icon-hand.svg | 1021:677 | Hero | Mãozinha do selo 'Abra sua conta...' 20x20 (SVG com imagem raster embutida 160x160) |
| icon-hand-two | icons/icon-hand-two.svg | 846:1072 | Sobre nós | Mãozinha do rótulo 'Sobre Nós' 52x52 (SVG com raster embutido) |
| icon-anuidade | icons/icon-anuidade.svg | 1050:495 | Hero | Ícone do primeiro icon-card 60x60 |
| icon-anuidade-2 | icons/icon-anuidade-2.svg | 1050:510 | Hero | Ícone do segundo icon-card 60x60 |
| icon-device | icons/icon-device.svg | 551:575 | Vantagens da conta | Item 01 (dentro do círculo 57x57) |
| icon-shield | icons/icon-shield.svg | 993:475 | Vantagens da conta | Item 02 (círculo 66x67) |
| icon-automatizado | icons/icon-automatizado.svg | 993:484 | Vantagens da conta | Item 03 (círculo 62x62) |
| icon-cartao-device | icons/icon-cartao-device.svg | 551:645 | Cartão de crédito | Item 01 da lista |
| icon-cartao-shield | icons/icon-cartao-shield.svg | 551:651 | Cartão de crédito | Item 02 da lista |
| icon-servers | icons/icon-servers.svg | 551:667 | Cartão de crédito | Item 03 da lista |
| icon-mastercard | icons/icon-mastercard.svg | 551:678 | Cartão de crédito | Item 04 da lista |
| icon-assine | icons/icon-assine.svg | 636:796 | Baixar o app (CTA) | Ícone 84x84 da coluna decorativa (a 'Union' 639:812 não foi exportada) |
| icon-faq-toggle | icons/icon-faq-toggle.svg | 551:1381 | Perguntas frequentes | '+' laranja #F15A24 18x18 (usar currentColor ou rotacionar para o '-') |
| icon-instagram | icons/icon-instagram.svg | 631:665 | Footer | Rede social (sem o quadrado 45,6 de fundo, Rectangle 58) |
| icon-facebook | icons/icon-facebook.svg | 631:671 | Footer | Rede social (idem) |
| icon-youtube | icons/icon-youtube.svg | 631:674 | Footer | Rede social (idem) |
| icon-globo | icons/icon-globo.svg | 631:762 | Footer | Seletor de idioma |
| icon-pin | icons/icon-pin.svg | 631:765 | Footer | Seletor de região |
| tech-html5 | logos/tech-html5.svg | 551:495 | Tecnologias utilizadas | Logo html5 |
| tech-css3 | logos/tech-css3.svg | 551:506 | Tecnologias utilizadas | Logo css3 |
| tech-javascript | logos/tech-javascript.svg | 551:513 | Tecnologias utilizadas | Logo javascript |
| tech-typescript | logos/tech-typescript.svg | 551:516 | Tecnologias utilizadas | Logo typescript |
| tech-react | logos/tech-react.svg | 551:519 | Tecnologias utilizadas | Logo react |
| tech-java | logos/tech-java.svg | 551:523 | Tecnologias utilizadas | Logo java |
| tech-spring | logos/tech-spring.svg | 551:529 | Tecnologias utilizadas | Logo spring |
| tech-sql | logos/tech-sql.svg | 551:531 | Tecnologias utilizadas | Logo sql |
| tech-mongodb | logos/tech-mongodb.svg | 551:537 | Tecnologias utilizadas | Logo mongodb |
| tech-aws | logos/tech-aws.svg | 551:554 | Tecnologias utilizadas | Logo aws |
| favicon-512 | favicon/favicon-512.png | 293:422 | index.html (favicon) | 512x512, texto 'ob' do frame `favicon-512` |

Observações:
- **Licença/stock:** `foto-moca` (nome do arquivo de origem `medium-shot-woman-with-device`), `foto-investimentos`, `foto-cartao` (`close woman`) e `foto-moca-recorte` (`magnific_...`) parecem banco de imagem ou saída de ferramenta externa. Foram exportadas porque o layout depende delas; a licença precisa ser confirmada pelo dono antes de publicar.
- `hero-fundo.jpg` (6,7 MB, 3840x2160) é a imagem original do Figma, não o recorte 2x: otimizar (largura ~2880, qualidade ~80, WebP/AVIF) no build.
- `icon-hand` e `icon-hand-two` são SVG com imagem raster embutida (160x160), não vetor real; funcionam com `<img>`, mas não herdam cor.
- Não exportados: `img-hero-section-2` (1071:486, não usada na landing), a 'Union' do CTA (639:812) e os ícones do mockup do iPhone (`card-icon`, já dentro do PNG do mockup).
- SVGs conferidos: todos começam no `<svg>` raiz com viewBox, sem `<?xml`, DOCTYPE, `<style>`, `<script>` nem artefatos de canvas; nenhum arquivo com 0 byte.

## Destaques de título

Decisão do dono D-1 (QA-12): parte do título de cada seção é laranja no Figma. Trechos obtidos do JSON do nó via API REST (`characterStyleOverrides` + `styleOverrideTable`); o restante do título usa a cor base (#1D232A, ou #1E1E1E no FAQ). Os frames de seção não têm fill próprio, então o fundo considerado é o branco da página (#FFFFFF). Cada título tem um único trecho colorido. Razão medida com `contrast.mjs <cor> #FFFFFF large` (mínimo 3:1 para texto grande: 40 px bold).

| Seção | Título completo | Trecho destacado | Cor | Razão sobre #FFFFFF | Node ID |
|---|---|---|---|---|---|
| sobre-nos | A conta digital Orange Bank é pelo app (quebra de linha) e tem cartão de débito Mastercard | "cartão de débito Mastercard" | #E95E2D | 3,44:1, passa em 3:1 (large) | 551:473 |
| vantagens-da-conta | Conheça as vantagens (quebra de linha) da nossa conta | "da nossa conta" | #E95E2D | 3,44:1, passa em 3:1 (large) | 551:569 |
| investimentos | Na OrangeBank, (quebra de linha) seu dinheiro vale mais! | "dinheiro vale mais!" | #E95E2D | 3,44:1, passa em 3:1 (large) | 551:608 |
| cartao-de-credito | O Banco com cartão (quebra de linha) de crédito do seu time | "crédito do seu time" | #E95E2D | 3,44:1, passa em 3:1 (large) | 551:640 |
| perguntas-frequentes | Ficou com alguma dúvida? | "alguma dúvida?" | #F15A24 (não #E95E2D) | 3,37:1, passa em 3:1 (large) | 551:686 |

Observações: (1) o FAQ usa #F15A24, o laranja "fora do guia", e não o orange/600; o builder deve respeitar essa diferença ou unificar por decisão do dono. (2) Passa só como texto grande: não reutilizar esse laranja em texto abaixo de 24 px ou 18,66 px bold (sobre branco, 3,44:1 reprova os 4,5:1 de texto normal). (3) Nos parágrafos de 551:609 (investimentos) e nos itens de 551:647, 551:663, 551:674 e 551:681 (cartão) existem overrides de estilo, mas sem cor (só diferem em peso ou tamanho, sem fill próprio); a cor continua #445059.

## Decisões e divergências intencionais

Decisões do dono e do pipeline que divergem do Figma ou o completam; o builder as segue mesmo quando o desenho diz outra coisa.

- **Contêineres:** 1200 (header, hero) e 1170 (demais dobras) em vez dos 1364 / 1181 / 1170 do Figma. A seção do cartão passou a usar 1170 por decisão do dono.
- **Cores de texto trocadas por contraste WCAG AA** (decisão do dono, a cor original reprova): botão primário, rótulo "Sobre Nós" e texto do footer. Valem as cores registradas no spec e no código, não as do Figma.
- **Escopo só desktop/light:** não há mobile, tablet nem dark no Figma; o responsivo é derivado das medidas desktop.
- **Conteúdo incompleto aprovado:** textos placeholder, FAQs 3 a 6 sem resposta real e demais lacunas listadas em "Avisos sobre os textos" foram aprovados pelo dono para esta entrega.
- **Botão "Baixar o app" no CTA:** rótulo definido pelo strategist (o Figma não tem rótulo de texto, apenas os botões de loja).
- **Título de "Sobre nós" quebra sozinho:** a quebra de linha do Figma não é forçada; o texto quebra naturalmente (decisão do dono).
- **"Carregar mais perguntas" só com 6 itens:** o botão é mantido apenas enquanto a lista tem os 6 itens do desenho.
- **Destaques de título** em laranja: ver seção acima (D-1).
- **Rodada 5 (2026-10-04), D-14:** mockup de Sobre nós com aparelhos de ~542 px (entre 531 da caixa e 554,1 da união; escolhido 542); imagem em 600 de largura.
- **Rodada 5, D-16/D-17:** glow do hero como o Figma (plus-lighter 69%, blur 100 em CSS) e `saturate(0.94)` no fundo; o glow clareia, então o contraste do texto branco venceu: gradiente escuro suave (`--gradient-scrim-hero`, `-hero-compact`, `--gradient-scrim-header`, `--gradient-scrim-cta`) por cima do glow e sob o texto. Alfas escolhidos pela medição de contraste (build-log).
- **Rodada 5, D-15:** foto do CTA: só `object-position` (`18% 0`); a foto já aparece inteira na vertical, então o corte do topo da cabeça é da própria foto e só o eixo x tem folga.
- **Rodada 5, D-18:** seta longa (`icons/seta-botao.svg`) como máscara CSS, cor = texto do botão (`currentColor`; o SVG é branco, mas branco sobre o laranja do botão primário reprovaria o contraste); gap de 10 entre rótulo e seta.

## Medidas da rodada 3 (D-6 a D-9)

Fonte: `figma-map.mjs layout` e `node` (API REST), sem MCP. Coordenadas em px, relativas ao nó indicado, valores exatos da API (arredondados a 0,1). Decisões do dono: D-6 títulos quebram antes do trecho destacado; D-7 item do FAQ 96 de altura e "+" laranja pleno; D-8 footer como o Figma; D-9 bloco do hero em y=154.

### 1. Footer (631:654), 1440 x 520, fundo #D3410D, relativo ao footer

Estrutura vertical (padding 64 topo, contêiner 1200 em x=120 a 1320), de cima para baixo:

| Bloco (node) | x | y | largura x altura | Observações |
|---|---|---|---|---|
| `info` (631:656) | 120 | 64 | 1200 x 260 | vertical, gap 0 entre logotipo e colunas (60 + 0 + 189 = 249; a caixa fixa tem 260) |
| `logotipo` (631:657) | 120 | 64 | 1200 x 60 | vetor 200 x 32 (631:769, #F3F3F3) alinhado embaixo da caixa: vetor em y=92 a 124. Topo visual do logotipo = y 92, não 64 |
| `Frame 37173` linha de colunas (631:659) | 120 | 124 | 1200 x 189 | horizontal, gap 48 |
| coluna endereço `atendimento` (631:660) | 120 | 124 | 350 x 189 | vertical, gap 18, centrada verticalmente (conteúdo = 84 + 18 + 46 = 148; começa em y=145 e termina em y=293) |
| endereço (631:661) | 120 | 145 (144,6) | 308 x 84 | 14/21, #F3F3F3, 4 linhas (Ltda / Avenida... / São Paulo... / CNPJ) |
| redes `Frame 44` (631:662) | 120 | 247 (246,6) | 169 x 46 (45,6) | horizontal, gap 16; 3 quadrados de raio 8 (45,6 x 45,6) em x=120 / 181,6 / 243,2, fundo #F3F3F3, ícone 20 x 20 (cor #15191C) centrado (x+12,8, y+12,8) |
| coluna Institucional (631:675) | 518 | 124 | 150 x 189 | cabeçalho 24 de altura (20/24 600) em y=124; links começam em y=164 (gap 16 após o cabeçalho), 21 de altura cada, gap 11 (passo 32): y=164, 196, 228, 260 |
| coluna Soluções (631:683) | 716 | 124 | 150 x 189 | links y=164, 196, 228 |
| coluna Conduta (631:691) | 914 | 124 | 150 x 189 | links y=164, 196, 228, 260, 292 |
| coluna Atendimento (631:699) | 1112 | 124 | 208 x 125 | links y=164, 196, 228 |
| `bt download` (631:705) | 120 | 324 | 1200 x 132 | vertical, gap 30 entre a faixa (79) e o copyright; 324 = fim da linha de colunas (313) + 11 de folga (a caixa `info` termina em 324) |
| `Frame 37177` faixa (631:706) | 120 | 324 | 1200 x 79 | horizontal; esquerda `aplicativo` (grow, 920 x 79), direita `Frame 7` 280 x 47 |
| "Abra sua conta" (631:708) | 120 | 324 | 135 x 24 | Roboto 600 20/24 #F3F3F3, na coluna esquerda; fica ACIMA dos selos |
| `Frame 37181` selos (648:1116) | 120 | 358 | 148 x 45 (conteúdo 290 de largura) | gap 10 abaixo do rótulo; dois botões de loja 140 x 45 (fundo #FFFFFF, raio 8) em x=120 (648:1135) e x=270 (648:1138), gap 10 |
| `Frame 7` seletores (631:760) | 1040 | 324 | 280 x 47 | horizontal, gap 32, alinhado ao topo da faixa; conteúdo alinhado à direita (termina em x=1307, padding direito efetivo 13) |
| seletor idioma `Frame 30` (631:761) | 1053 | 337 | 136 x 21 | ícone globo 15 x 15 em x=1053 y=340; texto "Português (Brasil)" 14/21 em x=1076 (gap 8) |
| seletor cidade `Frame 31` (631:764) | 1221 | 337 | 86 x 21 | ícone pin 15 x 16,8 em x=1221 y=339; texto "São Paulo" em x=1244 |
| copyright (631:767) | 120 | 433 | 1200 x 18 | 12/18 centralizado, cor #FFFFFF; 30 abaixo da faixa (403 + 30) |
| rodapé do footer | | 451 a 520 | | 69 de respiro embaixo (altura total fixa 520) |

Linhas divisórias (filhas diretas do footer, fora do auto-layout): `Line 3` (686:495) #AB3308 e `Line 2` (631:768) #E95E2D, ambas x=135, largura 1170, espessura 0,5, em y=352,5 e y=354. Elas ficam entre o rótulo "Abra sua conta" (termina em y=348) e os selos (começam em y=358), e CRUZAM a faixa dos seletores (y=337 a 358; o filete passa sobre o texto dos seletores no desenho). Na imagem de referência o filete é quase invisível (contraste 1,35 a 1,41:1, decorativo). Recomendação ao builder: reproduzir o filete em y=353 de x=135 a 1305 e manter os seletores alinhados à direita acima dele sem sobrepor o texto (o cruzamento é um acidente do desenho, o dono decide; sem decisão, reproduzir como está).

Larguras resumidas: colunas em x=518 / 716 / 914 / 1112 (larguras 150 / 150 / 150 / 208, gap 48; a coluna do endereço tem 350 e vai de x=120 a 470). Cabeçalhos das colunas começam em y=124; título "Abra sua conta" em y=324; selos em y=358 a 403; seletores em y=337 a 358.

Cor: #F3F3F3 sobre #D3410D = 4,18:1 reprova 4,5:1 (texto normal); #FFFFFF = 4,63:1 passa. Esse é o motivo da troca de cor de texto do footer já decidida (vale a cor do spec/código). Ícones das redes #15191C sobre #F3F3F3 = 15,93:1.

### 2. Item do FAQ (551:1595 etc., componente 551:1385 fechado), 1170 x 96

- Altura fechada: **96** = padding 33 + caixa de título 30 + padding 33. O `gap` 22 (itemSpacing) só existe quando a resposta está aberta (bloco `texto` 551:1382 oculto no fechado; aberto = 223). Os 4 px a mais do Figma sobre 92 vêm da caixa do título, que tem 30 de altura (a linha do texto é 24, a caixa 30), não de padding diferente.
- Auto-layout vertical, padding 33 nos quatro lados, fundo #FFFFFF, raio 13, borda 1 #D9D9D9 (inside), sombra 0 3 33 rgba(0,0,0,.13). Itens da lista: x=0, y=144 / 256 / 368 / 480 / 592 / 704 (passo 112 = 96 + 16).
- Título (551:1380): Roboto 600 20/24 #1D232A, caixa 1086 x 30 em x=33, y=177 (33 do topo do item). Linha do título (`titulo` 551:1379): 1104 x 30, `space-between`, alinhada ao centro vertical.
- Ícone "+" (551:1381): vetor 18 x 18, preenchimento sólido **#F15A24**, opacidade 100% (sem opacidade, sem override de fill; o aberto troca para "-"), em x=1119 (1170 - 33 - 18 = 1119, ou seja, encostado no padding direito) e y=183 no frame da seção, que é 39 do topo do item (centrado verticalmente na caixa do título: 33 + (30 - 18) / 2 = 39).
- Contraste do "+": `contrast.mjs #F15A24 #FFFFFF ui` = **3,37:1, passa em 3:1 (ui)**. Como texto reprovaria (4,5:1), mas é gráfico de componente, então vale 3:1. No Figma não há opacidade nem cor mais clara: usar #F15A24 pleno.
- Lista (551:683): título da seção em y=64, gap 30 até a lista (y=144), gap entre itens 16, gap 56 entre a lista (termina em y=800) e o botão "Carregar mais perguntas" (460,856 a 250 x 60).

### 3. Hero (551:431), 1440 x 800, relativo ao hero

O contêiner `Frame 27005` (1021:674) é 1200 x 800 (x=120), vertical, gap 16, **centrado verticalmente**: conteúdo total = 37 + 16 + 439,3 = 492,3, topo = (800 - 492,3) / 2 = 153,9. Por isso o bloco começa em y=154 (D-9) e termina em y=646; o header (100 de altura) fica sobreposto ao hero e não empurra o conteúdo.

| Bloco (node) | x | y | largura x altura |
|---|---|---|---|
| pílula `somos grande` (1021:675) | 120 | 153,9 | 272 x 37 (fundo #2C343A, raio 50, padding 8/18, gap 6; ícone `hand` 20 x 20 em x=138 y=162,4; texto 14/21 #FFFFFF, 210 x 21 em x=164 y=161,9) |
| `Frame 37185` (1050:506) | 120 | 206,9 | 1200 x 439,3 (vertical, gap 64) |
| título (1021:681) | 120 | 206,9 | 640 x 231 (Roboto 800 64/76,8 #FFFFFF; 3 linhas = 230,4) |
| botões `Frame 37177` (1021:683) | 120 | 461,9 | 455 x 60; primário (1021:684) 260 x 60 em x=120; secundário (1021:685) 180 x 60 em x=395 (gap 15) |
| ícones `icons` (1050:515) | 120 | 585,9 | 355,3 x 60,3 (gap 40,17): `icon-card` 153,6 x 60,3 em x=120 e 161,6 x 60,3 em x=313,7; ícone 60,3 x 60,3, gap 7,3 até o texto 16,43/18,08 #FFFFFF (500) em 2 linhas |
| subtítulo (1021:682) | 120 | 406,9 | 544 x 48, mas está dentro de uma estrutura oculta e sobreposto pelo título/botões; não usar (ver acima) |

Quebra do título: caixa de **640** de largura e o texto tem uma **quebra explícita** (`\n`) depois de "tarifas": "Seu dinheiro, suas regras. Zero tarifas\ne sem enrolação.". Na caixa de 640 o Figma renderiza 3 linhas: "Seu dinheiro, suas" / "regras. Zero tarifas" / "e sem enrolação.". Para reproduzir: largura máxima 640, `<br>` depois de "tarifas" (a primeira linha quebra sozinha após "suas"; "regras. Zero tarifas" cabe em 640). A altura do bloco de 231 só se obtém com 3 linhas; 4 linhas dão 307.
Espaços entre blocos: pílula a título 16; título (termina em 438) a botões 24 (gap do contêiner `título e subtítulo` 1021:679); botões (termina 522) a ícones 64.

### 4. Títulos de Vantagens, Investimentos e Cartão (D-6)

Em todos os três o Figma tem **quebra explícita** (`\n`) no texto, não só a largura da caixa: Roboto 700 40/48, alinhado à esquerda, 2 linhas (96 de altura). A segunda linha começa exatamente no trecho laranja (#E95E2D, ver "Destaques de título").

| Seção | Node | Caixa (largura) | Linha 1 | Linha 2 (destaque) |
|---|---|---|---|---|
| vantagens-da-conta | 551:569 | 470 | "Conheça as vantagens" | "da nossa conta" |
| investimentos | 551:608 | 423 | "Na OrangeBank," (com espaço final antes da quebra) | "seu dinheiro vale mais!" (destaque só em "dinheiro vale mais!") |
| cartao-de-credito | 551:640 | 470 | "O Banco com cartão" (com espaço final) | "de crédito do seu time" (destaque só em "crédito do seu time") |

Reprodução: `<br>` explícito depois de "vantagens", "OrangeBank," e "cartão"; manter a largura de coluna do spec (470 / 423 / 470). Atenção: em Investimentos e Cartão o destaque não coincide com o início da linha 2 ("seu" e "de" ficam na cor base).

### Contraste (rodada 3)

| Par | Razão | Resultado |
|---|---|---|
| "+" #F15A24 sobre #FFFFFF (ui) | 3,37:1 | passa em 3:1 |
| "+" #F15A24 sobre #FFFFFF (texto 4,5) | 3,37:1 | reprova como texto; não usar em texto pequeno |
| #F3F3F3 sobre #D3410D (texto footer) | 4,18:1 | reprova (já tratado: usar a cor do spec) |
| #FFFFFF sobre #D3410D (texto) | 4,63:1 | passa |
| #15191C sobre #F3F3F3 (ícone das redes, ui) | 15,93:1 | passa |
| linhas #AB3308 / #E95E2D sobre #D3410D | 1,41:1 / 1,35:1 | decorativas (não carregam informação) |
Nenhuma cor nova além das já documentadas.

## Medidas da rodada 5 (D-13 a D-19)

Fonte: `figma-map.mjs node`/`assets` (API REST), sem MCP. Decisões do dono: D-18 seta longa exportada; D-19 negrito parcial nos itens do cartão; D-16 glow e saturação -6% do hero; D-14 mockup ~542px. Coordenadas em px, relativas ao nó indicado.

### 1. Seta longa dos botões (D-18)

- Node de origem: `I1021:684;462:309` (`Line 1`, VECTOR dentro de `Frame 4` > `button` do hero, 1021:684). No header é a mesma peça (`I551:430;970:1008;462:309`); mesma geometria. A seção CTA (baixar-o-app) não tem botão com seta (só selos de loja).
- Geometria: 21,43 x 0 (linha horizontal), traço branco #FFFFFF de 1,3 px, ponta de seta pelo `strokeCap`; caixa renderizada 22,73 x 9,57. Posição no botão: x=188,8 a 210,2 dentro do botão de 260 x 60 (texto "Vem ser Orange" 129 x 22 termina em x=49,8+129=178,8: gap de 10 até a seta), centrada verticalmente (y=29,2 de 60).
- Exportada como **SVG isolado** (nunca a instância do botão): `site-factory/sandbox/orangebank/public/assets/icons/seta-botao.svg` (23 x 10, viewBox 0 0 23 10, `fill="white"`, path de contorno, sem `currentColor`). Registrada no manifesto único `site-factory/clients/orangebank/assets.json` (o comando `assets` não reexporta o que já existe; as imagens WebP foram preservadas).

### 2. Negrito parcial dos itens do cartão (D-19)

Fonte: `characterStyleOverrides` + `styleOverrideTable` (chave 1) dos textos de `cartao-de-credito` (551:634). Base: Roboto **Medium 500, 18/21,6** (sem override de cor). Trecho em negrito: Roboto **SemiBold 600, 20/24** (estilo `604:550`). Atenção: o trecho em negrito é também **maior** (20 contra 18 px, linha 24 contra 21,6), não só mais pesado.

| Node | Texto completo | Trecho base (500, 18 px) | Trecho em negrito (600, 20 px) | Índices em negrito |
|---|---|---|---|---|
| 551:647 | "Cartão sem anuidade " (com espaço final) | "Cartão sem " | "anuidade " | 11 a 19 |
| 551:663 | "Aceito em compras internacionais" | "Aceito em " | "compras internacionais" | 10 a 31 |
| 551:674 | "Saque em toda rede Banco 24 Horas" | "Saque em toda rede " | "Banco 24 Horas" | 19 a 32 |
| 551:681 | "Acumule pontos no programa Mastercard" | "Acumule pontos no " | "programa Mastercard" | 18 a 36 |

### 3. Hero: glow e saturação (D-16)

Coordenadas relativas ao hero (551:431, 1440 x 800; origem absoluta -720,-513).

**Glow** `Ellipse 4` (1044:500), filho direto do hero, `layoutPositioning: ABSOLUTE`, acima da imagem (1071:499) e abaixo do contêiner de conteúdo (1021:672) na ordem das camadas:

| Parâmetro | Valor |
|---|---|
| Posição / tamanho | x=605,8, y=38,5; 344,5 x 344,5 (centro 778,0 / 210,8, ou seja, no topo, atrás do rosto) |
| Cor | #E95E2D (r 0,9135 g 0,3700 b 0,1757; estilo de cor `615:521`), alpha do fill 1 |
| Blend mode | `LINEAR_DODGE` (CSS: `mix-blend-mode: plus-lighter`; `screen` é a alternativa mais próxima) |
| Opacidade do nó | 0,69 (69%) |
| Efeito | `LAYER_BLUR` raio 200 (visível). Extensão renderizada 744,5 x 583 (box + 200 px de cada lado, cortada no topo do hero). Em CSS o desfoque equivalente do Figma costuma sair como `filter: blur(100px)` (o raio do Figma é o dobro do desvio do CSS); validar visualmente contra a referência |
| Constraints | horizontal CENTER, vertical TOP |

**Saturação -6%** da imagem de fundo: aplicada na instância `img-hero-section 1` (1071:499), 1440 x 810 em x=0, y=0 (10 px além do hero de 800), no retângulo interno `I1071:499;1071:484`, fill IMAGE `scaleMode: FILL` com `filters.saturation = -0,06` (-6%). **O componente de origem 1071:484 (o node exportado como `hero-fundo`) não tem esse filtro**, então o arquivo exportado está com saturação 100%: a redução tem de ser feita no CSS: `filter: saturate(0.94)` na imagem de fundo. Sem outros filtros (exposição, contraste etc.) no fill. Nenhum efeito de camada na imagem (`effects: []`).

### 4. Mockup em Sobre nós (D-14) e marca d'água (QA-26)

Coordenadas relativas à seção `segunda dobra` (551:466, 1364 x 1080; origem absoluta -719,287).

| Bloco (node) | x | y | largura x altura |
|---|---|---|---|
| título e subtítulo (551:472) | 0 | 158 | 1364 x 212,1 (termina em y=370,1) |
| `Frame 37170` corpo (551:475) | 96 | 394,1 | 1172 x 621,9 |
| `logotipo` marca d'água (551:476; vetor 551:477) | 109,1 | 366,6 | 1145,8 x 182,9 (termina em y=549,5) |
| `Surface` (551:478) | 96 | 495 | 1172 x 550 (linha: coluna esquerda, aparelhos, coluna direita) |
| `iphone` instância (551:484) | 416,5 | 495 | 531 x 550 (centro de 1172 em x=96+586: mockup centralizado em x=682) |
| aparelho esquerdo (`Object` I551:484;511:1669) | 419,2 | 512 | 260 x 525,4 |
| aparelho direito (`Object` I551:484;511:1861) | 713,3 | 512 | 260 x 525,4 |
| coluna de texto esquerda `texto` (551:479) | 96 | 630 | 310,5 x 280 |
| coluna de texto direita `texto` (551:485) | 957,5 | 630 | 310,5 x 280 |

- **Tamanho dos aparelhos:** a instância pede **531 x 550** (caixa), com os dois aparelhos de 260 x 525,4 cada (iPhone 12 Pro, tela 231,4 x 499,9 em x+14, y+12,8). Esquerda e direita têm **34,1 px de vão** entre si (x 419,2 a 679,2 e 713,3 a 973,3); a união dos dois mede **554,1 x 525,4** e vaza 25,8 px da caixa da instância à direita (clip desligado). A caixa renderizada, com a sombra (`DROP_SHADOW` 0 24 33 em cada quadro `iphone` interno), é 934,5 x 759,3. O "~542" do QA fica entre 531 (caixa da instância) e 554,1 (união dos aparelhos); o Figma não tem nenhum nó de exatamente 542. Para o CSS: aparelhos lado a lado com ~542 a 554 de largura visível, 525,4 de altura, topo em y=512 (17 abaixo do topo da `Surface`). As colunas de texto ficam em x=96 a 406,5 e 957,5 a 1268; o aparelho esquerdo começa em x=419,2 (12,7 de folga) e o direito termina em x=973,3 (15 de folga até a coluna direita).
- **Marca d'água (QA-26):** topo da marca em y=366,6; topo do mockup (caixa `iphone`/`Surface`) em y=495: **128,4 px acima**; topo dos aparelhos (y=512): 145,4 acima. A marca termina em y=549,5, ou seja, **54,5 px dentro da caixa do mockup** (37,5 px sobre o topo dos aparelhos), que a cobre. Em relação ao corpo (`Frame 37170`, y=394,1) a marca fica **27,5 px acima** do topo do corpo (offset negativo). Mockup começa **124,9 px** abaixo do fim do subtítulo (495 - 370,1). Largura da marca 1145,8 (x 109,1 a 1254,9), centrada em 682 (centro da seção).

### Ícone `hand-two` (Sobre nós): rotação (verificado via figma-map.mjs node, API REST)

- `hand-two 1` (846:1072) é um frame 52 x 52 sem rotação; o filho `Vector` 551:469 (fill IMAGE, STRETCH, imagem 160x160 de emoji com o indicador apontando para cima) tem `rotation` = -0,6323 rad = **-36,23°** na API REST. Conferido no render de referência (`ref/desktop-light/sobre-nos.png`): a mão aparece inclinada para a esquerda (anti-horário). CSS: **`transform: rotate(-36.23deg)`** (CSS positivo = horário; aqui é anti-horário).
- Origem: centro do frame (`transform-origin: center`, 26 x 26). O quadrado rotacionado tem lado ~37,2 px (52 / (cos 36,23° + sen 36,23°)) e ocupa a caixa 52 x 52 (bbox -62,86 x 351). Sem posição extra: centrado no frame.
- O SVG exportado (`icons/icon-hand-two.svg`) **não vem girado de forma utilizável**: tem um losango (path rotacionado) como máscara, mas a imagem embutida está **em pé** e esticada na caixa 52 x 52 (`scale(0.00625)`). Não aplicar rotate sobre ele (giraria duas vezes). Opções: (a) usar a imagem raster em pé (PNG 160x160 embutido) a 37,2 x 37,2 px dentro de um contêiner 52 x 52 com `rotate(-36.23deg)`; ou (b) reexportar o nó `551:469`/`551:470` isolado. `551:470` (11 x 10, arco decorativo, opacidade 0,2 no SVG) fica fora da rotação do vetor 551:469 (rotation null) e já está posicionado em x=+5, y=+7,7 no frame.
- `icon-hand` do hero (1021:676 / vetor 1021:677, 20 x 20): **sem rotação** (rotation null), mão em pé; nada a aplicar.

## Pendências

- [ ] Exportar assets acima (precisa de export por MCP/API de imagens, fora do escopo desta passada).
- [ ] Dono decidir respostas reais dos FAQs 3 a 6.
- [ ] Decidir o contêiner único (1170 vs 1200) no builder; responsivo mobile/tablet por conta do builder.
- [ ] Confirmar com o dono: "Investimo", FDIC/US$, endereço/CNPJ, logos de tecnologia.

## Log

- 2026-10-04: extração inicial (desktop-light apenas): estrutura, tokens, medidas, textos reais e avisos; spec atualizado com `figmaNode`, `figmaVariants`, `design.variants` e `contentRef`.
- 2026-10-04: adicionadas as seções "Destaques de título" (D-1, QA-12, trechos e hex extraídos do JSON, contraste large) e "Decisões e divergências intencionais".
- 2026-10-04: adicionada a seção "Medidas da rodada 3 (D-6 a D-9)": footer, FAQ, hero e quebras de título medidos por `figma-map.mjs layout`/`node` (QA-18 a QA-21), com contraste do "+" laranja.
- 2026-10-04: exportados 46 assets reais via `figma-map.mjs assets` (icons, logos, images, favicon); seção "Assets (a exportar)" substituída por "Assets exportados" com a tabela asset -> seção/componente.
- 2026-10-04: adicionada a seção "Medidas da rodada 5 (D-13 a D-19)": seta longa exportada (`icons/seta-botao.svg`, registrada no `assets.json`; um manifesto paralelo `assets-extra.json` chegou a ser criado e foi removido), trechos em negrito dos 4 itens do cartão, parâmetros do glow (1044:500) e da saturação -6% (1071:499), medidas do mockup e da marca d'água de Sobre nós.
- 2026-10-04: registrada a rotação do ícone `hand-two` (-36,23° anti-horário, origem no centro; SVG exportado com imagem em pé) e a ausência de rotação no `hand` do hero.
