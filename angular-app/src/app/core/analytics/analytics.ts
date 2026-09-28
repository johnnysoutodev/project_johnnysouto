import { PLATFORM_ID, Service, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

/**
 * Dispara eventos customizados do GA4 (`gtag('event', ...)`) - NAO inicializa o `gtag`
 * em si. O boot do GA4 (script, `gtag('config', ...)`) mora em `src/index.html`, fora do
 * Angular/zone.js: um `AnalyticsService` anterior fazia esse boot dentro do ciclo de vida
 * do `App` (`app.ts`) e, mesmo com o código identico ao do site legado, o hit de pageview
 * nunca era enviado de verdade (confirmado com visitas reais, 22/09/2026 - ver comentario
 * em `app.ts`). Este servico so chama `window.gtag` depois que ele ja existe (carregado
 * pelo script de `index.html`) - um caminho de codigo diferente daquele que falhou, ja
 * que so acontece a partir de um `(click)` real do usuario, nao da inicializacao.
 */
@Service()
export class AnalyticsService {
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  /**
   * No-op silencioso se `gtag` ainda nao carregou (fora de producao, ver `index.html`,
   * ou consentimento ainda nao aceito, ver `core/consent/consent.ts`) - mesma degradacao
   * silenciosa ja usada pro proprio GA4 (sem erro, so nao envia dado nenhum).
   */
  trackEvent(name: string, params?: Record<string, string>): void {
    if (!this.isBrowser || typeof window.gtag !== 'function') {
      return;
    }
    window.gtag('event', name, params);
  }
}
