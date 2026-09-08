import { Component } from '@angular/core';

/**
 * Footer — design-system.md secao 8.2. Estrutura simples, so texto (icone de copyright
 * do Figma removido pelo Johnny). "JSD Technologies" (08/09/2026, a pedido do Johnny) e
 * um link real pro site da JSD Technologies (`https://www.jsdeveloper.com.br/`),
 * `target="_blank"` com `rel="noopener noreferrer"` (mitiga reverse tabnabbing).
 */
@Component({
  selector: 'app-footer',
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
