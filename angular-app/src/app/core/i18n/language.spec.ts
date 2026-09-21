import { LOCALE_ID } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { APP_LOCALES, LanguageService } from './language';

function create(localeId: string): LanguageService {
  TestBed.configureTestingModule({ providers: [{ provide: LOCALE_ID, useValue: localeId }] });
  return TestBed.inject(LanguageService);
}

describe('LanguageService', () => {
  afterEach(() => {
    document.cookie = 'lang=; path=/; max-age=0';
    window.location.hash = '';
    vi.restoreAllMocks();
  });

  it('exposes the 3 supported locales with their URL segments', () => {
    const service = create('pt-BR');
    expect(service.locales.map((locale) => locale.path)).toEqual(['pt-br', 'en-us', 'es-es']);
  });

  it('resolves the current locale from LOCALE_ID', () => {
    expect(create('es-ES').current.code).toBe('es-ES');
  });

  it('falls back to pt-BR when LOCALE_ID is not a supported locale', () => {
    expect(create('fr-FR').current.code).toBe('pt-BR');
  });

  it('keeps the current hash in the link to another locale', () => {
    const service = create('pt-BR');
    window.location.hash = '#about';
    expect(service.hrefFor(APP_LOCALES[1])).toBe('/en-us/#about');
  });

  it('remembers the choice in the "lang" cookie and navigates to the other locale', () => {
    const service = create('pt-BR');
    const navigate = vi.spyOn(service, 'navigate').mockImplementation(() => undefined);

    service.select(APP_LOCALES[2]);

    expect(document.cookie).toContain('lang=es-es');
    expect(navigate).toHaveBeenCalledWith('/es-es/');
  });

  it('does nothing when the selected locale is the current one', () => {
    const service = create('pt-BR');
    const navigate = vi.spyOn(service, 'navigate').mockImplementation(() => undefined);

    service.select(APP_LOCALES[0]);

    expect(navigate).not.toHaveBeenCalled();
    expect(document.cookie).not.toContain('lang=');
  });
});
