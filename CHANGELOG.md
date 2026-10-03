# Changelog

Todas as mudanças relevantes do projeto. Formato [Keep a Changelog](https://keepachangelog.com/pt-BR/1.1.0/), versões [SemVer](https://semver.org/lang/pt-BR/). Regras de manutenção: skill `.claude/skills/changelog/SKILL.md`.

## [Não lançado]

### Adicionado
- `site-factory/`: motor reutilizável para criar landing pages em Angular a partir de um brief (texto + link do Figma). Inclui o contrato `site-spec.json` (schema + validador), o `verifier` com Playwright e axe, template de brief e o mapeador de Figma por API REST (todas as páginas do arquivo; token em `~/.config/site-factory/.env`, fora do repositório).
- Agentes `intake`, `designer`, `builder` e `verifier` em `.claude/agents/`; skills `angular-conventions`, `landing-sections` e `changelog`.
- Templates de deploy `vercel-static` e `aws-static` (S3 + CloudFront via CloudFormation, role OIDC do GitHub, workflows) em `site-factory/deploy-templates/`, aplicados por `apply.mjs` só para o provedor escolhido no spec; não criam workflows se o repositório já tem deploy do mesmo provedor.
- `figma-map.mjs check`: confere se cada `figmaNode` do spec existe no Figma.
- Campo `locales.fallback` no `site-spec` (idioma para quem não tem cookie nem `Accept-Language` conhecido).
- Agente `strategist` (pequeno e opcional), skill `/build-landing <cliente>` (pipeline retomável com três portões humanos) e `site-factory/status.mjs` (etapa do pipeline descoberta pelos artefatos).
- Modo `project.contentMode: placeholder` (Lorem Ipsum de tamanho realista): o spec só aceita Lorem nesse modo e o verifier avisa se ele aparecer no site (`placeholder-content`).
- Prova do pipeline com o cliente fictício `studio-aurora` (landing de 3 seções, deploy AWS estático, textos em Lorem Ipsum): verifier completo aprovado sem alterar o motor. Resultado e lacunas em `site-factory/ROADMAP.md`.
- Campo `deploy` no `site-spec` (provedor, formato do build, ambientes), para o pipeline ser agnóstico de provedor.
- Servidor MCP `angular-cli` no `.mcp.json` da raiz.

### Alterado
- Agente `resolved-vulnerability` reescrito: escada de preferência (atualização compatível com a família `@angular/*` junta, depois faixa de pacote direto, `overrides` só para transitivo sem correção do pai), nunca `--force`, major e "sem correção" reportados e não aplicados. Ensaiado e executado no `angular-app`.
- Verifier: novo check `npm-audit`; relatório sempre em `site-factory/reports/latest/`; telas limpas a cada execução; overflow nomeia o elemento culpado; canonical conhece o spec do cliente.
- `builder`: receita de criação de projeto validada em projeto novo (flags do `ng new`, lint, `$localize`, `sourceLocale`, `lang`), política de instalação e de auditoria; template de ESLint em `site-factory/templates/angular/`.
- `apply.mjs`: projeto de sandbox é tratado como raiz do próprio repositório; workflows AWS de produção ganham portão de `npm audit` crítico.
- Schema do `site-spec`: seção `draft` pode ter só estrutura; conteúdo mínimo passa a ser exigido apenas em `ready`/`migrated`.
- `designer` e `builder` generalizados; `angular-scaffold` e `angular-components` foram fundidos no `builder`.
- Lições de bugs de Angular e CSS saíram de `docs/ai-instructions.md` para a skill `angular-conventions`.
- `docs/ai-instructions.md`: descreve o legado e o Angular convivendo e deixa de proibir Angular.

### Segurança
- `angular-app`: atualizada a família `@angular/*` para 22.2.1 (dentro de `^22.1.0`) e aplicado `npm audit fix` sem `--force`, zerando o `npm audit` (antes: 2 críticas, 3 altas, 2 moderadas). Corrige DoS por SSR no `@angular/router` e no `@angular/platform-server`, prototype pollution/RCE no `piscina` (via `@angular/build`), DoS no `brace-expansion` e falhas no `fast-uri` e no `ip-address`. Só o `package-lock.json` mudou; sem `overrides`.

### Removido
- `docs/design-tokens.css`: duplicado e desatualizado; os tokens vivem em `angular-app/src/styles/_tokens.scss`.
- Procedimentos e pontes antigos de `designer`, `angular-scaffold` e `angular-components` em `docs/agent-rules/` e `.github/agents/`.

## [2.3.1] - 2026-09-28

### Adicionado
- Capturas do site em PDF.

### Corrigido
- PDFs do currículo completos e conteúdo do currículo sincronizado com o site.

## Histórico anterior

Versões anteriores estão nas tags do git (`v1.0.0` a `v2.3.0`). A narrativa detalhada da migração para Angular (decisões, bugs e correções, 06–09/2026) está no "Log de evolução" de `docs/PLANO-MIGRACAO-ANGULAR.md` e de `docs/design-system.md`; esses registros ficam onde estão.
