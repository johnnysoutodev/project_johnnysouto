import { PLATFORM_ID } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { ConsentService } from './consent';

describe('ConsentService', () => {
  afterEach(() => {
    localStorage.clear();
    delete (window as { loadGoogleAnalytics?: unknown }).loadGoogleAnalytics;
  });

  it('starts as "unknown" when nothing is persisted', () => {
    const service = TestBed.inject(ConsentService);

    expect(service.status()).toBe('unknown');
  });

  it('starts as "accepted" when a previous visit already accepted', () => {
    localStorage.setItem('cookie-consent', 'accepted');

    const service = TestBed.inject(ConsentService);

    expect(service.status()).toBe('accepted');
  });

  it('accept() persists the choice, updates the status, and reloads GA4', () => {
    const loadGoogleAnalytics = vi.fn();
    window.loadGoogleAnalytics = loadGoogleAnalytics;
    const service = TestBed.inject(ConsentService);

    service.accept();

    expect(service.status()).toBe('accepted');
    expect(localStorage.getItem('cookie-consent')).toBe('accepted');
    expect(loadGoogleAnalytics).toHaveBeenCalled();
  });

  it('decline() updates the status but does NOT persist anything (asks again next visit)', () => {
    const service = TestBed.inject(ConsentService);

    service.decline();

    expect(service.status()).toBe('declined');
    expect(localStorage.getItem('cookie-consent')).toBeNull();
  });

  it('a fresh instance after decline() starts as "unknown" again (nothing was persisted)', () => {
    TestBed.inject(ConsentService).decline();

    const freshService = TestBed.runInInjectionContext(() => new ConsentService());

    expect(freshService.status()).toBe('unknown');
  });

  it('does not throw and stays "unknown" on the server (SSR/prerender), even accept()/decline()', () => {
    TestBed.overrideProvider(PLATFORM_ID, { useValue: 'server' });
    localStorage.setItem('cookie-consent', 'accepted');

    const service = TestBed.inject(ConsentService);
    expect(service.status()).toBe('unknown');

    expect(() => service.accept()).not.toThrow();
    expect(service.status()).toBe('unknown');

    expect(() => service.decline()).not.toThrow();
    expect(service.status()).toBe('unknown');
  });
});
