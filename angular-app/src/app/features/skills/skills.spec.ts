import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Skills } from './skills';

describe('Skills', () => {
  let component: Skills;
  let fixture: ComponentFixture<Skills>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Skills],
    }).compileComponents();

    fixture = TestBed.createComponent(Skills);
    component = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('renders a flat grid with no category title (matches the Figma grid, secao 8.10 - revisao 07/09/2026)', () => {
    const titles = fixture.debugElement.queryAll(By.css('.skills__group-title'));
    expect(titles.length).toBe(0);
  });

  it('renders every skill item declared in the component (no item dropped/duplicated)', () => {
    const expectedItemCount = component['items'].length;
    const renderedItems = fixture.debugElement.queryAll(By.css('.skills__item'));

    expect(renderedItems.length).toBe(expectedItemCount);
  });

  it('renders an icon for every skill in the current list (Figma-native + Devicon, design-system.md secao 10)', () => {
    const icons = fixture.debugElement.queryAll(By.css('.skills__item-icon img'));
    const items = fixture.debugElement.queryAll(By.css('.skills__item'));

    // Revisao de 07/09/2026: a lista atual (19 skills, ordem embaralhada por categoria -
    // ver skills.ts) so tem itens com match de icone real (3 nativos do Figma +
    // icon-sass, tambem do Figma + 15 do Devicon) - nenhum item texto-only, diferente da
    // lista anterior (que incluia Servlet/JSP, OOP, RWD e soft skills sem icone
    // disponivel).
    expect(icons.length).toBe(items.length);

    const srcAttrs = icons.map((icon) => icon.nativeElement.getAttribute('src') as string).sort();
    expect(srcAttrs).toEqual(
      [
        '/assets/icons/icon-angularjs.svg',
        '/assets/icons/icon-aws.svg',
        '/assets/icons/icon-azure.svg',
        '/assets/icons/icon-css3.svg',
        '/assets/icons/icon-dynamodb.svg',
        '/assets/icons/icon-git.svg',
        '/assets/icons/icon-github.svg',
        '/assets/icons/icon-grunt.svg',
        '/assets/icons/icon-html5.svg',
        '/assets/icons/icon-java.svg',
        '/assets/icons/icon-javascript.svg',
        '/assets/icons/icon-mongodb.svg',
        '/assets/icons/icon-mysql.svg',
        '/assets/icons/icon-nodejs.svg',
        '/assets/icons/icon-postgresql.svg',
        '/assets/icons/icon-sass.svg',
        '/assets/icons/icon-spring.svg',
        '/assets/icons/icon-typescript.svg',
        '/assets/icons/icon-vscode.svg',
      ].sort(),
    );
  });

  it('inverts the near-black GitHub icon in dark mode (WCAG AA contrast, ver skills.ts/skills.scss)', () => {
    const githubImg = fixture.debugElement
      .queryAll(By.css('.skills__item-icon img'))
      .find((img) => (img.nativeElement.getAttribute('src') as string).includes('icon-github'));

    expect(githubImg).toBeDefined();
    expect(
      githubImg!.nativeElement.classList.contains('skills__item-icon-img--invert-dark'),
    ).toBe(true);
  });

  it('renders the "Skills" tag', () => {
    const tag = fixture.debugElement.query(By.css('app-tag'));
    expect(tag.nativeElement.textContent.trim()).toBe('Skills');
  });
});
