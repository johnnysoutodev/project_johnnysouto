import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { SITE_URL } from '../seo/seo';

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

/**
 * Measurement ID real do Google Analytics (GA4) do site legado. O script de carregamento
 * de lá (`src/pt/index.html`/`src/en/index.html`) usava `id=UG-YYR4SND80L` (com "U"), mas
 * a chamada `gtag('config', ...)` usava `G-YYR4SND80L` (sem "U") - o loader nunca carregava
 * o ID que a config esperava, um typo nunca notado no site antigo. Reaproveitado aqui já
 * corrigido, a pedido do Johnny (22/09/2026), pra manter o histórico da mesma property.
 */
const MEASUREMENT_ID = 'G-YYR4SND80L';

/** Mesma config do site legado (`src/js/analytics.js`) - mantida por continuidade. */
const COOKIE_DOMAIN = 'johnnysouto.com.br';
const COOKIE_EXPIRES_SECONDS = 60 * 60 * 24 * 90; // 90 dias

/**
 * Hostnames onde o Analytics roda de verdade. Derivado de `SITE_URL` (`core/seo/seo.ts`)
 * em vez de duplicar o domínio - cobre o `www.` e o domínio nu, caso o apex não redirecione
 * pra `www.` em algum momento.
 */
const PRODUCTION_HOSTNAMES: readonly string[] = (() => {
  const withWww = new URL(SITE_URL).hostname; // 'www.johnnysouto.com.br'
  const bare = withWww.replace(/^www\./, ''); // 'johnnysouto.com.br'
  return [withWww, bare];
})();

/**
 * Google Analytics (GA4), a pedido do Johnny (22/09/2026) - reimplementa o que o site
 * legado tinha (`src/js/analytics.js`), sem o bug do ID (ver `MEASUREMENT_ID` acima) e sem
 * banner de consentimento (o legado também não tinha - `acceptGA()` rodava sempre,
 * `refuseGA()` nunca era chamado; decisão do Johnny manter esse comportamento por ora).
 *
 * Em vez de uma 2ª property/ID só pra preview (o plano de migração cogitava isso), o
 * serviço só injeta o script quando o `hostname` é o domínio de produção
 * (`PRODUCTION_HOSTNAMES`) - preview da Vercel, `localhost` e qualquer outro host nunca
 * mandam dados. Combina com o app ser 100% estático (`outputMode: "static"`, sem
 * servidor Node pra ler variável de ambiente em runtime) e evita poluir os dados reais
 * sem precisar de infraestrutura extra.
 *
 * Não existe troca de rota Angular a rastrear (`app.routes.ts` tem uma única rota;
 * navegação de idioma é um reload completo via `LanguageService.navigate` - ver
 * `core/i18n/language.ts`), então um `gtag('config', ...)` por carregamento de página já
 * cobre a pageview, igual ao site estático legado.
 */
@Injectable({ providedIn: 'root' })
export class AnalyticsService {
  // `window`/`document` nao existem no SSR/prerender deste projeto (mesma guarda ja
  // documentada em `core/theme/theme.ts` e `core/i18n/language.ts`) - crítico aqui tambem
  // porque `window.location.hostname` nao tem um valor real durante o prerender.
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  init(): void {
    if (!this.isBrowser || !this.isProductionHost() || this.isAlreadyLoaded()) {
      return;
    }

    this.injectScript();
    this.configure();
  }

  private isProductionHost(): boolean {
    return PRODUCTION_HOSTNAMES.includes(window.location.hostname);
  }

  private isAlreadyLoaded(): boolean {
    return document.head.querySelector('script[data-analytics="ga4"]') !== null;
  }

  private injectScript(): void {
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${MEASUREMENT_ID}`;
    script.dataset['analytics'] = 'ga4';
    document.head.appendChild(script);
  }

  /**
   * Boilerplate padrao do gtag.js (https://developers.google.com/analytics/devguides/collection/ga4).
   * `window.gtag` precisa ficar exposto globalmente, nao so como funcao local deste
   * metodo (achado em QA no navegador, 22/09/2026: sem isso, `window.gtag(...)` chamado
   * de fora deste servico - ex.: rastrear um evento futuro - falha silenciosamente,
   * `window.gtag` fica `undefined`). Mesmo formato do snippet oficial do Google, que
   * declara `function gtag(){...}` no escopo global do script.
   *
   * `window['ga-disable-<ID>'] = false` (achado comparando com o site legado,
   * `src/js/analytics.js`, a pedido do Johnny, 22/09/2026): essa e a flag OFICIAL de
   * opt-out do gtag.js (`= true` desativa a coleta pra aquele ID). O servico nunca
   * definia essa flag, entao ficava `undefined` - deveria equivaler a "nao desativado",
   * mas foi essa exata diferenca (`false` explicito vs `undefined`) que fez a diferenca
   * num teste ao vivo em producao: reproduzindo o `acceptGA()` do site legado (que
   * seta essa flag) o hit de pageview foi enviado e apareceu no Realtime do GA4;
   * sem ela (o comportamento anterior deste servico), nenhuma tentativa de envio
   * acontecia. Setado aqui explicitamente por continuidade/seguranca, ainda que o
   * mecanismo exato pelo qual isso afeta o `gtag.js` nao esteja 100% documentado
   * publicamente pelo Google.
   */
  private configure(): void {
    // `window['ga-disable-<ID>']` e um nome de propriedade dinamico (`Window` nao declara
    // um indice pra ele, so as 2 propriedades acima) - cast local, restrito a essa unica
    // atribuicao, em vez de abrir um indice generico na interface `Window` inteira.
    (window as unknown as Record<string, boolean>)[`ga-disable-${MEASUREMENT_ID}`] = false;
    window.dataLayer = window.dataLayer ?? [];
    const gtag = (...args: unknown[]) => window.dataLayer?.push(args);
    window.gtag = gtag;

    gtag('js', new Date());
    gtag('config', MEASUREMENT_ID, {
      cookie_domain: COOKIE_DOMAIN,
      cookie_expires: COOKIE_EXPIRES_SECONDS,
      cookie_update: false,
    });
  }
}
