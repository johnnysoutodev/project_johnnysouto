---
name: changelog
description: Como manter o CHANGELOG.md da raiz (Keep a Changelog, versões SemVer, a partir de Conventional Commits). Use ao concluir uma feature ou correção, ao preparar uma release, ou quando pedirem para registrar a evolução do projeto.
---

# Manter o CHANGELOG.md

Arquivo único na **raiz** do repositório (`CHANGELOG.md`). Não use a pasta `public/` (nem a `public/` do projeto Angular): o que está lá é publicado no site.

## Quando atualizar

- **Junto com a mudança:** todo `feat`, `fix`, mudança incompatível ou remoção relevante ganha uma linha em `## [Não lançado]`, no mesmo PR (pode ser um commit `docs(changelog): ...` ao fim da série de commits atômicos). `chore`, `style`, `test` e `docs` internos só entram se alterarem algo que quem usa o projeto precise saber (ex.: nova ferramenta, regra de processo).
- **Na release:** renomeie `[Não lançado]` para `[x.y.z] - AAAA-MM-DD` (mesma versão do `package.json`/tag) e abra um novo `[Não lançado]` vazio acima.

## Formato

- Seções: **Adicionado**, **Alterado**, **Corrigido**, **Removido** (e **Segurança** quando houver). Omita as vazias.
- Uma linha por mudança, em português, escrita para humanos (o que mudou e por quê importa), não a mensagem do commit copiada. Sem hashes, sem dados sensíveis.
- Versões em ordem decrescente; a mais recente primeiro.

## Rascunho a partir dos commits

`git log $(git describe --tags --abbrev=0)..HEAD --no-merges --pretty='%s'` lista os commits desde a última tag. Mapeamento: `feat` → Adicionado; `fix` → Corrigido; `refactor`/`perf`/mudança de comportamento → Alterado; remoções → Removido. Cure o rascunho antes de gravar; não despeje a lista bruta.

## O que não é changelog

A narrativa detalhada de decisões, bugs e investigações (o "porquê" longo) continua nos logs de evolução dos documentos de plano (`docs/PLANO-MIGRACAO-ANGULAR.md`, `docs/design-system.md`). O changelog é o resumo por versão.
