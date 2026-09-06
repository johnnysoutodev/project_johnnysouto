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

  it('renders the "Experience" tag', () => {
    const tag = fixture.debugElement.query(By.css('app-tag'));
    expect(tag.nativeElement.textContent.trim()).toBe('Experience');
  });

  it('renders the 6 real experience entries from the legacy resume, in chronological (most recent first) order', () => {
    const companies = fixture.debugElement
      .queryAll(By.css('.experience__company'))
      .map((el) => el.nativeElement.textContent.trim());
    const roles = fixture.debugElement
      .queryAll(By.css('.experience__role'))
      .map((el) => el.nativeElement.textContent.trim());

    expect(companies).toEqual([
      'Coca-Cola FEMSA (via Capgemini)',
      'Telefônica Brasil',
      'Telefônica Brasil',
      'Telefônica Educação Digital',
      'RCS Sistemas',
      'Nielsen do Brasil',
    ]);
    expect(roles).toEqual([
      'Consultor',
      'Analista Suporte de Sistemas (SOC)',
      'Analista Suporte de Sistemas (OSS)',
      'Programador',
      'Desenvolvedor de Sistemas Trainee',
      'Operador de Computador',
    ]);
  });

  it('renders Telefônica Brasil as 2 separate items (SOC and OSS), not merged', () => {
    const telefonicaItems = component['items'].filter(
      (item) => item.company === 'Telefônica Brasil',
    );
    expect(telefonicaItems.length).toBe(2);
    expect(telefonicaItems.map((item) => item.role)).toEqual([
      'Analista Suporte de Sistemas (SOC)',
      'Analista Suporte de Sistemas (OSS)',
    ]);
  });

  it('renders every bullet declared in the component (no activity dropped/duplicated)', () => {
    const expectedBulletCount = component['items'].reduce(
      (total, item) => total + item.bullets.length,
      0,
    );
    const renderedBullets = fixture.debugElement.queryAll(By.css('.experience__bullets li'));

    expect(renderedBullets.length).toBe(expectedBulletCount);
  });

  it('renders the real period for each item', () => {
    const periods = fixture.debugElement
      .queryAll(By.css('.experience__period'))
      .map((el) => el.nativeElement.textContent.trim());

    expect(periods).toEqual([
      'Julho de 2021 | Atual',
      'Agosto de 2019 | Maio de 2021',
      'Agosto de 2017 | Agosto de 2019',
      'Agosto de 2015 | Julho de 2017',
      'Maio de 2015 | Julho de 2015',
      'Janeiro de 2006 | Setembro de 2013',
    ]);
  });

  it('renders companies as plain text, not as an <img> logo (design-system.md secao 10)', () => {
    expect(fixture.debugElement.query(By.css('.experience__item img'))).toBeNull();
  });
});
