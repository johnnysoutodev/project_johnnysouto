import { LOCALE_ID } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { APP_LOCALES, LanguageService } from '../../../core/i18n/language';
import { LanguageSwitcher } from './language-switcher';

describe('LanguageSwitcher', () => {
  let fixture: ComponentFixture<LanguageSwitcher>;
  let service: LanguageService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LanguageSwitcher],
      providers: [{ provide: LOCALE_ID, useValue: 'pt-BR' }],
    }).compileComponents();

    service = TestBed.inject(LanguageService);
    fixture = TestBed.createComponent(LanguageSwitcher);
    fixture.detectChanges();
  });

  afterEach(() => vi.restoreAllMocks());

  const links = () => fixture.debugElement.queryAll(By.css('.language-switcher__link'));

  it('renders one real link per locale (PT, EN, ES) with lang/hreflang and the native name', () => {
    expect(links().map((link) => link.nativeElement.textContent.trim())).toEqual([
      'PT',
      'EN',
      'ES',
    ]);
    const english = links()[1].nativeElement as HTMLAnchorElement;
    expect(english.getAttribute('href')).toBe('/en-us/');
    expect(english.getAttribute('hreflang')).toBe('en-US');
    expect(english.getAttribute('lang')).toBe('en-US');
    expect(english.getAttribute('aria-label')).toBe('English');
  });

  it('marks only the current locale with aria-current', () => {
    expect(links().map((link) => link.nativeElement.getAttribute('aria-current'))).toEqual([
      'true',
      null,
      null,
    ]);
  });

  it('selects another locale on click, preventing the default navigation', () => {
    const select = vi.spyOn(service, 'select').mockImplementation(() => undefined);
    const event = new MouseEvent('click', { bubbles: true, cancelable: true });

    links()[2].nativeElement.dispatchEvent(event);

    expect(event.defaultPrevented).toBe(true);
    expect(select).toHaveBeenCalledWith(APP_LOCALES[2]);
  });

  it('lets the browser handle modified clicks (e.g. open in a new tab)', () => {
    const select = vi.spyOn(service, 'select').mockImplementation(() => undefined);
    const event = new MouseEvent('click', { bubbles: true, cancelable: true, ctrlKey: true });

    links()[1].nativeElement.dispatchEvent(event);

    expect(event.defaultPrevented).toBe(false);
    expect(select).not.toHaveBeenCalled();
  });
});
