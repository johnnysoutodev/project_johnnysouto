import { Component } from '@angular/core';
import { IconButton } from '../../shared/components/icon-button/icon-button';

interface HeaderNavLink {
  readonly label: string;
  readonly href: string;
}

/**
 * Header — design-system.md secao 8.1. Estrutura estatica (sem sticky/scroll — nao
 * confirmavel no Figma, ver secao 8.1) e sem menu mobile dedicado ainda (fica para
 * quando essa funcionalidade for tratada na Fase 2, ver PLANO-MIGRACAO-ANGULAR.md).
 */
@Component({
  selector: 'app-header',
  imports: [IconButton],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {
  /**
   * 4 links de navegacao (design-system.md secao 8.1). Rotas/secoes reais (About, Work,
   * Testimonials, Contact me) ainda nao existem no projeto — apontam para anchors que
   * serao criados junto com cada secao nas proximas fatias da Fase 2.
   */
  protected readonly navLinks: readonly HeaderNavLink[] = [
    { label: 'About', href: '#about' },
    { label: 'Work', href: '#work' },
    { label: 'Testimonials', href: '#testimonials' },
    { label: 'Contact', href: '#contact' },
  ];
}
