# Roadmap do template

Estado herdado da extração (o motor chegou aqui provado em dois clientes, um de produção e um fictício). O que segue são os itens abertos e as opções por cliente.

## Em aberto

- **Tablet:** o Figma costuma ter só mobile e desktop; o breakpoint intermediário fica por conta do `builder` (`site-factory/templates/angular/styles/_breakpoints.scss`).
- **Templates de deploy:** `vercel-static` e `aws-static` estão `untested` até rodarem em um repositório ou conta reais; Azure, Netlify, Cloudflare Pages e o modo `server` não existem (procedimento para adicionar em `site-factory/deploy-templates/README.md`).
- **Lighthouse** (performance) e **comparação visual por imagem** com o Figma: não implementados (o QA visual compara por geometria e medidas).
- **Interação por componente além do padrão** (formulários, carrossel): pede teste do próprio componente; o smoke do `verifier` cobre só a semântica padrão do DOM.

## Opções por cliente

- **CI com `code-quality`:** `site-factory/templates/ci/code-quality.yaml` (sem navegador). Copie para `.github/workflows/` e ajuste `PROJECT_DIR`.
- **CI com `verifier` completo** (navegador): só quando houver mais gente no repositório ou o cliente quiser a verificação automática.

## Aprendizados que viajam com o template

- Medir antes de afirmar (visual idêntico = geometria e medidas iguais, antes e depois).
- Agente que recusa contornar uma regra errada vale mais que agente que a desliga: trate o conflito reportado como defeito do motor.
- Opções oferecidas ao dono precisam ter o resultado esperado mostrado de forma consistente.
- Conferir o `HEAD` contra uma cópia do estado de antes antes de reverter qualquer coisa; auditar artefatos ignorados pelo git (`dist`, `node_modules`, `coverage`) e deriva de lockfile, não só o `git status`.
