# site-factory

Motor reutilizável para criar sites (hoje: landing pages) em Angular a partir de um brief (texto + link do Figma). O cliente fica em `clients/<id>/`; o motor nunca cita um cliente específico.

```
site-factory/
  templates/                      brief.template.md (formato do brief), site-spec.example-minimal.json (site pequeno de 2 seções)
  figma/                          figma-map.mjs: mapa recursivo de todas as páginas de um arquivo Figma (precisa de FIGMA_TOKEN)
  spec/                           site-spec.schema.json + validate.mjs (contrato entre as etapas)
  ROADMAP.md                      fases e status
  verifier/                       checks executáveis (build, a11y, SEO, layout, teclado)
  clients/<id>/                   brief.md, site-spec.json (um por cliente)
  reports/                        saída do verifier (ignorado pelo git)
```

Pipeline: `intake → designer → strategist → builder → verifier` (agentes em `.claude/agents/`, conhecimento em `.claude/skills/`). Hoje existem `intake`, `designer`, `builder` e `verifier`; o `strategist` ainda é decisão em aberto. Status das fases: `ROADMAP.md`.

```bash
cd site-factory/spec && npm install          # primeira vez
node validate.mjs ../clients/johnnysouto/site-spec.json [--ready]
```

Caso de teste atual: `clients/johnnysouto/` (site já migrado; seções com `status: migrated` e `contentRef`).
