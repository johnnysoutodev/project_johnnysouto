# Auditoria de contraste WCAG 2.x AA, orangebank (somente leitura, nada aplicado)

Metodo: tokens resolvidos de `src/styles/_tokens.scss`; fundo efetivo lido do SCSS de cada componente (herdado do `body` branco quando a secao nao define fundo). Razao calculada com a formula de luminancia relativa WCAG (script em scratchpad `contrast.mjs`). Limites: texto normal 4,5:1; texto grande (>=24px, ou >=18,66px bold) 3:1; componente de UI e indicador de foco 3:1. Fundos translucidos foram compostos (alfa) sobre o fundo real.

Abreviacoes: n05 #f3f3f3, n10 #e7e7e7, n50 #95999c, n80 #2c343a, n90 #1d232a, o700 #d3410d, o600 #e95e2d, o500 #ff823d, o400 #ffa370, o50 #fef1ec, accent #f15a24, accent-text #ab3308, body #445059, w #fff.

## Tabela

Fundos de secao: sobre-nos, vantagens-da-conta, investimentos, cartao-de-credito, perguntas-frequentes = branco (herdado do body); tecnologias-utilizadas = n05; hero = n90; baixar-o-app card = o700; footer = o700; header = rgb(250 53 36 / 24%) composto sobre o hero.

| # | Componente / seletor | Token texto | Token fundo | Valores | Razao | Limite | Resultado |
|---|---|---|---|---|---|---|---|
| 1 | body / base (texto padrao 14px) | text-body | white | #445059 / #fff | 8,28 | 4,5 | passa |
| 2 | header `.header__link` (desktop, 18px/500) | white | header-bg sobre hero n90 (#522729) | #fff / #522729 | 12,46 | 4,5 | passa (ver risco R1) |
| 3 | header `.header__link` mobile menu aberto | white | o700 | #fff / #d3410d | 4,63 | 4,5 | passa |
| 4 | header `.header__toggle` borda e barras | white | header-bg sobre n90 (#522729) | #fff / #522729 | 12,46 | 3 (UI) | passa |
| 5 | header botao CTA `.button--primary` | n90 | o500 | #1d232a / #ff823d | 6,42 | 4,5 | passa |
| 6 | header `.header__brand` placeholder label | accent-text | o50 | #ab3308 / #fef1ec | 5,92 | 4,5 | passa |
| 7 | hero `.hero__title` (48px bold, grande) | white | n90 | #fff / #1d232a | 15,84 | 3 | passa |
| 8 | hero `.hero__badge` (14px) | white | n80 | #fff / #2c343a | 12,66 | 4,5 | passa |
| 9 | hero `.hero__highlight` (16px/500) sobre n90 | white | n90 | #fff / #1d232a | 15,84 | 4,5 | passa |
| 10 | hero `.hero__highlight` sob o brilho `.hero__glow` (alfa maximo) | white | o600 (gradiente) | #fff / #e95e2d | 3,44 | 4,5 | FALHA condicional (R2) |
| 11 | hero `.hero__title` sob o brilho (grande) | white | o600 | #fff / #e95e2d | 3,44 | 3 | passa |
| 12 | hero `.button--outline` texto 18px/500 sobre n90 | white | n90 | #fff / #1d232a | 15,84 | 4,5 | passa |
| 13 | hero `.button--outline` sob o brilho (alfa maximo) | white | o600 | #fff / #e95e2d | 3,44 | 4,5 | FALHA condicional (R2) |
| 14 | hero `.button--outline` borda n05 | n05 | n90 | #f3f3f3 / #1d232a | 14,27 | 3 (UI) | passa |
| 15 | hero `.button--primary` | n90 | o500 | #1d232a / #ff823d | 6,42 | 4,5 | passa |
| 16 | hero `.asset-placeholder__label` dentro de `.hero__background` (opacity 0,2) | accent-text a 20% | o50 a 20% sobre n90 | #392623 / #4a4c51 | 1,65 | 4,5 | FALHA (axe nao ve: `aria-hidden`) |
| 17 | sobre-nos `.sobre-nos__label` | accent-text | white | #ab3308 / #fff | 6,54 | 4,5 | passa |
| 18 | sobre-nos `.sobre-nos__title` (40px bold) | neutral-90 | white | #1d232a / #fff | 15,84 | 3 | passa |
| 19 | sobre-nos `.sobre-nos__subtitle` | text-body | white | #445059 / #fff | 8,28 | 4,5 | passa |
| 20 | sobre-nos `.sobre-nos__column-title` | neutral-90 | white | #1d232a / #fff | 15,84 | 4,5 | passa |
| 21 | sobre-nos `.sobre-nos__column-text` (herda body) | text-body | white | #445059 / #fff | 8,28 | 4,5 | passa |
| 22 | sobre-nos mockup placeholder label | accent-text | o50 | #ab3308 / #fef1ec | 5,92 | 4,5 | passa |
| 23 | tecnologias `.tecnologias-utilizadas__title` | text-body | n05 | #445059 / #f3f3f3 | 7,46 | 4,5 | passa |
| 24 | vantagens `.vantagens-da-conta__title` | neutral-90 | white | #1d232a / #fff | 15,84 | 3 | passa |
| 25 | vantagens `.vantagens-da-conta__item` (list-card, 18px/500) | text-body | white | #445059 / #fff | 8,28 | 4,5 | passa |
| 26 | vantagens/investimentos/cartao placeholders com label (foto, people-card, float-card) | accent-text | o50 | #ab3308 / #fef1ec | 5,92 | 4,5 | passa |
| 27 | vantagens `.button--primary` | n90 | o500 | #1d232a / #ff823d | 6,42 | 4,5 | passa |
| 28 | vantagens/investimentos `.button:focus-visible` (outline white, offset 4px) | white (anel) | white (fundo da secao) | #fff / #fff | 1,00 | 3 (UI) | FALHA |
| 29 | investimentos `.investimentos__title` | neutral-90 | white | #1d232a / #fff | 15,84 | 3 | passa |
| 30 | investimentos `.investimentos__paragraph` | text-body | white | #445059 / #fff | 8,28 | 4,5 | passa |
| 31 | investimentos `.button--primary` | n90 | o500 | #1d232a / #ff823d | 6,42 | 4,5 | passa |
| 32 | cartao `.cartao-de-credito__title` | neutral-90 | white | #1d232a / #fff | 15,84 | 3 | passa |
| 33 | cartao `.cartao-de-credito__item` (list-card) | text-body | white | #445059 / #fff | 8,28 | 4,5 | passa |
| 34 | faq `.perguntas-frequentes__title` | title-faq | white | #1e1e1e / #fff | 16,67 | 3 | passa |
| 35 | faq `.perguntas-frequentes__question` (18px/500) | neutral-90 | white | #1d232a / #fff | 15,84 | 4,5 | passa |
| 36 | faq `.perguntas-frequentes__answer` | text-body | white | #445059 / #fff | 8,28 | 4,5 | passa |
| 37 | faq `.perguntas-frequentes__icon::after` (barras +/-) | accent | white | #f15a24 / #fff | 3,37 | 3 (UI) | passa |
| 38 | faq `.perguntas-frequentes__item` borda | border-faq | white | #d9d9d9 / #fff | 1,41 | 3 (UI) | passa por excecao (1.4.11 nao exige: o texto da pergunta identifica o controle; e borda de cartao) |
| 39 | faq `.perguntas-frequentes__more` texto (18px/500) | neutral-50 | white | #95999c / #fff | 2,87 | 4,5 | FALHA |
| 40 | faq `.perguntas-frequentes__more` borda | neutral-50 | white | #95999c / #fff | 2,87 | 3 (UI) | FALHA |
| 41 | `.button--outline-muted` texto e borda (variante nao usada hoje) sobre white | neutral-50 | white | #95999c / #fff | 2,87 | 4,5 / 3 | FALHA latente (sem uso) |
| 42 | baixar-o-app `.baixar-o-app__title` (40px/48px bold) | white | o700 | #fff / #d3410d | 4,63 | 3 (4,5 no mobile 28px bold) | passa |
| 43 | baixar-o-app `.button--primary` | n90 | o500 | #1d232a / #ff823d | 6,42 | 4,5 | passa |
| 44 | baixar-o-app `.button:focus-visible` (anel white) | white | o700 | #fff / #d3410d | 4,63 | 3 (UI) | passa |
| 45 | baixar-o-app selos (placeholder label) | accent-text | o50 | #ab3308 / #fef1ec | 5,92 | 4,5 | passa |
| 46 | `.asset-placeholder__label` dentro de `.baixar-o-app__background` (opacity 0,2) | accent-text a 20% | o50 a 20% sobre o700 | #cb3e0c / #dc643a | 1,40 | 4,5 | FALHA (conhecido) |
| 47 | footer `.footer__address-line` (14px) | neutral-05 | o700 | #f3f3f3 / #d3410d | 4,18 | 4,5 | FALHA (conhecido) |
| 48 | footer `.footer__link` (14px) | neutral-05 (inherit) | o700 | #f3f3f3 / #d3410d | 4,18 | 4,5 | FALHA |
| 49 | footer `.footer__heading` (20px/600, nao grande) | neutral-05 | o700 | #f3f3f3 / #d3410d | 4,18 | 4,5 | FALHA |
| 50 | footer `.footer__cta` (18px/500) | neutral-05 | o700 | #f3f3f3 / #d3410d | 4,18 | 4,5 | FALHA |
| 51 | footer `.footer__locale` (14px) x2 | neutral-05 | o700 | #f3f3f3 / #d3410d | 4,18 | 4,5 | FALHA |
| 52 | footer `.footer__copyright` (12px) | neutral-05 | o700 | #f3f3f3 / #d3410d | 4,18 | 4,5 | FALHA |
| 53 | footer selos e logo (placeholder label) | accent-text | o50 | #ab3308 / #fef1ec | 5,92 | 4,5 | passa |
| 54 | footer placeholders (logo, selos, redes) contra o fundo o700 (limite do componente) | o50 | o700 | #fef1ec / #d3410d | 4,19 | 3 (UI) | passa |
| 55 | `.asset-placeholder` borda tracejada | accent | o50 | #f15a24 / #fef1ec | 3,05 | 3 (UI) | passa (margem 0,05) |
| 56 | `.footer__link` / `.header__link` hover e focus-visible | herdado | herdado | so sublinhado, cor igual | n/a | n/a | sem novo par (ver nota N2) |
| 57 | `.button` hover | n/a | n/a | sem regra de hover | n/a | n/a | sem novo par |

## Resumo

- 55 pares com razao calculada (linhas 1 a 55); as linhas 56 e 57 nao criam par novo.
- 12 falhas firmes (linhas 16, 28, 39, 40, 41, 46, 47, 48, 49, 50, 51, 52) e 2 condicionais ao mobile (10 e 13). A linha 41 e latente (variante sem uso).
- Em 5 causas raiz: (1) texto do footer em neutral-05 sobre orange-700 (6 linhas, 4,18:1); (2) anel de foco branco sobre secoes brancas (1,00:1); (3) botao "carregar mais" em neutral-50 (2,87:1, texto e borda); (4) rotulos de placeholder dentro de fundos com opacity 0,2 (hero 1,65; CTA 1,40); (5) brilho do hero sob texto branco normal (3,44:1 no alfa maximo, a medir no mobile).
- Os 2 conhecidos do verifier (46 e 47) confirmados. Os que o axe nao mostrou: restante do footer (links, headings, cta, locale, copyright, mesma causa), `.perguntas-frequentes__more`, anel de foco, placeholder do hero (aria-hidden), brilho do hero.

## Riscos condicionais (nao calculaveis sem o asset real)

- R1: header `rgb(250 53 36 / 24%)` e o texto branco do hero dependem da imagem de fundo real (hoje placeholder; o fundo n90 e suposicao do builder). Quando `img-hero-section 1` existir, recalcular com o pior pixel sob header, titulo, badge, highlights e botao outline; sem overlay escuro nao ha garantia. Sobre placeholder a 20%: header 7,70:1 (passa).
- R2: `.hero__glow` (570px, `radial-gradient(o600, transparent 70%)`, canto inferior esquerdo) cobre toda a largura do hero no mobile. Texto branco normal (highlights 16px/500, botao outline 18px/500) falha onde o alfa do brilho passa de ~0,8 (a 0,7 ainda da 5,49; no alfa total 3,44). No desktop a 1440px os highlights ficam na borda do brilho (alfa ~0,1 a 0,3; passa). Medir no mobile com screenshot.

## Propostas (menor troca por token existente)

| Falha | Troca minima | Novo valor | Observacao |
|---|---|---|---|
| Footer (linhas 47 a 52): `color: var(--color-neutral-05)` em `.footer` | `color: var(--color-white)` | #fff / #d3410d = 4,63 passa (texto 12px incluso) | token existente; muda 1 linha em `footer.scss`. n05 vs white e quase imperceptivel (#f3f3f3 -> #fff). Nao exige token novo. |
| Anel de foco branco em fundo branco (28) | anel de dois tons com tokens existentes: `outline: var(--size-border-thick) solid var(--color-neutral-90)` + `box-shadow: 0 0 0 calc(var(--size-border-thick) + var(--space-1)) var(--color-white)` (halo branco interno) | n90 sobre white 15,84; n90 sobre o700 3,42; halo branco garante n90 sobre hero n90 (1,00 so no anel, mas o halo branco 15,84 contra o hero fica adjacente) | alternativa mais simples por contexto: anel n90 nas secoes brancas e white no hero/baixar. Dois tons e a unica opcao que serve nos 3 fundos com tokens existentes. A confirmar no navegador. |
| `.perguntas-frequentes__more` e `.button--outline-muted` (39 a 41) | `color` e `border-color` de `--color-neutral-50` para `--color-neutral-80` | #2c343a / #fff = 12,66 passa | unico cinza da paleta que passa em branco alem do n90; n50 (2,87) nao passa em nenhum fundo claro da paleta (n05: 2,59). Decisao de design: o Figma usa n50. |
| Rotulos de placeholder em fundo com opacity 0,2 (16 e 46) | passar `[compact]="true"` nos dois `app-asset-placeholder` de `.hero__background` e `.baixar-o-app__background` (some o texto, o que e decorativo e `aria-hidden`) | sem texto: sem par | nenhum token resolve: com 20% de opacidade nenhuma cor de texto da paleta chega a 4,5:1. Resolve de vez quando o asset real entrar. |
| Brilho do hero (10 e 13), se confirmado no mobile | gradiente com `--color-orange-700` no lugar de `--color-orange-600` | #fff / #d3410d = 4,63 no pior caso (alfa 1) | token existente; muda a cor do brilho (decisao de design). Alternativa: reduzir `--size-photo` do brilho no mobile. |

## Notas

- N1: nenhum token novo e necessario para passar tudo. Nao ha cor fora de `design-system.md` nas propostas (white, neutral-80, neutral-90, orange-700 sao do guia).
- N2: hover e focus de links (header e footer) so mudam `text-decoration`, nao ha par novo de cor; o indicador de foco e apenas o sublinhado (igual ao hover). Nao e falha de razao, mas e fraco como indicador de foco (WCAG 2.4.7 AA ainda atendido; 2.4.13 AAA nao).
- N3: o placeholder de asset sai quando os assets reais entrarem; recalcular linhas 6, 22, 26, 45, 53 (somem) e R1 (entram).
- N4: o `design-system.md` nao foi alterado. Nada foi aplicado no projeto.
