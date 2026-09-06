import { Component } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { IconButton } from '../../shared/components/icon-button/icon-button';

/**
 * Ano da primeira experiencia real documentada (Nielsen do Brasil, Jan/2006 -
 * design-system.md secao 10), usado como base pro calculo de anos de experiencia da bio.
 */
export const EXPERIENCE_START_YEAR = 2006;

/**
 * Anos de experiencia como funcao pura (testavel sem precisar mockar `Date`) - o
 * componente so passa o ano atual pra ela.
 */
export function calculateExperienceYears(
  currentYear: number,
  startYear: number = EXPERIENCE_START_YEAR,
): number {
  return currentYear - startYear;
}

/**
 * Hero — design-system.md secao 8.8. Duas colunas (`gap: 48px`): esquerda com
 * nome/cargo/bio + links sociais; direita com a composicao em camadas no lugar da foto
 * (secao 10: sem foto real disponivel — bloco neutro com iniciais no lugar do `<img>`).
 *
 * Bloco "Location + Hire" da spec original (8.8) NAO entra aqui: nao ha dado real de
 * localizacao/disponibilidade no curriculo do Johnny, e a secao 10 (decisoes de
 * conteudo real ja confirmadas) nao cobre esse caso — omitido em vez de inventado (ver
 * relatorio da tarefa que gerou este componente para essa observacao).
 */
@Component({
  selector: 'app-hero',
  imports: [IconButton, NgOptimizedImage],
  templateUrl: './hero.html',
  styleUrl: './hero.scss',
})
export class Hero {
  /** GitHub real do Johnny (design-system.md secao 10) — tem icone (`icon-social-github`). */
  protected readonly githubUrl = 'https://github.com/johnnysoutodev';

  /**
   * LinkedIn real do Johnny — sem icone equivalente no Figma (design-system.md secoes
   * 8.12/10, confirmado ausente no arquivo). Renderizado como link de texto simples (ver
   * `hero.html`), em vez de um SVG generico "emprestado" de fora do Figma dentro de um
   * Icon Button: opcao mais simples e acessivel, sem inventar um asset visual que o
   * design nao definiu.
   */
  protected readonly linkedinUrl = 'https://www.linkedin.com/in/johnnysouto';

  /**
   * Calculado uma vez no build (site e SSG/prerender — PLANO-MIGRACAO-ANGULAR.md secao
   * 2), mesmo padrao ja usado pelo `currentYear` do Footer — nao precisa de guarda de
   * plataforma porque `Date` existe tanto no browser quanto no Node/prerender.
   */
  protected readonly experienceYears = calculateExperienceYears(new Date().getFullYear());
}
