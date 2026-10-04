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
| `designer` | Esta etapa só termina quando o `status.mjs` deixa de apontar `designer`: `design.variants` registrado, `figmaVariants` de cada seção para **todas** as variantes (desktop e mobile, claro e escuro, o que o Figma tiver no escopo) e o documento de design com as medidas de mobile e dark. **O `builder` não pode rodar antes disso**: sem as medidas ele inventa os valores das variantes que faltam e o QA depois precisa consertar tudo. Antes, confira que o token existe sem lê-lo: `test -f ~/.config/site-factory/.env \|\| test -n "$FIGMA_TOKEN"`; se faltar, oriente o usuário (`site-factory/README.md`) e pare. Agente `designer`; ao final rode `node site-factory/figma/figma-map.mjs check --spec <spec>` (deve sair limpo). O `designer` também exporta os assets (`assets.json` + `figma-map.mjs assets`) e entrega a seção "Contraste" do documento de design: **se houver pares de cor reprovados, leve a lista ao usuário antes do `builder`** (a cor é do design; a decisão é dele), e passe ao `builder` as trocas aprovadas. |
| `strategist` | Agente `strategist`. **G2** (só em `contentMode: final`): leve o `copy-proposal.md` ao usuário; com a aprovação, rode o agente de novo dizendo quais seções foram aprovadas. Em `placeholder` não há portão. Seções duvidosas que o dono não quer decidir agora: ofereça `status: deferred` (adiada, fora do build) ou aprovar o conteúdo incompleto como `ready`; não deixe o pipeline parado em `draft`. Diga ao usuário, no portão, que as seções ficam em `draft` até ele aprovar (isso é esperado, não é travamento). |
| `assets` (dentro do `designer`) | O `designer` exporta os assets do Figma (`assets.json` + `figma-map.mjs assets`, que não sobrescreve o que já existe) e entrega a lista de fotos de licença duvidosa. O `builder` só é acionado com os assets em `public/assets/`: rodar o `builder` antes obriga a trocar marcador depois, com novo ciclo de `verifier` e QA. |
| `builder` | Agente `builder`. Se o projeto não existir ele cria (etapa A) e aplica o template de deploy do provedor escolhido. |
| `verifier` | Agente `verifier` **sem flags**. **G3:** se reprovar, devolva o relatório ao `builder` (que corrige) e reverifique; **no máximo 2 ciclos**, depois pare e reporte o que resta. **Vulnerabilidades:** se o check `npm-audit` reprovar (crítica), acione o agente `resolved-vulnerability` no projeto (atualização compatível primeiro, `overrides` só se preciso, nunca `--force`) em vez do `builder`, e reverifique; conta como um ciclo. Altas e moderadas são aviso: relate ao usuário, não bloqueie. |
| `pronto` | Relate o resultado. |

## Regras

- **Site oficial é somente leitura:** projeto oficial de produção (`build.projectDir` fora de `site-factory/sandbox/`) nunca é alterado por adoção de padrão, refatoração ou teste do pipeline. Esse trabalho é feito numa cópia escondida do git em `site-factory/sandbox/<cliente>/` e entregue como patch para revisão; o oficial só muda com pedido explícito do dono para aplicar o patch. Pergunta ambígua ("rode no projeto oficial") não é autorização: confirme.

- **Vulnerabilidade não se analisa à mão:** achado do `npm-audit` (ou do `npm audit` depois de instalar qualquer dependência) vai para o agente `resolved-vulnerability`, que faz a triagem, percorre a escada e reporta. O orquestrador não roda `npm view`, não lê advisory nem decide degrau: só aciona o agente e repassa o resultado.
- Cada chamada de agente leva só o `client-id` e o que a etapa pede (respostas do usuário, relatório do verifier); eles leem o resto dos arquivos. Não cole documentos grandes no prompt.
- Cliente de teste ou fictício: `build.projectDir` em `site-factory/sandbox/<id>` (ignorado pelo git).
- Nunca `git commit`/`git push`: o usuário comita pelo fluxo dele. Deixe tudo no working tree.
- Não altere o motor (`.claude/`, `site-factory/{spec,verifier,figma,deploy-templates}`) para fazer um cliente passar. Se o motor não der conta, registre a lacuna no `site-factory/ROADMAP.md` e diga ao usuário.
- Custo: cada `builder` com muitas seções é caro. Avise o usuário antes de rodá-lo quando houver mais de 3 seções `ready` a gerar.

## Decisões do usuário (como pedir e como usar)

- Pergunte em lote, com a sua recomendação em cada item e no máximo ~7 por vez; item de baixo impacto vai como "ignorado" (uma linha) e só vira pergunta se o usuário pedir.
- **O usuário decide melhor o que vê:** com a ferramenta `Artifact`, publique uma página privada (lado a lado Figma × site, achados e as decisões como opções, com a capacidade `db`; ver a skill `qa-visual`), e leia as respostas por `ArtifactData`. Sem a ferramenta, mostre os caminhos das imagens no terminal.
- **Confira conflito entre decisões antes de mandar ao `builder`** (ver passo 5 da skill `qa-visual`): duas respostas que puxam em sentidos opostos na mesma área voltam ao usuário, não são aplicadas em silêncio.
- Cada decisão é registrada pelo `designer` em "Decisões e divergências intencionais" do documento de design.

## Pontos que o pipeline não pega sozinho (leve ao usuário)

- Capturas do `verifier`: ele abre ao menos a de menor viewport e a de um tema escuro e reporta áreas em branco, sobreposição e texto cortado; um `screenshots: OK` sem essa conferência não vale como evidência visual.
- Aviso `a11y-contrast-manual` do `verifier`: texto sobre imagem que o axe não mediu. Não é falha, mas o orquestrador pede ao `designer`/`builder` a medida com `contrast.mjs` e leva os casos reprovados ao usuário.
- Fotos de banco de imagem ou de ferramenta externa: a licença é do dono; registre como pendência antes de publicar.
- Controles sem ação definida e links `href="#"`: lista no relatório final.

## Relatório final

Etapas concluídas, seções geradas, resultado do `verifier`, e o que ainda depende do usuário: segredos e ambientes do deploy (saída do `apply.mjs`), troca dos textos se `contentMode: placeholder` (**não publicar em produção com Lorem Ipsum**), domínio e DNS.
