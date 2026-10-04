---
name: landing-sections
description: Catálogo de tipos de seção de landing page (hero, about, skills, timeline, projects, testimonials, features, pricing, faq, cta, logos, stats, gallery, contact, header, footer), com a forma do `content` no site-spec e as convenções de componente Angular. Use ao gerar ou revisar seções a partir de um site-spec.json.
---

# Catálogo de seções

A forma mínima de `content` por tipo é validada por `site-factory/spec/site-spec.schema.json`. Chaves além das listadas são permitidas; as marcadas com `?` são opcionais. Texto sempre no idioma-fonte.

| `type` | `content` | Observação de UI |
|---|---|---|
| `hero` | `headline`; `subheadline?`, `cta? {label, href}`, `media? {src, alt}`, `socials? [{type, href}]` | Imagem principal é candidata a LCP: `NgOptimizedImage` com `priority`. |
| `about` | `body` (string ou lista de parágrafos); `title?`, `media?` | |
| `skills` | `items [{name, icon?}]` | Grid único, sem agrupar por categoria a menos que o design mostre isso. |
| `timeline` | `items [{organization, logo?, positions [{title, period, bullets?}]}]` | Um card por organização, vários cargos dentro. |
| `projects` | `items [{name, description, tags?, link?, image?}]` | Grid se adapta à quantidade real, não à do mockup. |
| `testimonials` | `items [{quote, author, role?, photo?}]` | Só depoimentos reais fornecidos pelo cliente. |
| `features` | `items [{title, description, icon?}]` | |
| `pricing` | `plans [{name, price, features, cta, highlighted?}]` | Nunca inventar preço. |
| `faq` | `items [{question, answer}]` | `<details>/<summary>` ou botões com `aria-expanded`. |
| `cta` | `headline`, `action {label, href}`; `body?` | Uma única ação principal. |
| `logos` | `items [{name, logo, href?}]` | Só marcas com fonte oficial do arquivo. |
| `stats` | `items [{value, label}]` | Números fornecidos pelo cliente. |
| `gallery` | `items [{src, alt}]` | `alt` obrigatório. |
| `contact` | `channels [{type, value, href?}]` | `type`: email, phone, whatsapp, linkedin, github etc. |
| `header` | derivado de `nav.label` das seções; `menu? [{label, href}]` quando o Figma tem itens que não são seção; `cta? {label, href}` | Menu mobile dedicado; ver sticky em `angular-conventions`. Item de menu sem seção correspondente entra com `href` real ou `"#"` registrado como pendência; pergunte ao dono, não invente página. |
| `footer` | `copyright?`, `address?`, `columns? [{title, links [{label, href}]}]`, `socials? [{type, href}]`, `stores? [{store, href}]`, `locales?` | Texto de endereço e dados legais (CNPJ) vêm do Figma ou do cliente e só entram depois de o dono confirmar que são reais. Seletor de idioma/cidade só é interativo se o spec definir a ação. |

## Convenções de componente

- Um componente standalone por seção, em `<projectDir>/src/app/features/<id>/` (`header`/`footer` em `layout/`). O `id` do spec vira a pasta, o seletor `app-<id>` e a âncora `#<id>`.
- Os dados ficam num `.ts` tipado ao lado do componente (interface + constante), não no template. Esse arquivo é o `contentRef` da seção.
- Texto visível marcado para i18n, em dois lugares sem conflito: **conteúdo da seção** (o que vem do `content`/arquivo de dados) fica no `.ts` de dados com `$localize` e ID `@@...`; **rótulos fixos de UI** escritos direto no template levam `i18n`/`i18n-aria-label`/`i18n-alt`. Depois extração e tradução nos idiomas-alvo do spec (sem idiomas-alvo, só o `$localize` precisa estar configurado).
- Cores, tipografia e sombras só por token (CSS custom property) do documento de design; nunca valor copiado do Figma. Pronto para os temas de `design.themes`.
- Assets só de `<projectDir>/public/assets/<categoria>/`. Ausente: reportar, não gerar nem baixar.
- Status: `draft` (conteúdo incompleto, bloqueia o builder), `ready` (aprovada, o builder gera), `migrated` (já existe, não é regenerada).
- **Valores de contato nunca quebram no meio da palavra:** telefone com `white-space: nowrap`; e-mail com ponto de quebra (`<wbr>`) **só antes do `@`** ("contato" / "@dominio.com"; quebra depois de ponto faz a linha cair em "contato@dominio." / "com", pior). `overflow-wrap: anywhere` só como último recurso, para um trecho sozinho mais largo que a linha. Implemente como utilitário genérico (função ou pipe), não como remendo para um e-mail.
- Lógica não trivial leva teste Vitest. Regras de SSR, `effect()` e CSS: skill `angular-conventions`.

## Texto com estilo parcial (destaque de cor, negrito)

Quando o Figma tem trecho do texto com cor, peso ou tamanho próprios (o `designer` lista com `figma-map.mjs fx`, com os índices do trecho), o dado da seção carrega a estrutura, nunca HTML solto:

- **Título com destaque:** `title` mais `titleHighlight` (o trecho exato, que precisa ser substring do `title`); o componente compartilhado divide o texto por uma função pura testada.
- **Item com trecho em negrito:** `parts: [{ text, strong? }]` em vez de uma string única; cada trecho passa por `$localize` com ID próprio.
- **Quebra de linha do design:** `\n` no `title` quando o Figma quebra de forma explícita; abaixo do viewport do design a quebra pode ceder à natural.

## Modo placeholder (`project.contentMode: "placeholder"`)

- Texto em Lorem Ipsum **do tamanho de um texto real** (título curto, parágrafo de 2–3 frases, 3–6 itens por lista). Texto curto demais esconde estouro de layout; o verifier não acharia.
- Nunca placeholder para fatos: sem preço, número, depoimento, nome de pessoa ou logo "realistas" inventados. Use valores obviamente de exemplo (`R$ 00,00`, `Nome Sobrenome`, bloco neutro no lugar do logo).
- Os dados ficam no `.ts` tipado da seção (o `contentRef`): é lá que o cliente troca o texto.
- Idiomas-alvo: o placeholder do idioma-fonte é copiado como "tradução" (para o build não falhar por tradução ausente) e continua marcado como placeholder.
