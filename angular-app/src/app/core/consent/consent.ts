import { PLATFORM_ID, Service, inject, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

declare global {
  interface Window {
    /** Definida em `src/index.html` - ver comentario la sobre o boot do GA4 ficar fora
     * do Angular. Chamada de novo aqui (depois de `accept()`) pra carregar o GA4 na
     * mesma visita, sem esperar um reload - a funcao e idempotente. */
    loadGoogleAnalytics?: () => void;
  }
}

export type ConsentStatus = 'unknown' | 'accepted' | 'declined';

const STORAGE_KEY = 'cookie-consent';
const ACCEPTED_VALUE = 'accepted';

/**
 * Consentimento de cookies/analytics (27/09/2026, a pedido do Johnny). `localStorage`,
 * nao `document.cookie` - preferencia puramente client-side (nada aqui precisa ser lido
 * no servidor, diferente do cookie `lang` do `LanguageService`, que o `vercel.json` le
 * nos redirects) - mesmo mecanismo simples ja usado pelo `ThemeService`
 * (`core/theme/theme.ts`) pra uma preferencia equivalente.
 *
 * Aceitar e persistente (fica salvo ate o usuario limpar o navegador); recusar NAO grava
 * nada de proposito - e assim que "pergunta de novo toda visita" acontece (sem nada
 * salvo, o proximo carregamento nasce `'unknown'` de novo). Nao ha terceiro estado
 * persistido pra "recusado".
 */
@Service()
export class ConsentService {
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  readonly status = signal<ConsentStatus>('unknown');

  constructor() {
    // Le ANTES de qualquer outra coisa, mesmo motivo do `ThemeService`: evitar que um
    // efeito/leitura tardia sobrescreva um valor real com o default por engano.
    if (this.isBrowser && this.readStoredConsent()) {
      this.status.set('accepted');
    }
  }

  accept(): void {
    if (!this.isBrowser) {
      return;
    }
    try {
      localStorage.setItem(STORAGE_KEY, ACCEPTED_VALUE);
    } catch {
      // localStorage indisponivel (ex.: modo privado restrito) - consentimento vale so
      // pra esta visita, sem persistir entre reloads.
    }
    this.status.set('accepted');
    window.loadGoogleAnalytics?.();
  }

  decline(): void {
    if (!this.isBrowser) {
      return;
    }
    this.status.set('declined');
  }

  private readStoredConsent(): boolean {
    try {
      return localStorage.getItem(STORAGE_KEY) === ACCEPTED_VALUE;
    } catch {
      return false;
    }
  }
}
