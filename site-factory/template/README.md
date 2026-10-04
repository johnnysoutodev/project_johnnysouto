# Template: como o repositório-template é produzido

Este repositório é a **fonte** do motor do site-factory. O repositório de template (`template_landing-page_ai`) é um **produto gerado**: nunca se edita à mão.

| Arquivo | Para quê |
|---|---|
| `manifest.json` | o que do motor vai para o template (`copy`), o que fica de fora (`exclude`), os resíduos proibidos (`leaks`) e os caminhos de execução |
| `files/` | arquivos que só existem no template (`CLAUDE.md`, `README.md`, `docs/template-setup.md`, `CHANGELOG.md` do template...) |
| `export.mjs` | gera o template numa pasta vazia (`--out`) e o verifica (`--verify`): sem vazamento do projeto de origem, sem referência quebrada, com os arquivos obrigatórios |
| `sync.mjs` | atualiza o repositório do template: exporta e verifica, compara, deixa o destino idêntico à exportação e roda os testes do motor |
| `lib/sync-plan.mjs` | a decisão do sync (adicionar, alterar, remover), com testes |

## Fluxo de uma mudança

1. Altere e **commite aqui** (agentes, skills, scripts, docs).
2. `node site-factory/template/sync.mjs --to <pasta do repo do template> --dry-run` mostra o que muda.
3. `node site-factory/template/sync.mjs --to <pasta do repo do template>` sincroniza. Ele para na primeira falha (se a exportação não passa na verificação, o destino não é tocado), nunca toca em `.git` nem em `node_modules`, remove o que a exportação não tem e imprime uma mensagem de commit com o hash da fonte.
4. Revise `git status` no repositório do template e **commite lá** (e, só quando decidir, `git push`). O `sync` nunca commita nem envia.

Quem consome o template (um cliente novo) atualiza o motor com `git remote add template <url>` e `git checkout template/main -- <caminhos do motor>` (ver `docs/template-setup.md`, dentro do template).

Testes desta parte: `node --test site-factory/template/lib/sync-plan.test.mjs`.
