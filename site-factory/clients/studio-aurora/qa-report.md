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
