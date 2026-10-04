# Usar o template

## 1. Pré-requisitos

- **Node** `^22.22.3`, `^24.15.0` ou `>=26` (o mesmo critério do Angular 22 usado nos projetos). `nvm` ou `volta` resolvem.
- **Git**.
- **Google Chrome** instalado (o `verifier` e o `qa-visual` usam o Chrome do sistema via Playwright; nenhum navegador é baixado).
- **Claude Code** com acesso ao MCP do Figma (`.mcp.json` já traz `figma` e `angular-cli`; aprove os servidores na primeira abertura).
- Conta no **Figma** (passo 3).

## 2. Criar o repositório e preparar o motor

Crie o repositório a partir do template ("Use this template" no GitHub) ou copie os arquivos, clone e rode:

```bash
node site-factory/bootstrap.mjs
```

Ele confere os pré-requisitos, instala as dependências do motor (`site-factory/verifier` e `site-factory/spec`) e valida o cliente-exemplo. `--check` só confere, sem instalar.

## 3. Token do Figma (só o `designer` usa)

No Figma: avatar > **Settings** > **Security** > **Personal access tokens** > **Generate new token**, com escopo só de leitura de arquivos (`file_content:read`). Guarde **fora do repositório**:

```bash
mkdir -p ~/.config/site-factory && chmod 700 ~/.config/site-factory
read -s T && printf 'FIGMA_TOKEN=%s\n' "$T" > ~/.config/site-factory/.env && chmod 600 ~/.config/site-factory/.env; unset T
```

Nunca cole o token no chat nem salve em arquivo do projeto. Teste com `node site-factory/figma/figma-map.mjs map --url <link-do-figma>`.

## 4. Primeiro cliente

1. Copie `site-factory/templates/brief.template.md` para `site-factory/clients/<id>/brief.md` e preencha (ou rode `/build-landing <id>` e responda as perguntas). O brief traz objetivo, público, link do Figma, **onde será publicado** e se os textos são finais ou provisórios (Lorem Ipsum).
2. Rode `/build-landing <id>`. A sessão principal conduz as etapas e para em três portões humanos: respostas do cliente, aprovação de textos finais e o relatório do verificador. Retome a qualquer momento: `node site-factory/status.mjs <id>` diz em que etapa está.
3. Ajuste fino do visual: `/qa-visual <id>` (desktop claro primeiro; dark e mobile quando quiser).

O cliente `example` é só um modelo; apague a pasta quando não precisar dela.

## 5. Regras que valem desde o primeiro dia

Leia `docs/ai-instructions.md`. As que mais surpreendem: nada é commitado sem você pedir; o site oficial de um cliente nunca é alterado por teste (trabalha-se numa cópia em `site-factory/sandbox/`, entregue como patch); vulnerabilidade de dependência vai para o agente `resolved-vulnerability`; build e teste terminam com zero warnings.

## 6. CI opcional

`site-factory/templates/ci/code-quality.yaml` roda o portão de qualidade sem navegador. Copie para `.github/workflows/` e ajuste `PROJECT_DIR`.

## 7. Atualizar o motor

O motor evolui neste template. Num repositório derivado, traga as atualizações sem tocar nos seus clientes:

```bash
git remote add template <url-do-template>     # uma vez
git fetch template
git diff HEAD template/main -- .claude site-factory/spec site-factory/verifier site-factory/figma site-factory/deploy-templates site-factory/templates site-factory/status.mjs site-factory/bootstrap.mjs docs/agent-rules   # revise
git checkout template/main -- .claude site-factory/spec site-factory/verifier site-factory/figma site-factory/deploy-templates site-factory/templates site-factory/status.mjs site-factory/bootstrap.mjs docs/agent-rules
```

`site-factory/clients/`, `docs/ai-instructions.md` e `CHANGELOG.md` ficam fora dessa lista (são seus). Depois rode `node site-factory/bootstrap.mjs`.

## Sistemas

Testado em macOS. O clone rápido de projeto para a cópia de trabalho usa `cp -cR` (macOS/APFS); no Linux use `cp -R --reflink=auto`.
