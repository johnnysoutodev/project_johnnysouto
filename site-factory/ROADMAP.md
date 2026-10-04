# Roadmap do site-factory

| Fase | Entrega | Status |
|---|---|---|
| 0 | Limpeza das instruções, `.mcp.json` com `angular-cli`, skill `angular-conventions` | Feita |
| 2 | `verifier` (build/SSR, testes, lint, axe, SEO, overflow, teclado, screenshots) | Feita |
| 1 | `site-spec.schema.json`, validador, template de brief, agente `intake` | Feita |
| 3 | `designer` e `builder` genéricos (substituem `angular-scaffold`/`angular-components`), skill `landing-sections`, formas de `content` por tipo no schema; `figma-map.mjs` (mapa de todas as páginas do Figma por API REST); campo `deploy` agnóstico de provedor; `CHANGELOG.md` + skill `changelog`; templates de deploy `vercel-static` e `aws-static` com `apply.mjs` (só o provedor escolhido); `figma-map.mjs check` (teste de obtenção de dados) | Feita; agentes ainda não exercitados de ponta a ponta |
| 4 | Orquestração `/build-landing <cliente>`, `status.mjs`, `strategist` pequeno e opcional, modo `contentMode: placeholder` (Lorem Ipsum) e prova com uma segunda landing (fictícia, `studio-aurora`) do zero, sem editar o motor | Feita: prova executada e aprovada (ver resultado abaixo) |
| 5 | **QA visual assistido (local):** `figma-map.mjs variants`/`image`/`layout`, `verifier/qa-capture.mjs` (recortes, medidas, achados automáticos, geometria do DOM), agente `qa-visual` e skill `/qa-visual` (corrige o automático, o usuário decide só o que depende dele). Playwright sobre um build | Feita para desktop-light, mobile-light, desktop-dark e mobile-dark na `studio-aurora` (QA-1 a QA-21 resolvidos). Smoke de interação feito (mora no `verifier`). Pendente: tablet (o Figma só tem 375 e 1440) |
| 6 | **Regras de engenharia:** como escrever testes unitários e componentes, aprofundamento de clean code; provavelmente skills (`testing-conventions`, `clean-code`) consumidas por `builder` e `verifier` | Ideia — a conversar |
| 7 | **Template:** duplicar este projeto em outro repositório e transformá-lo em template (motor sem cliente: `.claude/` + `site-factory/` + regras gerais; clientes e o site do johnnysouto ficam fora). Inclui a **opção de CI por cliente** (não regra do motor): `verifier` no GitHub Actions e/ou CI leve de lint, testes e build sem navegador | Ideia — a conversar |

## Pendências conhecidas do verifier (candidatas à fase 5)

- Lighthouse (performance) e comparação visual com o frame do Figma.
- Testes Playwright de interação específicos por componente (ex.: fluxos de formulários e carrosséis); o smoke genérico não cobre a lógica própria de cada componente.

## Pontos a decidir na fase 5 (QA visual assistido)

- Ferramenta: Playwright dirigido por um agente/skill, ou as ferramentas do Claude in Chrome contra o `npm start` do usuário (que ele já mantém aberto).
- O que comparar com o Figma: telas lado a lado vs. medição de estilos computados contra os tokens; pixel diff puro gera falso alarme (renderização de fonte, antialiasing) e não deve ser a base.
- Como o agente propõe e aplica os ajustes (por seção, com o usuário aprovando cada rodada).


## Decisão registrada (03/10/2026): sem fase de CI com Playwright

O CI com Playwright deixou de ser fase. Para quem trabalha sozinho e já roda o `verifier` pelo pipeline (`/build-landing` o torna obrigatório), ele repetiria os mesmos checks no GitHub com custo recorrente (Chrome nos runners, minutos, falsos alarmes) e ganho pequeno. O deploy de produção já tem aprovação manual, portão de `npm audit` e o build da própria Vercel. Passa a **opção por cliente dentro da fase 7**: faz sentido quando houver mais gente no repositório ou quando o cliente quiser a verificação automática. Em separado e barato, quando fizer falta: CI leve de lint, testes e build sem navegador.

## Templates de deploy

- Hoje: Vercel e AWS, ambos `static`. Azure, Netlify, Cloudflare Pages e o modo `server` ficam para quando houver cliente que precise; o procedimento está em `deploy-templates/README.md`.
- Os dois templates estão `untested` até rodarem em repositório/conta real; a primeira landing real em cada provedor é o teste que falta.

## Fase 4: critérios da prova (fixados antes de rodar)

- Cliente fictício `studio-aurora`, 3 seções (hero, about, contact), deploy AWS estático, textos em Lorem Ipsum, projeto em `site-factory/sandbox/studio-aurora` (ignorado pelo git).
- Sai de brief + link do Figma, sem editar o motor: nenhum arquivo muda em `.claude/` nem em `site-factory/{spec,verifier,figma,deploy-templates}`.
- `verifier` completo (sem flags) termina APROVADO; o aviso `placeholder-content` é esperado e deve aparecer.
- `apply.mjs` gera só os arquivos do provedor escolhido (AWS) e a ausência de domínio não quebra os templates.
- Limite conhecido da prova: o Figma é um duplicado do mesmo template do johnnysouto, então prova o pipeline, não variedade de design.
- Tudo que o motor não souber fazer vira registro aqui, não remendo escondido.

## Lacunas do motor achadas durante a prova da fase 4 (não corrigidas durante a prova, por critério)

- **Vulnerabilidades de dependências fora do pipeline.** O agente `resolved-vulnerability` existe (Copilot e Claude), mas o `builder` não audita, o `verifier` não tem check de `npm audit` e o `status.mjs` ignora o tema. Só o template de produção `vercel-static` tem portão de auditoria; os do `aws-static` não têm. Proposta: check `npm-audit` no verifier (crítica = falha, alta/moderada = aviso), `builder` reporta achados em vez de corrigir sozinho, `resolved-vulnerability` chamado pelo orquestrador, política de instalação (`npm ci`, lockfile versionado, sem `--force`/`--legacy-peer-deps` sem aviso) e portão de auditoria também no AWS.
- **Workflows de deploy gravados na raiz do repositório.** `apply.mjs` escreve `.github/workflows/` na raiz do repositório; um cliente de teste dentro do repositório (sandbox) criaria CI de deploy real. A prova contornou usando uma raiz temporária. Proposta: opção `--workflows-root` ou detecção de projeto em `site-factory/sandbox/`.
- **`verifier`: caminho de saída padrão só serve para projeto na raiz.** `--out` padrão é `<project>/../site-factory/reports/latest`; para um projeto aninhado (`site-factory/sandbox/<id>`) grava no lugar errado e o `status.mjs` não acha o relatório. A prova usou `--out ../reports/latest`. Proposta: padrão sempre `site-factory/reports/latest` relativo ao repositório.
- **`verifier`: `--out` não limpa `screenshots/`.** Screenshots de outro projeto ficam misturadas com as da execução atual. Proposta: limpar a pasta (ou separar por projeto) a cada execução.
- **`verifier`: nome de screenshot sem prefixo quando o site tem um idioma só.** Arquivos saem como `._light_375.png` (ocultos no macOS). Proposta: prefixo `default` ou o nome do projeto.
- **`verifier`: `horizontal-overflow` não informa o elemento culpado.** Só rota, tema e viewport. Proposta: listar os elementos cujo `right` passa do viewport (o `builder` teve de montar um script próprio para achar).
- **`verifier`: aviso de canonical ausente sem domínio.** Sem `project.domain` o `seo-basics` avisa para sempre. Proposta: o check conhecer o spec (domínio ausente = pendência por design, não aviso).
- **`builder`: procedimento tem 8 atritos na prática** (relato do primeiro build real, ver `site-factory/clients/studio-aurora/build-log.md`): `ng new <projectDir>` falha com `/` (usar `<nome> --directory=`); `ng add angular-eslint` falha com npm 12 (`EALLOWSCRIPTS`) e o `ng new` não traz lint; `sourceLocale: pt-BR` gera warning de locale (usa-se `pt`, o `<html lang>` sai `pt`); `$localize` exige `@angular/localize` mesmo sem idiomas-alvo; conflito entre "texto no `.ts` de dados" e "texto com `i18n` no template"; o `apply.mjs` exige reproduzir o `projectDir` dentro da raiz alternativa. Corrigir no procedimento depois da prova.

## Fase 4: resultado da prova (`studio-aurora`, 03/10/2026)

Critérios fixados antes de rodar, todos cumpridos:

- **Do zero, sem editar o motor:** retrato SHA de 35 arquivos do motor idêntico antes e depois. Nada mudou em `.claude/` nem em `site-factory/{spec,verifier,figma,deploy-templates,templates}`.
- **Verifier completo APROVADO:** 0 falhas, nada pulado, avisos esperados (`placeholder-content`, `seo-basics` por falta de domínio). Passou no ciclo 2 de 2.
- **`apply.mjs` só do provedor escolhido:** apenas `aws-static` (infra e 2 workflows); sem `vercel.json`; nenhum workflow novo no `.github/` real.
- **Lacunas do motor registradas aqui**, não remendadas.

O que a prova mostrou:

- O pipeline `intake → designer → strategist → builder → verifier` roda do zero com 3 portões e é retomável pelo `status.mjs`.
- O verifier pegou um defeito real que o builder não via: 33px de rolagem horizontal em 375px (`app-photo-frame` de largura fixa). O ciclo de correção (G3) funcionou. Valores mobile são do builder, porque o Figma só tem desktop.
- `npm audit` do projeto gerado: 0 vulnerabilidades.
- Custo aproximado em tokens de subagente: intake 20 mil, designer 83 mil, strategist 18 mil, builder 58 mil (+65 mil na correção), verifier 15 mil + 11 mil.
- Limites do que a prova prova: Figma duplicado do mesmo template (não prova variedade de design); 1 idioma; deploy nunca implantado; nenhuma interação testada.
- Observação visual que nenhum check automático pega: no mobile o e-mail da seção de contato quebra no meio da palavra (`contato@studioa / urora.example`). Não é falha do verifier; é o tipo de coisa que o QA visual assistido (fase 5) deveria cobrir.

## Estado das lacunas da prova (atualizado em 03/10/2026)

**Resolvidas e testadas:**

- **Vulnerabilidades no pipeline:** check `npm-audit` no verifier (crítica = falha; alta/moderada = aviso; sem rede = aviso, nunca aprovação silenciosa), testado com 5 saídas simuladas e com auditoria real nos dois projetos. `builder` reporta achados e não corrige sozinho; a skill `/build-landing` aciona `resolved-vulnerability` quando o check reprova; portão de `npm audit` crítico também no workflow de produção do `aws-static`; política de instalação no `builder` (`npm install` uma vez, lockfile versionado, `npm ci`, nada de `--force`/`--legacy-peer-deps` sem avisar).
- **Workflows no `.github/` real:** `apply.mjs` trata projeto de `site-factory/sandbox/` (ou `--standalone`) como raiz do próprio repositório. Testado: nenhum arquivo novo no `.github/` real.
- **Verifier:** relatório sempre em `site-factory/reports/latest/`; telas antigas apagadas a cada execução; prefixo `default_` com um idioma só; `horizontal-overflow` nomeia o elemento mais externo (testado: `div.miolo`); canonical só exigido quando o spec do cliente tem `project.domain`.
- **Builder (receita executada num projeto Angular novo, zero warnings):** `ng new NAME --directory=<caminho>` (nome não aceita `/`); `--ai-config=claude-code` (valor `claude` não existe); `ng add` falha com npm 12 (`EALLOWSCRIPTS`), então `npm i` + `ng generate <pacote>:ng-add`; lint por `npm i -D` + `site-factory/templates/angular/eslint.config.js` + target `lint`; `@angular/localize` mesmo com um idioma só; `sourceLocale` sem região (`pt`) e `lang` regional definido por `provideAppInitializer`; regra de i18n entre dados e template esclarecida na skill `landing-sections`.

**Ainda abertas:**

- Os ajustes do `builder` foram validados passo a passo num projeto novo, mas **não** por uma nova execução completa de `/build-landing`.
- Comparação visual com o Figma e testes de interação (menu, foco programático): fase 5 (QA visual assistido).
- ~~`angular-app` com 2 críticas e 3 altas~~ **Resolvido em 03/10/2026** pelo `resolved-vulnerability` reescrito: `npm update` da família `@angular/*` (22.1.x → 22.2.1, dentro da faixa) + `npm audit fix` sem `--force`; `npm audit` 0, só o `package-lock.json` mudou, lint/test/build e `verifier` completo (3 idiomas) aprovados.
- Ruído do npm 12 na instalação (`npm warn install-scripts ... fsevents`): não vem do build; reportado, não corrigido.

## Fase 5: decisão de processo (03/10/2026)

O QA não deve pedir aprovação para tudo. O que tem fonte da verdade escrita (documento de design, token, spec) e correção local e reversível é corrigido automaticamente pelo `builder` e só reanalisado; o usuário decide apenas o que depende de gosto, ambiguidade, estado não definido no Figma, semântica de comportamento ou conteúdo. Com essa regra, na primeira rodada da `studio-aurora` só QA-2/QA-8, QA-7 e QA-9 teriam chegado ao usuário (QA-1 seria automático; QA-3, QA-4 e QA-5 ignorados por serem artefato do placeholder).

## Fase 5: o que o primeiro contato com o Figma real mostrou

- **Mobile e dark existem como design completo** no arquivo duplicado (página de conteúdo com desktop, mobile iPhone 8, dark e menu mobile lado a lado; ex.: Hero de 552px no desktop e 880px no mobile). A afirmação anterior "mobile não tem Figma" estava errada: o `designer` só não extraiu o mobile porque o escopo da execução foi limitado a desktop, e o `builder` inventou valores que o Figma já definia. Correções: `figma-map.mjs variants`, campo `figmaVariants` no spec e procedimento do `designer` tratando todas as variantes como design.
- A detecção de palavra quebrada no `qa-capture` pegou o e-mail do contato no mobile e, de brinde, o telefone `(00) 00000-0000` partido no hífen, que ninguém tinha visto.
- Pendente do `designer` para a `studio-aurora`: `figmaVariants` e as medidas mobile e dark das 3 seções (hoje só desktop-light). Entra quando o QA mobile/dark for aberto.
- O agente `qa-visual` foi criado nesta sessão e o registro de agentes ainda não o enxergava; a primeira rodada usou um agente genérico instruído a seguir o arquivo dele.

## Fase 5: resultado do primeiro ciclo (`studio-aurora`, desktop-light, 03/10/2026)

- Rodada 1: 6 diferenças + 3 dúvidas. Rodada 2: QA-1 e QA-2 resolvidos, 1 novo (QA-10). Rodada 3: QA-10 resolvido por medição. Custo aproximado em tokens de subagente: `qa-visual` 34 mil + 38 mil, `builder` 24 mil + 17 mil.
- O QA pegou o que nenhum check automático via: container 64px estreito (o `builder` usou 1216 em vez de 1280), texto do "sobre" centralizado em vez de no topo, colunas desiguais (`grow` ausente). Todos conferidos pela geometria do Figma e do DOM.
- Um item do próprio `qa-visual` estava errado (QA-6, peso da Tag) e a medição o refutou; a regra passou a exigir confirmação numérica antes de reportar.
- A regra de ação foi refinada no meio do ciclo: geometria lida do nó do Figma pela API conta como fonte escrita; estimativa pela imagem não.
- Pendências do ciclo: sandbox é ignorado pelo git (as correções vivem em disco, não em commit; para um cliente real o projeto vai a um repositório); dark, tablet e mobile exigem `figmaVariants` e medidas do `designer`.

## Fase 5: resultado de mobile e dark (`studio-aurora`, 03/10/2026)

- **Mobile (Rodada 4):** 11 itens (10 automáticos, 1 do usuário) porque o `builder` tinha inventado os valores mobile quando ninguém os havia extraído do Figma. Corrigidos em dois lotes de 5 pela regra de ação automática; cada lote foi conferido por medição da geometria (Figma x DOM) antes do seguinte.
- **Dark (Rodada 5):** 0 itens. Geometria idêntica à light e cores iguais às do documento: o custo de um QA de cor é baixo quando a geometria já foi fechada.
- **Custo aproximado em tokens de subagente (mobile e dark):** `designer` 72 mil, `qa-visual` 50 mil + 41 mil, `builder` 31 mil + 32 mil.
- **Lição de processo:** extrair as medidas de mobile e dark no `designer` **antes** do `builder` construir teria evitado o lote inteiro de correções. O `designer` já trata variantes como design; o fluxo `/build-landing` deve exigir `figmaVariants` e medidas das variantes antes de liberar o `builder` (feito: `design.variants` no spec, `status.mjs` barra o `builder` enquanto faltar variante ou medida, `/build-landing` e `designer` atualizados).
- **Convenção adotada na skill `landing-sections` (QA-21):** valores de contato não quebram no meio da palavra: telefone `nowrap`; e-mail com ponto de quebra só antes do `@`.

## Mudanças de processo decididas no fechamento do QA (03/10/2026)

- **`/build-landing` não libera o `builder` sem variantes:** o `designer` registra `design.variants` (o que o Figma tem no escopo) e mapeia `figmaVariants` de cada seção; o documento de design precisa ter medidas de mobile e dark. O `status.mjs` volta para `designer` se algo faltar (testado com 4 cenários).
- **Relatório do verifier por cliente:** `reports/by-client/<cliente>/report.json`, além do `reports/latest/` (que guarda só a última execução). Antes, verificar um projeto fazia o `status.mjs` de outro voltar para a etapa `verifier`.
- **Lição sobre minha própria redação:** o QA-21 foi implementado literalmente pela opção que eu descrevi com um exemplo contraditório. Opções apresentadas ao usuário devem ter o resultado esperado medível ou mostrado de forma consistente.

## Fase 5: smoke de interação (03/10/2026)

- **Onde mora:** no agente `verifier` (script `verifier/verify.mjs` + `verifier/lib/interactions.mjs`), porque é um teste objetivo (passou ou falhou), repetível e sem julgamento de design. O `qa-visual` compara design com você no meio; menu abrir ou não abrir não é gosto. Entra no workflow em dois pontos que já existiam: etapa `verifier` do `/build-landing` e fechamento do `/qa-visual`; falha volta ao `builder` pelo mesmo ciclo (G3).
- **Validação:** página-modelo correta passa nos 3 checks; 12 variantes com um defeito plantado cada (aria-expanded que não muda, painel que não aparece, foco que não entra, **reprodução do bug do `inert`**, Escape que não fecha, foco que não volta, sem trap, painel fechado ainda focável, âncora sem alvo, âncora que não rola, `aria-pressed` parado, sem indicador de foco) são todas reprovadas com mensagem correta.
- **Dois falsos positivos meus corrigidos antes de acusar um site:** painel aberto por um bug cobria a página e gerava falhas em cascata (agora a página é recarregada antes das âncoras); e a espera fixa de 900ms acusou o `AnchorScrollService` do `angular-app` por animação lenta sob carga (agora espera a rolagem estabilizar). Três execuções seguidas limpas no site real.
- **Resultado nos sites reais:** `angular-app`: menu mobile (diálogo, foco, Escape, devolução do foco), tema e âncoras passam; `studio-aurora` passa.
- **Limites:** só tema claro, menor e maior viewport; hover não testado; fluxos próprios de um componente (formulário, carrossel) pedem teste dele.
