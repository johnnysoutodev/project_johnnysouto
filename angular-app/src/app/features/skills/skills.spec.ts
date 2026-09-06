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

  it('renders the 5 real skill categories from the legacy resume, in order', () => {
    const titles = fixture.debugElement
      .queryAll(By.css('.skills__group-title'))
      .map((el) => el.nativeElement.textContent.trim());

    expect(titles).toEqual([
      'Back-End',
      'Banco de Dados',
      'Front-End',
      'Versionamento',
      'Pessoais',
    ]);
  });

  it('renders every skill item declared in the component (no item dropped/duplicated)', () => {
    const expectedItemCount = component['groups'].reduce(
      (total, group) => total + group.items.length,
      0,
    );
    const renderedItems = fixture.debugElement.queryAll(By.css('.skills__item'));

    expect(renderedItems.length).toBe(expectedItemCount);
  });

  it('renders an icon for exactly the 3 skills with a real Figma match (JS, Node.js, Git)', () => {
    const icons = fixture.debugElement.queryAll(By.css('.skills__item-icon img'));
    expect(icons.length).toBe(3);

    const srcAttrs = icons.map((icon) => icon.nativeElement.getAttribute('src') as string).sort();
    expect(srcAttrs).toEqual(
      [
        '/assets/icons/icon-git.svg',
        '/assets/icons/icon-javascript.svg',
        '/assets/icons/icon-nodejs.svg',
      ].sort(),
    );
  });

  it('renders the remaining skills as text-only, with an empty (but present) icon slot for alignment', () => {
    const items = fixture.debugElement.queryAll(By.css('.skills__item'));
    const textOnlyItems = items.filter(
      (item) => item.query(By.css('img')) === null,
    );

    // 20 itens no total (5 Back-End + 3 Banco de Dados + 7 Front-End + 1 Versionamento +
    // 4 Pessoais, design-system.md secao 10) - 3 com icone = 17 texto-only.
    expect(textOnlyItems.length).toBe(17);

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
