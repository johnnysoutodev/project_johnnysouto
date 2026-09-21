import { DOCUMENT } from '@angular/common';
import { LOCALE_ID } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Meta, Title } from '@angular/platform-browser';
import { describe, expect, it } from 'vitest';
import { SITE_URL, SeoService } from './seo';

function apply(localeId: string) {
  TestBed.configureTestingModule({ providers: [{ provide: LOCALE_ID, useValue: localeId }] });
  TestBed.inject(SeoService).apply();
  return {
    title: TestBed.inject(Title),
    meta: TestBed.inject(Meta),
    document: TestBed.inject(DOCUMENT),
  };
}

describe('SeoService', () => {
  it('sets the page title and description', () => {
    const { title, meta } = apply('pt-BR');
    expect(title.getTitle()).toBe('Johnny Souto | Engenheiro de Software');
    expect(meta.getTag('name="description"')?.content).toContain('20 anos');
    expect(meta.getTag('property="og:title"')?.content).toBe(title.getTitle());
  });

  it.each([
    ['pt-BR', 'pt-br', 'pt_BR'],
    ['en-US', 'en-us', 'en_US'],
    ['es-ES', 'es-es', 'es_ES'],
  ])('points canonical/og:url/og:locale to the %s build', (localeId, path, ogLocale) => {
    const { meta, document } = apply(localeId);
    const canonical = document.head.querySelector('link[rel="canonical"]');
    expect(canonical?.getAttribute('href')).toBe(`${SITE_URL}/${path}/`);
    expect(meta.getTag('property="og:url"')?.content).toBe(`${SITE_URL}/${path}/`);
    expect(meta.getTag('property="og:locale"')?.content).toBe(ogLocale);
  });

  it.each([
    ['pt', 'pt-BR'],
    ['en-US', 'en-US'],
    ['es', 'es-ES'],
  ])('sets <html lang> to the full BCP 47 code for the %s build', (localeId, lang) => {
    const { document } = apply(localeId);
    expect(document.documentElement.lang).toBe(lang);
  });

  it('reuses the canonical link instead of adding a second one', () => {
    const { document } = apply('en-US');
    TestBed.inject(SeoService).apply();
    expect(document.head.querySelectorAll('link[rel="canonical"]').length).toBe(1);
  });
});
