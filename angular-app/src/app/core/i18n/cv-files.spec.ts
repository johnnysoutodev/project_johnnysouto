import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { LOCALE_ID } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';
import { APP_LOCALES, LanguageService } from './language';

// Garante que o botao "Download CV" nunca aponte para um arquivo que nao existe: cada
// idioma do site precisa ter o seu PDF em `public/assets/cv/`, com o nome que o
// `LanguageService.cvFileName` gera (`cv_johnny-souto_<pt-br|en-us|es-es>.pdf`). `ng test`
// roda a partir da raiz de `angular-app/`.
describe('CV files (public/assets/cv)', () => {
  it.each(APP_LOCALES)('has a valid PDF for $code', (locale) => {
    TestBed.configureTestingModule({
      providers: [{ provide: LOCALE_ID, useValue: locale.localeId }],
    });
    const { cvFileName } = TestBed.inject(LanguageService);
    const file = resolve(process.cwd(), 'public', 'assets', 'cv', cvFileName);

    expect(existsSync(file), `arquivo ausente: public/assets/cv/${cvFileName}`).toBe(true);
    // Todo PDF valido comeca com "%PDF-" (evita um arquivo vazio ou renomeado por engano).
    expect(readFileSync(file).subarray(0, 5).toString('latin1')).toBe('%PDF-');
  });
});
