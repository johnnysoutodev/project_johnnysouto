import {
  Component,
  DestroyRef,
  ElementRef,
  PLATFORM_ID,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { NgOptimizedImage, isPlatformBrowser } from '@angular/common';
import { AnchorScrollService } from '../../core/navigation/anchor-scroll';

/** A partir de quantos pixels de scroll o botao "voltar ao topo" aparece. */
const SCROLL_THRESHOLD_PX = 400;

/**
 * Botao flutuante "voltar ao topo" (08/09/2026, a pedido do Johnny - nao existe no
 * Figma, "la estava tudo estatico"; decisao de UX/engenharia, nao spec do Figma).
 * Fica escondido (opacidade 0 + `pointer-events: none`, nao `display: none`, pra manter
 * a transicao suave) ate a pagina rolar `SCROLL_THRESHOLD_PX` (bem mais que o threshold
 * do Header sticky, 8px - o botao so faz sentido depois de rolar de verdade, nao logo
 * no primeiro pixel). Clique reaproveita o `AnchorScrollService` (mesmo scroll animado
 * de 650ms, com easing e respeito a `prefers-reduced-motion`, ja usado pelos links de
 * nav do Header/menu mobile) mirando o marcador `#top` de `app.html`.
 */
@Component({
  selector: 'app-scroll-to-top',
  imports: [NgOptimizedImage],
  templateUrl: './scroll-to-top.html',
  styleUrl: './scroll-to-top.scss',
})
export class ScrollToTop {
  protected readonly anchorScroll = inject(AnchorScrollService);

  // `window` nao existe no SSR/prerender deste projeto - mesma guarda ja obrigatoria
  // desde o `ThemeService` (core/theme/theme.ts) pra qualquer acesso a API de browser.
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  private readonly destroyRef = inject(DestroyRef);

  private readonly link = viewChild.required<ElementRef<HTMLAnchorElement>>('scrollLink');

  /** `true` depois que a pagina rola alem de `SCROLL_THRESHOLD_PX` (sempre `false` no SSR). */
  protected readonly isVisible = signal(false);

  // Ao clicar no botao (mouse ou teclado), o foco fica nele; se ele ainda estiver
  // visivel/focado no momento de esconder, o navegador bloqueia com "Blocked aria-hidden
  // on an element because its descendant retained focus" (achado via QA no Chrome,
  // 08/09/2026) porque a tecnologia assistiva nao pode perder de vista um elemento que
  // ainda considera focado. Tirar o foco primeiro resolve isso.
  private hideIfVisible(): void {
    if (!this.isVisible()) {
      return;
    }
    const linkEl = this.link().nativeElement;
    if (document.activeElement === linkEl) {
      linkEl.blur();
    }
    this.isVisible.set(false);
  }

  private readonly updateIsVisible = (): void => {
    if (window.scrollY > SCROLL_THRESHOLD_PX) {
      this.isVisible.set(true);
    } else {
      this.hideIfVisible();
    }
  };

  // Terceiro round de QA do Johnny num dispositivo mobile real (08/09/2026): depois de um
  // clique no botao, o `scrollY` volta a 0 (a pagina visualmente sobe) mas o botao fica
  // preso visivel pra sempre - inclusive rolagem MANUAL subsequente (gesto de toque de
  // verdade) parava de conseguir escondê-lo, o que só se explica se o listener de
  // `scroll` (`window.addEventListener('scroll', ...)`) parasse de disparar/ser
  // processado depois daquele ponto nesse navegador especifico, não só durante a
  // animação do clique em si (as duas tentativas anteriores de correção, presas na
  // hipotese de "só o clique", não resolveram). Trocado o evento `scroll` por um polling
  // via `requestAnimationFrame` que roda continuamente enquanto o componente existe -
  // le `window.scrollY` a cada frame (~60x/s, comparação simples, custo desprezível) e
  // não depende de NENHUM evento do navegador disparar corretamente, eliminando de vez
  // essa classe inteira de inconsistência entre navegadores/gestos.
  private rafId: number | null = null;

  private readonly pollScroll = (): void => {
    this.updateIsVisible();
    this.rafId = requestAnimationFrame(this.pollScroll);
  };

  protected onClick(event: MouseEvent): void {
    this.anchorScroll.scroll(event, '#top');
    this.hideIfVisible();
  }

  constructor() {
    if (this.isBrowser) {
      this.pollScroll();
      this.destroyRef.onDestroy(() => {
        if (this.rafId !== null) {
          cancelAnimationFrame(this.rafId);
        }
      });
    }
  }
}
