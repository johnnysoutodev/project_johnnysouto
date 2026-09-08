import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Work } from './work';

describe('Work', () => {
  let component: Work;
  let fixture: ComponentFixture<Work>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Work],
    }).compileComponents();

    fixture = TestBed.createComponent(Work);
    component = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('sets the "work" id on the host element for the #work anchor from the Header nav', () => {
    expect(fixture.nativeElement.id).toBe('work');
  });

  it('renders the "Projetos" tag', () => {
    const tag = fixture.debugElement.query(By.css('app-tag'));
    expect(tag.nativeElement.textContent.trim()).toBe('Projetos');
  });

  it('renders exactly the 2 real projects (Pitcher, ProFuturo), not the 3 fictitious Figma cards', () => {
    const titles = fixture.debugElement
      .queryAll(By.css('.work__title'))
      .map((el) => el.nativeElement.textContent.trim());

    expect(titles).toEqual(['Pitcher', 'ProFuturo']);
  });

  it('renders the real period for each project', () => {
    const periods = fixture.debugElement
      .queryAll(By.css('.work__period'))
      .map((el) => el.nativeElement.textContent.trim());

    expect(periods).toEqual([
      'Julho de 2021 | Projeto em desenvolvimento',
      'Agosto de 2015 | Dezembro de 2016',
    ]);
  });

  it('renders the technology tags extracted from each real project description, without inventing any', () => {
    const cards = fixture.debugElement.queryAll(By.css('.work__card'));

    const pitcherTags = cards[0]
      .queryAll(By.css('.work__tags app-tag'))
      .map((el) => el.nativeElement.textContent.trim());
    expect(pitcherTags).toEqual(['MS-SQL Server', 'SAP', 'Salesforce']);

    const profuturoTags = cards[1]
      .queryAll(By.css('.work__tags app-tag'))
      .map((el) => el.nativeElement.textContent.trim());
    expect(profuturoTags).toEqual([
      'HTML5',
      'CSS3',
      'JavaScript',
      'jQuery',
      'PIXI.js',
      'Grunt',
      'GitLab',
    ]);
  });

  it('omits the action on the Pitcher card (no real public link available) and shows it on ProFuturo (real link from the legacy resume)', () => {
    const cards = fixture.debugElement.queryAll(By.css('.work__card'));

    expect(cards[0].query(By.css('.work__actions'))).toBeNull();

    const profuturoAction = cards[1].query(By.css('.work__actions app-icon-button a'));
    expect(profuturoAction.nativeElement.getAttribute('href')).toBe(
      'https://fundacaotelefonicavivo.org.br/profuturo/',
    );
  });

  it('renders a neutral placeholder image block (no <img> thumbnail), no public materials for internal corporate projects', () => {
    expect(fixture.debugElement.query(By.css('.work__image img'))).toBeNull();
    expect(fixture.debugElement.queryAll(By.css('.work__image')).length).toBe(2);
  });
});
