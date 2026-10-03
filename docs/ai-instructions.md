# Regras para IAs neste repositório

> Conteúdo agnóstico de ferramenta, sem frontmatter. É a fonte única de verdade das instruções gerais deste projeto para qualquer assistente de IA (GitHub Copilot, Claude Code, ou outro). `CLAUDE.md` (raiz) e `.github/copilot-instructions.md` são apenas pontes que apontam para este arquivo — edite as regras aqui.

## Sobre o projeto

Site pessoal/currículo de Johnny Souto. Dois códigos convivem: o site legado estático (`src/`, HTML/CSS/JS + Materialize CSS, build via Grunt, publicado a partir de `public/`) e o novo site Angular em `angular-app/`, que o substituirá (migração em andamento, ver abaixo). Ambos fazem deploy na Vercel. Para o retrato completo do repositório (estrutura, stack, CI/CD, pendências), veja **`docs/ANALISE-PROJETO.md`** antes de propor mudanças estruturais — mantenha esse documento atualizado quando o projeto evoluir.

## Fluxo de branches e deploy

- Fluxo esperado: `feature/* → develop → main`.
- Push em `develop` dispara deploy de preview; push/merge em `main` dispara deploy de produção (ver `.github/workflows/`).
- `public/` é o artefato publicado (gerado a partir de `src/` via `grunt compile`/`grunt publish`) — o CI atualmente **não** roda o Grunt, então garanta que `public/` esteja sincronizado com `src/` antes de commitar mudanças no site.

## Commits

Siga Conventional Commits, com commits atômicos (uma mudança lógica por commit). O procedimento detalhado de agrupamento está em `docs/agent-rules/atomics-commits.md`.

## Changelog

Registre toda mudança relevante (`feat`, `fix`, remoções, mudanças de processo) em `CHANGELOG.md` (raiz), seção "Não lançado", no mesmo PR; na release, a seção vira a versão. Formato e rascunho a partir dos commits: skill `.claude/skills/changelog/SKILL.md`.

## Segurança de dependências

Vulnerabilidades reportadas por `npm audit` são resolvidas **sem forçar**, nesta ordem: (1) atualização compatível (`npm audit fix` sem `--force`, inclusive versão nova do Angular dentro da faixa do `package.json`); (2) subir a faixa de um pacote direto (patch/minor), com a família `@angular/*` inteira na mesma versão; (3) `overrides` só para dependência transitiva sem correção do pacote pai, limitado ao major seguro. Major e "sem correção" são reportados ao dono do projeto, não aplicados. Nunca `--force`, nunca apagar o lockfile. Procedimento completo em `docs/agent-rules/resolved-vulnerability.md`.

## Design e Figma

Specs de design (cores, tipografia, espaçamento, sombras, estrutura de seções) vêm de um arquivo Figma e são documentadas em `docs/design-system.md`, atualizado por merge incremental (nunca regerado do zero, para não perder notas e pendências já registradas). A extração via MCP do Figma é feita pelo agente `designer` (`.claude/agents/designer.md`).

## Lições da migração Angular

Bugs reais já ocorreram em `ThemeService` (SSR/prerender e estado persistido) e no menu mobile (`effect()` vs binding `[attr.inert]`). As regras derivadas deles vivem na skill `.claude/skills/angular-conventions/SKILL.md` — aplique-as a todo componente/serviço Angular novo. Resumo: guarda `isPlatformBrowser` para APIs de navegador, ler estado persistido antes do `effect()`, validar com `ng build` + prerender, teste unitário para lógica não-trivial, e `queueMicrotask()` para interação com DOM controlado por binding do mesmo signal.

## Migração Angular

O plano de migração para Angular (`docs/PLANO-MIGRACAO-ANGULAR.md`) já está em andamento — decisões de arquitetura, versão e nome de diretório ficam registradas lá, não devem ser repetidas de memória. Scaffold do projeto e geração dos componentes (a partir do `docs/design-system.md` e do `site-spec.json`) são feitos pelo agente `builder` (`.claude/agents/builder.md`), que consome o design já extraído pelo `designer`.

## Agentes personalizados

Dois grupos. **Pipeline de sites** (Claude Code, prompt direto em `.claude/agents/`): `intake`, `designer`, `builder`, `verifier`, com contratos e templates em `site-factory/` (ver `site-factory/README.md`) e conhecimento reutilizável em `.claude/skills/`. **Procedimentos compartilhados com o Copilot** (`atomics-commits`, `resolved-vulnerability`): conteúdo em `docs/agent-rules/`, com pontes em `.github/agents/` e `.claude/agents/`. Detalhes e como adicionar agentes desse segundo grupo: `docs/agent-rules/README.md`.

## Uso eficiente de tokens

Minimize o consumo de tokens em todas as interações, sem sacrificar corretude:

- Respostas curtas e diretas — sem repetir informação que já foi dada na conversa, sem seções/resumos redundantes.
- Ao ler arquivos, prefira ler só o trecho relevante (offset/limit, busca direcionada) em vez do arquivo inteiro, quando o arquivo for grande e a dúvida for pontual.
- Ao consultar ferramentas com saída potencialmente grande (ex.: `get_metadata` do Figma, logs extensos), salve em arquivo e consulte com `grep`/`jq` em vez de carregar tudo no contexto de uma vez — mesmo princípio já usado em `.claude/agents/designer.md`.
- Não cole de volta pro usuário trechos grandes de arquivo/diff que ele já pode ver — referencie por caminho e número de linha.
- Não gere documentação, comentários de código ou explicações não pedidas explicitamente.

## Convenções gerais

- O site Angular (`angular-app/`) é multilíngue: pt-BR (idioma-fonte), en-US e es-ES, via i18n nativo do Angular. Ao editar ou criar textos visíveis, escreva em português e marque com `i18n`/`i18n-aria-label`/`i18n-alt` (templates) ou `$localize` com ID `@@...` (TS); depois rode `npm run extract-i18n` e adicione a tradução nas 3 pastas de `angular-app/src/locale/` (`messages.json`, `messages.en-US.json`, `messages.es-ES.json`) — o build falha se faltar. O site legado (`src/pt/` e `src/en/`) segue apenas em português/inglês, sem mudanças.
- Stack: o site legado (`src/`) é vanilla + Materialize e está congelado (só correções). Todo código novo é Angular em `angular-app/` (boas práticas oficiais em `angular-app/CLAUDE.md`). Não introduza outro framework (React, Vue etc.) sem alinhar com o Johnny antes.
