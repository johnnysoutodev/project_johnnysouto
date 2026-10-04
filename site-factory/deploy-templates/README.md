# Templates de deploy

Cada pasta `<provedor>-<outputMode>/` é um template. O `builder` aplica **só o do provedor escolhido** no `site-spec.json` (`deploy.provider` + `deploy.outputMode`); os outros nunca são copiados.

```bash
node site-factory/deploy-templates/apply.mjs --spec site-factory/clients/<id>/site-spec.json [--dry-run] [--force]
```

| Template | Gera | Status |
|---|---|---|
| `vercel-static` | `<projectDir>/vercel.json` (redirects de idioma, `cleanUrls`) e dois workflows (preview e produção) | Não testado em repositório real. O `vercel.json` gerado foi comparado com o de um site em produção e equivale. |
| `aws-static` | CloudFormation (S3 privado + CloudFront + Function de idiomas/URLs limpas), role OIDC do GitHub, README de setup e dois workflows (o de produção tem portão de `npm audit` crítico, como o da Vercel) | Não implantado em conta real. Validado com `cfn-lint`, YAML e a Function executada localmente contra 15 eventos simulados. |

Sem template (`azure`, `netlify`, `server`...): o script sai com código 3 sem gerar nada. O spec continua válido.

## Comportamento do `apply.mjs`

- Não sobrescreve arquivo existente sem `--force`; nunca apaga nada.
- **Projeto em `site-factory/sandbox/` (ou `--standalone`):** a pasta do projeto é tratada como a raiz do próprio repositório; os workflows vão para `<projeto>/.github/workflows/` (inertes) e nunca para o `.github/` real.
- **Não duplica deploy:** se o repositório já tem um workflow que faz deploy do mesmo provedor (padrão `deployDetect` do manifesto), os workflows do template não são criados (cada push publicaria duas vezes); os demais arquivos seguem. Exceção consciente: `--allow-existing-deploy-workflows`.
- Workflows têm nome por provedor (`deploy-<provedor>-preview.yaml`/`-production.yaml`), para que a troca de provedor não se confunda com o anterior.
- Lista arquivos de **outro** provedor já presentes no projeto (troca de provedor); a remoção é do usuário.
- Imprime as etapas de configuração fora do código (segredos, ambientes, DNS) vindas do `afterApply` do manifesto.
- Precisa do projeto Angular criado (`<projectDir>/angular.json`) para descobrir a pasta de saída do build.

## Placeholders

`{{nome}}`, sem espaços (expressões do GitHub como `${{ secrets.X }}` não são tocadas). Valor multilinha sozinho na linha herda a indentação; valor vazio remove a linha. Placeholder desconhecido é erro. Disponíveis: `projectDir`, `clientId`, `clientName`, `clientNameSafe`, `outputDir`, `multiLocale`, `sourceFolder`, `fallbackFolder`, `localeFoldersJson`, `localeLangMapJson`, `notFoundPath`, `previewEnv`, `previewEnvSlug`, `previewBranch`, `productionEnv`, `productionEnvSlug`, `productionBranch`, `productionUrl`, `productionEnvUrlLine`, `vercelRedirects`, `vercelRewrites` (e `cloudfrontFunctionCode` no AWS). Novos valores derivados entram em `apply.mjs`.

## Adicionar um provedor

1. Crie `<provedor>-<outputMode>/` com `template.json` (`id`, `provider`, `outputMode`, `status`, `notes`, `deployDetect` (regex que identifica um workflow de deploy deste provedor), `files[{from,to}]`, `afterApply[]`) e os arquivos `.tmpl`.
2. Registre `status: "untested"` até rodar numa conta/repositório real, e diga em `notes` o que foi validado e como.
3. Valide: aplique num diretório temporário com `--root`, rode o linter do formato (ex.: `cfn-lint`, parse do YAML) e confira que não restam `{{...}}`.
4. Atualize a tabela acima, o `ROADMAP.md` e o `CHANGELOG.md`.
