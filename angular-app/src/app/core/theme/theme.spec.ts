import { PLATFORM_ID } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { ThemeService } from './theme';

describe('ThemeService', () => {
  afterEach(() => {
    localStorage.clear();
    document.documentElement.removeAttribute('data-theme');
    // jsdom (ambiente de teste) nao implementa `matchMedia` por padrao - os 2 testes
    // abaixo que precisam dele fazem `window.matchMedia = vi.fn(...)` diretamente (nao
    // da pra `vi.spyOn` algo que nao existe); limpa aqui pra nao vazar entre testes.
    delete (window as { matchMedia?: unknown }).matchMedia;
  });

  // `effect()` (used by ThemeService to sync the signal to <html>/localStorage) runs
  // asynchronously by default - `TestBed.flushEffects()` forces pending effects to run
  // synchronously so assertions right after don't race the scheduler.
  function create(): ThemeService {
    const service = TestBed.inject(ThemeService);
    TestBed.flushEffects();
    return service;
  }

  it('defaults to the theme already applied on <html> by the anti-FOUC script', () => {
    document.documentElement.setAttribute('data-theme', 'dark');

    const service = create();

    expect(service.theme()).toBe('dark');
  });

  it('falls back to localStorage when <html> has no data-theme yet', () => {
    localStorage.setItem('theme', 'dark');

    const service = create();

    expect(service.theme()).toBe('dark');
  });

  it('falls back to prefers-color-scheme when nothing is persisted', () => {
    const matchMediaSpy = vi.fn().mockReturnValue({ matches: true } as MediaQueryList);
    window.matchMedia = matchMediaSpy;

    const service = create();

    expect(service.theme()).toBe('dark');
    expect(matchMediaSpy).toHaveBeenCalledWith('(prefers-color-scheme: dark)');
  });

  it('defaults to light when nothing is persisted and prefers-color-scheme does not match', () => {
    window.matchMedia = vi.fn().mockReturnValue({ matches: false } as MediaQueryList);

    const service = create();

    expect(service.theme()).toBe('light');
  });

  it('toggle() flips the theme and writes it to <html> and localStorage', () => {
    const service = create();
    expect(service.theme()).toBe('light');

    service.toggle();
    TestBed.flushEffects();

    expect(service.theme()).toBe('dark');
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
    expect(localStorage.getItem('theme')).toBe('dark');

    service.toggle();
    TestBed.flushEffects();

    expect(service.theme()).toBe('light');
    expect(document.documentElement.getAttribute('data-theme')).toBe('light');
    expect(localStorage.getItem('theme')).toBe('light');
  });

  it(
    'does not overwrite a persisted theme with the transient initial signal value ' +
      '(regression: effect() used to run once with the default light value before the ' +
      'real theme was read, clobbering both <html> and localStorage back to light)',
    () => {
      localStorage.setItem('theme', 'dark');

      create();

      expect(localStorage.getItem('theme')).toBe('dark');
      expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
    },
  );

  it('does not touch document/localStorage when running on the server (SSR/prerender)', () => {
    TestBed.overrideProvider(PLATFORM_ID, { useValue: 'server' });
    localStorage.setItem('theme', 'dark');

    // On the server the signal stays at its 'light' default (no DOM to read a real
    // theme from) - toggling still updates the signal itself (pure state), it's only
    // the DOM/localStorage write in the effect that must stay a no-op.
    const service = create();
    expect(service.theme()).toBe('light');

    service.toggle();
    TestBed.flushEffects();

    // No ReferenceError thrown (this is the regression: `document` does not exist during
    // this project's prerender - see the comment in theme.ts) and no DOM/storage side effect.
    expect(service.theme()).toBe('dark');
    expect(document.documentElement.hasAttribute('data-theme')).toBe(false);
    expect(localStorage.getItem('theme')).toBe('dark');
  });
});
