import { Component, input } from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';

/**
 * Variante de tamanho (design-system.md secao 8.3): "default" = 36x36 (icone 24x24),
 * "large" = 44x44 (icone 32x32). Unico valor de prop `size` confirmado no Figma foi
 * "md" (equivalente a "default" aqui); "large" e nomeado por analogia, ja que o Figma
 * nao expoe uma lista formal de variantes (secao 9.3) — o dado real e so a dimensao
 * observada nas duas instancias (Header/Hero = 36x36, Contact me = 44x44).
 */
export type IconButtonSize = 'default' | 'large';

@Component({
  selector: 'app-icon-button',
  imports: [NgTemplateOutlet],
  templateUrl: './icon-button.html',
  styleUrl: './icon-button.scss',
})
export class IconButton {
  /** Padding (6px) e border-radius (8px) sao iguais nas duas variantes (secao 8.3). */
  readonly size = input<IconButtonSize>('default');

  /**
   * Rotulo acessivel obrigatorio: o botao so tem um icone projetado via `ng-content`,
   * sem texto visivel, entao precisa de um nome acessivel explicito (WCAG AA).
   */
  readonly ariaLabel = input.required<string>();

  /**
   * `aria-pressed` para usos como toggle (ex.: alternar tema). `undefined` (padrao) nao
   * renderiza o atributo - usos que nao sao toggle (link social, acao de card, "copiar")
   * nao devem virar um toggle button pra leitores de tela.
   */
  readonly pressed = input<boolean>();

  /**
   * Link externo opcional (ex.: redes sociais no Hero/Contact me, acao de projeto no
   * Work - design-system.md secoes 8.3/8.8). Quando definido, o componente renderiza um
   * `<a>` em vez de `<button>` - colocar um `<button>` dentro de um `<a>` (ou vice-versa)
   * seria conteudo interativo aninhado (HTML invalido); trocar o elemento raiz resolve
   * isso sem duplicar o markup/estilo do botao de icone para cada uso que precisa linkar.
   */
  readonly href = input<string>();
}
