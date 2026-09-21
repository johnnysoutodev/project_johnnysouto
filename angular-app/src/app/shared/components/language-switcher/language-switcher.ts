import { Component, inject } from '@angular/core';
import { AppLocale, LanguageService } from '../../../core/i18n/language';

/**
 * Seletor de idioma (PT | EN | ES). Cada opcao e um link real (`href`, `hreflang`) para o
 * build do idioma - funciona sem JS e e rastreavel; o clique so grava o cookie `lang` e
 * preserva o `#secao` (`LanguageService.select`). O idioma atual fica marcado com
 * `aria-current` e nao navega.
 */
@Component({
  selector: 'app-language-switcher',
  templateUrl: './language-switcher.html',
  styleUrl: './language-switcher.scss',
})
export class LanguageSwitcher {
  protected readonly language = inject(LanguageService);

  protected onSelect(event: MouseEvent, locale: AppLocale): void {
    // Deixa o navegador tratar cliques com modificador (abrir em nova aba etc.).
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) {
      return;
    }
    event.preventDefault();
    this.language.select(locale);
  }
}
