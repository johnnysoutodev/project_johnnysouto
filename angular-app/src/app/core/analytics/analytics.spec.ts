import { PLATFORM_ID } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { AnalyticsService } from './analytics';

describe('AnalyticsService', () => {
  afterEach(() => {
    delete (window as { gtag?: unknown }).gtag;
  });

  it('does nothing when gtag has not loaded yet (no consent / not on production host)', () => {
    const service = TestBed.inject(AnalyticsService);

    expect(() => service.trackEvent('download_cv', { language: 'pt-BR' })).not.toThrow();
  });

  it('calls window.gtag("event", ...) once gtag has loaded', () => {
    const gtag = vi.fn();
    window.gtag = gtag;
    const service = TestBed.inject(AnalyticsService);

    service.trackEvent('download_cv', { language: 'pt-BR' });

    expect(gtag).toHaveBeenCalledWith('event', 'download_cv', { language: 'pt-BR' });
  });

  it('does not call gtag on the server (SSR/prerender), even if it exists on window', () => {
    TestBed.overrideProvider(PLATFORM_ID, { useValue: 'server' });
    const gtag = vi.fn();
    window.gtag = gtag;

    const service = TestBed.inject(AnalyticsService);
    service.trackEvent('download_cv');

    expect(gtag).not.toHaveBeenCalled();
  });
});
