import { Injectable, PLATFORM_ID, effect, inject, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

export type Theme = 'light' | 'dark';

const STORAGE_KEY = 'theme';

/**
 * Alternancia de tema (light/dark). O `data-theme` inicial no <html> ja e aplicado
 * sincronamente por um script inline em `src/index.html` (anti-FOUC, antes do primeiro
 * paint) - este servico so assume esse mesmo valor apos a hidratacao (`afterNextRender`,
 * browser-only) e passa a manter o atributo e o `localStorage` em sincronia com o signal
 * dai em diante. Cores/sombras ja sao tokens prontos pros dois temas (design-system.md
 * secao 3, `src/styles/_tokens.scss`) - este servico so liga a alternancia.
 */
@Injectable({ providedIn: 'root' })
export class ThemeService {
  // `document`/`localStorage` nao existem no SSR/prerender deste projeto (confirmado
  // em build real: sem essa guarda, `effect()` abaixo lanca `ReferenceError: document
  // is not defined` durante o prerender) - toda leitura/escrita de DOM fica restrita
  // ao browser.
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  readonly theme = signal<Theme>('light');

  constructor() {
    // Le o tema real ANTES de declarar o effect abaixo - `document`/`localStorage` ja
    // existem no browser nesse ponto (o `index.html` e parseado antes do Angular
    // inicializar), entao nao precisa esperar `afterNextRender`. Critico: se o signal
    // nascesse com o default 'light' e so fosse corrigido depois, a primeira execucao
    // do `effect()` (que roda imediatamente na criacao) escreveria 'light' tanto no
    // `data-theme` quanto no `localStorage`, apagando um tema 'dark' persistido antes
    // mesmo de conseguirmos le-lo - foi exatamente esse bug observado num teste manual
    // (tema voltava pra light a cada reload, mesmo com 'dark' salvo).
    if (this.isBrowser) {
      this.theme.set(this.readInitialTheme());
    }

    effect(() => {
      const value = this.theme();
      if (!this.isBrowser) {
        return;
      }

      document.documentElement.setAttribute('data-theme', value);
      try {
        localStorage.setItem(STORAGE_KEY, value);
      } catch {
        // localStorage indisponivel (ex.: modo privado restrito) - alternancia
        // continua funcionando na sessao atual, so nao persiste entre reloads.
      }
    });
  }

  toggle(): void {
    this.theme.update((current) => (current === 'dark' ? 'light' : 'dark'));
  }

  /**
   * Le o tema ja aplicado pelo script anti-FOUC de `index.html` (mesma fonte de
   * verdade, evita logica duplicada divergindo) - com o mesmo fallback (localStorage,
   * depois `prefers-color-scheme`) caso o atributo nao tenha sido setado por algum motivo.
   */
  private readInitialTheme(): Theme {
    const fromDom = document.documentElement.getAttribute('data-theme');
    if (fromDom === 'light' || fromDom === 'dark') {
      return fromDom;
    }

    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored === 'light' || stored === 'dark') {
        return stored;
      }
    } catch {
      // localStorage indisponivel - segue pro fallback de prefers-color-scheme.
    }

    return window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
}
