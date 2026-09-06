import { Component, PLATFORM_ID, effect, inject, input, output } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { ThemeService } from '../../core/theme/theme';
import { AnchorScrollService } from '../../core/navigation/anchor-scroll';
import { NAV_LINKS } from '../nav-links';

/** Elementos considerados "focaveis" dentro do painel, pro focus trap (ver `trapFocus`). */
const FOCUSABLE_SELECTOR = 'a[href], button:not([disabled])';

/** Mesmo id usado no template (`mobile-menu.html`) pro elemento raiz do painel. */
const PANEL_ID = 'mobile-menu-panel';

/**
 * Menu mobile (overlay) — design-system.md secao 8.13. Painel ancorado a direita
 * (`right: 0`, largura proporcional aos ~85% medidos no frame mobile de 375px do
 * Figma, com um teto em px pra nao ficar largo demais em telas maiores — ver
 * `mobile-menu.scss`) sobre um scrim com blur, com os 3 blocos documentados na spec
 * (Logo+fechar / Links de navegacao / Switch Theme+Download CV). Dark mode e automatico
 * via troca de tokens de cor (mesma convencao ja usada nos outros componentes).
 *
 * **Estado de abertura/fechamento** (decisao de implementacao — a spec 8.13 nao tem
 * frame de "fechado" nem gatilho de abertura documentado, mesma limitacao ja registrada
 * la): este componente e CONTROLADO, nao guarda estado proprio de aberto/fechado. Quem
 * decide e o `Header` (dono do botao hamburguer, `header.ts`, signal `isMobileMenuOpen`),
 * que desce o valor via `[open]` e recebe de volta o pedido de fechar via `(closed)`
 * (scrim clicado, Escape, botao "X", link de navegacao clicado) — o componente nunca
 * fecha sozinho, so avisa que quer fechar.
 *
 * **Transicao** (slide-in do painel da direita + fade do scrim): decisao de UI razoavel
 * pra um padrao comum de "drawer", NAO extraida do Figma (a spec so tem o frame estatico
 * do estado aberto).
 *
 * **Bloqueio de scroll do body enquanto aberto**: decisao de UX adicional (nao pedida
 * explicitamente na spec 8.13, nem no pedido desta tarefa) — comum em overlays de menu
 * mobile pra evitar que o conteudo atras role junto; revisar se o Johnny preferir outro
 * comportamento.
 */
@Component({
  selector: 'app-mobile-menu',
  imports: [],
  templateUrl: './mobile-menu.html',
  styleUrl: './mobile-menu.scss',
})
export class MobileMenu {
  // `document`/foco de DOM/`localStorage` nao existem no SSR/prerender deste projeto
  // (mesma guarda ja documentada em `core/theme/theme.ts` — ai-instructions.md, regra
  // de SSR-safety). Como o signal `open` so vira `true` a partir de um clique real no
  // Header (nunca durante o prerender), essa guarda e defensiva, nao estritamente
  // necessaria na pratica — mas segue a convencao do projeto de nao assumir isso.
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  /** Elemento que tinha foco antes de abrir — recebe o foco de volta ao fechar (WCAG AA). */
  private lastFocusedBeforeOpen: HTMLElement | null = null;

  private shouldRestoreFocus = true;

  protected readonly themeService = inject(ThemeService);
  protected readonly anchorScroll = inject(AnchorScrollService);
  protected readonly navLinks = NAV_LINKS;
  protected readonly panelId = PANEL_ID;

  readonly open = input<boolean>(false);
  readonly closed = output<void>();

  constructor() {
    effect(() => {
      const isOpen = this.open();
      if (!this.isBrowser) {
        return;
      }

      // Bloqueia o scroll do body atras do overlay enquanto aberto (ver nota de classe).
      document.body.style.overflow = isOpen ? 'hidden' : '';

      if (isOpen) {
        this.lastFocusedBeforeOpen = document.activeElement as HTMLElement | null;
        // `queueMicrotask`: este effect e o binding `[attr.inert]` do template (mesmo
        // arquivo, mobile-menu.html) reagem ambos ao signal `open`, sem ordem garantida
        // entre "effect roda" e "change detection aplica o binding". Focar sincronamente
        // aqui e um no-op silencioso quando o `inert=""` ainda nao foi removido do painel
        // (navegador recusa focar elemento inert) - confirmado num teste manual: o
        // `aria-expanded`/`inert` ficavam corretos, mas o foco nunca saia do <body>.
        // Empurrar pro proximo microtask garante que o binding ja aplicou antes do focus.
        queueMicrotask(() => this.focusFirstFocusableElement());
      } else {
        if (this.shouldRestoreFocus) {
          this.lastFocusedBeforeOpen?.focus();
        }

        this.lastFocusedBeforeOpen = null;
        this.shouldRestoreFocus = true;
      }
    });
  }

  protected close(restoreFocus = true): void {
    this.shouldRestoreFocus = restoreFocus;
    this.closed.emit();
  }

  /**
   * `Escape` fecha o menu; `Tab`/`Shift+Tab` fica preso dentro do painel (focus trap
   * basico) enquanto aberto — WCAG AA, nao e spec do Figma.
   */
  protected onPanelKeydown(event: KeyboardEvent): void {
    if (event.key === 'Escape') {
      event.preventDefault();
      this.close();
      return;
    }

    if (event.key === 'Tab') {
      this.trapFocus(event);
    }
  }

  private focusFirstFocusableElement(): void {
    this.queryFocusableElements()[0]?.focus();
  }

  private trapFocus(event: KeyboardEvent): void {
    const focusable = this.queryFocusableElements();
    if (focusable.length === 0) {
      return;
    }

    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    const active = document.activeElement;

    if (event.shiftKey && active === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && active === last) {
      event.preventDefault();
      first.focus();
    }
  }

  private queryFocusableElements(): HTMLElement[] {
    const panel = document.getElementById(PANEL_ID);
    return panel ? Array.from(panel.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)) : [];
  }
}
