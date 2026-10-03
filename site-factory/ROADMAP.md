# Roadmap do site-factory

| Fase | Entrega | Status |
|---|---|---|
| 0 | Limpeza das instruções, `.mcp.json` com `angular-cli`, skill `angular-conventions` | Feita |
| 2 | `verifier` (build/SSR, testes, lint, axe, SEO, overflow, teclado, screenshots) | Feita |
| 1 | `site-spec.schema.json`, validador, template de brief, agente `intake` | Feita |
| 3 | `designer` e `builder` genéricos (substituem `angular-scaffold`/`angular-components`), skill `landing-sections`, formas de `content` por tipo no schema | Feita; agentes ainda não exercitados de ponta a ponta |
| 4 | Orquestração `/build-landing <cliente>` e prova com uma segunda landing (fictícia) do zero, sem editar o motor. Inclui decidir o `strategist` (seções, copy, SEO) | A decidir |
| 5 | **CI com Playwright:** rodar o `verifier` no GitHub Actions (Chrome já vem nos runners `ubuntu-latest`), bloqueando PR/deploy em falha; hoje o CI não faz build, teste nem lint | Planejada (a detalhar) |

## Pendências conhecidas do verifier (candidatas à fase 5 ou depois)

- Lighthouse (performance) e comparação visual com o frame do Figma.
- Teste Playwright de interação por componente (ex.: abrir o menu mobile e checar foco); o check de teclado atual só vê o foco do Tab.

## Pontos a decidir na fase 5

- Em qual workflow roda (`Develop.yaml` no push, ou um workflow de PR), e se reprova o deploy ou só avisa.
- Como publicar o relatório e os screenshots (artifact do Actions).
- Tempo de execução: matriz completa (3 idiomas × 2 temas × 3 viewports) ou subconjunto no PR.
