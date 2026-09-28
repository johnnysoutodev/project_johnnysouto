import { PLATFORM_ID } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { afterEach, describe, expect, it } from 'vitest';
import { CookieConsentBanner } from './cookie-consent-banner';
import { ConsentService } from '../../core/consent/consent';

describe('CookieConsentBanner', () => {
  let fixture: ComponentFixture<CookieConsentBanner>;

  afterEach(() => {
    localStorage.clear();
  });

  function create(): void {
    fixture = TestBed.createComponent(CookieConsentBanner);
    fixture.detectChanges();
  }

  function banner() {
    return fixture.debugElement.query(By.css('.cookie-consent'));
  }

  it('shows the banner when consent is still unknown', () => {
    create();

    expect(banner()).toBeTruthy();
  });

  it('does not show the banner when a previous visit already accepted', () => {
    localStorage.setItem('cookie-consent', 'accepted');

    create();

    expect(banner()).toBeNull();
  });

  it('clicking "Aceitar" calls ConsentService.accept() and hides the banner', () => {
    create();
    const consent = TestBed.inject(ConsentService);

    fixture.debugElement.query(By.css('.cookie-consent__accept')).nativeElement.click();
    fixture.detectChanges();

    expect(consent.status()).toBe('accepted');
    expect(localStorage.getItem('cookie-consent')).toBe('accepted');
    expect(banner()).toBeNull();
  });

  it('clicking "Cancelar" calls ConsentService.decline(), hides the banner, and persists nothing', () => {
    create();
    const consent = TestBed.inject(ConsentService);

    fixture.debugElement.query(By.css('.cookie-consent__decline')).nativeElement.click();
    fixture.detectChanges();

    expect(consent.status()).toBe('declined');
    expect(localStorage.getItem('cookie-consent')).toBeNull();
    expect(banner()).toBeNull();
  });

  it('never renders on the server (SSR/prerender), even with consent unknown', () => {
    TestBed.overrideProvider(PLATFORM_ID, { useValue: 'server' });

    expect(() => create()).not.toThrow();
    expect(banner()).toBeNull();
  });
});
