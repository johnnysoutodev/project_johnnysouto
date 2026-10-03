# Roadmap do site-factory

| Fase | Entrega | Status |
|---|---|---|
| 0 | Limpeza das instruções, `.mcp.json` com `angular-cli`, skill `angular-conventions` | Feita |
| 2 | `verifier` (build/SSR, testes, lint, axe, SEO, overflow, teclado, screenshots) | Feita |
| 1 | `site-spec.schema.json`, validador, template de brief, agente `intake` | Feita |
| 3 | `designer` e `builder` genéricos (substituem `angular-scaffold`/`angular-components`), skill `landing-sections`, formas de `content` por tipo no schema; `figma-map.mjs` (mapa de todas as páginas do Figma por API REST); campo `deploy` agnóstico de provedor; `CHANGELOG.md` + skill `changelog`; templates de deploy `vercel-static` e `aws-static` com `apply.mjs` (só o provedor escolhido); `figma-map.mjs check` (teste de obtenção de dados) | Feita; agentes ainda não exercitados de ponta a ponta |
| 4 | Orquestração `/build-landing <cliente>`, `status.mjs`, `strategist` pequeno e opcional, modo `contentMode: placeholder` (Lorem Ipsum) e prova com uma segunda landing (fictícia, `studio-aurora`) do zero, sem editar o motor | Feita: prova executada e aprovada (ver resultado abaixo) |
| 5 | **CI com Playwright:** rodar o `verifier` no GitHub Actions (Chrome já vem nos runners `ubuntu-latest`), bloqueando PR/deploy em falha; hoje o CI não faz build, teste nem lint | Em aberto — a conversar |
| 6 | **Regras de engenharia:** como escrever testes unitários e componentes, aprofundamento de clean code; provavelmente skills (`testing-conventions`, `clean-code`) consumidas por `builder` e `verifier` | Ideia — a conversar |
| 7 | **Template:** duplicar este projeto em outro repositório e transformá-lo em template (motor sem cliente: `.claude/` + `site-factory/` + regras gerais; clientes e o site do johnnysouto ficam fora) | Ideia — a conversar |

## Pendências conhecidas do verifier (candidatas à fase 5 ou depois)

- Lighthouse (performance) e comparação visual com o frame do Figma.
- Teste Playwright de interação por componente (ex.: abrir o menu mobile e checar foco); o check de teclado atual só vê o foco do Tab.

## Pontos a decidir na fase 5

- Em qual workflow roda (`Develop.yaml` no push, ou um workflow de PR), e se reprova o deploy ou só avisa.
- Como publicar o relatório e os screenshots (artifact do Actions).
- Tempo de execução: matriz completa (3 idiomas × 2 temas × 3 viewports) ou subconjunto no PR.

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
- Observação visual que nenhum check automático pega: no mobile o e-mail da seção de contato quebra no meio da palavra (`contato@studioa / urora.example`). Não é falha do verifier; é o tipo de coisa que a comparação visual com o Figma (fase 5/6) deveria cobrir.

## Estado das lacunas da prova (atualizado em 03/10/2026)

**Resolvidas e testadas:**

- **Vulnerabilidades no pipeline:** check `npm-audit` no verifier (crítica = falha; alta/moderada = aviso; sem rede = aviso, nunca aprovação silenciosa), testado com 5 saídas simuladas e com auditoria real nos dois projetos. `builder` reporta achados e não corrige sozinho; a skill `/build-landing` aciona `resolved-vulnerability` quando o check reprova; portão de `npm audit` crítico também no workflow de produção do `aws-static`; política de instalação no `builder` (`npm install` uma vez, lockfile versionado, `npm ci`, nada de `--force`/`--legacy-peer-deps` sem avisar).
- **Workflows no `.github/` real:** `apply.mjs` trata projeto de `site-factory/sandbox/` (ou `--standalone`) como raiz do próprio repositório. Testado: nenhum arquivo novo no `.github/` real.
- **Verifier:** relatório sempre em `site-factory/reports/latest/`; telas antigas apagadas a cada execução; prefixo `default_` com um idioma só; `horizontal-overflow` nomeia o elemento mais externo (testado: `div.miolo`); canonical só exigido quando o spec do cliente tem `project.domain`.
- **Builder (receita executada num projeto Angular novo, zero warnings):** `ng new NAME --directory=<caminho>` (nome não aceita `/`); `--ai-config=claude-code` (valor `claude` não existe); `ng add` falha com npm 12 (`EALLOWSCRIPTS`), então `npm i` + `ng generate <pacote>:ng-add`; lint por `npm i -D` + `site-factory/templates/angular/eslint.config.js` + target `lint`; `@angular/localize` mesmo com um idioma só; `sourceLocale` sem região (`pt`) e `lang` regional definido por `provideAppInitializer`; regra de i18n entre dados e template esclarecida na skill `landing-sections`.

**Ainda abertas:**

- Os ajustes do `builder` foram validados passo a passo num projeto novo, mas **não** por uma nova execução completa de `/build-landing`.
- Comparação visual com o Figma e testes de interação (menu, foco programático): fases 5/6.
- **`angular-app` (site em produção) tem 2 vulnerabilidades críticas e 3 altas**, todas com correção disponível (pacotes do próprio Angular, `piscina`, `brace-expansion`...). Decisão do dono do projeto; o `resolved-vulnerability` é o caminho. O workflow de produção atual bloqueia deploy com crítica.
- Ruído do npm 12 na instalação (`npm warn install-scripts ... fsevents`): não vem do build; reportado, não corrigido.
