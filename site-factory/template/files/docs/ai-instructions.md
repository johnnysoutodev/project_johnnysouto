# Regras para IAs neste repositório

> Conteúdo agnóstico de ferramenta, sem frontmatter. É a fonte única de verdade das instruções gerais para qualquer assistente de IA (Claude Code, GitHub Copilot ou outro). `CLAUDE.md` (raiz) e `.github/copilot-instructions.md` são apenas pontes que apontam para este arquivo: edite as regras aqui.

## Sobre o repositório

Template do **site-factory**: um motor de agentes e skills que cria sites (hoje, landing pages em Angular) a partir de um brief em texto e de um arquivo do Figma, e depois verifica o resultado. Este repositório guarda o **motor** (`.claude/`, `site-factory/`, `docs/`) e, em `site-factory/clients/<cliente>/`, o brief e os artefatos de cada cliente. O projeto Angular de cada cliente mora na pasta indicada por `build.projectDir` no `site-spec.json`. Visão geral e primeiros passos: `site-factory/README.md` e `docs/template-setup.md`.

## O pipeline

`intake → designer → strategist → builder → verifier`, mais o ciclo de ajuste visual `qa-visual → builder`. Cada agente é especialista na sua parte (`.claude/agents/`); o contrato entre eles é o `site-spec.json` (`site-factory/spec/`). Dois fluxos conduzem tudo, a partir da sessão principal: `/build-landing <cliente>` (criar) e `/qa-visual <cliente>` (conferir e ajustar o visual). O estado de cada cliente é descoberto pelos artefatos: `node site-factory/status.mjs <cliente>`.

**O orquestrador não faz o trabalho dos agentes.** Ele aciona, repassa perguntas e respostas e verifica o resultado de forma independente. Triagem de vulnerabilidade, extração de design, geração de componentes, análise visual: cada um tem o seu agente.

## Regras que valem sempre

1. **Nunca `git commit` nem `git push` sem pedido explícito do dono naquele turno.** Os agentes deixam as mudanças no working tree. Para commits atômicos use o agente `atomics-commits` (`docs/agent-rules/atomics-commits.md`), a pedido.
2. **O site oficial de um cliente (o projeto em produção) é somente leitura** para experimento, adoção de padrão, refatoração e teste do pipeline. Esse trabalho é feito numa **cópia escondida do git** em `site-factory/sandbox/<cliente>/` (`cp -cR` no macOS ou `cp -R --reflink=auto` no Linux clona o projeto, com `node_modules`, em segundos) e entregue como **patch para revisão**. O oficial só muda quando o dono pedir explicitamente para aplicar o patch. Pergunta ambígua ("rode no projeto") não é autorização: confirme.
3. **Vulnerabilidade de dependência vai para o agente `resolved-vulnerability`**, que faz a triagem e percorre a escada: atualização compatível, faixa de pacote direto, `overrides` para transitivo e, sem correção publicada, trocar a biblioteca (com protótipo isolado). Nunca `--force`, nunca apagar o lockfile. Nada de analisar `npm audit` à mão no orquestrador nem de classificar achado como "fora de escopo".
4. **Terminal limpo:** build, teste e serve terminam com **zero warnings e zero erros**. Corrija a causa; não explique como inofensivo. Se um aviso não puder sumir sem um custo real (ex.: vulnerabilidade sem correção publicada em ferramenta de desenvolvimento), isso é decisão do dono, registrada: não deixe o aviso ali em silêncio.
5. **Segredo nunca no repositório nem no chat.** O token do Figma fica em `~/.config/site-factory/.env` (fora do repositório, `chmod 600`) ou na variável `FIGMA_TOKEN`. Não leia nem exiba esse arquivo.
6. **Medir antes de afirmar.** Refatoração prova "visual idêntico" com números antes e depois (`site-factory/verifier/qa-capture.mjs`); correção de layout prova com a geometria do Figma (`figma-map.mjs layout`) contra a do DOM; "passou" é a saída do verificador, não o relato de um agente.

## Padrão de código

Obrigatório para todo projeto Angular gerado: skill `.claude/skills/clean-code-angular/SKILL.md` (HTML e SCSS sempre separados, SCSS em BEM amarrado a tokens e breakpoints, TypeScript sem `any`, função até 50 linhas, testes só na lógica com 100% de cobertura e teste primeiro). Ele vence qualquer orientação genérica do `CLAUDE.md` que o Angular CLI gera. O portão que o impõe, sem navegador: `node site-factory/verifier/code-quality.mjs --project <projeto>`. Lições de bugs reais (SSR, `effect()`, foco): skill `angular-conventions`. Projeto legado entra com `quality.mode: "report"` no spec e migra para `enforce` quando adotar o padrão.

## Verificação

`node site-factory/verifier/verify.mjs --project <projeto>`: build com prerender, `code-quality`, auditoria separada em produção e desenvolvimento (crítica barra em ambas), axe WCAG, SEO, layout, smoke de interação (menus, foco, âncoras) e telas. Guia completo: `site-factory/verifier/README.md`.

## Changelog

Registre toda mudança relevante (`feat`, `fix`, remoções, mudanças de processo) em `CHANGELOG.md` (raiz), seção "Não lançado", no mesmo PR. Formato e rascunho a partir dos commits: skill `.claude/skills/changelog/SKILL.md`.

## Agentes personalizados

Dois grupos. **Pipeline de sites** (Claude Code, prompt direto em `.claude/agents/`): `intake`, `designer`, `strategist`, `builder`, `verifier`, `qa-visual`, `resolved-vulnerability`. **Procedimentos compartilhados com o Copilot** (`atomics-commits`, `resolved-vulnerability`): conteúdo em `docs/agent-rules/`, com pontes em `.github/agents/` e `.claude/agents/`. Como adicionar agentes desse segundo grupo: `docs/agent-rules/README.md`.

## Uso eficiente de tokens

- Respostas curtas e diretas, sem repetir o que já foi dito.
- Leia só o trecho relevante de arquivos grandes; saídas grandes (metadados do Figma, logs) vão para arquivo e se consulta com `grep`/`jq`.
- Não cole de volta trechos grandes que o usuário já vê: referencie por caminho e linha.
- Subagente com escopo apertado: o custo de recarregar contexto é o que mais pesa. Faça direto o que o orquestrador já consegue fazer com as próprias ferramentas, exceto o que tem agente dono (regra 3 e o pipeline).
- Não gere documentação, comentários ou explicações não pedidas.

## Convenções gerais

- **i18n:** texto visível no idioma-fonte, marcado com `i18n`/`i18n-aria-label`/`i18n-alt` (templates) ou `$localize` com ID `@@...` (TS); depois `ng extract-i18n` e a tradução de cada idioma-alvo. O build falha se faltar tradução (`i18nMissingTranslation: error`). Configuração: `site-factory/templates/angular/i18n-multilocale.md`.
- **Stack:** Angular. Não introduza outro framework front-end sem alinhar com o dono.
- **Provedor de deploy:** vem do `site-spec.json` (`deploy`); só os arquivos do provedor escolhido são gerados (`site-factory/deploy-templates/`).
