---
name: qa-visual
description: Conduz o ciclo de QA visual de um site Angular do site-factory: captura o render, compara com o Figma, mostra os achados ao usuário e aplica os ajustes aprovados pelo builder, repetindo só nas seções alteradas. Use quando pedirem para conferir o visual, comparar com o Figma ou ajustar o layout de uma landing já construída.
argument-hint: <client-id> [variante] [secoes]
---

# /qa-visual `<client-id>` `[variante]` `[secoes]`

Orquestrador do laço **olhar → decidir → ajustar → repetir**. Cada agente faz a sua parte: o `qa-visual` analisa, o **usuário decide**, o `builder` aplica, o `designer` entra só se faltar mapeamento do Figma. Você repassa perguntas e respostas.

Variante padrão: `desktop-light` (economia de tokens). `dark`, `mobile` e `tablet` entram quando o usuário pedir.

## Pré-condições

1. `node site-factory/status.mjs <client-id>` deve estar em `pronto` (site construído e verificado). Senão, volte ao `/build-landing`.
2. O spec precisa ter a variante: `figmaVariants` (ou `figmaNode` para `desktop-light`). Faltando, acione o `designer` para mapear variantes (e extrair as medidas dessa variante, se ainda não existirem no documento de design). Não prossiga sem referência.
3. Token do Figma disponível (`test -f ~/.config/site-factory/.env || test -n "$FIGMA_TOKEN"`; não leia o conteúdo).
4. Build atualizado do projeto: `cd <build.projectDir> && npx ng build` (use `npx ng build`, não `npm run build`, que pode rodar passos extras como otimização de imagens).

## Laço (no máximo 3 rodadas; depois pare e reporte o que resta, e só continue com pedido explícito do dono; um ajuste aprovado que cause efeito colateral visível, como um gradiente que escurece demais, volta como item novo)

1. **Analisar:** agente `qa-visual` (client-id, variante, seções). Ele gera as referências, a captura e o lado a lado (`qa-compose.mjs`) e grava `site-factory/reports/qa/<id>/report.md` (preservando a rodada anterior em `<id>-rodada-N`), classificando cada item como **automática**, **depende do usuário** ou **ignorada** (regra no arquivo do agente).
2. **Corrigir o automático, sem perguntar:** entregue os itens de ação automática ao `builder` em **modo ajustes** (no máximo 5 por rodada). Ele roda lint, testes e build e registra cada correção no build-log.
3. **Reanalisar só o que mudou:** reconstrua (`npx ng build`) e rode o `qa-visual` apenas nas seções alteradas (`--sections`). Se surgirem novos itens automáticos, volte ao passo 2.
4. **Portão do usuário (uma vez, no fim do laço automático):** apresente só o que **depende dele**, agrupado, com a sua recomendação para cada item e no máximo ~7 decisões por vez (junte as relacionadas: ex. brilho e saturação do hero numa pergunta), mais o que foi corrigido sozinho e o que foi ignorado (uma linha cada, para ele poder contestar ou pedir para desfazer).
   - **O usuário só decide bem o que vê.** Se o ambiente tiver a ferramenta `Artifact`, publique uma página privada com o lado a lado de cada seção (Figma à esquerda, site à direita), os achados da seção e as decisões como opções (capacidade `db`, uma coleção `decisions`, um documento por decisão com `choice` e `note`); as respostas dele voltam por `ArtifactData`. Cada rodada nova atualiza a mesma página, com as respostas anteriores recolhidas. Sem a ferramenta, mostre no terminal os caminhos dos `<secao>-lado-a-lado.png` e pergunte item a item.
   - Quando o usuário disser que respondeu, **leia as respostas** (não suponha) e confira os horários: resposta antiga que ele diz ter mudado e não mudou é um aviso para ele, não motivo para seguir com a antiga em silêncio.
   - **Cada decisão do usuário vira registro:** peça ao `designer` para acrescentá-la em "Decisões e divergências intencionais" do documento de design (o `qa-visual` e o `builder` leem de lá, e você não precisa repetir o contexto a cada rodada).
5. **Conferir conflito entre decisões ANTES de aplicar** (é trabalho seu, não do `builder`): duas respostas do mesmo usuário podem puxar em sentidos opostos sobre a mesma área, e aplicar as duas dá um resultado que nenhuma delas queria. Exemplo real: "reproduzir o brilho do hero como o Figma" (clareia o fundo) mais "gradiente escuro sob o texto para dar contraste" (escurece a mesma área): o gradiente venceu, o hero ficou 20 a 30% mais escuro e o brilho sumiu. Ao detectar conflito, **não aplique**: devolva ao usuário com o efeito previsto e uma proposta (ordem de prioridade sugerida: acessibilidade, depois a decisão explícita mais recente, depois a fidelidade ao Figma; e o mínimo de cada efeito que satisfaz os dois). Também confronte a decisão com o que já foi medido (contraste, largura, o próprio arquivo da imagem: ex. o corte de topo de uma foto que vem do arquivo e nenhum `object-position` resolve).
6. **Aplicar as decisões:** se alguma exigir dado do Figma que o documento não tem (rotação, blend, filtro, trecho de texto colorido ou em negrito, posição exata), o `designer` mede antes (`figma-map.mjs fx`/`layout`): o `builder` não consulta o Figma nem adivinha. Depois, `builder` em modo ajustes com a lista aprovada; volte ao passo 3 para as seções alteradas. Decisão do usuário que conflita com contraste WCAG: o contraste vence e o `builder` registra o motivo.
7. **Fechar:** quando não restar item aberto, rode o agente `verifier` completo uma vez (não pode regredir; ele inclui o smoke de interação: menus, foco, âncoras) e relate o resultado. Qualquer mudança de código depois do último `verifier` pede um novo (o `status.mjs` acusa código mais novo que o relatório).

## Regras

- **Site oficial é somente leitura:** as correções do QA num projeto oficial de produção são feitas numa cópia escondida do git (`site-factory/sandbox/`) e entregues como patch; o oficial só muda com pedido explícito do dono.

- A correção automática vale **só** para o que a regra do `qa-visual` permite (fonte da verdade escrita, local, reversível, sem contradizer decisão registrada). Tudo o mais espera o usuário. Como nada é commitado, o usuário pode desfazer qualquer correção automática pelo git.
- O `builder` é o único que edita código; o `qa-visual` só lê e reporta; ninguém faz `git commit`/`git push`.
- Não altere o motor (`.claude/`, `site-factory/{spec,verifier,figma,deploy-templates}`) para fazer um site passar. Se o motor não der conta, registre no `site-factory/ROADMAP.md`.
- Divergência de conteúdo placeholder (altura, tamanho de texto) não é defeito por si só.
- Custo: imagens consomem tokens. Comece por uma variante e poucas seções; avise o usuário antes de abrir dark e mobile.

## Relatório final

Rodadas feitas, itens corrigidos, divergências intencionais registradas, o que ficou pendente e resultado do `verifier`.
