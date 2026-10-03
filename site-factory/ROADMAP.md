# Roadmap do site-factory

| Fase | Entrega | Status |
|---|---|---|
| 0 | Limpeza das instruções, `.mcp.json` com `angular-cli`, skill `angular-conventions` | Feita |
| 2 | `verifier` (build/SSR, testes, lint, axe, SEO, overflow, teclado, screenshots) | Feita |
| 1 | `site-spec.schema.json`, validador, template de brief, agente `intake` | Feita |
| 3 | `designer` e `builder` genéricos (substituem `angular-scaffold`/`angular-components`), skill `landing-sections`, formas de `content` por tipo no schema; `figma-map.mjs` (mapa de todas as páginas do Figma por API REST); campo `deploy` agnóstico de provedor; `CHANGELOG.md` + skill `changelog`; templates de deploy `vercel-static` e `aws-static` com `apply.mjs` (só o provedor escolhido); `figma-map.mjs check` (teste de obtenção de dados) | Feita; agentes ainda não exercitados de ponta a ponta |
| 4 | Orquestração `/build-landing <cliente>`, `status.mjs`, `strategist` pequeno e opcional, modo `contentMode: placeholder` (Lorem Ipsum) e prova com uma segunda landing (fictícia, `studio-aurora`) do zero, sem editar o motor | Ferramentas prontas; prova ainda não executada |
| 5 | **CI com Playwright:** rodar o `verifier` no GitHub Actions (Chrome já vem nos runners `ubuntu-latest`), bloqueando PR/deploy em falha; hoje o CI não faz build, teste nem lint | Em aberto — a conversar |
| 6 | **Regras de engenharia:** como escrever testes unitários e componentes, aprofundamento de clean code; provavelmente skills (`testing-conventions`, `clean-code`) consumidas por `builder` e `verifier` | Ideia — a conversar |

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
