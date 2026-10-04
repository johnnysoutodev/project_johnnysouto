# Build log - johnnysouto

## 2026-10-04 - adocao do padrao clean-code-angular (copia em site-factory/sandbox/johnnysouto)

Versoes: Node v24.18.0, Angular 22.2 (CLI/build 22.x), vitest 4.1.11, @vitest/coverage-v8 4.1.11, stylelint 17.16, stylelint-config-recommended-scss 17.0.
Trabalho feito na COPIA do projeto (o angular-app oficial nao foi alterado a pedido do dono). Refatoracao: visual e comportamento inalterados.

- Ferramentas: eslint.config.js e stylelint.config.cjs do template, script `stylelint`, CLAUDE.md/AGENTS.md do template. `_breakpoints.scss` mantido (768/1200), com mixins novos `prefers-dark`, `prefers-reduced-motion` e `hover-capable`.
- Arquivos do componente: ok desde o inicio (17 componentes); template inline so no host de teste do icon-button.spec (trocado por `createComponent` com `projectableNodes`).
- SCSS: 8 comentarios `//` vazios removidos; seletores de tag viraram classes BEM (about__bio-text, about__checklist-column-item, about__pic-img, hero__pic-img, experience__list-entry, experience__bullets-item, project__image-img, language-switcher__select-option); classe `.cookie-consent*` renomeada para `.cookie-consent-banner*`; px crus viraram tokens com o mesmo valor (--font-heading-h1-mobile/tablet-*, --space-40, --space-scroll-to-top-bottom(-desktop), --size-content-max-width, --size-scroll-to-top, --color-scroll-to-top-bg, --color-testimonial-avatar-icon); `48px/64px/24px/4px` trocados por tokens existentes; app.scss ganhou comentario (estava vazio).
- Logica: specs novos labels, responsive-image-loader, nav-links; casos novos em consent, language, anchor-scroll; 100% (linhas, ramos, funcoes, instrucoes) nos 11 arquivos de logica.
- mobile-menu.ts: decisao extraida para mobile-menu-drag.ts (DragGesture, classifyDragMovement, clampDragOffset, resolveDragEnd, capturePointer...) e mobile-menu-focus.ts (keydownAction, focusTrapTarget, queryFocusable), cada um com spec; effect e queueMicrotask do foco mantidos como estavam.
- experience.ts: interfaces em experience.model.ts e dados em experience.data.ts (limite de 150 linhas).
- Testes: 2 specs (header, mobile-menu) passaram a cancelar a navegacao do clique no CV (removeu o aviso "Not implemented: navigation" do terminal).
- Resultado: code-quality --mode enforce APROVADO; ng build sem warnings (prerender nos 3 idiomas); smoke de interacao ok; medidas das 6 capturas identicas as de antes (so `findings` heuristicos variaram, e um rebuild do codigo original os reproduz iguais ao novo).
- npm audit: 8 altas (so dev, cadeia do Stylelint), 0 em producao (--omit=dev).
- Lacunas/avisos fora do escopo: ui-specs (17), ui-thin (3: contact-me, mobile-menu 17 ramificacoes na classe, scroll-to-top), tokens-unused (--visible, --space-header-padding-y).
