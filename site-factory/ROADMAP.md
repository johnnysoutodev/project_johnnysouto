# Roadmap do site-factory

| Fase | Entrega | Status |
|---|---|---|
| 0 | Limpeza das instruções, `.mcp.json` com `angular-cli`, skill `angular-conventions` | Feita |
| 2 | `verifier` (build/SSR, testes, lint, axe, SEO, overflow, teclado, screenshots) | Feita |
| 1 | `site-spec.schema.json`, validador, template de brief, agente `intake` | Feita |
| 3 | `designer` e `builder` genéricos (substituem `angular-scaffold`/`angular-components`), skill `landing-sections`, formas de `content` por tipo no schema; `figma-map.mjs` (mapa de todas as páginas do Figma por API REST); campo `deploy` agnóstico de provedor; `CHANGELOG.md` + skill `changelog`; templates de deploy `vercel-static` e `aws-static` com `apply.mjs` (só o provedor escolhido); `figma-map.mjs check` (teste de obtenção de dados) | Feita; agentes ainda não exercitados de ponta a ponta |
| 4 | Orquestração `/build-landing <cliente>`, `status.mjs`, `strategist` pequeno e opcional, modo `contentMode: placeholder` (Lorem Ipsum) e prova com uma segunda landing (fictícia, `studio-aurora`) do zero, sem editar o motor | Feita: prova executada e aprovada (ver resultado abaixo) |
| 5 | **QA visual assistido (local):** `figma-map.mjs variants`/`image`/`layout`, `verifier/qa-capture.mjs` (recortes, medidas, achados automáticos, geometria do DOM), agente `qa-visual` e skill `/qa-visual` (corrige o automático, o usuário decide só o que depende dele). Playwright sobre um build | Feita para desktop-light, mobile-light, desktop-dark e mobile-dark na `studio-aurora` (QA-1 a QA-21 resolvidos). Smoke de interação feito (mora no `verifier`). Pendente: tablet (o Figma só tem 375 e 1440) |
| 6 | **Regras de engenharia:** skill `clean-code-angular` (padrão obrigatório, com exemplos reais de como não fazer), portão `code-quality` (ESLint com limites, Stylelint/BEM, testes só na lógica com 100% de cobertura, arquivos separados, tokens sem ponta solta), templates em `templates/angular/` | Feita e provada na `studio-aurora` (refatorada sem mudar o visual); `angular-app` em modo relatório. Decisões abertas abaixo |
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

## Fase 6: regras de engenharia (03/10/2026)

**Decisões do dono do projeto:** testes unitários só na lógica, com 100% de cobertura, teste primeiro; HTML e SCSS sempre separados em todo componente (o projeto vai escalar além de landing page); Stylelint e BEM; função até 50 linhas; `code-quality` como portão novo, independente do navegador, para servir também no CI de deploy.

**Como as decisões se encaixam (a parte sutil):** "testes só na lógica" + "100% de cobertura" só fecham se o componente for fino. Por isso "lógica" = todo `.ts` que não é componente, diretiva, dado, rota, configuração ou `main`; a classe do componente fica só com ligação (inputs, signals, eventos) e qualquer decisão sai para função ou serviço, que entra na cobertura. Comportamento de tela (menu, foco, âncora) é coberto pelo smoke de interação do `verifier`, e aparência pelo QA visual; nenhum dos dois é teste unitário.

**Limites numéricos:** função 50 linhas, arquivo `.ts` e `.scss` 150, complexidade 8, aninhamento 3, 4 parâmetros. Defesa dos 25 que propus: o que importa é carga cognitiva, e ela depende mais de complexidade e aninhamento do que de linhas; com 50 linhas + complexidade 8 + aninhamento 3 + 4 parâmetros os mesmos cheiros são pegos sem forçar a quebrar funções lineares e legíveis.

**Prova (cliente `studio-aurora`):** linha de base reprovada em Stylelint (não configurado), `component-files` (10 problemas: 5 de 8 componentes com template inline, 3 sem `.scss`) e `bem-block` (25 classes), mais 55 violações de Stylelint, 7 de lint. O `builder` adotou o padrão em modo refatoração: `code-quality` APROVADO (11 checks), `verifier` completo APROVADO (25 checks), e a geometria e as medidas das 4 variantes (desktop/mobile, claro/escuro) ficaram **idênticas** às de antes, conferidas por mim com o meu próprio retrato.

**O `builder` recusou contornar uma regra errada minha:** `selector-max-universal: 0` proibia o reset `*, *::before, *::after` do `_base.scss`, contradizendo a minha própria skill. Em vez de desligar o Stylelint ou remover o reset, ele reportou o conflito. Corrigi o template (o `_base.scss` é o único arquivo liberado para seletor universal e de tag).

**Falhas minhas achadas na prova e corrigidas:** o template `_breakpoints.scss` falhava no próprio Stylelint (comentário vazio); faltavam mixins para `@media` que não é largura (`prefers-dark`, `prefers-reduced-motion`); o `code-quality` deixava de rodar os testes quando faltava o pacote de cobertura (agora roda os testes mesmo assim e só a cobertura falha).

**Vulnerabilidades introduzidas pelas ferramentas novas:** o Stylelint 17.16.0 (última versão) puxa `braces <= 3.0.3` (GHSA-vfj7-8cjw-p6xm, DoS por padrão aninhado), **sem versão corrigida publicada**. 10 altas, todas só em dependência de desenvolvimento (`npm audit --omit=dev` = 0). A triagem foi do agente `resolved-vulnerability` (caso 6, "sem correção publicada"): não aplicou remendo; recomendou aceitar o risco com registro. Decisão do dono: ver abaixo.

**Erro de processo meu:** fiz a triagem da vulnerabilidade à mão em vez de acionar o agente. Regra gravada no `/build-landing` e no `builder`: achado de auditoria vai para o `resolved-vulnerability`.

**Baseline do `angular-app` (modo relatório, nada bloqueia):** 20 checks passam, 7 avisos: Stylelint e cobertura não configurados, 6 classes fora do bloco BEM (`cookie-consent-banner` usa o bloco `.cookie-consent`), 3 arquivos de lógica sem spec, 17 specs de componente (a política nova é só lógica), 3 componentes com lógica demais na classe (o `mobile-menu` tem 22 ramificações), 2 tokens sem uso.

**Decisões em aberto:** (1) aceitar o aviso de audit do Stylelint com justificativa, ou permitir um allowlist explícito e datado para esse GHSA; (2) migrar o `angular-app` para `enforce` e quando.

**Política de auditoria decidida:** a auditoria separa dependências de produção e ferramentas de desenvolvimento; vulnerabilidade crítica em qualquer grupo reprova, enquanto alta/moderada avisa. A crítica em dependência de build também pode comprometer a máquina e o CI.

## Fase 6: segunda rodada (03/10/2026)

- **Agente `resolved-vulnerability` ganhou o degrau 4: trocar a biblioteca** quando a escolhida não tem solução publicada (decisão do dono do projeto). Critérios: cobre o que usamos, `npm audit` limpo, mantida, licença e uso, compatível, custo proporcional; protótipo isolado com resultado equivalente antes de aplicar; nunca silenciar uma regra do projeto para a troca passar.
- **Exercitado no caso real (Stylelint, GHSA-vfj7-8cjw-p6xm, `braces <= 3.0.3`, sem correção):** nenhuma candidata passou e o agente **não trocou**. Avaliou Stylelint 14/15/16 (mesma cadeia), Biome (não faz lint de SCSS), sass-lint (abandonado, crítica no audit), duas implementações Rust "Gale" (uma com binário que dá 404, a outra um fork de um mantenedor sem a leitura da nossa config) e override/alias do `braces` (só há fork também vulnerável). O protótipo do Gale deixou passar `@media` e `rgb()` (regras que o projeto exige): resultado diferente, troca reprovada. Conclusão do agente: aceitar com registro (a exposição atual é alta em ferramenta de desenvolvimento, produção em 0; o verifier avisa altas/moderadas e reprova críticas em qualquer grupo), com gatilho de revisão (micromatch/braces#70 e #73, novas versões do Stylelint).
- **Buraco real no BEM, fechado:** a regra `selector-class-pattern` do Stylelint e o meu check não enxergavam BEM aninhado errado (`&__Title`, `&--Big`, `&-foo`), justamente a forma que a skill recomenda. O check `bem-block` agora resolve o aninhamento com o parser de SCSS do próprio Stylelint, valida minúsculas e bloco, e detecta regra duplicada no mesmo contexto (comparando a lista inteira de seletores, como o `no-duplicate-selectors`; `.a, .b {}` seguido de `.a {}` e `@include mobile-only` não contam). Testado com 5 casos plantados; 0 falsos positivos no `studio-aurora`. Três falsos positivos meus no caminho, corrigidos.
- **Base do Stylelint trocada de `standard-scss` para `recommended-scss`:** a `standard` traz regras de formatação (linha em branco, notação de cor) que o Prettier cobre; no `angular-app` eram ~110 das 145 violações, ruído sem ganho de qualidade. Com a base certa, o `angular-app` tem **43 violações em 16 de 22 arquivos**, todas de regras pedidas: 16 de `px` cru em espaçamento/tipografia, 13 de seletor de tag, 8 de comentário `//` vazio, 2 de `@media` cru, 2 de hex, 1 de seletor universal (o reset do `styles.scss`, agora liberado).
- **`CLAUDE.md` gerado pelo Angular substituído na criação:** `templates/angular/CLAUDE.md` mantém todas as orientações de Angular e troca a única que conflita ("prefira template inline"), com um bloco no topo apontando para a skill `clean-code-angular`. O `builder` copia por cima do `CLAUDE.md` e do `AGENTS.md` logo depois do `ng new`. Aplicado no `studio-aurora`; o do `angular-app` não foi alterado (decisão do dono).
- **Medição do `angular-app` com as regras novas (cópia, nada alterado):** ESLint 5 violações em 4 arquivos (2 `max-lines`, 1 `max-params`, 1 complexidade, 1 declaração inline); Stylelint 43; cobertura não medida (falta `@vitest/coverage-v8`).

## Decisões do dono do projeto (04/10/2026)

- **Crítica em ferramenta de desenvolvimento também barra** (`npm-audit-dev`), como em produção; alta e moderada só avisam. Motivo: ferramenta de build comprometida executa código na máquina e no CI.
- **Risco do Stylelint aceito em desenvolvimento:** GHSA-vfj7-8cjw-p6xm (`braces <= 3.0.3`, DoS por padrão de chaves aninhado) via `stylelint -> micromatch -> braces`, sem correção publicada, só dependência de desenvolvimento (`npm audit --omit=dev` = 0), globs fixos e do próprio projeto. O aviso de alta fica na auditoria de desenvolvimento até o upstream corrigir. **Gatilhos de revisão:** micromatch/braces issues #70 e #73, `npm view braces version`, novas versões do Stylelint; reavaliar alternativas (Gale ou similar) se ganharem mantenedores, leitura de config `.cjs` e suporte comprovado a `at-rule-disallowed-list` e `function-disallowed-list`.
- **`angular-app` passa para `quality.mode: enforce`**, depois de adotar o padrão (modo adoção de qualidade do `builder`, com o visual idêntico medido antes e depois) e de substituir o `CLAUDE.md`/`AGENTS.md` gerados pelo Angular pelo template do projeto. **Correção de execução (04/10/2026):** a primeira tentativa foi feita direto no `angular-app` (a pergunta "rodo a adoção no angular-app" era ambígua) e foi **revertida**; o dono deixou claro que o site oficial não é alterado por testes. A adoção é feita numa **cópia escondida do git** (`site-factory/sandbox/johnnysouto/`) e entregue como patch; o `angular-app` só muda se o dono pedir para aplicar o patch.

## Adoção do padrão no `angular-app`, feita na cópia escondida (04/10/2026)

- **Onde:** `site-factory/sandbox/johnnysouto/` (cópia clonada do `HEAD`, ignorada pelo git). O `angular-app` oficial **não foi alterado** (a primeira tentativa direta nele foi revertida e conferida contra as cópias de antes: código, `package.json`, lockfile, `eslint.config.js`, `CLAUDE.md`, `AGENTS.md` e `angular.json` idênticos; `git status` vazio; build e 211 testes passando; uma pasta `coverage/` vazia que o teste do `builder` criou foi removida).
- **Resultado medido por mim na cópia:** `code-quality --mode enforce` **APROVADO** (263 testes, **100%** de cobertura nos 11 arquivos de lógica, lint, Stylelint, BEM, arquivos separados, tokens, specs); visual **idêntico** nas 6 capturas (pt-br desktop/mobile claro/escuro, en-us desktop, es-es mobile): geometria e medidas iguais ao retrato de antes; `verifier` completo APROVADO (build, auditoria, navegador nos 3 idiomas, smoke de interação do menu mobile); `npm audit --omit=dev` = 0.
- **Entrega:** `site-factory/sandbox/johnnysouto-quality-adoption.patch` (45 arquivos, +2221 −414). Prova de que aplica: `git apply --check` limpo sobre o `HEAD` atual, e a aplicação numa cópia temporária do `HEAD` reproduz a cópia final byte a byte. **Não aplicado.** O dono decide.
- **Avisos que restam (fora do escopo de `enforce`):** 17 specs de componente (política nova: testar só a lógica; nenhum foi apagado), 3 componentes com lógica demais na classe (`mobile-menu` 17 ramificações, antes 22; `contact-me` 6; `scroll-to-top` 5), 2 tokens sem uso (`--visible`, `--space-header-padding-y`), e `npm-audit-dev` com 8 altas (cadeia do Stylelint, risco aceito).
- **Pontos a conhecer antes de aplicar:** `about.html` não passa no `prettier --check` porque duas linhas `<li i18n>` foram mantidas em uma linha para não alterar o texto das traduções; o `extract-i18n` futuro reordena `messages.json` (cosmético, os IDs e textos não mudam); `package.json` ganha 3 devDependencies e o script `stylelint`, então depois de aplicar é preciso `npm ci`/`npm install`.
- **`quality.mode` do `johnnysouto` continua `report`:** passa a `enforce` só depois que o patch for aplicado ao oficial (hoje o oficial não cumpriria o portão).
- **Correção no motor:** o `verifier` só grava o relatório por cliente quando o projeto verificado é o dono do spec; verificar uma cópia não sobrescreve o relatório do site oficial.

## Decisão do dono do projeto (04/10/2026): o que fica como está

- Os avisos que restam no `angular-app` depois da adoção (17 specs de componente, 3 componentes com lógica demais na classe, 2 tokens sem uso) **ficam como estão**. O patch `site-factory/sandbox/johnnysouto-quality-adoption.patch` permanece guardado, **não aplicado**, até o dono pedir.
- Fases 0 a 6 concluídas. Resta a **fase 7** (template de repositório) e as opções por cliente que ela absorve (CI com `code-quality` e `verifier`). Tablet continua sem referência no Figma (breakpoint por conta do `builder`).

## Fase 7a: template de repositório preparado (04/10/2026)

- Decisão do dono: **o template é a fonte do motor**. Este repositório vira mais um cliente e recebe atualizações do template (`git remote add template <url>` + `git checkout template/main -- <caminhos do motor>`, ver `docs/template-setup.md` do template).
- `site-factory/template/export.mjs --out <dir vazio>` gera o template (75 arquivos, 316 KB) e o verifica: sem vazamento de dados do projeto pessoal, sem referência quebrada nos `.md`, arquivos obrigatórios presentes. `--verify <dir>` confere um template existente. Teste negativo: defeitos plantados são reprovados.
- `site-factory/bootstrap.mjs [--check]`: confere Node, Git, Chrome e a existência do token do Figma (sem ler o conteúdo), instala as dependências do verifier e do spec e valida o cliente `example`.
- Rodado a partir do template exportado: `bootstrap` ok, `status.mjs example` (etapa designer), `verify.mjs` com navegador, axe e smoke de interação aprovado numa página de teste, `figma-map.mjs map --from-file`, `code-quality.mjs` aprovado sobre um projeto Angular externo, `bootstrap --check` sem dependências só avisa (exit 0).
- Não provado ainda: CI opcional (`templates/ci/code-quality.yaml`) em repositório real, e o ciclo completo com outro Figma. Isso é a **fase 7b**, no repositório novo.

## Fase 7b: prova do template com outro Figma (OrangeBank, 04/10/2026)

Prova rodada numa **cópia descartável** gerada por `export.mjs`, com os agentes do pipeline (sem o MCP do Figma) e o Figma `OrangeBank` (só desktop/light, 10 seções, textos finais incompletos aprovados pelo dono). Resultado: pipeline completo até `verifier` APROVADO (build, `code-quality` 0/0, axe sem violação, smoke de interação, produção em 0 vulnerabilidades; 8 altas em dependência de desenvolvimento como aviso, risco aceito do `braces`). QA visual contra o Figma ainda não rodou. Documentos do cliente de prova: `site-factory/clients/orangebank/`; projeto: `site-factory/sandbox/orangebank/` (ignorado pelo git).

Lacunas achadas e **corrigidas na fonte** (com teste onde há lógica):

| Lacuna | Correção |
|---|---|
| O motor não exportava assets do Figma (35 marcadores no site) | `figma-map.mjs assets` + manifesto `assets.json` (lib testada); validado contra o Figma real |
| `--ready` exigia todas as seções `ready`; sem build parcial | status `deferred`; `--ready` exige ao menos uma `ready` (testes) |
| Pergunta opcional travava o `status.mjs` na etapa `intake` | `openQuestions` aceita `{text, blocking:false}` (testes) |
| `intake` perguntava "quem extrai o texto do Figma" | instrução do `intake` corrigida |
| Cores do Figma reprovavam WCAG AA e só apareciam no `verifier`, um ciclo por cor (5 ciclos) | `contrast.mjs` (lib testada) + seção "Contraste" do `designer` + o orquestrador leva ao dono antes do `builder` |
| Receita do projeto: `outputMode: static` deixava `server.ts`/`express`/`ssr.entry`/`serve:ssr` sem uso | receita do `builder` remove as sobras |
| Receita sem fonte | self-host por `@fontsource-variable` |
| `apply.mjs` só avisava que faltava `.nvmrc` | cria o `.nvmrc` (não em `--dry-run`) |
| Risco aceito do `braces` sem registro no template | registrado no `CHANGELOG` do template e no README do `verifier` |
| `status.mjs` mostrava `intake` sem bloqueio quando o validador não rodava (dependências ausentes) | mostra a causa real e manda rodar o `bootstrap` |
| Portão G2 deixa tudo em `draft` e parece travamento | skill `build-landing` explica e oferece `deferred` |

Lacunas que **continuam abertas**: o `status.mjs` não mede `contentRef` com sufixo `(id)` (formato do `designer`); o anel de foco de dois tons foi calculado, não visto no navegador; o brilho do hero depende do QA visual mobile; assets reais ainda não foram plugados no `orangebank` pelo `builder` (marcadores continuam).

## Fase 7b: fechamento da prova (OrangeBank, 04/10/2026)

**Resultado:** o pipeline completo rodou com outro Figma (`OrangeBank`, só desktop/light, 10 seções, textos finais incompletos aprovados) até `verifier` APROVADO, com 46 assets reais exportados do Figma, 5 rodadas de QA visual (rodada 1 com marcadores; rodadas 2 a 5 com correções), 22 decisões do dono respondidas por uma página de QA lado a lado (artifact com `db`) e `code-quality` 0/0. Pendências do cliente de prova (não do motor): licença das fotos de banco de imagem, URLs de loja e redes (`href="#"`), ação dos seletores de idioma e cidade, domínio (canonical), texto e logos de "Tecnologias", glow do hero abaixo do Figma (o contraste do título não permitiu mais).

Lacunas achadas depois do primeiro fechamento (rodadas de assets e QA) e **corrigidas na fonte**:

| Lacuna | Correção |
|---|---|
| O OK do axe escondia texto sobre imagem (o `verify.mjs` descartava `incomplete`) | novo check `a11y-contrast-manual` (aviso); validado contra o site real |
| `assets` re-exportava tudo e sobrescrevia imagens otimizadas | pula arquivo existente; `--force` sobrescreve (lib testada) |
| Coordenadas do Figma lidas como relativas ao grupo, não à seção (recorte deslocado 96 px) | regra no `builder` e no `designer` (dizer o nó de referência) |
| `button` sem ação definida passa em todos os checks | regra no `builder`: sem ação no spec, sem controle interativo; lista no relatório |
| Gradiente escuro para contraste exagerou (hero 20 a 30% mais escuro, faixa no header) | regra no `builder`: scrim mínimo, só sob o texto, sem borda reta; `designer` mede contra a imagem exportada |
| QA reaproveitou capturas da rodada anterior (antes e depois idênticos) | regra no `qa-visual`: capturas novas e md5 conferido |
| Otimização de imagem não estava no processo | regra no `builder` (WebP no tamanho de uso, antes e depois no build-log) |

**Lacunas ainda abertas no motor:**
- Pergunta ao dono sobre decisões recorrentes: o formulário por página (artifact com `db`) funcionou bem; falta transformá-lo em ferramenta do orquestrador (`/qa-visual` gera a página) em vez de montagem manual.
- O `figma-map.mjs` grava arquivos temporários em caminho relativo ao diretório atual quando chamado de dentro de `site-factory/` (o QA limpou `site-factory/site-factory/`).
- O `designer` não lê rotação nem filtros (saturação, blend) por padrão; foram pedidos caso a caso.
- Verificação de licença de imagem não existe: continua decisão do dono.
- Fluxo inverso (motor -> repositório template -> cliente) ainda manual (`export.mjs`, depois `git checkout template/main -- <caminhos>`).

## Refino de agentes e skills depois da prova (04/10/2026)

Pedido do dono: capturas do `verifier` sem imagens, `assets-extra.json` como remendo e decisões que se contradizem. Causas encontradas e correções:

| Problema | Causa real | Correção |
|---|---|---|
| Capturas de página inteira do `verifier` com áreas em branco (mobile e tema escuro) | 42 de 44 imagens eram `loading="lazy"`; o script não rolava a página antes de fotografar, e o smoke de interação recarrega a página antes da captura. O desktop claro só saía completo por acaso (a ordem dos checks já tinha rolado). **Não foi erro do `builder`** (lazy é o padrão correto do `NgOptimizedImage`) **nem do QA** (o recorte por elemento rola até ele) | `lib/lazy-images.mjs` (testado com Chrome): rola até o fim antes do check de imagem e antes da captura; verificado no site real |
| `broken-images: OK` sem prova | o check só olhava `complete && naturalWidth === 0`; imagem lazy que nem começou a carregar passava | o check agora rola, espera e lista imagem visível não carregada; imagem escondida por CSS não conta |
| Ninguém abria as capturas | `screenshots: OK` só dizia que o arquivo existia | o agente `verifier` abre ao menos o menor viewport e um tema escuro; `build-landing` e `docs/ai-instructions.md` do template dizem que check não substitui olhar |
| `assets-extra.json` | remendo meu: o comando antigo re-exportava tudo e sobrescreveria os WebP otimizados; contornei com um manifesto paralelo em vez de corrigir o comando | removido; o comando pula o que existe e reconhece webp/avif como a versão otimizada de jpg/png; regra explícita: **um manifesto por cliente**, o `builder` não cria manifestos nem exporta por conta própria, arquivos derivados vão para o build-log |
| `builder` rodou antes dos assets, o site nasceu com marcadores e precisou de outro ciclo | nada barrava | `status.mjs` exige `assets.json` e os arquivos antes de liberar o `builder` de um projeto novo (`{ "assets": [] }` declara design sem imagem) |
| Decisões D-16 (reproduzir brilho) e D-17 (gradiente escuro) se anulavam | o orquestrador viu o risco, avisou no chat e aplicou as duas | passo novo na skill `qa-visual`: conferir conflito entre decisões antes de aplicar e devolver ao dono com o efeito previsto |
| QA improvisava o lado a lado | nenhum script o gerava | `verifier/qa-compose.mjs` (Chrome do verifier, sem dependência nova) e passo no agente `qa-visual`; relatório em um lugar só (`reports/qa/<id>/report.md`) com a rodada anterior preservada |
| `designer` descobria rotação, blend, filtros e trechos de texto à mão a cada rodada | não havia ferramenta | `figma-map.mjs fx` (lib testada, reproduz os valores levantados à mão no OrangeBank) |
| `designer` ainda mandava usar o MCP do Figma | resíduo da primeira versão | agente reescrito: só scripts (REST), sem as ferramentas MCP; exige a seção "Decisões e divergências intencionais" e o nó de referência das coordenadas |
| `figma-map.mjs` gravava em `site-factory/site-factory/` | saída padrão relativa ao diretório atual | saída padrão sempre na raiz do repositório |
| Aviso do `npm-audit-dev` repetido a cada verificação, mandando triar de novo | risco já aceito e registrado | o agente `verifier` confere o `CHANGELOG.md` e reporta "risco aceito registrado" |
| `status.mjs` escondia a causa quando o validador não rodava | só lia linhas `- ` do erro | mostra a causa e manda rodar o `bootstrap` |

Lacunas abertas: a página de decisões com formulário (artifact + `db`) é montada à mão a cada rodada (falta uma ferramenta/modelo); `qa-capture` das variantes mobile/tablet não é refeito nas rodadas de desktop (a skill manda apagar ou marcar como antigo).

## Sincronismo fonte → template (04/10/2026)

`site-factory/template/sync.mjs` substitui o passo manual (exportar, `rsync`, `--verify`, testes). Provado: com o destino deformado de propósito (arquivo alterado à mão e pasta sobrando), o `sync` restaurou e removeu tudo, e o `--verify` e os 31 testes do motor passaram dentro do template. O commit inicial do template (nunca enviado) foi substituído por um único commit do estado final.

Lacuna aberta: o fluxo inverso para quem consome o template (`git checkout template/main -- <caminhos>`) ainda é manual e sem teste num repositório real; é o que a fase seguinte (um cliente criado do template e atualizado depois) deve provar.
