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

## Laço (no máximo 3 rodadas; depois pare e reporte o que resta)

1. **Analisar:** agente `qa-visual` (client-id, variante, seções). Ele gera as referências e a captura e grava `qa-report.md`, classificando cada item como **automática**, **depende do usuário** ou **ignorada** (regra no arquivo do agente).
2. **Corrigir o automático, sem perguntar:** entregue os itens de ação automática ao `builder` em **modo ajustes** (no máximo 5 por rodada). Ele roda lint, testes e build e registra cada correção no build-log.
3. **Reanalisar só o que mudou:** reconstrua (`npx ng build`) e rode o `qa-visual` apenas nas seções alteradas (`--sections`). Se surgirem novos itens automáticos, volte ao passo 2.
4. **Portão do usuário (uma vez, no fim do laço automático):** apresente só o que **depende dele**, agrupado e com a sua recomendação para cada item, mais a lista do que foi corrigido sozinho e do que foi ignorado (uma linha cada, para ele poder contestar ou pedir para desfazer). O usuário decide e responde as dúvidas; o que ele classificar como divergência intencional vira decisão registrada.
5. **Aplicar as decisões:** `builder` em modo ajustes com a lista aprovada; volte ao passo 3 para as seções alteradas.
6. **Fechar:** quando não restar item aberto, rode o agente `verifier` completo uma vez (não pode regredir) e relate o resultado.

## Regras

- A correção automática vale **só** para o que a regra do `qa-visual` permite (fonte da verdade escrita, local, reversível, sem contradizer decisão registrada). Tudo o mais espera o usuário. Como nada é commitado, o usuário pode desfazer qualquer correção automática pelo git.
- O `builder` é o único que edita código; o `qa-visual` só lê e reporta; ninguém faz `git commit`/`git push`.
- Não altere o motor (`.claude/`, `site-factory/{spec,verifier,figma,deploy-templates}`) para fazer um site passar. Se o motor não der conta, registre no `site-factory/ROADMAP.md`.
- Divergência de conteúdo placeholder (altura, tamanho de texto) não é defeito por si só.
- Custo: imagens consomem tokens. Comece por uma variante e poucas seções; avise o usuário antes de abrir dark e mobile.

## Relatório final

Rodadas feitas, itens corrigidos, divergências intencionais registradas, o que ficou pendente e resultado do `verifier`.
