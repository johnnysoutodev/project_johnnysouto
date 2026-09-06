import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { EXPERIENCE_START_YEAR, Hero, calculateExperienceYears } from './hero';

describe('calculateExperienceYears', () => {
  it('calcula os anos a partir do ano-base real (Nielsen do Brasil, Jan/2006)', () => {
    expect(calculateExperienceYears(2026)).toBe(20);
  });

  it('aceita um ano de inicio customizado', () => {
    expect(calculateExperienceYears(2030, 2010)).toBe(20);
  });

  it('retorna 0 quando o ano atual e igual ao ano-base', () => {
    expect(calculateExperienceYears(EXPERIENCE_START_YEAR)).toBe(0);
  });
});

describe('Hero', () => {
  let component: Hero;
  let fixture: ComponentFixture<Hero>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Hero],
    }).compileComponents();

    fixture = TestBed.createComponent(Hero);
    component = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('renders the name in the H1 and the role/experience years in the bio paragraph', () => {
    const title = fixture.debugElement.query(By.css('.hero__title'));
    expect(title.nativeElement.textContent).toContain('Johnny Souto');

    const bio = fixture.debugElement.query(By.css('.hero__bio'));
    expect(bio.nativeElement.textContent).toContain('Analista Desenvolvedor de Sistemas');
    expect(bio.nativeElement.textContent).toContain(String(component['experienceYears']));
  });

  it('renders the GitHub icon button as a real external link', () => {
    const githubLink = fixture.debugElement.query(By.css('a.icon-button'));
    expect(githubLink.nativeElement.getAttribute('href')).toBe(
      'https://github.com/johnnysoutodev',
    );
    expect(githubLink.nativeElement.getAttribute('target')).toBe('_blank');
  });

  it('renders LinkedIn as a plain text link, not an Icon Button (no icon in the Figma file)', () => {
    const linkedinLink = fixture.debugElement.query(By.css('.hero__linkedin-link'));
    expect(linkedinLink.nativeElement.getAttribute('href')).toBe(
      'https://www.linkedin.com/in/johnnysouto',
    );
    expect(linkedinLink.nativeElement.textContent.trim()).toBe('LinkedIn');
  });

  it('does not render a location/availability badge (no real data, design-system.md secao 10)', () => {
    expect(fixture.debugElement.query(By.css('.hero__location'))).toBeNull();
    expect(fixture.debugElement.query(By.css('.hero__hire'))).toBeNull();
  });
});
