# site-factory (template)

Motor de agentes e skills que cria **landing pages em Angular** a partir de um brief em texto e de um arquivo do Figma, e depois verifica o resultado de forma objetiva. Foi provado em dois clientes (um site em produção e um fictício) antes de virar template.

```
brief + link do Figma
   -> intake -> designer -> strategist -> builder -> verifier      (/build-landing <cliente>)
                                   ajuste visual: qa-visual <-> builder   (/qa-visual <cliente>)
```

O que ele garante:

- **Contrato único** (`site-spec.json`) entre os agentes, validado por schema.
- **Design real**: o `designer` lê o arquivo do Figma inteiro (todas as páginas) pela API, mapeia desktop, mobile e dark, e extrai as medidas.
- **Padrão de código imposto por ferramenta**: HTML e SCSS separados, BEM, tokens e breakpoints centralizados, testes só na lógica com 100% de cobertura (`code-quality`).
- **Verificação**: build com prerender, acessibilidade (axe), SEO, layout, smoke de interação (menu, foco, âncoras), auditoria de dependências.
- **QA visual** comparando o render com o Figma por geometria e medidas, com você decidindo só o que depende de gosto.
- **Deploy por provedor** (Vercel, AWS): só os arquivos do provedor escolhido.

## Começar

```bash
node site-factory/bootstrap.mjs      # confere Node, Git, Chrome e token do Figma; instala o motor
```

Depois, `docs/template-setup.md` (token do Figma, primeiro cliente, `/build-landing`).

## Mapa

| Pasta | O que é |
|---|---|
| `.claude/agents/`, `.claude/skills/` | agentes do pipeline e conhecimento reutilizável (padrão de código, catálogo de seções, convenções Angular) |
| `site-factory/` | o motor: `spec/` (contrato), `verifier/` (verificação e QA), `figma/`, `deploy-templates/`, `templates/`, `status.mjs`, `clients/<cliente>/` |
| `docs/ai-instructions.md` | regras gerais para qualquer IA (fonte única; `CLAUDE.md` e `.github/copilot-instructions.md` são pontes) |
| `docs/agent-rules/` | procedimentos compartilhados com o Copilot (commits atômicos, vulnerabilidades) |

Guia do motor: `site-factory/README.md`. Roadmap e itens em aberto: `site-factory/ROADMAP.md`.
