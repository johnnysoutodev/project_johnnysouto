import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Project } from './project';

describe('Project', () => {
  let component: Project;
  let fixture: ComponentFixture<Project>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Project],
    }).compileComponents();

    fixture = TestBed.createComponent(Project);
    component = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('sets the "project" id on the host element for the #project anchor from the Header nav', () => {
    expect(fixture.nativeElement.id).toBe('project');
  });

  it('renders the "Projetos" tag', () => {
    const tag = fixture.debugElement.query(By.css('app-tag'));
    expect(tag.nativeElement.textContent.trim()).toBe('Projetos');
  });

  it('renders exactly the 2 real projects (Pitcher, ProFuturo), not the 3 fictitious Figma cards', () => {
    const titles = fixture.debugElement
      .queryAll(By.css('.project__title'))
      .map((el) => el.nativeElement.textContent.trim());

    expect(titles).toEqual(['Pitcher App', 'ProFuturo']);
  });

  it('renders the real period for each project', () => {
    const periods = fixture.debugElement
      .queryAll(By.css('.project__period'))
      .map((el) => el.nativeElement.textContent.trim());

    expect(periods).toEqual([
      'Julho de 2021 | Outubro de 2023',
      'Agosto de 2015 | Dezembro de 2016',
    ]);
  });

  it('renders the technology tags extracted from each real project description, without inventing any', () => {
    const cards = fixture.debugElement.queryAll(By.css('.project__card'));

    const pitcherTags = cards[0]
      .queryAll(By.css('.project__tags app-tag'))
      .map((el) => el.nativeElement.textContent.trim());
    expect(pitcherTags).toEqual(['Salesforce', 'Azure', 'MS-SQL Server', 'SAP', 'Google Sheets']);

    const profuturoTags = cards[1]
      .queryAll(By.css('.project__tags app-tag'))
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
    const cards = fixture.debugElement.queryAll(By.css('.project__card'));

    expect(cards[0].query(By.css('.project__actions'))).toBeNull();

    const profuturoAction = cards[1].query(By.css('.project__actions app-icon-button a'));
    expect(profuturoAction.nativeElement.getAttribute('href')).toBe(
      'https://fundacaotelefonicavivo.org.br/profuturo/',
    );
  });

  it('renders each project logo inside the image block', () => {
    const cards = fixture.debugElement.queryAll(By.css('.project__card'));
    expect(cards.length).toBe(2);

    const pitcherLogo = cards[0].query(By.css('.project__image img'));
    expect(
      pitcherLogo.nativeElement.getAttribute('ng-src') ?? pitcherLogo.nativeElement.src,
    ).toContain('logo_pitcher_black.png');
    expect(pitcherLogo.nativeElement.getAttribute('alt')).toBe('Logo do projeto Pitcher App');

    const profuturoLogo = cards[1].query(By.css('.project__image img'));
    expect(
      profuturoLogo.nativeElement.getAttribute('ng-src') ?? profuturoLogo.nativeElement.src,
    ).toContain('logo_project_profuturo.png');
    expect(profuturoLogo.nativeElement.getAttribute('alt')).toBe('Logo do projeto ProFuturo');
  });
});
