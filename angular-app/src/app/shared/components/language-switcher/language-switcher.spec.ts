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
      providers: [{ provide: LOCALE_ID, useValue: 'pt' }],
    }).compileComponents();

    service = TestBed.inject(LanguageService);
    fixture = TestBed.createComponent(LanguageSwitcher);
    fixture.detectChanges();
  });

  afterEach(() => vi.restoreAllMocks());

  const select = () =>
    fixture.debugElement.query(By.css('.language-switcher__select'))
      .nativeElement as HTMLSelectElement;

  it('renders a labelled select with the 3 languages by their native names', () => {
    expect(select().getAttribute('aria-label')).toBe('Idioma');
    const options = Array.from(select().options);
    expect(options.map((option) => option.textContent?.trim())).toEqual([
      'Português',
      'English',
      'Español',
    ]);
    expect(options.map((option) => option.value)).toEqual(['pt-BR', 'en-US', 'es-ES']);
    expect(options.map((option) => option.getAttribute('lang'))).toEqual([
      'pt-BR',
      'en-US',
      'es-ES',
    ]);
  });

  it('pre-selects the current language', () => {
    expect(select().value).toBe('pt-BR');
  });

  it('selects the chosen language when the value changes', () => {
    const selectLocale = vi.spyOn(service, 'select').mockImplementation(() => undefined);

    select().value = 'es-ES';
    select().dispatchEvent(new Event('change'));

    expect(selectLocale).toHaveBeenCalledWith(APP_LOCALES[2]);
  });

  describe('inline layout (mobile menu)', () => {
    beforeEach(() => {
      fixture = TestBed.createComponent(LanguageSwitcher);
      fixture.componentRef.setInput('layout', 'inline');
      fixture.detectChanges();
    });

    const options = () => fixture.debugElement.queryAll(By.css('.language-switcher__option'));

    it('renders the 3 languages as buttons instead of a select', () => {
      expect(fixture.debugElement.query(By.css('select'))).toBeNull();
      expect(options().map((option) => option.nativeElement.textContent.trim())).toEqual([
        'Português',
        'English',
        'Español',
      ]);
    });

    it('marks only the current language as pressed', () => {
      expect(options().map((option) => option.nativeElement.getAttribute('aria-pressed'))).toEqual([
        'true',
        'false',
        'false',
      ]);
    });

    it('selects the clicked language', () => {
      const selectLocale = vi.spyOn(service, 'select').mockImplementation(() => undefined);

      options()[1].nativeElement.click();

      expect(selectLocale).toHaveBeenCalledWith(APP_LOCALES[1]);
    });
  });
});
