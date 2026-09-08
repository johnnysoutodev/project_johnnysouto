import { PLATFORM_ID } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { AnchorScrollService } from '../../core/navigation/anchor-scroll';
import { ScrollToTop } from './scroll-to-top';

describe('ScrollToTop', () => {
  let component: ScrollToTop;
  let fixture: ComponentFixture<ScrollToTop>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ScrollToTop],
    }).compileComponents();

    fixture = TestBed.createComponent(ScrollToTop);
    component = fixture.componentInstance;
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  // O componente checa `scrollY` via polling de `requestAnimationFrame` (08/09/2026 - ver
  // comentario em scroll-to-top.ts sobre o motivo), nao mais via evento `scroll`. O teste
  // chama a checagem privada direto (mesmo padrao ja usado no bloco SSR abaixo pra ler
  // `isVisible()`) em vez de tentar mockar `requestAnimationFrame` globalmente - isso
  // colidiria com o proprio scheduler zoneless do Angular, que tambem usa rAF internamente.
  function scrollTo(y: number) {
    vi.spyOn(window, 'scrollY', 'get').mockReturnValue(y);
    (component as unknown as { updateIsVisible: () => void }).updateIsVisible();
    fixture.detectChanges();
  }

  function link() {
    return fixture.debugElement.query(By.css('.scroll-to-top'));
  }

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('starts hidden (invisible, unfocusable, hidden from assistive tech) at the top of the page', () => {
    fixture.detectChanges();

    const el = link().nativeElement;
    expect(el.classList).not.toContain('scroll-to-top--visible');
    expect(el.getAttribute('tabindex')).toBe('-1');
    expect(el.getAttribute('aria-hidden')).toBe('true');
  });

  it('becomes visible/focusable after scrolling past the threshold', () => {
    fixture.detectChanges();

    scrollTo(500);

    const el = link().nativeElement;
    expect(el.classList).toContain('scroll-to-top--visible');
    expect(el.getAttribute('tabindex')).toBeNull();
    expect(el.getAttribute('aria-hidden')).toBe('false');
  });

  it('hides again when scrolling back up above the threshold', () => {
    fixture.detectChanges();
    scrollTo(500);

    scrollTo(0);

    expect(link().nativeElement.classList).not.toContain('scroll-to-top--visible');
  });

  it('continua escondendo em pollings seguintes mesmo depois de varios ciclos (nao trava)', () => {
    fixture.detectChanges();
    scrollTo(500);
    scrollTo(0);
    scrollTo(500);

    scrollTo(0);

    expect(link().nativeElement.classList).not.toContain('scroll-to-top--visible');
  });

  it('tira o foco do botao antes de esconde-lo, pra nao violar aria-hidden com foco retido', () => {
    fixture.detectChanges();
    scrollTo(500);
    const el = link().nativeElement as HTMLAnchorElement;
    el.focus();
    expect(document.activeElement).toBe(el);

    scrollTo(0);

    expect(document.activeElement).not.toBe(el);
    expect(el.getAttribute('aria-hidden')).toBe('true');
  });

  it('points to the real #top marker and delegates the click to AnchorScrollService', () => {
    fixture.detectChanges();
    const scrollSpy = vi
      .spyOn(TestBed.inject(AnchorScrollService), 'scroll')
      .mockImplementation(() => undefined);

    expect(link().nativeElement.getAttribute('href')).toBe('#top');

    link().triggerEventHandler('click', new MouseEvent('click'));

    expect(scrollSpy).toHaveBeenCalledWith(expect.any(MouseEvent), '#top');
  });

  it('esconde o botao direto no clique, sem depender do proximo frame de polling chegar (mobile, 08/09/2026)', () => {
    fixture.detectChanges();
    scrollTo(500);
    vi.spyOn(TestBed.inject(AnchorScrollService), 'scroll').mockImplementation(() => undefined);
    expect(link().nativeElement.classList).toContain('scroll-to-top--visible');

    link().triggerEventHandler('click', new MouseEvent('click', { button: 0 }));
    fixture.detectChanges();

    expect(link().nativeElement.classList).not.toContain('scroll-to-top--visible');
  });

  it('esconde no clique mesmo quando o clique sintetizado (toque mobile) nao reporta button/modificadores como um clique de mouse', () => {
    // Guarda anterior baseada em `event.button`/teclas modificadoras foi removida de
    // proposito (08/09/2026): nao da pra confiar que um clique sintetizado a partir de
    // toque mobile reporte esses campos do jeito esperado - simulando aqui com um evento
    // que tem `metaKey` setado (equivalente ao que aquela checagem removida rejeitaria).
    fixture.detectChanges();
    scrollTo(500);
    vi.spyOn(TestBed.inject(AnchorScrollService), 'scroll').mockImplementation(() => undefined);
    expect(link().nativeElement.classList).toContain('scroll-to-top--visible');

    link().triggerEventHandler('click', new MouseEvent('click', { metaKey: true }));
    fixture.detectChanges();

    expect(link().nativeElement.classList).not.toContain('scroll-to-top--visible');
  });
});

describe('ScrollToTop - SSR', () => {
  it('nao acessa "window" na plataforma servidor', async () => {
    await TestBed.configureTestingModule({
      imports: [ScrollToTop],
      providers: [{ provide: PLATFORM_ID, useValue: 'server' }],
    }).compileComponents();

    const serverFixture = TestBed.createComponent(ScrollToTop);
    expect(() => serverFixture.detectChanges()).not.toThrow();
    expect(serverFixture.componentInstance['isVisible']()).toBe(false);
  });
});
