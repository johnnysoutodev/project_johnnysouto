# i18n com vários idiomas (referência para o `builder`)

Um idioma só: `sourceLocale` simples (`"pt"`) e saída plana. Vários idiomas: a configuração abaixo, validada em produção com três idiomas (pt-BR, en-US, es-ES). O Angular **não tem dados de locale com região** (`pt-BR`, `es-ES`): o `code` do `sourceLocale` e das chaves de `locales` usa só o idioma (`pt`, `es`) ou um código que o Angular conheça (`en-US`), e a **pasta de saída** vem de `subPath` (minúsculo, com região: `pt-br`).

`angular.json` (projeto `NAME`):

```json
"i18n": {
  "sourceLocale": { "code": "pt", "subPath": "pt-br" },
  "locales": {
    "en-US": { "translation": "src/locale/messages.en-US.json", "subPath": "en-us" },
    "es": { "translation": "src/locale/messages.es-ES.json", "subPath": "es-es" }
  }
}
```

No alvo `build`:

- `options.polyfills`: inclui `"@angular/localize/init"` (o `ng generate @angular/localize:ng-add` faz isso).
- `options.i18nMissingTranslation: "error"`: o build falha se faltar tradução (é o que impede idioma pela metade).
- `configurations.production.localize: true`: gera uma pasta por idioma em `dist/<projeto>/browser/<subPath>/`.
- `outputMode: "static"` com prerender (ou o formato definido por `deploy.outputMode` do spec).

Fluxo de texto: o texto visível entra no idioma-fonte, marcado com `i18n`/`i18n-aria-label`/`i18n-alt` (template) ou `$localize` com ID `@@...` (TS). Depois `ng extract-i18n --format json --output-path src/locale` e a tradução dos idiomas-alvo nos arquivos `messages.<locale>.json`. O `<html lang>` regional (`pt-BR`) vem de código na inicialização (ver o passo de `lang` no `builder`), porque o Angular reescreve o `lang` para o código do locale.

Roteamento de idioma na raiz (`/`): cookie `lang`, depois `Accept-Language`, depois o idioma de fallback (`locales.fallback` do spec). Os templates de deploy (`site-factory/deploy-templates`) já geram esse redirecionamento por provedor.
