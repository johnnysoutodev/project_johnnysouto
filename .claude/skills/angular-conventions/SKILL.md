---
name: angular-conventions
description: Lições de bugs reais (SSR/prerender, effect() vs bindings de template, estado persistido) a aplicar ao criar ou editar qualquer componente ou serviço Angular em angular-app/. Use antes de escrever ou revisar componentes, serviços e effects.
---

# Convenções Angular — lições de bugs reais

Complementa `angular-app/CLAUDE.md` (boas práticas oficiais do Angular). Aqui ficam só as regras que nasceram de bugs reais neste projeto.

## Plataforma, SSR e estado persistido (bug do `ThemeService`, `angular-app/src/app/core/theme/theme.ts`)

Dois bugs reais: um `effect()` sem guarda de plataforma quebrou o build de SSR/prerender com `document is not defined`, e a ordem de leitura do estado persistido (localStorage) fez o `effect()` sobrescrever o tema salvo a cada reload.

1. Todo acesso a `document`/`window`/`localStorage`/`matchMedia` dentro de `effect()`/construtor precisa estar atrás de `isPlatformBrowser(inject(PLATFORM_ID))`.
2. Leia o valor inicial real de estado persistido de forma síncrona **antes** de declarar o `effect()`; nunca deixe o `effect()` gravar um default transitório por cima.
3. Valide sempre com `ng build` com prerender ligado (não só o dev server) — é o único jeito de pegar erro de SSR.
4. Escreva teste unitário (Vitest) para qualquer lógica não-trivial, não só o `should create` padrão.

## `effect()` + binding de template no mesmo signal (bug do menu mobile, `angular-app/src/app/layout/mobile-menu/mobile-menu.ts`)

Um `effect()` chamava `.focus()` no primeiro elemento do painel ao abrir, mas o binding `[attr.inert]` do template reage ao mesmo signal sem ordem garantida entre "effect roda" e "change detection aplica o binding". O `.focus()` rodava antes do `inert` ser removido do DOM, e o navegador recusa focar elemento `inert` (silenciosamente, sem erro). Passava nos testes porque o helper chamava `detectChanges()` antes de `flushEffects()`, aplicando o binding a tempo — só apareceu em teste manual no navegador.

Regra: quando um `effect()` precisa interagir com um elemento cujo estado (visibilidade, `inert`, `disabled`) é controlado por um binding de template reagindo ao mesmo signal, empurre a interação (`.focus()` etc.) para um `queueMicrotask()`/próximo tick. Nunca assuma que o binding já foi aplicado só porque o `effect()` já rodou.

## CSS e UI (bugs reais da criação dos componentes; nenhum dá erro de compilação)

- **Tema no `<html>` + CSS de componente:** nunca `[data-theme='dark'] .x` dentro de `.scss` de componente — com encapsulamento `Emulated` o ancestral ganha `_ngcontent-*` que o `<html>` não tem e a regra nunca bate. Use `:host-context([data-theme='dark']) .x`. Seletor de ancestral direto só em stylesheet global (`src/styles/`).
- **`position: sticky` em raiz de componente (Header etc.):** o host precisa de `:host { display: contents }`, não `block` (o host encolhe ao tamanho do filho e o sticky fica sem espaço de scroll). Pré-requisito: `app-root` com `display: block` em stylesheet global (elemento custom é `inline` por padrão).
- **Card com `height` medido em conteúdo placeholder:** use `min-height`, não `height` fixo; o conteúdo real costuma ser maior e vaza.
- **Antes de "corrigir" sombra/radius que parece estranha:** confira a spec do design (pode ser intencional, ex.: card e imagem interna com sombras próprias). O defeito real costuma ser o padding que faltava.
- **Elemento focável escondido por `aria-hidden`/`tabindex="-1"` controlado por signal:** chame `.blur()` no instante em que ele some, se for o `document.activeElement` (senão: "Blocked aria-hidden on an element because its descendant retained focus").
- **Scroll programático (`window.scrollTo`) em mobile:** o evento `scroll` não dispara de forma confiável; resolva o estado no próprio handler do clique. Não replique checagens `event.button === 0 && !event.metaKey…` em handlers que também recebem toque.
- **Hover em elemento de visibilidade condicional:** escope ao estado visível (`&--visible:hover`) e envolva em `@media (hover: hover)`. Em toque, `:hover` fica preso e vence o `opacity: 0` base. Ao investigar "não some só no mobile", cheque `getComputedStyle(el).opacity` antes de suspeitar de JS.
