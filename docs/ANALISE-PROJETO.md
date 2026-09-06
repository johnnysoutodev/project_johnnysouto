# Análise do Projeto — project_johnnysouto

> Documento vivo. Objetivo: manter um retrato atualizado de tudo que existe hoje no repositório, para servirmos de base à evolução incremental do projeto. Cada nova sessão de trabalho deve atualizar este arquivo em vez de recriar o contexto do zero.

**Última atualização:** 06/09/2026

---

## 1. Visão geral

O repositório hospeda o site pessoal/currículo de Johnny Souto, publicado em **https://www.johnnysouto.com.br**. É um site estático (HTML/CSS/JS puro, sem framework de front-end reativo), construído com o tema **Materialize CSS** e um pipeline de build baseado em **Grunt**. O deploy é feito na **Vercel**, com pipeline de CI/CD via **GitHub Actions**.

## 2. Estrutura de diretórios

```
project_johnnysouto/
├── .claude/
│   └── agents/               # Arquivos-ponte dos agentes para o Claude Code
├── .github/
│   ├── workflows/            # Pipelines de CI/CD (GitHub Actions)
│   ├── agents/                # Arquivos-ponte dos agentes para o GitHub Copilot
│   └── copilot-instructions.md
├── .vscode/
│   └── mcp.json              # Config de servidor MCP (Figma) para uso no editor
├── .vercel/                  # Metadados do projeto Vercel (IDs de projeto/org)
├── docs/                     # Documentação do projeto
│   └── agent-rules/          # Conteúdo real e agnóstico dos agentes (fonte única de verdade)
├── public/                  # Saída de build (gerada pelo Grunt) — o que é de fato deployado
├── src/                     # Código-fonte do site (HTML/CSS/JS/imagens)
├── app/                     # Diretório NÃO rastreado pelo git — ver seção 8 (pendências)
├── gruntfile.js             # Definição das tasks de build (Grunt)
├── package.json / package-lock.json
├── vercel.json              # Config de deploy na Vercel
├── .nvmrc                   # Versão do Node usada (20)
├── .gitattributes           # Normalização de line endings (LF)
├── .gitignore
├── project_johnnysouto.code-workspace  # Workspace do VS Code (config do Live Server)
├── temp.log                 # Arquivo vazio (residual)
└── README.md
```

### 2.1 `src/` — código-fonte

| Caminho | Conteúdo |
|---|---|
| `src/index.html` | Página principal do site (currículo/CV), em português, com meta tags de SEO/Open Graph e Google Analytics (gtag). |
| `src/pt/index.html` | Versão em português (rota `/pt`). |
| `src/en/index.html` | Versão em inglês (rota `/en`). |
| `src/printer/index.html` | Versão do CV otimizada para impressão. |
| `src/css/materialize.css` | Framework Materialize CSS (vendor). |
| `src/css/style.css` | Estilos customizados do site. |
| `src/css/printer.css` | Estilos específicos da versão de impressão. |
| `src/js/materialize.js` | Framework Materialize JS (vendor). |
| `src/js/fontawesome.js` | Ícones Font Awesome (vendor). |
| `src/js/app.js` | Lógica customizada da aplicação. |
| `src/js/init.js` | Script de inicialização, referenciado diretamente no `<body>` do `index.html`. |
| `src/js/analytics.js` | Integração de analytics. |
| `src/images/` | Imagens do site (`bg.png`, `perfil_jjns.jpeg`). |
| `src/robots.txt` | Diretivas para crawlers. |

### 2.2 `public/` — saída de build

Espelha a estrutura de `src/`, mas com JS/CSS concatenados e minificados (`scripts.min.js`, `styles.min.css`) e imagens otimizadas. É o diretório apontado como `outputDirectory` no `vercel.json` — ou seja, é o artefato que efetivamente vai para produção.

## 3. Stack técnica

- **Front-end:** HTML5, CSS3, JavaScript vanilla, Materialize CSS, Font Awesome.
- **Build/automação:** Grunt 1.6.1, com os plugins:
  - `grunt-contrib-clean`, `grunt-contrib-concat`, `grunt-contrib-copy`, `grunt-contrib-cssmin`, `grunt-contrib-uglify`, `grunt-contrib-watch`, `grunt-image`.
- **Dependências de desenvolvimento adicionais** (`devDependencies`, aparentemente não usadas diretamente pelo `gruntfile.js` atual): `clean-css`, `fs-extra`, `html-minifier-terser`, `rimraf`, `sharp`, `terser`.
- **Node:** versão fixada em `20` via `.nvmrc`.
- **Overrides de segurança** no `package.json`: `lodash >=4.17.24` e `minimatch ^9.0.5`, aplicados para resolver vulnerabilidades transitivas (documentado em `.agents/resolved-vulnerability.md`).
- **Deploy:** Vercel (projeto `project-johnnysouto`, `cleanUrls: true`).
- **Analytics:** Google Analytics via `gtag.js`.

## 4. Build & tooling — `gruntfile.js`

Tasks registradas:

| Task | O que faz |
|---|---|
| `grunt compile` | Limpa tudo, otimiza imagens, compila CSS/JS, copia arquivos para `public/`. Usado para preparar o ambiente inicial. |
| `grunt watch` (task `default`) | Observa mudanças em `src/**` (JS, CSS, HTML, imagens) e reprocessa incrementalmente. |
| `grunt publish` | Mesma sequência de `compile` — prepara `public/` para deploy. |
| `estilizando` | Concatena CSS (`materialize.css` + `style.css`) → minifica → copia para `public/css/styles.min.css`. |
| `codificando` | Concatena JS (`analytics.js`, `fontawesome.js`, `materialize.js`, `app.js`) → minifica (uglify) → copia para `public/js/scripts.min.js`. |
| `compactando-images` | Limpa, otimiza (`grunt-image`) e copia imagens para `public/images/`. |
| `limpar-tudo` / `limpar-tmp` / `limpar-public` / `limpar-images` | Tasks de limpeza de diretórios intermediários (`.tmp/`) e de `public/`. |

> Observação: `compile` e `publish` têm exatamente a mesma definição — são redundantes.

## 5. CI/CD — GitHub Actions (`.github/workflows/`)

### 5.1 `Develop.yaml`
- Dispara em `push` para `develop`.
- Faz deploy de **preview** na Vercel (ambiente `Develop`).

### 5.2 `Production.yaml`
- Dispara em: PR para `main` (apenas validação), `push` em `main` (deploy real) e `workflow_dispatch` (deploy manual).
- Jobs:
  1. **validate-source-branch** — bloqueia PRs para `main` que não venham de `develop`.
  2. **security-check** — roda `npm audit`; bloqueia se houver vulnerabilidades críticas ou mais de 2 altas.
  3. **deploy-production** — deploy real na Vercel (produção), só após push/dispatch em `main`, protegido por *environment* `Production` (aprovação manual).
  4. **post-deploy-validation** — smoke test HTTP na URL de produção.
  5. **create-version-tag** — cria e publica tag `vX.Y.Z` a partir da versão do `package.json`, se ainda não existir.
  6. **notify-failure** — reporta falhas do pipeline.

Fluxo de branches esperado: `feature/* → develop → main`.

## 6. Deploy — Vercel

- `vercel.json`: `outputDirectory: public`, `buildCommand: null`, `installCommand: null` (ou seja, a Vercel apenas serve o conteúdo já pronto de `public/`; quem gera esse conteúdo é o Grunt, rodado à parte/manualmente antes do commit, já que os workflows de CI não chamam `grunt compile`).
- `.vercel/project.json` guarda os IDs do projeto/organização na Vercel (não sensível por si só, mas não deveria ser necessário versionar — normalmente fica em `.gitignore`; hoje **está sendo versionado**, verificar se isso é intencional).

## 7. Configurações de editor/ambiente

- `.vscode/mcp.json`: configura um servidor MCP do **Figma** para uso no VS Code/Claude.
- `project_johnnysouto.code-workspace`: configura o **Live Server** para servir a pasta `/public/` na porta 80.
- `.gitattributes`: normalização automática de line endings (LF).
- `.nvmrc`: fixa Node 20 para consistência entre ambiente local e CI.

## 8. Agentes de IA personalizados

O projeto usa duas ferramentas de IA (GitHub Copilot e Claude Code), cada uma com seu próprio formato de arquivo/frontmatter para reconhecer um agente. Para evitar duplicação de conteúdo, foi adotado um padrão de **fonte única + arquivos-ponte**, documentado em `docs/agent-rules/README.md`:

- **Conteúdo real (agnóstico, sem frontmatter):** `docs/agent-rules/*.md` — é aqui que qualquer atualização de regra deve ser feita.
- **Ponte para o Copilot:** `.github/agents/*.md` — frontmatter específico do Copilot, corpo curto apontando para o conteúdo real.
- **Ponte para o Claude Code:** `.claude/agents/*.md` — frontmatter específico do Claude Code, corpo curto apontando para o conteúdo real.

Agentes existentes:

- **`resolved-vulnerability`**: processo padronizado para resolver vulnerabilidades de dependências npm via `overrides`, sem quebrar o projeto.
- **`atomics-commits`**: processo para agrupar mudanças e gerar commits atômicos seguindo Conventional Commits. Os exemplos foram adaptados para a realidade deste repositório (site estático) — antes referenciavam conceitos de outro projeto (loterias/predictions), sinal de que o arquivo havia sido copiado sem adaptação completa.

## 9. Pendências e pontos de atenção

- **`app/` (não rastreado pelo git)**: existe um diretório `app/` na raiz contendo `.angular/`, `node_modules/` e `dist/app/` (build de uma aplicação **Angular com SSR**, incluindo `server/` e `browser/`). Não há `package.json` nem `angular.json` nem código-fonte do Angular versionado — apenas artefatos de build e cache. Está fora do `.gitignore` atual (por isso aparece como `??` no `git status`). **Precisa de decisão**: é um experimento a ser descartado, um projeto novo em andamento (ex.: futura reescrita do site em Angular) a ser versionado corretamente, ou lixo de build que deveria estar ignorado?
- **`docs/` estava vazio** até este documento — não havia nenhuma documentação além do `README.md`.
- **`temp.log`**: arquivo vazio, versionado, aparentemente residual (o `.gitignore` já ignora `*.log`).
- **Sem scripts de teste, lint ou build no `package.json`**: o único script é um placeholder (`"test": "echo ... && exit 1"`). O pipeline de CI depende apenas de `npm audit`; não há verificação automatizada de que o site builda ou funciona corretamente antes do deploy.
- **Pipeline de CI não gera o `public/` a partir do `src/`**: o Grunt não é executado nos workflows — presume-se que `public/` é atualizado manualmente/localmente antes do commit, o que é uma fonte comum de divergência entre `src/` e `public/`.
- **Tasks `compile` e `publish` do Grunt são idênticas** — redundância a simplificar.
- **`devDependencies` (`sharp`, `terser`, `html-minifier-terser`, `clean-css`, `fs-extra`, `rimraf`) não são usadas pelo `gruntfile.js` atual** — parecem preparação para uma futura migração do pipeline de build para scripts Node puro, ou dependências órfãs.
- **`.vercel/project.json` versionado**: normalmente esse arquivo é ignorado pelo git (contém IDs específicos do ambiente local da Vercel CLI).

## 10. Log de evolução deste documento

| Data       | Mudança                                                                                                                                                                            |
| ---------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 06/09/2026 | Criação do documento a partir de leitura completa do repositório.                                                                                                                     |
| 06/09/2026 | Padronizada a organização das regras de agentes: conteúdo agnóstico movido para `docs/agent-rules/`, com arquivos-ponte em `.github/agents/` (Copilot) e `.claude/agents/` (Claude Code); removida a pasta redundante `.agents/`. |

---

## 11. Próximos passos sugeridos (backlog de evolução)

Lista aberta — cada item deve ser discutido e priorizado antes de ser implementado. Marcar como concluído e mover para o log acima quando resolvido.

- [ ] Decidir o destino do diretório `app/` (remover, ignorar ou formalizar como sub-projeto).
- [ ] Avaliar se `.vercel/` deveria estar no `.gitignore`.
- [ ] Adicionar scripts reais (`build`, `lint`, `test`) ao `package.json`.
- [ ] Fazer o CI rodar o build (Grunt) e validar que `public/` está sincronizado com `src/`, em vez de depender de build manual local.
- [ ] Remover redundância entre as tasks `compile` e `publish` do Grunt.
- [ ] Revisar/remover `devDependencies` não utilizadas ou formalizar seu uso.
- [ ] Remover `temp.log` do controle de versão.
