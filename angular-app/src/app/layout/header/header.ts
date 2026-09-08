import { Component, DestroyRef, PLATFORM_ID, inject, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { IconButton } from '../../shared/components/icon-button/icon-button';
import { ThemeService } from '../../core/theme/theme';
import { AnchorScrollService } from '../../core/navigation/anchor-scroll';
import { MobileMenu } from '../mobile-menu/mobile-menu';
import { NAV_LINKS } from '../nav-links';

/** A partir de quantos pixels de scroll o Header entra no estado "rolado" (ver `isScrolled`). */
const SCROLL_THRESHOLD_PX = 8;

/**
 * Header — design-system.md secao 8.1. Nav horizontal escondida abaixo do desktop
 * (header.scss); a partir desta fatia, o menu mobile dedicado (`MobileMenu`,
 * design-system.md secao 8.13) cobre essa faixa via um botao de hamburguer proprio.
 *
 * Sticky + blur reativo ao scroll (08/09/2026, a pedido do Johnny - o Figma nao define
 * comportamento de scroll pro Header, "nao confirmavel" desde a extracao original;
 * decisao de UX/engenharia, seguindo um padrao comum de mercado, nao uma spec): `header`
 * fica `position: sticky` (header.scss) e o signal `isScrolled` abaixo alterna uma
 * classe que aplica fundo semi-transparente + `backdrop-filter: blur()` + sombra so
 * depois de rolar `SCROLL_THRESHOLD_PX`, ficando "limpo" (sem fundo/sombra) no topo da
 * pagina.
 */
@Component({
  selector: 'app-header',
  imports: [IconButton, MobileMenu],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {
  protected readonly themeService = inject(ThemeService);
  protected readonly anchorScroll = inject(AnchorScrollService);

  // `window`/eventos de scroll nao existem no SSR/prerender deste projeto - mesma
  // guarda ja obrigatoria desde o `ThemeService` (core/theme/theme.ts) pra qualquer
  // acesso a API de browser.
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  private readonly destroyRef = inject(DestroyRef);

  /** `true` depois que a pagina rola alem de `SCROLL_THRESHOLD_PX` (sempre `false` no SSR). */
  protected readonly isScrolled = signal(false);

  private readonly updateIsScrolled = (): void => {
    this.isScrolled.set(window.scrollY > SCROLL_THRESHOLD_PX);
  };

  constructor() {
    if (this.isBrowser) {
      this.updateIsScrolled();
      window.addEventListener('scroll', this.updateIsScrolled, { passive: true });
      this.destroyRef.onDestroy(() => {
        window.removeEventListener('scroll', this.updateIsScrolled);
      });
    }
  }

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
