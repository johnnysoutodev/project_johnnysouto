import { Injectable, LOCALE_ID, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

/** Idioma suportado pelo site: um build por idioma (i18n nativo do Angular), cada um em `/<path>/`. */
export interface AppLocale {
  /** Codigo BCP 47 completo: `<html lang>`, `hreflang` e `og:locale`. */
  readonly code: 'pt-BR' | 'en-US' | 'es-ES';
  /**
   * Valor de `LOCALE_ID` no build (codigo de locale do Angular, `angular.json`). `pt` e `es`
   * em vez de `pt-BR`/`es-ES` porque o Angular so tem dados de locale para `pt` (= pt-BR) e
   * `es`; com `pt-BR`/`es-ES` o build emite avisos "Locale data ... cannot be found".
   */
  readonly localeId: string;
  /** Segmento de URL do build (`subPath` em `angular.json`) e valor do cookie `lang`. */
  readonly path: string;
  /** Rotulo curto do seletor. */
  readonly short: string;
  /** Nome do idioma no proprio idioma (nao traduzido - lido por leitores de tela com `lang`). */
  readonly name: string;
}

export const APP_LOCALES: readonly AppLocale[] = [
  { code: 'pt-BR', localeId: 'pt', path: 'pt-br', short: 'PT', name: 'Português' },
  { code: 'en-US', localeId: 'en-US', path: 'en-us', short: 'EN', name: 'English' },
  { code: 'es-ES', localeId: 'es', path: 'es-es', short: 'ES', name: 'Español' },
];

const COOKIE_NAME = 'lang';
const COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24 * 365;

/**
 * Idioma atual e troca de idioma. Como cada idioma e um build separado, trocar e uma
 * NAVEGACAO completa para `/<idioma>/` (preservando o `#secao` atual), nao uma troca em
 * runtime. A escolha vai pro cookie `lang`, que a regra de redirecionamento da raiz
 * (`vercel.json`) le antes do `Accept-Language` do navegador. Mesmo padrao de guarda
 * SSR do `ThemeService` (`core/theme/theme.ts`): `document`/`window` so no browser.
 */
@Injectable({ providedIn: 'root' })
export class LanguageService {
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  private readonly localeId = inject(LOCALE_ID);

  readonly locales = APP_LOCALES;

  /** Idioma do build atual (cai em pt-BR se o `LOCALE_ID` nao for um dos suportados). */
  readonly current: AppLocale =
    APP_LOCALES.find(
      (locale) => locale.localeId === this.localeId || locale.code === this.localeId,
    ) ?? APP_LOCALES[0];

  /**
   * CV para download do idioma atual: `cv_johnny-souto_<sufixo>.pdf` (`pt-br`, `en-us` ou
   * `es-es`, o mesmo segmento da URL) em `public/assets/cv/`. Caminho relativo ao `base href`
   * do build, entao cada idioma entrega o seu proprio arquivo.
   */
  get cvFileName(): string {
    return `cv_johnny-souto_${this.current.path}.pdf`;
  }

  get cvHref(): string {
    return `assets/cv/${this.cvFileName}`;
  }

  /** Destino de um idioma, com o hash atual (`#about`) quando houver. */
  hrefFor(locale: AppLocale): string {
    const hash = this.isBrowser ? window.location.hash : '';
    return `/${locale.path}/${hash}`;
  }

  /** Grava a escolha e navega para o outro idioma. */
  select(locale: AppLocale): void {
    if (!this.isBrowser || locale.code === this.current.code) {
      return;
    }
    this.rememberChoice(locale);
    this.navigate(this.hrefFor(locale));
  }

  private rememberChoice(locale: AppLocale): void {
    document.cookie = `${COOKIE_NAME}=${locale.path}; path=/; max-age=${COOKIE_MAX_AGE_SECONDS}; SameSite=Lax`;
  }

  /** Isolado em um metodo pra os testes poderem espionar (jsdom nao implementa `location.assign`). */
  navigate(url: string): void {
    window.location.assign(url);
  }
}
