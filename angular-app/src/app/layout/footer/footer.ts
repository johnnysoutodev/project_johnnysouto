import { Component } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';

/**
 * Footer — design-system.md secao 8.2. Estrutura simples (icone de copyright + texto),
 * sem elementos interativos (sem estado de hover/active a documentar).
 */
@Component({
  selector: 'app-footer',
  imports: [NgOptimizedImage],
  templateUrl: './footer.html',
  styleUrl: './footer.scss',
})
export class Footer {
  /**
   * Ano calculado uma vez (build/prerender e SSG - PLANO-MIGRACAO-ANGULAR.md secao 2),
   * nao a cada render, ja que o site e estatico.
   */
  protected readonly currentYear = new Date().getFullYear();
}
