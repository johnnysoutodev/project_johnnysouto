# QA visual: studio-aurora

Variante analisada: desktop-light (1440px). Conteúdo: placeholder (Lorem Ipsum).
Evidências: `site-factory/reports/qa/studio-aurora/desktop-light/` (recortes, measures.json, summary.md); referências em `site-factory/reports/figma/1F1ZjUONCn5jMuTdZVUHN6/ref/desktop-light/`.
Arquivos prováveis: `site-factory/sandbox/studio-aurora/src/app/features/<hero|sobre|contato>/`.

Observação: `design-system.md` não tem seção de "decisões/divergências intencionais". O "Esperado" abaixo foi inferido das seções 6, 7 e 8 do documento e do brief do spec (contentMode placeholder), não de uma lista aprovada.

## Rodada 1

Resumo: 0 achados automáticos (sem palavra quebrada, corte, deformação ou alvo pequeno). Altura: hero +52px, sobre -174px, contato +28px.

### Bugs objetivos

Nenhum. `scrollHeightMatches` verdadeiro nas 3 seções.

### Diferenças do design

**QA-1 (alta) hero, sobre (provavelmente contato também): área útil 64px mais estreita que a do Figma.**
- Esperado (doc seção 2): padding de seção 80 + container com padding 32, conteúdo útil de 1216px, de x=112 a x=1328.
- Renderizado: hero começa em x=144 e a foto termina em x=1288 (Figma: 112 e 1320); sobre começa a moldura em x=152 (Figma 120). Conteúdo útil de 1152px.
- Causa: `.container { max-width: 1216px; padding: 0 32px }` com border-box coloca o padding dentro dos 1216px. Pelo doc, o `max-width` do container deveria ser 1280px (1216 + 64).
- Efeito em cascata: a coluna de texto do sobre fica mais larga que no Figma (632→1290 contra 744→1322 no Figma) e o parágrafo do hero tem 750px contra 768px.
- Proposta: `max-width: 1280px` no `.container` de hero, sobre e contato (ou `box-sizing: content-box`).

**QA-2 (média) sobre: texto alinhado ao centro vertical, no Figma fica no topo.**
- Esperado: título do H3 alinhado ao topo da foto (y=180 no recorte, junto ao topo da moldura).
- Renderizado: H3 em y≈257, centralizado porque `.columns` usa `align-items: center`. Com o texto placeholder curto, sobra um vazio de ~75px acima do título e ~70px abaixo da lista. No Figma o texto longo preenche a coluna e o efeito não aparece.
- Proposta: `align-items: flex-start` em `.columns` (sobre.scss). Confirmar com o usuário se, com texto real curto, prefere centralizado (ver QA-8).

**QA-3 (média) hero: título quebra em 2 linhas, empurra a composição.**
- Esperado: H1 (60/72) em 1 linha; bloco de texto cabe no container de 360px (altura da seção 552px).
- Renderizado: "Lorem ipsum dolor sit amet consectetur" quebra em 2 linhas (+72px), o bloco de texto sobe para ~408px e a seção vai a 604px (+52px; o restante é compensado pela foto centralizada). A quebra não é defeito (sem palavra cortada), é efeito do título placeholder, de 38 caracteres, em uma coluna de ~750px.
- Proposta: sem correção de código; o strategist pode encurtar o título placeholder (cerca de 20 caracteres) se quiser a mesma proporção do Figma.

**QA-4 (baixa) contato: parágrafo introdutório com linha órfã.**
- Esperado: 2 linhas centralizadas (max-width 576px), altura 560px.
- Renderizado: 3 linhas, a última com a palavra única "aliqua."; seção com 588px (+28px = exatamente 1 linha de 28px). Causa: texto placeholder mais longo (125 caracteres contra ~100 no Figma). Largura e tipografia (20/28, #4b5563) batem.
- Proposta: encurtar o placeholder do `intro` (spec) ou aplicar `text-wrap: balance` no parágrafo.

**QA-5 (baixa) sobre: altura -174px.**
- Causa: o Figma tem 5 parágrafos longos, links sublinhados, frase final e lista de 4 itens; o spec tem 3 parágrafos curtos e 6 itens em 2 colunas de 3. A moldura da foto (400x480, offsets de 40px) tem a mesma medida nos dois (borda inferior em y=684). Composição, espaçamento (gap 24/16) e tipografia batem. Não é defeito.
- Proposta: nenhuma; reavaliar quando o conteúdo real chegar.

**QA-6 (baixa) tag: peso do texto parece mais forte que o do Figma.** ~~REFUTADO pela medição (orquestrador, após a captura passar a medir `components`): `app-tag` tem peso 500, fonte 14/20, raio 12px, padding 4px 20px e altura 28px, exatamente o do documento de design. A impressão vinha da imagem.~~
- Esperado: Body3/Medium (500) 14/20. Renderizado: nos recortes o texto da Tag parece semi-bold. Não confirmado em measures.json (a captura não mede a Tag). Largura da tag igual à do Figma em ordem de grandeza.
- Proposta: conferir `font-weight` da Tag nos 3 componentes; deve ser 500.

### Dúvidas para o usuário

**QA-7** Estados hover/focus dos Icon Buttons não existem no Figma (pendência já registrada no doc, seção 8). O builder definiu hover discreto e `:focus-visible`. Aprovar ou pedir ao designer?

**QA-8** Alinhamento vertical da coluna de texto do sobre: topo (como no Figma) ou centro (como está)? Depende do tamanho do texto final.

**QA-9** Contato no Figma usa ícone de copiar ao lado de e-mail e telefone; o doc (seção 6) fala em "externo/copiar". O render usa o ícone de copiar. Confirmar que a ação desejada é copiar, e não abrir `mailto:`/WhatsApp.

### Esperado (divergências já cobertas pelo doc ou pelo spec)

- Textos, nome "Sagar", e-mail e telefone do template substituídos por placeholder e pelo e-mail do cliente (doc, topo; contentMode placeholder).
- Fotos viram bloco neutro cinza (doc seção 6); a cor (#b6b9c2 aprox.) é mais escura que o Gray/200 da moldura, o que é coerente com "bloco neutro".
- Redes: ícones de e-mail e WhatsApp (2) no lugar de github/twitter/figma (3) (doc seções 6 e 7; spec).
- Telefone trocado por WhatsApp com número placeholder `(00) 00000-0000` (doc seção 6; spec).
- Sem emoji, sem links sublinhados no corpo do sobre e sem "Finally..." / "One last thing": conteúdo do template.
- Localização "Cidade, UF" e disponibilidade em Lorem (spec).
- Medidas conferidas e corretas: padding de seção 96/80, H1 60/72/700/-1.2px #111827, H3 30/36/600, corpo 16/24 #4b5563, subtítulo do contato 20/28, fundos #fff e #f9fafb.

### Lacunas de processo

- O spec não tem `figmaVariants`; só a variante desktop-light foi analisada (via `figmaNode` das seções). Dark, tablet e mobile não têm referência registrada: lacuna do `designer`.
- A captura só mede a primeira heading e o primeiro parágrafo da seção; textos de Tag, botões e ícones não têm medidas em `measures.json`.

### Itens para o usuário aprovar

1. QA-1: corrigir o `max-width` do container para 1280px (alta; muda toda a largura útil).
2. QA-2 + QA-8: alinhar o texto do sobre ao topo, ou manter centralizado.
3. QA-3 e QA-4: encurtar os placeholders de título do hero e intro do contato (ou `text-wrap: balance`).
5. QA-7 e QA-9: decidir hover/focus dos ícones e a ação do ícone de copiar.

## Rodada 2

Escopo: hero, sobre, contato (desktop-light, 1440px, placeholder). Capturas regeradas do build corrigido. O doc agora tem a seção "10. Decisões e divergências intencionais"; o "Esperado" abaixo vem dela (a observação do topo, sobre a ausência da seção, vale só para a Rodada 1).
Resumo: 0 achados automáticos (sem palavra quebrada, corte, deformação ou alvo pequeno; `scrollHeightMatches` verdadeiro nas 3). Alturas iguais às da Rodada 1 (hero 604 vs 552, sobre 788 vs 962, contato 588 vs 560), efeito do placeholder. Itens novos: 1 (QA-10).

### Verificação dos itens da Rodada 1

- **QA-1: RESOLVIDO.** Hero: texto começa em x=112 e a moldura da foto termina em x=1320 (Figma: 112 e 1320; antes 144 e 1288). Sobre: moldura começa em x=120 (Figma 120; antes 152) e o texto termina em x≈1328 (limite esperado 1328). Padding de seção medido 96/80, bate com o doc. Contato é centralizado: sem borda de referência, mas a centralização e a largura do cabeçalho não mudaram em relação ao Figma (Tag e parágrafo em x centrado, 3 linhas por causa do placeholder).
- **QA-2: RESOLVIDO.** H3 do sobre em y≈190, igual ao Figma (y=190), alinhado ao topo da foto; `.columns` agora usa `align-items: flex-start`.
- Sem regressões: tipografia (H1 60/72/700, H3 30/36/600, corpo 16/24 #4b5563, subtítulo 20/28), fundos (#fff, #f9fafb), Tag 14/20/500 raio 12, Icon Buttons 36 e 44, lista em 2 colunas (passo de 34px, igual ao Figma) e posição das fotos continuam corretos.

### Bugs objetivos

Nenhum.

### Diferenças do design

**QA-10 (média) sobre: coluna de texto 150px mais larga e 144px mais à esquerda que no Figma.**
- Esperado (Figma): texto começa em x=744 e tem ~578px (744 a 1322); a coluna da foto e a do texto são simétricas (doc, seção Sobre: as duas com min-width 444, gap 48).
- Renderizado: texto começa em x=600 e vai a x≈1328 (728px de largura); o vão entre a foto (x=544) e o texto é de 56px, no Figma é de 200px. Causa provável: a `.text` tem `flex: 1 1 444px` e a coluna da foto não cresce, então o texto ocupa todo o espaço que sobra. Com duas colunas iguais, (1216 - 48)/2 = 584, o texto começaria em 112+584+48 = 744, como no Figma.
- Não é artefato do placeholder: a largura da coluna independe do comprimento do texto. Mas o doc só fala em min-width 444, não em crescimento; a fonte é a geometria do Figma, não um valor escrito.
- Proposta: dar à coluna da foto `flex: 1 1 444px` (com a foto alinhada à esquerda dentro dela), para as duas colunas dividirem o espaço igualmente. Alternativa: manter como está se o usuário preferir o texto mais largo com o conteúdo real.
- Arquivo provável: `site-factory/sandbox/studio-aurora/src/app/features/sobre/sobre.scss` (e o template, para a coluna da foto).
- **Ação: depende do usuário** (a regra pede fonte escrita: o doc não define o crescimento; na dúvida, usuário).

### Dúvidas para o usuário

- QA-10 acima: igualar as duas colunas do sobre (como o Figma) ou manter o texto largo?

### Esperado (seção 10 do doc e spec; não reaberto)

- QA-7: hover (fundo Gray/200) e `:focus-visible` dos Icon Buttons, definidos pelo builder e aprovados.
- QA-3, QA-4, QA-5: alturas e quebras de linha de hero (título em 2 linhas), contato (linha órfã "aliqua.") e sobre (-174px), por causa do placeholder.
- QA-9: ícone de copiar mantido ao lado de e-mail e telefone.
- QA-6: refutado (Tag confere com o Figma).
- Fotos como bloco neutro, redes e-mail/WhatsApp no lugar de github/twitter/figma, textos e contatos placeholder (doc e spec).

### Listas finais da Rodada 2

**Ação automática:** nenhum item.

**Dependem do usuário:** QA-10 (larguras das colunas do sobre).

**Ignorados:** QA-3, QA-4, QA-5 (placeholder, já na seção 10); QA-7, QA-9 (intencionais); QA-6 (refutado); alturas das 3 seções; largura da Tag (127px contra ~105px, texto placeholder maior); e-mail do contato 528px contra 479px no Figma (texto diferente); posição vertical da foto do hero (centralizada, a altura difere por causa do título em 2 linhas).

### Lacunas de processo

- Mesmas da Rodada 1: sem `figmaVariants` no spec (só desktop-light analisado).

## Rodada 3 (fechamento, verificação por medição)

- **QA-10 (sobre, colunas) resolvido, correção automática.** Geometria do Figma (`figma-map.mjs layout`): colunas em `x=112 w=584` e `x=744 w=584`, `gap=48`, `grow=1` nas duas. DOM renderizado (`geometry.txt`): `.pic` em `x=112 w=584` e `.text` em `x=744 w=584`. Iguais.
- `verifier` completo APROVADO (build, testes, lint, `npm-audit` 0, 3 viewports x claro/escuro; sem rolagem horizontal). Avisos esperados: `placeholder-content` e canonical (sem domínio).
- Corrigidos nesta sequência: QA-1 (container 1280/padding 32), QA-2 (texto ao topo) e QA-10 (colunas iguais). Registrados como intencionais ou ignorados: QA-3, QA-4, QA-5, QA-6 (refutado), QA-7, QA-9.
- Abertos: nenhum na variante `desktop-light`. Não analisados: dark, tablet, mobile (o Figma tem mobile e dark completos; falta o `designer` mapear `figmaVariants` e extrair as medidas).

## Rodada 4 (mobile-light, 375px)

Escopo: hero, sobre, contato. Conteúdo placeholder. Referências: `site-factory/reports/figma/1F1ZjUONCn5jMuTdZVUHN6/ref/mobile-light/`; capturas: `site-factory/reports/qa/studio-aurora/mobile-light/` (recortes, `measures.json`, `geometry.txt`). Fontes escritas: doc seção 6.1 e `figma-map.mjs layout --depth 4` nos nós `327:419`, `327:442`, `327:728`. Seção 10 do doc lida e respeitada (Esperado abaixo). `figmaVariants` presente no spec (sem lacuna de processo).
Resumo: 1 achado automático da captura (palavra quebrada no contato: e-mail e telefone; `scrollHeightMatches` verdadeiro nas 3). Alturas: hero 1020 vs 880, sobre 1458 vs 1690, contato 592 vs 472 (ignoradas como placeholder, mas boa parte da diferença do hero e do contato vem dos itens abaixo). Itens novos: 11 (QA-11 a QA-21). Arquivos prováveis: `site-factory/sandbox/studio-aurora/src/app/features/<hero|sobre|contato>/*.scss`, `src/app/shared/photo-frame.scss`, `src/styles/` (mixin `content-container`).

### Bugs objetivos

**QA-20 contato: e-mail e telefone quebram no meio da palavra.**
- Evidência: `span.value` com 195px de largura e 64px de altura (2 linhas de 32px): "contato@studioa / urora.example" e "(00) 00000- / 0000"; achado automático `brokenWords`. Causa: fonte do valor 24/32 (Figma mobile: 18/28) e linha com ícone 32, botão 44 e gap 20 (Figma: 24, 36, 16), em largura útil de 311px (Figma 343).
- Proposta: aplicar QA-11 e QA-19 e recapturar. O telefone deve caber (Figma: texto de 149px). Se o e-mail ainda quebrar, vale QA-21.
- Arquivo: `contato.scss`.
- **Ação: automática** (defeito objetivo; correção local de CSS, já coberta por QA-11 e QA-19).

### Diferenças do design

**QA-11 (alta) hero, sobre, contato: padding lateral de 32px em vez de 16px (conteúdo útil 311px em vez de 343px).**
- Esperado (doc 6.1 e Figma): `Container x=16 w=343` nas 3 seções (padding de seção 64 vertical / 16 lateral, sem os 32px extras do container).
- Renderizado (`geometry.txt`): hero `div.text x=32 w=311`; sobre `div.columns x=32 w=311`; contato `header x=32 w=311`. Causa: `@media (max-width: 767px)` zera `--section-padding-x` e o `content-container` mantém `padding: 0 32px`.
- Proposta: no mobile, container com padding lateral 16px (conteúdo 343px).
- **Ação: automática** (valor escrito no doc e na geometria do Figma; CSS local).

**QA-12 (alta) hero: a foto vem depois do texto; no mobile deve vir antes.**
- Esperado (doc 6.1; Figma: Pic Container em y=64, Column de texto em y=412): foto acima, texto abaixo, gap 48.
- Renderizado: `div.text y=64`, `app-photo-frame y=596`.
- Proposta: no mobile, `order: -1` na foto (ou container em coluna com a foto primeiro).
- **Ação: automática** (CSS; ordem escrita no doc).

**QA-13 (alta) hero: moldura da foto com tamanho e offset diferentes.**
- Esperado (Figma, doc 6.1): Pic Container 280x300; Background 280x280 em (0, 20); Pic 240x280 em (20, 0); centralizado.
- Renderizado: `app-photo-frame` 311x360; `span.block` 271x320 em x+40, y+40; `span.photo` 271x320 (offset 40 como no desktop, e a largura esticada ao container).
- Proposta: variantes mobile da moldura (280x300; offsets 20/20; foto 240x280, bloco 280x280). Arquivo: `src/app/shared/photo-frame.scss`.
- **Ação: automática** (medidas escritas; CSS local; a moldura é neutra, sem mudar conteúdo).

**QA-14 (média) hero: H1 com tipografia errada.**
- Esperado (doc 6.1): 600, 36/40, letter-spacing 0.
- Renderizado: 700, 40/48, -0.8px (`measures.json`).
- Proposta: no `@media` mobile do hero, `font: 600 36px/40px` e `letter-spacing: 0`. Arquivo: `hero.scss` (hoje `font-size: 40px; line-height: 48px`).
- **Ação: automática.**

**QA-15 (alta) sobre: moldura da foto com tamanho errado e alinhada à esquerda.**
- Esperado (Figma): Pic Container 320x380 centralizado (x=28 em 375); Background 320x360 em (0, 20), Pic 280x360 em (20, 0).
- Renderizado: `app-photo-frame.mirrored` 311x520 em x=32 (alinhada à esquerda, `.pic` com `justify-content: flex-start`).
- Proposta: variante mobile 320x380 (bloco 320x360, foto 280x360), centralizada no mobile. Arquivos: `photo-frame.scss`, `sobre.scss`.
- **Ação: automática.**

**QA-16 (média) sobre: H2 com 30/36; mobile pede 24/32.**
- Esperado (doc 6.1): 600, 24/32, -0.02em. Renderizado: 600, 30/36, -0.6px.
- Proposta: `font-size: 24px; line-height: 32px` no `@media` mobile (letter-spacing já é -0.02em). Arquivo: `sobre.scss`.
- **Ação: automática.**

**QA-17 (média) sobre: gap do container 48px; mobile pede 24px entre a Tag e a foto.**
- Esperado (Figma): Container `gap=24` (Tag termina em y=92, foto começa em y=116). O gap de 48 entre foto e texto está certo (Figma `gap=48`, y=496 -> 544).
- Renderizado: Tag termina em y=92 e `div.columns` começa em y=140 (48).
- Proposta: `gap: 24px` no `.container` do mobile (mantendo 48 dentro de `.columns`). Arquivo: `sobre.scss`.
- **Ação: automática.**

**QA-18 (média) contato: gap do container 48px; mobile pede 24px.**
- Esperado (Figma): cabeçalho termina em y=220, canais começam em y=244; canais terminam em y=316, social começa em y=340 (24 nos dois).
- Renderizado: 220 -> 268 e 412 -> 460 (48 nos dois).
- Proposta: `gap: 24px` no `.container` mobile. Arquivo: `contato.scss`.
- **Ação: automática.**

**QA-19 (média) contato: tamanhos dos canais (e-mail e telefone) são os do desktop.**
- Esperado (doc 6.1, Figma): texto 600 18/28, -0.02em; ícone 24; Icon Button 36; gap 16 entre ícone, texto e botão; linhas de 36px sem gap entre elas.
- Renderizado: texto 24/32; ícone 32; Icon Button 44; gap 20; linhas de 64px com gap 16 entre elas (`ul.channels gap=16px`; Figma: Email y=244 h=36, Phone y=280).
- Proposta: no `@media` mobile do contato, `.value` 18/28, ícone 24, `app-icon-button` 36 (variante de tamanho), `gap: 16px` na linha e `gap: 0` na lista, `min-height: 36px`. Arquivo: `contato.scss` e `contato.html` (tamanho do ícone e do botão).
- **Ação: automática** (todos os valores estão no doc 6.1 e na geometria do Figma; o Icon Button 36 já existe como tamanho padrão).

### Dúvidas para o usuário

**QA-21 contato: o e-mail real cabe no mobile?**
- Figma: texto do e-mail (25 caracteres, "reachsagarshah@gmail.com") com 240px a 18/28. O e-mail do cliente tem 28 caracteres (`contato@studioaurora.example`), estimado em ~265px, e o espaço disponível após QA-11 e QA-19 é ~251px (343 - 24 - 36 - 2x16). Pode continuar quebrando, mesmo com as medidas do Figma. Confirmar depois da correção.
- Opções: reduzir a fonte do e-mail no mobile (ex.: 16/24), ou permitir quebra em "@" ou ".", ou aceitar a quebra. Mudar o design ou a regra de quebra é decisão do usuário.
- **Ação: depende do usuário** (só depois de recapturar com QA-19 aplicado).

### Esperado (seção 10 do doc e spec; não reaberto)

- QA-7: hover e `:focus-visible` dos Icon Buttons (builder, aprovado).
- QA-3, QA-4, QA-5: alturas e quebras de linha por causa do placeholder (hero com título em 3 linhas, contato com intro em 4 linhas).
- QA-9: ícone de copiar mantido ao lado de e-mail e telefone (Figma mobile também tem).
- QA-6: Tag confere (14/20/500, raio 12; largura 127 vs 105 e 122 no Figma é texto).
- Fotos como bloco neutro; redes e-mail e WhatsApp (2 ícones) no lugar de 3 (hero e contato); textos, nome e contatos placeholder; sem emoji, links sublinhados e frases finais do sobre.
- Confirmado como correto: parágrafo 16/24 #4b5563, subtítulo do contato 20/28, fundos (#fff, #f9fafb), Tag 28px, Icon Button 36 no hero e nos social, gap 48 entre foto e texto no sobre, checklist em 2 colunas, hero com gap 48 entre blocos, Actions alinhadas à esquerda no hero.

### Listas finais da Rodada 4

**Ação automática (10):** QA-11, QA-12, QA-13, QA-14, QA-15, QA-16, QA-17, QA-18, QA-19, QA-20.

**Dependem do usuário (1):** QA-21 (e-mail longo no mobile, após as correções).

**Ignorados:** alturas das 3 seções (hero 1020 vs 880, sobre 1458 vs 1690, contato 592 vs 472), título do hero em 3 linhas, intro do contato em 4 linhas, parágrafos e lista do sobre (conteúdo placeholder); largura da Tag (127 vs 105/122: texto); 2 ícones sociais em vez de 3 (intencional); largura de `socials` 300 vs 312 e posições x dos canais no contato (decorrem de QA-11/QA-19 e do texto); hover e focus (intencional).

## Rodada 5 (desktop-dark 1440 e mobile-dark 375; foco em cor e contraste)

Método: referências Figma (`figma-map.mjs image`) e capturas (`qa-capture.mjs`) de hero, sobre e contato nas duas variantes; imagens comparadas lado a lado; cores confirmadas em `measures.json` e por amostragem de pixels dos recortes (cor mais frequente em cada elemento); geometria dark comparada com a light por `diff` de `geometry.txt`.

### Resultado: nenhum item novo de defeito ou de diferença do design

**Geometria dark = light:** `diff geometry.txt` entre `desktop-light` e `desktop-dark`, e entre `mobile-light` e `mobile-dark`: idênticos (sem saída). Sem regressão de palavra quebrada ou corte em nenhuma das duas variantes, exceto o e-mail do mobile (abaixo).

**Cores confirmadas contra a seção 3 e 6.1 do documento (esperado -> medido):**
- Fundo hero e contato `#030712` -> `rgb(3, 7, 18)` nas duas variantes. Fundo sobre `#111827` -> `rgb(17, 24, 39)`.
- Títulos (H1 hero, H2 sobre) `#f9fafb` -> `rgb(249, 250, 251)`. Parágrafos, subtítulo do contato e textos de localização/social `#d1d5db` -> `rgb(209, 213, 219)`.
- E-mail e telefone do contato `#f9fafb` -> cor dominante `(249, 250, 251)` nos pixels (desktop e mobile).
- Tag: fundo `#374151` -> `rgb(55, 65, 81)`; texto `#d1d5db` -> `rgb(209, 213, 219)` (sobre e contato; contraste ~7,6:1).
- Ícones por máscara (localização, e-mail, telefone, copiar, redes) e Icon Buttons: `color` `rgb(209, 213, 219)`; pixels dos ícones `(209, 213, 219)`. Todos trocam de cor no dark; nenhum ficou escuro.
- Ponto "disponível" `#10b981` -> pixels `(16, 185, 129)`.
- Moldura da foto: bloco "Background" `#374151` -> pixels `(55, 65, 81)` (hero e sobre, desktop e mobile). Borda de 8px na cor do fundo da seção: hero `(3, 7, 18)` e sobre `(17, 24, 39)`, vista como vazio escuro entre foto e bloco, igual ao Figma. No mobile-dark/sobre as faixas medidas por pixel (bloco 36-339, foto 56-339, borda 48-55) coincidem exatamente com as do Figma.
- Contraste: o menor par de texto é `#d1d5db` sobre `#111827`/`#030712`/`#374151` (todos acima de 7:1); sem texto de baixo contraste.

### Dúvidas para o usuário

**QA-21 (reconfirmado, não reaberto):** o e-mail `contato@studioaurora.example` também quebra no mobile-dark ("...exampl" / "e", `span.value` em 2 linhas, achado automático no `summary.md`). É o mesmo comportamento do mobile-light; a decisão continua pendente. **Ação: depende do usuário.**

### Esperado (seção 10 e spec; não reaberto)

- Fotos como bloco neutro: no dark o bloco vale `rgb(85, 89, 98)` (`color-mix` de texto secundário a 40% com o fundo, em `photo-frame.scss`), contra a foto real do Figma. Mesma regra do light.
- Redes e-mail e telefone no lugar de 3 ícones; textos e contatos placeholder; hover e focus dos Icon Buttons (QA-7); alturas e quebras por placeholder (QA-3, QA-4, QA-5); ícone de copiar (QA-9); Tag (QA-6).

### Listas finais da Rodada 5

**Ação automática (0).**

**Dependem do usuário (1):** QA-21 (e-mail no mobile, vale também no dark).

**Ignorados:** alturas (desktop-dark: hero 604 vs 552, sobre 788 vs 962, contato 588 vs 560; mobile-dark: hero 912 vs 880, sobre 1214 vs 1690, contato 492 vs 472), porque o conteúdo é placeholder; cor do bloco da foto (intencional); largura da Tag 127px (texto); ponto "disponível" `#10b981` fixo (assumido no documento, sem variável no Figma).

## Rodada 6 (fechamento de mobile e dark, verificação por medição)

- **Mobile-light:** QA-11 a QA-20 corrigidos em dois lotes automáticos e conferidos contra o Figma (`figma-map.mjs layout` x `geometry.txt`): padding 16/largura 343, foto antes do texto no hero, molduras de foto (hero 280x300, sobre 320x380 centralizada), H1 600 36/40, H2 24/32, gaps do contato em 24, ícone 24 e botão 36. Desktop sem regressão (hero em x=112; sobre 584/584).
- **Desktop-dark e mobile-dark (Rodada 5):** 0 itens. Geometria idêntica à light; fundos, textos, Tag e ícones batem com as cores dark do documento.
- **Aberto: QA-21 (e-mail do contato quebra no mobile, light e dark).** Depende do usuário: `contato@studioaurora.example` precisa de ~265px e há 251px disponíveis; o Figma usa 25 caracteres, o e-mail do cliente tem 28.
- `verifier` completo APROVADO (13 checks, 1 aviso esperado: placeholder). `npm audit` 0.

## Rodada 7 (QA-21 resolvido)

- **QA-21 resolvido por decisão do usuário (opção A).** Valores de contato quebram de linha somente antes do `@`; o telefone nunca quebra; `overflow-wrap: anywhere` só como último recurso para um trecho mais largo que a linha. Medido no navegador: 375px claro e escuro `["contato","@studioaurora.example"]`; 390px e 430px em 1 linha; desktop em 1 linha.
- Uma primeira implementação quebrava também depois dos pontos (`contato@studioaurora.` / `example`), contra o que o usuário escolheu; corrigida após medição. A causa foi minha redação ambígua da opção.
- `verifier` completo APROVADO (13 checks, 1 aviso esperado). Nenhum item aberto nas 4 variantes analisadas.
