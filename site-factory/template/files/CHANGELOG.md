# Changelog

Todas as mudanças relevantes do projeto. Formato [Keep a Changelog](https://keepachangelog.com/pt-BR/1.1.0/), versões [SemVer](https://semver.org/lang/pt-BR/). Regras de manutenção: skill `.claude/skills/changelog/SKILL.md`.

## [Não lançado]

### Adicionado
- Repositório criado a partir do template do site-factory.

### Segurança
- Risco aceito: GHSA-vfj7-8cjw-p6xm (`braces <= 3.0.3` via Stylelint, 8 achados altos), sem correção publicada e só em dependência de desenvolvimento (produção em 0). Alternativas avaliadas e reprovadas em 04/10/2026: Biome e oxlint (não processam SCSS), sass-lint (abandonado, audit reprova). O Stylelint segue como portão de SCSS, porque as regras BEM e de tokens são obrigatórias. Reavaliar quando o `braces` ou o Stylelint publicarem correção.
