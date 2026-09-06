import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { afterEach, describe, expect, it } from 'vitest';
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
});
