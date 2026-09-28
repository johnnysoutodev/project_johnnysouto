import { Component, PLATFORM_ID, computed, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { ConsentService } from '../../core/consent/consent';

/**
 * Barra de consentimento de cookies (27/09/2026, a pedido do Johnny) - widget global
 * (mesmo grupo de `ScrollToTop`, montado direto em `app.html`), nao faz parte de nenhuma
 * secao de conteudo. Aparece em QUALQUER dominio (producao, preview da Vercel,
 * `localhost`), mesmo o GA4 em si so carregando de verdade em producao (gate de hostname
 * dentro de `window.loadGoogleAnalytics`, `index.html`) - deliberado, pro Johnny
 * conseguir testar o banner num preview antes do merge (mesma tecnica de QA ja usada
 * pro menu mobile: subir preview, testar no celular).
 */
@Component({
  selector: 'app-cookie-consent-banner',
  templateUrl: './cookie-consent-banner.html',
  styleUrl: './cookie-consent-banner.scss',
})
export class CookieConsentBanner {
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  protected readonly consent = inject(ConsentService);

  /** So no browser (nunca no HTML prerenderizado - evita flash pra quem ja aceitou
   * antes) e so enquanto a escolha ainda nao foi feita nesta visita. */
  protected readonly showBanner = computed(
    () => this.isBrowser && this.consent.status() === 'unknown',
  );

  protected accept(): void {
    this.consent.accept();
  }

  protected decline(): void {
    this.consent.decline();
  }
}
