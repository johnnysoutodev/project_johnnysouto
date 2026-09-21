import { Component, inject, input } from '@angular/core';
import { AppLocale, LanguageService } from '../../../core/i18n/language';

/**
 * Seletor de idioma: `<select>` nativo (Português / English / Español) - acessivel por
 * padrao (teclado, leitor de tela) e com a UI nativa em celulares. Escolher outro idioma
 * grava o cookie `lang` e navega para o build daquele idioma preservando o `#secao`
 * (`LanguageService.select`); o idioma atual fica pre-selecionado.
 *
 * `layout="inline"` (menu mobile): em vez do `<select>`, mostra os 3 idiomas como botoes lado
 * a lado. O popup nativo do `<select>` e desenhado pelo navegador (posicao/estilo fora do
 * nosso controle, ainda mais dentro do painel do menu), entao no mobile a escolha fica
 * direto na tela.
 */
@Component({
  selector: 'app-language-switcher',
  templateUrl: './language-switcher.html',
  styleUrl: './language-switcher.scss',
})
export class LanguageSwitcher {
  protected readonly language = inject(LanguageService);

  readonly layout = input<'select' | 'inline'>('select');

  protected choose(locale: AppLocale): void {
    this.language.select(locale);
  }

  protected onChange(event: Event): void {
    const code = (event.target as HTMLSelectElement).value;
    const locale = this.language.locales.find((item) => item.code === code);
    if (locale) {
      this.language.select(locale);
    }
  }
}
