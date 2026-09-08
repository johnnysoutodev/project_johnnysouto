import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Footer } from './footer';

describe('Footer', () => {
  let component: Footer;
  let fixture: ComponentFixture<Footer>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Footer],
    }).compileComponents();

    fixture = TestBed.createComponent(Footer);
    component = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('renders "JSD Technologies" as a real link, opening in a new tab safely', () => {
    const link = fixture.debugElement.query(By.css('.footer__link'));

    expect(link.nativeElement.textContent.trim()).toBe('JSD Technologies');
    expect(link.nativeElement.getAttribute('href')).toBe('https://www.jsdeveloper.com.br/');
    expect(link.nativeElement.getAttribute('target')).toBe('_blank');
    expect(link.nativeElement.getAttribute('rel')).toBe('noopener noreferrer');
  });
});
