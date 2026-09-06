import { Component, inject, signal } from '@angular/core';
import { IconButton } from '../../shared/components/icon-button/icon-button';
import { ThemeService } from '../../core/theme/theme';
import { MobileMenu } from '../mobile-menu/mobile-menu';
import { NAV_LINKS } from '../nav-links';

/**
 * Header — design-system.md secao 8.1. Estrutura estatica (sem sticky/scroll — nao
 * confirmavel no Figma, ver secao 8.1). Nav horizontal escondida abaixo do desktop
 * (header.scss); a partir desta fatia, o menu mobile dedicado (`MobileMenu`,
 * design-system.md secao 8.13) cobre essa faixa via um botao de hamburguer proprio.
 */
@Component({
  selector: 'app-header',
  imports: [IconButton, MobileMenu],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {
  protected readonly themeService = inject(ThemeService);

  /**
   * 4 links de navegacao (design-system.md secao 8.1), fonte compartilhada com o menu
   * mobile (`../nav-links.ts`) — mesma lista, sem duplicar rotulos/ordem em 2 lugares.
   */
  protected readonly navLinks = NAV_LINKS;

  /**
   * Estado de abertura do menu mobile — decisao de implementacao: a spec 8.13 nao tem
   * frame de "fechado" nem gatilho de abertura documentado no Figma (limitacao ja
   * registrada la). Vive aqui (Header, dono do botao hamburguer) e desce como `[open]`
   * pro `MobileMenu`, que e "controlado" (sem estado proprio) e so pede pra fechar via
   * `(closed)` (scrim, Escape, botao "X", link clicado) — o Header e a unica fonte de
   * verdade do estado.
   */
  protected readonly isMobileMenuOpen = signal(false);

  protected toggleMobileMenu(): void {
    this.isMobileMenuOpen.update((open) => !open);
  }

  protected closeMobileMenu(): void {
    this.isMobileMenuOpen.set(false);
  }
}
