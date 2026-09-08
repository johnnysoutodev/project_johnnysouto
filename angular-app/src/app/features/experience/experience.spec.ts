import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Experience } from './experience';

describe('Experience', () => {
  let component: Experience;
  let fixture: ComponentFixture<Experience>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Experience],
    }).compileComponents();

    fixture = TestBed.createComponent(Experience);
    component = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('renders the "Experiência profissional" tag', () => {
    const tag = fixture.debugElement.query(By.css('app-tag'));
    expect(tag.nativeElement.textContent.trim()).toBe('Experiência profissional');
  });

  it('renders the 7 real companies from the legacy resume, in chronological (most recent first) order', () => {
    expect(component['items'].map((item) => item.company)).toEqual([
      'Totvs',
      'Santander',
      'Capgemini',
      'Vivo',
      'Telefônica Educação Digital',
      'RCS Sistemas',
      'Nielsen',
    ]);
  });

  it('renders Vivo as a single card with 2 stacked positions (SOC and OSS), not 2 separate cards', () => {
    const cards = fixture.debugElement.queryAll(By.css('.experience__item'));
    expect(cards.length).toBe(7);

    const vivo = component['items'].find((item) => item.company === 'Vivo')!;
    expect(vivo.positions.map((position) => position.role)).toEqual([
      'Analista de Suporte de Sistemas (SOC)',
      'Analista Suporte de Sistemas (OSS)',
    ]);

    const vivoIndex = component['items'].indexOf(vivo);
    const vivoCard = cards[vivoIndex];
    expect(vivoCard.queryAll(By.css('.experience__logo')).length).toBe(1);
    expect(vivoCard.queryAll(By.css('.experience__position')).length).toBe(2);
  });

  it('renders every bullet declared in the component (no activity dropped/duplicated)', () => {
    const expectedBulletCount = component['items'].reduce(
      (total, item) =>
        total + item.positions.reduce((sum, position) => sum + position.bullets.length, 0),
      0,
    );
    const renderedBullets = fixture.debugElement.queryAll(By.css('.experience__bullets li'));

    expect(renderedBullets.length).toBe(expectedBulletCount);
  });

  it('renders the real period next to each role, including both Vivo periods in the same card', () => {
    const periods = fixture.debugElement
      .queryAll(By.css('.experience__period'))
      .map((el) => el.nativeElement.textContent.trim());

    expect(periods).toEqual([
      'Março de 2026 | Atual',
      'Junho de 2024 | Janeiro de 2026',
      'Julho de 2021 | Janeiro de 2024',
      'Agosto de 2019 | Maio de 2021',
      'Agosto de 2017 | Agosto de 2019',
      'Agosto de 2015 | Julho de 2017',
      'Maio de 2015 | Julho de 2015',
      'Janeiro de 2006 | Setembro de 2013',
    ]);
  });

  it('renders a real logo <img> for companies that have one, and falls back to text for RCS (no logo available)', () => {
    const totvsItem = fixture.debugElement.queryAll(By.css('.experience__item'))[0];
    const totvsLogo = totvsItem.query(By.css('.experience__logo'));
    expect(totvsLogo.nativeElement.getAttribute('alt')).toBe('Totvs');
    expect(
      totvsLogo.nativeElement.getAttribute('ng-src') ?? totvsLogo.nativeElement.src,
    ).toContain('logo_totvs.jpg');

    const rcsIndex = component['items'].findIndex((item) => item.company === 'RCS Sistemas');
    const rcsItem = fixture.debugElement.queryAll(By.css('.experience__item'))[rcsIndex];
    expect(rcsItem.query(By.css('.experience__logo'))).toBeNull();
    expect(rcsItem.query(By.css('.experience__company')).nativeElement.textContent.trim()).toBe(
      'RCS Sistemas',
    );
  });
});
