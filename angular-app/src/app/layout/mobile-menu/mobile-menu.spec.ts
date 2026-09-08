import { PLATFORM_ID } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
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

    const themeToggle = fixture.debugElement.query(By.css('.mobile-menu__theme-toggle'));
    expect(themeToggle.query(By.css('circle'))).toBeNull();
    expect(themeToggle.attributes['aria-pressed']).toBe('false');

    themeToggle.nativeElement.click();
    fixture.detectChanges();

    expect(themeToggle.query(By.css('circle'))).toBeTruthy();
    expect(themeToggle.attributes['aria-pressed']).toBe('true');
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
