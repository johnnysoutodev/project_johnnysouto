---
name: angular-conventions
description: Lições de bugs reais (SSR/prerender, effect() vs bindings de template, estado persistido) a aplicar ao criar ou editar qualquer componente ou serviço Angular em angular-app/. Use antes de escrever ou revisar componentes, serviços e effects.
---

# Convenções Angular — lições de bugs reais

Complementa `angular-app/CLAUDE.md` (boas práticas oficiais do Angular). Aqui ficam só as regras que nasceram de bugs reais neste projeto.

## Plataforma, SSR e estado persistido (bug do `ThemeService`, `angular-app/src/app/core/theme/theme.ts`)

Dois bugs reais: um `effect()` sem guarda de plataforma quebrou o build de SSR/prerender com `document is not defined`, e a ordem de leitura do estado persistido (localStorage) fez o `effect()` sobrescrever o tema salvo a cada reload. Detalhe completo em `docs/agent-rules/angular-components.md`, seção "Validar".

1. Todo acesso a `document`/`window`/`localStorage`/`matchMedia` dentro de `effect()`/construtor precisa estar atrás de `isPlatformBrowser(inject(PLATFORM_ID))`.
2. Leia o valor inicial real de estado persistido de forma síncrona **antes** de declarar o `effect()`; nunca deixe o `effect()` gravar um default transitório por cima.
3. Valide sempre com `ng build` com prerender ligado (não só o dev server) — é o único jeito de pegar erro de SSR.
4. Escreva teste unitário (Vitest) para qualquer lógica não-trivial, não só o `should create` padrão.

## `effect()` + binding de template no mesmo signal (bug do menu mobile, `angular-app/src/app/layout/mobile-menu/mobile-menu.ts`)

Um `effect()` chamava `.focus()` no primeiro elemento do painel ao abrir, mas o binding `[attr.inert]` do template reage ao mesmo signal sem ordem garantida entre "effect roda" e "change detection aplica o binding". O `.focus()` rodava antes do `inert` ser removido do DOM, e o navegador recusa focar elemento `inert` (silenciosamente, sem erro). Passava nos testes porque o helper chamava `detectChanges()` antes de `flushEffects()`, aplicando o binding a tempo — só apareceu em teste manual no navegador.

Regra: quando um `effect()` precisa interagir com um elemento cujo estado (visibilidade, `inert`, `disabled`) é controlado por um binding de template reagindo ao mesmo signal, empurre a interação (`.focus()` etc.) para um `queueMicrotask()`/próximo tick. Nunca assuma que o binding já foi aplicado só porque o `effect()` já rodou.
