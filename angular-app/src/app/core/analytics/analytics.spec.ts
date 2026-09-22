import { PLATFORM_ID } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { afterEach, describe, expect, it } from 'vitest';
import { AnalyticsService } from './analytics';

const GTAG_SELECTOR = 'script[data-analytics="ga4"]';

// `window.location` original (antes de qualquer teste mexer nele) - restaurado no
// `afterEach` abaixo. Sem isso, o `Object.defineProperty` de `setHostname` (substitui
// `location` por um objeto plano, sem `assign`/`hash` reais) vazava pros PROXIMOS
// arquivos de spec rodados no mesmo worker do `@angular/build:unit-test` (jsdom nao e
// resetado por arquivo nesse runner, diferente do vitest "puro") - achado via um teste
// de `anchor-scroll.spec.ts` (que depende de `location.hash`) falhando de forma
// intermitente, so quando este arquivo rodava antes dele.
const ORIGINAL_LOCATION = Object.getOwnPropertyDescriptor(window, 'location')!;

/**
 * Substitui `window.location` por um objeto plano com o `hostname` desejado - direto
 * (`window.location.hostname = ...`) o jsdom tenta navegar de verdade (efeito colateral
 * indesejado/nao suportado no ambiente de teste), diferente de `hash` (usado em
 * `language.spec.ts`), que e seguro de atribuir direto.
 */
function setHostname(hostname: string): void {
  Object.defineProperty(window, 'location', {
    value: { ...window.location, hostname },
    writable: true,
    configurable: true,
  });
}

function create(): AnalyticsService {
  return TestBed.inject(AnalyticsService);
}

describe('AnalyticsService', () => {
  afterEach(() => {
    document.head.querySelectorAll(GTAG_SELECTOR).forEach((script) => script.remove());
    window.dataLayer = undefined;
    window.gtag = undefined;
    Object.defineProperty(window, 'location', ORIGINAL_LOCATION);
  });

  it('does not inject the gtag script on non-production hosts (preview/localhost)', () => {
    for (const hostname of ['localhost', 'project-johnnysouto-abc123.vercel.app']) {
      setHostname(hostname);

      create().init();

      expect(document.head.querySelector(GTAG_SELECTOR)).toBeNull();
    }
  });

  it.each(['www.johnnysouto.com.br', 'johnnysouto.com.br'])(
    'injects the gtag script and configures it on the production host %s',
    (hostname) => {
      setHostname(hostname);

      create().init();

      const script = document.head.querySelector<HTMLScriptElement>(GTAG_SELECTOR);
      expect(script?.src).toBe('https://www.googletagmanager.com/gtag/js?id=G-YYR4SND80L');
      expect(script?.async).toBe(true);
      // `window.gtag` precisa existir globalmente (nao só como função local do serviço) -
      // é o que o próprio gtag.js e qualquer chamada futura (`gtag('event', ...)`) esperam
      // encontrar, igual ao snippet oficial do Google.
      expect(typeof window.gtag).toBe('function');
      expect(window.dataLayer?.length).toBeGreaterThan(0);
      expect(window.dataLayer).toContainEqual(['js', expect.any(Date)]);
      expect(window.dataLayer).toContainEqual([
        'config',
        'G-YYR4SND80L',
        {
          cookie_domain: 'johnnysouto.com.br',
          cookie_expires: 60 * 60 * 24 * 90,
          cookie_update: false,
        },
      ]);
    },
  );

  it('calling init() twice does not inject the script twice', () => {
    setHostname('www.johnnysouto.com.br');

    const service = create();
    service.init();
    service.init();

    expect(document.head.querySelectorAll(GTAG_SELECTOR).length).toBe(1);
  });

  it('does not touch window/document when running on the server (SSR/prerender)', () => {
    TestBed.overrideProvider(PLATFORM_ID, { useValue: 'server' });
    setHostname('www.johnnysouto.com.br');

    // No ReferenceError (window.location.hostname would not exist for real during
    // prerender - same class of bug already guarded against in ThemeService/LanguageService).
    create().init();

    expect(document.head.querySelector(GTAG_SELECTOR)).toBeNull();
  });
});
