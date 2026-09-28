import { Component, PLATFORM_ID, effect, inject, input, output, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { ThemeService } from '../../core/theme/theme';
import { AnchorScrollService } from '../../core/navigation/anchor-scroll';
import { NAV_LINKS } from '../nav-links';
import { LanguageService } from '../../core/i18n/language';
import { LanguageSwitcher } from '../../shared/components/language-switcher/language-switcher';

/** Elementos considerados "focaveis" dentro do painel, pro focus trap (ver `trapFocus`). */
const FOCUSABLE_SELECTOR = 'a[href], button:not([disabled])';

/** Mesmo id usado no template (`mobile-menu.html`) pro elemento raiz do painel. */
const PANEL_ID = 'mobile-menu-panel';

/**
 * Folga entre o painel fechado e a borda da tela (27/09/2026, pro arraste - ver
 * `dragOffset` abaixo). Mesmo valor de `--space-8` usado no `transform` do painel em
 * mobile-menu.scss (`translateX(calc(100% + var(--space-8)))`) - hardcoded aqui de
 * proposito (ler a custom property via `getComputedStyle` pra evitar duplicar um numero
 * adicionaria complexidade/fragilidade - parsing de string "8px" - por um valor que so
 * muda se alguem mexer no design system). Se `--space-8` mudar, atualizar aqui tambem.
 */
const EDGE_GAP_PX = 8;

/** Distancia minima (px) de movimento antes de decidir se o gesto e um arraste horizontal
 * de verdade ou so um toque/scroll vertical - evita que um tap num link/botao dentro do
 * painel seja interpretado como inicio de arraste. */
const DRAG_ENGAGE_THRESHOLD_PX = 8;

/** Arrastou mais de 60% do caminho até o destino oposto -> troca de estado ao soltar;
 * menos que isso -> "encaixa" de volta no estado que já tinha. */
const DRAG_SNAP_RATIO = 0.6;

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
 * **Arraste pra abrir/fechar** (27/09/2026, a pedido do Johnny, alem do botao hamburguer
 * que ja existia): uma faixa fina e invisivel na borda direita da tela (`.mobile-menu__
 * edge-trigger`, so renderizada quando fechado) inicia o gesto de abrir; arrastar o
 * painel OU o scrim (quando aberto) inicia o de fechar - o scrim tambem precisa escutar
 * porque o painel so cobre ~85% da largura (mobile-menu.scss), entao a faixa de scrim a
 * esquerda dele tambem e uma area valida pra comecar o gesto de fechar (QA do Johnny,
 * 27/09/2026: arraste comecando fora do painel nao fechava). Usa a Pointer Events API (funciona
 * com toque E mouse) com `setPointerCapture` - so CAPTURA o ponteiro depois de confirmar
 * que e um arraste horizontal de verdade (`DRAG_ENGAGE_THRESHOLD_PX`), pra nao atrapalhar
 * um tap simples num link/botao dentro do painel nem um scroll vertical acidental que
 * comece na faixa da borda. Durante o arraste, `dragOffset` sobrescreve a transicao/
 * transform do CSS via `[style.*]` no template pra o painel acompanhar o dedo em tempo
 * real; ao soltar, decide entre abrir/fechar (`DRAG_SNAP_RATIO`) e volta a depender so da
 * classe CSS `mobile-menu--open` pro "encaixe" final (mesma transicao de sempre).
 * `openRequested` (novo output, simetrico ao `closed` que ja existia) e como o painel PEDE
 * pra abrir - continua sem estado proprio, e o `Header` quem decide de verdade.
 *
 * **Bloqueio de scroll do body enquanto aberto**: decisao de UX adicional (nao pedida
 * explicitamente na spec 8.13, nem no pedido desta tarefa) — comum em overlays de menu
 * mobile pra evitar que o conteudo atras role junto; revisar se o Johnny preferir outro
 * comportamento.
 */
@Component({
  selector: 'app-mobile-menu',
  imports: [LanguageSwitcher],
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
  protected readonly language = inject(LanguageService);
  protected readonly anchorScroll = inject(AnchorScrollService);
  protected readonly navLinks = NAV_LINKS;

  protected readonly panelId = PANEL_ID;

  readonly open = input<boolean>(false);
  readonly closed = output<void>();
  /** Pedido de abertura via arraste (ver nota de classe) - simetrico ao `closed` acima. */
  readonly openRequested = output<void>();

  /**
   * Deslocamento (px) do painel durante um arraste em andamento; `null` quando nao ha
   * arraste ativo (o `[style.transform]`/`[style.transition]` no template caem de volta
   * pro CSS estatico controlado por `mobile-menu--open`).
   */
  protected readonly dragOffset = signal<number | null>(null);

  private dragPointerId: number | null = null;
  private dragStartX = 0;
  private dragStartY = 0;
  private dragMode: 'open' | 'close' | null = null;
  private dragPanelWidth = 0;

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

  /** Pointerdown na faixa da borda direita (`.mobile-menu__edge-trigger`) - so quando
   * fechado. So registra a INTENCAO de arrastar pra abrir; nada visual acontece ainda
   * (ver `onDragMove`, que so "engata" o arraste depois do limiar de movimento). */
  protected onEdgeDragStart(event: PointerEvent): void {
    if (this.open() || !this.isBrowser) {
      return;
    }
    this.armDrag(event, 'open');
  }

  /** Pointerdown no painel OU no scrim (quando aberto) - mesma logica do gesto de abrir,
   * so que pro sentido contrario. Cobre os dois porque o painel so ocupa ~85% da largura
   * (mobile-menu.scss): um arraste que comeca na faixa de scrim a esquerda do painel
   * precisa fechar tambem, nao so um arraste que comeca em cima do painel (QA do Johnny,
   * 27/09/2026). Nao interfere em clique/tap normal em links e botoes dentro do painel nem
   * no clique do scrim (`(click)="close()"`, ainda ativo): so "engata" como arraste depois
   * do limiar de movimento (`onDragMove`), entao um toque que nao se move o suficiente
   * nunca captura o ponteiro nem chama `preventDefault`, e o clique acontece normalmente. */
  protected onCloseDragStart(event: PointerEvent): void {
    if (!this.open() || !this.isBrowser) {
      return;
    }
    this.armDrag(event, 'close');
  }

  private armDrag(event: PointerEvent, mode: 'open' | 'close'): void {
    this.dragPointerId = event.pointerId;
    this.dragStartX = event.clientX;
    this.dragStartY = event.clientY;
    this.dragMode = mode;
  }

  /**
   * Comum aos dois gestos (`(pointermove)` no template, tanto na faixa da borda quanto no
   * painel). Antes do arraste "engatar" (ver `dragOffset() === null` abaixo), so observa -
   * decide se o movimento e horizontal o bastante pra ser um arraste de verdade (contra um
   * tap parado ou um scroll vertical, que deixa o navegador tratar normalmente, sem
   * `preventDefault`). So DEPOIS de confirmado e que captura o ponteiro e mede o painel -
   * capturar cedo demais atrapalharia o clique nativo em links/botoes num tap simples.
   */
  protected onDragMove(event: PointerEvent): void {
    if (this.dragPointerId !== event.pointerId || this.dragMode === null) {
      return;
    }

    const deltaX = event.clientX - this.dragStartX;

    if (this.dragOffset() === null) {
      const deltaY = event.clientY - this.dragStartY;
      if (
        Math.abs(deltaX) < DRAG_ENGAGE_THRESHOLD_PX &&
        Math.abs(deltaY) < DRAG_ENGAGE_THRESHOLD_PX
      ) {
        return;
      }
      if (Math.abs(deltaY) >= Math.abs(deltaX)) {
        // Scroll vertical, nao arraste horizontal - desiste sem capturar nada.
        this.dragPointerId = null;
        this.dragMode = null;
        return;
      }

      const panel = document.getElementById(PANEL_ID);
      this.dragPanelWidth = panel?.getBoundingClientRect().width ?? 0;
      // `?.` + `try/catch`: capturar o ponteiro e "nice to have" (mantem o arraste
      // funcionando mesmo se o dedo/cursor sair de cima do elemento), nao essencial - o
      // resto do gesto (atualizar `dragOffset` abaixo) precisa continuar funcionando
      // mesmo se a captura falhar. Achado real ao testar no Chrome (26/09/2026): o metodo
      // LANCA `NotFoundError` (nao so falha silenciosamente) quando o navegador nao acha
      // "um ponteiro ativo" com aquele id - sem o try/catch, a excecao interrompia o
      // metodo ANTES da linha de baixo, travando o arraste. O jsdom (ambiente de teste)
      // nem implementa o metodo (por isso o `?.` tambem).
      try {
        (event.target as Element).setPointerCapture?.(event.pointerId);
      } catch {
        // Sem captura, o arraste ainda funciona - so fica mais sensivel a perder o
        // ponteiro se ele sair de cima do elemento durante o gesto.
      }
      this.dragOffset.set(this.dragMode === 'open' ? this.closedOffsetPx() : 0);
    }

    event.preventDefault();
    const closed = this.closedOffsetPx();
    const base = this.dragMode === 'open' ? closed : 0;
    this.dragOffset.set(Math.min(closed, Math.max(0, base + deltaX)));
  }

  /** `(pointerup)`/`(pointercancel)` no template - decide, pela posicao final, se troca de
   * estado (arrastou mais da metade do caminho) ou "encaixa" de volta no que já tinha. */
  protected onDragEnd(event: PointerEvent): void {
    if (this.dragPointerId !== event.pointerId) {
      return;
    }
    this.dragPointerId = null;
    const offset = this.dragOffset();
    const mode = this.dragMode;
    this.dragMode = null;

    if (offset === null) {
      // Nunca engatou como arraste (foi so um toque) - deixa o clique/tap acontecer normal.
      return;
    }

    const shouldBeOpen = offset < this.closedOffsetPx() * DRAG_SNAP_RATIO;
    this.dragOffset.set(null);

    if (shouldBeOpen && mode === 'open') {
      this.openRequested.emit();
    } else if (!shouldBeOpen && mode === 'close') {
      this.close();
    }
    // Nas outras 2 combinacoes (soltou sem passar do limiar), nao emite nada - o painel
    // volta sozinho pro estado anterior assim que `dragOffset` vira `null` (CSS de novo).
  }

  private closedOffsetPx(): number {
    return this.dragPanelWidth + EDGE_GAP_PX;
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
