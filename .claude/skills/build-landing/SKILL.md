---
name: build-landing
description: Conduz o pipeline do site-factory para criar uma landing page em Angular (intake → designer → strategist → builder → verifier) para um cliente em site-factory/clients/<id>/. Retomável: descobre a etapa pelos artefatos. Use quando pedirem para criar, continuar ou retomar uma landing page.
argument-hint: <client-id>
---

# /build-landing `<client-id>`

Você é o orquestrador. Os agentes (`.claude/agents/`) não falam com o usuário; você repassa perguntas e respostas. O estado vive nos arquivos, não na conversa.

## Laço

1. `node site-factory/status.mjs <client-id> --json` → etapa atual (`stage`), próximo passo (`next`) e bloqueios.
2. Execute **só** a etapa indicada (tabela abaixo), depois volte ao passo 1. Nunca pule etapa, nunca rode duas em paralelo.
3. Pare nos portões (G1, G2, G3) e quando `stage` for `pronto`.

| `stage` | Ação |
|---|---|
| `brief` | Peça ao usuário o brief (texto + link do Figma + deploy + textos finais ou placeholder) ou copie `site-factory/templates/brief.template.md` para `clients/<id>/brief.md` e preencha com o que ele disser. Sem inventar. |
| `intake` | Agente `intake`. **G1:** se devolver perguntas bloqueantes, leve-as ao usuário (provedor de deploy, textos finais ou placeholder, idiomas...), registre as respostas no brief e rode o `intake` de novo. |
| `designer` | Antes, confira que o token existe sem lê-lo: `test -f ~/.config/site-factory/.env \|\| test -n "$FIGMA_TOKEN"`; se faltar, oriente o usuário (`site-factory/README.md`) e pare. Agente `designer`; ao final rode `node site-factory/figma/figma-map.mjs check --spec <spec>` (deve sair limpo). |
| `strategist` | Agente `strategist`. **G2** (só em `contentMode: final`): leve o `copy-proposal.md` ao usuário; com a aprovação, rode o agente de novo dizendo quais seções foram aprovadas. Em `placeholder` não há portão. |
| `builder` | Agente `builder`. Se o projeto não existir ele cria (etapa A) e aplica o template de deploy do provedor escolhido. |
| `verifier` | Agente `verifier` **sem flags**. **G3:** se reprovar, devolva o relatório ao `builder` (que corrige) e reverifique; **no máximo 2 ciclos**, depois pare e reporte o que resta. **Vulnerabilidades:** se o check `npm-audit` reprovar (crítica), acione o agente `resolved-vulnerability` no projeto (atualização compatível primeiro, `overrides` só se preciso, nunca `--force`) em vez do `builder`, e reverifique; conta como um ciclo. Altas e moderadas são aviso: relate ao usuário, não bloqueie. |
| `pronto` | Relate o resultado. |

## Regras

- Cada chamada de agente leva só o `client-id` e o que a etapa pede (respostas do usuário, relatório do verifier); eles leem o resto dos arquivos. Não cole documentos grandes no prompt.
- Cliente de teste ou fictício: `build.projectDir` em `site-factory/sandbox/<id>` (ignorado pelo git).
- Nunca `git commit`/`git push`: o usuário comita pelo fluxo dele. Deixe tudo no working tree.
- Não altere o motor (`.claude/`, `site-factory/{spec,verifier,figma,deploy-templates}`) para fazer um cliente passar. Se o motor não der conta, registre a lacuna no `site-factory/ROADMAP.md` e diga ao usuário.
- Custo: cada `builder` com muitas seções é caro. Avise o usuário antes de rodá-lo quando houver mais de 3 seções `ready` a gerar.

## Relatório final

Etapas concluídas, seções geradas, resultado do `verifier`, e o que ainda depende do usuário: segredos e ambientes do deploy (saída do `apply.mjs`), troca dos textos se `contentMode: placeholder` (**não publicar em produção com Lorem Ipsum**), domínio e DNS.
