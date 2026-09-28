import { PLATFORM_ID } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { MobileMenu } from './mobile-menu';

describe('MobileMenu', () => {
  let fixture: ComponentFixture<MobileMenu>;
  let component: MobileMenu;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MobileMenu],
    }).compileComponents();

    fixture = TestBed.createComponent(MobileMenu);
    component = fixture.componentInstance;
    fixture.detectChanges();
    TestBed.flushEffects();
  });

  afterEach(() => {
    // Efeitos colaterais reais de DOM/storage (scroll lock, ThemeService) que precisam
    // ser limpos entre testes, mesmo criterio ja usado em `core/theme/theme.spec.ts`.
    document.body.style.overflow = '';
    localStorage.clear();
    document.documentElement.removeAttribute('data-theme');
  });

  it('renders the CV download as a link to the current language file', () => {
    const cta = fixture.debugElement.query(By.css('a.mobile-menu__cta'))
      .nativeElement as HTMLAnchorElement;
    expect(cta.getAttribute('href')).toMatch(
      /^assets\/cv\/cv_johnny-souto_[a-z]{2}-[a-z]{2}\.pdf$/,
    );
    expect(cta.hasAttribute('download')).toBe(true);
  });

  function panel(): HTMLElement {
    return fixture.debugElement.query(By.css('.mobile-menu__panel')).nativeElement;
  }

  function scrim(): HTMLElement {
    return fixture.debugElement.query(By.css('.mobile-menu__scrim')).nativeElement;
  }

  function focusableElements(): HTMLElement[] {
    return fixture.debugElement
      .queryAll(By.css('a[href], button'))
      .map((el) => el.nativeElement as HTMLElement);
  }

  // `await open()`: o componente empurra o `.focus()` inicial pra um `queueMicrotask`
  // (ver comentario em `mobile-menu.ts`, constructor) porque esse `.focus()` e o binding
  // `[attr.inert]` do template reagem ao mesmo signal sem ordem garantida entre si - focar
  // sincronamente falha silenciosamente se `inert` ainda nao foi removido do painel
  // (bug real encontrado em revisao manual no navegador, nao pego pelos testes ate essa
  // correcao: a versao anterior deste helper chamava `detectChanges()` ANTES de
  // `flushEffects()`, o que coincidentemente ja removia o `inert` a tempo dentro do
  // teste, mascarando a race que acontecia de verdade no browser). Um `await
  // Promise.resolve()` aqui espera esse microtask rodar antes do teste continuar.
  async function open(): Promise<void> {
    fixture.componentRef.setInput('open', true);
    fixture.detectChanges();
    TestBed.flushEffects();
    await Promise.resolve();
  }

  function close(): void {
    fixture.componentRef.setInput('open', false);
    fixture.detectChanges();
    TestBed.flushEffects();
  }

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('starts closed: sem a classe --open, painel inert, scroll do body livre', () => {
    expect(fixture.debugElement.query(By.css('.mobile-menu--open'))).toBeNull();
    expect(panel().hasAttribute('inert')).toBe(true);
    expect(document.body.style.overflow).toBe('');
  });

  it('abre: classe --open aplicada, painel deixa de ser inert, scroll do body travado', async () => {
    await open();

    expect(fixture.debugElement.query(By.css('.mobile-menu--open'))).toBeTruthy();
    expect(panel().hasAttribute('inert')).toBe(false);
    expect(document.body.style.overflow).toBe('hidden');
  });

  it('destrava o scroll do body ao fechar de novo', async () => {
    await open();
    close();

    expect(document.body.style.overflow).toBe('');
  });

  it('emite (closed) ao clicar no scrim', async () => {
    let closed = false;
    component.closed.subscribe(() => (closed = true));

    await open();
    scrim().click();

    expect(closed).toBe(true);
  });

  it('emite (closed) ao clicar no botao de fechar ("X")', async () => {
    let closed = false;
    component.closed.subscribe(() => (closed = true));

    await open();
    fixture.debugElement.query(By.css('.mobile-menu__close')).nativeElement.click();

    expect(closed).toBe(true);
  });

  it('emite (closed) ao clicar num link de navegacao', async () => {
    let closed = false;
    component.closed.subscribe(() => (closed = true));

    await open();
    fixture.debugElement.query(By.css('.mobile-menu__link')).nativeElement.click();

    expect(closed).toBe(true);
  });

  it('emite (closed) ao pressionar Escape dentro do painel', async () => {
    let closed = false;
    component.closed.subscribe(() => (closed = true));

    await open();
    panel().dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));

    expect(closed).toBe(true);
  });

  it('move o foco pro primeiro elemento focavel do painel ao abrir', async () => {
    await open();

    expect(document.activeElement).toBe(
      fixture.debugElement.query(By.css('.mobile-menu__close')).nativeElement,
    );
  });

  it('devolve o foco pro elemento que estava focado antes de abrir, ao fechar', async () => {
    const trigger = document.createElement('button');
    document.body.appendChild(trigger);
    trigger.focus();

    await open();
    expect(document.activeElement).not.toBe(trigger);

    close();
    expect(document.activeElement).toBe(trigger);

    trigger.remove();
  });

  it('focus trap: Tab no ultimo elemento focavel volta pro primeiro', async () => {
    await open();

    const focusable = focusableElements();
    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    last.focus();
    panel().dispatchEvent(
      new KeyboardEvent('keydown', { key: 'Tab', bubbles: true, cancelable: true }),
    );

    expect(document.activeElement).toBe(first);
  });

  it('focus trap: Shift+Tab no primeiro elemento focavel vai pro ultimo', async () => {
    await open();

    const focusable = focusableElements();
    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    first.focus();
    panel().dispatchEvent(
      new KeyboardEvent('keydown', {
        key: 'Tab',
        shiftKey: true,
        bubbles: true,
        cancelable: true,
      }),
    );

    expect(document.activeElement).toBe(last);
  });

  it('nao mexe no foco de elementos fora do painel quando Tab e pressionado sem estar nas bordas', async () => {
    await open();

    const focusable = focusableElements();
    const middle = focusable[1];
    middle.focus();

    panel().dispatchEvent(
      new KeyboardEvent('keydown', { key: 'Tab', bubbles: true, cancelable: true }),
    );

    // Sem preventDefault do nosso handler (nao e a borda), o navegador real avancaria o
    // foco sozinho - jsdom nao simula isso, entao so confirmamos que o handler NAO forcou
    // o foco de volta pro primeiro/ultimo elemento (ou seja, nao interferiu).
    expect(document.activeElement).toBe(middle);
  });

  it('mostra lua no tema claro e sol no tema escuro conforme a acao disponivel', async () => {
    await open();

    const themeToggle = fixture.debugElement.query(By.css('.mobile-menu__theme-row'));
    expect(themeToggle.query(By.css('circle'))).toBeNull();
    expect(themeToggle.attributes['aria-pressed']).toBe('false');

    themeToggle.nativeElement.click();
    fixture.detectChanges();

    expect(themeToggle.query(By.css('circle'))).toBeTruthy();
    expect(themeToggle.attributes['aria-pressed']).toBe('true');
  });

  it('a linha inteira do tema e um unico botao clicavel, com "Trocar Tema" como texto visivel', async () => {
    await open();

    const themeRow = fixture.debugElement.query(By.css('.mobile-menu__theme-row'));
    expect(themeRow.nativeElement.tagName).toBe('BUTTON');
    expect(themeRow.nativeElement.textContent).toContain('Trocar Tema');
    // Nao deve mais existir um botao separado so pro icone (a linha toda e o alvo de
    // toque agora, achado do Johnny em QA mobile, 22/09/2026).
    expect(fixture.debugElement.query(By.css('.mobile-menu__theme-toggle'))).toBeNull();

    themeRow.nativeElement.click();
    fixture.detectChanges();

    expect(themeRow.attributes['aria-pressed']).toBe('true');
  });

  /**
   * Arraste pra abrir/fechar (27/09/2026, ver nota completa em mobile-menu.ts). O jsdom
   * (ambiente de teste) nao faz layout de verdade - `getBoundingClientRect()` do painel
   * sempre volta zerado - entao mockamos a largura pra ter uma faixa de arraste
   * significativa pra testar o limiar de "encaixe" (`DRAG_SNAP_RATIO`). Sem esse mock, o
   * "fechado" cairia em so 8px (`EDGE_GAP_PX`), igual ao limiar de engate do gesto
   * (`DRAG_ENGAGE_THRESHOLD_PX`), sem espaco pra um caso de "arrastou um pouco, mas nao o
   * bastante".
   */
  describe('arraste (abrir/fechar)', () => {
    const PANEL_WIDTH = 320; // fechado = 320 + EDGE_GAP_PX (8) = 328px; 60% disso = 196,8px.

    function edgeTrigger(): HTMLElement {
      const el = fixture.debugElement.query(By.css('.mobile-menu__edge-trigger'));
      expect(el, 'faixa da borda deveria existir com o menu fechado').toBeTruthy();
      return el.nativeElement as HTMLElement;
    }

    function pointerEvent(type: string, clientX: number, clientY = 0): PointerEvent {
      return new PointerEvent(type, {
        pointerId: 1,
        clientX,
        clientY,
        bubbles: true,
        cancelable: true,
      });
    }

    /** Dispara pointerdown -> pointermove -> pointerup no MESMO elemento, do jeito que o
     * template escuta (sem depender de `setPointerCapture` de verdade - ver nota em
     * mobile-menu.ts sobre esse metodo ser opcional/no-op no jsdom). */
    function drag(el: HTMLElement, fromX: number, toX: number, fromY = 0, toY = 0): PointerEvent {
      el.dispatchEvent(pointerEvent('pointerdown', fromX, fromY));
      const move = pointerEvent('pointermove', toX, toY);
      el.dispatchEvent(move);
      fixture.detectChanges();
      el.dispatchEvent(pointerEvent('pointerup', toX, toY));
      fixture.detectChanges();
      return move;
    }

    beforeEach(() => {
      vi.spyOn(panel(), 'getBoundingClientRect').mockReturnValue({
        width: PANEL_WIDTH,
      } as DOMRect);
    });

    it('arrastar a faixa da borda mais da metade do caminho pede pra abrir (openRequested)', () => {
      let opened = false;
      component.openRequested.subscribe(() => (opened = true));

      drag(edgeTrigger(), 300, 0);

      expect(opened).toBe(true);
    });

    it('arrastar a faixa da borda menos da metade do caminho: solta e "encaixa" de volta fechado', () => {
      let opened = false;
      component.openRequested.subscribe(() => (opened = true));

      drag(edgeTrigger(), 300, 280); // engata (20px > limiar), mas fica bem perto do fechado

      expect(opened).toBe(false);
      expect(fixture.debugElement.query(By.css('.mobile-menu--open'))).toBeNull();
    });

    it('arrastar o painel aberto mais da metade do caminho emite (closed)', async () => {
      let closed = false;
      component.closed.subscribe(() => (closed = true));
      await open();

      drag(panel(), 0, 250);

      expect(closed).toBe(true);
    });

    it('arrastar o painel aberto pouco: solta e "encaixa" de volta aberto, sem emitir (closed)', async () => {
      let closed = false;
      component.closed.subscribe(() => (closed = true));
      await open();

      drag(panel(), 0, 100); // engata, mas fica bem perto do aberto

      expect(closed).toBe(false);
    });

    // QA do Johnny (27/09/2026): o painel so cobre ~85% da largura, entao um arraste
    // comecando na faixa de scrim a esquerda do painel (nao em cima do painel em si)
    // tambem precisa fechar - antes dessa correcao, o scrim so escutava `(click)`.
    it('arrastar o SCRIM mais da metade do caminho tambem emite (closed)', async () => {
      let closed = false;
      component.closed.subscribe(() => (closed = true));
      await open();

      drag(scrim(), 0, 250);

      expect(closed).toBe(true);
    });

    it('arrastar o SCRIM pouco: solta e "encaixa" de volta aberto, sem emitir (closed)', async () => {
      let closed = false;
      component.closed.subscribe(() => (closed = true));
      await open();

      drag(scrim(), 0, 100);

      expect(closed).toBe(false);
    });

    it('um toque que nao se move o bastante nao engata como arraste (nao atrapalha um tap/clique)', async () => {
      let closed = false;
      component.closed.subscribe(() => (closed = true));
      await open();

      drag(panel(), 0, 3); // 3px, abaixo do limiar de engate

      expect(closed).toBe(false);
      expect(panel().style.transform).toBe('');
    });

    it('um gesto majoritariamente vertical no painel nao intercepta o scroll nativo', async () => {
      let closed = false;
      component.closed.subscribe(() => (closed = true));
      await open();

      const move = drag(panel(), 0, 20, 0, 200); // deltaX=20, deltaY=200 - vertical domina

      expect(move.defaultPrevented).toBe(false);
      expect(closed).toBe(false);
      expect(panel().style.transform).toBe('');
    });

    it('o painel acompanha o dedo em tempo real durante o arraste (antes de soltar)', async () => {
      await open();

      panel().dispatchEvent(pointerEvent('pointerdown', 0, 0));
      panel().dispatchEvent(pointerEvent('pointermove', 150, 0));
      fixture.detectChanges();

      // Ainda com o ponteiro pressionado (sem pointerup): o transform/transition inline
      // devem refletir o arraste em andamento, nao mais o estado estatico do CSS.
      expect(panel().style.transition).toBe('none');
      expect(panel().style.transform).toBe('translateX(150px)');

      panel().dispatchEvent(pointerEvent('pointerup', 150, 0));
      fixture.detectChanges();

      // Ao soltar, volta a depender so da classe CSS (inline style limpo).
      expect(panel().style.transform).toBe('');
    });
  });
});

describe('MobileMenu — SSR-safety (plataforma servidor)', () => {
  let fixture: ComponentFixture<MobileMenu>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MobileMenu],
      providers: [{ provide: PLATFORM_ID, useValue: 'server' }],
    }).compileComponents();

    fixture = TestBed.createComponent(MobileMenu);
    fixture.detectChanges();
    TestBed.flushEffects();
  });

  afterEach(() => {
    document.body.style.overflow = '';
  });

  it('nao lanca erro nem mexe em document/body ao "abrir" durante o prerender (sem window/document reais)', () => {
    expect(() => {
      fixture.componentRef.setInput('open', true);
      fixture.detectChanges();
      TestBed.flushEffects();
    }).not.toThrow();

    expect(document.body.style.overflow).toBe('');
  });
});
