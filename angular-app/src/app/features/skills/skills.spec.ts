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

  it('renders an icon for every skill with a real match (Figma-native + Devicon, design-system.md secao 10)', () => {
    const icons = fixture.debugElement.queryAll(By.css('.skills__item-icon img'));
    expect(icons.length).toBe(13);

    const srcAttrs = icons.map((icon) => icon.nativeElement.getAttribute('src') as string).sort();
    expect(srcAttrs).toEqual(
      [
        '/assets/icons/icon-css3.svg',
        '/assets/icons/icon-git.svg',
        '/assets/icons/icon-grunt.svg',
        '/assets/icons/icon-html5.svg',
        '/assets/icons/icon-java.svg',
        '/assets/icons/icon-javascript.svg',
        '/assets/icons/icon-jquery.svg',
        '/assets/icons/icon-mysql.svg',
        '/assets/icons/icon-nodejs.svg',
        '/assets/icons/icon-oracle.svg',
        '/assets/icons/icon-sass.svg',
        '/assets/icons/icon-spring.svg',
        '/assets/icons/icon-sqlserver.svg',
      ].sort(),
    );
  });

  it('renders the remaining skills as text-only, with an empty (but present) icon slot for alignment', () => {
    const items = fixture.debugElement.queryAll(By.css('.skills__item'));
    const textOnlyItems = items.filter(
      (item) => item.query(By.css('img')) === null,
    );

    // 20 itens no total (5 Back-End + 3 Banco de Dados + 7 Front-End + 1 Versionamento +
    // 4 Pessoais, design-system.md secao 10) - 13 com icone (3 nativos do Figma + 9 do
    // Devicon + Sass/Scss ja extraido do Figma, revisao de 07/09/2026) = 7 texto-only
    // (Servlet/JSP, OOP, RWD, 4 itens de Pessoais - nenhuma marca/tecnologia com logo).
    expect(textOnlyItems.length).toBe(7);

    for (const item of textOnlyItems) {
      expect(item.query(By.css('.skills__item-icon'))).not.toBeNull();
      expect(item.query(By.css('.skills__item-label'))).not.toBeNull();
    }
  });

  it('renders the "Skills" tag', () => {
    const tag = fixture.debugElement.query(By.css('app-tag'));
    expect(tag.nativeElement.textContent.trim()).toBe('Skills');
  });
});
