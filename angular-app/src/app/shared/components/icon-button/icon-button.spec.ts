import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { IconButton } from './icon-button';

/**
 * Host de teste com conteudo projetado real (`<ng-content>`) - cobre uma regressao
 * encontrada ao gerar este componente: `<ng-content>` duplicado dentro dos 2 branches do
 * `@if`/`@else` fazia a projecao falhar silenciosamente (elemento raiz renderizava
 * vazio, sem erro). O fix usa `ngTemplateOutlet` (ver icon-button.html); este teste
 * garante que o icone projetado continua aparecendo nos dois branches (button/link).
 */
@Component({
  selector: 'app-icon-button-host',
  imports: [IconButton],
  template: `
    <app-icon-button [href]="href" ariaLabel="Test">
      <span class="projected-icon">icon</span>
    </app-icon-button>
  `,
})
class IconButtonHost {
  href: string | undefined;
}

describe('IconButton', () => {
  let component: IconButton;
  let fixture: ComponentFixture<IconButton>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IconButton],
    }).compileComponents();

    fixture = TestBed.createComponent(IconButton);
    fixture.componentRef.setInput('ariaLabel', 'Test');
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('renders a <button> by default (no href)', () => {
    fixture.detectChanges();

    expect(fixture.debugElement.query(By.css('button.icon-button'))).toBeTruthy();
    expect(fixture.debugElement.query(By.css('a.icon-button'))).toBeNull();
  });

  it('renders an <a> with safe external-link attributes when href is set', () => {
    fixture.componentRef.setInput('href', 'https://example.com');
    fixture.detectChanges();

    const link = fixture.debugElement.query(By.css('a.icon-button'));
    expect(link).toBeTruthy();
    expect(link.nativeElement.getAttribute('href')).toBe('https://example.com');
    expect(link.nativeElement.getAttribute('target')).toBe('_blank');
    expect(link.nativeElement.getAttribute('rel')).toBe('noopener noreferrer');
    expect(fixture.debugElement.query(By.css('button.icon-button'))).toBeNull();
  });
});

describe('IconButton — conteúdo projetado (ng-content)', () => {
  it('projeta o ícone dentro do <button> quando não há href', async () => {
    const fixture: ComponentFixture<IconButtonHost> = TestBed.createComponent(IconButtonHost);
    fixture.detectChanges();

    const projected = fixture.debugElement.query(By.css('button.icon-button .projected-icon'));
    expect(projected?.nativeElement.textContent).toBe('icon');
  });

  it('projeta o ícone dentro do <a> quando há href', async () => {
    const fixture: ComponentFixture<IconButtonHost> = TestBed.createComponent(IconButtonHost);
    fixture.componentInstance.href = 'https://example.com';
    fixture.detectChanges();

    const projected = fixture.debugElement.query(By.css('a.icon-button .projected-icon'));
    expect(projected?.nativeElement.textContent).toBe('icon');
  });
});
