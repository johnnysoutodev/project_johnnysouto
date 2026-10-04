# site-factory

Motor reutilizável para criar sites (hoje: landing pages) em Angular a partir de um brief (texto + link do Figma). O cliente fica em `clients/<id>/`; o motor nunca cita um cliente específico.

```
site-factory/
  templates/                      brief.template.md (formato do brief), site-spec.example-minimal.json (site pequeno de 2 seções)
  figma/                          figma-map.mjs: mapa recursivo de todas as páginas de um arquivo Figma (token em ~/.config/site-factory/.env ou FIGMA_TOKEN)
  deploy-templates/               templates de deploy por provedor (vercel-static, aws-static) + apply.mjs
  templates/angular/              eslint.config.js, stylelint.config.cjs e styles/_breakpoints.scss copiados para cada projeto
  spec/                           site-spec.schema.json + validate.mjs (contrato entre as etapas)
  status.mjs                      etapa do pipeline de um cliente, descoberta pelos artefatos (node status.mjs <id>)
  ROADMAP.md                      fases e status
  verifier/                       checks executáveis (build, a11y, SEO, layout, teclado)
  clients/<id>/                   brief.md, site-spec.json (um por cliente)
  reports/                        saída do verifier (ignorado pelo git)
```

Pipeline: `intake → designer → strategist → builder → verifier` (agentes em `.claude/agents/`, conhecimento em `.claude/skills/`). Hoje existem `intake`, `designer`, `strategist` (pequeno e opcional), `builder` e `verifier`. A skill `/build-landing <id>` conduz tudo, com três portões humanos (G1 respostas do cliente, G2 aprovação de textos finais, G3 relatório do verifier) e é retomável via `status.mjs`. Status das fases: `ROADMAP.md`.

```bash
cd site-factory/spec && npm install          # primeira vez
node validate.mjs ../clients/<cliente>/site-spec.json [--ready]
```

Cliente-exemplo que acompanha o template: `clients/example/` (brief e spec de uma landing de duas seções). Para um site já existente, as seções ficam com `status: migrated` e `contentRef`.

## Testar a obtenção de dados do Figma

```bash
node site-factory/figma/figma-map.mjs check --spec site-factory/clients/<id>/site-spec.json
```

Confere se cada `figmaNode` do spec existe no arquivo (nome, tipo e tamanho impressos); código de saída 1 se algum faltar. Arquivos de página única também funcionam: o tipo da página é só uma dica, e o `map` lista os frames com cara de página para o `designer` descer até as seções.

## Assets e contraste (designer)

```bash
node site-factory/figma/figma-map.mjs assets --spec site-factory/clients/<id>/site-spec.json   # exporta o que está em clients/<id>/assets.json
node site-factory/figma/contrast.mjs '#ffffff' '#ff823d' text '#1d232a' '#ff823d'              # contraste WCAG de pares de cor (text 4,5:1; large e ui 3:1)
```

`assets.json` lista `{ id, node, category, format }`; os arquivos vão para `<projectDir>/public/assets/<categoria>/`. O `contrast.mjs` é como o designer confere, antes do `builder`, as cores do Figma.

## Build parcial e perguntas opcionais

- Seção `status: deferred`: adiada pelo dono; o `builder`, o `status.mjs` e o `verifier` a ignoram. Serve para o dono aprovar só parte do conteúdo.
- `openQuestions` aceita texto (bloqueante) ou `{ "text": "...", "blocking": false }` (opcional: não trava o `status.mjs` nem o `--ready`).
- `validate.mjs --ready` exige nenhuma pergunta bloqueante, nenhuma seção `draft` e ao menos uma `ready`.

Testes do motor: `node --test site-factory/spec/validate.test.mjs site-factory/figma/lib/*.test.mjs`.

## Token do Figma

`figma/figma-map.mjs` precisa de um Personal access token (Figma > Settings > Security, escopo `file_content:read`). Guarde **fora do repositório**:

```bash
mkdir -p ~/.config/site-factory && chmod 700 ~/.config/site-factory
read -s T && printf 'FIGMA_TOKEN=%s\n' "$T" > ~/.config/site-factory/.env && chmod 600 ~/.config/site-factory/.env; unset T
```

A variável de ambiente `FIGMA_TOKEN` tem prioridade sobre o arquivo. Nunca cole o token no chat nem salve em arquivo do projeto.

## QA visual

`/qa-visual <cliente> [variante] [secoes]` conduz o ciclo olhar, decidir, ajustar, repetir.

```bash
node site-factory/figma/figma-map.mjs variants --url <figma>          # variantes do design (desktop/mobile x light/dark)
node site-factory/figma/figma-map.mjs image --spec <spec> --variant desktop-light   # referencia do Figma em PNG, por secao
node site-factory/verifier/qa-capture.mjs --project <projeto> --variant desktop-light   # recortes, medidas e achados automaticos
```

Saídas em `site-factory/reports/qa/<cliente>/<variante>/` e `site-factory/reports/figma/<fileKey>/ref/` (ignoradas pelo git); o relatório de análise fica em `clients/<cliente>/qa-report.md`.

## Padrão de código

A skill `.claude/skills/clean-code-angular` define o padrão obrigatório (testes só na lógica com 100% de cobertura, HTML e SCSS separados, SCSS em BEM, tokens e breakpoints centralizados). O portão que o impõe, sem navegador: `node site-factory/verifier/code-quality.mjs --project <projeto>`. Projeto legado entra com `quality.mode: "report"` no spec.
