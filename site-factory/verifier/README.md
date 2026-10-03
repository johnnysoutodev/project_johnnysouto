# Verifier

Checks executáveis para qualquer projeto Angular gerado pelo site-factory. Agente que usa isto: `.claude/agents/verifier.md`.

```bash
cd site-factory/verifier
npm install            # só na primeira vez (usa o Chrome já instalado, sem baixar navegador)
node verify.mjs --project ../../angular-app
```

| Check | O que pega |
|---|---|
| `build` | `npm run build`/`ng build` com prerender: erro de SSR, warnings (meta: zero) |
| `unit-tests`, `lint` | `ng test --watch=false`, `ng lint` |
| `platform-guards` | (aviso) globals de navegador sem guarda de plataforma |
| `console-errors`, `network-errors` | erros de console e respostas 4xx/5xx em cada página |
| `horizontal-overflow`, `broken-images` | layout quebrado em 375/768/1440 px |
| `a11y-axe` | axe WCAG 2.0/2.1 A e AA, em todos os idiomas, temas e viewports |
| `seo-basics` | (aviso) `lang`, `title`, description, h1 único, canonical |
| `keyboard-focus` | Tab pousando em elemento oculto/inert |

Idiomas são descobertos pelas pastas de `dist/*/browser/<locale>/index.html`; temas via `prefers-color-scheme`. Relatório e screenshots em `site-factory/reports/latest/` (ignorado pelo git).

Fora do escopo por enquanto: Lighthouse e comparação visual com o Figma.
