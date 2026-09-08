import { PLATFORM_ID } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { Header } from './header';
import { MobileMenu } from '../mobile-menu/mobile-menu';

describe('Header', () => {
  let component: Header;
  let fixture: ComponentFixture<Header>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Header],
    }).compileComponents();

    fixture = TestBed.createComponent(Header);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  afterEach(() => {
    // O `MobileMenu` bloqueia o scroll do body enquanto aberto (mobile-menu.ts) -
    // garante que um teste que abriu o menu nao vaze esse efeito colateral pro proximo.
    document.body.style.overflow = '';
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('botao de hamburguer (menu mobile)', () => {
    function menuToggleButton() {
      return fixture.debugElement.query(By.css('.header__menu-toggle'))
        .nativeElement as HTMLButtonElement;
    }

    it('starts closed, with aria-expanded="false"', () => {
      fixture.detectChanges();

      expect(menuToggleButton().getAttribute('aria-expanded')).toBe('false');
      expect(menuToggleButton().getAttribute('aria-label')).toBe('Abrir menu');
    });

    it('opens the mobile menu on click and flips aria-expanded/aria-label', () => {
      fixture.detectChanges();

      menuToggleButton().click();
      fixture.detectChanges();

      expect(menuToggleButton().getAttribute('aria-expanded')).toBe('true');
      expect(menuToggleButton().getAttribute('aria-label')).toBe('Fechar menu');
    });

    it('toggles closed again on a second click', () => {
      fixture.detectChanges();

      menuToggleButton().click();
      fixture.detectChanges();
      menuToggleButton().click();
      fixture.detectChanges();

      expect(menuToggleButton().getAttribute('aria-expanded')).toBe('false');
    });

    it('references the mobile menu overlay via aria-controls', () => {
      fixture.detectChanges();

      expect(menuToggleButton().getAttribute('aria-controls')).toBe('mobile-menu');
      expect(fixture.debugElement.query(By.css('#mobile-menu'))).toBeTruthy();
    });

    it('passes isMobileMenuOpen() down to <app-mobile-menu> as [open]', () => {
      fixture.detectChanges();

      const mobileMenu = fixture.debugElement.query(By.directive(MobileMenu))
        .componentInstance as MobileMenu;
      expect(mobileMenu.open()).toBe(false);

      menuToggleButton().click();
      fixture.detectChanges();

      expect(mobileMenu.open()).toBe(true);
    });

    it('closes the mobile menu when MobileMenu emits (closed)', () => {
      fixture.detectChanges();
      menuToggleButton().click();
      fixture.detectChanges();
      expect(menuToggleButton().getAttribute('aria-expanded')).toBe('true');

      const mobileMenu = fixture.debugElement.query(By.directive(MobileMenu))
        .componentInstance as MobileMenu;
      mobileMenu.closed.emit();
      fixture.detectChanges();

      expect(menuToggleButton().getAttribute('aria-expanded')).toBe('false');
    });
  });

  describe('sticky + blur ao rolar', () => {
    function scrollTo(y: number) {
      vi.spyOn(window, 'scrollY', 'get').mockReturnValue(y);
      window.dispatchEvent(new Event('scroll'));
      fixture.detectChanges();
    }

    afterEach(() => {
      vi.restoreAllMocks();
    });

    it('starts without the "scrolled" class at the top of the page', () => {
      fixture.detectChanges();

      expect(fixture.debugElement.query(By.css('.header')).nativeElement.classList).not.toContain(
        'header--scrolled',
      );
    });

    it('adds the "scrolled" class after passing the scroll threshold', () => {
      fixture.detectChanges();

      scrollTo(100);

      expect(fixture.debugElement.query(By.css('.header')).nativeElement.classList).toContain(
        'header--scrolled',
      );
    });

    it('removes the "scrolled" class again when scrolling back up to the top', () => {
      fixture.detectChanges();
      scrollTo(100);

      scrollTo(0);

      expect(fixture.debugElement.query(By.css('.header')).nativeElement.classList).not.toContain(
        'header--scrolled',
      );
    });
  });

});

describe('Header - sticky + blur ao rolar - SSR', () => {
  it('nao acessa "window" na plataforma servidor', async () => {
    await TestBed.configureTestingModule({
      imports: [Header],
      providers: [{ provide: PLATFORM_ID, useValue: 'server' }],
    }).compileComponents();

    const serverFixture = TestBed.createComponent(Header);
    expect(() => serverFixture.detectChanges()).not.toThrow();
    expect(serverFixture.componentInstance['isScrolled']()).toBe(false);
  });
});
